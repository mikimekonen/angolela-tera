import { describe, it, expect } from 'vitest'
import { hasPermission } from '@/lib/auth'

describe('Role-Based Access Control (RBAC) & Office Scope - Unit Tests', () => {
  describe('Static Permission Matrix', () => {
    it('SUPER_ADMIN should have full platform privileges', () => {
      expect(hasPermission('SUPER_ADMIN', 'canCreate')).toBe(true)
      expect(hasPermission('SUPER_ADMIN', 'canEditAll')).toBe(true)
      expect(hasPermission('SUPER_ADMIN', 'canPublish')).toBe(true)
      expect(hasPermission('SUPER_ADMIN', 'canManageUsers')).toBe(true)
      expect(hasPermission('SUPER_ADMIN', 'canApprove')).toBe(true)
    })

    it('ADMIN should manage content across offices but not manage users', () => {
      expect(hasPermission('ADMIN', 'canCreate')).toBe(true)
      expect(hasPermission('ADMIN', 'canEditAll')).toBe(true)
      expect(hasPermission('ADMIN', 'canPublish')).toBe(true)
      expect(hasPermission('ADMIN', 'canManageUsers')).toBe(false)
    })

    it('OFFICE_EDITOR should be limited to creating and office-scoped editing without direct publish rights', () => {
      expect(hasPermission('OFFICE_EDITOR', 'canCreate')).toBe(true)
      expect(hasPermission('OFFICE_EDITOR', 'canEditAll')).toBe(false)
      expect(hasPermission('OFFICE_EDITOR', 'canPublish')).toBe(false)
      expect(hasPermission('OFFICE_EDITOR', 'canApprove')).toBe(false)
    })

    it('REVIEWER should have approval authority without direct publishing', () => {
      expect(hasPermission('REVIEWER', 'canApprove')).toBe(true)
      expect(hasPermission('REVIEWER', 'canPublish')).toBe(false)
      expect(hasPermission('REVIEWER', 'canCreate')).toBe(false)
    })

    it('VIEWER should have read-only inspection access', () => {
      expect(hasPermission('VIEWER', 'canCreate')).toBe(false)
      expect(hasPermission('VIEWER', 'canEditAll')).toBe(false)
      expect(hasPermission('VIEWER', 'canPublish')).toBe(false)
      expect(hasPermission('VIEWER', 'canApprove')).toBe(false)
      expect(hasPermission('VIEWER', 'canManageUsers')).toBe(false)
    })
  })
})
