import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import {
  getNavigation,
  getAllNavigation,
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
} from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') === 'true'

    const nav = all ? getAllNavigation() : getNavigation()
    return NextResponse.json({ success: true, data: nav })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Super Admin only' }, { status: 403 })
    }

    const body = await req.json()
    if (!body.label_en || !body.url) {
      return NextResponse.json({ success: false, error: 'label_en and url are required' }, { status: 400 })
    }

    const newItem = {
      id: `nav-${Date.now()}`,
      label_en: body.label_en,
      label_am: body.label_am || null,
      label_om: body.label_om || null,
      url: body.url,
      parentId: body.parentId || null,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 10,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      isExternal: Boolean(body.isExternal),
    }

    const created = createNavigationItem(newItem, session.name)
    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Super Admin only' }, { status: 403 })
    }

    const body = await req.json()
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    const updated = updateNavigationItem(body.id, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Navigation item not found' }, { status: 404 })
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

    deleteNavigationItem(id, session.name)
    return NextResponse.json({ success: true, message: `Navigation item ${id} deleted` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
