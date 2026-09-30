/**
 * Audit logging helper.
 * Call this server-side in any API route or server action that mutates data.
 */

import { prisma } from '@/lib/db'

export type AuditAction =
  | 'CREATE'
  | 'UPDATE'
  | 'DELETE'
  | 'PUBLISH'
  | 'ARCHIVE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'PASSWORD_RESET'

interface AuditOptions {
  userId:     string
  action:     AuditAction
  entityType: string
  entityId?:  string
  oldData?:   Record<string, unknown>
  newData?:   Record<string, unknown>
  notes?:     string
  ipAddress?: string
  userAgent?: string
}

export async function createAuditLog(opts: AuditOptions): Promise<void> {
  try {
    if (prisma?.auditLog?.create) {
      await prisma.auditLog.create({
        data: {
          userId:     opts.userId,
          action:     opts.action,
          entityType: opts.entityType,
          entityId:   opts.entityId,
          oldData:    opts.oldData ?? undefined,
          newData:    opts.newData ?? undefined,
          notes:      opts.notes,
          ipAddress:  opts.ipAddress,
          userAgent:  opts.userAgent,
        },
      })
    }
  } catch (error) {
    // Audit log failures must never break the main operation.
    console.error('[AuditLog] Failed to write audit entry:', error)
  }
}

/**
 * Extract IP address from Next.js request headers.
 * Respects x-forwarded-for for proxy/load-balancer deployments.
 */
export function getClientIp(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    headers.get('x-real-ip') ??
    'unknown'
  )
}
