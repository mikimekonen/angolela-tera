import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getDevelopmentProjects } from '@/lib/dataStore'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function DevelopmentPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const isAm = locale === 'am'
  const isOm = locale === 'om'

  const liveProjects = getDevelopmentProjects().filter((p: any) => p.status !== 'ARCHIVED')

  const content = {
    en: {
      tag: 'Public Works & Capital Investment',
      title: 'Infrastructure & Development Projects',
      subtitle: 'Tracking ongoing public investments across clean drinking water schemes, rural connectivity roads, school expansions, and rural electrification in Angolela Tera.',
      statusOngoing: 'Ongoing / In Progress',
      statusCompleted: 'Commissioned / Operational',
      budgetLabel: 'Project Budget',
      contractorLabel: 'Contractor / Agency',
      fundingLabel: 'Funding Source',
      completionLabel: 'Target Completion',
      progressLabel: 'Progress',
      ctaOffices: 'Connect with Infrastructure Bureau',
      ctaContact: 'Submit Infrastructure Feedback',
    },
    am: {
      tag: 'የመንግሥት ስራዎችና የመሰረተ ልማት ኢንቨስትመንት',
      title: 'የመሰረተ ልማትና የልማት ፕሮጀክቶች',
      subtitle: 'በአንጎሌላ ተራ ወረዳ በንጹህ መጠጥ ውሃ፣ በገጠር መንገዶች፣ በትምህርት ቤቶችና በመብራት ሀይል መስፋፋት ላይ የሚሰሩ የልማት ፕሮጀክቶች ክትትል።',
      statusOngoing: 'በሂደት ላይ ያለ',
      statusCompleted: 'ተጠናቆ አገልግሎት የጀመረ',
      budgetLabel: 'የፕሮጀክት በጀት',
      contractorLabel: 'ስራ ተቋራጭ',
      fundingLabel: 'የገንዘብ ምንጭ',
      completionLabel: 'የሚጠናቀቅበት ጊዜ',
      progressLabel: 'የአፈጻጸም ደረጃ',
      ctaOffices: 'የመሰረተ ልማት ቢሮን ያነጋግሩ',
      ctaContact: 'የመሰረተ ልማት አስተያየት ይስጡ',
    },
    om: {
      tag: 'Ijaarsaa fi Misooma',
      title: 'Piroojektiiwwan Misoomaa fi Bu\'uuraalee',
      subtitle: 'Piroojektiiwwan bishaan dhugaatii, daandii baadiyyaa, manneen barumsaa fi ibsaa aanaa Angolallaa Xaraa keessatti gaggeeffamaa jiran.',
      statusOngoing: 'Adeemsa Irra Kan Jiru',
      statusCompleted: 'Kan Xumurame',
      budgetLabel: 'Baajata Piroojektii',
      contractorLabel: 'Ijaaraa',
      fundingLabel: 'Madda Maallaqaa',
      completionLabel: 'Yeroo Xumuramu',
      progressLabel: 'Sadarkaa Raawwii',
      ctaOffices: 'Waajjira Ijaarsaa Qunnamaa',
      ctaContact: 'Yaada Misoomaa Galchaa',
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

        {/* Dynamic Projects List from dataStore */}
        <div className="space-y-6 mb-12">
          {liveProjects.map((proj: any) => {
            const title = isAm ? (proj.title_am || proj.title_en) : isOm ? (proj.title_om || proj.title_en) : proj.title_en
            const desc = isAm ? (proj.description_am || proj.description_en) : isOm ? (proj.description_om || proj.description_en) : proj.description_en
            const budgetFormatted = proj.budget_etb
              ? `${(proj.budget_etb / 1000000).toFixed(1)} Million ETB`
              : (proj.budget || 'Allocated')

            const progress = proj.progressPercent !== undefined ? proj.progressPercent : (proj.status === 'COMPLETED' ? 100 : 50)

            return (
              <div
                key={proj.id}
                className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                <div className="max-w-3xl flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-xs font-bold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                      {proj.sector}
                    </span>
                    <span
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                        proj.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-blue-50 text-blue-800 border-blue-200'
                      }`}
                    >
                      {proj.status === 'COMPLETED' ? content.statusCompleted : `${progress}% ${content.statusOngoing}`}
                    </span>
                    {proj.location_en && (
                      <span className="text-xs text-gray-500 font-medium">
                        📍 {proj.location_en}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg sm:text-xl font-bold text-[#0d2340] leading-snug">
                    {title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                    {desc}
                  </p>

                  {/* Progress Indicator */}
                  <div className="mt-4 pt-3 border-t border-gray-100 max-w-xl">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
                      <span className="font-medium">{content.progressLabel}</span>
                      <span className="font-bold text-[#1a4f8b]">{progress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          progress >= 100
                            ? 'bg-emerald-500'
                            : progress >= 60
                            ? 'bg-blue-600'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
                      />
                    </div>
                  </div>

                  {/* Meta badges */}
                  <div className="mt-4 flex flex-wrap gap-4 text-xs text-gray-500">
                    {proj.contractor && (
                      <div>
                        <span className="font-semibold text-gray-700">{content.contractorLabel}: </span>
                        <span>{proj.contractor}</span>
                      </div>
                    )}
                    {proj.fundingSource && (
                      <div>
                        <span className="font-semibold text-gray-700">{content.fundingLabel}: </span>
                        <span>{proj.fundingSource}</span>
                      </div>
                    )}
                    {proj.expectedCompletion && (
                      <div>
                        <span className="font-semibold text-gray-700">{content.completionLabel}: </span>
                        <span>{proj.expectedCompletion}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Budget Column */}
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 shrink-0 text-left lg:text-right lg:min-w-[200px]">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                    {content.budgetLabel}
                  </span>
                  <span className="text-base sm:text-lg font-extrabold text-[#1a4f8b] block mt-1 font-mono">
                    {budgetFormatted}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Action Link Footer */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 max-w-xl">
            Want to learn more about procurement tenders for woreda capital projects or inspect project progress in your kebele?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/contact`}
              className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-xs transition-colors"
            >
              {content.ctaOffices}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-lg transition-colors"
            >
              {content.ctaContact}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
