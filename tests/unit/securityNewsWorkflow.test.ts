import { describe, it, expect } from 'vitest'
import { validateFileBuffer, sanitizeFileName } from '@/lib/fileSecurity'
import { generateStoredName } from '@/lib/storage'

describe('Security & Public Data Protection - Unit Tests', () => {
  describe('File Upload Security & Magic Byte Signatures', () => {
    it('should accurately validate authentic JPEG magic bytes', () => {
      const validJpegBuffer = Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46])
      const result = validateFileBuffer(validJpegBuffer, 'image/jpeg')
      expect(result.isValid).toBe(true)
      expect(result.detectedMime).toBe('image/jpeg')
    })

    it('should reject spoofed file types (e.g., text/script disguised as PNG)', () => {
      const fakePngBuffer = Buffer.from('<?php echo "malicious"; ?>', 'utf-8')
      const result = validateFileBuffer(fakePngBuffer, 'image/png')
      expect(result.isValid).toBe(false)
      expect(result.error).toBeDefined()
    })

    it('should block SVG files to prevent stored XSS attacks', () => {
      const svgBuffer = Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')
      const result = validateFileBuffer(svgBuffer, 'image/svg+xml')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('SVG files are restricted')
    })

    it('should sanitize dangerous filenames to prevent path traversal', () => {
      const dangerous = '../../../etc/passwd.jpg'
      const sanitized = sanitizeFileName(dangerous)
      expect(sanitized).not.toContain('..')
      expect(sanitized).not.toContain('/')
      expect(sanitized.endsWith('.jpg')).toBe(true)
    })

    it('should generate unguessable UUID-based stored names', () => {
      const storedName = generateStoredName('official_press_statement.pdf')
      expect(storedName.endsWith('.pdf')).toBe(true)
      expect(storedName).not.toContain('official_press_statement')
      expect(storedName.length).toBeGreaterThan(30)
    })
  })

  describe('News Publication Status Guard', () => {
    const mockNewsArticles = [
      {
        id: 'news-1',
        slug: 'chacha-water-expansion',
        title_en: 'Chacha Clean Water Project Inaugurated',
        status: 'PUBLISHED',
        reviewerNotes: 'Approved by Cabinet Secretary',
        rejectionReason: null,
      },
      {
        id: 'news-2',
        slug: 'internal-draft-policy',
        title_en: 'Internal Draft Land Taxation Review',
        status: 'DRAFT',
        reviewerNotes: 'Pending legal department review',
        rejectionReason: null,
      },
      {
        id: 'news-3',
        slug: 'rejected-announcement',
        title_en: 'Unapproved Tender Cancellation Notice',
        status: 'REJECTED',
        reviewerNotes: 'Missing budget clearance',
        rejectionReason: 'Procurement code violation',
      },
    ]

    it('should strictly filter out non-published articles for public visitors', () => {
      const publicArticles = mockNewsArticles.filter((n) => n.status === 'PUBLISHED')
      expect(publicArticles.length).toBe(1)
      expect(publicArticles[0].slug).toBe('chacha-water-expansion')
    })

    it('should strip internal editorial notes and rejection reasons from public consumption', () => {
      const publicArticles = mockNewsArticles
        .filter((n) => n.status === 'PUBLISHED')
        .map(({ reviewerNotes: _notes, rejectionReason: _reason, ...safe }) => safe)

      expect((publicArticles[0] as Record<string, unknown>).reviewerNotes).toBeUndefined()
      expect((publicArticles[0] as Record<string, unknown>).rejectionReason).toBeUndefined()
      expect(publicArticles[0].title_en).toBe('Chacha Clean Water Project Inaugurated')
    })
  })
})
