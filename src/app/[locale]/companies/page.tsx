import React from 'react'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MOCK_BUSINESSES } from '@/data/entityData'

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
      badge: 'Economic Registry & Investment Directory',
      title: 'Private Companies & Commercial Enterprises',
      subtitle:
        'Official registry of private commercial ventures, agro-processing factories, seed suppliers, and construction enterprises operating in Angolela Tera Woreda.',
      totalCount: 'Registered Enterprises',
      workforce: 'Workforce',
      contact: 'Contact Desk',
      address: 'Location',
      established: 'Established',
      investorCardTitle: 'Looking to invest in Angolela Tera?',
      investorCardDesc:
        'The Woreda Investment Desk offers accelerated land allocation along the A2 highway corridor, 70-year lease security, and coordinated utility connections.',
      investorBtn: 'Explore Investment Opportunities →',
    },
    am: {
      badge: 'የንግድና ኢንቨስትመንት ማውጫ',
      title: 'የግል ድርጅቶችና ፋብሪካዎች ማውጫ',
      subtitle:
        'በአንጎሌላ ተራ ወረዳ ውስጥ በህጋዊ መንገድ የተመዘገቡና በመስራት ላይ የሚገኙ የአግሮ-ኢንዱስትሪ፣ የሰብል ማቀነባበሪያ፣ ምርጥ ዘር አቅራቢና የኮንስትራክሽን ድርጅቶች ዝርዝር።',
      totalCount: 'የተመዘገቡ ድርጅቶች',
      workforce: 'የሰው ኃይል',
      contact: 'አድራሻና ስልክ',
      address: 'ቦታ',
      established: 'የተመሰረተበት',
      investorCardTitle: 'በአንጎሌላ ተራ ኢንቨስት ማድረግ ይፈልጋሉ?',
      investorCardDesc:
        'የወረዳው ኢንቨስትመንት ዴስክ በጫቻ አግሮ-ኢንዱስትሪ ኮሪደር ፈጣን የመሬት አቅርቦትና የ70 ዓመት የሊዝ ዋስትና ያቀርባል።',
      investorBtn: 'የኢንቨስትመንት አማራጮችን ይመልከቱ →',
    },
    om: {
      badge: 'Galmee Daldalaa fi Invastimantii',
      title: 'Dhaabbilee Dhuunfaa fi Warshaalee',
      subtitle:
        'Galmee seera qabeessaa dhaabbilee dhuunfaa fi warshaalee qonnaa Aanaa Angolallaa Xaraa keessatti hojjetan.',
      totalCount: 'Dhaabbilee Galmaa\'an',
      workforce: 'Hojjettoota',
      contact: 'Quunnamtii',
      address: 'Bakka',
      established: 'Bara Hundeeffama',
      investorCardTitle: 'Aanaa Angolallaa Xaraatti invast gochuu barbaaddu?',
      investorCardDesc:
        'Waajjirri invastimantii aanaa lafa daandii qarqaraa fi wabii liizii waggaa 70 dhiyeessa.',
      investorBtn: 'Carraawwan Invastimantii Ilaalaa →',
    },
  }[locale as Locale]

  return (
    <div className="bg-gray-50/50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] to-[#1a4f8b] rounded-3xl p-8 sm:p-12 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-4 relative z-10">
            <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full inline-block">
              🏢 {t.badge}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight">
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-blue-100 leading-relaxed">
              {t.subtitle}
            </p>
            <div className="pt-2">
              <span className="text-xs font-bold bg-[#c8931a] text-white px-3.5 py-1.5 rounded-full inline-block">
                {MOCK_BUSINESSES.length} {t.totalCount}
              </span>
            </div>
          </div>
        </div>

        {/* Companies List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_BUSINESSES.map((b) => {
            const name =
              locale === 'am' ? b.name_am || b.name_en :
              locale === 'om' ? b.name_om || b.name_en :
              b.name_en

            const desc =
              locale === 'am' ? b.description_am || b.description_en :
              locale === 'om' ? b.description_om || b.description_en :
              b.description_en

            return (
              <div
                key={b.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-[#1a4f8b] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                      {b.sector.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {b.employeeCount} {t.workforce}
                    </span>
                  </div>

                  <h2 className="text-lg font-extrabold text-[#0d2340]">
                    {name}
                  </h2>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed">
                    {desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-3 text-xs text-gray-600">
                    <div>
                      <span className="text-gray-400 block font-medium">{t.address}:</span>
                      <span className="font-semibold text-gray-800">{b.address}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">{t.established}:</span>
                      <span className="font-semibold text-gray-800">{b.established || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block font-medium">{t.contact}:</span>
                      <span className="font-semibold text-gray-800">{b.phone || 'N/A'}</span>
                    </div>
                    {b.email && (
                      <div>
                        <span className="text-gray-400 block font-medium">Email:</span>
                        <span className="font-semibold text-gray-800">{b.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                {b.website && (
                  <div className="mt-5 pt-3 border-t border-gray-100">
                    <a
                      href={b.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-[#1a4f8b] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Visit Corporate Website</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Investment Callout */}
        <div className="bg-white border-2 border-[#c8931a]/40 rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-[#0d2340]">
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
