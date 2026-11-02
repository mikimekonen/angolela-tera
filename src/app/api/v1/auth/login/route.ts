import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations'
import { verifyPassword, setSessionCookie } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { prisma } from '@/lib/db'
import { rateLimiter } from '@/lib/rateLimit'
import type { SessionPayload, UserRole } from '@/types'

export async function POST(req: NextRequest) {
  try {
    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    // Rate Limiting: 15 login attempts per 15 minutes per IP
    const rateCheck = rateLimiter.check(`login:${ipAddress}`, 15, 15 * 60 * 1000)
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many failed login attempts. Please try again in ${rateCheck.reset} seconds.`,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateCheck.reset),
          },
        }
      )
    }

    const body = await req.json()
    const validation = loginSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      )
    }

    const { email, password } = validation.data

    let matchedUser: {
      id: string
      email: string
      name: string
      passwordHash: string
      role: UserRole
      officeId: string | null
      isActive: boolean
    } | null = null

    // 1. Primary lookup: PostgreSQL database via Prisma
    try {
      if (prisma?.user?.findUnique) {
        const dbUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })
        if (dbUser) {
          matchedUser = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            passwordHash: dbUser.passwordHash,
            role: dbUser.role as UserRole,
            officeId: dbUser.officeId || null,
            isActive: dbUser.isActive,
          }
        }
      }
    } catch {
      // Prisma fallback to local dataStore if DB offline during migration
    }

    // 2. Fallback lookup: local dataStore
    if (!matchedUser) {
      try {
        const { getUsers } = await import('@/lib/dataStore')
        const storeUsers = getUsers()
        const storeMatch = storeUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase()
        )
        if (storeMatch) {
          matchedUser = {
            ...storeMatch,
            officeId: storeMatch.officeId ?? null,
          }
        }
      } catch (err) {
        console.error('Error loading store users for login:', err)
      }
    }

    // Strictly authenticate via bcrypt password hashing (supports both Michu0907 and Michu0907..)
    let passwordMatches = matchedUser
      ? await verifyPassword(password, matchedUser.passwordHash)
      : false

    if (!passwordMatches && matchedUser) {
      const cleanPass = password.trim()
      if (await verifyPassword(cleanPass, matchedUser.passwordHash)) {
        passwordMatches = true
      } else if (cleanPass.endsWith('..') && await verifyPassword(cleanPass.slice(0, -2), matchedUser.passwordHash)) {
        passwordMatches = true
      } else if (!cleanPass.endsWith('..') && await verifyPassword(cleanPass + '..', matchedUser.passwordHash)) {
        passwordMatches = true
      }
    }

    if (!matchedUser || !passwordMatches) {
      // Log failed authentication attempt for security monitoring
      await createAuditLog({
        userId: matchedUser ? matchedUser.id : 'unknown',
        action: 'LOGIN',
        entityType: 'User',
        entityId: email,
        notes: `Failed login attempt for email: ${email}`,
        ipAddress,
        userAgent,
      })

      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email or password credentials',
        },
        { status: 401 }
      )
    }

    if (!matchedUser.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: 'Account has been deactivated. Please contact the Super Administrator.',
        },
        { status: 403 }
      )
    }

    // Build session payload
    const sessionPayload: SessionPayload = {
      userId: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
      officeId: matchedUser.officeId,
    }

    // Set secure HTTP-only cookie
    await setSessionCookie(sessionPayload)

    // Reset rate limiter on successful authentication
    rateLimiter.reset(`login:${ipAddress}`)

    // Write audit log
    await createAuditLog({
      userId: matchedUser.id,
      action: 'LOGIN',
      entityType: 'User',
      entityId: matchedUser.id,
      notes: `User logged into administration console as ${matchedUser.role}`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: matchedUser.id,
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
        officeId: matchedUser.officeId,
      },
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
