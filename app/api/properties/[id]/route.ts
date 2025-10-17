import { NextRequest, NextResponse } from 'next/server'
import { getAllCachedProperties } from '@/lib/scraper/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    // Search through all cached properties to find the one with matching ID or address
    const allCachedData = getAllCachedProperties()
    
    let foundProperty = null
    
    // First try to find by ID
    for (const properties of Object.values(allCachedData)) {
      const property = properties.find((p: any) => p.id === id)
      if (property) {
        foundProperty = property
        break
      }
    }
    
    // If not found by ID, try to find by partial address match
    // (in case ID changed due to deduplication)
    if (!foundProperty) {
      for (const properties of Object.values(allCachedData)) {
        const property = properties.find((p: any) => 
          p.address && p.address.toLowerCase().includes(id.toLowerCase())
        )
        if (property) {
          foundProperty = property
          break
        }
      }
    }

    if (!foundProperty) {
      console.error(`Property not found for ID: ${id}`)
      return NextResponse.json({
        success: false,
        error: 'Property not found in cache. Try searching again.',
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      property: foundProperty,
    })

  } catch (error: any) {
    console.error('Error fetching property:', error)
    
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to fetch property',
    }, { status: 500 })
  }
}

