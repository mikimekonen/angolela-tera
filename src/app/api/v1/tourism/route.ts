import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getTourism, createTourismItem, updateTourismItem, deleteTourismItem } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let items = getTourism()

    if (category) {
      items = items.filter((t: any) => t.category?.toLowerCase() === category.toLowerCase())
    }

    if (status) {
      items = items.filter((t: any) => t.status === status)
    }

    if (q) {
      items = items.filter(
        (t: any) =>
          t.name_en?.toLowerCase().includes(q) ||
          t.name_am?.includes(q) ||
          t.description_en?.toLowerCase().includes(q) ||
          t.slug?.toLowerCase().includes(q)
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

    const body = await req.json()
    if (!body.name_en || !body.slug) {
      return NextResponse.json({ success: false, error: 'name_en and slug are required' }, { status: 400 })
    }

    const newItem = {
      id: `tour-${Date.now()}`,
      slug: body.slug,
      name_en: body.name_en,
      name_am: body.name_am || null,
      name_om: body.name_om || null,
      category: body.category || 'Historical Heritage',
      description_en: body.description_en || null,
      description_am: body.description_am || null,
      description_om: body.description_om || null,
      location_en: body.location_en || null,
      mapCoordinates: body.mapCoordinates || null,
      activities_en: Array.isArray(body.activities_en) ? body.activities_en : (body.activities_en ? [body.activities_en] : []),
      nearbyFacilities_en: Array.isArray(body.nearbyFacilities_en) ? body.nearbyFacilities_en : (body.nearbyFacilities_en ? [body.nearbyFacilities_en] : []),
      culturalSignificance_en: body.culturalSignificance_en || null,
      bestVisitMonths: body.bestVisitMonths || null,
      coverImage: body.coverImage || '/images/tourism-placeholder.jpg',
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 0,
      status: body.status || 'PUBLISHED',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    createTourismItem(newItem, session.email)
    return NextResponse.json({ success: true, data: newItem }, { status: 201 })
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

    const updated = updateTourismItem(body.id, body, session.email)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Tourism item not found' }, { status: 404 })
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
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ success: false, error: 'id query param required' }, { status: 400 })
    }

    deleteTourismItem(id, session.email)
    return NextResponse.json({ success: true, message: 'Tourism item deleted' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
