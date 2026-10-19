import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { getOffices, createOffice, updateOffice, deleteOffice } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()

    let offices = getOffices()

    if (q) {
      offices = offices.filter(
        (o: any) =>
          o.name_en?.toLowerCase().includes(q) ||
          (o.name_am && o.name_am.includes(q)) ||
          (o.name_om && o.name_om.toLowerCase().includes(q)) ||
          o.slug?.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({
      success: true,
      data: offices,
      total: offices.length,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    if (!hasPermission(session.role, 'canCreate')) {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Insufficient permissions to create sector offices' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.slug || !body.name_en) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug and name_en are required' },
        { status: 400 }
      )
    }

    const newOffice = {
      slug: body.slug,
      name_en: body.name_en,
      name_am: body.name_am || body.name_en,
      name_om: body.name_om || body.name_en,
      head_en: body.head_en || 'Head of Directorate',
      head_am: body.head_am || 'የዳይሬክቶሬት ሃላፊ',
      head_om: body.head_om || 'Hogganaa Daayirektooreetii',
      headTitle_en: body.headTitle_en || 'Sector Bureau Head',
      headTitle_am: body.headTitle_am || 'የዘርፍ ቢሮ ሃላፊ',
      headTitle_om: body.headTitle_om || 'Hogganaa Biiroo',
      phone: body.phone || '+251 58 661 0100',
      email: body.email || `info@angolela-tera.gov.et`,
      location_en: body.location_en || 'Woreda Main Administration Complex, Chacha',
      location_am: body.location_am || 'የወረዳው ዋና አስተዳደር ግቢ፣ ጫቻ',
      location_om: body.location_om || 'Caccetti',
      about_en: body.about_en || '',
      about_am: body.about_am || '',
      about_om: body.about_om || '',
      responsibilities_en: Array.isArray(body.responsibilities_en) ? body.responsibilities_en : [],
      responsibilities_am: Array.isArray(body.responsibilities_am) ? body.responsibilities_am : [],
      responsibilities_om: Array.isArray(body.responsibilities_om) ? body.responsibilities_om : [],
      servicesProvided_en: Array.isArray(body.servicesProvided_en) ? body.servicesProvided_en : [],
      servicesProvided_am: Array.isArray(body.servicesProvided_am) ? body.servicesProvided_am : [],
      servicesProvided_om: Array.isArray(body.servicesProvided_om) ? body.servicesProvided_om : [],
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
    }

    const created = createOffice(newOffice, session.name)

    return NextResponse.json(
      {
        success: true,
        message: 'Sector Directorate created successfully',
        data: created,
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

    const body = await req.json()
    if (!body.slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 })
    }

    const updated = updateOffice(body.slug, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Office not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || (session.role !== 'SUPER_ADMIN' && session.role !== 'ADMIN')) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 })
    }

    deleteOffice(slug, session.name)
    return NextResponse.json({ success: true, message: `Office ${slug} deleted` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
