import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import {
  getUsers,
  revokeAllSessionsExcept,
  logSystemActivity,
  getStore,
  saveStore,
} from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const users = getUsers()

    const lockedUsers = users.filter((u) => u.lockedUntil && new Date(u.lockedUntil) > new Date()).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      failedLoginAttempts: u.failedLoginAttempts || 0,
      lockedUntil: u.lockedUntil,
    }))

    const failedLoginsRecent = users
      .filter((u) => (u.failedLoginAttempts || 0) > 0)
      .map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        failedCount: u.failedLoginAttempts || 0,
        lastLoginIp: u.lastLoginIp || 'N/A',
      }))

    const activeSessionsEstimated = users.filter((u) => u.isActive).length

    return NextResponse.json({
      success: true,
      security: {
        totalUsers: users.length,
        lockedUsers,
        lockedCount: lockedUsers.length,
        failedLoginsRecent,
        activeSessionsEstimated,
        systemEnvironment: process.env.NODE_ENV || 'production',
        authMethod: 'JWT HMAC-SHA256 with In-Store Token Version Invalidation',
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve security data' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const body = await req.json()
    const { action, confirmationText, targetUserId } = body

    if (action === 'REVOKE_ALL_SESSIONS') {
      if (confirmationText !== 'REVOKE') {
        return NextResponse.json(
          {
            success: false,
            error: 'Confirmation code "REVOKE" required to terminate all administrator sessions.',
          },
          { status: 400 }
        )
      }

      const result = revokeAllSessionsExcept(session.userId, session.email)
      return NextResponse.json({
        success: true,
        message: `Successfully terminated all sessions for ${result.revokedCount} administrators. Your session remains active.`,
        revokedCount: result.revokedCount,
      })
    }

    if (action === 'UNLOCK_USER') {
      if (!targetUserId) {
        return NextResponse.json(
          { success: false, error: 'targetUserId is required' },
          { status: 400 }
        )
      }

      const store = getStore()
      const user = store.users.find((u) => u.id === targetUserId)
      if (!user) {
        return NextResponse.json(
          { success: false, error: 'User not found' },
          { status: 404 }
        )
      }

      user.lockedUntil = undefined
      user.failedLoginAttempts = 0

      logSystemActivity({
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        action: 'USER_ACCOUNT_UNLOCKED',
        category: 'SYSTEM_SECURITY',
        entityType: 'User',
        entityId: user.email,
        notes: `Super Admin [${session.email}] manually lifted lockout for account [${user.email}].`,
        severity: 'INFO',
      })

      saveStore(store)

      return NextResponse.json({
        success: true,
        message: `Account [${user.email}] has been unlocked and failed login counter reset.`,
      })
    }

    return NextResponse.json(
      { success: false, error: `Invalid action: ${action}` },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Security action failed' },
      { status: 500 }
    )
  }
}
