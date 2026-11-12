import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSystemActivityLogs } from '@/lib/dataStore'

export const dynamic = 'force-dynamic'

function escapeCsvField(val: any): string {
  if (val === null || val === undefined) return '""'
  const str = String(val).replace(/"/g, '""')
  return `"${str}"`
}

export async function GET(request: Request) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category') as any || 'ALL'
  const result = searchParams.get('result') as any || 'ALL'
  const search = searchParams.get('search') || undefined

  const logs = getSystemActivityLogs({
    category,
    result,
    search,
    limit: 5000, // Export up to 5000 records
  })

  // Build CSV content
  const headers = [
    'Log ID',
    'Timestamp (UTC)',
    'Category',
    'Action',
    'User Name',
    'User ID',
    'User Role',
    'Entity Type',
    'Entity ID',
    'IP Address',
    'Result',
    'Audit Notes / Description',
  ]

  const rows = logs.map((l) => [
    escapeCsvField(l.id),
    escapeCsvField(l.createdAt),
    escapeCsvField(l.category),
    escapeCsvField(l.action),
    escapeCsvField(l.userName),
    escapeCsvField(l.userId),
    escapeCsvField(l.userRole || 'N/A'),
    escapeCsvField(l.entityType || 'General'),
    escapeCsvField(l.entityId || 'N/A'),
    escapeCsvField(l.ipAddress || '127.0.0.1'),
    escapeCsvField(l.result),
    escapeCsvField(l.notes || ''),
  ])

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n')

  const dateStr = new Date().toISOString().split('T')[0]
  const filename = `angolela-tera-audit-log-${dateStr}.csv`

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  })
}
