import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getSuperAdminDashboardMetrics } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const metrics = getSuperAdminDashboardMetrics()
    return NextResponse.json({
      success: true,
      data: metrics,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch dashboard metrics' },
      { status: 500 }
    )
  }
}
