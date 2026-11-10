import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  getInquiryByTrackingCode,
  updateInquiryEmailStatus,
} from '@/lib/dataStore'
import {
  sendAdminInquiryNotification,
  sendCitizenConfirmationNotification,
  isValidEmail,
  sanitizeHeader,
} from '@/lib/email'
import { rateLimiter } from '@/lib/rateLimit'
import { getClientIp } from '@/lib/audit'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const trackingCode = searchParams.get('trackingCode')

    // 1. Public Citizen Tracking Lookup
    // Security & Privacy: Never leak citizen email, phone, full message, or internal admin notes to public lookup!
    if (trackingCode) {
      const inquiry = getInquiryByTrackingCode(trackingCode)
      if (!inquiry) {
        return NextResponse.json(
          { success: false, error: 'Tracking reference code not found. Please verify the code.' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          trackingCode: inquiry.trackingCode,
          subject: inquiry.subject,
          category: inquiry.category,
          status: inquiry.status,
          responseNotes: inquiry.responseNotes || null, // Official public response only
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt,
        },
      })
    }

    // 2. Administrative Console Access (requires authenticated staff session)
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Staff authentication required' },
        { status: 401 }
      )
    }

    const inquiries = getInquiries()
    return NextResponse.json({ success: true, data: inquiries, total: inquiries.length })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ipAddress = getClientIp(req.headers)

    // Rate Limiting: 10 inquiries per 15 minutes per IP
    const rateCheck = rateLimiter.check(`inquiry:${ipAddress}`, 10, 15 * 60 * 1000)
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many submissions. Please wait ${rateCheck.reset} seconds before submitting again.`,
        },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, email, phone, subject, message, category } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Full name, email address, subject, and message are required.' },
        { status: 400 }
      )
    }

    const cleanEmail = email.trim()
    if (!isValidEmail(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid, well-formed email address.' },
        { status: 400 }
      )
    }

    // Clean inputs and guard against header injection
    const cleanName = sanitizeHeader(name)
    const cleanSubject = sanitizeHeader(subject)
    const cleanPhone = phone ? sanitizeHeader(phone) : undefined
    const cleanCategory = category ? sanitizeHeader(category) : 'grievance'

    // STEP 1: Persist inquiry to database first (Fail-safe: submission never lost even if email fails)
    const created = createInquiry({
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: message.trim(),
      category: cleanCategory,
      status: 'RECEIVED',
      ipAddress,
    })

    // STEP 2: Dispatch notifications to Admin and Citizen
    let adminSent = false
    let citizenSent = false
    const emailErrors: string[] = []

    try {
      const [adminResult, citizenResult] = await Promise.allSettled([
        sendAdminInquiryNotification(created),
        sendCitizenConfirmationNotification(created),
      ])

      if (adminResult.status === 'fulfilled' && adminResult.value.success) {
        adminSent = true
      } else if (adminResult.status === 'fulfilled' && !adminResult.value.success) {
        emailErrors.push(`Admin notice failed: ${adminResult.value.error}`)
      } else if (adminResult.status === 'rejected') {
        emailErrors.push(`Admin notice exception: ${adminResult.reason?.message || 'Unknown'}`)
      }

      if (citizenResult.status === 'fulfilled' && citizenResult.value.success) {
        citizenSent = true
      } else if (citizenResult.status === 'fulfilled' && !citizenResult.value.success) {
        emailErrors.push(`Citizen notice failed: ${citizenResult.value.error}`)
      } else if (citizenResult.status === 'rejected') {
        emailErrors.push(`Citizen notice exception: ${citizenResult.reason?.message || 'Unknown'}`)
      }
    } catch (dispatchErr: any) {
      emailErrors.push(`Email dispatcher exception: ${dispatchErr.message}`)
    }

    // STEP 3: Record exact notification delivery status on the inquiry
    updateInquiryEmailStatus(created.trackingCode, {
      adminNotificationSent: adminSent,
      citizenConfirmationSent: citizenSent,
      emailError: emailErrors.length > 0 ? emailErrors.join(' | ') : null,
      incrementAttempts: true,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry has been officially recorded in the Woreda registry.',
        trackingCode: created.trackingCode,
        adminNotified: adminSent,
        citizenNotified: citizenSent,
        emailStatus: emailErrors.length === 0 ? 'DELIVERED' : 'PARTIALLY_DELIVERED_OR_QUEUED',
        data: {
          trackingCode: created.trackingCode,
          status: 'RECEIVED',
          createdAt: created.createdAt,
        },
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (session.role === 'VIEWER') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Viewers have read-only administrative inspection rights' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { id, status, responseNotes, internalNotes, assignedOfficeId, assignedStaffName } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 })
    }

    const updated = updateInquiryStatus(
      id,
      status,
      responseNotes,
      assignedOfficeId,
      session.name,
      internalNotes,
      assignedStaffName
    )

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Inquiry record not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
