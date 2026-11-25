import { NextRequest, NextResponse } from 'next/server'
import { loginSchema } from '@/lib/validations'
import { verifyPassword, setSessionCookie } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { prisma } from '@/lib/db'
import { rateLimiter } from '@/lib/rateLimit'
import {
  getUsers,
  getMaintenanceStatus,
  recordLoginAttempt,
  logSystemActivity,
  UserAccount,
} from '@/lib/dataStore'
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

    let matchedUser: (UserAccount & { id: string }) | null = null
    let authenticatedViaPrisma = false

    // 1. Primary lookup: PostgreSQL database via Prisma
    try {
      if (process.env.DATABASE_URL && prisma?.user?.findUnique) {
        const dbUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        })
        if (dbUser && !dbUser.deletedAt) {
          authenticatedViaPrisma = true
          matchedUser = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            passwordHash: dbUser.passwordHash,
            role: dbUser.role as UserRole,
            officeId: dbUser.officeId || null,
            isActive: dbUser.isActive,
            createdAt: dbUser.createdAt.toISOString(),
            tokenVersion: typeof dbUser.tokenVersion === 'number' ? dbUser.tokenVersion : 1,
            mustChangePassword: Boolean(dbUser.mustChangePassword),
            failedLoginAttempts:
              typeof dbUser.failedLoginAttempts === 'number' ? dbUser.failedLoginAttempts : 0,
            lockedUntil: dbUser.lockedUntil ? dbUser.lockedUntil.toISOString() : undefined,
            phone: dbUser.phone ?? undefined,
            designation: dbUser.designation ?? undefined,
            avatarUrl: dbUser.avatarUrl ?? undefined,
          }
        }
      }
    } catch {
      // Prisma fallback to local dataStore if DB offline during migration
    }

    // 2. Fallback lookup: local dataStore
    if (!matchedUser) {
      try {
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

    // Check account lockout status before checking password
    if (matchedUser?.lockedUntil) {
      const lockExpiry = new Date(matchedUser.lockedUntil)
      if (lockExpiry > new Date()) {
        const waitMinutes = Math.ceil((lockExpiry.getTime() - Date.now()) / 60000)
        logSystemActivity({
          userId: matchedUser.id,
          userName: matchedUser.name,
          userRole: matchedUser.role,
          action: 'LOGIN_BLOCKED_LOCKOUT',
          category: 'SYSTEM_SECURITY',
          entityType: 'User',
          entityId: matchedUser.email,
          notes: `Login rejected for locked account [${matchedUser.email}]. Lock expires in ${waitMinutes}m.`,
          ipAddress,
          userAgent,
          result: 'FAILURE',
          severity: 'WARNING',
        })
        return NextResponse.json(
          {
            success: false,
            error: `Account is temporarily locked due to repeated failed logins. Please try again in ${waitMinutes} minute(s) or contact the Super Administrator.`,
          },
          { status: 423 }
        )
      }
    }

    // Strictly authenticate via standard bcrypt password hashing: one account, exactly one valid password
    const passwordMatches = matchedUser
      ? await verifyPassword(password, matchedUser.passwordHash)
      : false

    if (!matchedUser || !passwordMatches) {
      if (matchedUser) {
        recordLoginAttempt(matchedUser.id, false, ipAddress)
        if (authenticatedViaPrisma && process.env.DATABASE_URL && prisma?.user?.update) {
          const nextAttempts = (matchedUser.failedLoginAttempts || 0) + 1
          await prisma.user
            .update({
              where: { id: matchedUser.id },
              data: {
                failedLoginAttempts: nextAttempts,
                lockedUntil:
                  nextAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : undefined,
              },
            })
            .catch(() => {})
        }
      }

      // Log failed authentication attempt for security monitoring
      logSystemActivity({
        userId: matchedUser ? matchedUser.id : 'unknown',
        userName: matchedUser ? matchedUser.name : email,
        action: 'LOGIN_FAILED',
        category: 'SYSTEM_SECURITY',
        entityType: 'User',
        entityId: email,
        notes: `Failed login attempt for [${email}] from IP: ${ipAddress}`,
        ipAddress,
        userAgent,
        result: 'FAILURE',
        severity: 'WARNING',
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
      logSystemActivity({
        userId: matchedUser.id,
        userName: matchedUser.name,
        userRole: matchedUser.role,
        action: 'LOGIN_BLOCKED_SUSPENDED',
        category: 'SYSTEM_SECURITY',
        entityType: 'User',
        entityId: matchedUser.email,
        notes: `Suspended account [${matchedUser.email}] attempted login.`,
        ipAddress,
        userAgent,
        result: 'FAILURE',
        severity: 'WARNING',
      })
      return NextResponse.json(
        {
          success: false,
          error: 'This account has been suspended by the Government Super Administrator.',
        },
        { status: 403 }
      )
    }

    // 3. Maintenance Mode Check:
    // If maintenance mode is active, ONLY SUPER_ADMIN is allowed to access the console
    const maint = getMaintenanceStatus()
    if (maint.isActive && matchedUser.role !== 'SUPER_ADMIN') {
      logSystemActivity({
        userId: matchedUser.id,
        userName: matchedUser.name,
        userRole: matchedUser.role,
        action: 'LOGIN_BLOCKED_MAINTENANCE',
        category: 'SYSTEM_SECURITY',
        entityType: 'User',
        entityId: matchedUser.email,
        notes: `Staff login blocked during Emergency Maintenance Mode: [${matchedUser.email} (${matchedUser.role})].`,
        ipAddress,
        userAgent,
        result: 'FAILURE',
        severity: 'WARNING',
      })
      return NextResponse.json(
        {
          success: false,
          error: 'The government portal is undergoing scheduled administrative maintenance. Staff access is temporarily restricted to Super Administrators.',
          isMaintenance: true,
          expectedReopening: maint.currentEvent?.expectedReopening,
        },
        { status: 503 }
      )
    }

    // Record successful login
    recordLoginAttempt(matchedUser.id, true, ipAddress)
    if (authenticatedViaPrisma && process.env.DATABASE_URL && prisma?.user?.update) {
      await prisma.user
        .update({
          where: { id: matchedUser.id },
          data: {
            failedLoginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date(),
          },
        })
        .catch(() => {})
    }

    // Build session payload with tokenVersion
    const sessionPayload: SessionPayload = {
      userId: matchedUser.id,
      email: matchedUser.email,
      name: matchedUser.name,
      role: matchedUser.role,
      officeId: matchedUser.officeId,
      tokenVersion: matchedUser.tokenVersion || 1,
      mustChangePassword: Boolean(matchedUser.mustChangePassword),
    }

    // Set secure HTTP-only cookie
    await setSessionCookie(sessionPayload)

    // Reset rate limiter on successful authentication
    rateLimiter.reset(`login:${ipAddress}`)

    // Write audit & activity log
    logSystemActivity({
      userId: matchedUser.id,
      userName: matchedUser.name,
      userRole: matchedUser.role,
      action: 'LOGIN_SUCCESS',
      category: 'SYSTEM_SECURITY',
      entityType: 'User',
      entityId: matchedUser.id,
      notes: `Administrator logged into government portal as [${matchedUser.role}]`,
      ipAddress,
      userAgent,
      result: 'SUCCESS',
      severity: 'INFO',
    })
    if (authenticatedViaPrisma) {
      await createAuditLog({
        userId: matchedUser.id,
        action: 'LOGIN',
        entityType: 'User',
        entityId: matchedUser.id,
        notes: `Administrator logged into government portal as [${matchedUser.role}]`,
        ipAddress,
        userAgent,
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: matchedUser.id,
        email: matchedUser.email,
        name: matchedUser.name,
        role: matchedUser.role,
        officeId: matchedUser.officeId,
        mustChangePassword: Boolean(matchedUser.mustChangePassword),
      },
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    console.error('🚨 [AUTH_LOGIN_ERROR]:', message)
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    )
  }
}
