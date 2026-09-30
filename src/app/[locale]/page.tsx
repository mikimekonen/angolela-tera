import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { HeroSection } from '@/components/home/HeroSection'
import { CitizenActionFinder } from '@/components/home/CitizenActionFinder'
import { AtAGlance } from '@/components/home/AtAGlance'
import { ServicesSection } from '@/components/home/ServicesSection'
import { CompaniesSection } from '@/components/home/CompaniesSection'
import { PartnersSection } from '@/components/home/PartnersSection'
import { LeadershipSection } from '@/components/home/LeadershipSection'
import { InvestmentBanner } from '@/components/home/InvestmentBanner'
import { NewsSection } from '@/components/home/NewsSection'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)

  return (
    <div className="flex flex-col w-full">
      {/* 1. Official Governmental Hero Section */}
      <HeroSection locale={locale as Locale} />

      {/* 2. Citizen Action Finder ("I Want To..." / "ምን ማድረግ ይፈልጋሉ?") */}
      <CitizenActionFinder locale={locale as Locale} />

      {/* 3. Key Woreda Profile & Verified Stats (At a Glance) */}
      <AtAGlance locale={locale as Locale} />

      {/* 4. Essential Citizen & Business Public Services */}
      <ServicesSection locale={locale as Locale} />

      {/* 5. Private Companies & Enterprises in the Woreda */}
      <CompaniesSection locale={locale as Locale} />

      {/* 6. Partner Organizations & Development Agencies */}
      <PartnersSection locale={locale as Locale} />

      {/* 7. Executive Leadership & Sector Directors */}
      <LeadershipSection locale={locale as Locale} />

      {/* 8. Strategic Investment & Economic Corridor Banner */}
      <InvestmentBanner locale={locale as Locale} />

      {/* 9. Official News, Council Resolutions & Announcements */}
      <NewsSection locale={locale as Locale} />
    </div>
  )
}
