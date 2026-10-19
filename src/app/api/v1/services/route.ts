import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { getServices, createService, updateService, deleteService } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const officeSlug = searchParams.get('office')?.toLowerCase()

    let services = getServices()

    if (officeSlug) {
      services = services.filter((s: any) => s.officeSlug === officeSlug)
    }

    if (q) {
      services = services.filter(
        (s: any) =>
          s.title_en?.toLowerCase().includes(q) ||
          s.title_am?.toLowerCase().includes(q) ||
          s.title_om?.toLowerCase().includes(q) ||
          s.description_en?.toLowerCase().includes(q) ||
          s.category_en?.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({
      success: true,
      data: services,
      total: services.length,
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
        { success: false, error: 'Forbidden: Insufficient permissions to create services' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.slug || !body.title_en) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug and title_en are required' },
        { status: 400 }
      )
    }

    const newService = {
      id: `srv_${Date.now()}`,
      slug: body.slug,
      title_en: body.title_en,
      title_am: body.title_am || body.title_en,
      title_om: body.title_om || body.title_en,
      officeSlug: body.officeSlug || 'administration',
      officeName_en: body.officeName_en || 'Woreda Administration',
      officeName_am: body.officeName_am || 'የወረዳ አስተዳደር',
      officeName_om: body.officeName_om || 'Bulchiinsa Aanaa',
      category_en: body.category_en || 'General Public Service',
      category_am: body.category_am || 'አጠቃላይ የህዝብ አገልግሎት',
      category_om: body.category_om || 'Tajaajila Waliigalaa',
      processingTime_en: body.processingTime_en || '1 - 3 Working Days',
      processingTime_am: body.processingTime_am || '1 - 3 የሥራ ቀናት',
      cost_en: body.cost_en || 'Free of Charge',
      cost_am: body.cost_am || 'ያለ ክፍያ',
      description_en: body.description_en || '',
      description_am: body.description_am || '',
      description_om: body.description_om || '',
      requirements_en: Array.isArray(body.requirements_en) ? body.requirements_en : [],
      requirements_am: Array.isArray(body.requirements_am) ? body.requirements_am : [],
      steps_en: Array.isArray(body.steps_en) ? body.steps_en : [],
      steps_am: Array.isArray(body.steps_am) ? body.steps_am : [],
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
    }

    const created = createService(newService, session.name)

    return NextResponse.json(
      {
        success: true,
        message: 'Citizen service created successfully',
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

    const updated = updateService(body.slug, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })
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

    deleteService(slug, session.name)
    return NextResponse.json({ success: true, message: `Service ${slug} deleted` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
