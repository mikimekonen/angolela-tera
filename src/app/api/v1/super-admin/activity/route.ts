import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSystemActivityLogs, ActivityCategory } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const url = new URL(req.url)
    const category = (url.searchParams.get('category') || 'ALL') as ActivityCategory | 'ALL'
    const result = (url.searchParams.get('result') || 'ALL') as 'SUCCESS' | 'FAILURE' | 'ALL'
    const search = url.searchParams.get('search') || ''
    const limit = parseInt(url.searchParams.get('limit') || '50', 10)

    const logs = getSystemActivityLogs({
      category,
      result,
      search,
      limit,
    })

    return NextResponse.json({
      success: true,
      logs,
      total: logs.length,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch activity logs' },
      { status: 500 }
    )
  }
}
