import { NextRequest, NextResponse } from 'next/server'
import { getSession, verifyPassword, hashPassword } from '@/lib/auth'
import { getUserById, updateUser } from '@/lib/dataStore'

export async function POST(req: NextRequest) {
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
    const isCurrentValid = await verifyPassword(currentPassword, user.passwordHash)
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

    // Hash and store new password
    const newHash = await hashPassword(newPassword)
    const updated = updateUser(user.id, { passwordHash: newHash }, session.email)

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Failed to update password.' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Password successfully changed. Please use your new password next time you sign in.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
