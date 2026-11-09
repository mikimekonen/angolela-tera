import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RuralRoadsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const isAm = locale === 'am'

  const contentDict = {
    en: {
      breadcrumbHome: 'Home',
      breadcrumbDev: 'Development',
      breadcrumbCurrent: 'Rural Road Access',
      badge: 'URRAP • Universal Rural Road Access Program',
      title: 'Rural Road Connectivity & Transport Infrastructure',
      subtitle:
        'Building an interconnected network of all-weather roads, culverts, and bridges to link every kebele in Angolela Tera with commercial markets, hospitals, and schools.',
      metrics: [
        { value: '210+ km', label: 'All-Weather Gravel Road Network' },
        { value: '19 Kebeles', label: '100% Kebele Connectivity Target' },
        { value: '28 Bridges', label: 'Reinforced Concrete & Masonry Crossings' },
        { value: '35 mins', label: 'Average Travel Time to Chacha Hub' },
        { value: '45,000+ MT', label: 'Annual Grain & Produce Transported' },
        { value: '100% Paved', label: 'Direct A2 Trunk Highway Link' },
      ],
      corridorsTitle: 'Key Rural Feeder Road Corridors',
      corridorsDesc:
        'Strategic road alignments connecting agricultural cluster areas, dairy farms, and schools to the main administrative center at Chacha.',
      corridors: [
        {
          name: 'Chacha – Kotu – Wubilt Feeder Corridor',
          dist: '24.5 km',
          status: 'Operational / Regular Maintenance',
          type: 'Standard Gravel Road (URRAP Standard)',
          impact: 'Connects prime wheat cluster kebeles and milk collection centers to the Chacha highway entrance.',
        },
        {
          name: 'Chacha – Cheki – Gey High-Altitude Route',
          dist: '18.2 km',
          status: 'Upgraded All-Weather Surface',
          type: 'Engineered Gravel with Drainage Ditches',
          impact: 'Facilitates fast transport of highland barley, sheep breeding farms, and emergency health referrals.',
        },
        {
          name: 'Angolela Historic Ring Route',
          dist: '15.0 km',
          status: 'Completed',
          type: 'All-Weather Feeder Road',
          impact: 'Links ancient historic settlement ruins of King Sahle Selassie with contemporary civic centers.',
        },
        {
          name: 'Ajima Dam Catchment Access Road',
          dist: '12.8 km',
          status: 'Under Active Expansion',
          type: 'Heavy-Duty Access Track & Gravel',
          impact: 'Provides construction access for irrigation pipelines and future farmer produce evacuation.',
        },
      ],
      communityTitle: 'Community Participation & Maintenance Desks',
      communityDesc:
        'Road maintenance committees in each kebele collaborate with the Woreda Road Office to conduct seasonal grading, culvert clearing, and flood protection.',
      officeDesk: 'Woreda Road, Transport & Infrastructure Desk',
      location: 'Administrative Block B, Chacha Town',
      phone: '+251 (0) 58 661 0206',
      email: 'transport@angolela-tera.gov.et',
      ctaReportRoad: 'Report Road Damage or Culvert Blockage',
      ctaOverview: 'View All Capital Projects',
    },
    am: {
      breadcrumbHome: 'ዋና ገጽ',
      breadcrumbDev: 'ልማት',
      breadcrumbCurrent: 'ገጠር መንገዶች',
      badge: 'የገጠር ተደራሽነት ፕሮግራም (URRAP)',
      title: 'የገጠር መንገዶች ተደራሽነትና የትራንስፖርት መሰረተ ልማት',
      subtitle:
        'ሁሉንም የአንጎለላ ጠራ ወረዳ የገጠር ቀበሌዎች ከገበያ ማዕከላት፣ ከሆስፒታሎችና ከትምህርት ቤቶች ጋር የሚያስተሳስሩ የጠጠር መንገዶችን፣ ድልድዮችንና የቦኖ መስመሮችን መገንባት፡',
      metrics: [
        { value: '210+ ኪ.ሜ', label: 'የተገነባ የጠጠር መንገድ መረብ' },
        { value: '19 ቀበሌዎች', label: 'የቀበሌዎች ቀጥታ የመንገድ ትስስር' },
        { value: '28 ድልድዮች', label: 'የኮንክሪትና የድንጋይ ድልድዮች' },
        { value: '35 ደቂቃ', label: 'ወደ ጫቻ ከተማ አማካይ የጉዞ ጊዜ' },
        { value: '45,000+ ቶን', label: 'በዓመት የሚጓጓዝ የግብርና ምርት' },
        { value: '100% አስፋልት', label: 'ከአዲስ አበባ-ደሴ ዋና መንገድ ጋር ትስስር' },
      ],
      corridorsTitle: 'ዋና ዋና የገጠር መንገድ ኮሪደሮች',
      corridorsDesc:
        'የግብርና ምርታማ አካባቢዎችን፣ የወተት ማሰባሰቢያ ጣቢያዎችንና ትምህርት ቤቶችን ከወረዳው መቀመጫ ከጫቻ ጋር የሚያገናኙ መንገዶች።',
      corridors: [
        {
          name: 'የጫቻ – ኮቱ – ውብእልት የገጠር ኮሪደር',
          dist: '24.5 ኪ.ሜ',
          status: 'አገልግሎት በመስጠት ላይ ያለ / መደበኛ ጥገና',
          type: 'ደረጃውን የጠበቀ የጠጠር መንገድ (URRAP)',
          impact: 'የስንዴ ክላስተር ቀበሌዎችንና የወተት ማሰባሰቢያዎችን ከዋናው አውራ ጎዳና ጋር ያገናኛል።',
        },
        {
          name: 'የጫቻ – ቸኪ – ገይ ደጋማ የመንገድ መስመር',
          dist: '18.2 ኪ.ሜ',
          status: 'የተሻሻለ አስተማማኝ የጠጠር መንገድ',
          type: 'የውሃ መፋሰሻ ያለው ደረጃውን የጠበቀ መንገድ',
          impact: 'የደጋ ገብስና የእንስሳት ተዋጽኦን በፍጥነት ወደ ገበያ ለማቅረብና ለህክምና ሪፈራል ይረዳል።',
        },
        {
          name: 'የአንጎለላ ታሪካዊ ቀለበት መንገድ',
          dist: '15.0 ኪ.ሜ',
          status: 'የተጠናቀቀ',
          type: 'አስተማማኝ የገጠር ጠጠር መንገድ',
          impact: 'የንጉሥ ሣህለ ሥላሴን ታሪካዊ መዲና ከአሁኑ አስተዳደር ማዕከላት ጋር ያስተሳስራል።',
        },
        {
          name: 'የአጂማ ግድብ መዳረሻ መንገድ',
          dist: '12.8 ኪ.ሜ',
          status: 'በማስፋፋት ሂደት ላይ ያለ',
          type: 'ከባድ ማሽነሪ የሚያስተናግድ ጠጠር መንገድ',
          impact: 'ለግድቡ ግንባታና ወደፊት የመስኖ ምርቶችን ለማጓጓዝ ያገለግላል።',
        },
      ],
      communityTitle: 'የማህበረሰብ ተሳትፎና የመንገድ ጥገና',
      communityDesc:
        'በየቀበሌው የተቋቋሙ የመንገድ ኮሚቴዎች ከወረዳው መንገድ ጽ/ቤት ጋር በመተባበር የክረምት ጥገናና የቦይ ማጽዳት ስራዎችን ያከናውናሉ።',
      officeDesk: 'የወረዳው መንገድና ትራንስፖርት ጽህፈት ቤት',
      location: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ለ፣ ጫቻ ከተማ',
      phone: '+251 (0) 58 661 0206',
      email: 'transport@angolela-tera.gov.et',
      ctaReportRoad: 'የመንገድ ብልሽት ወይም የቦይ መደፈንን ያሳውቁ',
      ctaOverview: 'ሁሉንም የልማት ፕሮጀክቶች ይመልከቱ',
    },
  }
  const content = (contentDict as any)[locale] || contentDict.en

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbHome}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/development`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbDev}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-semibold">{content.breadcrumbCurrent}</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] via-[#1a4f8b] to-[#0d2340] text-white rounded-3xl p-6 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full mb-4">
              <span>🛣️</span>
              <span>{content.badge}</span>
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {content.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 mt-4 leading-relaxed font-normal">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-12">
          {content.metrics.map((item: any, idx: number) => (
            <div
              key={idx}
              className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="text-lg sm:text-xl font-black text-[#1a4f8b] tracking-tight">
                {item.value}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-600 mt-2 font-medium leading-snug">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Key Corridors List */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 mb-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
              🚜 Strategic Transport Arteries • ዋና ዋና የገጠር መንገዶች
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#0d2340] tracking-tight">
              {content.corridorsTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              {content.corridorsDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {content.corridors.map((c: any, idx: number) => (
              <div
                key={idx}
                className="bg-gray-50/70 border border-gray-200 rounded-2xl p-5 hover:bg-blue-50/20 hover:border-[#1a4f8b]/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-[#0d2340]">
                      {c.name}
                    </span>
                    <span className="text-xs font-extrabold text-[#c8931a] bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 shrink-0">
                      {c.dist}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      ✓ {c.status}
                    </span>
                    <span className="text-[10px] font-medium text-gray-500 bg-gray-200/70 px-2 py-0.5 rounded-md">
                      {c.type}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {c.impact}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Office Contact Desk */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider">
                {content.officeDesk}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0d2340] mt-1">
                {content.communityTitle}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                📍 {content.location} • 📞 {content.phone} • ✉️ {content.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md"
              >
                <span>⚠️ {content.ctaReportRoad}</span>
              </Link>

              <Link
                href={`/${locale}/development`}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-3 rounded-xl transition-all"
              >
                <span>📋 {content.ctaOverview}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
