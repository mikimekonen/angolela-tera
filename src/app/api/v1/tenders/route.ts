import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getTenders, createTender, updateTender, deleteTender } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const q = searchParams.get('q')?.toLowerCase()

    let tenders = getTenders()

    if (status && status !== 'ALL') {
      tenders = tenders.filter((t) => t.tenderStatus === status)
    }

    if (q) {
      tenders = tenders.filter(
        (t) =>
          t.title_en.toLowerCase().includes(q) ||
          (t.title_am && t.title_am.includes(q)) ||
          t.bidNumber.toLowerCase().includes(q) ||
          t.procuringEntity.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ success: true, data: tenders, total: tenders.length })
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
    if (!body.title_en || !body.bidNumber || !body.procuringEntity || !body.closingDate) {
      return NextResponse.json(
        { success: false, error: 'bidNumber, title_en, procuringEntity, and closingDate are required' },
        { status: 400 }
      )
    }

    const newTender = {
      id: `tnd-${Date.now()}`,
      bidNumber: body.bidNumber,
      title_en: body.title_en,
      title_am: body.title_am || null,
      title_om: body.title_om || null,
      description_en: body.description_en || null,
      description_am: body.description_am || null,
      description_om: body.description_om || null,
      procuringEntity: body.procuringEntity,
      bidBondAmount: body.bidBondAmount || null,
      documentPrice: body.documentPrice || null,
      publishedAt: new Date(body.publishedAt || Date.now()),
      closingDate: new Date(body.closingDate),
      openingDate: body.openingDate ? new Date(body.openingDate) : undefined,
      documentUrl: body.documentUrl || null,
      tenderStatus: body.tenderStatus || 'ACTIVE',
      status: body.status || 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const created = createTender(newTender, session.name)
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

    const updated = updateTender(body.id, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Tender not found' }, { status: 404 })
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
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    deleteTender(id, session.name)
    return NextResponse.json({ success: true, message: `Tender ${id} deleted` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
