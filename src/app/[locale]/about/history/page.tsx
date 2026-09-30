import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Royal Heritage & Shewan History',
      title: 'History & Founding of Angolela Tera',
      subtitle: 'From a royal Shewan administrative capital to a pivotal center of 19th-century diplomacy and agrarian statecraft.',
      timelineTitle: 'Key Historical Epochs',
      timeline: [
        {
          era: 'Early 19th Century (1813 – 1847)',
          heading: 'Reign of King Sahle Selassie & Royal Capital',
          text: 'King Sahle Selassie established Angolela as a fortified royal encampment and summer court. Its strategic highland location offered exceptional military defense, fertile food provisioning, and control over trade routes traversing northern Shewa.',
        },
        {
          era: '1841 – 1843',
          heading: 'British Diplomatic Mission & Treaty of Commerce',
          text: 'The famous British mission led by Major William Cornwallis Harris was formally received at the palace in Angolela. An historic 16-article treaty of friendship and reciprocal trade was negotiated and signed at Angolela in November 1841.',
        },
        {
          era: 'Late 19th Century',
          heading: 'Transition to Ankober, Entoto & Modern Statecraft',
          text: 'While the administrative capital gradually shifted southwards toward Entoto and ultimately the founding of Addis Ababa by Emperor Menelik II, Angolela maintained its status as a vital granary and historical crown estate.',
        },
        {
          era: 'Modern Era (Post-1991)',
          heading: 'Formalization of Angolela Tera Woreda',
          text: 'Following modern administrative demarcations, Angolela and Tera were unified into a single woreda with Chacha designated as the administrative seat, establishing modernized sector bureaus and local democratic council assemblies.',
        },
      ],
      backToAbout: 'Back to Woreda Overview',
    },
    am: {
      tag: 'ንጉሣዊ ቅርስና የሸዋ ታሪክ',
      title: 'የአንጎሌላ ተራ ታሪክና አመሰራረት',
      subtitle: 'ከ19ኛው ክፍለ ዘመን የሸዋ ንጉሣዊ መቀመጫ እስከ ታሪካዊ የዲፕሎማሲ ስምምነቶችና የዘመናችን አስተዳደር።',
      timelineTitle: 'ዋና ዋና የታሪክ ምዕራፎች',
      timeline: [
        {
          era: '19ኛው ክፍለ ዘመን መጀመሪያ (1805 – 1839 ዓ.ም)',
          heading: 'የንጉሥ ሳህለ ሥላሴ ዘመነ መንግሥትና የክረምት ቤተ-መንግሥት',
          text: 'ንጉሥ ሳህለ ሥላሴ አንጎሌላን ዋነኛ ምሽጋቸውና የክረምት መቀመጫቸው አድርገው መርጠዋታል። ደጋማው አየርና ለም መሬቱ ለሰራዊት ስንቅና ለወታደራዊ ስልት እጅግ ምቹ ነበር።',
        },
        {
          era: '1833 – 1835 ዓ.ም (1841–1843 እ.ኤ.አ)',
          heading: 'የእንግሊዝ ዲፕሎማቲክ ልዑክና ታሪካዊው የንግድ ስምምነት',
          text: 'በሜጀር ዊሊያም ሃሪስ የተመራው የእንግሊዝ መንግሥት ልዑክ በአንጎሌላ ቤተ-መንግሥት ደማቅ አቀባበል ተደርጎለት ለሁለቱ አገራት ወዳጅነት መሰረት የሆነው የንግድና የወዳጅነት ስምምነት ተፈረመ።',
        },
        {
          era: '19ኛው ክፍለ ዘመን ማብቂያ',
          heading: 'የመቀመጫው ወደ አንኮበር፣ እንጦጦና አዲስ አበባ መዛወር',
          text: 'መቀመጫው ወደ አንኮበር፣ በኋላም በዳግማዊ አጼ ምኒልክ ዘመን ወደ እንጦጦና አዲስ አበባ ቢያመራም አንጎሌላ የሸዋ ዋነኛ የእህል ጎተራና የክብር ይዞታ ሆና ቀጥላለች።',
        },
        {
          era: 'የዘመናችን ምዕራፍ',
          heading: 'የአንጎሌላ ተራ ወረዳ መመስረት',
          text: 'አንጎሌላና ተራ በአንድ ወረዳ ተዋቅረው ጫቻ ከተማ ዋና መቀመጫ በመሆን በዘመናዊ መልክ የህዝብ አገልግሎት መስጠት ጀምረዋል።',
        },
      ],
      backToAbout: 'ወደ ወረዳው አጠቃላይ መረጃ ተመለስ',
    },
    om: {
      tag: 'Seenaa Shawaa',
      title: 'Seenaa Hundeeffama Aanaa Angolallaa Xaraa',
      subtitle: 'Seenaa mootota Shawaa irraa hanga bulchiinsa ammayyaatti.',
      timelineTitle: 'Bara Seenaa Ijoo',
      timeline: [
        {
          era: 'Jaarraa 19ffaa Jalqaba',
          heading: 'Bara Mootii Saahila Sillaasee',
          text: 'Mootichi Angolallaa teessoo isaa taasisee ture. Bakka qonnaa bal\'aa fi loltummaaf mijatuudha.',
        },
        {
          era: 'Bara 1841 – 1843',
          heading: 'Ergamoota Biyya Ingilizii Waliin Waliigaltee',
          text: 'Waliigalteen daldalaa fi hariiroo alaa Angolallaa keessatti mallatteeffame.',
        },
        {
          era: 'Bara Ammayyaa',
          heading: 'Hundeeffama Aanaa Angolallaa Xaraa',
          text: 'Aanaan kun magaalaa Caaccetti teessoo isaa taasifatee tajaajila uummataa kennaa jira.',
        },
      ],
      backToAbout: 'Gara Fuula Duraatti Deebi\'i',
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

        {/* Timeline Narrative */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs mb-8">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d2340] border-b border-gray-100 pb-4 mb-8">
            {content.timelineTitle}
          </h2>

          <div className="space-y-8 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-blue-100">
            {content.timeline.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-6">
                <span className="h-7 w-7 rounded-full bg-[#1a4f8b] text-[#FED100] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 z-10 shadow-xs">
                  {idx + 1}
                </span>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 flex-1">
                  <span className="text-xs font-bold text-[#c8931a] uppercase tracking-wider block">
                    {item.era}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-[#0d2340] mt-1">
                    {item.heading}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-700 mt-2 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-2 text-xs font-bold text-[#1a4f8b] hover:text-[#133a6b]"
          >
            <span>← {content.backToAbout}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
