import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { prisma } from '@/lib/db'
import { createInquiry, updateInquiryEmailStatus } from '@/lib/dataStore'
import { rateLimiter } from '@/lib/rateLimit'
import {
  sendAdminInquiryNotification,
  sendCitizenConfirmationNotification,
  isValidEmail,
  sanitizeHeader,
} from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    // Rate Limiting: 5 submissions per hour per IP to prevent spam attacks
    const rateCheck = rateLimiter.check(`contact:${ipAddress}`, 5, 60 * 60 * 1000)
    if (!rateCheck.success) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many inquiries submitted from this connection. Please try again in ${rateCheck.reset} seconds.`,
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
    const validation = contactFormSchema.safeParse(body)

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

    const { name, email, phone, subject, message } = validation.data

    // Persist inquiry to dataStore for immediate Super Admin visibility
    const inquiryItem = createInquiry({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
      category: 'grievance',
      status: 'SUBMITTED',
      ipAddress,
    })

    // Also attempt PostgreSQL write if active
    try {
      if (prisma?.contactSubmission?.create) {
        await prisma.contactSubmission.create({
          data: {
            id: inquiryItem.id,
            name,
            email,
            phone: phone || null,
            subject,
            message,
            status: 'unread',
            ipAddress,
            createdAt: new Date(),
          },
        })
      }
    } catch {
      // Prisma DB write fallback handled by dataStore
    }

    // Write audit log for institutional oversight
    await createAuditLog({
      userId: 'public_citizen',
      action: 'CREATE',
      entityType: 'CitizenInquiry',
      entityId: inquiryItem.trackingCode,
      newData: { name, email, subject, trackingNumber: inquiryItem.trackingCode },
      notes: `Citizen inquiry submitted from IP ${ipAddress}`,
      ipAddress,
      userAgent,
    })

    // Dispatch official email notification to Woreda admin & citizen
    let adminSent = false
    let citizenSent = false
    const emailErrors: string[] = []

    try {
      const [adminResult, citizenResult] = await Promise.allSettled([
        sendAdminInquiryNotification(inquiryItem),
        sendCitizenConfirmationNotification(inquiryItem),
      ])

      if (adminResult.status === 'fulfilled' && adminResult.value.success) {
        adminSent = true
      } else if (adminResult.status === 'fulfilled' && !adminResult.value.success) {
        emailErrors.push(`Admin notice failed: ${adminResult.value.error}`)
      }

      if (citizenResult.status === 'fulfilled' && citizenResult.value.success) {
        citizenSent = true
      } else if (citizenResult.status === 'fulfilled' && !citizenResult.value.success) {
        emailErrors.push(`Citizen notice failed: ${citizenResult.value.error}`)
      }
    } catch (err: any) {
      emailErrors.push(`Email dispatcher error: ${err.message}`)
    }

    updateInquiryEmailStatus(inquiryItem.trackingCode, {
      adminNotificationSent: adminSent,
      citizenConfirmationSent: citizenSent,
      emailError: emailErrors.length > 0 ? emailErrors.join(' | ') : null,
      incrementAttempts: true,
    })

    return NextResponse.json(
      {
        success: true,
        message:
          'Your inquiry/grievance has been officially received and logged into the Woreda tracking system.',
        trackingNumber: inquiryItem.trackingCode,
        trackingCode: inquiryItem.trackingCode,
        adminNotified: adminSent,
        citizenNotified: citizenSent,
        submittedAt: inquiryItem.createdAt,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
