import { NextRequest, NextResponse } from 'next/server'
import { getSession, hashPassword } from '@/lib/auth'
import {
  getUsers,
  createUser,
  updateUser,
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
        designation: u.designation,
        phone: u.phone,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt,
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
    const { name, email, password, role, officeId, designation, phone, permissions } = body

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
      designation: designation || undefined,
      phone: phone || undefined,
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
    const { action, userId, isActive, name, role, officeId, designation, phone, permissions, newPassword } = body

    if (!userId) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 })
    }

    // 1. Toggle Active / Suspended
    if (action === 'toggleStatus' && isActive !== undefined) {
      const updated = toggleUserStatus(userId, Boolean(isActive), session.name)
      return NextResponse.json({ success: true, data: updated })
    }

    // 2. Administrative Password Reset
    if (action === 'resetPassword') {
      if (!newPassword || newPassword.length < 8) {
        return NextResponse.json({ success: false, error: 'New password must be at least 8 characters' }, { status: 400 })
      }
      const passwordHash = await hashPassword(newPassword)
      const updated = updateUser(userId, { passwordHash }, session.name)
      return NextResponse.json({ success: true, message: 'Password reset successfully', data: { id: updated?.id } })
    }

    // 3. Edit User Details & Scopes
    if (action === 'updateUser') {
      const updates: any = {}
      if (name) updates.name = name.trim()
      if (role) updates.role = role
      if (officeId !== undefined) updates.officeId = officeId || null
      if (designation !== undefined) updates.designation = designation.trim()
      if (phone !== undefined) updates.phone = phone.trim()

      const updated = updateUser(userId, updates, session.name)

      // Update permissions if provided
      if (Array.isArray(permissions)) {
        permissions.forEach((p: any) => {
          setUserPermission({
            id: p.id || `perm-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
            userId,
            resource: p.resource as AdminResource,
            canView: Boolean(p.canView),
            canCreate: Boolean(p.canCreate),
            canEdit: Boolean(p.canEdit),
            canDelete: Boolean(p.canDelete),
            canPublish: Boolean(p.canPublish),
            officeScopeId: p.officeScopeId || officeId || null,
          }, session.name)
        })
      }

      return NextResponse.json({ success: true, data: updated })
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
