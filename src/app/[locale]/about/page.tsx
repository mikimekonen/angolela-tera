import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Historical & Geographic Heritage',
      title: 'About Angolela Tera Woreda',
      subtitle: 'The historic highland cradle of Shewa, an agricultural powerhouse, and the strategic northern gateway of the Amhara Region.',
      historyTitle: 'Historical Foundations & Royal Legacy',
      historyP1:
        'Angolela holds an esteemed position in Ethiopian history. During the early 19th century, King Sahle Selassie of Shewa established Angolela as one of his royal capitals and military headquarters. It was here that historic diplomatic encounters took place, including the reception of major British and French diplomatic missions led by Major William Cornwallis Harris and Rochet d’Héricourt.',
      historyP2:
        'Before the royal court relocated to Ankober and subsequently Entoto and Addis Ababa, Angolela was a flourishing administrative hub where crucial regional treaties were negotiated and signed. Today, the woreda preserves this illustrious heritage while transforming into a modern agrarian and agro-processing center.',
      geoTitle: 'Geography, Topography & Highland Agro-Ecology',
      geoP1:
        'Situated in the North Shewa Zone along the A2 international trunk highway, Angolela Tera lies approximately 110 kilometers north of Addis Ababa and just 20 kilometers south of Debre Birhan city. Its elevation spans between 2,600 and 3,050 meters above sea level.',
      geoP2:
        'The climate is classified as Dega (cool temperate highland) characterized by reliable bimodal rainfall (Belg and Meher seasons). The fertile vertisols (black soils) and abundant river basins, primarily the Chacha and Beressa river systems, create prime conditions for cereal production, especially bread wheat, malt barley, faba beans, and highland horticulture.',
      adminTitle: 'Demographics & Kebele Governance',
      adminP1:
        'The woreda is organized into 19 rural kebeles and 2 urban kebeles encompassing the fast-growing administrative seat of Chacha town. With a population exceeding 142,500 residents, Angolela Tera boasts a vibrant, hardworking community deeply rooted in traditional mutual-aid institutions (Debo, Iddir, Senbete) that collaborate actively with modern local administration.',
      ctaOffices: 'Explore Woreda Sector Bureaus',
      ctaServices: 'Browse Citizen Services',
      ctaLeadership: 'View Cabinet Leadership',
    },
    am: {
      tag: 'ታሪካዊና መልክአ ምድራዊ ቅርስ',
      title: 'ስለ አንጎሌላ ተራ ወረዳ',
      subtitle: 'የጥንታዊቷ የሸዋ ንጉሳዊ መቀመጫ፣ የግብርና ምርታማነት ማዕከል እና የአማራ ክልል የሰሜን በር።',
      historyTitle: 'ታሪካዊ አመጣጥና ንጉሣዊ ቅርስ',
      historyP1:
        'አንጎሌላ በኢትዮጵያ ታሪክ ውስጥ የላቀ ስፍራ አላት። በ19ኛው መቶ ክፍለ ዘመን መጀመሪያ ላይ የሸዋው ንጉስ ሳህለ ሥላሴ አንጎሌላን ዋነኛ የክረምት መቀመጫቸውና የጦር ማዕከላቸው አድርገው መስርተዋታል። በታሪክ ታላላቅ የውጭ አገር መልዕክተኞች (ሜጀር ሃሪስ እና ሮሼት ዲኤሪኩርትን ጨምሮ) ንጉሱን የተገናኙትና ታሪካዊ የዲፕሎማሲ ስምምነቶች የተፈራረሙት በአንጎሌላ ነበር።',
      historyP2:
        'የሸዋ ንጉሳዊ ቤተ-መንግሥት ወደ አንኮበር፣ በኋላም ወደ እንጦጦና አዲስ አበባ ከማቅናቱ በፊት አንጎሌላ የፖለቲካና የንግድ ማዕከል ሆና አገልግላለች። ዛሬም ወረዳው ይህን ታላቅ ታሪካዊ ቅርስ ጠብቆ የዘመናዊ ግብርናና የአግሮ-ኢንዱስትሪ ማዕከል በመሆን ላይ ይገኛል።',
      geoTitle: 'መልክአ ምድር፣ ተፈጥሮና ደጋማ ስነ-ምህዳር',
      geoP1:
        'አንጎሌላ ተራ ወረዳ በሰሜን ሸዋ ዞን በአዲስ አበባ-ደሴ ዋና አስፋልት መንገድ ላይ የምትገኝ ሲሆን ከአዲስ አበባ 110 ኪሎ ሜትር፣ ከደብረ ብርሃን ከተማ ደግሞ 20 ኪሎ ሜትር ርቀት ላይ ትገኛለች። ከባህር ወለል በላይ ከ2,600 እስከ 3,050 ሜትር ከፍታ አላት።',
      geoP2:
        'የአየር ንብረቱ ሙሉ በሙሉ ደጋማ ሲሆን አስተማማኝ የበልግና የመኸር ዝናብ ያገኛል። እንደ ጫቻ ወንዝ ያሉ የተፈጥሮ የውሃ ተፋሰሶችና ለም የጥቁር አፈር መሬቶች ለስንዴ፣ ለገብስ፣ ለአተርና ባቄላ እንዲሁም ለእንስሳት እርባታ እጅግ ተመራጭ ያደርጓታል።',
      adminTitle: 'የህዝብ ቁጥርና የቀበሌ አስተዳደር',
      adminP1:
        'ወረዳው በ19 የገጠር ቀበሌዎችና በ2 የጫቻ ከተማ ቀበሌዎች የተዋቀረ ነው። ከ142,500 በላይ ህዝብ የሚኖርባት ሲሆን ጠንካራ የስራ ባህል ያለው ማህበረሰብ የሚገኝባት ናት። እንደ ደቦ፣ ዕድርና ማህበር ያሉ ባህላዊ የመረዳጃ ተቋማት ከመንግሥት አስተዳደር ጋር ተቀናጅተው ለልማት ይሰራሉ።',
      ctaOffices: 'የወረዳው መስሪያ ቤቶች',
      ctaServices: 'የህዝብ አገልግሎቶች',
      ctaLeadership: 'የወረዳው ካቢኔ አመራር',
    },
    om: {
      tag: 'Seenaa fi Qabeenya Uumamaa',
      title: 'Waa\'ee Aanaa Angolallaa Xaraa',
      subtitle: 'Handhuura seenaa Shawaa, wiirtuu qonnaa fi karra gabaa.',
      historyTitle: 'Seenaa fi Hundeeffama Aanaa',
      historyP1:
        'Angolallaan jaarraa 19ffaa keessa teessoo mootota Shawaa ture. Bakka dipilomaasiin biyya alaa itti gaggeeffamaa tureedha.',
      historyP2:
        'Har\'as seenaa ishee kabajuun wiirtuu qonna ammayyaa fi industirii taatee jirti.',
      geoTitle: 'Teessuma Lafa fi Qilleensa Baddaa',
      geoP1:
        'Godina Shawaa Kaabaa keessatti daandii Finfinnee-Dabra Birhaan irratti argamti. Finfinnee irraa km 110 fagaatti.',
      geoP2:
        'Qilleensi ishee baddaa fi oomisha qamadii, garbuu fi loowwaniif mijataadha.',
      adminTitle: 'Bulchiinsa fi Baay\'ina Uummataa',
      adminP1:
        'Gandoolee 19 baadiyyaa fi gandoolee 2 magaalaa Caaccetti qabdi. Uummata 142,500 ol qabdi.',
      ctaOffices: 'Waajjiroota Sektera',
      ctaServices: 'Tajaajila Uummataa',
      ctaLeadership: 'Hoggansa Kaabinee',
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

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Historical & Geographic Narrative (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* History Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                <span className="text-2xl">🏛️</span>
                <h2 className="text-xl font-bold text-[#0d2340]">
                  {content.historyTitle}
                </h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {content.historyP1}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {content.historyP2}
              </p>
            </div>

            {/* Geography Section */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                <span className="text-2xl">⛰️</span>
                <h2 className="text-xl font-bold text-[#0d2340]">
                  {content.geoTitle}
                </h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                {content.geoP1}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {content.geoP2}
              </p>
            </div>

            {/* Demographics & Administration */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-3">
                <span className="text-2xl">👥</span>
                <h2 className="text-xl font-bold text-[#0d2340]">
                  {content.adminTitle}
                </h2>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {content.adminP1}
              </p>
            </div>
          </div>

          {/* Quick Facts Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0d2340] border-b border-gray-100 pb-3">
                Woreda Quick Facts
              </h3>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Seat of Government:</span>
                  <span className="font-semibold text-gray-900">Chacha Town</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Zone:</span>
                  <span className="font-semibold text-gray-900">North Shewa</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Regional State:</span>
                  <span className="font-semibold text-gray-900">Amhara Region</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Total Population:</span>
                  <span className="font-semibold text-gray-900">142,500+</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Kebeles:</span>
                  <span className="font-semibold text-gray-900">19 Rural / 2 Urban</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Elevation:</span>
                  <span className="font-semibold text-gray-900">2,600 – 3,050 m</span>
                </div>
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Distance to Addis Ababa:</span>
                  <span className="font-semibold text-gray-900">110 km (A2 Highway)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Distance to Debre Birhan:</span>
                  <span className="font-semibold text-gray-900">20 km</span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-2">
                <Link
                  href={`/${locale}/about/leadership`}
                  className="w-full text-center block bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-semibold py-2.5 rounded-lg shadow-xs transition-colors"
                >
                  {content.ctaLeadership}
                </Link>
                <Link
                  href={`/${locale}/services`}
                  className="w-full text-center block bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {content.ctaServices}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
