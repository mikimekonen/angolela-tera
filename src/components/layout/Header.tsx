'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Emblem } from '@/components/ui/Emblem'
import { GlobalSearch } from '@/components/ui/GlobalSearch'
import type { Locale } from '@/i18n/config'

interface HeaderProps {
  locale: Locale
  onMobileMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function Header({ locale, onMobileMenuToggle, isMobileMenuOpen }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return
    router.push(`/${locale}/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  // Titles based on current locale
  const titles = {
    en: {
      primary: 'Angolela Tera Woreda',
      secondary: 'North Shewa Zone • Amhara National Regional State • Ethiopia',
      subtitle: 'Official Portal for Public Services, Sector Offices & Investment',
      searchPlaceholder: 'Search services, laws, news...',
      citizenDesk: 'Citizen Services',
      contactUs: 'Direct Line',
    },
    am: {
      primary: 'የአንጎሌላ ተራ ወረዳ',
      secondary: 'ሰሜን ሸዋ ዞን • የአማራ ብሔራዊ ክልላዊ መንግሥት • ኢትዮጵያ',
      subtitle: 'የህዝብ አገልግሎቶች፣ ሴክተር መስሪያ ቤቶችና ኢንቨስትመንት ይፋዊ ፖርታል',
      searchPlaceholder: 'አገልግሎቶችን፣ መመሪያዎችን፣ ዜናዎችን ይፈልጉ...',
      citizenDesk: 'የዜጎች አገልግሎት',
      contactUs: 'ቀጥታ መስመር',
    },
    om: {
      primary: 'Aanaa Angolallaa Xaraa',
      secondary: 'Godina Shawaa Kaabaa • Mootummaa Naannoo Amaaraa • Itoophiyaa',
      subtitle: 'Fuula Tajaajila Uummataa, Waajjiroota fi Invastimantii',
      searchPlaceholder: 'Tajaajiloota, seera, oduu barbaadi...',
      citizenDesk: 'Tajaajila Lammiilee',
      contactUs: 'Sarara Kallattii',
    },
  }[locale]

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo & Identity Branding */}
          <Link
            href={`/${locale}`}
            className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] rounded-lg p-1"
          >
            <Emblem size={56} className="transition-transform group-hover:scale-105 duration-200" />

            <div className="flex flex-col">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0d2340] tracking-tight leading-tight group-hover:text-[#1a4f8b] transition-colors">
                {titles.primary}
              </h1>
              <p className="text-[11px] sm:text-xs text-gray-500 font-medium tracking-normal mt-0.5">
                {titles.secondary}
              </p>
              <p className="text-[10px] text-[#c8931a] font-semibold hidden md:block">
                {titles.subtitle}
              </p>
            </div>
          </Link>

          {/* Center/Right: Live Search & Quick Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Live Search */}
            <GlobalSearch locale={locale} />

            {/* Quick Action Button: Citizen Desk */}
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
            >
              <svg className="w-4 h-4 text-[#FED100]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{titles.citizenDesk}</span>
            </Link>

            {/* Quick Action Button: Contact */}
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-1.5 border border-gray-300 hover:border-[#1a4f8b] hover:text-[#1a4f8b] text-gray-700 text-xs font-medium px-3.5 py-2.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4 text-[#1a4f8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>{titles.contactUs}</span>
            </Link>
          </div>

          {/* Mobile Search & Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onMobileMenuToggle}
              className="p-2 rounded-md text-gray-700 hover:text-[#1a4f8b] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
