import NodeCache from 'node-cache'

// Cache results for 30 minutes to reduce scraping
const cache = new NodeCache({
  stdTTL: 1800, // 30 minutes
  checkperiod: 600, // Check for expired keys every 10 minutes
})

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
    const data = cache.get<any[]>(key)
    if (data && Array.isArray(data)) {
      allProperties[key] = data
    }
  })
  
  return allProperties
}

