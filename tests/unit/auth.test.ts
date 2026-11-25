import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
  getJwtSecret,
  ROLE_PERMISSIONS,
  hasPermission,
} from '@/lib/auth'
import type { SessionPayload, UserRole } from '@/types'

describe('Auth Utilities - Unit Tests', () => {
  describe('Password Hashing and Verification', () => {
    it('should hash a password and verify it accurately', async () => {
      const plaintext = 'GovSecureP@ss2026!'
      const hash = await hashPassword(plaintext)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(plaintext)
      expect(hash.startsWith('$2')).toBe(true)

      const isValid = await verifyPassword(plaintext, hash)
      expect(isValid).toBe(true)

      const isInvalid = await verifyPassword('WrongPassword123', hash)
      expect(isInvalid).toBe(false)
    })

    it('should reject suffix variations, extra characters, and ensure exactly one password matches', async () => {
      const canonicalPass = 'SecureGov2026!'
      const hash = await hashPassword(canonicalPass)

      // Exact match passes
      expect(await verifyPassword(canonicalPass, hash)).toBe(true)

      // Suffix tampering / variation rejected
      expect(await verifyPassword(canonicalPass + '..', hash)).toBe(false)
      expect(await verifyPassword(canonicalPass + '.', hash)).toBe(false)
      expect(await verifyPassword(canonicalPass.toLowerCase(), hash)).toBe(false)
      expect(await verifyPassword(canonicalPass.slice(0, -1), hash)).toBe(false)
      expect(await verifyPassword(' ' + canonicalPass, hash)).toBe(false)
    }, 35000)
  })

  describe('JWT Session Tokens', () => {
    const mockPayload: SessionPayload = {
      userId: 'usr_superadmin_01',
      email: 'admin@angolela-tera.gov.et',
      name: 'Miki Mekonnen',
      role: 'SUPER_ADMIN' as UserRole,
      officeId: null,
      tokenVersion: 2,
      mustChangePassword: false,
    }

    it('should create and verify a valid HMAC-SHA256 session token', async () => {
      const token = await createSessionToken(mockPayload, 3600)
      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3)

      const verified = await verifySessionToken(token)
      expect(verified).not.toBeNull()
      expect(verified?.userId).toBe(mockPayload.userId)
      expect(verified?.email).toBe(mockPayload.email)
      expect(verified?.role).toBe(mockPayload.role)
      expect(verified?.tokenVersion).toBe(mockPayload.tokenVersion)
      expect(verified?.mustChangePassword).toBe(false)
    })

    it('should reject a tampered token signature', async () => {
      const token = await createSessionToken(mockPayload, 3600)
      const parts = token.split('.')
      // Tamper with payload
      const tamperedToken = `${parts[0]}.${parts[1]}tampered.${parts[2]}`

      const verified = await verifySessionToken(tamperedToken)
      expect(verified).toBeNull()
    })

    it('should reject an expired session token', async () => {
      // Create token expired 10 seconds ago
      const expiredToken = await createSessionToken(mockPayload, -10)
      const verified = await verifySessionToken(expiredToken)
      expect(verified).toBeNull()
    })

    it('should reject malformed token strings', async () => {
      expect(await verifySessionToken('')).toBeNull()
      expect(await verifySessionToken('invalid.jwt')).toBeNull()
      expect(await verifySessionToken('not.even.a.valid.jwt.string')).toBeNull()
    })

    it('should reject a token with an invalid or spoofed role', async () => {
      const spoofedPayload = {
        ...mockPayload,
        role: 'NON_EXISTENT_SUPER_GOD_ROLE' as UserRole,
      }
      const token = await createSessionToken(spoofedPayload, 3600)
      const verified = await verifySessionToken(token)
      expect(verified).toBeNull()
    })

    it('should reject a token with an unauthorized algorithm in header', async () => {
      // Create a forged token header with alg: "none"
      const forgedHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url')
      const payload = Buffer.from(JSON.stringify({ ...mockPayload, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url')
      const unsignedToken = `${forgedHeader}.${payload}.`
      const verified = await verifySessionToken(unsignedToken)
      expect(verified).toBeNull()
    })
  })

  describe('Production JWT_SECRET Validation and Environment Security', () => {
    const originalEnv = process.env

    beforeEach(() => {
      process.env = { ...originalEnv }
    })

    afterEach(() => {
      process.env = originalEnv
    })

    it('should throw clear configuration error in production if JWT_SECRET is unset', () => {
      process.env.NODE_ENV = 'production'
      delete process.env.JWT_SECRET
      delete process.env.NEXT_PHASE
      delete process.env.npm_lifecycle_event

      expect(() => {
        getJwtSecret()
      }).toThrow(/Server configuration error: JWT_SECRET environment variable is missing or insecure/)
    })

    it('should throw clear configuration error in production if JWT_SECRET is less than 32 characters', () => {
      process.env.NODE_ENV = 'production'
      process.env.JWT_SECRET = 'short-secret-key-too-brief'
      delete process.env.NEXT_PHASE
      delete process.env.npm_lifecycle_event

      expect(() => {
        getJwtSecret()
      }).toThrow(/Server configuration error: JWT_SECRET environment variable is missing or insecure/)
    })

    it('should throw clear configuration error in production if JWT_SECRET contains an insecure placeholder', () => {
      process.env.NODE_ENV = 'production'
      process.env.JWT_SECRET = 'change-in-production-long-placeholder-secret-for-testing-only'
      delete process.env.NEXT_PHASE
      delete process.env.npm_lifecycle_event

      expect(() => {
        getJwtSecret()
      }).toThrow(/Server configuration error: JWT_SECRET environment variable is missing or insecure/)
    })

    it('should accept valid 32+ character JWT_SECRET in production and create/verify tokens', async () => {
      process.env.NODE_ENV = 'production'
      process.env.JWT_SECRET = 'a-very-strong-production-cryptographic-secret-key-64-characters-long!!'
      delete process.env.NEXT_PHASE
      delete process.env.npm_lifecycle_event

      const payload: SessionPayload = {
        userId: 'usr_prod_test',
        email: 'prod@angolela-tera.gov.et',
        name: 'Production Administrator',
        role: 'SUPER_ADMIN',
        officeId: null,
      }

      const token = await createSessionToken(payload, 3600)
      expect(token).toBeDefined()
      const verified = await verifySessionToken(token)
      expect(verified?.email).toBe('prod@angolela-tera.gov.et')
    })

    it('should safely return null without throwing when verifySessionToken is called in production without JWT_SECRET', async () => {
      process.env.NODE_ENV = 'production'
      delete process.env.JWT_SECRET
      delete process.env.NEXT_PHASE
      delete process.env.npm_lifecycle_event

      const result = await verifySessionToken('some.fake.token')
      expect(result).toBeNull()
    })
  })

  describe('Role Permissions & Authorization Matrix', () => {
    it('should ensure SUPER_ADMIN has full administrative permissions', () => {
      const superAdminPerms = ROLE_PERMISSIONS.SUPER_ADMIN
      expect(superAdminPerms.canManageUsers).toBe(true)
      expect(superAdminPerms.canPublish).toBe(true)
      expect(superAdminPerms.canApprove).toBe(true)
      expect(superAdminPerms.canEditAll).toBe(true)
      expect(superAdminPerms.canAccessAdmin).toBe(true)
    })

    it('should enforce role boundaries on lower privilege roles', () => {
      expect(ROLE_PERMISSIONS.VIEWER.canManageUsers).toBe(false)
      expect(ROLE_PERMISSIONS.VIEWER.canPublish).toBe(false)
      expect(ROLE_PERMISSIONS.VIEWER.canCreate).toBe(false)

      expect(ROLE_PERMISSIONS.OFFICE_EDITOR.canManageUsers).toBe(false)
      expect(ROLE_PERMISSIONS.OFFICE_EDITOR.canPublish).toBe(false)
      expect(ROLE_PERMISSIONS.OFFICE_EDITOR.canCreate).toBe(true)
      expect(ROLE_PERMISSIONS.OFFICE_EDITOR.canEditAll).toBe(false)

      expect(ROLE_PERMISSIONS.REVIEWER.canApprove).toBe(true)
      expect(ROLE_PERMISSIONS.REVIEWER.canPublish).toBe(false)
    })

    it('should correctly evaluate role permissions with hasPermission', () => {
      expect(hasPermission('SUPER_ADMIN', 'canManageUsers')).toBe(true)
      expect(hasPermission('ADMIN', 'canManageUsers')).toBe(false)
      expect(hasPermission('ADMIN', 'canPublish')).toBe(true)
      expect(hasPermission('OFFICE_EDITOR', 'canCreate')).toBe(true)
      expect(hasPermission('OFFICE_EDITOR', 'canPublish')).toBe(false)
      expect(hasPermission('VIEWER', 'canAccessAdmin')).toBe(true)
      expect(hasPermission('VIEWER', 'canCreate')).toBe(false)
    })
  })
})
