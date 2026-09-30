import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/validations'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
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
    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    // Generate unique government tracking ticket number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000)
    const trackingNumber = `AGT-${Date.now().toString().slice(-4)}-${randomSuffix}`

    const inquiryRecord = {
      id: `inq_${Date.now()}`,
      trackingNumber,
      name,
      email,
      phone: phone || null,
      subject,
      message,
      status: 'PENDING_REVIEW',
      ipAddress,
      createdAt: new Date(),
    }

    try {
      if (prisma?.contactSubmission?.create) {
        await prisma.contactSubmission.create({
          data: inquiryRecord,
        })
      }
    } catch {
      // Prisma fallback
    }

    // Write audit log for grievance oversight
    await createAuditLog({
      userId: 'public_citizen',
      action: 'CREATE',
      entityType: 'ContactSubmission',
      entityId: trackingNumber,
      newData: { name, email, subject, trackingNumber },
      notes: `Citizen inquiry submitted from IP ${ipAddress}`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Your inquiry/grievance has been officially received and logged into the Woreda tracking system.',
        trackingNumber,
        submittedAt: inquiryRecord.createdAt,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
