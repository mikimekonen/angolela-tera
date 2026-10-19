import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getInvestments, createInvestment, updateInvestment, deleteInvestment } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const sector = searchParams.get('sector')

    let investments = getInvestments()

    if (sector) {
      investments = investments.filter((i) => i.sector.toLowerCase() === sector.toLowerCase())
    }

    if (q) {
      investments = investments.filter(
        (i) =>
          i.title_en.toLowerCase().includes(q) ||
          (i.title_am && i.title_am.includes(q)) ||
          (i.title_om && i.title_om.toLowerCase().includes(q)) ||
          (i.summary_en && i.summary_en.toLowerCase().includes(q)) ||
          i.slug.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ success: true, data: investments, total: investments.length })
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

    const body = await req.json()
    if (!body.title_en || !body.slug) {
      return NextResponse.json({ success: false, error: 'title_en and slug are required' }, { status: 400 })
    }

    const newInvestment = {
      id: `inv-${Date.now()}`,
      slug: body.slug,
      title_en: body.title_en,
      title_am: body.title_am || null,
      title_om: body.title_om || null,
      sector: body.sector || 'Agro-processing',
      summary_en: body.summary_en || null,
      summary_am: body.summary_am || null,
      summary_om: body.summary_om || null,
      description_en: body.description_en || null,
      description_am: body.description_am || null,
      description_om: body.description_om || null,
      availableLandHa: body.availableLandHa ? Number(body.availableLandHa) : undefined,
      incentives_en: body.incentives_en || null,
      incentives_am: body.incentives_am || null,
      incentives_om: body.incentives_om || null,
      procedures_en: body.procedures_en || null,
      procedures_am: body.procedures_am || null,
      procedures_om: body.procedures_om || null,
      contactPerson: body.contactPerson || null,
      contactPhone: body.contactPhone || null,
      contactEmail: body.contactEmail || null,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 0,
      status: body.status || 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const created = createInvestment(newInvestment, session.name)
    return NextResponse.json({ success: true, data: created }, { status: 201 })
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

    const updated = updateInvestment(body.slug, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Investment opportunity not found' }, { status: 404 })
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
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Super Admin only' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 })
    }

    deleteInvestment(slug, session.name)
    return NextResponse.json({ success: true, message: `Investment opportunity ${slug} deleted` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
