import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { MOCK_PARTNERS } from '@/data/entityData'
import type { PartnerItem, PartnerType } from '@/types'

declare global {
  // eslint-disable-next-line no-var
  var __partnerStore: PartnerItem[] | undefined
}

function getStore(): PartnerItem[] {
  if (!globalThis.__partnerStore) {
    globalThis.__partnerStore = [...MOCK_PARTNERS]
  }
  return globalThis.__partnerStore
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const type = searchParams.get('type')?.toUpperCase()

    let partners = getStore()

    if (type && type !== 'ALL') {
      partners = partners.filter((p) => p.partnerType === type)
    }

    if (q) {
      partners = partners.filter(
        (p) =>
          p.name_en.toLowerCase().includes(q) ||
          (p.name_am && p.name_am.includes(q)) ||
          (p.name_om && p.name_om.toLowerCase().includes(q)) ||
          (p.description_en && p.description_en.toLowerCase().includes(q)) ||
          (p.country && p.country.toLowerCase().includes(q))
      )
    }

    partners.sort((a, b) => a.displayOrder - b.displayOrder)

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
      return NextResponse.json(
        { success: false, error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.name_en) {
      return NextResponse.json(
        { success: false, error: 'Partner English name is required' },
        { status: 400 }
      )
    }

    const store = getStore()
    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    // Update existing
    if (body.id) {
      const idx = store.findIndex((p) => p.id === body.id)
      if (idx !== -1) {
        store[idx] = {
          ...store[idx],
          name_en: body.name_en,
          name_am: body.name_am || store[idx].name_am,
          name_om: body.name_om || store[idx].name_om,
          description_en: body.description_en ?? store[idx].description_en,
          description_am: body.description_am ?? store[idx].description_am,
          description_om: body.description_om ?? store[idx].description_om,
          partnerType: (body.partnerType as PartnerType) || store[idx].partnerType,
          country: body.country ?? store[idx].country,
          website: body.website ?? store[idx].website,
          phone: body.phone ?? store[idx].phone,
          email: body.email ?? store[idx].email,
          partnerSince: body.partnerSince ?? store[idx].partnerSince,
          displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : store[idx].displayOrder,
          status: body.status || store[idx].status,
          updatedAt: new Date(),
        }

        await createAuditLog({
          userId: session.userId,
          action: 'UPDATE',
          entityType: 'Partner',
          entityId: body.id,
          newData: store[idx],
          notes: `Updated partner organization "${body.name_en}" by ${session.email}`,
          ipAddress,
          userAgent,
        })

        return NextResponse.json({
          success: true,
          message: 'Partner updated successfully',
          data: store[idx],
        })
      }
    }

    // Create new
    const newPartner: PartnerItem = {
      id: `partner-${Date.now()}`,
      name_en: body.name_en,
      name_am: body.name_am || body.name_en,
      name_om: body.name_om || body.name_en,
      description_en: body.description_en || '',
      description_am: body.description_am || '',
      description_om: body.description_om || '',
      partnerType: (body.partnerType as PartnerType) || 'DEVELOPMENT_PARTNER',
      country: body.country || 'Ethiopia',
      website: body.website || '',
      phone: body.phone || '',
      email: body.email || '',
      partnerSince: body.partnerSince || new Date().getFullYear().toString(),
      displayOrder: body.displayOrder ? Number(body.displayOrder) : store.length + 1,
      status: body.status || 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    store.unshift(newPartner)

    await createAuditLog({
      userId: session.userId,
      action: 'CREATE',
      entityType: 'Partner',
      entityId: newPartner.id,
      newData: newPartner,
      notes: `Registered partner organization "${newPartner.name_en}"`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Partner created successfully',
        data: newPartner,
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
      return NextResponse.json({ success: false, error: 'Missing partner ID' }, { status: 400 })
    }

    const store = getStore()
    const idx = store.findIndex((p) => p.id === id)
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Partner not found' }, { status: 404 })
    }

    const removed = store.splice(idx, 1)[0]

    await createAuditLog({
      userId: session.userId,
      action: 'DELETE',
      entityType: 'Partner',
      entityId: id,
      previousData: removed,
      notes: `Deleted partner organization "${removed.name_en}" by ${session.email}`,
      ipAddress: getClientIp(req.headers),
      userAgent: req.headers.get('user-agent') || '',
    })

    return NextResponse.json({ success: true, message: 'Partner deleted successfully' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
