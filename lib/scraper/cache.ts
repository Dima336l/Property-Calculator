import NodeCache from 'node-cache'

// Prevent cache from being cleared on hot reload in development
// Store cache in global to persist across module reloads
const globalForCache = globalThis as unknown as {
  propertyCache: NodeCache | undefined
}

// Cache results for 30 minutes to reduce scraping
const cache = globalForCache.propertyCache ?? new NodeCache({
  stdTTL: 1800, // 30 minutes
  checkperiod: 600, // Check for expired keys every 10 minutes
})

if (process.env.NODE_ENV !== 'production') {
  globalForCache.propertyCache = cache
}

export function getCachedProperties(key: string): any | undefined {
  return cache.get(key)
}

export function setCachedProperties(key: string, data: any): boolean {
  return cache.set(key, data)
}

export function generateCacheKey(params: any): string {
  return `properties_${JSON.stringify(params)}`
}

export function clearCache(): void {
  cache.flushAll()
}

export function getCacheStats() {
  return cache.getStats()
}

export function getAllCachedProperties(): { [key: string]: any[] } {
  const keys = cache.keys()
  const allProperties: { [key: string]: any[] } = {}
  
  keys.forEach(key => {
    // Only get search result caches (which are arrays), not individual properties
    if (key.startsWith('properties_')) {
      const data = cache.get<any[]>(key)
      if (data && Array.isArray(data)) {
        allProperties[key] = data
      }
    }
  })
  
  return allProperties
}

export function getAllCacheKeys(): string[] {
  return cache.keys()
}

