import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import {
  getHomepageSections,
  getSliders,
  getLeadership,
  getServices,
  getNews,
} from '@/lib/dataStore'
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

  // Fetch dynamic configurations and live entity data from persistent store
  const sections = getHomepageSections()
  const sliders = getSliders()
  const leaders = getLeadership()
  const services = getServices()
  const news = getNews()

  const isEnabled = (key: string) => {
    const sec = sections.find((s) => s.sectionKey === key)
    return sec ? sec.isEnabled : true
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Official Governmental Hero Section with Topographic Graphics & Animated Stats */}
      {isEnabled('hero') && <HeroSection locale={locale as Locale} sliders={sliders} />}

      {/* 2. Interactive Citizen Action Finder with Instant Requirements Drawer */}
      {isEnabled('action_finder') && <CitizenActionFinder locale={locale as Locale} />}

      {/* 3. Key Woreda Profile & Verified Stats with Animated Count-Up Metrics */}
      {isEnabled('at_a_glance') && <AtAGlance locale={locale as Locale} />}

      {/* 4. Essential Citizen & Business Public Services */}
      {isEnabled('services') && <ServicesSection locale={locale as Locale} services={services} />}

      {/* 5. Private Companies & Enterprises in the Woreda */}
      {isEnabled('companies') && <CompaniesSection locale={locale as Locale} />}

      {/* 6. Partner Organizations & Development Agencies */}
      {isEnabled('partners') && <PartnersSection locale={locale as Locale} />}

      {/* 7. Executive Leadership & Strategic Governance */}
      {isEnabled('leadership') && <LeadershipSection locale={locale as Locale} leaders={leaders} />}

      {/* 8. Interactive Strategic Investment Sector Radar Banner */}
      {isEnabled('investment') && <InvestmentBanner locale={locale as Locale} />}

      {/* 9. Official News, Council Resolutions & Announcements */}
      {isEnabled('news') && <NewsSection locale={locale as Locale} news={news} />}
    </div>
  )
}
