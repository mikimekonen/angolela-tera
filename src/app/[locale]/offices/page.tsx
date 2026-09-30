import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { SECTOR_OFFICES } from '@/data/mockData'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function OfficesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Executive Directory',
      title: 'Sector Executive Offices',
      subtitle: 'Official directory of the executive bureaus and sector departments governing Angolela Tera Woreda.',
      searchPlaceholder: 'Search by office name or mandate...',
      headLabel: 'Head of Office',
      locationLabel: 'Location',
      phoneLabel: 'Direct Line',
      viewOffice: 'View Office Profile & Services',
      responsibilities: 'Key Mandates',
    },
    am: {
      tag: 'የአስፈጻሚ አካላት ማውጫ',
      title: 'የሴክተር መስሪያ ቤቶች',
      subtitle: 'በአንጎሌላ ተራ ወረዳ ስር የሚገኙ አስፈጻሚ መምሪያዎችና የሴክተር ጽህፈት ቤቶች ዝርዝር።',
      searchPlaceholder: 'በመስሪያ ቤቱ ስም ወይም አገልግሎት ይፈልጉ...',
      headLabel: 'የቢሮው ኃላፊ',
      locationLabel: 'አድራሻ / ቢሮ ቁጥር',
      phoneLabel: 'ቀጥታ ስልክ',
      viewOffice: 'ሙሉ መረጃና አገልግሎቶችን ይመልከቱ',
      responsibilities: 'ዋና ዋና ተግባራት',
    },
    om: {
      tag: 'Waajjiroota Sektera',
      title: 'Waajjiroota Sektera Aanaa',
      subtitle: 'Tarree waajjiroota adda addaa Aanaa Angolallaa Xaraa.',
      searchPlaceholder: 'Maqaa waajjiraatiin barbaadi...',
      headLabel: 'Itti Gaafatamaa',
      locationLabel: 'Bakka / Teessoo',
      phoneLabel: 'Bilbila',
      viewOffice: 'Odeeffannoo Guutuu Ilaali',
      responsibilities: 'Hojiiwwan Ijoo',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              {content.tag}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Offices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {SECTOR_OFFICES.map((office) => {
            const name = office[`name_${locale as Locale}`] || office.name_en
            const head = office[`head_${locale as Locale}`] || office.head_en
            const headTitle = office[`headTitle_${locale as Locale}`] || office.headTitle_en
            const location = office[`location_${locale as Locale}`] || office.location_en
            const about = office[`about_${locale as Locale}`] || office.about_en
            const responsibilities = office[`responsibilities_${locale as Locale}`] || office.responsibilities_en

            return (
              <div
                key={office.slug}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#1a4f8b] transition-all duration-200 flex flex-col justify-between"
              >
                <div className="p-6">
                  {/* Office Header */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="h-10 w-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-xl shrink-0">
                      🏛️
                    </span>
                    <span className="text-[11px] font-semibold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      Sector Bureau
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#0d2340] hover:text-[#1a4f8b] transition-colors leading-snug">
                    <Link href={`/${locale}/offices/${office.slug}`}>
                      {name}
                    </Link>
                  </h2>

                  <p className="text-xs text-gray-600 mt-2 leading-relaxed line-clamp-2">
                    {about}
                  </p>

                  {/* Leadership and Meta Details */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold text-[#0d2340] w-24 shrink-0">
                        {content.headLabel}:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {head} ({headTitle})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold text-[#0d2340] w-24 shrink-0">
                        {content.phoneLabel}:
                      </span>
                      <a href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`} className="text-[#1a4f8b] font-mono hover:underline">
                        {office.phone}
                      </a>
                    </div>

                    <div className="flex items-start gap-2 text-gray-700">
                      <span className="font-semibold text-[#0d2340] w-24 shrink-0">
                        {content.locationLabel}:
                      </span>
                      <span className="text-gray-600">
                        {location}
                      </span>
                    </div>
                  </div>

                  {/* Highlights Bullet List */}
                  <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-100">
                    <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1.5">
                      {content.responsibilities}
                    </div>
                    <ul className="space-y-1 text-xs text-gray-700">
                      {responsibilities.slice(0, 2).map((item, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[#c8931a] font-bold">›</span>
                          <span className="line-clamp-1">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footer link to Office Detail */}
                <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[11px] text-gray-500 font-medium font-mono">
                    {office.email}
                  </span>
                  <Link
                    href={`/${locale}/offices/${office.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] hover:text-[#c8931a] transition-colors"
                  >
                    <span>{content.viewOffice}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
