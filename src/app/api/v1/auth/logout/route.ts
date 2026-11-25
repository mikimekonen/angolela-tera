import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie, getSession } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { logSystemActivity } from '@/lib/dataStore'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    if (session) {
      await createAuditLog({
        userId: session.userId,
        action: 'LOGOUT',
        entityType: 'User',
        entityId: session.userId,
        notes: 'User logged out of administration console',
        ipAddress,
        userAgent,
      })

      logSystemActivity({
        userId: session.userId,
        userName: session.name,
        userRole: session.role,
        action: 'LOGOUT',
        category: 'SYSTEM_SECURITY',
        entityType: 'User',
        entityId: session.email,
        notes: `Administrator [${session.email}] signed out of government portal`,
        ipAddress,
        userAgent,
        result: 'SUCCESS',
        severity: 'INFO',
      })
    }

    await clearSessionCookie()

    // Support both browser HTML form submission (e.g., maintenance lockout screen) and fetch JSON calls
    const accept = req.headers.get('accept') || ''
    if (accept.includes('text/html') && !accept.includes('application/json')) {
      return NextResponse.redirect(new URL('/admin/login', req.url), { status: 303 })
    }

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    )
  }
}
