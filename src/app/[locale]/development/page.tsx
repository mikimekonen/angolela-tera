import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

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

  const content = {
    en: {
      tag: 'Public Works & Capital Investment',
      title: 'Infrastructure & Development Projects',
      subtitle: 'Tracking ongoing public investments across clean drinking water schemes, rural connectivity roads, school expansions, and rural electrification in Angolela Tera.',
      statusOngoing: 'Ongoing / In Progress',
      statusCompleted: 'Commissioned / Operational',
      projects: [
        {
          title: 'Chacha Multi-Kebele Deep Groundwater Supply Scheme',
          sector: 'Potable Water & Sanitation',
          budget: '48.5 Million ETB',
          status: 'Ongoing (82% Complete)',
          desc: 'Drilling 4 high-capacity deep boreholes, construction of a 500m³ reinforced concrete reservoir, and 18 km distribution pipeline supplying clean drinking water to over 34,000 residents across Chacha town and 4 surrounding rural kebeles.',
        },
        {
          title: 'Universal Rural Road Access Program (URRAP) – Phase IV',
          sector: 'Transportation & Road Access',
          budget: '32.0 Million ETB',
          status: 'Ongoing (65% Complete)',
          desc: 'Construction and gravel-surfacing of 42 km of all-weather feeder roads linking agrarian villages in the eastern highland kebeles directly to the main asphalt highway.',
        },
        {
          title: 'Highland River Diversion & Micro-Irrigation Weir',
          sector: 'Irrigation & Food Security',
          budget: '18.2 Million ETB',
          status: 'Completed & Operational',
          desc: 'Concrete diversion weir on the Chacha River tributary commanding 240 hectares of dry-season irrigated farming for high-value seed multiplication and horticultural crops.',
        },
        {
          title: 'Angolela Secondary School Digital Science & Computer Lab',
          sector: 'Education & ICT',
          budget: '9.4 Million ETB',
          status: 'Completed & Operational',
          desc: 'Equipping modern computer laboratories with 60 thin-client workstations, offline digital educational servers, and solar power backup systems.',
        },
      ],
      ctaOffices: 'Connect with Infrastructure Bureau',
      ctaContact: 'Submit Infrastructure Feedback',
    },
    am: {
      tag: 'የመንግሥት ስራዎችና የመሰረተ ልማት ኢንቨስትመንት',
      title: 'የመሰረተ ልማትና የልማት ፕሮጀክቶች',
      subtitle: 'በአንጎሌላ ተራ ወረዳ በንጹህ መጠጥ ውሃ፣ በገጠር መንገዶች፣ በትምህርት ቤቶችና በመብራት ሀይል መስፋፋት ላይ የሚሰሩ የልማት ፕሮጀክቶች ክትትል።',
      statusOngoing: 'በሂደት ላይ ያለ',
      statusCompleted: 'ተጠናቆ አገልግሎት የጀመረ',
      projects: [
        {
          title: 'የጫቻና አካባቢዋ የጥልቅ ውሃ ጉድጓድ ፕሮጀክት',
          sector: 'ንጹህ መጠጥ ውሃ',
          budget: '48.5 ሚሊዮን ብር',
          status: 'በሂደት ላይ (82% የተጠናቀቀ)',
          desc: '4 ጥልቅ የውሃ ጉድጓዶችን መቆፈር፣ 500 ኪዩቢክ ሜትር የውሃ ማጠራቀሚያ ገንዳ መገንባትና የ18 ኪ.ሜ የቧንቧ መስመር በመዘርጋት ከ34 ሺህ በላይ ለሚሆኑ የጫቻና የአካባቢው ቀበሌዎች ነዋሪዎች ንጹህ ውሃ ማዳረስ።',
        },
        {
          title: 'የገጠር ተደራሽነት መንገድ ግንባታ (URRAP) - ምዕራፍ 4',
          sector: 'መንገድና ትራንስፖርት',
          budget: '32.0 ሚሊዮን ብር',
          status: 'በሂደት ላይ (65% የተጠናቀቀ)',
          desc: 'የምስራቃዊ ደጋማ ቀበሌዎችን ከአውራ ጎዳና ጋር የሚያገናኝ የ42 ኪሎ ሜትር የጠጠር መንገድ ግንባታ።',
        },
        {
          title: 'የጫቻ ወንዝ አነስተኛ መስኖና ተፋሰስ ልማት',
          sector: 'መስኖና የምግብ ዋስትና',
          budget: '18.2 ሚሊዮን ብር',
          status: 'ተጠናቆ አገልግሎት የጀመረ',
          desc: 'በጫቻ ወንዝ ገባር ላይ የተሰራ የኮንክሪት መስኖ ግድብ ሲሆን 240 ሄክታር መሬትን በደረቅ ወቅት በመስኖ በማልማት ለአርሶ አደሮች ገቢ ማስገኛ ሆነ።',
        },
        {
          title: 'የአንጎሌላ አጠቃላይ 2ኛ ደረጃ ት/ቤት ዲጂታል ሳይንስና ኮምፒውተር ላብ',
          sector: 'ትምህርትና አይሲቲ',
          budget: '9.4 ሚሊዮን ብር',
          status: 'ተጠናቆ አገልግሎት የጀመረ',
          desc: '60 ዘመናዊ ኮምፒውተሮችና የሶላር ሀይል ማመንጫ የተገጠመለት የሳይንስና ቴክኖሎጂ ላቦራቶሪ።',
        },
      ],
    },
    om: {
      tag: 'Hojiiwwan Misoomaa',
      title: 'Pirojektoota Misoomaa fi Bu\'uuraalee',
      subtitle: 'Pirojektoota bishaan qulqulluu, daandii fi manneen barumsaa aanaa keenyaa.',
      statusOngoing: 'Hojiirra kan jiru',
      statusCompleted: 'Kan xumurame',
      projects: [
        {
          title: 'Misooma Bishaan Qulqulluu Magaalaa Caaccetti',
          sector: 'Bishaan Qulqulluu',
          budget: 'Miliyoona 48.5 ETB',
          status: 'Hojiirra kan jiru (82%)',
          desc: 'Boolla bishaanii gadi fagoowwan 4 fi sarara bishaanii km 18 diriirsuun uummata 34,000 fayyadamaa taasisuu.',
        },
        {
          title: 'Ijaarsa Daandii Baadiyyaa (URRAP) – Marsaa 4ffaa',
          sector: 'Daandii fi Geejjiba',
          budget: 'Miliyoona 32.0 ETB',
          status: 'Hojiirra kan jiru (65%)',
          desc: 'Daandii baadiyyaa km 42 ijaaruu fi cirracha afuun daandii guddaatti hidhuu.',
        },
        {
          title: 'Misooma Jallisii Laga Caaccetti',
          sector: 'Jallisii fi Qonna',
          budget: 'Miliyoona 18.2 ETB',
          status: 'Kan Xumurame',
          desc: 'Lafa hektaara 240 jallisiidhaan oomishuuf kan oolu.',
        },
        {
          title: 'Mana Yaalii Kompiitaraa Mana Barumsaa Angolallaa',
          sector: 'Barnootaa fi Teeknooloojii',
          budget: 'Miliyoona 9.4 ETB',
          status: 'Kan Xumurame',
          desc: 'Kompiitaroota 60 fi humna aduutiin kan hojjetu.',
        },
      ],
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

        {/* Projects List */}
        <div className="space-y-6 mb-12">
          {content.projects.map((proj, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                    {proj.sector}
                  </span>
                  <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    {proj.status}
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-[#0d2340] leading-snug">
                  {proj.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {proj.desc}
                </p>
              </div>

              <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 shrink-0 text-right md:min-w-[180px]">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
                  Project Budget
                </span>
                <span className="text-base sm:text-lg font-extrabold text-[#1a4f8b] block mt-0.5">
                  {proj.budget}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Action Link Footer */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 max-w-xl">
            Want to learn more about procurement tenders for woreda capital projects or inspect project progress in your kebele?
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/offices/infrastructure`}
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
