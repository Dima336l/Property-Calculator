// Rate Limiter to prevent being blocked
export class RateLimiter {
  private queue: Array<() => Promise<any>> = []
  private processing = false
  private requestCount = 0
  private windowStart = Date.now()
  
  constructor(
    private maxRequestsPerWindow: number = 10,
    private windowMs: number = 60000, // 1 minute
    private delayBetweenRequests: number = 2000 // 2 seconds
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await fn()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      
      if (!this.processing) {
        this.processQueue()
      }
    })
  }

  private async processQueue() {
    if (this.queue.length === 0) {
      this.processing = false
      return
    }

    this.processing = true

    // Reset window if needed
    const now = Date.now()
    if (now - this.windowStart >= this.windowMs) {
      this.requestCount = 0
      this.windowStart = now
    }

    // Check if we've hit the rate limit
    if (this.requestCount >= this.maxRequestsPerWindow) {
      const waitTime = this.windowMs - (now - this.windowStart)
      console.log(`Rate limit reached. Waiting ${waitTime}ms...`)
      await this.sleep(waitTime)
      this.requestCount = 0
      this.windowStart = Date.now()
    }

    // Process next request
    const task = this.queue.shift()
    if (task) {
      this.requestCount++
      await task()
      
      // Delay between requests
      if (this.queue.length > 0) {
        await this.sleep(this.delayBetweenRequests)
      }
    }

    // Continue processing
    this.processQueue()
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  getStatus() {
    return {
      queueLength: this.queue.length,
      requestCount: this.requestCount,
      maxRequests: this.maxRequestsPerWindow,
      windowMs: this.windowMs,
    }
  }
}

// Singleton instance
export const rateLimiter = new RateLimiter(
  8,     // Max 8 requests
  60000, // Per minute
  3000   // 3 seconds between requests
)

