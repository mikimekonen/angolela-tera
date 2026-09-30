import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { SECTOR_OFFICES, CITIZEN_SERVICES } from '@/data/mockData'

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    for (const office of SECTOR_OFFICES) {
      params.push({ locale, slug: office.slug })
    }
  }
  return params
}

export default async function OfficeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const office = SECTOR_OFFICES.find((o) => o.slug === slug)
  if (!office) notFound()

  // Find services linked to this office
  const relatedServices = CITIZEN_SERVICES.filter((s) => s.officeSlug === office.slug)

  const name = office[`name_${locale as Locale}`] || office.name_en
  const head = office[`head_${locale as Locale}`] || office.head_en
  const headTitle = office[`headTitle_${locale as Locale}`] || office.headTitle_en
  const location = office[`location_${locale as Locale}`] || office.location_en
  const about = office[`about_${locale as Locale}`] || office.about_en
  const responsibilities = office[`responsibilities_${locale as Locale}`] || office.responsibilities_en
  const servicesProvided = office[`servicesProvided_${locale as Locale}`] || office.servicesProvided_en

  const content = {
    en: {
      breadcrumbHome: 'Home',
      breadcrumbOffices: 'Offices',
      contactTitle: 'Direct Office Inquiries',
      leadershipTitle: 'Bureau Leadership',
      responsibilitiesTitle: 'Mandate & Core Responsibilities',
      servicesTitle: 'Citizen Services Provided by this Bureau',
      locationLabel: 'Office Location',
      phoneLabel: 'Direct Telephone',
      emailLabel: 'Official Email',
      hoursLabel: 'Public Hours',
      hoursValue: 'Mon – Fri: 8:30 AM – 5:30 PM (EAT)',
      needAssistance: 'Need Direct Assistance?',
      contactHelpDesk: 'Contact Woreda Grievance Desk',
    },
    am: {
      breadcrumbHome: 'ዋና ገጽ',
      breadcrumbOffices: 'መስሪያ ቤቶች',
      contactTitle: 'የቢሮው አድራሻና ግንኙነት',
      leadershipTitle: 'የቢሮው አመራር',
      responsibilitiesTitle: 'የተቋሙ ተልዕኮና ዋና ዋና ተግባራት',
      servicesTitle: 'በዚህ ቢሮ የሚሰጡ የህዝብ አገልግሎቶች',
      locationLabel: 'የቢሮው መገኛ',
      phoneLabel: 'ቀጥታ ስልክ',
      emailLabel: 'ይፋዊ ኢሜይል',
      hoursLabel: 'የስራ ሰዓት',
      hoursValue: 'ከሰኞ – አርብ፡ 2:30 – 11:30',
      needAssistance: 'እርዳታ ይፈልጋሉ?',
      contactHelpDesk: 'የወረዳውን የቅሬታ ሰሚ ያነጋግሩ',
    },
    om: {
      breadcrumbHome: 'Fuula Duraa',
      breadcrumbOffices: 'Waajjiroota',
      contactTitle: 'Qunnamtii Waajjiraa',
      leadershipTitle: 'Hoggansa Waajjiraa',
      responsibilitiesTitle: 'Itti Gaafatamummaa fi Hojiiwwan Ijoo',
      servicesTitle: 'Tajaajiloota Waajjira Kanaan Kennaman',
      locationLabel: 'Teessoo',
      phoneLabel: 'Bilbila',
      emailLabel: 'Imeelii',
      hoursLabel: 'Sa\'aatii Hojii',
      hoursValue: 'Wiixata – Jimmata: 2:30 – 11:30',
      needAssistance: 'Gargaarsa Barbaadduu?',
      contactHelpDesk: 'Kutaa Komii Aanaa Qunnamaa',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbHome}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/offices`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbOffices}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-semibold truncate max-w-[200px] sm:max-w-none">
            {name}
          </span>
        </nav>

        {/* Main Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
                Woreda Sector Office
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
                {name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 mt-2 max-w-3xl leading-relaxed">
                {about}
              </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 shrink-0 min-w-[260px]">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                {content.leadershipTitle}
              </div>
              <div className="font-bold text-[#0d2340] text-sm sm:text-base">
                {head}
              </div>
              <div className="text-xs text-[#c8931a] font-semibold">
                {headTitle}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs text-gray-600">
                <p>📍 {location}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Two-column Detail Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Responsibilities and Services (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Responsibilities Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#0d2340] border-b border-gray-100 pb-3 mb-4">
                {content.responsibilitiesTitle}
              </h2>
              <ul className="space-y-3">
                {responsibilities.map((resp, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="h-5 w-5 rounded-full bg-blue-50 text-[#1a4f8b] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Public Services Provided */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#0d2340] border-b border-gray-100 pb-3 mb-4">
                {content.servicesTitle}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {servicesProvided.map((service, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-gray-50 border border-gray-100 rounded-lg text-xs font-medium text-gray-800 flex items-center gap-2"
                  >
                    <span className="text-[#c8931a] text-sm">📋</span>
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              {relatedServices.length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">
                    Available Online Catalogs
                  </div>
                  <div className="space-y-2">
                    {relatedServices.map((srv) => (
                      <Link
                        key={srv.slug}
                        href={`/${locale}/services/${srv.slug}`}
                        className="block p-3 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-lg text-xs text-[#1a4f8b] font-semibold transition-colors"
                      >
                        → {srv[`title_${locale as Locale}`] || srv.title_en}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact & Location Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0d2340] border-b border-gray-100 pb-3">
                {content.contactTitle}
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {content.phoneLabel}
                  </span>
                  <a
                    href={`tel:${office.phone.replace(/[^0-9+]/g, '')}`}
                    className="text-[#1a4f8b] font-bold font-mono text-sm hover:underline"
                  >
                    {office.phone}
                  </a>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {content.emailLabel}
                  </span>
                  <span className="text-gray-700 font-mono">
                    {office.email}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {content.locationLabel}
                  </span>
                  <span className="text-gray-700 leading-relaxed block">
                    {location}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {content.hoursLabel}
                  </span>
                  <span className="text-gray-700">
                    {content.hoursValue}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <Link
                  href={`/${locale}/contact`}
                  className="w-full text-center block bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-semibold py-2.5 rounded-lg shadow-sm transition-colors"
                >
                  {content.contactHelpDesk}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
