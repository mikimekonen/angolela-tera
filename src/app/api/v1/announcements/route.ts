import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { MOCK_ANNOUNCEMENTS } from '@/data/entityData'
import type { AnnouncementItem, AnnouncementType } from '@/types'

declare global {
  // eslint-disable-next-line no-var
  var __announcementStore: AnnouncementItem[] | undefined
}

function getStore(): AnnouncementItem[] {
  if (!globalThis.__announcementStore) {
    globalThis.__announcementStore = [...MOCK_ANNOUNCEMENTS]
  }
  return globalThis.__announcementStore
}

export async function GET() {
  try {
    const announcements = getStore()
    return NextResponse.json({
      success: true,
      data: announcements,
      total: announcements.length,
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
    if (!body.text_en) {
      return NextResponse.json(
        { success: false, error: 'Announcement English text is required' },
        { status: 400 }
      )
    }

    const store = getStore()
    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    // Update existing
    if (body.id) {
      const idx = store.findIndex((a) => a.id === body.id)
      if (idx !== -1) {
        store[idx] = {
          ...store[idx],
          text_en: body.text_en,
          text_am: body.text_am ?? store[idx].text_am,
          text_om: body.text_om ?? store[idx].text_om,
          type: (body.type as AnnouncementType) || store[idx].type,
          linkUrl: body.linkUrl ?? store[idx].linkUrl,
          linkLabel_en: body.linkLabel_en ?? store[idx].linkLabel_en,
          isActive: body.isActive !== undefined ? Boolean(body.isActive) : store[idx].isActive,
        }

        await createAuditLog({
          userId: session.userId,
          action: 'UPDATE',
          entityType: 'Announcement',
          entityId: body.id,
          newData: store[idx],
          notes: `Updated live announcement banner by ${session.email}`,
          ipAddress,
          userAgent,
        })

        return NextResponse.json({
          success: true,
          message: 'Announcement updated successfully',
          data: store[idx],
        })
      }
    }

    // Create new
    const newAnn: AnnouncementItem = {
      id: `ann-${Date.now()}`,
      text_en: body.text_en,
      text_am: body.text_am || body.text_en,
      text_om: body.text_om || body.text_en,
      type: (body.type as AnnouncementType) || 'INFO',
      linkUrl: body.linkUrl || '',
      linkLabel_en: body.linkLabel_en || 'Learn More',
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      createdAt: new Date(),
    }

    store.unshift(newAnn)

    await createAuditLog({
      userId: session.userId,
      action: 'PUBLISH',
      entityType: 'Announcement',
      entityId: newAnn.id,
      newData: newAnn,
      notes: `Published live announcement banner: "${newAnn.text_en.substring(0, 40)}..."`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Announcement created successfully',
        data: newAnn,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
