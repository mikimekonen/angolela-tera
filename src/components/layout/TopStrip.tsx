'use client'

import React, { useState, useRef, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { locales, localeNames, type Locale } from '@/i18n/config'
import { EthiopianFlag } from '@/components/ui/EthiopianFlag'
import { DualDateBadge } from '@/components/ui/DualDateBadge'

interface TopStripProps {
  currentLocale: Locale
}

export function TopStrip({ currentLocale }: TopStripProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLanguageChange = (newLocale: Locale) => {
    if (newLocale === currentLocale) {
      setIsOpen(false)
      return
    }

    // Set cookie for persistence
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`

    // Replace the locale in current pathname
    // e.g. /en/about -> /am/about
    const segments = pathname.split('/')
    if (locales.includes(segments[1] as Locale)) {
      segments[1] = newLocale
    } else {
      segments.unshift('', newLocale)
    }
    const newPath = segments.join('/') || `/${newLocale}`

    setIsOpen(false)
    router.push(newPath)
  }

  return (
    <div className="bg-[#0a192f] text-gray-200 border-b border-white/10 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        {/* Left: Official Government Designation & Ethiopian Tricolor Bar */}
        <div className="flex items-center gap-2.5">
          {/* Official Ethiopian Flag with Central Blue Emblem & Star */}
          <EthiopianFlag width={22} height={11} />
          <span className="font-medium tracking-wide text-gray-300 hidden sm:inline">
            Federal Democratic Republic of Ethiopia • Amhara National Regional State
          </span>
          <span className="text-gray-400 hidden md:inline">|</span>
          <span className="text-[#c8931a] font-semibold tracking-wide">
            Angolela Tera Woreda
          </span>
        </div>

        {/* Right: Date, Working Hours, Emergency Contact & Language Switcher */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Dual-Calendar Date */}
          <DualDateBadge locale={currentLocale} compact />

          {/* Working Hours */}
          <div className="hidden xl:flex items-center gap-1.5 text-gray-400">
            <svg className="w-3.5 h-3.5 text-[#c8931a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Mon–Fri: 8:30–5:30 (EAT)</span>
          </div>

          {/* Emergency Hotline */}
          <a
            href="tel:+251586610000"
            className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors"
            title="Woreda Emergency Desk"
          >
            <svg className="w-3.5 h-3.5 text-red-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-semibold text-gray-200">Hotline: +251 58 661 xxxx</span>
          </a>

          <span className="text-gray-600">|</span>

          {/* Language Selector Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 bg-white/10 hover:bg-white/15 text-white px-2.5 py-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#c8931a]"
              aria-haspopup="true"
              aria-expanded={isOpen}
              aria-label="Select Language"
            >
              <svg className="w-3.5 h-3.5 text-[#c8931a]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
              <span className="font-medium">{localeNames[currentLocale]}</span>
              <svg className={`w-3 h-3 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isOpen && (
              <div
                className="absolute right-0 mt-1.5 w-44 bg-[#0d2340] border border-[#1a4f8b] rounded-md shadow-xl py-1 z-50 overflow-hidden"
                role="menu"
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-gray-400 border-b border-white/10">
                  Select Language / ቋንቋ
                </div>
                {locales.map((loc) => {
                  const isCurrent = loc === currentLocale
                  return (
                    <button
                      key={loc}
                      onClick={() => handleLanguageChange(loc)}
                      className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors ${
                        isCurrent
                          ? 'bg-[#1a4f8b] text-white font-semibold'
                          : 'text-gray-200 hover:bg-white/10 hover:text-white'
                      }`}
                      role="menuitem"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase text-[#c8931a]">{loc}</span>
                        <span>{localeNames[loc]}</span>
                      </div>
                      {isCurrent && (
                        <svg className="w-3.5 h-3.5 text-[#FED100]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
