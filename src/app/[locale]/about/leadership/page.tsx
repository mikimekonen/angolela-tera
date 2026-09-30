import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { SECTOR_OFFICES } from '@/data/mockData'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function LeadershipPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Executive Governance & Cabinet',
      title: 'Woreda Leadership & Administration Cabinet',
      subtitle: 'The executive committee and bureau leadership driving public service delivery, good governance, and economic growth in Angolela Tera.',
      chiefTitle: 'Chief Administrator of Angolela Tera Woreda',
      chiefName: 'Ato Tadesse Mengesha (Chief Administrator)',
      chiefBio:
        'Overseeing all executive bureaus, kebele administrative councils, and security coordination across the woreda. Leading strategic reforms in digital governance, agricultural investment, and public resource transparency.',
      cabinetTitle: 'Sector Cabinet Members & Bureau Directors',
      viewOffice: 'View Office Profile',
    },
    am: {
      tag: 'አስፈጻሚ አመራርና ካቢኔ',
      title: 'የወረዳው አመራርና አስፈጻሚ ካቢኔ',
      subtitle: 'በአንጎሌላ ተራ ወረዳ የህዝብ አገልግሎትን፣ መልካም አስተዳደርንና የልማት ስራዎችን የሚመሩ የካቢኔ አባላትና የቢሮ ኃላፊዎች።',
      chiefTitle: 'የአንጎሌላ ተራ ወረዳ ዋና አስተዳዳሪ',
      chiefName: 'አቶ ታደሰ መንገሻ (ዋና አስተዳዳሪ)',
      chiefBio:
        'ሁሉንም ሴክተር መስሪያ ቤቶች፣ የቀበሌ አስተዳደር ምክር ቤቶችንና የጸጥታ መዋቅሩን በበላይነት ይመራሉ። በዲጂታል አገልግሎት፣ በግብርና ልማትና በህዝብ ሀብት አጠቃቀም ግልጽነት ላይ ያተኮሩ ማሻሻያዎችን በመምራት ላይ ይገኛሉ።',
      cabinetTitle: 'የካቢኔ አባላትና የሴክተር መምሪያ ኃላፊዎች',
      viewOffice: 'የቢሮውን ሙሉ መረጃ ይመልከቱ',
    },
    om: {
      tag: 'Hoggansa fi Kaabinee',
      title: 'Hoggantoota Aanaa fi Kaabinee',
      subtitle: 'Hoggantoota tajaajila uummataa fi misooma aanaa gaggeessan.',
      chiefTitle: 'Bulchaa Ol\'aanaa Aanaa',
      chiefName: 'Obbo Taaddasaa Mangashaa (Bulchaa Ol\'aanaa)',
      chiefBio:
        'Waajjiroota hundumaa fi gandoolee 19 bulcha. Misooma qonnaa fi tajaajila iftoomina qabuuf hojjeta.',
      cabinetTitle: 'Miseensota Kaabinee fi Itti Gaafatamtoota',
      viewOffice: 'Odeeffannoo Waajjiraa Ilaali',
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

        {/* Chief Administrator Card */}
        <div className="bg-gradient-to-r from-[#0d2340] via-[#1a4f8b] to-[#0d2340] text-white rounded-2xl p-6 sm:p-10 mb-12 shadow-md">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Executive Leadership
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight mt-3">
              {content.chiefName}
            </h2>
            <p className="text-xs sm:text-sm text-[#FED100] font-semibold mt-1">
              {content.chiefTitle}
            </p>
            <p className="text-xs sm:text-sm text-gray-200 mt-4 leading-relaxed">
              {content.chiefBio}
            </p>
          </div>
        </div>

        {/* Cabinet Members Grid */}
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d2340] mb-6">
            {content.cabinetTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SECTOR_OFFICES.map((office) => {
              const name = office[`name_${locale as Locale}`] || office.name_en
              const head = office[`head_${locale as Locale}`] || office.head_en
              const headTitle = office[`headTitle_${locale as Locale}`] || office.headTitle_en

              return (
                <div
                  key={office.slug}
                  className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="h-10 w-10 rounded-full bg-blue-50 text-[#1a4f8b] flex items-center justify-center text-lg font-bold mb-3">
                      👤
                    </span>
                    <h3 className="text-base font-bold text-[#0d2340]">
                      {head}
                    </h3>
                    <p className="text-xs text-[#c8931a] font-semibold mt-0.5">
                      {headTitle}
                    </p>
                    <p className="text-xs text-gray-600 mt-2 font-medium">
                      {name}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-gray-400 font-mono">
                      {office.phone}
                    </span>
                    <Link
                      href={`/${locale}/offices/${office.slug}`}
                      className="font-bold text-[#1a4f8b] hover:text-[#c8931a] transition-colors"
                    >
                      {content.viewOffice} →
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
