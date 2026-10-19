import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getPartners } from '@/lib/dataStore'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function PartnersDirectoryPage({
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
      badge: 'Development Cooperation & Strategic Allies',
      title: 'Partnership Organizations & Development Agencies',
      subtitle:
        'Angolela Tera Woreda works hand-in-hand with academic institutions, bilateral development programs, and regional administrations to achieve lasting economic and social progress.',
      scope: 'Strategic Focus & Programs',
      since: 'Cooperating Since',
      hq: 'Headquarters / Jurisdiction',
      visit: 'Official Portal ↗',
    },
    am: {
      badge: 'የልማት ትብብርና ስትራቴጂካዊ አጋሮች',
      title: 'አጋር ድርጅቶችና የልማት ተቋማት',
      subtitle:
        'አንጎሌላ ተራ ወረዳ ዘላቂ የኢኮኖሚና ማህበራዊ እድገትን ለማረጋገጥ ከከፍተኛ የትምህርት ተቋማት፣ ከልማት አጋሮችና ከአስተዳደር አካላት ጋር በጋራ ይሰራል፡',
      scope: 'የትብብር ዘርፍና ፕሮግራሞች',
      since: 'አጋር የሆነበት ዘመን',
      hq: 'ዋና መስሪያ ቤት / ክልል',
      visit: 'ይፋዊ ድረ-ገጽ ↗',
    },
    om: {
      badge: 'Qindoomina Misoomaa',
      title: 'Dhaabbilee Hiriyyummaa fi Dhaabbilee Misoomaa',
      subtitle:
        'Aanaan Angolallaa Xaraa guddina dinagdee fi hawaasummaa mirkaneessuuf dhaabbilee barnootaa fi misoomaa waliin hojjeta.',
      scope: 'Balbalina Hojii',
      since: 'Bara Qindoominaa',
      hq: 'Teessoo',
      visit: 'Marsariitii ↗',
    },
  }[locale as Locale]

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] to-[#1a4f8b] rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full inline-block">
              🤝 {t.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {getPartners().filter((p: any) => p.status !== 'ARCHIVED').map((p: any) => {
            const name =
              locale === 'am' ? p.name_am || p.name_en :
              locale === 'om' ? p.name_om || p.name_en :
              p.name_en

            const desc =
              locale === 'am' ? p.description_am || p.description_en :
              locale === 'om' ? p.description_om || p.description_en :
              p.description_en

            const hasLogo = Boolean(p.logo?.url)

            return (
              <div
                key={p.id}
                className="bg-white border-2 border-gray-200/90 hover:border-[#1a4f8b] rounded-3xl p-7 sm:p-8 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-gray-200 p-2 shadow-xs flex items-center justify-center shrink-0">
                      {hasLogo && p.logo?.url ? (
                        <img
                          src={p.logo.url}
                          alt={name}
                          className="w-full h-full object-contain p-1"
                        />
                      ) : (
                        <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0d2340] to-[#1a4f8b] flex flex-col items-center justify-center text-white text-center p-1">
                          <span className="text-xs font-black tracking-wider text-white">JERR</span>
                          <span className="text-[8px] font-bold text-blue-200 uppercase tracking-widest">PLC</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1.5 text-right">
                      <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {p.partnerType.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 font-semibold bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg">
                        {p.country} 🇪🇹
                      </span>
                    </div>
                  </div>

                  <h2 className="text-xl font-extrabold text-[#0d2340] leading-snug">
                    {name}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-3">
                    {p.phone && <span className="font-semibold text-gray-700">📞 {p.phone}</span>}
                    {p.email && <span className="text-gray-500 hidden sm:inline">✉️ {p.email}</span>}
                  </div>
                  {p.website && (
                    <a
                      href={p.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-bold text-[#1a4f8b] hover:text-[#0d2340] bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      {t.visit}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
