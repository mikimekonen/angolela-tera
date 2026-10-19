import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { getNews, createNews, updateNews, deleteNews } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const category = searchParams.get('category')?.toLowerCase()
    const featured = searchParams.get('featured')

    let news = getNews()

    if (category) {
      news = news.filter((n: any) => n.category_en?.toLowerCase().includes(category))
    }

    if (featured === 'true') {
      news = news.filter((n: any) => n.isFeatured)
    }

    if (q) {
      news = news.filter(
        (n: any) =>
          n.title_en?.toLowerCase().includes(q) ||
          (n.title_am && n.title_am.includes(q)) ||
          (n.title_om && n.title_om.toLowerCase().includes(q)) ||
          (n.summary_en && n.summary_en.toLowerCase().includes(q))
      )
    }

    return NextResponse.json({
      success: true,
      data: news,
      total: news.length,
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
        { success: false, error: 'Forbidden: Insufficient permissions to publish news' },
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

    const today = new Date().toISOString().split('T')[0]

    const newArticle = {
      id: `news_${Date.now()}`,
      slug: body.slug,
      title_en: body.title_en,
      title_am: body.title_am || body.title_en,
      title_om: body.title_om || body.title_en,
      category_en: body.category_en || 'Administration & Governance',
      category_am: body.category_am || 'አስተዳደር እና መልካም አስተዳደር',
      category_om: body.category_om || 'Bulchiinsa fi Mootummaa',
      date_en: body.date_en || today,
      date_am: body.date_am || today,
      date_om: body.date_om || today,
      author_en: session.name || 'Woreda Communication Directorate',
      author_am: 'የወረዳው ኮሙኒኬሽን ዳይሬክቶሬት',
      author_om: 'Daayirektooreetii Kominikeeshinii Aanaa',
      summary_en: body.summary_en || body.excerpt_en || '',
      summary_am: body.summary_am || body.excerpt_am || '',
      summary_om: body.summary_om || body.excerpt_om || '',
      content_en: Array.isArray(body.content_en) ? body.content_en : [body.content_en || body.body_en || ''],
      content_am: Array.isArray(body.content_am) ? body.content_am : [body.content_am || body.body_am || ''],
      content_om: Array.isArray(body.content_om) ? body.content_om : [body.content_om || body.body_om || ''],
      isFeatured: Boolean(body.isFeatured),
      status: body.status || 'PUBLISHED',
      createdAt: new Date().toISOString(),
    }

    const created = createNews(newArticle, session.name)

    return NextResponse.json(
      {
        success: true,
        message: 'News article published successfully',
        data: created,
      },
      { status: 201 }
    )
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
    if (!body.slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 })
    }

    const updated = updateNews(body.slug, body, session.name)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 })
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
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 })
    }

    deleteNews(slug, session.name)
    return NextResponse.json({ success: true, message: `News ${slug} deleted` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
