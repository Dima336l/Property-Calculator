import { NextRequest, NextResponse } from 'next/server'
import { scrapePropertyDetails } from '@/lib/scraper/rightmove-scraper'
import { getCachedProperties, updatePropertyInCache } from '@/lib/scraper/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const propertyUrl = searchParams.get('url')
    
    if (!propertyUrl) {
      return NextResponse.json({
        success: false,
        error: 'Property URL is required',
      }, { status: 400 })
    }
    
    console.log(`📊 Fetching detailed info for property ID: ${id}`)
    
    // Scrape detailed property information
    const details = await scrapePropertyDetails(propertyUrl)
    
    // Update the cached property with detailed information
    // Note: This is a simplified update - you may want to enhance this
    // to properly update the cache based on your cache structure
    
    return NextResponse.json({
      success: true,
      details,
    })

  } catch (error: any) {
    console.error('Error fetching property details:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch property details',
    }, { status: 500 })
  }
}

