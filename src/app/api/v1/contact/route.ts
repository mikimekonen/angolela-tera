import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { prisma } from '@/lib/db'
import { createInquiry } from '@/lib/dataStore'
import { rateLimiter } from '@/lib/rateLimit'
import { sendCitizenSMSNotification } from '@/lib/notifications'
import { sendGovernmentEmail, isValidEmail } from '@/lib/email'

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

    // Dispatch official email notification to Woreda admin mailbox (angolelatera1@gmail.com)
    if (isValidEmail(email)) {
      sendGovernmentEmail({
        to: process.env.CONTACT_TO_EMAIL || 'angolelatera1@gmail.com',
        replyTo: email,
        subject: `[Citizen Portal Inquiry #${inquiryItem.trackingCode}] ${subject}`,
        text: `Official Citizen Inquiry Details:
Tracking Code: ${inquiryItem.trackingCode}
Citizen Name: ${name}
Email Address: ${email}
Telephone: ${phone || 'Not provided'}
Subject: ${subject}
Date Submitted: ${new Date().toLocaleString()}
IP Address: ${ipAddress}

Message Statement:
${message}
`,
      }).catch((err) => console.error('[Email Dispatch Error]:', err))
    }

    return NextResponse.json(
      {
        success: true,
        message:
          'Your inquiry/grievance has been officially received and logged into the Woreda tracking system.',
        trackingNumber: inquiryItem.trackingCode,
        trackingCode: inquiryItem.trackingCode,
        submittedAt: inquiryItem.createdAt,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
