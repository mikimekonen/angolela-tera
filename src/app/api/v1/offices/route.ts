import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { mockOffices } from '@/data/mockData'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()

    let offices = mockOffices

    try {
      if (prisma?.office?.findMany) {
        const dbOffices = await prisma.office.findMany({
          orderBy: { displayOrder: 'asc' },
        })
        if (dbOffices && dbOffices.length > 0) {
          offices = dbOffices
        }
      }
    } catch {
      // Prisma fallback
    }

    if (q) {
      offices = offices.filter(
        (o: any) =>
          o.name_en?.toLowerCase().includes(q) ||
          o.name_am?.toLowerCase().includes(q) ||
          o.name_om?.toLowerCase().includes(q) ||
          o.slug?.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({
      success: true,
      data: offices,
      total: offices.length,
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
        { success: false, error: 'Forbidden: Insufficient permissions to create sector offices' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.slug || !body.name_en) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug and name_en are required' },
        { status: 400 }
      )
    }

    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    const newOffice = {
      id: `off_${Date.now()}`,
      slug: body.slug,
      name_en: body.name_en,
      name_am: body.name_am || body.name_en,
      name_om: body.name_om || body.name_en,
      phone: body.phone || '+251 11 681 2100',
      email: body.email || `${body.slug}@angolelatera.gov.et`,
      about_en: body.about_en || '',
      status: 'PUBLISHED',
      createdAt: new Date(),
    }

    try {
      if (prisma?.office?.create) {
        await prisma.office.create({
          data: newOffice,
        })
      }
    } catch {
      // Prisma fallback
    }

    await createAuditLog({
      userId: session.userId,
      action: 'CREATE',
      entityType: 'Office',
      entityId: newOffice.slug,
      newData: newOffice,
      notes: `Sector office ${newOffice.slug} created by ${session.email}`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Sector office created successfully',
        data: newOffice,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
