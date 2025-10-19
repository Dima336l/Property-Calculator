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
  images?: string[] // Array of image URLs
  postcode: string
  url: string
  listedDate: string
  flags: string[]
  yield?: number
  priceReduction?: number
  // Enhanced fields for calculator
  squareFeet?: number
  tenure?: string // Freehold/Leasehold
  councilTaxBand?: string
  epcRating?: string
  hasGarden?: boolean
  hasParking?: boolean
  furnishing?: string // Furnished/Unfurnished
  lettingStatus?: string // Tenanted/Vacant
  floorArea?: number
  receptionRooms?: number
  keyFeatures?: string[]
}

let browser: Browser | null = null

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
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
  maxPages?: number // How many pages to scrape (default 3)
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

      // Scrape multiple pages
      const maxPages = params.maxPages || 3 // Default to 3 pages
      const allProperties: any[] = []
      
      for (let pageIndex = 0; pageIndex < maxPages; pageIndex++) {
        try {
          // Build Rightmove URL for this page
          const locationParam = params.location.replace(/\s+/g, '-')
          const searchParams = new URLSearchParams()
          
          searchParams.set('locationIdentifier', `REGION^${locationParam}`)
          
          if (params.minPrice) searchParams.set('minPrice', params.minPrice.toString())
          if (params.maxPrice) searchParams.set('maxPrice', params.maxPrice.toString())
          if (params.minBedrooms) searchParams.set('minBedrooms', params.minBedrooms.toString())
          if (params.maxBedrooms) searchParams.set('maxBedrooms', params.maxBedrooms.toString())
          if (params.radius) searchParams.set('radius', params.radius.toString())
          
          // Add page index (Rightmove uses index parameter for pagination)
          if (pageIndex > 0) {
            searchParams.set('index', (pageIndex * 24).toString()) // Rightmove shows 24 per page
          }
          
          const url = `https://www.rightmove.co.uk/property-for-sale/find.html?${searchParams.toString()}`
          
          console.log(`📄 Scraping page ${pageIndex + 1}/${maxPages}: ${params.location}`)
          console.log(`🔗 URL: ${url}`)
          
          await page.goto(url, { 
            waitUntil: 'networkidle0',
            timeout: 60000 
          })
          
          // Wait a moment for page to settle
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          // Scroll to trigger lazy loading of images
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight / 2)
          })
          await new Promise(resolve => setTimeout(resolve, 1000))
          
          await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight)
          })
          
          // Wait for images to load
          await new Promise(resolve => setTimeout(resolve, 2000))

          // Try multiple possible selectors
          try {
            await page.waitForSelector('[data-test="property-card"], .propertyCard, .l-searchResult, [class*="propertyCard"]', { 
              timeout: 15000 
            })
          } catch (e) {
            console.log(`Page ${pageIndex + 1}: Could not find standard selectors, trying to extract any properties...`)
          }

          // Extract property data with multiple selector strategies
          const properties = await page.evaluate((pageNum: number) => {
            console.log(`Extracting properties from page ${pageNum}...`)
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
          const filteredArticles = Array.from(allArticles).filter(article => 
            article.querySelector('a[href*="/properties/"]') || 
            article.querySelector('a[href*="property"]')
          )
          propertyCards = filteredArticles as any as NodeListOf<Element>
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
              const src = (imageEl as HTMLImageElement).src
              
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
          }, pageIndex + 1)

          console.log(`✅ Page ${pageIndex + 1}: Scraped ${properties.length} properties`)
          
          // Add this page's properties to the collection
          allProperties.push(...properties)
          
          // If we got no properties, stop scraping (we've reached the end)
          if (properties.length === 0) {
            console.log(`⏹️ No more properties found, stopping at page ${pageIndex + 1}`)
            break
          }
          
        } catch (pageError) {
          console.error(`Error scraping page ${pageIndex + 1}:`, pageError)
          // Continue to next page even if one fails
        }
      }
      
      console.log(`\n📊 Total scraped: ${allProperties.length} properties across ${maxPages} pages`)
      
      // Deduplicate properties by address (more reliable than ID)
      const uniqueProperties = Array.from(
        new Map(allProperties.map(p => [p.address.toLowerCase().trim(), p])).values()
      )
      
      console.log(`📋 After deduplication: ${uniqueProperties.length} unique properties (removed ${allProperties.length - uniqueProperties.length} duplicates)`)
      
      const withImages = uniqueProperties.filter(p => p.imageUrl && p.imageUrl.length > 0).length
      console.log(`🖼️  Images: ${withImages} WITH images, ${uniqueProperties.length - withImages} WITHOUT`)
      
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

// Scrape detailed property information from individual listing page
export async function scrapePropertyDetails(propertyUrl: string): Promise<Partial<Property>> {
  console.log(`🔍 Scraping detailed property info from: ${propertyUrl}`)
  
  return rateLimiter.execute(async () => {
    const browser = await getBrowser()
    const page = await browser.newPage()
    
    try {
      await page.setUserAgent(
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      )
      
      await page.evaluateOnNewDocument(() => {
        Object.defineProperty(navigator, 'webdriver', {
          get: () => false,
        })
      })
      
      await page.goto(propertyUrl, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      })
      
      // Wait a bit for page to fully load
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Monitor network requests for image URLs (disabled for now - too many UI elements)
      const imageUrls: string[] = []
      // page.on('response', (response) => {
      //   const url = response.url()
      //   if (url.includes('zoopla') && (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png') || url.includes('.webp'))) {
      //     // More strict filtering for network images
      //     const isUIElement = 
      //       url.includes('logo') || 
      //       url.includes('icon') || 
      //       url.includes('thumbnail') ||
      //       url.includes('sprite') ||
      //       url.includes('naea') ||
      //       url.includes('tpo') ||
      //       url.includes('maps.zoopla.co.uk') ||
      //       url.includes('cdn.prod.zoopla.co.uk/_next/static') ||
      //       url.includes('cloudfront.net/themes') ||
      //       url.includes('marker') ||
      //       url.includes('pin') ||
      //       url.includes('static')
      //     
      //     if (!isUIElement) {
      //       imageUrls.push(url)
      //       console.log('Found property image URL from network:', url)
      //     } else {
      //       console.log('Filtered out UI element from network:', url)
      //     }
      //   }
      // })
      
      // Try to extract property ID and make API call for images
      let apiImages: string[] = []
      try {
        const currentUrl = page.url()
        console.log('Current URL:', currentUrl)
        
        // Extract property ID from Zoopla URL
        const propertyIdMatch = currentUrl.match(/\/details\/(\d+)/)
        if (propertyIdMatch) {
          const propertyId = propertyIdMatch[1]
          console.log('Found property ID:', propertyId)
          
          // Try Zoopla API endpoints for property data
          const apiEndpoints = [
            `https://www.zoopla.co.uk/api/property/${propertyId}/`,
            `https://www.zoopla.co.uk/api/v1/property/${propertyId}/`,
            `https://www.zoopla.co.uk/api/property/${propertyId}/images/`,
            `https://www.zoopla.co.uk/api/v1/property/${propertyId}/images/`,
            `https://www.zoopla.co.uk/api/property/${propertyId}/gallery/`,
            `https://www.zoopla.co.uk/api/v1/property/${propertyId}/gallery/`
          ]
          
          for (const endpoint of apiEndpoints) {
            try {
              console.log(`Trying API endpoint: ${endpoint}`)
              const response = await page.evaluate(async (url) => {
                try {
                  const res = await fetch(url, {
                    method: 'GET',
                    headers: {
                      'Accept': 'application/json',
                      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                    }
                  })
                  if (res.ok) {
                    const data = await res.json()
                    return data
                  }
                } catch (e) {
                  return null
                }
                return null
              }, endpoint)
              
              if (response && response.images) {
                console.log('Found images via API:', response.images.length)
                apiImages = response.images.map((img: any) => img.url || img.src || img.image_url)
                break
              } else if (response && response.gallery) {
                console.log('Found gallery via API:', response.gallery.length)
                apiImages = response.gallery.map((img: any) => img.url || img.src || img.image_url)
                break
              }
            } catch (apiError) {
              console.log(`API endpoint ${endpoint} failed:`, apiError)
            }
          }
        }
      } catch (error) {
        console.log('API approach failed:', error instanceof Error ? error.message : 'Unknown error')
      }
      
      // Fallback: Try to click on the photos tab to load images
      if (apiImages.length === 0) {
        try {
          console.log('No API images found, trying DOM approach...')
          // Try multiple selectors for photos tab
          const photosSelectors = [
            '[data-testid="photos-tab"]',
            'a[href*="tab=images"]',
            'button[data-testid="photos"]',
            '[data-testid="gallery-tab"]',
            'a[href*="photos"]',
            'button[aria-label*="photos"]',
            'button[aria-label*="images"]',
            '[role="tab"][aria-label*="photos"]',
            '[role="tab"][aria-label*="images"]',
            'a[href*="gallery"]'
          ]
          
          let photosTab = null
          for (const selector of photosSelectors) {
            try {
              photosTab = await page.$(selector)
              if (photosTab) {
                console.log(`Found photos tab with selector: ${selector}`)
                break
              }
            } catch (e) {
              // Continue to next selector
            }
          }
          
          if (photosTab) {
            console.log('Clicking photos tab to load images...')
            await photosTab.click()
            await new Promise(resolve => setTimeout(resolve, 3000)) // Wait for images to load
            
            // Try to scroll to trigger lazy loading
            await page.evaluate(() => {
              window.scrollTo(0, document.body.scrollHeight / 2)
            })
            await new Promise(resolve => setTimeout(resolve, 1000))
            
            await page.evaluate(() => {
              window.scrollTo(0, document.body.scrollHeight)
            })
            await new Promise(resolve => setTimeout(resolve, 1000))
          } else {
            console.log('No photos tab found, trying to navigate to images URL directly...')
            // Try to navigate to the images tab URL
            const currentUrl = page.url()
            if (currentUrl.includes('zoopla.co.uk') && !currentUrl.includes('tab=images')) {
              const imagesUrl = currentUrl + (currentUrl.includes('?') ? '&' : '?') + 'tab=images'
              console.log('Navigating to images URL:', imagesUrl)
              await page.goto(imagesUrl, { waitUntil: 'networkidle0', timeout: 15000 })
              await new Promise(resolve => setTimeout(resolve, 2000))
              
              // Try to scroll to trigger lazy loading
              await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight / 2)
              })
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight)
              })
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
          }
        } catch (error) {
          console.log('Could not find photos tab, continuing with current page state:', error instanceof Error ? error.message : 'Unknown error')
        }
      }
      
      // Combine API and network images
      const allImages = [...apiImages, ...imageUrls]
      console.log('API images found:', apiImages.length)
      console.log('Network images found:', imageUrls.length)
      console.log('Total images from API and network:', allImages.length)
      if (allImages.length > 0) {
        console.log('Combined image URLs:', allImages.slice(0, 3))
      }
      
      const details = await page.evaluate(() => {
        const result: any = {}
        
        // Extract price (Zoopla specific)
        const priceEl = document.querySelector('[data-testid="price"]') ||
                       document.querySelector('.ui-pricing__main-price') ||
                       document.querySelector('.price') ||
                       document.querySelector('[data-test="price"]')
        if (priceEl) {
          const priceText = priceEl.textContent?.replace(/[£,]/g, '').trim()
          const price = parseInt(priceText)
          if (!isNaN(price)) {
            result.price = price
          }
        }
        
        // Extract address (Zoopla specific)
        const addressEl = document.querySelector('[data-testid="address"]') ||
                         document.querySelector('.ui-title') ||
                         document.querySelector('h1') ||
                         document.querySelector('[data-test="address"]')
        if (addressEl) {
          result.address = addressEl.textContent?.trim() || ''
        }
        
        // Extract bedrooms (Zoopla specific)
        const bedEl = document.querySelector('[data-testid="beds"]') ||
                     document.querySelector('.ui-icon--bed') ||
                     document.querySelector('[data-test="beds"]')
        if (bedEl) {
          const bedText = bedEl.textContent?.trim()
          const beds = parseInt(bedText)
          if (!isNaN(beds)) {
            result.bedrooms = beds
          }
        }
        
        // Extract bathrooms (Zoopla specific)
        const bathEl = document.querySelector('[data-testid="baths"]') ||
                      document.querySelector('.ui-icon--bath') ||
                      document.querySelector('[data-test="baths"]')
        if (bathEl) {
          const bathText = bathEl.textContent?.trim()
          const baths = parseInt(bathText)
          if (!isNaN(baths)) {
            result.bathrooms = baths
          }
        }
        
        // Extract property type
        const typeEl = document.querySelector('[data-testid="property-type"]') ||
                      document.querySelector('.ui-property-summary__type') ||
                      document.querySelector('[data-test="property-type"]')
        if (typeEl) {
          result.propertyType = typeEl.textContent?.trim() || ''
        }
        
        // Extract full description
        const descriptionEl = document.querySelector('[data-test="property-description"]') ||
                             document.querySelector('.property-description') ||
                             document.querySelector('[itemprop="description"]') ||
                             document.querySelector('.ui-property-summary__description')
        if (descriptionEl) {
          result.description = descriptionEl.textContent?.trim() || ''
        }
        
        // Extract key features
        const keyFeatures: string[] = []
        const featuresList = document.querySelectorAll('[data-test="property-features"] li, .key-features li, ul.features li')
        featuresList.forEach(li => {
          const text = li.textContent?.trim()
          if (text) keyFeatures.push(text)
        })
        result.keyFeatures = keyFeatures
        
        // Get all text content to search for details
        const pageText = document.body.textContent || ''
        const lowerText = pageText.toLowerCase()
        
        // Fallback: Extract price from text if not found above
        if (!result.price) {
          const priceMatch = pageText.match(/£([\d,]+)/)
          if (priceMatch) {
            const price = parseInt(priceMatch[1].replace(/,/g, ''))
            if (!isNaN(price)) {
              result.price = price
            }
          }
        }
        
        // Additional fallback: Look for price in various formats
        if (!result.price) {
          const pricePatterns = [
            /£([\d,]+)\s*\(/i,  // £395,000 (
            /£([\d,]+)\s*per/i,  // £395,000 per
            /£([\d,]+)\s*$/i,    // £395,000 at end of line
            /price[:\s]*£([\d,]+)/i  // price: £395,000
          ]
          
          for (const pattern of pricePatterns) {
            const match = pageText.match(pattern)
            if (match) {
              const price = parseInt(match[1].replace(/,/g, ''))
              if (!isNaN(price) && price > 10000) { // Reasonable price range
                result.price = price
                break
              }
            }
          }
        }
        
        // Fallback: Extract bedrooms from text
        if (!result.bedrooms) {
          const bedMatch = pageText.match(/(\d+)\s*bed/i)
          if (bedMatch) {
            result.bedrooms = parseInt(bedMatch[1])
          }
        }
        
        // Fallback: Extract bathrooms from text
        if (!result.bathrooms) {
          const bathMatch = pageText.match(/(\d+)\s*bath/i)
          if (bathMatch) {
            result.bathrooms = parseInt(bathMatch[1])
          }
        }
        
        // Fallback: Extract address from text if not found above
        if (!result.address) {
          // Look for address patterns in the page
          const addressPatterns = [
            /([A-Za-z0-9\s,]+(?:Street|Road|Avenue|Lane|Close|Drive|Way|Place|Square|Gardens|Park|Court|House|Flat|Apartment)[A-Za-z0-9\s,]*)/i,
            /([A-Za-z0-9\s,]+(?:London|Manchester|Birmingham|Liverpool|Leeds|Sheffield|Bristol|Newcastle|Nottingham|Leicester)[A-Za-z0-9\s,]*)/i
          ]
          
          for (const pattern of addressPatterns) {
            const match = pageText.match(pattern)
            if (match && match[1].length > 10) { // Reasonable address length
              result.address = match[1].trim()
              break
            }
          }
        }
        
        // Extract tenure (Freehold/Leasehold)
        if (lowerText.includes('freehold')) {
          result.tenure = 'Freehold'
        } else if (lowerText.includes('leasehold')) {
          result.tenure = 'Leasehold'
        } else if (lowerText.includes('share of freehold')) {
          result.tenure = 'Share of Freehold'
        }
        
        // Extract council tax band
        const councilTaxMatch = pageText.match(/council tax band\s*:?\s*([A-H])/i)
        if (councilTaxMatch) {
          result.councilTaxBand = councilTaxMatch[1].toUpperCase()
        }
        
        // Extract EPC rating
        const epcMatch = pageText.match(/EPC rating\s*:?\s*([A-G])/i) ||
                        pageText.match(/energy efficiency rating\s*:?\s*([A-G])/i)
        if (epcMatch) {
          result.epcRating = epcMatch[1].toUpperCase()
        }
        
        // Extract floor area (sq ft or sq m)
        const sqFtMatch = pageText.match(/([\d,]+)\s*sq\.?\s*ft/i)
        const sqMMatch = pageText.match(/([\d,]+)\s*sq\.?\s*m/i)
        if (sqFtMatch) {
          result.squareFeet = parseInt(sqFtMatch[1].replace(/,/g, ''))
        } else if (sqMMatch) {
          const sqM = parseInt(sqMMatch[1].replace(/,/g, ''))
          result.squareFeet = Math.round(sqM * 10.764) // Convert to sq ft
        }
        
        // Extract reception rooms
        const receptionMatch = pageText.match(/(\d+)\s*reception/i)
        if (receptionMatch) {
          result.receptionRooms = parseInt(receptionMatch[1])
        }
        
        // Check for garden
        result.hasGarden = lowerText.includes('garden') && 
                          !lowerText.includes('no garden')
        
        // Check for parking
        result.hasParking = lowerText.includes('parking') || 
                           lowerText.includes('garage') ||
                           lowerText.includes('driveway')
        
        // Check furnishing status
        if (lowerText.includes('furnished') && !lowerText.includes('unfurnished')) {
          result.furnishing = 'Furnished'
        } else if (lowerText.includes('unfurnished')) {
          result.furnishing = 'Unfurnished'
        } else if (lowerText.includes('part furnished')) {
          result.furnishing = 'Part Furnished'
        }
        
        // Check letting status
        if (lowerText.includes('tenanted') || lowerText.includes('sitting tenant')) {
          result.lettingStatus = 'Tenanted'
        } else if (lowerText.includes('vacant')) {
          result.lettingStatus = 'Vacant'
        }
        
        // Extract property images - start with empty array
        const images: string[] = []
        
        console.log('Starting DOM image extraction...')
        
        // If no API images, try DOM extraction
        if (images.length === 0) { 
          const imageSelectors = [
          // Zoopla specific - try multiple approaches
          'div[data-testid="gallery"] img',
          'div[data-testid="photos-gallery"] img',
          'div[class*="gallery"] img',
          'div[class*="image-gallery"] img',
          'div[class*="photos"] img',
          'picture img[srcset]', // Zoopla uses picture elements with srcset
          'img[src*="images.zoopla.co.uk"]',
          'img[src*="lid.zoocdn.com"]',
          'img[src*="zoopla"]',
          // Look for any img with high resolution
          'img[src*="800x600"]',
          'img[src*="1024x768"]',
          'img[src*="1200x900"]',
          // Rightmove specific
          'img[data-testid="gallery-image"]',
          'img[data-testid="property-image"]',
          '.property-image img',
          // Generic
          'picture img',
          '.gallery img',
          '[data-test="gallery"] img'
        ]
        
        for (const selector of imageSelectors) {
          const imageElements = document.querySelectorAll(selector)
          console.log(`Trying selector "${selector}": found ${imageElements.length} elements`)
          imageElements.forEach((img: any) => {
            // Get the highest quality source
            let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src')
            
            // For Zoopla images, extract from srcset if available (get highest resolution)
            const srcset = img.getAttribute('srcset')
            if (srcset) {
              const sources = srcset.split(',').map((s: string) => s.trim())
              // Get the last (usually highest resolution) image from srcset
              if (sources.length > 0) {
                const lastSource = sources[sources.length - 1]
                const urlMatch = lastSource.match(/^([^\s]+)/)
                if (urlMatch) {
                  src = urlMatch[1]
                }
              }
            }
            
            // Filter and add valid image URLs
            if (src && src.startsWith('http') && !images.includes(src)) {
              console.log(`Found image: ${src}`)
              // Filter out UI elements and non-property images
              const isUIElement = 
                src.includes('thumbnail') || 
                src.includes('logo') || 
                src.includes('icon') ||
                src.includes('avatar') ||
                src.includes('badge') ||
                src.includes('sprite') ||
                src.includes('naea') ||
                src.includes('tpo') ||
                src.includes('maps.zoopla.co.uk') ||
                src.includes('cdn.prod.zoopla.co.uk/_next/static') ||
                src.includes('cloudfront.net/themes') ||
                src.includes('marker') ||
                src.includes('pin') ||
                src.includes('static') ||
                src.includes('sprite')
              
              if (!isUIElement) {
                console.log(`Adding property image: ${src}`)
                images.push(src)
              } else {
                console.log(`Filtered out UI element: ${src}`)
              }
            }
          })
          if (images.length > 0) break
        }
        }
        
        // Try to find Zoopla property images specifically
        if (images.length === 0) {
          console.log('No images found with specific selectors, trying Zoopla-specific search...')
          
          // Look for Zoopla's image CDN patterns
          const zooplaImagePatterns = [
            'img[src*="images.zoopla.co.uk"]',
            'img[src*="lid.zoocdn.com"]',
            'img[src*="property-images"]',
            'img[src*="photos"]',
            'img[src*="gallery"]'
          ]
          
          for (const pattern of zooplaImagePatterns) {
            const elements = document.querySelectorAll(pattern)
            elements.forEach((img: any) => {
              const src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src')
              if (src && src.startsWith('http') && !images.includes(src)) {
                console.log(`Found Zoopla image:`, src)
                images.push(src)
              }
            })
            if (images.length > 0) break
          }
        }
        
        // Fallback: Get all images that look like property photos
        if (images.length === 0) {
          console.log('No Zoopla images found, trying comprehensive search...')
          const allImages = document.querySelectorAll('img')
          console.log(`Found ${allImages.length} total images on page`)
          
          allImages.forEach((img: any, index: number) => {
            let src = img.src || img.getAttribute('data-src') || img.getAttribute('data-lazy-src')
            
            // Try to get high-res from srcset
            const srcset = img.getAttribute('srcset')
            if (srcset) {
              const sources = srcset.split(',')
              if (sources.length > 0) {
                const lastSource = sources[sources.length - 1].trim()
                const urlMatch = lastSource.match(/^([^\s]+)/)
                if (urlMatch) {
                  src = urlMatch[1]
                }
              }
            }
            
            // More comprehensive filtering for property images
            if (src && src.startsWith('http') && !images.includes(src)) {
              const isPropertyImage = 
                (src.includes('property') || 
                 src.includes('photo') || 
                 src.includes('image') || 
                 src.includes('gallery') ||
                 src.includes('800x') || 
                 src.includes('1024x') || 
                 src.includes('1200x') ||
                 (src.includes('jpg') || src.includes('jpeg') || src.includes('png'))) &&
                // Must be from property image domains
                (src.includes('images.zoopla.co.uk') || 
                 src.includes('lid.zoocdn.com') ||
                 src.includes('property-images') ||
                 src.includes('photos'))
              
              const isNotUIElement = 
                !src.includes('logo') && 
                !src.includes('icon') && 
                !src.includes('thumbnail') && 
                !src.includes('avatar') && 
                !src.includes('badge') &&
                !src.includes('button') &&
                !src.includes('arrow') &&
                !src.includes('close') &&
                !src.includes('menu') &&
                !src.includes('sprite') &&
                !src.includes('naea') &&
                !src.includes('tpo') &&
                !src.includes('maps.zoopla.co.uk') &&
                !src.includes('cdn.prod.zoopla.co.uk/_next/static') &&
                !src.includes('cloudfront.net/themes') &&
                !src.includes('marker') &&
                !src.includes('pin') &&
                !src.includes('static')
              
              if (isPropertyImage && isNotUIElement) {
                console.log(`Found potential property image ${index + 1}:`, src)
                images.push(src)
              }
            }
          })
        }
        
        console.log(`Extracted ${images.length} images from page`)
        if (images.length > 0) {
          console.log('Image URLs found:', images.slice(0, 3)) // Show first 3 for debugging
        } else {
          console.log('No property images found - this might be due to lazy loading or dynamic content')
        }
        result.images = images.slice(0, 8) // Limit to 8 images
        result.imageUrl = images[0] || '' // Main image
        
        return result
      });
      
      console.log(`✅ Extracted detailed info:`, {
        images: details.images?.length || 0,
        imageUrls: details.images?.slice(0, 3) || [], // Show first 3 for debugging
        tenure: details.tenure,
        councilTaxBand: details.councilTaxBand,
        epcRating: details.epcRating,
        squareFeet: details.squareFeet,
        hasGarden: details.hasGarden,
        hasParking: details.hasParking,
        keyFeaturesCount: details.keyFeatures?.length || 0
      })
      
      return {
        ...details,
        images: allImages.length > 0 ? allImages : ((details as any).images || []),
        imageUrl: allImages.length > 0 ? allImages[0] : ((details as any).imageUrl || ''),
        url: propertyUrl
      }
      
    } catch (error) {
      console.error('Error scraping property details:', error)
      return {}
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

