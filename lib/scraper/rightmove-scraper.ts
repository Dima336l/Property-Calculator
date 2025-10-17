import puppeteer, { Browser } from 'puppeteer'
import { rateLimiter } from './rate-limiter'

export interface Property {
  id: string
  address: string
  price: number
  bedrooms: number
  bathrooms: number
  propertyType: string
  description: string
  imageUrl: string
  postcode: string
  url: string
  listedDate: string
  flags: string[]
  yield?: number
  priceReduction?: number
}

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--disable-gpu',
        '--window-size=1920,1080',
        '--disable-blink-features=AutomationControlled',
      ],
    })
  }
  return browser
}

export async function closeBrowser() {
  if (browser) {
    await browser.close()
    browser = null
  }
}

export async function scrapeRightmove(params: {
  location: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
  maxBedrooms?: number
  propertyType?: string
  radius?: number
}): Promise<Property[]> {
  console.log('🔍 SCRAPER VERSION: v3.0 - WITH DEDUPLICATION')
  return rateLimiter.execute(async () => {
    const browser = await getBrowser()
    const page = await browser.newPage()
    
    // Forward console messages from the browser to Node.js console
    page.on('console', (msg) => {
      const type = msg.type()
      const text = msg.text()
      if (type === 'log') {
        console.log(`[Browser]: ${text}`)
      } else if (type === 'error') {
        console.error(`[Browser Error]: ${text}`)
      }
    })
    
    try {
      // Set a realistic user agent and hide automation
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )
      
      // Hide webdriver
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        })
      })

      // Build Rightmove URL
      const locationParam = params.location.replace(/\s+/g, '-')
      const searchParams = new URLSearchParams()
      
      if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString())
      if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString())
      if (params.minBedrooms) searchParams.set('minBedrooms', params.minBedrooms.toString())
      if (params.maxBedrooms) searchParams.set('maxBedrooms', params.maxBedrooms.toString())
      if (params.radius) searchParams.set('radius', params.radius.toString())
      
      const url = `https://www.rightmove.co.uk/property-for-sale/find.html?locationIdentifier=REGION%5E${locationParam}&${searchParams.toString()}`
      
      console.log(`Scraping: ${url}`)
      
      await page.goto(url, { 
        waitUntil: 'networkidle0',
        timeout: 60000 
      })

      // Scroll to trigger lazy loading of images
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight / 2)
      })
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      await page.evaluate(() => {
        window.scrollTo(0, document.body.scrollHeight)
      })
      
      // Wait for images to load
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Try multiple possible selectors
      try {
        await page.waitForSelector('[data-test="property-card"], .propertyCard, .l-searchResult, [class*="propertyCard"]', { 
          timeout: 15000 
        })
      } catch (e) {
        console.log('Could not find standard selectors, trying to extract any properties...')
      }
      
      // Take screenshot for debugging
      console.log('Taking screenshot...')
      try {
        await page.screenshot({ path: 'rightmove-debug.png', fullPage: false })
        console.log('Screenshot saved to rightmove-debug.png')
      } catch (err) {
        console.error('Failed to take screenshot:', err)
      }

      // Extract property data with multiple selector strategies
      const properties = await page.evaluate(() => {
        const results: any[] = []
        
        // Try multiple selector strategies - be specific to avoid picking up ads/banners
        let propertyCards = document.querySelectorAll('[data-test="property-card"]')
        if (propertyCards.length === 0) {
          propertyCards = document.querySelectorAll('.propertyCard')
        }
        if (propertyCards.length === 0) {
          propertyCards = document.querySelectorAll('.l-searchResult')
        }
        if (propertyCards.length === 0) {
          propertyCards = document.querySelectorAll('[class*="propertyCard"]')
        }
        if (propertyCards.length === 0) {
          // Only get articles that contain property links
          const allArticles = document.querySelectorAll('article')
          propertyCards = Array.from(allArticles).filter(article => 
            article.querySelector('a[href*="/properties/"]') || 
            article.querySelector('a[href*="property"]')
          )
        }

        console.log(`Found ${propertyCards.length} property cards`)
        
        // Debug: Check what image attributes are available
        if (propertyCards.length > 0) {
          const firstImg = propertyCards[0].querySelector('img')
          if (firstImg) {
            console.log('First image attributes:', {
              src: firstImg.getAttribute('src')?.substring(0, 50),
              dataSrc: firstImg.getAttribute('data-src')?.substring(0, 50),
              srcset: firstImg.getAttribute('srcset')?.substring(0, 100),
              loading: firstImg.getAttribute('loading'),
            })
          }
        }

        propertyCards.forEach((card, index) => {
          try {
            // Extract address - try multiple selectors
            let address = ''
            const addressSelectors = [
              '[data-test="property-title"]',
              '.propertyCard-address',
              '.propertyCard-titleLink',
              'address',
              '[class*="address"]'
            ]
            for (const selector of addressSelectors) {
              const el = card.querySelector(selector)
              if (el?.textContent?.trim()) {
                address = el.textContent.trim()
                break
              }
            }

            // Extract price - try multiple selectors
            let price = 0
            const priceSelectors = [
              '[data-test="property-price"]',
              '.propertyCard-priceValue',
              '.propertyCard-price',
              '[class*="price"]'
            ]
            for (const selector of priceSelectors) {
              const el = card.querySelector(selector)
              if (el?.textContent) {
                const priceText = el.textContent.trim()
                price = parseInt(priceText.replace(/[£,]/g, '')) || 0
                if (price > 0) break
              }
            }

            // Extract bedrooms/bathrooms
            const detailsText = card.textContent || ''
            const bedroomsMatch = detailsText.match(/(\d+)\s*bed/i)
            const bathroomsMatch = detailsText.match(/(\d+)\s*bath/i)
            
            const bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[1]) : 0
            const bathrooms = bathroomsMatch ? parseInt(bathroomsMatch[1]) : 0

            // Extract property type
            let propertyType = 'Property'
            const typeMatch = detailsText.match(/(house|flat|apartment|bungalow|detached|semi-detached|terraced)/i)
            if (typeMatch) {
              propertyType = typeMatch[1]
            }

            // Extract image - try to find the actual property photo, not icons
            let imageUrl = ''
            
            // First try to find img with specific property photo classes/attributes
            const imageSelectors = [
              'img[src*="media.rightmove.co.uk/"][src*=".jpg"]',
              'img[src*="media.rightmove.co.uk/"][src*=".jpeg"]',
              'img[src*="media.rightmove.co.uk/"][src*=".png"]',
              'img[data-src*=".jpg"]',
              'img[data-src*=".jpeg"]',
              'img[srcset*=".jpg"]',
              'img[alt*="property"]',
              'img[alt*="bedroom"]',
              'picture img',
              '.propertyCard-img img',
              'img'  // fallback
            ]
            
            let imageEl = null
            for (const selector of imageSelectors) {
              imageEl = card.querySelector(selector)
              if (imageEl) break
            }
            
            if (imageEl) {
              // Try various image attributes
              const srcset = imageEl.getAttribute('srcset')
              const dataSrc = imageEl.getAttribute('data-src')
              const dataLazySrc = imageEl.getAttribute('data-lazy-src')
              const dataOriginal = imageEl.getAttribute('data-original')
              const src = imageEl.src
              
              // Prefer srcset first (highest quality), then data-src, then src
              if (srcset && srcset.includes('http')) {
                // Extract the first URL from srcset
                const srcsetMatch = srcset.match(/(https?:\/\/[^\s,]+)/)
                imageUrl = srcsetMatch ? srcsetMatch[1] : ''
              } else if (dataSrc && !dataSrc.startsWith('data:')) {
                imageUrl = dataSrc
              } else if (dataLazySrc && !dataLazySrc.startsWith('data:')) {
                imageUrl = dataLazySrc
              } else if (dataOriginal && !dataOriginal.startsWith('data:')) {
                imageUrl = dataOriginal
              } else if (src && !src.startsWith('data:')) {
                imageUrl = src
              }
              
              // Clean up relative URLs
              if (imageUrl) {
                if (imageUrl.startsWith('//')) {
                  imageUrl = 'https:' + imageUrl
                } else if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
                  imageUrl = 'https://www.rightmove.co.uk' + imageUrl
                }
                
                // Filter out unwanted images (SVG icons, placeholders, etc.)
                const isUnwantedImage = 
                  imageUrl.endsWith('.svg') ||
                  imageUrl.includes('floorplan') ||
                  imageUrl.includes('placeholder') ||
                  imageUrl.includes('icon') ||
                  imageUrl.includes('logo') ||
                  imageUrl.includes('/_next/static/')
                
                if (isUnwantedImage) {
                  imageUrl = ''
                }
              }
            }

            // Extract URL
            const linkEl = card.querySelector('a[href*="property"]')
            const relativeUrl = linkEl?.getAttribute('href') || ''
            const url = relativeUrl.startsWith('http') ? relativeUrl : `https://www.rightmove.co.uk${relativeUrl}`

            // Extract ID from URL
            const idMatch = url.match(/property[/-](\d+)/)
            const id = idMatch ? idMatch[1] : `property-${index}`

            // Check for reduced price
            const reducedText = detailsText.toLowerCase()
            let priceReduction = undefined
            const reductionMatch = reducedText.match(/reduced by £([\d,]+)/)
            if (reductionMatch) {
              priceReduction = parseInt(reductionMatch[1].replace(/,/g, ''))
            }

            // Detect flags
            const flags: string[] = []
            if (priceReduction) flags.push('Reduced in Price')
            if (reducedText.includes('modernisation') || reducedText.includes('refurbishment') || 
                reducedText.includes('in need of')) {
              flags.push('Needs Modernisation')
            }

            if (address && price > 0) {
              results.push({
                id,
                address,
                price,
                bedrooms,
                bathrooms,
                propertyType,
                description: propertyType,
                imageUrl,
                postcode: address.split(',').pop()?.trim() || '',
                url,
                listedDate: new Date().toISOString().split('T')[0],
                flags,
                priceReduction,
              })
              
              // Debug: Log first few properties with image info
              if (results.length <= 3) {
                console.log(`Property ${results.length}: ${address.substring(0, 30)}... - Image: ${imageUrl ? 'YES' : 'NO'} (${imageUrl?.substring(0, 50) || 'empty'})`)
              }
            }
          } catch (err) {
            console.error('Error parsing property card:', err)
          }
        })

        return results
      })

      console.log(`✅ Scraped ${properties.length} properties from Rightmove (before dedup)`)
      
      // Deduplicate properties by address (more reliable than ID)
      const uniqueProperties = Array.from(
        new Map(properties.map(p => [p.address.toLowerCase().trim(), p])).values()
      )
      
      console.log(`📋 After deduplication: ${uniqueProperties.length} unique properties (removed ${properties.length - uniqueProperties.length} duplicates)`)
      console.log('🖼️  DEBUG: Checking images...')
      
      // Debug: Log image info for first 3 properties
      if (uniqueProperties.length > 0) {
        console.log(`First property: ${uniqueProperties[0].address}`)
        console.log(`First property imageUrl: "${uniqueProperties[0].imageUrl || 'EMPTY'}"`)
        console.log(`Has image: ${!!uniqueProperties[0].imageUrl}`)
      }
      
      const withImages = uniqueProperties.filter(p => p.imageUrl && p.imageUrl.length > 0).length
      const withoutImages = uniqueProperties.length - withImages
      console.log(`Images: ${withImages} properties WITH images, ${withoutImages} WITHOUT images`)
      
      return uniqueProperties.map(p => ({
        ...p,
        yield: calculateEstimatedYield(p.price, p.bedrooms),
      }))

    } catch (error) {
      console.error('Error scraping Rightmove:', error)
      return []
    } finally {
      await page.close()
    }
  })
}

// Scrape Zoopla (alternative)
export async function scrapeZoopla(params: {
  location: string
  minPrice?: number
  maxPrice?: number
  minBedrooms?: number
}): Promise<Property[]> {
  return rateLimiter.execute(async () => {
    const browser = await getBrowser()
    const page = await browser.newPage()
    
    try {
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )

      const searchParams = new URLSearchParams({
        q: params.location,
        search_source: 'for-sale',
      })
      
      if (params.minPrice) searchParams.set('price_min', params.minPrice.toString())
      if (params.maxPrice) searchParams.set('price_max', params.maxPrice.toString())
      if (params.minBedrooms) searchParams.set('beds_min', params.minBedrooms.toString())

      const url = `https://www.zoopla.co.uk/for-sale/property/?${searchParams.toString()}`
      
      console.log(`Scraping Zoopla: ${url}`)
      
      await page.goto(url, { 
        waitUntil: 'networkidle2',
        timeout: 30000 
      })

      await page.waitForSelector('[data-testid="search-result"]', { timeout: 10000 })

      const properties = await page.evaluate(() => {
        const results: any[] = []
        const cards = document.querySelectorAll('[data-testid="search-result"]')

        cards.forEach((card, index) => {
          try {
            const address = card.querySelector('[data-testid="listing-title"]')?.textContent?.trim() || ''
            const priceText = card.querySelector('[data-testid="listing-price"]')?.textContent?.trim() || '0'
            const price = parseInt(priceText.replace(/[£,]/g, '')) || 0

            const details = card.querySelector('[data-testid="listing-details"]')?.textContent || ''
            const bedroomsMatch = details.match(/(\d+)\s*bed/i)
            const bathroomsMatch = details.match(/(\d+)\s*bath/i)
            
            const bedrooms = bedroomsMatch ? parseInt(bedroomsMatch[1]) : 0
            const bathrooms = bathroomsMatch ? parseInt(bathroomsMatch[1]) : 0

            const imageUrl = card.querySelector('img')?.src || ''
            const linkEl = card.querySelector('a')
            const url = linkEl?.href || ''
            const id = `zoopla-${index}`

            if (address && price > 0) {
              results.push({
                id,
                address,
                price,
                bedrooms,
                bathrooms,
                propertyType: 'Property',
                description: details,
                imageUrl,
                postcode: address.split(',').pop()?.trim() || '',
                url,
                listedDate: new Date().toISOString().split('T')[0],
                flags: [],
              })
            }
          } catch (err) {
            console.error('Error parsing Zoopla card:', err)
          }
        })

        return results
      })

      console.log(`Scraped ${properties.length} properties from Zoopla`)
      
      return properties.map(p => ({
        ...p,
        yield: calculateEstimatedYield(p.price, p.bedrooms),
      }))

    } catch (error) {
      console.error('Error scraping Zoopla:', error)
      return []
    } finally {
      await page.close()
    }
  })
}

// Helper function to calculate estimated yield
function calculateEstimatedYield(price: number, bedrooms: number): number {
  // Rough estimates of monthly rent by bedroom count in UK
  const avgMonthlyRent: { [key: number]: number } = {
    0: 500,
    1: 700,
    2: 900,
    3: 1100,
    4: 1400,
    5: 1700,
  }
  
  const rent = avgMonthlyRent[bedrooms] || 1000
  const annualRent = rent * 12
  
  return ((annualRent / price) * 100)
}

