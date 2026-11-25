import { NextRequest, NextResponse } from 'next/server'
import { getSession, verifyPassword, hashPassword, setSessionCookie } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { getUserById, getUsers, updateUser } from '@/lib/dataStore'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized. Please sign in.' }, { status: 401 })
    }

    const storeUser =
      getUserById(session.userId) ??
      getUsers().find((u) => u.email.toLowerCase() === session.email.toLowerCase())

    let dbUser: {
      id: string
      passwordHash: string
      tokenVersion: number
      mustChangePassword: boolean
    } | null = null
    if (process.env.DATABASE_URL && prisma?.user?.findUnique) {
      dbUser = await prisma.user.findUnique({ where: { id: session.userId } }).catch(() => null)
    }

    const currentPasswordHash = dbUser?.passwordHash ?? storeUser?.passwordHash
    const currentTokenVersion = dbUser?.tokenVersion ?? storeUser?.tokenVersion ?? 1

    if (!currentPasswordHash) {
      return NextResponse.json({ success: false, error: 'User account not found.' }, { status: 404 })
    }

    const body = await req.json()
    const { currentPassword, newPassword, confirmPassword } = body

    if (!currentPassword || !newPassword || !confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'Please provide current password, new password, and confirmation.' },
        { status: 400 }
      )
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { success: false, error: 'New password and confirmation do not match.' },
        { status: 400 }
      )
    }

    // Complexity checks: min 8 chars, at least one uppercase, one lowercase, one number
    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: 'New password must be at least 8 characters long.' },
        { status: 400 }
      )
    }

    const hasUpper = /[A-Z]/.test(newPassword)
    const hasLower = /[a-z]/.test(newPassword)
    const hasNumber = /[0-9]/.test(newPassword)

    if (!hasUpper || !hasLower || !hasNumber) {
      return NextResponse.json(
        {
          success: false,
          error: 'Password must contain at least one uppercase letter, one lowercase letter, and one number.',
        },
        { status: 400 }
      )
    }

    // Verify current password
    const isCurrentValid = await verifyPassword(currentPassword, currentPasswordHash)
    if (!isCurrentValid) {
      return NextResponse.json(
        { success: false, error: 'Incorrect current password. Please try again.' },
        { status: 400 }
      )
    }

    // Check that new password is not identical to current
    if (currentPassword === newPassword) {
      return NextResponse.json(
        { success: false, error: 'New password cannot be identical to your current password.' },
        { status: 400 }
      )
    }

    // Hash and store new password, invalidate existing sessions from other devices
    const newHash = await hashPassword(newPassword)
    const nextTokenVersion = currentTokenVersion + 1

    let updated = false
    if (storeUser) {
      const storeResult = updateUser(
        storeUser.id,
        {
          passwordHash: newHash,
          tokenVersion: nextTokenVersion,
          mustChangePassword: false,
          passwordResetAt: new Date().toISOString(),
        },
        session.email
      )
      updated = Boolean(storeResult)
    }

    if (dbUser && process.env.DATABASE_URL && prisma?.user?.update) {
      await prisma.user
        .update({
          where: { id: dbUser.id },
          data: {
            passwordHash: newHash,
            tokenVersion: nextTokenVersion,
            mustChangePassword: false,
          },
        })
        .then(() => {
          updated = true
        })
        .catch(() => {})
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update password.' }, { status: 500 })
    }

    // Refresh current user's session cookie with the new tokenVersion
    await setSessionCookie({
      ...session,
      tokenVersion: nextTokenVersion,
      mustChangePassword: false,
    })

    return NextResponse.json({
      success: true,
      message: 'Password successfully changed. Other active sessions have been invalidated for security.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
