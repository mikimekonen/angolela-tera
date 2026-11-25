import { describe, it, expect, vi, beforeAll, afterAll, beforeEach, afterEach } from 'vitest'
import { NextRequest } from 'next/server'
import { hashPassword, createSessionToken } from '@/lib/auth'
import { getStore, saveStore, createUser, type UserAccount } from '@/lib/dataStore'
import { POST as loginPOST } from '@/app/api/v1/auth/login/route'
import { POST as logoutPOST } from '@/app/api/v1/auth/logout/route'
import { GET as meGET } from '@/app/api/v1/auth/me/route'
import { GET as usersGET } from '@/app/api/v1/users/route'
import { GET as securityGET } from '@/app/api/v1/super-admin/security/route'

// In-memory cookie jar simulating Next.js `cookies()` across requests in a browser session
const cookieJar = new Map<string, { value: string; options: Record<string, unknown> }>()

vi.mock('next/headers', () => ({
  cookies: async () => ({
    get: (name: string) => {
      const entry = cookieJar.get(name)
      return entry && entry.value ? { name, value: entry.value } : undefined
    },
    set: (name: string, value: string, options: Record<string, unknown> = {}) => {
      if (options.maxAge === 0 || value === '') {
        cookieJar.delete(name)
      } else {
        cookieJar.set(name, { value, options })
      }
    },
    delete: (name: string) => {
      cookieJar.delete(name)
    },
  }),
}))

describe('End-to-End Admin Authentication & RBAC Flow - Integration Tests', () => {
  let initialStoreSnapshot: ReturnType<typeof getStore> | undefined
  const originalEnv = process.env

  const superAdminEmail = 'test-superadmin-flow@angolela-tera.gov.et'
  const editorEmail = 'test-editor-flow@angolela-tera.gov.et'
  const testPassword = 'TestGovPassword#2026'

  beforeAll(async () => {
    delete process.env.DATABASE_URL
    initialStoreSnapshot = JSON.parse(JSON.stringify(getStore()))
    const passwordHash = await hashPassword(testPassword)

    const testSuperAdmin: UserAccount = {
      id: 'test-flow-superadmin',
      email: superAdminEmail,
      name: 'Test Super Admin',
      passwordHash,
      role: 'SUPER_ADMIN',
      officeId: null,
      isActive: true,
      tokenVersion: 1,
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
    }

    const testEditor: UserAccount = {
      id: 'test-flow-editor',
      email: editorEmail,
      name: 'Test Office Editor',
      passwordHash,
      role: 'OFFICE_EDITOR',
      officeId: 'education',
      isActive: true,
      tokenVersion: 1,
      mustChangePassword: false,
      createdAt: new Date().toISOString(),
    }

    createUser(testSuperAdmin, [], 'IntegrationTest')
    createUser(testEditor, [], 'IntegrationTest')
  })

  afterAll(() => {
    if (initialStoreSnapshot) {
      saveStore(initialStoreSnapshot)
    }
  })

  beforeEach(() => {
    cookieJar.clear()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  it('should reject login in production with a clear error when JWT_SECRET is missing (without failing password check)', async () => {
    process.env.NODE_ENV = 'production'
    delete process.env.JWT_SECRET
    delete process.env.DATABASE_URL
    delete process.env.NEXT_PHASE
    delete process.env.npm_lifecycle_event

    const req = new NextRequest('https://angolela-tera.vercel.app/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.10' },
      body: JSON.stringify({ email: superAdminEmail, password: testPassword }),
    })

    const res = await loginPOST(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('JWT_SECRET')
    expect(cookieJar.has('admin_session')).toBe(false)
  })

  it('should reject incorrect passwords with 401 Unauthorized', async () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'prod-strong-cryptographic-secret-key-at-least-64-chars-long-2026!!'
    delete process.env.DATABASE_URL

    const req = new NextRequest('https://angolela-tera.vercel.app/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.11' },
      body: JSON.stringify({ email: superAdminEmail, password: 'WrongPassword!' }),
    })

    const res = await loginPOST(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.success).toBe(false)
    expect(data.error).toContain('Invalid email or password')
    expect(cookieJar.has('admin_session')).toBe(false)
  })

  it('should complete full production login, cookie persistence, Super Admin authorization, and logout', async () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'prod-strong-cryptographic-secret-key-at-least-64-chars-long-2026!!'
    delete process.env.DATABASE_URL

    // 1. Login as SUPER_ADMIN
    const loginReq = new NextRequest('https://angolela-tera.vercel.app/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.12' },
      body: JSON.stringify({ email: superAdminEmail, password: testPassword }),
    })
    const loginRes = await loginPOST(loginReq)
    expect(loginRes.status).toBe(200)
    const loginData = await loginRes.json()
    expect(loginData.success).toBe(true)
    expect(loginData.user.role).toBe('SUPER_ADMIN')

    // 2. Verify secure HttpOnly cookie attributes
    const cookie = cookieJar.get('admin_session')
    expect(cookie).toBeDefined()
    expect(cookie?.options.httpOnly).toBe(true)
    expect(cookie?.options.secure).toBe(true)
    expect(cookie?.options.sameSite).toBe('lax')
    expect(cookie?.options.path).toBe('/')

    // 3. Session persistence check (/api/v1/auth/me)
    const meRes = await meGET()
    expect(meRes.status).toBe(200)
    const meData = await meRes.json()
    expect(meData.success).toBe(true)
    expect(meData.user.email).toBe(superAdminEmail)
    expect(meData.user.role).toBe('SUPER_ADMIN')

    // 4. Verify Super Admin can access Super Admin-only endpoints
    const usersRes = await usersGET()
    expect(usersRes.status).toBe(200)

    const secReq = new NextRequest('https://angolela-tera.vercel.app/api/v1/super-admin/security')
    const secRes = await securityGET(secReq)
    expect(secRes.status).toBe(200)

    // 5. Logout clears cookie and subsequent session requests fail
    const logoutReq = new NextRequest('https://angolela-tera.vercel.app/api/v1/auth/logout', {
      method: 'POST',
    })
    const logoutRes = await logoutPOST(logoutReq)
    expect(logoutRes.status).toBe(200)
    expect(cookieJar.has('admin_session')).toBe(false)

    const postLogoutMeRes = await meGET()
    expect(postLogoutMeRes.status).toBe(401)
  })

  it('should enforce RBAC boundaries and reject non-Super-Admin users on Super Admin routes', async () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'prod-strong-cryptographic-secret-key-at-least-64-chars-long-2026!!'
    delete process.env.DATABASE_URL

    const loginReq = new NextRequest('https://angolela-tera.vercel.app/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '198.51.100.13' },
      body: JSON.stringify({ email: editorEmail, password: testPassword }),
    })
    const loginRes = await loginPOST(loginReq)
    expect(loginRes.status).toBe(200)

    // OFFICE_EDITOR must be blocked from Super Admin endpoints
    const usersRes = await usersGET()
    expect(usersRes.status).toBe(403)

    const secReq = new NextRequest('https://angolela-tera.vercel.app/api/v1/super-admin/security')
    const secRes = await securityGET(secReq)
    expect(secRes.status).toBe(403)
  })

  it('should reject tokens signed with a different JWT_SECRET or tampered payloads', async () => {
    process.env.NODE_ENV = 'production'
    process.env.JWT_SECRET = 'first-production-secret-key-minimum-32-characters-long-alpha'
    delete process.env.DATABASE_URL

    const tokenFromDifferentSecret = await createSessionToken({
      userId: 'test-flow-superadmin',
      email: superAdminEmail,
      name: 'Test Super Admin',
      role: 'SUPER_ADMIN',
      officeId: null,
      tokenVersion: 1,
    })

    // Rotate / change server secret -> previously forged/mismatched token must fail verification
    process.env.JWT_SECRET = 'second-different-production-secret-key-minimum-32-chars-beta'
    cookieJar.set('admin_session', { value: tokenFromDifferentSecret, options: {} })

    const meRes = await meGET()
    expect(meRes.status).toBe(401)

    const usersRes = await usersGET()
    expect(usersRes.status).toBe(403)
  })
})
