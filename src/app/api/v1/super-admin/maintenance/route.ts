import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import {
  getMaintenanceStatus,
  setMaintenanceMode,
  getMaintenanceHistory,
} from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  const { errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const status = getMaintenanceStatus()
    const history = getMaintenanceHistory()

    return NextResponse.json({
      success: true,
      status,
      history,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve maintenance data' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  const { session, errorResponse } = await requireAuth(['SUPER_ADMIN'])
  if (errorResponse) return errorResponse

  try {
    const body = await req.json()
    const {
      enable,
      confirmationText,
      reason,
      announcement_en,
      announcement_am,
      expectedReopening,
    } = body

    if (enable) {
      // Safety confirmation keyword check
      if (confirmationText !== 'MAINTENANCE') {
        return NextResponse.json(
          {
            success: false,
            error: 'Safety Guard: You must type the word "MAINTENANCE" exactly to activate emergency maintenance mode.',
          },
          { status: 400 }
        )
      }
    }

    const result = setMaintenanceMode({
      enable: Boolean(enable),
      actor: session.email,
      reason,
      announcement_en,
      announcement_am,
      expectedReopening,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message || 'Operation failed' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: enable
        ? 'Emergency Maintenance Mode has been ACTIVATED. Public portal and standard staff logins are now disabled.'
        : 'Maintenance Mode has been DEACTIVATED. Public portal and normal staff access are fully restored.',
      event: result.event,
    })
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Maintenance action failed' },
      { status: 500 }
    )
  }
}
