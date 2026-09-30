import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission } from '@/lib/auth'
import { createAuditLog, getClientIp } from '@/lib/audit'
import { mockNews } from '@/data/mockData'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const category = searchParams.get('category')?.toLowerCase()
    const featured = searchParams.get('featured')

    let news = mockNews

    try {
      if (prisma?.news?.findMany) {
        const dbNews = await prisma.news.findMany({
          orderBy: { publishedAt: 'desc' },
        })
        if (dbNews && dbNews.length > 0) {
          news = dbNews
        }
      }
    } catch {
      // Prisma fallback
    }

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
          n.title_am?.toLowerCase().includes(q) ||
          n.title_om?.toLowerCase().includes(q) ||
          n.excerpt_en?.toLowerCase().includes(q)
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

    const ipAddress = getClientIp(req.headers)
    const userAgent = req.headers.get('user-agent') || ''

    const newArticle = {
      id: `news_${Date.now()}`,
      slug: body.slug,
      title_en: body.title_en,
      title_am: body.title_am || body.title_en,
      title_om: body.title_om || body.title_en,
      excerpt_en: body.excerpt_en || '',
      excerpt_am: body.excerpt_am || '',
      excerpt_om: body.excerpt_om || '',
      body_en: body.body_en || body.excerpt_en || '',
      category_en: body.category_en || 'Official Notice',
      isFeatured: Boolean(body.isFeatured),
      status: 'PUBLISHED',
      publishedAt: new Date(),
    }

    try {
      if (prisma?.news?.create) {
        await prisma.news.create({
          data: newArticle,
        })
      }
    } catch {
      // Prisma fallback
    }

    await createAuditLog({
      userId: session.userId,
      action: 'PUBLISH',
      entityType: 'News',
      entityId: newArticle.slug,
      newData: newArticle,
      notes: `News announcement "${newArticle.title_en}" published by ${session.email}`,
      ipAddress,
      userAgent,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'News announcement published successfully',
        data: newArticle,
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
