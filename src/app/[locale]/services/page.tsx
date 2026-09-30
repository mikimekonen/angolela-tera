import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { CITIZEN_SERVICES } from '@/data/mockData'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Public Service Delivery',
      title: 'Citizen & Commercial Services Directory',
      subtitle: 'Complete guidelines, requirements, timelines, and statutory fees for public services provided in Angolela Tera Woreda.',
      timeLabel: 'Standard Processing Time',
      costLabel: 'Statutory Fee',
      officeLabel: 'Service Bureau',
      viewGuide: 'Read Step-by-Step Guide & Requirements',
      needHelp: 'Have questions or service grievances?',
      contactHelp: 'Visit Citizen Help & Grievance Desk',
    },
    am: {
      tag: 'የህዝብ አገልግሎት አሰጣጥ',
      title: 'የዜጎችና የንግድ አገልግሎቶች ማውጫ',
      subtitle: 'በአንጎሌላ ተራ ወረዳ የሚሰጡ አገልግሎቶች ቅድመ ሁኔታዎች፣ የጊዜ ሰሌዳ እና ህጋዊ የአገልግሎት ክፍያዎች።',
      timeLabel: 'የሚፈጀው ጊዜ',
      costLabel: 'ህጋዊ ክፍያ',
      officeLabel: 'አገልግሎት ሰጪው ጽ/ቤት',
      viewGuide: 'የአገልግሎት አሰጣጥ መመሪያና ቅድመ ሁኔታዎችን ይመልከቱ',
      needHelp: 'ቅሬታ ወይም ተጨማሪ ጥያቄ አለዎት?',
      contactHelp: 'የወረዳውን የቅሬታ ሰሚ ያነጋግሩ',
    },
    om: {
      tag: 'Tajaajila Uummataa',
      title: 'Tarree Tajaajiloota Uummataa fi Daldalaa',
      subtitle: 'Ulaagaalee, yeroo fudhatu fi kaffaltii tajaajiloota aanaa keenyaa.',
      timeLabel: 'Yeroo Fudhatu',
      costLabel: 'Kaffaltii Seeraa',
      officeLabel: 'Waajjira Kennu',
      viewGuide: 'Qajeelfama fi Ulaagaalee Dubbisi',
      needHelp: 'Komiin yookiin gaaffiin qabduu?',
      contactHelp: 'Kutaa Komii Uummataa Qunnamaa',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {CITIZEN_SERVICES.map((srv) => {
            const title = srv[`title_${locale as Locale}`] || srv.title_en
            const category = srv[`category_${locale as Locale}`] || srv.category_en
            const officeName = srv[`officeName_${locale as Locale}`] || srv.officeName_en
            const time = srv[`processingTime_${locale as Locale}`] || srv.processingTime_en
            const cost = srv[`cost_${locale as Locale}`] || srv.cost_en
            const desc = srv[`description_${locale as Locale}`] || srv.description_en

            return (
              <div
                key={srv.slug}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:shadow-md hover:border-[#1a4f8b] transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-semibold text-[#1a4f8b] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      {category}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      ⏱️ {time}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#0d2340] hover:text-[#1a4f8b] transition-colors leading-snug">
                    <Link href={`/${locale}/services/${srv.slug}`}>
                      {title}
                    </Link>
                  </h2>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                    {desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold text-[#0d2340] w-28 shrink-0">
                        {content.costLabel}:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {cost}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <span className="font-semibold text-[#0d2340] w-28 shrink-0">
                        {content.officeLabel}:
                      </span>
                      <span className="text-gray-600 truncate">
                        {officeName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/${locale}/services/${srv.slug}`}
                    className="w-full text-center inline-flex items-center justify-center gap-1.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-semibold py-2.5 px-4 rounded-lg shadow-xs transition-colors"
                  >
                    <span>{content.viewGuide}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Help Banner */}
        <div className="mt-12 bg-white border border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-sm text-[#0d2340]">
              {content.needHelp}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Our Citizen Grievance Redress Office in Chacha handles administrative delays, document appeals, and appeals.
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] text-xs font-bold px-5 py-2.5 rounded-lg shadow-xs transition-colors shrink-0"
          >
            <span>{content.contactHelp}</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
