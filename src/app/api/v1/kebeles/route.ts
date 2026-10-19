import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getKebeles, createKebele, updateKebele, deleteKebele } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const type = searchParams.get('type')

    let kebeles = getKebeles()

    if (type) {
      kebeles = kebeles.filter((k) => k.type === type)
    }

    if (q) {
      kebeles = kebeles.filter(
        (k) =>
          k.name_en.toLowerCase().includes(q) ||
          (k.name_am && k.name_am.includes(q)) ||
          (k.name_om && k.name_om.toLowerCase().includes(q)) ||
          k.slug.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ success: true, data: kebeles, total: kebeles.length })
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
    if (!body.name_en || !body.slug) {
      return NextResponse.json({ success: false, error: 'name_en and slug are required' }, { status: 400 })
    }

    const newKebele = {
      id: `keb-${Date.now()}`,
      slug: body.slug,
      name_en: body.name_en,
      name_am: body.name_am || null,
      name_om: body.name_om || null,
      type: body.type || 'RURAL_KEBELE',
      population: body.population ? Number(body.population) : undefined,
      distanceFromCapitalKm: body.distanceFromCapitalKm ? Number(body.distanceFromCapitalKm) : undefined,
      mainAgroEcology: body.mainAgroEcology || null,
      economicActivities_en: body.economicActivities_en || null,
      economicActivities_am: body.economicActivities_am || null,
      economicActivities_om: body.economicActivities_om || null,
      administratorName: body.administratorName || null,
      contactPhone: body.contactPhone || null,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 0,
      status: body.status || 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const created = createKebele(newKebele, session.name)
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
      return NextResponse.json({ success: false, error: 'slug is required for update' }, { status: 400 })
    }

    const updated = updateKebele(body.slug, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Kebele not found' }, { status: 404 })
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

    deleteKebele(slug, session.name)
    return NextResponse.json({ success: true, message: `Kebele ${slug} deleted` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
