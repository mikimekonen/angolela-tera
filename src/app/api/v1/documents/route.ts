import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getDocuments, createDocument, updateDocument, deleteDocument } from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q')?.toLowerCase()
    const category = searchParams.get('category')
    const status = searchParams.get('status')

    let items = getDocuments()

    if (category) {
      items = items.filter((d: any) => d.category?.toLowerCase() === category.toLowerCase())
    }

    if (status) {
      items = items.filter((d: any) => d.status === status)
    }

    if (q) {
      items = items.filter(
        (d: any) =>
          d.title_en?.toLowerCase().includes(q) ||
          d.title_am?.includes(q) ||
          d.description_en?.toLowerCase().includes(q) ||
          d.officeName?.toLowerCase().includes(q)
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
    if (!body.title_en) {
      return NextResponse.json({ success: false, error: 'title_en is required' }, { status: 400 })
    }

    const newDoc = {
      id: `doc-${Date.now()}`,
      title_en: body.title_en,
      title_am: body.title_am || null,
      category: body.category || 'Application Forms',
      fileUrl: body.fileUrl || '/uploads/documents/document-template.pdf',
      fileSize: body.fileSize || '500 KB',
      fileType: body.fileType || 'PDF',
      officeName: body.officeName || 'Woreda Administration Office',
      description_en: body.description_en || null,
      description_am: body.description_am || null,
      status: body.status || 'PUBLISHED',
      publishedAt: body.publishedAt || new Date().toISOString().split('T')[0],
      displayOrder: body.displayOrder ? Number(body.displayOrder) : 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    createDocument(newDoc, session.email)
    return NextResponse.json({ success: true, data: newDoc }, { status: 201 })
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

    const updated = updateDocument(body.id, body, session.email)
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Document not found' }, { status: 404 })
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

    deleteDocument(id, session.email)
    return NextResponse.json({ success: true, message: 'Document deleted' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
