import { NextRequest, NextResponse } from 'next/server'
import { clearSessionCookie, getSession } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'

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
    }

    await clearSessionCookie()

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
