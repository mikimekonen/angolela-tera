'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { AlertTriangle, ArrowRight, X, Megaphone, CheckCircle } from 'lucide-react'

interface EmergencyBannerProps {
  locale: Locale
}

export function EmergencyBanner({ locale }: EmergencyBannerProps) {
  const isAm = locale === 'am'
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const content = {
    badge: isAm ? 'ይፋዊ የወረዳው ማስታወቂያ' : 'Official Government Notice',
    title: isAm
      ? 'የ2018 ዓ.ም የሰብል አዝመራ ማዳበሪያና ምርጥ ዘር ድልድል በሁሉም ቀበሌዎች ተጀመረ'
      : 'Seasonal Agricultural Seed & Fertilizer Distribution Active Across All 19 Kebeles',
    summary: isAm
      ? 'አርሶ አደሮች የይዞታ ደብተራቸውን ይዘው በአቅራቢያቸው በሚገኘው የግብርና ኤክስቴንሽን ማዕከል (FTC) በአካል በመገኘት ቫውቸራቸውን እንዲወስዱ እናሳስባለን።'
      : 'Farmers are advised to present their Landholding Book (Green Book) at their local Kebele Farmer Training Center (FTC) to claim certified wheat & barley vouchers.',
    cta: isAm ? 'መመሪያውንና የጊዜ ሰሌዳውን ይመልከቱ' : 'View Directive & Distribution Schedule',
    href: `/${locale}/news/announcements`,
  }

  return (
    <div className="bg-amber-500/10 border-b border-amber-300/60 bg-gradient-to-r from-amber-500/15 via-amber-400/10 to-amber-500/15 text-[#0d2340] py-3 px-4 sm:px-6 transition-all duration-200">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-start sm:items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/20 border border-amber-500/30 rounded-md font-bold text-amber-900 text-[11px] uppercase tracking-wide shrink-0">
            <Megaphone className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
            <span>{content.badge}</span>
          </span>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <span className="font-extrabold text-[#0d2340]">{content.title}:</span>
            <span className="text-gray-700 text-xs hidden md:inline">{content.summary}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-auto sm:ml-0">
          <Link
            href={content.href}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1a4f8b] hover:text-[#133a6b] hover:underline"
          >
            <span>{content.cta}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss announcement"
            className="p-1 rounded-md text-gray-500 hover:text-gray-900 hover:bg-amber-200/50 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
