'use client'

import React, { useState } from 'react'
import { TopStrip } from '@/components/layout/TopStrip'
import { Header } from '@/components/layout/Header'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { AnnouncementBanner } from '@/components/ui/AnnouncementBanner'
import { SpeedDial } from '@/components/ui/SpeedDial'
import { MOCK_ANNOUNCEMENTS } from '@/data/entityData'
import type { Locale } from '@/i18n/config'

interface PublicShellProps {
  children: React.ReactNode
  locale: Locale
  settings?: Record<string, string>
}

export function PublicShell({ children, locale, settings }: PublicShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-[#1a4f8b] selection:text-white">
      {/* WCAG 2.2 AA Bypass Block: Skip to Main Content Link for Keyboard and Screen-Reader Users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:px-4 focus:py-2.5 focus:bg-[#1a4f8b] focus:text-white focus:font-bold focus:rounded-lg focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
      >
        {locale === 'am' ? 'ወደ ዋናው ይዘት ይዝለሉ' : 'Skip to main content'}
      </a>

      {/* Official Government Top Bar with Ethiopian Calendar Date */}
      <TopStrip currentLocale={locale} />

      {/* Main Governmental Header with Official Seal & Search */}
      <Header
        locale={locale}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Primary Navigation Bar */}
      <Navigation
        locale={locale}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Live Official Announcements Banner */}
      <AnnouncementBanner locale={locale} announcements={MOCK_ANNOUNCEMENTS} />

      {/* Main Page Content */}
      <main id="main-content" tabIndex={-1} className="flex-1 w-full focus:outline-none">
        {children}
      </main>

      {/* Floating 24/7 Citizen Speed Dial */}
      <SpeedDial locale={locale} />

      {/* Institutional 4-Column Footer */}
      <Footer locale={locale} settings={settings} />
    </div>
  )
}
