import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { MOCK_PARTNERS } from '@/data/entityData'

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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_PARTNERS.map((p) => {
            const name =
              locale === 'am' ? p.name_am || p.name_en :
              locale === 'om' ? p.name_om || p.name_en :
              p.name_en

            const desc =
              locale === 'am' ? p.description_am || p.description_en :
              locale === 'om' ? p.description_om || p.description_en :
              p.description_en

            return (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-[#1a4f8b] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      {p.partnerType.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {t.since} {p.partnerSince}
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-[#0d2340]">
                    {name}
                  </h2>

                  <p className="text-xs text-gray-600 mt-3 leading-relaxed">
                    {desc}
                  </p>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span>
                      <strong className="text-gray-700">{t.hq}:</strong> {p.country}
                    </span>
                    {p.website && (
                      <a
                        href={p.website}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-[#1a4f8b] hover:underline"
                      >
                        {t.visit}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
