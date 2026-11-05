import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { getSession } from '@/lib/auth'
import { validateFileBuffer, sanitizeFileName } from '@/lib/fileSecurity'
import {
  getMediaAssets,
  createMediaAsset,
  updateMediaAsset,
  deleteMediaAsset,
  getMediaUsage,
} from '@/lib/dataStore'
import type { MediaCategory } from '@/types'

// Allowed MIME types → storage subdirectory
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg':      'images',
  'image/jpg':       'images',
  'image/png':       'images',
  'image/webp':      'images',
  'application/pdf': 'documents',
  'video/mp4':       'videos',
  'video/webm':      'videos',
}

const MAX_IMAGE_SIZE = 15 * 1024 * 1024  // 15 MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024  // 50 MB

export async function POST(req: NextRequest) {
  try {
    // 1. Authentication check
    const session = await getSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized. Administrative session required for media upload.' },
        { status: 401 }
      )
    }

    if (session.role === 'VIEWER') {
      return NextResponse.json(
        { error: 'Forbidden. Read-only viewers cannot upload media assets.' },
        { status: 403 }
      )
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided. Use form field name "file".' },
        { status: 400 }
      )
    }

    const declaredMime = file.type
    const subdir = ALLOWED_TYPES[declaredMime]
    if (!subdir) {
      return NextResponse.json(
        {
          error: `Unsupported file type: "${declaredMime}". Allowed types: JPEG, PNG, WebP, PDF, MP4, WebM.`,
        },
        { status: 415 }
      )
    }

    // 2. Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // 3. Validate size
    const isVideo = declaredMime.startsWith('video/')
    const maxAllowed = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE
    const maxMb = isVideo ? 50 : 15

    if (buffer.byteLength > maxAllowed) {
      return NextResponse.json(
        {
          error: `File exceeds maximum allowed size of ${maxMb} MB (provided: ${(buffer.byteLength / 1024 / 1024).toFixed(1)} MB).`,
        },
        { status: 413 }
      )
    }

    // 4. Validate magic byte signatures & content integrity
    const validation = validateFileBuffer(buffer, declaredMime)
    if (!validation.isValid) {
      return NextResponse.json(
        {
          error: validation.error || 'File validation failed: signature does not match format.',
        },
        { status: 422 }
      )
    }

    // 5. Secure random file naming and storage
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filename = sanitizeFileName(file.name)
    await writeFile(path.join(uploadDir, filename), buffer)

    const publicUrl = `/uploads/${subdir}/${filename}`

    // 6. Register into Centralized Media Library Asset Store
    const mediaType = isVideo ? 'VIDEO' : subdir === 'documents' ? 'DOCUMENT' : 'IMAGE'
    const categoryRaw = formData.get('category') as string | null
    const category: MediaCategory = (categoryRaw as MediaCategory) || (isVideo ? 'VIDEOS' : subdir === 'documents' ? 'DOCUMENTS' : 'GENERAL')
    const title = (formData.get('title') as string) || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
    const altText_en = (formData.get('altText_en') as string) || title
    const altText_am = (formData.get('altText_am') as string) || undefined
    const altText_om = (formData.get('altText_om') as string) || undefined
    const caption = (formData.get('caption') as string) || undefined

    const asset = createMediaAsset(
      {
        title,
        filename,
        url: publicUrl,
        category,
        mediaType,
        mimeType: validation.detectedMime || declaredMime,
        fileSize: buffer.byteLength,
        altText_en,
        altText_am,
        altText_om,
        caption,
        uploadedBy: session.email,
      },
      session.name
    )

    return NextResponse.json({
      success: true,
      asset,
      filename,
      url: publicUrl,
      size: buffer.byteLength,
      mimeType: validation.detectedMime || declaredMime,
      uploadedBy: session.email,
      uploadedAt: asset.createdAt,
    })
  } catch (err) {
    console.error('[SECURE MEDIA UPLOAD ERROR]', err)
    return NextResponse.json({ error: 'File upload processing failed.' }, { status: 500 })
  }
}

// GET: query media assets safely with category, search, and usage checks
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const checkUsageUrl = searchParams.get('checkUsage')
    if (checkUsageUrl) {
      const usages = getMediaUsage(checkUsageUrl)
      return NextResponse.json({ success: true, usages, inUse: usages.length > 0 })
    }

    const category = searchParams.get('category') || 'ALL'
    const search = searchParams.get('search') || ''
    const assets = getMediaAssets(category, search)

    // Also support backward compatibility for legacy callers expecting `files: [...]`
    const files = assets.map((a) => ({
      id: a.id,
      filename: a.filename,
      url: a.url,
      size: a.fileSize,
      modified: a.createdAt,
      category: a.category,
      mediaType: a.mediaType,
      title: a.title,
    }))

    return NextResponse.json({
      success: true,
      assets,
      files,
      total: assets.length,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to retrieve media library assets' }, { status: 500 })
  }
}

// PATCH: update asset metadata (title, category, alt text, caption)
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.role === 'VIEWER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await req.json()
    const { id, title, category, altText_en, altText_am, altText_om, caption } = body

    if (!id) {
      return NextResponse.json({ error: 'Media asset ID is required' }, { status: 400 })
    }

    const updated = updateMediaAsset(
      id,
      {
        title,
        category,
        altText_en,
        altText_am,
        altText_om,
        caption,
      },
      session.name
    )

    if (!updated) {
      return NextResponse.json({ error: 'Media asset not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, asset: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update asset'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

// DELETE: safely delete an asset with reference usage checks
export async function DELETE(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.role === 'VIEWER') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Media asset ID is required' }, { status: 400 })
    }

    const assets = getMediaAssets()
    const targetAsset = assets.find((a) => a.id === id)

    const result = deleteMediaAsset(id, session.name)
    if (!result.success) {
      return NextResponse.json(
        {
          error: result.error,
          usages: result.usages,
          inUse: true,
        },
        { status: 409 } // Conflict: asset in active use
      )
    }

    // If disk file exists, delete it
    if (targetAsset && targetAsset.url.startsWith('/uploads/')) {
      const diskPath = path.join(process.cwd(), 'public', targetAsset.url.replace(/^\//, ''))
      if (existsSync(diskPath)) {
        try {
          await unlink(diskPath)
        } catch (unlinkErr) {
          console.warn('[MEDIA DELETE DISK WARNING]', unlinkErr)
        }
      }
    }

    return NextResponse.json({ success: true, message: 'Media asset deleted successfully.' })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete media asset'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
