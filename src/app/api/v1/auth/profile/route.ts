import { NextRequest, NextResponse } from 'next/server'
import { getSession, setSessionCookie } from '@/lib/auth'
import { getUserById, updateUser, getUserPermissions, getAuditLogs, getOffices } from '@/lib/dataStore'

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const user = getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 })
    }

    // Get office details if assigned
    let office = null
    if (user.officeId) {
      const offices = getOffices()
      office = offices.find((o) => o.id === user.officeId) || null
    }

    // Get permissions
    const permissions = getUserPermissions(user.id)

    // Get user-specific recent audit logs
    const allLogs = getAuditLogs()
    const userLogs = allLogs
      .filter((log) => log.userId === user.id || log.userName === user.name || log.userName === user.email)
      .slice(0, 15)

    // Exclude passwordHash from response
    const { passwordHash: _, ...safeUser } = user

    return NextResponse.json({
      success: true,
      profile: {
        ...safeUser,
        office,
        permissions,
        recentLogs: userLogs,
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const user = getUserById(session.userId)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 })
    }

    const body = await req.json()
    const { name, phone, designation, avatarUrl, email } = body

    const updates: Record<string, any> = {}

    if (name && typeof name === 'string' && name.trim()) {
      updates.name = name.trim()
    }
    if (phone !== undefined) {
      updates.phone = typeof phone === 'string' ? phone.trim() : ''
    }
    if (designation !== undefined) {
      updates.designation = typeof designation === 'string' ? designation.trim() : ''
    }
    if (avatarUrl !== undefined) {
      updates.avatarUrl = typeof avatarUrl === 'string' ? avatarUrl.trim() : ''
    }

    // Only allow email modification if Super Admin or strictly validated
    if (email && typeof email === 'string' && email.trim() && session.role === 'SUPER_ADMIN') {
      updates.email = email.trim().toLowerCase()
    }

    const updatedUser = updateUser(user.id, updates, session.email)
    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'Failed to update profile.' }, { status: 500 })
    }

    // Refresh session cookie if name or email changed
    if (updates.name || updates.email) {
      await setSessionCookie({
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        officeId: updatedUser.officeId || null,
      })
    }

    const { passwordHash: _, ...safeUser } = updatedUser

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully.',
      profile: safeUser,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
