import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import {
  getInquiries,
  createInquiry,
  updateInquiryStatus,
  getInquiryByTrackingCode,
} from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const trackingCode = searchParams.get('trackingCode')

    // If tracking code is requested, anyone with the code can check status (citizen lookup)
    if (trackingCode) {
      const inquiry = getInquiryByTrackingCode(trackingCode)
      if (!inquiry) {
        return NextResponse.json({ success: false, error: 'Tracking code not found' }, { status: 404 })
      }
      return NextResponse.json({
        success: true,
        data: {
          trackingCode: inquiry.trackingCode,
          subject: inquiry.subject,
          status: inquiry.status,
          responseNotes: inquiry.responseNotes,
          createdAt: inquiry.createdAt,
          updatedAt: inquiry.updatedAt,
        },
      })
    }

    // Otherwise, must be logged in as admin to view all grievances
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
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
    const body = await req.json()
    const { name, email, phone, subject, message, category } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Name, email, subject, and message are required' },
        { status: 400 }
      )
    }

    const created = createInquiry({
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'grievance',
      status: 'SUBMITTED',
    })

    return NextResponse.json({
      success: true,
      message: 'Your inquiry has been submitted to the Woreda administration.',
      trackingCode: created.trackingCode,
      data: created,
    }, { status: 201 })
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

    const body = await req.json()
    const { id, status, responseNotes, assignedOfficeId } = body

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'id and status are required' }, { status: 400 })
    }

    const updated = updateInquiryStatus(id, status, responseNotes, assignedOfficeId, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Inquiry record not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
