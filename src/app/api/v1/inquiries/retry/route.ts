import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import {
  getInquiryByTrackingCode,
  updateInquiryEmailStatus,
} from '@/lib/dataStore'
import {
  sendAdminInquiryNotification,
  sendCitizenConfirmationNotification,
} from '@/lib/email'
import { createAuditLog, getClientIp } from '@/lib/audit'

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized: Staff session required' }, { status: 401 })
    }

    if (session.role === 'VIEWER') {
      return NextResponse.json({ success: false, error: 'Forbidden: Insufficient privileges' }, { status: 403 })
    }

    const body = await req.json()
    const { trackingCode, target = 'both' } = body

    if (!trackingCode) {
      return NextResponse.json({ success: false, error: 'trackingCode is required' }, { status: 400 })
    }

    const inquiry = getInquiryByTrackingCode(trackingCode)
    if (!inquiry) {
      return NextResponse.json({ success: false, error: 'Inquiry record not found' }, { status: 404 })
    }

    let adminSent = inquiry.adminNotificationSent ?? false
    let citizenSent = inquiry.citizenConfirmationSent ?? false
    const errors: string[] = []

    // 1. Retry Admin Notification if requested and not yet sent (or forced)
    if (target === 'admin' || target === 'both') {
      try {
        const res = await sendAdminInquiryNotification(inquiry)
        if (res.success) {
          adminSent = true
        } else {
          errors.push(`Admin notice failed: ${res.error}`)
        }
      } catch (err: any) {
        errors.push(`Admin dispatch error: ${err.message}`)
      }
    }

    // 2. Retry Citizen Confirmation if requested
    if (target === 'citizen' || target === 'both') {
      try {
        const res = await sendCitizenConfirmationNotification(inquiry)
        if (res.success) {
          citizenSent = true
        } else {
          errors.push(`Citizen notice failed: ${res.error}`)
        }
      } catch (err: any) {
        errors.push(`Citizen dispatch error: ${err.message}`)
      }
    }

    const updated = updateInquiryEmailStatus(trackingCode, {
      adminNotificationSent: adminSent,
      citizenConfirmationSent: citizenSent,
      emailError: errors.length > 0 ? errors.join(' | ') : null,
      incrementAttempts: true,
    })

    const ipAddress = getClientIp(req.headers)
    await createAuditLog({
      userId: session.userId,
      action: 'UPDATE',
      entityType: 'InquiryEmailRetry',
      entityId: trackingCode,
      notes: `Staff ${session.name} triggered email retry for ticket ${trackingCode}. Results: Admin=${adminSent}, Citizen=${citizenSent}`,
      ipAddress,
    })

    return NextResponse.json({
      success: adminSent || citizenSent,
      adminNotificationSent: adminSent,
      citizenConfirmationSent: citizenSent,
      emailError: errors.length > 0 ? errors.join(' | ') : null,
      data: updated,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
