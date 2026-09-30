'use client'

/**
 * AnnouncementBanner.tsx
 * ──────────────────────────────────────────────────────────
 * Scrolling/static live announcement bar. Reads from the
 * centralized MOCK_ANNOUNCEMENTS store (admin-controlled).
 * ──────────────────────────────────────────────────────────
 */

import React, { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import type { AnnouncementItem } from '@/types'

interface AnnouncementBannerProps {
  locale: Locale
  announcements: AnnouncementItem[]
}

const TYPE_STYLES: Record<string, { bar: string; icon: string }> = {
  INFO:    { bar: 'bg-[#0a192f] border-blue-500/30',  icon: '📢' },
  WARNING: { bar: 'bg-amber-950 border-amber-500/40',  icon: '⚠️' },
  SUCCESS: { bar: 'bg-emerald-950 border-emerald-500/40', icon: '✅' },
  URGENT:  { bar: 'bg-red-950 border-red-500/50',      icon: '🚨' },
}

export function AnnouncementBanner({ locale, announcements }: AnnouncementBannerProps) {
  const active = announcements.filter((a) => a.isActive)
  const [idx, setIdx] = useState(0)
  const [dismissed, setDismissed] = useState(false)

  if (!active.length || dismissed) return null

  const ann = active[Math.min(idx, active.length - 1)]
  const style = TYPE_STYLES[ann.type] ?? TYPE_STYLES.INFO

  const text =
    locale === 'am' ? ann.text_am || ann.text_en :
    locale === 'om' ? ann.text_om || ann.text_en :
    ann.text_en

  return (
    <div
      className={`w-full border-b ${style.bar} text-white text-xs sm:text-sm py-2 px-4 sm:px-6 lg:px-8`}
      role="alert"
      aria-live="polite"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-base shrink-0">{style.icon}</span>
          <p className="text-gray-200 font-medium line-clamp-1 sm:line-clamp-none">
            {text}
          </p>
          {ann.linkUrl && (
            <Link
              href={ann.linkUrl}
              className="shrink-0 text-[#c8931a] font-bold hover:underline ml-1"
            >
              {ann.linkLabel_en ?? 'Read More'} →
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {active.length > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIdx((p) => (p - 1 + active.length) % active.length)}
                className="text-gray-400 hover:text-white p-0.5 transition-colors"
                aria-label="Previous announcement"
              >
                ‹
              </button>
              <span className="text-gray-500 text-[10px]">{idx + 1}/{active.length}</span>
              <button
                onClick={() => setIdx((p) => (p + 1) % active.length)}
                className="text-gray-400 hover:text-white p-0.5 transition-colors"
                aria-label="Next announcement"
              >
                ›
              </button>
            </div>
          )}
          <button
            onClick={() => setDismissed(true)}
            className="text-gray-500 hover:text-gray-200 transition-colors text-lg leading-none"
            aria-label="Dismiss announcement"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
