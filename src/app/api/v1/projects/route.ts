import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import {
  getDevelopmentProjects,
  createDevelopmentProject,
  updateDevelopmentProject,
  deleteDevelopmentProject,
} from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const sector = searchParams.get('sector')
    const status = searchParams.get('status')

    let items = getDevelopmentProjects()

    if (sector && sector !== 'ALL') {
      items = items.filter((p: any) => p.sector?.toLowerCase() === sector.toLowerCase())
    }

    if (status && status !== 'ALL') {
      items = items.filter((p: any) => p.status === status)
    }

    if (q) {
      items = items.filter(
        (p: any) =>
          p.title_en?.toLowerCase().includes(q) ||
          p.title_am?.includes(q) ||
          p.description_en?.toLowerCase().includes(q) ||
          p.contractor?.toLowerCase().includes(q) ||
          p.slug?.toLowerCase().includes(q)
      )
    }

    return NextResponse.json({ success: true, data: items, total: items.length })
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
        { success: false, error: 'Forbidden: Insufficient permissions to create development projects' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.title_en || !body.slug) {
      return NextResponse.json({ success: false, error: 'title_en and slug are required' }, { status: 400 })
    }

    const newProject = {
      id: `proj-${Date.now()}`,
      slug: body.slug,
      title_en: body.title_en,
      title_am: body.title_am || null,
      sector: body.sector || 'Infrastructure',
      description_en: body.description_en || null,
      description_am: body.description_am || null,
      location_en: body.location_en || null,
      budget_etb: body.budget_etb ? Number(body.budget_etb) : 0,
      fundingSource: body.fundingSource || null,
      contractor: body.contractor || null,
      beneficiaries: body.beneficiaries || null,
      startDate: body.startDate || new Date().toISOString().split('T')[0],
      expectedCompletion: body.expectedCompletion || null,
      status: body.status || 'IN_PROGRESS',
      progressPercent: body.progressPercent !== undefined ? Number(body.progressPercent) : 0,
      images: Array.isArray(body.images) ? body.images : [],
      milestones: Array.isArray(body.milestones) ? body.milestones : [],
      isPublicTransparency: body.isPublicTransparency !== undefined ? Boolean(body.isPublicTransparency) : true,
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    createDevelopmentProject(newProject, session.name)
    return NextResponse.json({ success: true, data: newProject }, { status: 201 })
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

    if (!hasPermission(session.role, 'canEditAll') && session.role !== 'OFFICE_EDITOR') {
      return NextResponse.json(
        { success: false, error: 'Forbidden: Insufficient permissions to edit development projects' },
        { status: 403 }
      )
    }

    const body = await req.json()
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    const updated = updateDevelopmentProject(body.id, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 })
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
      return NextResponse.json({ success: false, error: 'Forbidden: Super Admin or Admin only' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'id query param required' }, { status: 400 })
    }

    deleteDevelopmentProject(id, session.name)
    return NextResponse.json({ success: true, message: 'Project deleted' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
