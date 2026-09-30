import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { MOCK_LEADERSHIP, LeaderProfile } from '@/data/entityData'

declare global {
  // eslint-disable-next-line no-var
  var __leadershipStore: LeaderProfile[] | undefined
}

function getStore(): LeaderProfile[] {
  if (!globalThis.__leadershipStore) {
    globalThis.__leadershipStore = [...MOCK_LEADERSHIP]
  }
  return globalThis.__leadershipStore
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()

    let leaders = getStore()

    if (q) {
      leaders = leaders.filter(
        (l) =>
          l.name_en.toLowerCase().includes(q) ||
          l.name_am.includes(q) ||
          l.name_om.toLowerCase().includes(q) ||
          l.title_en.toLowerCase().includes(q) ||
          l.title_am.includes(q)
      )
    }

    leaders.sort((a, b) => a.displayOrder - b.displayOrder)

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
      return NextResponse.json(
        { success: false, error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.name_en || !body.title_en) {
      return NextResponse.json(
        { success: false, error: 'Name and Title in English are required' },
        { status: 400 }
      )
    }

    const store = getStore()
    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    // Update existing
    if (body.id) {
      const idx = store.findIndex((l) => l.id === body.id)
      if (idx !== -1) {
        store[idx] = {
          ...store[idx],
          name_en: body.name_en,
          name_am: body.name_am || store[idx].name_am,
          name_om: body.name_om || store[idx].name_om,
          title_en: body.title_en,
          title_am: body.title_am || store[idx].title_am,
          title_om: body.title_om || store[idx].title_om,
          bio_en: body.bio_en ?? store[idx].bio_en,
          bio_am: body.bio_am ?? store[idx].bio_am,
          bio_om: body.bio_om ?? store[idx].bio_om,
          phone: body.phone ?? store[idx].phone,
          email: body.email ?? store[idx].email,
          photo: body.photo ?? store[idx].photo,
          displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : store[idx].displayOrder,
          status: body.status || store[idx].status,
        }

        await createAuditLog({
          userId: session.userId,
          action: 'UPDATE',
          entityType: 'Leadership',
          entityId: body.id,
          newData: store[idx],
          notes: `Updated leadership profile "${body.name_en}" (${body.title_en}) by ${session.email}`,
          ipAddress,
          userAgent,
        })

        return NextResponse.json({
          success: true,
          message: 'Leadership profile updated successfully',
          data: store[idx],
        })
      }
    }

    // Create new
    const newLeader: LeaderProfile = {
      id: `leader-${Date.now()}`,
      name_en: body.name_en,
      name_am: body.name_am || body.name_en,
      name_om: body.name_om || body.name_en,
      title_en: body.title_en,
      title_am: body.title_am || body.title_en,
      title_om: body.title_om || body.title_en,
      bio_en: body.bio_en || '',
      bio_am: body.bio_am || '',
      bio_om: body.bio_om || '',
      phone: body.phone || '',
      email: body.email || '',
      photo: body.photo || undefined,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : store.length + 1,
      status: body.status || 'PUBLISHED',
    }

    store.push(newLeader)

    await createAuditLog({
      userId: session.userId,
      action: 'CREATE',
      entityType: 'Leadership',
      entityId: newLeader.id,
      newData: newLeader,
      notes: `Registered leadership profile "${newLeader.name_en}" as ${newLeader.title_en}`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Leadership profile created successfully',
        data: newLeader,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !hasPermission(session.role, 'canDelete')) {
      return NextResponse.json({ success: false, error: 'Unauthorized or forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'Missing leader ID' }, { status: 400 })
    }

    const store = getStore()
    const idx = store.findIndex((l) => l.id === id)
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Leader profile not found' }, { status: 404 })
    }

    const removed = store.splice(idx, 1)[0]

    await createAuditLog({
      userId: session.userId,
      action: 'DELETE',
      entityType: 'Leadership',
      entityId: id,
      previousData: removed,
      notes: `Deleted leadership profile "${removed.name_en}" by ${session.email}`,
      ipAddress: getClientIp(req.headers),
      userAgent: req.headers.get('user-agent') || '',
    })

    return NextResponse.json({ success: true, message: 'Leadership profile deleted successfully' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
