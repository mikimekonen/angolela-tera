import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { getSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'
import { validateFileBuffer, sanitizeFileName } from '@/lib/fileSecurity'

// Allowed MIME types → storage subdirectory
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg':      'images',
  'image/jpg':       'images',
  'image/png':       'images',
  'image/webp':      'images',
  'application/pdf': 'documents',
}

const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

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
          error: `Unsupported file type: "${declaredMime}". Allowed types: JPEG, PNG, WebP, PDF.`,
        },
        { status: 415 }
      )
    }

    // 2. Read file buffer
    const buffer = Buffer.from(await file.arrayBuffer())

    // 3. Validate size
    if (buffer.byteLength > MAX_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File exceeds maximum allowed size of 10 MB (provided: ${(buffer.byteLength / 1024 / 1024).toFixed(1)} MB).`,
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

    // 6. Security Audit Log
    await createAuditLog({
      userId: session.userId,
      action: 'UPLOAD_MEDIA',
      entityType: 'Media',
      entityId: filename,
      notes: `Uploaded "${file.name}" (${(buffer.byteLength / 1024).toFixed(0)} KB) → ${publicUrl}`,
    })

    return NextResponse.json({
      success: true,
      filename,
      url: publicUrl,
      size: buffer.byteLength,
      mimeType: validation.detectedMime || declaredMime,
      uploadedBy: session.email,
      uploadedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[SECURE MEDIA UPLOAD ERROR]', err)
    return NextResponse.json({ error: 'File upload processing failed.' }, { status: 500 })
  }
}

// GET: list uploaded files safely
export async function GET(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') === 'documents' ? 'documents' : 'images'
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type)

    if (!existsSync(uploadDir)) {
      return NextResponse.json({ files: [], total: 0 })
    }

    const { readdir, stat } = await import('fs/promises')
    const files = await readdir(uploadDir)
    const details = await Promise.all(
      files
        .filter((f) => !f.startsWith('.'))
        .map(async (f) => {
          const s = await stat(path.join(uploadDir, f))
          return {
            filename: f,
            url: `/uploads/${type}/${f}`,
            size: s.size,
            modified: s.mtime.toISOString(),
          }
        })
    )
    details.sort((a, b) => b.modified.localeCompare(a.modified))

    return NextResponse.json({ files: details, total: details.length })
  } catch {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}
