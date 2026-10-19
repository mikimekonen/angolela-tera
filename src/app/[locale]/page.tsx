import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getHomepageSections, getSliders } from '@/lib/dataStore'
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

  // Fetch dynamic section configurations and sliders from persistent store
  const sections = getHomepageSections()
  const sliders = getSliders()

  const isEnabled = (key: string) => {
    const sec = sections.find((s) => s.sectionKey === key)
    return sec ? sec.isEnabled : true
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Official Governmental Hero Section */}
      {isEnabled('hero') && <HeroSection locale={locale as Locale} sliders={sliders} />}

      {/* 2. Citizen Action Finder ("I Want To..." / "ምን ማድረግ ይፈልጋሉ?") */}
      {isEnabled('action_finder') && <CitizenActionFinder locale={locale as Locale} />}

      {/* 3. Key Woreda Profile & Verified Stats (At a Glance) */}
      {isEnabled('at_a_glance') && <AtAGlance locale={locale as Locale} />}

      {/* 4. Essential Citizen & Business Public Services */}
      {isEnabled('services') && <ServicesSection locale={locale as Locale} />}

      {/* 5. Private Companies & Enterprises in the Woreda */}
      {isEnabled('companies') && <CompaniesSection locale={locale as Locale} />}

      {/* 6. Partner Organizations & Development Agencies */}
      {isEnabled('partners') && <PartnersSection locale={locale as Locale} />}

      {/* 7. Executive Leadership & Sector Directors */}
      {isEnabled('leadership') && <LeadershipSection locale={locale as Locale} />}

      {/* 8. Strategic Investment & Economic Corridor Banner */}
      {isEnabled('investment') && <InvestmentBanner locale={locale as Locale} />}

      {/* 9. Official News, Council Resolutions & Announcements */}
      {isEnabled('news') && <NewsSection locale={locale as Locale} />}
    </div>
  )
}
