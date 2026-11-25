import { NextRequest, NextResponse } from 'next/server'
import { getSession, setSessionCookie } from '@/lib/auth'
import { prisma } from '@/lib/db'
import {
  getUserById,
  getUsers,
  updateUser,
  getUserPermissions,
  getAuditLogs,
  getOffices,
  type UserAccount,
} from '@/lib/dataStore'
import type { UserRole } from '@/types'

async function resolveProfileUser(userId: string, email: string): Promise<UserAccount | null> {
  const storeUser =
    getUserById(userId) ?? getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
  if (storeUser) return storeUser

  if (process.env.DATABASE_URL && prisma?.user?.findUnique) {
    try {
      const dbUser = await prisma.user.findUnique({ where: { id: userId } })
      if (dbUser && !dbUser.deletedAt) {
        return {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          passwordHash: dbUser.passwordHash,
          role: dbUser.role as UserRole,
          officeId: dbUser.officeId || null,
          isActive: dbUser.isActive,
          createdAt: dbUser.createdAt.toISOString(),
          phone: dbUser.phone ?? undefined,
          designation: dbUser.designation ?? undefined,
          avatarUrl: dbUser.avatarUrl ?? undefined,
          tokenVersion: dbUser.tokenVersion ?? 1,
          mustChangePassword: Boolean(dbUser.mustChangePassword),
        }
      }
    } catch {
      // DB unavailable
    }
  }

  return null
}

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const user = await resolveProfileUser(session.userId, session.email)
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
    const safeUser = { ...user } as Partial<UserAccount>
    delete safeUser.passwordHash

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

    const user = await resolveProfileUser(session.userId, session.email)
    if (!user) {
      return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 })
    }

    const body = await req.json()
    const { name, phone, designation, avatarUrl, email } = body

    const updates: Record<string, string> = {}

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

    let updatedUser = updateUser(user.id, updates, session.email)

    if (process.env.DATABASE_URL && prisma?.user?.update) {
      const dbUpdated = await prisma.user
        .update({
          where: { id: user.id },
          data: updates,
        })
        .catch(() => null)
      if (!updatedUser && dbUpdated) {
        updatedUser = {
          ...user,
          ...updates,
        }
      }
    }

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'Failed to update profile.' }, { status: 500 })
    }

    // Refresh session cookie if name or email changed, preserving tokenVersion and mustChangePassword
    if (updates.name || updates.email) {
      await setSessionCookie({
        userId: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        officeId: updatedUser.officeId || null,
        tokenVersion: updatedUser.tokenVersion || 1,
        mustChangePassword: Boolean(updatedUser.mustChangePassword),
      })
    }

    const safeUser = { ...updatedUser } as Partial<UserAccount>
    delete safeUser.passwordHash

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
