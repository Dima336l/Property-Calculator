import { NextRequest, NextResponse } from 'next/server'
import { scrapeRightmove, scrapeZoopla, closeBrowser } from '@/lib/scraper/rightmove-scraper'
import { getCachedProperties, setCachedProperties, generateCacheKey } from '@/lib/scraper/cache'
import { rateLimiter } from '@/lib/scraper/rate-limiter'

// Force reload after scraper changes v3 - with deduplication
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    
    const params = {
      location: searchParams.get('location') || 'Manchester',
      minPrice: searchParams.get('minPrice') ? parseInt(searchParams.get('minPrice')!) : undefined,
      maxPrice: searchParams.get('maxPrice') ? parseInt(searchParams.get('maxPrice')!) : undefined,
      minBedrooms: searchParams.get('bedrooms') ? parseInt(searchParams.get('bedrooms')!) : undefined,
      propertyType: searchParams.get('propertyType') || undefined,
      source: searchParams.get('source') || 'rightmove', // rightmove or zoopla
      maxPages: searchParams.get('maxPages') ? parseInt(searchParams.get('maxPages')!) : 3,
    }

    // Check cache first
    const cacheKey = generateCacheKey(params)
    console.log(`🔑 Cache key: ${cacheKey.substring(0, 80)}...`)
    const cachedData = getCachedProperties(cacheKey)
    
    // Only use cache if it has results (not empty)
    if (cachedData && cachedData.length > 0) {
      console.log(`📦 Returning ${cachedData.length} cached results for ${params.location}`)
      
      // Also cache individual properties if not already cached
      let cachedCount = 0
      let newlyCachedCount = 0
      cachedData.forEach((property: any) => {
        const propertyKey = `property_${property.id}`
        const existingProperty = getCachedProperties(propertyKey)
        if (!existingProperty) {
          console.log(`   - Caching missing property: ${propertyKey}`)
          setCachedProperties(propertyKey, property)
          newlyCachedCount++
        } else {
          cachedCount++
        }
      })
      console.log(`   Already cached: ${cachedCount}, Newly cached: ${newlyCachedCount}`)
      
      return NextResponse.json({
        success: true,
        properties: cachedData,
        cached: true,
        source: params.source,
      })
    } else if (cachedData && cachedData.length === 0) {
      console.log(`⚠️ Cache exists but empty - will re-scrape`)
    }

    console.log('Scraping new data...', params)

    // Scrape fresh data
    let properties = []
    
    if (params.source === 'zoopla') {
      properties = await scrapeZoopla(params)
    } else {
      properties = await scrapeRightmove(params)
    }

    // Apply additional filters if needed
    if (params.propertyType && params.propertyType !== 'any') {
      properties = properties.filter(p => 
        p.propertyType.toLowerCase().includes(params.propertyType!.toLowerCase())
      )
    }

    // Cache the results
    setCachedProperties(cacheKey, properties)
    
    // Also cache each property individually for direct access
    console.log(`💾 Caching ${properties.length} properties individually...`)
    properties.forEach((property: any) => {
      const propertyKey = `property_${property.id}`
      console.log(`   - Caching property: ${propertyKey} (${property.address?.substring(0, 40)}...)`)
      setCachedProperties(propertyKey, property)
    })
    console.log(`✅ All properties cached!`)

    // Get rate limiter status
    const rateLimitStatus = rateLimiter.getStatus()

    return NextResponse.json({
      success: true,
      properties,
      cached: false,
      source: params.source,
      count: properties.length,
      rateLimitStatus,
    })

  } catch (error: any) {
    console.error('Error in search API:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to search properties',
      properties: [],
    }, { status: 500 })
  }
}

// Cleanup on server shutdown (development only)
if (process.env.NODE_ENV === 'development') {
  process.on('SIGINT', async () => {
    await closeBrowser()
    process.exit()
  })
}

