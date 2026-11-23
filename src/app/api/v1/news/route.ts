import { NextRequest, NextResponse } from 'next/server'
import { getSession, hasPermission, requireResourcePermission } from '@/lib/auth'
import { getNews, createNews, updateNews, deleteNews } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    const isAdmin = Boolean(
      session &&
        session.role &&
        ['SUPER_ADMIN', 'ADMIN', 'OFFICE_EDITOR', 'REVIEWER', 'VIEWER'].includes(session.role)
    )

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const category = searchParams.get('category')?.toLowerCase()
    const featured = searchParams.get('featured')
    const requestedStatus = searchParams.get('status')

    let news = getNews()

    // 1. PUBLIC VISITOR FILTERING:
    // If not authenticated as an authorized administrator, strictly expose PUBLISHED articles
    // whose scheduled publication date (if set) is not in the future.
    if (!isAdmin) {
      const now = new Date()
      news = news
        .filter((n: any) => {
          if (n.status && n.status !== 'PUBLISHED') return false
          if (n.scheduledPublishAt && new Date(n.scheduledPublishAt) > now) return false
          return true
        })
        .map((n: any) => {
          // Data minimization: Never expose internal editorial notes or rejection reasons to the public
          const { reviewerNotes, rejectionReason, ...safeNews } = n
          return safeNews
        })
    } else if (requestedStatus) {
      news = news.filter((n: any) => n.status === requestedStatus)
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
          (n.title_am && n.title_am.includes(q)) ||
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
    const { session, errorResponse } = await requireResourcePermission('NEWS', 'canCreate')
    if (errorResponse || !session) return errorResponse

    const body = await req.json()
    if (!body.slug || !body.title_en) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: slug and title_en are required' },
        { status: 400 }
      )
    }

    const today = new Date().toISOString().split('T')[0]

    // Editorial Workflow Enforcement: Only users with canPublish permission can set PUBLISHED status
    const requestedStatus = body.status || 'DRAFT'
    const canPublish = hasPermission(session.role, 'canPublish')
    const finalStatus =
      requestedStatus === 'PUBLISHED' && !canPublish ? 'REVIEW' : requestedStatus

    const newArticle = {
      id: `news_${Date.now()}`,
      slug: body.slug,
      title_en: body.title_en,
      title_am: body.title_am || body.title_en,
      category_en: body.category_en || 'Official Press Release',
      category_am: body.category_am || 'ይፋዊ መግለጫ',
      date_en: body.date_en || today,
      date_am: body.date_am || today,
      author_en: session.name || 'Woreda Communication Directorate',
      author_am: 'የወረዳው ኮሙኒኬሽን ዳይሬክቶሬት',
      summary_en: body.summary_en || body.excerpt_en || '',
      summary_am: body.summary_am || body.excerpt_am || '',
      content_en: Array.isArray(body.content_en)
        ? body.content_en
        : [body.content_en || body.body_en || ''],
      content_am: Array.isArray(body.content_am)
        ? body.content_am
        : [body.content_am || body.body_am || ''],
      imageUrl: body.imageUrl || body.coverImage || null,
      imageCaption_en: body.imageCaption_en || '',
      imageCaption_am: body.imageCaption_am || '',
      videoUrl: body.videoUrl || null,
      videoType: body.videoType || 'embed',
      gallery: Array.isArray(body.gallery) ? body.gallery : [],
      documentUrl: body.documentUrl || null,
      documentTitle: body.documentTitle || '',
      referenceNumber: body.referenceNumber || '',
      isFeatured: Boolean(body.isFeatured),
      status: finalStatus,
      reviewerNotes: body.reviewerNotes || null,
      scheduledPublishAt: body.scheduledPublishAt || null,
      expiryDate: body.expiryDate || null,
      createdAt: new Date().toISOString(),
    }

    const created = createNews(newArticle, session.name)

    return NextResponse.json(
      {
        success: true,
        message: 'News article created successfully',
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
    const { session, errorResponse } = await requireResourcePermission('NEWS', 'canEdit')
    if (errorResponse || !session) return errorResponse

    const body = await req.json()
    if (!body.slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 })
    }

    // Workflow guard: Non-publishers cannot transition articles to PUBLISHED
    if (body.status === 'PUBLISHED' && !hasPermission(session.role, 'canPublish')) {
      return NextResponse.json(
        {
          success: false,
          error:
            'Forbidden: Insufficient privileges to publish articles directly. Status must be submitted as REVIEW for editorial approval.',
        },
        { status: 403 }
      )
    }

    // Reviewer approval workflow
    if (body.status === 'APPROVED' && !hasPermission(session.role, 'canApprove')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden: Editorial reviewer or supervisor credentials required to approve drafts.',
        },
        { status: 403 }
      )
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
    const { session, errorResponse } = await requireResourcePermission('NEWS', 'canDelete')
    if (errorResponse || !session) return errorResponse

    const { searchParams } = new URL(req.url)
    const slug = searchParams.get('slug')
    if (!slug) {
      return NextResponse.json({ success: false, error: 'slug is required' }, { status: 400 })
    }

    deleteNews(slug, session.name)
    return NextResponse.json({ success: true, message: `News ${slug} deleted successfully` })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
