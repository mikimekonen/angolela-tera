import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { UserRole, SessionPayload } from '@/types'

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET
  if (
    process.env.NODE_ENV === 'production' &&
    (!secret ||
      secret === 'angolela-tera-woreda-gov-portal-secret-key-2026' ||
      secret.includes('change-in-production'))
  ) {
    console.error(
      '🚨 CRITICAL SECURITY WARNING: Weak or default JWT_SECRET detected in production! Please generate a strong 64+ char random secret.'
    )
  }
  return secret || 'angolela-tera-woreda-gov-portal-secret-key-2026'
}

const JWT_SECRET = getJwtSecret()
const COOKIE_NAME = 'admin_session'

// Password Utilities
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// HMAC-SHA256 Token Helpers (Edge and Node compatible)
async function getCryptoKey(): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const keyData = encoder.encode(JWT_SECRET)
  return crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  while (base64.length % 4) {
    base64 += '='
  }
  return Buffer.from(base64, 'base64').toString('utf8')
}

export async function createSessionToken(payload: SessionPayload, expiresInSeconds = 86400 * 7): Promise<string> {
  const header = JSON.stringify({ alg: 'HS256', typ: 'JWT' })
  const now = Math.floor(Date.now() / 1000)
  const fullPayload = JSON.stringify({
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  })

  const encodedHeader = base64UrlEncode(header)
  const encodedPayload = base64UrlEncode(fullPayload)
  const dataToSign = `${encodedHeader}.${encodedPayload}`

  const key = await getCryptoKey()
  const encoder = new TextEncoder()
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(dataToSign))
  const signature = Buffer.from(signatureBuffer)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${dataToSign}.${signature}`
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [encodedHeader, encodedPayload, signature] = parts
    const dataToSign = `${encodedHeader}.${encodedPayload}`

    const key = await getCryptoKey()

    // Reconstruct signature buffer
    let base64Sig = signature.replace(/-/g, '+').replace(/_/g, '/')
    while (base64Sig.length % 4) {
      base64Sig += '='
    }
    const sigBuffer = Buffer.from(base64Sig, 'base64')

    const encoder = new TextEncoder()
    const isValid = await crypto.subtle.verify('HMAC', key, sigBuffer, encoder.encode(dataToSign))
    if (!isValid) return null

    const payloadJson = base64UrlDecode(encodedPayload)
    const payload = JSON.parse(payloadJson)

    // Check expiration
    const now = Math.floor(Date.now() / 1000)
    if (payload.exp && payload.exp < now) {
      return null
    }

    return {
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
      role: payload.role as UserRole,
      officeId: payload.officeId || null,
    }
  } catch {
    return null
  }
}

// Next.js Server Cookie Helpers
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return null
    return await verifySessionToken(token)
  } catch {
    return null
  }
}

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = await createSessionToken(payload)
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

// Role-Based Access Control (RBAC) Permissions Matrix
export const ROLE_PERMISSIONS: Record<UserRole, {
  canCreate: boolean
  canEditAll: boolean
  canApprove: boolean
  canPublish: boolean
  canManageUsers: boolean
  canAccessAdmin: boolean
}> = {
  SUPER_ADMIN: {
    canCreate: true,
    canEditAll: true,
    canApprove: true,
    canPublish: true,
    canManageUsers: true,
    canAccessAdmin: true,
  },
  ADMIN: {
    canCreate: true,
    canEditAll: true,
    canApprove: true,
    canPublish: true,
    canManageUsers: false,
    canAccessAdmin: true,
  },
  OFFICE_EDITOR: {
    canCreate: true,
    canEditAll: false, // only own office
    canApprove: false,
    canPublish: false,
    canManageUsers: false,
    canAccessAdmin: true,
  },
  REVIEWER: {
    canCreate: false,
    canEditAll: false,
    canApprove: true,
    canPublish: false,
    canManageUsers: false,
    canAccessAdmin: true,
  },
  VIEWER: {
    canCreate: false,
    canEditAll: false,
    canApprove: false,
    canPublish: false,
    canManageUsers: false,
    canAccessAdmin: true,
  },
}

export function hasPermission(
  role: UserRole,
  action: keyof typeof ROLE_PERMISSIONS['SUPER_ADMIN']
): boolean {
  return ROLE_PERMISSIONS[role]?.[action] ?? false
}

/**
 * Verifies that the current request has an active session and, optionally, one of the allowed roles.
 * Returns { session } on success, or { errorResponse } if unauthenticated/unauthorized.
 */
export async function requireAuth(allowedRoles?: UserRole[]) {
  const session = await getSession()
  if (!session) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Administrative authentication required' },
        { status: 401 }
      ),
    }
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(session.role)) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `Forbidden: Action requires one of [${allowedRoles.join(', ')}] roles. Current role: ${session.role}.`,
        },
        { status: 403 }
      ),
    }
  }

  return { session, errorResponse: null }
}

/**
 * Verifies that the current request has an active session with the specified granular permission.
 */
export async function requirePermission(action: keyof (typeof ROLE_PERMISSIONS)['SUPER_ADMIN']) {
  const session = await getSession()
  if (!session) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        { success: false, error: 'Unauthorized: Administrative authentication required' },
        { status: 401 }
      ),
    }
  }

  if (!hasPermission(session.role, action)) {
    return {
      session: null,
      errorResponse: NextResponse.json(
        {
          success: false,
          error: `Forbidden: Insufficient privileges for action '${action}'. Current role: ${session.role}.`,
        },
        { status: 403 }
      ),
    }
  }

  return { session, errorResponse: null }
}
