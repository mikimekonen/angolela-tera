/**
 * File upload security & magic byte validation module
 * Protects against MIME-type spoofing, polyglot attacks, path traversal, and malicious file injection.
 */

export interface ValidatedFile {
  isValid: boolean
  detectedMime: string | null
  error?: string
}

// Magic byte signatures for verified formats
const FILE_SIGNATURES: { mime: string; bytes: number[]; offset?: number }[] = [
  { mime: 'image/jpeg', bytes: [0xff, 0xd8, 0xff] },
  { mime: 'image/png', bytes: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mime: 'image/gif', bytes: [0x47, 0x49, 0x46, 0x38] },
  { mime: 'application/pdf', bytes: [0x25, 0x50, 0x44, 0x46] }, // %PDF
]

/**
 * Checks if a buffer is a valid WebP image (RIFF header + WEBP chunk)
 */
function isWebP(buffer: Buffer): boolean {
  if (buffer.length < 12) return false
  const riff = buffer.subarray(0, 4).toString('ascii') === 'RIFF'
  const webp = buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  return riff && webp
}

/**
 * Inspects raw buffer to verify that the file actually matches allowed types
 */
export function validateFileBuffer(buffer: Buffer, declaredMime: string): ValidatedFile {
  if (!buffer || buffer.length === 0) {
    return { isValid: false, detectedMime: null, error: 'Empty file buffer' }
  }

  // 1. Check for WebP
  if (declaredMime === 'image/webp') {
    if (isWebP(buffer)) {
      return { isValid: true, detectedMime: 'image/webp' }
    }
    return { isValid: false, detectedMime: null, error: 'File contents do not match valid WebP image format' }
  }

  // 2. Disallow SVG uploads for security (SVG files can embed executable JavaScript causing Stored XSS)
  if (declaredMime === 'image/svg+xml') {
    return {
      isValid: false,
      detectedMime: null,
      error: 'SVG files are restricted due to cybersecurity policies. Please upload high-resolution PNG or WebP images instead.',
    }
  }

  // 3. Match against known signatures
  for (const sig of FILE_SIGNATURES) {
    const offset = sig.offset || 0
    if (buffer.length < offset + sig.bytes.length) continue

    const match = sig.bytes.every((b, i) => buffer[offset + i] === b)
    if (match) {
      if (sig.mime === declaredMime || (sig.mime === 'image/jpeg' && declaredMime === 'image/jpg')) {
        return { isValid: true, detectedMime: sig.mime }
      }
      return {
        isValid: false,
        detectedMime: sig.mime,
        error: `MIME type mismatch: Declared "${declaredMime}", but file signature is "${sig.mime}"`,
      }
    }
  }

  return {
    isValid: false,
    detectedMime: null,
    error: `Unrecognized or spoofed file format. Allowed formats: JPEG, PNG, WebP, PDF.`,
  }
}

/**
 * Sanitizes a filename to prevent path traversal and shell injection attacks
 */
export function sanitizeFileName(originalName: string): string {
  const clean = originalName
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.') // remove directory traversal '..'
    .trim()

  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const ext = clean.includes('.') ? clean.split('.').pop()?.toLowerCase() || '' : ''
  const base = clean.includes('.') ? clean.substring(0, clean.lastIndexOf('.')) : clean

  return `${base.slice(0, 40)}_${timestamp}_${random}.${ext}`
}
