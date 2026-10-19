import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { getPartners, createPartner, updatePartner, deletePartner } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const type = searchParams.get('type')?.toUpperCase()

    let partners = getPartners()

    if (type && type !== 'ALL') {
      partners = partners.filter((p) => p.partnerType === type)
    }

    if (q) {
      partners = partners.filter(
        (p) =>
          p.name_en?.toLowerCase().includes(q) ||
          (p.name_am && p.name_am.includes(q)) ||
          (p.name_om && p.name_om.toLowerCase().includes(q)) ||
          (p.description_en && p.description_en.toLowerCase().includes(q)) ||
          (p.country && p.country.toLowerCase().includes(q))
      )
    }

    return NextResponse.json({
      success: true,
      data: partners,
      total: partners.length,
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
      return NextResponse.json({ success: false, error: 'Forbidden: Insufficient permissions' }, { status: 403 })
    }

    const body = await req.json()
    if (!body.name_en || !body.partnerType) {
      return NextResponse.json({ success: false, error: 'name_en and partnerType are required' }, { status: 400 })
    }

    const newPartner = {
      id: `partner-${Date.now()}`,
      name_en: body.name_en,
      name_am: body.name_am || null,
      name_om: body.name_om || null,
      description_en: body.description_en || null,
      description_am: body.description_am || null,
      description_om: body.description_om || null,
      partnerType: body.partnerType,
      country: body.country || null,
      website: body.website || null,
      phone: body.phone || null,
      email: body.email || null,
      partnerSince: body.partnerSince || null,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 10,
      status: body.status || 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const created = createPartner(newPartner, session.name)
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
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    const updated = updatePartner(body.id, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
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
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    deletePartner(id, session.name)
    return NextResponse.json({ success: true, message: `Partner ${id} removed` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
