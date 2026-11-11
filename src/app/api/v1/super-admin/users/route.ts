import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, hashPassword } from '@/lib/auth'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  resetUserPasswordSecurely,
  revokeUserSessions,
  logSystemActivity,
  UserAccount,
} from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const url = new URL(req.url)
    const search = url.searchParams.get('search')?.toLowerCase() || ''
    const role = url.searchParams.get('role') || 'ALL'
    const status = url.searchParams.get('status') || 'ALL'
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '10', 10)

    let users = getUsers()

    if (role !== 'ALL') {
      users = users.filter((u) => u.role === role)
    }

    if (status === 'ACTIVE') {
      users = users.filter((u) => u.isActive)
    } else if (status === 'SUSPENDED') {
      users = users.filter((u) => !u.isActive)
    }

    if (search) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search) ||
          (u.designation && u.designation.toLowerCase().includes(search))
      )
    }

    const total = users.length
    const startIndex = (page - 1) * limit
    const paginated = users.slice(startIndex, startIndex + limit).map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      officeId: u.officeId,
      isActive: u.isActive,
      phone: u.phone,
      designation: u.designation,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt,
      lastLoginIp: u.lastLoginIp,
      tokenVersion: u.tokenVersion || 1,
      mustChangePassword: Boolean(u.mustChangePassword),
      lockedUntil: u.lockedUntil,
      failedLoginAttempts: u.failedLoginAttempts || 0,
      suspendedAt: u.suspendedAt,
      suspendedBy: u.suspendedBy,
    }))

    return NextResponse.json({
      success: true,
      users: paginated,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to list users' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const body = await req.json()
    const { name, email, password, role, officeId, phone, designation } = body

    if (!name || !email || !role) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and role are required' },
        { status: 400 }
      )
    }

    const existingUsers = getUsers()
    if (existingUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return NextResponse.json(
        { success: false, error: 'A user with this email address already exists' },
        { status: 400 }
      )
    }

    // Default password or custom password
    const rawPassword = password && password.trim().length >= 8 ? password.trim() : 'Angolela@' + Math.floor(1000 + Math.random() * 9000)
    const passwordHash = await hashPassword(rawPassword)

    const newUser: UserAccount = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role,
      officeId: officeId || null,
      isActive: true,
      phone: phone || '',
      designation: designation || '',
      tokenVersion: 1,
      mustChangePassword: true,
      createdAt: new Date().toISOString(),
    }

    createUser(newUser, [], session.email)

    logSystemActivity({
      userId: session.userId,
      userName: session.name,
      userRole: session.role,
      action: 'USER_CREATED',
      category: 'USER_MANAGEMENT',
      entityType: 'User',
      entityId: newUser.email,
      notes: `Super Admin [${session.email}] registered new user [${newUser.email}] with role [${newUser.role}].`,
      severity: 'INFO',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        officeId: newUser.officeId,
        isActive: newUser.isActive,
      },
      temporaryPassword: rawPassword,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const body = await req.json()
    const { id, name, email, role, officeId, phone, designation } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const updates: Partial<UserAccount> = {}
    if (name !== undefined) updates.name = name
    if (email !== undefined) updates.email = email.toLowerCase().trim()
    if (role !== undefined) updates.role = role
    if (officeId !== undefined) updates.officeId = officeId
    if (phone !== undefined) updates.phone = phone
    if (designation !== undefined) updates.designation = designation

    const updated = updateUser(id, updates, session.email)
    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    logSystemActivity({
      userId: session.userId,
      userName: session.name,
      userRole: session.role,
      action: 'USER_PROFILE_UPDATED',
      category: 'USER_MANAGEMENT',
      entityType: 'User',
      entityId: updated.email,
      notes: `Updated profile details for [${updated.email}] by ${session.email}`,
      severity: 'INFO',
    })

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        officeId: updated.officeId,
        isActive: updated.isActive,
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update user' },
      { status: 400 }
    )
  }
}

export async function PUT(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const body = await req.json()
    const { action, userId, isActive } = body

    if (!action || !userId) {
      return NextResponse.json(
        { success: false, error: 'Action and userId are required' },
        { status: 400 }
      )
    }

    if (action === 'TOGGLE_STATUS') {
      try {
        const user = toggleUserStatus(userId, Boolean(isActive), session.email)
        if (!user) {
          return NextResponse.json(
            { success: false, error: 'User not found' },
            { status: 404 }
          )
        }
        return NextResponse.json({
          success: true,
          message: `User status changed to ${isActive ? 'Active' : 'Suspended'}`,
          user: {
            id: user.id,
            email: user.email,
            isActive: user.isActive,
          },
        })
      } catch (err: any) {
        return NextResponse.json(
          { success: false, error: err.message },
          { status: 400 }
        )
      }
    }

    if (action === 'RESET_PASSWORD') {
      const resetResult = await resetUserPasswordSecurely(userId, session.email)
      return NextResponse.json({
        success: true,
        message: 'Password reset successfully. A temporary password was generated.',
        temporaryPassword: resetResult.temporaryPassword,
        user: resetResult.user,
      })
    }

    if (action === 'REVOKE_SESSIONS') {
      const user = revokeUserSessions(userId, session.email)
      return NextResponse.json({
        success: true,
        message: `All active sessions revoked for ${user.email}`,
        tokenVersion: user.tokenVersion,
      })
    }

    return NextResponse.json(
      { success: false, error: `Unsupported action: ${action}` },
      { status: 400 }
    )
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Operation failed' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('id')

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const result = deleteUser(userId, session.email)
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to delete user' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'User permanently deleted from system',
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete user' },
      { status: 500 }
    )
  }
}
