import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSliders, createSlider, updateSlider, deleteSlider } from '@/lib/dataStore'

export async function GET() {
  try {
    const sliders = getSliders()
    return NextResponse.json({ success: true, data: sliders, total: sliders.length })
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
    if (!body.title_en) {
      return NextResponse.json({ success: false, error: 'title_en is required' }, { status: 400 })
    }

    const newSlider = {
      id: `slider-${Date.now()}`,
      title_en: body.title_en,
      title_am: body.title_am || null,
      subtitle_en: body.subtitle_en || null,
      subtitle_am: body.subtitle_am || null,
      imageUrl: body.imageUrl || '/images/hero-slider-1.jpg',
      buttonText_en: body.buttonText_en || 'Learn More',
      buttonText_am: body.buttonText_am || 'ተጨማሪ ይመልከቱ',
      buttonUrl: body.buttonUrl || '/services',
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 0,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    createSlider(newSlider, session.email)
    return NextResponse.json({ success: true, data: newSlider }, { status: 201 })
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

    const updated = updateSlider(body.id, body, session.email)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Slider not found' }, { status: 404 })
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

    deleteSlider(id, session.email)
    return NextResponse.json({ success: true, message: 'Slider deleted' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
