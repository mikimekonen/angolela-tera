import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { getLeadership, createLeader, updateLeader, deleteLeader } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()

    let leaders = getLeadership()

    if (q) {
      leaders = leaders.filter(
        (l) =>
          l.name_en?.toLowerCase().includes(q) ||
          (l.name_am && l.name_am.includes(q)) ||
          (l.name_om && l.name_om.toLowerCase().includes(q)) ||
          l.title_en?.toLowerCase().includes(q) ||
          (l.title_am && l.title_am.includes(q))
      )
    }

    return NextResponse.json({
      success: true,
      data: leaders,
      total: leaders.length,
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
    if (!body.name_en || !body.title_en) {
      return NextResponse.json({ success: false, error: 'name_en and title_en are required' }, { status: 400 })
    }

    const newLeader = {
      id: `leader-${Date.now()}`,
      name_en: body.name_en,
      name_am: body.name_am || '',
      name_om: body.name_om || '',
      title_en: body.title_en,
      title_am: body.title_am || '',
      title_om: body.title_om || '',
      bio_en: body.bio_en || '',
      bio_am: body.bio_am || '',
      bio_om: body.bio_om || '',
      phone: body.phone || undefined,
      email: body.email || undefined,
      photo: body.photo || undefined,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 10,
      status: body.status || 'PUBLISHED',
    }

    const created = createLeader(newLeader, session.name)
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

    const updated = updateLeader(body.id, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Leader not found' }, { status: 404 })
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

    deleteLeader(id, session.name)
    return NextResponse.json({ success: true, message: `Leader ${id} removed` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
