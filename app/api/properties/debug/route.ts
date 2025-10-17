import { NextRequest, NextResponse } from 'next/server'
import { getAllCachedProperties } from '@/lib/scraper/cache'

export async function GET(request: NextRequest) {
  try {
    const allCached = getAllCachedProperties()
    
    // Get sample properties with their image URLs
    const samples: any[] = []
    for (const properties of Object.values(allCached)) {
      if (Array.isArray(properties)) {
        samples.push(...properties.slice(0, 5).map((p: any) => ({
          id: p.id,
          address: p.address,
          imageUrl: p.imageUrl,
          hasImage: !!p.imageUrl && p.imageUrl.length > 0,
        })))
      }
      if (samples.length >= 10) break
    }

    return NextResponse.json({
      success: true,
      totalCacheKeys: Object.keys(allCached).length,
      totalProperties: Object.values(allCached).reduce((sum, props) => sum + (Array.isArray(props) ? props.length : 0), 0),
      samples,
    })

  } catch (error: any) {
    console.error('Error in debug API:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}

