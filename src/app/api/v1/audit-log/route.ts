import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getAuditLogs } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { session, errorResponse } = await requireAuth(['SUPER_ADMIN', 'ADMIN'])
    if (errorResponse) return errorResponse

    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action')
    const entityType = searchParams.get('entityType')
    const q = searchParams.get('q')?.toLowerCase()
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '50', 10)))

    let logs = getAuditLogs()

    if (action && action !== 'ALL') {
      logs = logs.filter((l: any) => l.action === action)
    }

    if (entityType && entityType !== 'ALL') {
      logs = logs.filter((l: any) => l.entityType?.toLowerCase() === entityType.toLowerCase())
    }

    if (q) {
      logs = logs.filter(
        (l: any) =>
          l.notes?.toLowerCase().includes(q) ||
          l.userName?.toLowerCase().includes(q) ||
          l.entityId?.toLowerCase().includes(q) ||
          l.entityType?.toLowerCase().includes(q) ||
          l.ipAddress?.includes(q)
      )
    }

    const total = logs.length
    const startIndex = (page - 1) * limit
    const paginated = logs.slice(startIndex, startIndex + limit)

    return NextResponse.json({
      success: true,
      data: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
