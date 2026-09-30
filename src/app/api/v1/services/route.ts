import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { mockServices } from '@/data/mockData'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const officeSlug = searchParams.get('office')?.toLowerCase()

    let services = mockServices

    try {
      if (prisma?.service?.findMany) {
        const dbServices = await prisma.service.findMany({
          orderBy: { displayOrder: 'asc' },
        })
        if (dbServices && dbServices.length > 0) {
          services = dbServices
        }
      }
    } catch {
      // Prisma fallback
    }

    if (officeSlug) {
      services = services.filter((s: any) => s.officeSlug === officeSlug)
    }

    if (q) {
      services = services.filter(
        (s: any) =>
          s.title_en?.toLowerCase().includes(q) ||
          s.title_am?.toLowerCase().includes(q) ||
          s.title_om?.toLowerCase().includes(q) ||
          s.description_en?.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({
      success: true,
      data: services,
      total: services.length,
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
        { success: false, error: 'Forbidden: Insufficient permissions to create services' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.slug || !body.title_en) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug and title_en are required' },
        { status: 400 }
      )
    }

    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    const newService = {
      id: `srv_${Date.now()}`,
      slug: body.slug,
      title_en: body.title_en,
      title_am: body.title_am || body.title_en,
      title_om: body.title_om || body.title_en,
      officeSlug: body.officeSlug || 'administration',
      category_en: body.category_en || 'General Public Service',
      description_en: body.description_en || '',
      status: 'PUBLISHED',
      createdAt: new Date(),
    }

    try {
      if (prisma?.service?.create) {
        await prisma.service.create({
          data: newService,
        })
      }
    } catch {
      // Prisma fallback
    }

    await createAuditLog({
      userId: session.userId,
      action: 'CREATE',
      entityType: 'Service',
      entityId: newService.slug,
      newData: newService,
      notes: `Citizen service ${newService.slug} created by ${session.email}`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Citizen service created successfully',
        data: newService,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
