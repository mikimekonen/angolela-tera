import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { OFFICIAL_LEADERS } from '@/data/leadershipData'
import { getLeadership } from '@/lib/dataStore'
import { LeadershipDirectory } from '@/components/leadership/LeadershipDirectory'
import { ShieldCheck, Landmark, Users, ArrowRight } from 'lucide-react'

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

  const dynamicLeaders = getLeadership()
  const leaders = (dynamicLeaders && dynamicLeaders.length > 0 ? dynamicLeaders : OFFICIAL_LEADERS).map((dl: any, idx: number) => {
    const match = OFFICIAL_LEADERS.find((ol) => ol.id === dl.id) || OFFICIAL_LEADERS[idx] || OFFICIAL_LEADERS[0]
    return {
      ...match,
      ...dl,
      portfolios_en: (Array.isArray(dl.portfolios_en) && dl.portfolios_en.length > 0) ? dl.portfolios_en : (match.portfolios_en || []),
      portfolios_am: (Array.isArray(dl.portfolios_am) && dl.portfolios_am.length > 0) ? dl.portfolios_am : (match.portfolios_am || []),
      office_en: dl.office_en || match.office_en,
      office_am: dl.office_am || match.office_am,
      category_en: dl.category_en || match.category_en,
      category_am: dl.category_am || match.category_am,
    }
  })

  const contentDict = {
    en: {
      tag: 'Executive Governance & Woreda Cabinet',
      title: 'Woreda Leadership & Sector Cabinet Directory',
      subtitle:
        'Official roster of the 20 sector bureau heads, chief administrators, and governing leadership steering public policies, regional peace, fiscal management, and economic development across Angolela Tera Woreda.',
      badgeCount: '20 Official Sector Cabinets',
      breadHome: 'Home',
      breadAbout: 'About Woreda',
      breadCurrent: 'Cabinet & Leadership',
      petitionTitle: 'Need to contact or petition the Woreda Executive Cabinet?',
      petitionSubtitle:
        'Submit formal appointment requests, sector petitions, or citizen inquiries directly to the Executive Administration Secretariat Desk in Chacha.',
      ictBtn: '💻 ICT & Digital Team',
      contactBtn: 'Citizen Grievance & Secretariat Desk →',
    },
    am: {
      tag: 'የአስፈጻሚ አመራርና የወረዳ ካቢኔ',
      title: 'የወረዳው አመራርና የሴክተር ካቢኔ አባላት ይፋዊ ማውጫ',
      subtitle:
        'በአንጎለላ ጠራ ወረዳ የህዝብ አገልግሎትን፣ ሰላምና ጸጥታን፣ የበጀት አስተዳደርን፣ መሰረተ ልማትንና ሁለንተናዊ የልማት ፕሮግራሞችን በበላይነት የሚመሩ የ20ዎቹም ሴክተር መስሪያ ቤቶች ዋና ኃላፊዎችና ከፍተኛ አመራሮች።',
      badgeCount: '20 ይፋዊ የካቢኔ ሴክተሮች',
      breadHome: 'መነሻ',
      breadAbout: 'ስለ ወረዳው',
      breadCurrent: 'አመራርና ካቢኔ',
      petitionTitle: 'ከወረዳው ከፍተኛ አመራርና ሴክተር ኃላፊዎች ጋር መገናኘት ይፈልጋሉ?',
      petitionSubtitle:
        'የቀጠሮ ጥያቄዎችን፣ አቤቱታዎችን ወይም ይፋዊ አስተዳደራዊ መልዕክቶችን በጫጫ በሚገኘው የወረዳው ሴክሬተሪያትና ቅሬታ ሰሚ መስኮት ማቅረብ ይችላሉ።',
      ictBtn: '💻 የአይሲቲ (ICT) ቡድን',
      contactBtn: 'የህዝብ ቅሬታና ግንኙነት መስኮት →',
    },
  }
  const content = (contentDict as any)[locale] || contentDict.en

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadHome}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/about`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadAbout}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-bold">{content.breadCurrent}</span>
        </nav>

        {/* Hero Banner with Executive Seal Accent */}
        <div className="relative bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 mb-10 shadow-xs overflow-hidden">
          {/* Subtle decorative background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-50 via-amber-50/40 to-transparent rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-[#1a4f8b]" />
                <span>{content.tag}</span>
              </span>
              <span className="text-xs font-bold text-[#c8931a] uppercase tracking-wider bg-amber-50 border border-amber-200 px-3 py-1 rounded-full flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#c8931a]" />
                <span>{content.badgeCount}</span>
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0d2340] tracking-tight leading-tight mt-2">
              {content.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Interactive Leadership Directory Component */}
        <LeadershipDirectory leaders={leaders} locale={locale as Locale} />

        {/* Leadership Contact & Citizen Petitions Desk */}
        <div className="mt-14 bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="space-y-1.5 text-center sm:text-left max-w-2xl">
            <h3 className="text-lg sm:text-xl font-black text-[#0d2340]">
              {content.petitionTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {content.petitionSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/about/ict`}
              className="bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 text-xs font-bold px-4 py-3 rounded-xl transition-all shadow-xs"
            >
              {content.ictBtn}
            </Link>
            <Link
              href={`/${locale}/contact`}
              className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-xs flex items-center gap-1.5"
            >
              <span>{content.contactBtn}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
