import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { getCompanies, createCompany, updateCompany, deleteCompany } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const sector = searchParams.get('sector')?.toUpperCase()

    let businesses = getCompanies()

    if (sector && sector !== 'ALL') {
      businesses = businesses.filter((b) => b.sector === sector)
    }

    if (q) {
      businesses = businesses.filter(
        (b) =>
          b.name_en?.toLowerCase().includes(q) ||
          (b.name_am && b.name_am.includes(q)) ||
          (b.name_om && b.name_om.toLowerCase().includes(q)) ||
          (b.description_en && b.description_en.toLowerCase().includes(q)) ||
          (b.address && b.address.toLowerCase().includes(q))
      )
    }

    return NextResponse.json({
      success: true,
      data: businesses,
      total: businesses.length,
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
    if (!body.name_en || !body.sector) {
      return NextResponse.json({ success: false, error: 'name_en and sector are required' }, { status: 400 })
    }

    const newCompany = {
      id: `biz-${Date.now()}`,
      name_en: body.name_en,
      name_am: body.name_am || null,
      name_om: body.name_om || null,
      description_en: body.description_en || null,
      description_am: body.description_am || null,
      description_om: body.description_om || null,
      sector: body.sector,
      address: body.address || null,
      phone: body.phone || null,
      email: body.email || null,
      website: body.website || null,
      established: body.established || null,
      employeeCount: body.employeeCount || null,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 10,
      status: body.status || 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const created = createCompany(newCompany, session.name)
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

    const updated = updateCompany(body.id, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 })
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

    deleteCompany(id, session.name)
    return NextResponse.json({ success: true, message: `Company ${id} deleted` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
