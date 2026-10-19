import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { getSession } from '@/lib/auth'
import { createAuditLog } from '@/lib/audit'

// Allowed MIME types → subdirectory
const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg':      'images',
  'image/jpg':       'images',
  'image/png':       'images',
  'image/webp':      'images',
  'image/gif':       'images',
  'image/svg+xml':   'images',
  'application/pdf': 'documents',
}

const MAX_SIZE_BYTES = 8 * 1024 * 1024 // 8 MB

function slugifyFilename(name: string): string {
  const ext = path.extname(name)
  const base = path.basename(name, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
  return `${base}-${Date.now()}${ext}`
}

export async function POST(req: NextRequest) {
  try {
    // Auth check via session cookie
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized. Please log in to the admin panel first.' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided. Use form field name "file".' }, { status: 400 })
    }

    // Validate MIME type
    const mimeType = file.type
    const subdir = ALLOWED_TYPES[mimeType]
    if (!subdir) {
      return NextResponse.json({
        error: `Unsupported file type: "${mimeType}". Allowed types: ${Object.keys(ALLOWED_TYPES).join(', ')}`,
      }, { status: 415 })
    }

    // Read & validate size
    const buffer = Buffer.from(await file.arrayBuffer())
    if (buffer.byteLength > MAX_SIZE_BYTES) {
      return NextResponse.json({
        error: `File too large (${(buffer.byteLength / 1024 / 1024).toFixed(1)} MB). Maximum is 8 MB.`,
      }, { status: 413 })
    }

    // Build destination
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', subdir)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    const filename = slugifyFilename(file.name)
    await writeFile(path.join(uploadDir, filename), buffer)

    const publicUrl = `/uploads/${subdir}/${filename}`

    // Audit log
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
      mimeType,
      uploadedBy: session.email,
      uploadedAt: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[MEDIA UPLOAD ERROR]', err)
    return NextResponse.json({ error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}

// GET: list uploaded files in a directory
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') === 'documents' ? 'documents' : 'images'
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', type)

    if (!existsSync(uploadDir)) {
      return NextResponse.json({ files: [], total: 0 })
    }

    const { readdir, stat } = await import('fs/promises')
    const files = await readdir(uploadDir)
    const details = await Promise.all(
      files.map(async (f) => {
        const s = await stat(path.join(uploadDir, f))
        return { filename: f, url: `/uploads/${type}/${f}`, size: s.size, modified: s.mtime.toISOString() }
      })
    )
    details.sort((a, b) => b.modified.localeCompare(a.modified))

    return NextResponse.json({ files: details, total: details.length })
  } catch {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 })
  }
}
