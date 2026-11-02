/**
 * High-performance, lightweight in-memory sliding window rate limiter
 * Protects authentication endpoints, contact forms, and sensitive mutations from abuse.
 */

interface RateLimitRecord {
  timestamps: number[]
}

class InMemoryRateLimiter {
  private records = new Map<string, RateLimitRecord>()
  private cleanupInterval: NodeJS.Timeout

  constructor() {
    // Run garbage collection every 5 minutes to prevent memory leaks
    this.cleanupInterval = setInterval(() => this.cleanup(), 5 * 60 * 1000)
    if (this.cleanupInterval.unref) {
      this.cleanupInterval.unref()
    }
  }

  /**
   * Check if a key (e.g. IP or IP+route) is within the allowed request limit.
   * @param key Identifier for the rate limit target (e.g., client IP)
   * @param limit Maximum allowed requests within window
   * @param windowMs Window duration in milliseconds
   */
  public check(
    key: string,
    limit: number,
    windowMs: number
  ): { success: boolean; limit: number; remaining: number; reset: number } {
    const now = Date.now()
    const windowStart = now - windowMs

    let record = this.records.get(key)
    if (!record) {
      record = { timestamps: [] }
      this.records.set(key, record)
    }

    // Filter out timestamps older than the sliding window
    record.timestamps = record.timestamps.filter((ts) => ts > windowStart)

    if (record.timestamps.length >= limit) {
      const oldestTimestamp = record.timestamps[0] || now
      const reset = Math.ceil((oldestTimestamp + windowMs - now) / 1000)
      return {
        success: false,
        limit,
        remaining: 0,
        reset: Math.max(1, reset),
      }
    }

    // Record this attempt
    record.timestamps.push(now)
    return {
      success: true,
      limit,
      remaining: Math.max(0, limit - record.timestamps.length),
      reset: Math.ceil(windowMs / 1000),
    }
  }

  /**
   * Clear records (optionally for a specific key)
   */
  public reset(key?: string): void {
    if (key) {
      this.records.delete(key)
    } else {
      this.records.clear()
    }
  }

  private cleanup(): void {
    const now = Date.now()
    // Remove records whose newest timestamp is older than 1 hour
    for (const [key, record] of this.records.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 3600000)
      if (record.timestamps.length === 0) {
        this.records.delete(key)
      }
    }
  }
}

export const rateLimiter = new InMemoryRateLimiter()
