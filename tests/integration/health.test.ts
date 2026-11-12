import { describe, it, expect } from 'vitest'
import { GET } from '@/app/api/v1/health/route'

describe('System Health Diagnostic Endpoint - Integration Tests', () => {
  it('should return 200 OK and valid health telemetry data', async () => {
    const response = await GET()
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('HEALTHY')
    expect(data.woreda).toContain('Angolela Tera Woreda')
    expect(data.checks).toBeDefined()
    expect(data.checks.storage).toBeDefined()
    expect(data.checks.storage.status).toBe('UP')
    expect(data.checks.storage.details.userCount).toBeGreaterThan(0)
    expect(data.runtime).toBeDefined()
    expect(data.runtime.uptimeSeconds).toBeGreaterThanOrEqual(0)
    expect(data.runtime.memoryMb.heapUsed).toBeGreaterThan(0)
  })
})
