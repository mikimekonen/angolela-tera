import { describe, it, expect } from 'vitest'
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
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
