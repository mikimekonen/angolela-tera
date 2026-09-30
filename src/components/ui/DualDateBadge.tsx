'use client'

/**
 * DualDateBadge.tsx
 * Shows both Gregorian and Ethiopian calendar dates.
 * Auto-switches display based on currentLocale.
 */

import React, { useEffect, useState } from 'react'
import type { Locale } from '@/i18n/config'
import { toEthiopian, formatEthiopianDate } from '@/lib/ethiopianCalendar'

interface DualDateBadgeProps {
  locale: Locale
  compact?: boolean
}

const GREGORIAN_MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
]

const GREGORIAN_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export function DualDateBadge({ locale, compact = false }: DualDateBadgeProps) {
  const [dates, setDates] = useState<{ gregorian: string; ethiopian: string } | null>(null)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      const etd = toEthiopian(now)

      // Gregorian short
      const gDay = GREGORIAN_DAYS[now.getDay()]
      const gMonth = GREGORIAN_MONTHS[now.getMonth()]
      const gDate = now.getDate()
      const gYear = now.getFullYear()
      const gregorian = `${gDay}, ${gMonth} ${gDate}, ${gYear}`

      // Ethiopian
      const ethiopian = formatEthiopianDate(etd, locale === 'am' ? 'am' : locale === 'om' ? 'om' : 'en')

      setDates({ gregorian, ethiopian })
    }

    update()
    // Refresh at midnight
    const now = new Date()
    const msToMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const timer = setTimeout(update, msToMidnight)
    return () => clearTimeout(timer)
  }, [locale])

  if (!dates) return null

  if (compact) {
    return (
      <span className="hidden xl:flex items-center gap-1.5 text-gray-400 text-[10px]">
        <svg className="w-3 h-3 text-[#c8931a] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span title={`Ethiopian: ${dates.ethiopian}`} className="whitespace-nowrap">
          {dates.gregorian}
        </span>
        <span className="text-gray-600">•</span>
        <span className="whitespace-nowrap font-medium text-[#c8931a]">
          {dates.ethiopian}
        </span>
      </span>
    )
  }

  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-gray-500">{dates.gregorian}</span>
      <span className="text-[10px] font-semibold text-[#c8931a] whitespace-nowrap">{dates.ethiopian}</span>
    </div>
  )
}
