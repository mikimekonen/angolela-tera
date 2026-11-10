import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getOffices, getServices } from '@/lib/dataStore'
import { Landmark, Phone, Mail, MapPin, ArrowRight, ShieldCheck, Clock } from 'lucide-react'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function OfficesDirectoryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const isAm = locale === 'am'
  const offices = getOffices()
  const services = getServices()

  const content = {
    tag: isAm ? 'የመንግሥት መስሪያ ቤቶች ማውጫ' : 'Official Government Directorates',
    title: isAm ? 'የአንጎለላ ጠራ ወረዳ ሴክተር መሥሪያ ቤቶች' : 'Woreda Government Offices Directory',
    subtitle: isAm
      ? 'በአንጎለላ ጠራ ወረዳ አስተዳደር ስር የሚገኙ ይፋዊ የሴክተር መሥሪያ ቤቶች፣ የኃላፊዎች ስም፣ የሥራ ኃላፊነቶች፣ አድራሻ እና የሚሰጡ አገልግሎቶች ዝርዝር።'
      : 'Comprehensive directory of official sector directorates, designated bureau heads, statutory mandates, operating hours, and citizen services across Angolela Tera Woreda.',
    workingHoursLabel: isAm ? 'የሥራ ሰዓት' : 'Working Hours',
    workingHoursVal: isAm ? 'ከሰኞ - አርብ፡ 2:30 - 11:30 (ምሳ 6:30 - 7:30)' : 'Mon – Fri: 8:30 AM – 5:30 PM (Lunch: 12:30 – 1:30 PM)',
    viewOfficeBtn: isAm ? 'ዝርዝር መረጃ እና አገልግሎቶች' : 'View Directorate & Services',
    headLabel: isAm ? 'የመሥሪያ ቤቱ ኃላፊ' : 'Directorate Head',
    contactTitle: isAm ? 'ቀጥታ አድራሻ' : 'Official Coordinates',
    servicesTitle: isAm ? 'የሚሰጡ ዋና ዋና አገልግሎቶች' : 'Core Public Services',
    needAssistanceTitle: isAm ? 'የአገልግሎት አሰጣጥ መዘግየት ወይም ቅሬታ አለዎት?' : 'Encountering Administrative Delays or Have Inquiries?',
    needAssistanceDesc: isAm
      ? 'የወረዳው የዜጎች ቅሬታ ሰሚ ኮሚቴ በጫጫ አስተዳደር ቅጥር ጊቢ ህንጻ ሀ ውስጥ ይገኛል። አቤቱታዎን በድረ-ገጹ በኩል በቀጥታ ማቅረብ ይችላሉ።'
      : 'The Woreda Citizen Grievance & Ombudsman Desk operates in Block A of the Chacha Administrative Complex. You can file a formal inquiry or track petition status online.',
    filePetitionBtn: isAm ? 'አቤቱታ / ቅሬታ ያቅርቡ' : 'File Citizen Petition',
    trackPetitionBtn: isAm ? 'የጉዳይዎን ደረጃ ይከታተሉ' : 'Track Existing Petition',
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {isAm ? 'መነሻ' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/about`} className="hover:text-[#1a4f8b] transition-colors">
            {isAm ? 'ስለ ወረዳው' : 'About'}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-bold">{isAm ? 'ሴክተር መሥሪያ ቤቶች' : 'Offices'}</span>
        </nav>

        {/* Header Hero Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-10 shadow-xs relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              <Landmark className="w-3.5 h-3.5" />
              <span>{content.tag}</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2.5 leading-relaxed">
              {content.subtitle}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 p-3 rounded-xl">
              <div className="flex items-center gap-1.5 text-gray-700">
                <Clock className="w-4 h-4 text-[#1a4f8b]" />
                <span className="font-semibold text-gray-900">{content.workingHoursLabel}:</span>
                <span>{content.workingHoursVal}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-700">
                <ShieldCheck className="w-4 h-4" />
                <span>{isAm ? 'በህግ የተረጋገጡ 20 ሴክተሮች' : '20 Legally Gazetted Sectors'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Directorate Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {offices.map((office: any) => {
            const name = isAm ? (office.name_am || office.name_en) : office.name_en
            const head = isAm ? (office.head_am || office.head_en) : office.head_en
            const headTitle = isAm ? (office.headTitle_am || office.headTitle_en) : office.headTitle_en
            const location = isAm ? (office.location_am || office.location_en) : office.location_en
            const about = isAm ? (office.about_am || office.about_en) : office.about_en

            // Filter services linked to this office
            const linkedServices = services.filter(
              (s: any) => s.officeSlug === office.slug || s.officeId === office.id || s.officeId === office.slug
            )

            return (
              <div
                key={office.slug}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-bold text-[#1a4f8b] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 uppercase tracking-wide">
                      {isAm ? 'ሴክተር ቢሮ' : 'Sector Directorate'}
                    </span>
                    <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-0.5 rounded-full border border-gray-200">
                      {linkedServices.length} {isAm ? 'አገልግሎቶች' : 'Services'}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-[#0d2340] hover:text-[#1a4f8b] transition-colors">
                    <Link href={`/${locale}/offices/${office.slug}`}>
                      {name}
                    </Link>
                  </h2>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed line-clamp-3">
                    {about}
                  </p>

                  {/* Office Head Profile */}
                  <div className="mt-4 p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 block">
                        {content.headLabel}
                      </span>
                      <span className="text-xs font-bold text-[#0d2340]">
                        {head || (isAm ? 'ይፋዊ ኃላፊ' : 'Designated Director')}
                      </span>
                      {headTitle && (
                        <span className="text-[11px] text-gray-500 block">
                          {headTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Coordinates */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{location || (isAm ? 'የጫጫ አስተዳደር ቅጥር ጊቢ' : 'Chacha Administrative Compound')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span>{office.phone || '+251 (0) 58 661 0100'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="truncate">{office.email || 'angolelatera1@gmail.com'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <Link
                    href={`/${locale}/offices/${office.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] hover:text-[#133a6b] transition-colors"
                  >
                    <span>{content.viewOfficeBtn}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Public Ombudsman / Grievance CTA */}
        <div className="mt-14 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-base sm:text-lg font-bold text-[#0d2340]">
              {content.needAssistanceTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
              {content.needAssistanceDesc}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-1.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <span>{content.filePetitionBtn}</span>
              <span>→</span>
            </Link>
            <Link
              href={`/${locale}/track`}
              className="inline-flex items-center gap-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[#0d2340] text-xs font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              <span>{content.trackPetitionBtn}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
