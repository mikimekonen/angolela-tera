import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { OFFICIAL_LEADERS } from '@/data/leadershipData'
import { ExternalLink, ShieldCheck, Award } from 'lucide-react'

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
      tag: 'Executive Governance & Party Secretariat',
      title: 'Woreda Leadership & Administration Cabinet',
      subtitle:
        'The highest executive committee and ruling party leadership directing public policies, peace and security, budget management, and regional development programs across Angolela Tera Woreda.',
      topSectionTitle: 'Executive Leadership & Secretariat Roster',
      viewOffice: 'View Office Profile',
      verifiedSource: 'Verified Official Post',
    },
    am: {
      tag: 'አስፈጻሚ አመራርና የፓርቲ ጽህፈት ቤት',
      title: 'የወረዳው አመራርና አስፈጻሚ ካቢኔ',
      subtitle:
        'በአንጎሌላ ተራ ወረዳ የህዝብ አገልግሎትን፣ ሰላምና ጸጥታን፣ የበጀት አስተዳደርንና የልማት ፕሮግራሞችን በበላይነት የሚመሩ የወረዳው ከፍተኛ የመንግስትና የፓርቲ አመራሮች።',
      topSectionTitle: 'የወረዳው ከፍተኛ አመራሮች ዝርዝር',
      viewOffice: 'የቢሮውን ሙሉ መረጃ ይመልከቱ',
      verifiedSource: 'የተረጋገጠ ይፋዊ መረጃ',
    },
    om: {
      tag: 'Hoggansa fi Kaabinee',
      title: 'Hoggantoota Aanaa fi Kaabinee',
      subtitle:
        'Hoggantoota tajaajila uummataa, nageenya, bulchiinsa baajataa fi misooma aanaa gaggeessan.',
      topSectionTitle: 'Hoggantoota Ol\'aanaa Aanaa',
      viewOffice: 'Odeeffannoo Waajjiraa Ilaali',
      verifiedSource: 'Odeeffannoo Mirkanaa\'aa',
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

        {/* Section 1: The 4 Top Executive Leaders */}
        <div className="mb-14">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d2340]">
              {content.topSectionTitle}
            </h2>
            <span className="text-xs font-semibold text-[#1a4f8b] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              4 Official Executive Leaders
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OFFICIAL_LEADERS.map((leader, idx) => {
              const name =
                locale === 'am' ? leader.name_am : locale === 'om' ? leader.name_om : leader.name_en
              const secondaryName = locale === 'am' ? leader.name_en : leader.name_am
              const title =
                locale === 'am' ? leader.title_am : locale === 'om' ? leader.title_om : leader.title_en
              const category =
                locale === 'am' ? leader.category_am : locale === 'om' ? leader.category_om : leader.category_en
              const bio =
                locale === 'am' ? leader.bio_am : locale === 'om' ? leader.bio_om : leader.bio_en
              const office =
                locale === 'am' ? leader.office_am : locale === 'om' ? leader.office_om : leader.office_en
              const portfolios =
                locale === 'am' ? leader.portfolios_am : locale === 'om' ? leader.portfolios_om : leader.portfolios_en

              return (
                <div
                  key={leader.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#1a4f8b]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Photo + Name + Role */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#c8931a]/60 shadow-md shrink-0 bg-[#0d2340]">
                        <Image
                          src={leader.photo}
                          alt={leader.name_en}
                          fill
                          sizes="80px"
                          className="object-cover object-top"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a4f8b] border border-blue-100">
                            #{idx + 1}
                          </span>
                          <span className="text-[11px] font-semibold text-gray-500 truncate">
                            {category}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-[#0d2340] leading-tight">
                          {name}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {secondaryName}
                        </p>
                        <p className="text-xs font-bold text-[#c8931a] mt-1">
                          {title}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 font-medium mb-3">
                      {office}
                    </p>

                    {/* Bio */}
                    <p className="text-xs sm:text-sm text-gray-700 leading-relaxed italic bg-gray-50 border-l-2 border-[#c8931a] p-3 rounded-r-lg mb-4">
                      &ldquo;{bio}&rdquo;
                    </p>

                    {/* Responsibilities */}
                    <div className="space-y-1.5 mb-4">
                      {portfolios.map((p, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2 text-xs text-gray-600">
                          <span className="text-emerald-600 text-sm">✓</span>
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Official Verification & Authority badge */}
                  {leader.sourceUrl && (
                    <div className="pt-3.5 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-gray-500">
                        Angolela Tera Woreda
                      </span>
                      <a
                        href={leader.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#1a4f8b] hover:text-[#c8931a] hover:underline"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>{content.verifiedSource}</span>
                      </a>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Leadership Contact & Citizen Petitions Desk */}
        <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base sm:text-lg font-bold text-[#0d2340]">
              {locale === 'am'
                ? 'ከወረዳው ከፍተኛ አመራር ጋር መገናኘት ይፈልጋሉ?'
                : locale === 'om'
                ? 'Hoggantoota aanaa waliin wal-qunnamuu barbaadduu?'
                : 'Need to contact or petition the Woreda Executive Leadership?'}
            </h3>
            <p className="text-xs text-gray-500">
              {locale === 'am'
                ? 'የቀጠሮ ጥያቄዎችን፣ አቤቱታዎችን ወይም ይፋዊ መልዕክቶችን በወረዳው ቅሬታና ህዝብ ግንኙነት መስኮት ማቅረብ ይችላሉ።'
                : locale === 'om'
                ? 'Iyyannoo ykn beellama hoggansaatiif kutaa komii fi qunnamtii uummataa fayyadamaa.'
                : 'Submit formal petitions, appointment requests, or citizen grievances directly to the Executive Secretariat Desk.'}
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-xs shrink-0"
          >
            {locale === 'am'
              ? 'የህዝብ ቅሬታና ግንኙነት መስኮት →'
              : locale === 'om'
              ? 'Kutaa Qunnamtii Uummataa →'
              : 'Citizen Grievance & Secretariat Desk →'}
          </Link>
        </div>
      </div>
    </div>
  )
}
