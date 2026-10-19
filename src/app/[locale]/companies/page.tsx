import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCompanies } from '@/lib/dataStore'
import { CompanySlider, type CompanyItem } from '@/components/companies/CompanySlider'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function CompaniesDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)

  const t = {
    en: {
      badge: 'Economic Registry & Industrial Directory',
      title: 'Private Industries & Commercial Enterprises',
      subtitle:
        'Official registry of leading beverage plants, integrated agro-processing factories, dairy complexes, seed suppliers, and construction enterprises operating in Angolela Tera Woreda.',
      totalCount: 'Registered Industries & Enterprises',
      investorCardTitle: 'Looking to invest in Angolela Tera?',
      investorCardDesc:
        'The Woreda Investment Desk offers accelerated land allocation along the A2 highway corridor, 70-year lease security, and coordinated utility connections.',
      investorBtn: 'Explore Investment Opportunities →',
    },
    am: {
      badge: 'የኢንዱስትሪና ኢንቨስትመንት ማውጫ',
      title: 'የግል ኢንዱስትሪዎችና ፋብሪካዎች ማውጫ',
      subtitle:
        'በአንጎሌላ ተራ ወረዳ ውስጥ በህጋዊ መንገድ የተመዘገቡና በመስራት ላይ የሚገኙ ዘመናዊ የመጠጥ ፋብሪካዎች፣ የተቀናጀ አግሮ-ኢንዱስትሪ፣ የወተት ማቀነባበሪያና የግንባታ ድርጅቶች ዝርዝር።',
      totalCount: 'የተመዘገቡ ኢንዱስትሪዎች',
      investorCardTitle: 'በአንጎሌላ ተራ ኢንቨስት ማድረግ ይፈልጋሉ?',
      investorCardDesc:
        'የወረዳው ኢንቨስትመንት ዴስክ በጫቻ አግሮ-ኢንዱስትሪ ኮሪደር ፈጣን የመሬት አቅርቦትና የ70 ዓመት የሊዝ ዋስትና ያቀርባል።',
      investorBtn: 'የኢንቨስትመንት አማራጮችን ይመልከቱ →',
    },
    om: {
      badge: 'Galmee Warshaalee fi Invastimantii',
      title: 'Warshaalee Dhuunfaa fi Dhaabbilee Daldalaa',
      subtitle:
        'Galmee seera qabeessaa warshaalee dhugaatii ammayyaa, qophii oomishaalee qonnaa fi aannanii, dhiyeessitoota sanyii fi dhaabbilee ijaarsaa Aanaa Angolallaa Xaraa.',
      totalCount: 'Warshaalee Galmaa\'an',
      investorCardTitle: 'Aanaa Angolallaa Xaraatti invast gochuu barbaaddu?',
      investorCardDesc:
        'Waajjirri invastimantii aanaa lafa daandii qarqaraa fi wabii liizii waggaa 70 dhiyeessa.',
      investorBtn: 'Carraawwan Invastimantii Ilaalaa →',
    },
  }[locale as Locale]

  const rawCompanies = getCompanies().filter((c: any) => c.status !== 'ARCHIVED')
  const companies: CompanyItem[] = rawCompanies.map((c: any) => ({
    id: c.id,
    name_en: c.name_en,
    name_am: c.name_am,
    name_om: c.name_om,
    description_en: c.description_en,
    description_am: c.description_am,
    description_om: c.description_om,
    sector: c.sector,
    address: c.address,
    phone: c.phone,
    email: c.email,
    website: c.website,
    established: c.established,
    employeeCount: c.employeeCount,
    photo: c.photo,
    displayOrder: c.displayOrder,
    status: c.status,
  }))

  return (
    <div className="bg-gradient-to-b from-gray-50/70 via-white to-gray-50/50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Hero Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] via-[#153a66] to-[#1a4f8b] rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden border border-white/10">
          {/* Subtle Decorative Elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-radial from-blue-400/20 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-12 w-80 h-32 bg-radial from-amber-400/15 to-transparent rounded-full blur-2xl pointer-events-none" />

          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3.5 py-1 rounded-full inline-block backdrop-blur-xs">
              🏢 {t.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-blue-100/90 leading-relaxed font-normal">
              {t.subtitle}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="text-xs font-bold bg-[#c8931a] text-white px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5 shadow-xs">
                <span>🏭</span>
                <span>{companies.length} {t.totalCount}</span>
              </span>
              <span className="text-xs font-medium text-blue-200 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-xs">
                📍 Chacha Agro-Industrial Corridor (A2 Highway)
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Industry Showcase Slider */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-xs">
          <CompanySlider
            companies={companies}
            locale={locale as Locale}
            showHeading={false}
            showViewToggle={true}
            initialViewMode="slider"
          />
        </div>

        {/* Investment Callout Card */}
        <div className="bg-white border-2 border-[#c8931a]/40 rounded-3xl p-8 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 hover:shadow-md transition-shadow">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-black text-[#0d2340]">
              {t.investorCardTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 max-w-2xl leading-relaxed">
              {t.investorCardDesc}
            </p>
          </div>
          <Link
            href={`/${locale}/investment`}
            className="px-6 py-3.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0"
          >
            {t.investorBtn}
          </Link>
        </div>
      </div>
    </div>
  )
}
