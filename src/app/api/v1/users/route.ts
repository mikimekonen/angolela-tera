import { NextRequest, NextResponse } from 'next/server'
import { getSession, hashPassword } from '@/lib/auth'
import {
  getUsers,
  createUser,
  toggleUserStatus,
  getUserPermissions,
  setUserPermission,
} from '@/lib/dataStore'
import type { AdminPermissionItem, AdminResource, UserRole } from '@/types'

export async function GET() {
  try {
    const session = await getSession()
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Super Admin only' }, { status: 403 })
    }

    const rawUsers = getUsers()
    // Do not return password hashes
    const sanitized = rawUsers.map((u) => {
      const perms = getUserPermissions(u.id)
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        officeId: u.officeId,
        isActive: u.isActive,
        createdAt: u.createdAt,
        permissions: perms,
      }
    })

    return NextResponse.json({ success: true, data: sanitized })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Super Admin only' }, { status: 403 })
    }

    const body = await req.json()
    const { name, email, password, role, officeId, permissions } = body

    if (!name || !email || !password || !role) {
      return NextResponse.json({ success: false, error: 'Name, email, password, and role are required' }, { status: 400 })
    }

    // Check email uniqueness
    const existing = getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase())
    if (existing) {
      return NextResponse.json({ success: false, error: 'An administrator with this email already exists' }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const newUserId = `user-${Date.now()}`

    const newUser = {
      id: newUserId,
      name,
      email,
      passwordHash,
      role: role as UserRole,
      officeId: officeId || null,
      isActive: true,
      createdAt: new Date().toISOString(),
    }

    // Prepare granular permissions
    const permissionItems: AdminPermissionItem[] = []
    if (Array.isArray(permissions)) {
      permissions.forEach((p: any) => {
        permissionItems.push({
          id: `perm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          userId: newUserId,
          resource: p.resource as AdminResource,
          canView: Boolean(p.canView),
          canCreate: Boolean(p.canCreate),
          canEdit: Boolean(p.canEdit),
          canDelete: Boolean(p.canDelete),
          canPublish: Boolean(p.canPublish),
          officeScopeId: p.officeScopeId || officeId || null,
        })
      })
    }

    const created = createUser(newUser, permissionItems, session.name)

    return NextResponse.json({
      success: true,
      data: {
        id: created.id,
        name: created.name,
        email: created.email,
        role: created.role,
        officeId: created.officeId,
        permissions: permissionItems,
      },
    }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Super Admin only' }, { status: 403 })
    }

    const body = await req.json()
    const { action, userId, isActive, permission } = body

    if (action === 'toggleStatus' && userId !== undefined) {
      const updated = toggleUserStatus(userId, Boolean(isActive), session.name)
      return NextResponse.json({ success: true, data: updated })
    }

    if (action === 'setPermission' && permission) {
      const updatedPerm = setUserPermission(permission, session.name)
      return NextResponse.json({ success: true, data: updatedPerm })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
