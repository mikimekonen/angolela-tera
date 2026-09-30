'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface SpeedDialProps {
  locale: Locale
}

export function SpeedDial({ locale }: SpeedDialProps) {
  const [open, setOpen] = useState(false)

  const t = {
    en: {
      emergency: 'Emergency Hotline',
      grievance: 'File Grievance',
      services: 'Browse Services',
      contact: 'Woreda Desk',
      tooltip: 'Citizen Quick Help Desk',
    },
    am: {
      emergency: 'የአደጋ ጊዜ ስልክ',
      grievance: 'ቅሬታ ማቅረቢያ',
      services: 'አገልግሎቶች',
      contact: 'የወረዳው መረጃ ዴስክ',
      tooltip: 'ፈጣን የዜጎች እገዛ',
    },
    om: {
      emergency: 'Bilbila Balaa',
      grievance: 'Komii Dhiyeessuu',
      services: 'Tajaajiloota',
      contact: 'Waajjira Aanaa',
      tooltip: 'Gargaarsa Ariifachiisaa',
    },
  }[locale]

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2.5">
      {/* Sub menu items when open */}
      {open && (
        <div className="flex flex-col items-end gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {/* Emergency Hotline */}
          <a
            href="tel:+251586610000"
            className="flex items-center gap-2.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-lg text-xs font-bold transition-all hover:scale-105 group"
            title={t.emergency}
          >
            <span className="hidden sm:inline font-semibold">{t.emergency} (+251 58 661 xxxx)</span>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
              🚨
            </span>
          </a>

          {/* Grievance Desk */}
          <Link
            href={`/${locale}/contact`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-[#0d2340] hover:bg-[#1a4f8b] text-white rounded-full shadow-lg text-xs font-bold transition-all hover:scale-105 group"
            title={t.grievance}
          >
            <span className="hidden sm:inline font-semibold">{t.grievance}</span>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
              ⚖️
            </span>
          </Link>

          {/* Public Services Directory */}
          <Link
            href={`/${locale}/services`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white rounded-full shadow-lg text-xs font-bold transition-all hover:scale-105 group"
            title={t.services}
          >
            <span className="hidden sm:inline font-semibold">{t.services}</span>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
              📑
            </span>
          </Link>

          {/* Woreda Desk & Working Hours */}
          <Link
            href={`/${locale}/about`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full shadow-lg text-xs font-bold transition-all hover:scale-105 group"
            title={t.contact}
          >
            <span className="hidden sm:inline font-semibold">{t.contact}</span>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">
              🏛️
            </span>
          </Link>
        </div>
      )}

      {/* Main floating action button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={t.tooltip}
        className="w-14 h-14 rounded-full bg-[#1a4f8b] hover:bg-[#0d2340] text-white shadow-xl flex items-center justify-center text-2xl transition-all duration-300 hover:scale-110 focus:outline-hidden focus:ring-4 focus:ring-[#c8931a]/40 cursor-pointer border-2 border-white/30"
      >
        <span className={`transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
          {open ? '✕' : '⚡'}
        </span>
      </button>
    </div>
  )
}
