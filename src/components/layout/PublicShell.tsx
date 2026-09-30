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
}

export function PublicShell({ children, locale }: PublicShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 antialiased selection:bg-[#1a4f8b] selection:text-white">
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
      <main className="flex-1 w-full">
        {children}
      </main>

      {/* Floating 24/7 Citizen Speed Dial */}
      <SpeedDial locale={locale} />

      {/* Institutional 4-Column Footer */}
      <Footer locale={locale} />
    </div>
  )
}
