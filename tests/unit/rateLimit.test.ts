import { describe, it, expect, beforeEach } from 'vitest'
import { rateLimiter } from '@/lib/rateLimit'

describe('Rate Limiter - Unit Tests', () => {
  beforeEach(() => {
    rateLimiter.reset()
  })

  it('should allow requests within rate limits', () => {
    const ip = '192.168.1.100'
    const limit = 5
    const windowMs = 60000 // 1 minute

    for (let i = 0; i < limit; i++) {
      const result = rateLimiter.check(ip, limit, windowMs)
      expect(result.success).toBe(true)
      expect(result.remaining).toBe(limit - (i + 1))
    }
  })

  it('should block requests that exceed the limit', () => {
    const ip = '192.168.1.101'
    const limit = 3
    const windowMs = 60000

    // Consume all 3
    rateLimiter.check(ip, limit, windowMs)
    rateLimiter.check(ip, limit, windowMs)
    rateLimiter.check(ip, limit, windowMs)

    // 4th request should fail
    const blocked = rateLimiter.check(ip, limit, windowMs)
    expect(blocked.success).toBe(false)
    expect(blocked.remaining).toBe(0)
    expect(blocked.reset).toBeGreaterThan(0)
  })

  it('should track separate keys independently', () => {
    const ipA = '10.0.0.1'
    const ipB = '10.0.0.2'
    const limit = 2
    const windowMs = 60000

    rateLimiter.check(ipA, limit, windowMs)
    rateLimiter.check(ipA, limit, windowMs)
    expect(rateLimiter.check(ipA, limit, windowMs).success).toBe(false)

    // ipB should still have quota
    const resB = rateLimiter.check(ipB, limit, windowMs)
    expect(resB.success).toBe(true)
    expect(resB.remaining).toBe(1)
  })

  it('should reset limits when requested', () => {
    const ip = '172.16.0.5'
    const limit = 2
    const windowMs = 60000

    rateLimiter.check(ip, limit, windowMs)
    rateLimiter.check(ip, limit, windowMs)
    expect(rateLimiter.check(ip, limit, windowMs).success).toBe(false)

    rateLimiter.reset(ip)

    const retry = rateLimiter.check(ip, limit, windowMs)
    expect(retry.success).toBe(true)
    expect(retry.remaining).toBe(1)
  })
})
