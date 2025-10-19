import { NextRequest, NextResponse } from 'next/server'
import { getAllCachedProperties, getCachedProperties, setCachedProperties, getAllCacheKeys } from '@/lib/scraper/cache'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log(`🔍 Looking for property with ID: "${id}"`)
    
    // First, try to get the property from individual cache
    const individualCacheKey = `property_${id}`
    let foundProperty = getCachedProperties(individualCacheKey)
    
    if (foundProperty) {
      console.log(`✅ Found property in individual cache: ${id}`)
      return NextResponse.json({
        success: true,
        property: foundProperty,
      })
    }
    
    console.log(`❌ Not found in individual cache, checking all cache keys...`)
    
    // Debug: Show all cache keys
    const allKeys = getAllCacheKeys()
    console.log(`📦 Total cache keys: ${allKeys.length}`)
    console.log(`🔑 Cache keys: ${allKeys.slice(0, 5).join(', ')}${allKeys.length > 5 ? '...' : ''}`)
    
    // Search through all cached properties to find the one with matching ID or address
    const allCachedData = getAllCachedProperties()
    console.log(`📋 Search result caches: ${Object.keys(allCachedData).length}`)
    
    // Log all property IDs to debug
    let allPropertyIds: string[] = []
    for (const properties of Object.values(allCachedData)) {
      if (Array.isArray(properties)) {
        allPropertyIds.push(...properties.map((p: any) => p.id))
      }
    }
    console.log(`🆔 All property IDs in search caches: ${allPropertyIds.slice(0, 10).join(', ')}${allPropertyIds.length > 10 ? '...' : ''}`)
    
    // First try to find by ID (exact match)
    for (const properties of Object.values(allCachedData)) {
      if (!Array.isArray(properties)) continue
      const property = properties.find((p: any) => p.id === id)
      if (property) {
        foundProperty = property
        console.log(`✅ Found by exact ID match: ${id}`)
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
        error: 'Property not found in cache. The cache may have expired. Please search again.',
        suggestion: 'Go back to search and find the property again.',
      }, { status: 404 })
    }

    // Cache the individual property for faster future lookups
    setCachedProperties(individualCacheKey, foundProperty)

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

