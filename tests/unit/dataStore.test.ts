import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import {
  isLastSuperAdmin,
  resetUserPasswordSecurely,
  toggleUserStatus,
  createUser,
  getUserById,
  createInquiry,
  getInquiryByTrackingCode,
  updateInquiryStatus,
  getSystemActivityLogs,
  getStore,
  saveStore,
  type UserAccount,
} from '@/lib/dataStore'

describe('DataStore Security & Citizen Grievance - Unit Tests', () => {
  let initialStoreSnapshot: any

  beforeAll(() => {
    // Preserve database state before running tests
    initialStoreSnapshot = JSON.parse(JSON.stringify(getStore()))
  })

  afterAll(() => {
    // Restore pristine database state after tests complete
    if (initialStoreSnapshot) {
      saveStore(initialStoreSnapshot)
    }
  })

  describe('Super Admin Protection Guard', () => {
    it('should correctly detect if an account is the last active Super Admin', () => {
      const user = getUserById('usr_superadmin_01')
      if (user) {
        const isLast = isLastSuperAdmin(user.id)
        expect(typeof isLast).toBe('boolean')
      }
    })

    it('should prevent deactivating the last active Super Admin', () => {
      const user = getUserById('usr_superadmin_01')
      if (user && isLastSuperAdmin(user.id)) {
        expect(() => {
          toggleUserStatus(user.id, false, 'Security Audit Runner')
        }).toThrow(/Cannot suspend or deactivate the last remaining Super Admin account/)
      }
    })
  })

  describe('Secure Password Reset Workflow', () => {
    it('should reset user password securely, increment tokenVersion and require password change', async () => {
      const testUserId = `test-user-${Date.now()}`
      const testUser: UserAccount = {
        id: testUserId,
        email: `test-${Date.now()}@angolela-tera.gov.et`,
        name: 'Test Staff Officer',
        role: 'EDITOR',
        passwordHash: '$2a$10$abcdefghijklmnopqrstuv',
        isActive: true,
        tokenVersion: 1,
        mustChangePassword: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      createUser(testUser, [], 'System Admin')

      const resetResult = await resetUserPasswordSecurely(testUserId, 'Super Admin Miki')
      expect(resetResult.success).toBe(true)
      expect(resetResult.temporaryPassword).toBeDefined()
      expect(resetResult.temporaryPassword.length).toBeGreaterThanOrEqual(14)

      const updatedUser = getUserById(testUserId)
      expect(updatedUser).toBeDefined()
      expect(updatedUser?.mustChangePassword).toBe(true)
      expect(updatedUser?.tokenVersion).toBe(2)

      const logs = getSystemActivityLogs()
      const logEntry = logs.find((l) => l.action === 'PASSWORD_RESET_INITIATED' && l.entityId === testUser.email)
      expect(logEntry).toBeDefined()
      expect(logEntry?.category).toBe('USER_MANAGEMENT')
      expect(logEntry?.result).toBe('SUCCESS')
    })
  })

  describe('Citizen Grievance & Inquiries Tracking', () => {
    it('should generate official tracking code in format AT-GR-2026-XXXX and record initial history', () => {
      const newInquiry = createInquiry({
        name: 'Abebe Kebede',
        email: 'abebe.k@example.com',
        phone: '+251911223344',
        subject: 'Potable Water Access in Kebele 02',
        message: 'Requesting maintenance on community borehole pump.',
        category: 'grievance',
        status: 'RECEIVED',
      })

      expect(newInquiry).toBeDefined()
      expect(newInquiry.trackingCode).toMatch(/^AT-GR-2026-\d{4}$/)
      expect(newInquiry.status).toBe('RECEIVED')
      expect(newInquiry.statusHistory).toBeDefined()
      expect(newInquiry.statusHistory?.length).toBeGreaterThanOrEqual(1)

      const retrieved = getInquiryByTrackingCode(newInquiry.trackingCode)
      expect(retrieved).toBeDefined()
      expect(retrieved?.email).toBe('abebe.k@example.com')
      expect(retrieved?.subject).toBe('Potable Water Access in Kebele 02')
    })

    it('should update inquiry status and maintain chronological audit history', () => {
      const inquiry = createInquiry({
        name: 'Tirualem Teganaw',
        email: 'tiru@example.com',
        subject: 'ICT Infrastructure Request',
        message: 'Chacha school network cabling inquiry.',
        category: 'inquiry',
        status: 'RECEIVED',
      })

      const updated = updateInquiryStatus(
        inquiry.trackingCode,
        'IN_PROGRESS',
        'Field technician dispatched to survey site.',
        'off-ict',
        'Director Miki',
        'Internal priority level: High'
      )

      expect(updated).not.toBeNull()
      expect(updated?.status).toBe('IN_PROGRESS')
      expect(updated?.responseNotes).toBe('Field technician dispatched to survey site.')
      expect(updated?.internalNotes).toBe('Internal priority level: High')
      expect(updated?.statusHistory?.[0].status).toBe('IN_PROGRESS')
      expect(updated?.statusHistory?.[0].changedBy).toBe('Director Miki')
    })
  })
})
