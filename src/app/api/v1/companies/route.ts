import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { MOCK_BUSINESSES } from '@/data/entityData'
import type { BusinessItem, BusinessSector } from '@/types'

// Global mutable store for runtime persistence across API calls
declare global {
  // eslint-disable-next-line no-var
  var __businessStore: BusinessItem[] | undefined
}

function getStore(): BusinessItem[] {
  if (!globalThis.__businessStore) {
    globalThis.__businessStore = [...MOCK_BUSINESSES]
  }
  return globalThis.__businessStore
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const sector = searchParams.get('sector')?.toUpperCase()

    let businesses = getStore()

    if (sector && sector !== 'ALL') {
      businesses = businesses.filter((b) => b.sector === sector)
    }

    if (q) {
      businesses = businesses.filter(
        (b) =>
          b.name_en.toLowerCase().includes(q) ||
          (b.name_am && b.name_am.includes(q)) ||
          (b.name_om && b.name_om.toLowerCase().includes(q)) ||
          (b.description_en && b.description_en.toLowerCase().includes(q)) ||
          (b.address && b.address.toLowerCase().includes(q))
      )
    }

    businesses.sort((a, b) => a.displayOrder - b.displayOrder)

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
      return NextResponse.json(
        { success: false, error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.name_en) {
      return NextResponse.json(
        { success: false, error: 'Company English name is required' },
        { status: 400 }
      )
    }

    const store = getStore()
    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    // Update existing or create new
    if (body.id) {
      const idx = store.findIndex((b) => b.id === body.id)
      if (idx !== -1) {
        store[idx] = {
          ...store[idx],
          name_en: body.name_en,
          name_am: body.name_am || store[idx].name_am,
          name_om: body.name_om || store[idx].name_om,
          description_en: body.description_en ?? store[idx].description_en,
          description_am: body.description_am ?? store[idx].description_am,
          description_om: body.description_om ?? store[idx].description_om,
          sector: (body.sector as BusinessSector) || store[idx].sector,
          address: body.address ?? store[idx].address,
          phone: body.phone ?? store[idx].phone,
          email: body.email ?? store[idx].email,
          website: body.website ?? store[idx].website,
          established: body.established ?? store[idx].established,
          employeeCount: body.employeeCount ?? store[idx].employeeCount,
          photo: body.photo ?? store[idx].photo,
          displayOrder: body.displayOrder !== undefined ? Number(body.displayOrder) : store[idx].displayOrder,
          status: body.status || store[idx].status,
          updatedAt: new Date(),
        }

        await createAuditLog({
          userId: session.userId,
          action: 'UPDATE',
          entityType: 'Business',
          entityId: body.id,
          newData: store[idx],
          notes: `Updated company "${body.name_en}" by ${session.email}`,
          ipAddress,
          userAgent,
        })

        return NextResponse.json({
          success: true,
          message: 'Company updated successfully',
          data: store[idx],
        })
      }
    }

    // Create new
    const newBiz: BusinessItem = {
      id: `biz-${Date.now()}`,
      name_en: body.name_en,
      name_am: body.name_am || body.name_en,
      name_om: body.name_om || body.name_en,
      description_en: body.description_en || '',
      description_am: body.description_am || '',
      description_om: body.description_om || '',
      sector: (body.sector as BusinessSector) || 'AGRO_PROCESSING',
      address: body.address || 'Chacha, Angolela Tera Woreda',
      phone: body.phone || '',
      email: body.email || '',
      website: body.website || '',
      established: body.established || new Date().getFullYear().toString(),
      employeeCount: body.employeeCount || '10+',
      photo: body.photo ? { id: `m-${Date.now()}`, filename: 'photo.jpg', url: body.photo, mimeType: 'image/jpeg', sizeBytes: 1024, type: 'IMAGE', uploadedBy: session.userId, createdAt: new Date() } : undefined,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : store.length + 1,
      status: body.status || 'PUBLISHED',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    store.unshift(newBiz)

    await createAuditLog({
      userId: session.userId,
      action: 'CREATE',
      entityType: 'Business',
      entityId: newBiz.id,
      newData: newBiz,
      notes: `Registered private company "${newBiz.name_en}" in directory`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Company created successfully',
        data: newBiz,
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
      return NextResponse.json({ success: false, error: 'Missing company ID' }, { status: 400 })
    }

    const store = getStore()
    const idx = store.findIndex((b) => b.id === id)
    if (idx === -1) {
      return NextResponse.json({ success: false, error: 'Company not found' }, { status: 404 })
    }

    const removed = store.splice(idx, 1)[0]

    await createAuditLog({
      userId: session.userId,
      action: 'DELETE',
      entityType: 'Business',
      entityId: id,
      previousData: removed,
      notes: `Deleted company "${removed.name_en}" by ${session.email}`,
      ipAddress: getClientIp(req.headers),
      userAgent: req.headers.get('user-agent') || '',
    })

    return NextResponse.json({ success: true, message: 'Company deleted successfully' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
