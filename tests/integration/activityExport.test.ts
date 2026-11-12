import { describe, it, expect, vi } from 'vitest'
import { GET } from '@/app/api/v1/super-admin/activity/export/route'
import * as authModule from '@/lib/auth'

describe('Super Admin CSV Audit Trail Export - Integration Tests', () => {
  it('should block unauthenticated callers from downloading audit logs', async () => {
    vi.spyOn(authModule, 'requireAuth').mockResolvedValueOnce({
      session: null,
      errorResponse: new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 }) as any,
    })

    const req = new Request('http://localhost:3000/api/v1/super-admin/activity/export')
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('should allow Super Admins to download a structured CSV file', async () => {
    vi.spyOn(authModule, 'requireAuth').mockResolvedValueOnce({
      session: {
        userId: 'usr_superadmin_01',
        email: 'admin@angolela-tera.gov.et',
        name: 'Miki Mekonnen',
        role: 'SUPER_ADMIN',
        officeId: null,
        tokenVersion: 1,
        mustChangePassword: false,
      },
      errorResponse: null,
    })

    const req = new Request('http://localhost:3000/api/v1/super-admin/activity/export?category=ALL')
    const res = await GET(req)
    expect(res.status).toBe(200)

    const contentType = res.headers.get('Content-Type')
    expect(contentType).toContain('text/csv')

    const disposition = res.headers.get('Content-Disposition')
    expect(disposition).toContain('attachment')
    expect(disposition).toContain('.csv')

    const text = await res.text()
    expect(text).toContain('Log ID')
    expect(text).toContain('Timestamp (UTC)')
    expect(text).toContain('Category')
    expect(text).toContain('Action')
  })
})
