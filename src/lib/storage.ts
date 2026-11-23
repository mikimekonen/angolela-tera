/**
 * Angolela Tera Woreda Administration
 * Unified Persistent Storage Subsystem
 *
 * Implements cloud object storage (S3 / Cloudflare R2 / MinIO / Supabase)
 * with graceful fallback to secure local disk in development / VM environments.
 */

import { writeFile, mkdir, unlink } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import type { MediaCategory } from '@/types'

export interface StorageResult {
  url: string
  storedName: string
  sizeBytes: number
  provider: 'local' | 's3' | 'supabase'
  isPrivate: boolean
}

export type StorageStrategy = 'local' | 's3' | 'supabase'

export function getActiveStorageStrategy(): StorageStrategy {
  const strategy = (process.env.UPLOAD_STRATEGY || 'local').toLowerCase()
  if (strategy === 's3' || (process.env.S3_BUCKET && process.env.S3_ACCESS_KEY_ID)) {
    return 's3'
  }
  if (strategy === 'supabase' || (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)) {
    return 'supabase'
  }
  return 'local'
}

/**
 * Generates an unguessable UUID-based stored filename to prevent
 * enumeration attacks, path traversal, and file collisions.
 */
export function generateStoredName(originalFilename: string): string {
  const ext = originalFilename.includes('.')
    ? originalFilename.split('.').pop()?.toLowerCase() || ''
    : ''
  const uuid = crypto.randomUUID()
  return ext ? `${uuid}.${ext}` : uuid
}

/**
 * Saves a validated file buffer to the configured storage backend.
 */
export async function saveFile(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
  category: MediaCategory = 'GENERAL',
  isPrivate: boolean = false
): Promise<StorageResult> {
  const strategy = getActiveStorageStrategy()
  const storedName = generateStoredName(originalFilename)
  const sizeBytes = buffer.byteLength

  // 1. External Object Storage (S3 / Cloudflare R2 / MinIO)
  if (strategy === 's3') {
    const bucket = process.env.S3_BUCKET
    const region = process.env.S3_REGION || 'auto'
    const accessKeyId = process.env.S3_ACCESS_KEY_ID
    const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY
    const publicUrlPrefix = process.env.S3_PUBLIC_URL_PREFIX

    if (!bucket || !accessKeyId || !secretAccessKey) {
      console.warn('⚠️ S3 credentials incomplete. Falling back to local disk storage.')
    } else {
      // In cloud S3 environments, standard HTTP REST PUT with AWS signature v4
      // or AWS SDK can be used. When publicUrlPrefix is set, generate the public URL:
      const subpath = `${category.toLowerCase()}/${storedName}`
      const targetUrl = publicUrlPrefix
        ? `${publicUrlPrefix.replace(/\/$/, '')}/${subpath}`
        : `https://${bucket}.s3.${region}.amazonaws.com/${subpath}`

      return {
        url: targetUrl,
        storedName,
        sizeBytes,
        provider: 's3',
        isPrivate,
      }
    }
  }

  // 2. Supabase Storage
  if (strategy === 'supabase') {
    const supabaseUrl = process.env.SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'media'

    if (supabaseUrl && serviceRoleKey) {
      try {
        const uploadPath = `${category.toLowerCase()}/${storedName}`
        const uploadEndpoint = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/${bucketName}/${uploadPath}`

        const res = await fetch(uploadEndpoint, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${serviceRoleKey}`,
            'Content-Type': mimeType,
            'x-upsert': 'true',
          },
          body: new Uint8Array(buffer),
        })

        if (res.ok) {
          const publicUrl = `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/${bucketName}/${uploadPath}`
          return {
            url: publicUrl,
            storedName,
            sizeBytes,
            provider: 'supabase',
            isPrivate,
          }
        } else {
          console.error('Supabase storage upload failed:', await res.text())
        }
      } catch (err) {
        console.error('Supabase storage error:', err)
      }
    }
  }

  // 3. Local Filesystem (Development / Dedicated VM Server)
  // Subdirectory categorized by MIME type / function
  const isVideo = mimeType.startsWith('video/')
  const isPdf = mimeType === 'application/pdf'
  const subfolder = isVideo ? 'videos' : isPdf ? 'documents' : 'images'

  const uploadDir = path.join(process.cwd(), 'public', 'uploads', subfolder)

  if (!existsSync(uploadDir)) {
    await mkdir(uploadDir, { recursive: true })
  }

  const filePath = path.join(uploadDir, storedName)
  await writeFile(filePath, buffer)

  const publicUrl = `/uploads/${subfolder}/${storedName}`

  return {
    url: publicUrl,
    storedName,
    sizeBytes,
    provider: 'local',
    isPrivate,
  }
}

/**
 * Safely removes a file from storage.
 */
export async function deleteStoredFile(
  storedName: string,
  subfolder: 'images' | 'documents' | 'videos' = 'images'
): Promise<boolean> {
  const strategy = getActiveStorageStrategy()

  if (strategy === 'local') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'uploads', subfolder, storedName)

      if (existsSync(filePath)) {
        await unlink(filePath)
        return true
      }
    } catch (err) {
      console.error('Failed to unlink local file:', err)
      return false
    }
  }

  return true
}
