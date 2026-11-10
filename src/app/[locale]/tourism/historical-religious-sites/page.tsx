import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'am' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAmharic = locale === 'am'
  return {
    title: isAmharic
      ? 'ታሪካዊና ሃይማኖታዊ ስፍራዎች | አንጎለላ ጠራ ቱሪዝም'
      : 'Historical & Religious Sites | Angolela Tera Tourism',
    description: isAmharic
      ? 'የአንጎለላ ጠራ ጥንታዊ ገዳማት፣ የ19ኛው ክፍለ ዘመን የንጉሥ ሣህለ ሥላሴ ታሪካዊ መቀመጫ እና ቅርሶች።'
      : 'Explore 19th-century royal Shewan capital history, ancient highland monasteries, and religious heritage sites in Angolela Tera.',
  }
}

export default async function HistoricalReligiousSitesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const sites = [
    {
      id: 'angolela-royal-heritage',
      name_en: 'Historical Royal Seat of King Sahle Selassie',
      name_am: 'የንጉሥ ሣህለ ሥላሴ ታሪካዊ የሸዋ መንግሥት መቀመጫ',
      category_en: 'Royal Heritage & 19th-Century History',
      category_am: 'የነገሥታት ታሪክና ቅርስ',
      location_en: 'Angolela Historic Kebele (approx. 14 km southwest of Chacha)',
      location_am: 'አንጎለላ ታሪካዊ ቀበሌ (ከጫጫ በስተደቡብ ምዕራብ 14 ኪሜ)',
      desc_en:
        'During the 1830s and 1840s, Angolela served as a primary seasonal capital of King Sahle Selassie of Shewa. Historical diplomatic missions, including the 1841 British mission led by Major W.C. Harris, visited Angolela to establish commercial and diplomatic relations. Remnants of royal encampments, traditional council grounds, and oral narratives endure in the local community.',
      desc_am:
        'በ1830ዎቹ እና 1840ዎቹ አንጎለላ የሸዋው ንጉሥ ሣህለ ሥላሴ ዋና የወቅቱ መቀመጫ ነበረች። እንደ ሜጀር ደብሊው ሲ ሃሪስ የመሳሰሉ የመጀመሪያዎቹ የውጭ ዲፕሎማሲያዊ መልዕክተኞች ከሸዋ መንግስት ጋር የዲፕሎማሲና የንግድ ስምምነት ለመፈራረም የመጡት ወደ አንጎለላ ነበረ። የታሪካዊ ግቢውና የሸንጎው ታሪክ ዛሬም በማህበረሰቡ ዘንድ በክብር ይወሳል።',
      highlights: [
        isAmharic ? 'የ19ኛው ክፍለ ዘመን የሸዋ ዲፕሎማሲያዊ ታሪክ ማዕከል' : 'Documented 19th-century diplomatic treaty grounds',
        isAmharic ? 'የጥንታዊ ግንብና ቅጥር ምልክቶች' : 'Historic stone foundations and royal assembly knoll',
        isAmharic ? 'የታሪክ ተመራማሪዎችና የቅርስ ጎብኚዎች መዳረሻ' : 'Oral history archives curated by local community elders',
      ],
      visitorTips: isAmharic
        ? 'የአካባቢውን አስጎብኚዎች ከወረዳው ባህልና ቱሪዝም ቢሮ ጋር በመቀናጀት ማግኘት ይመረጣል።'
        : 'Engage authorized local heritage guides through the Woreda Culture & Tourism Desk in Chacha.',
    },
    {
      id: 'ancient-monasteries',
      name_en: 'Historic Highland Orthodox Monasteries & Churches',
      name_am: 'ጥንታዊ የደጋ ገዳማትና ታሪካዊ አብያተ ክርስቲያናት',
      category_en: 'Religious Heritage & Ecclesiastical Architecture',
      category_am: 'የሃይማኖት ቅርስና ጥንታዊ ስነ-ህንጻ',
      location_en: 'Various Rural Kebeles across Angolela Tera Highlands',
      location_am: 'በተለያዩ የአንጎለላ ጠራ የገጠር ቀበሌዎች የሚገኙ',
      desc_en:
        'Angolela Tera is home to historic Ethiopian Orthodox Tewahedo churches and monastic sanctuaries established centuries ago. These holy sites house invaluable ecclesiastical artifacts, ancient illuminated parchment manuscripts, historical crosses, and distinct Shewan ecclesiastical mural art preserved across generations.',
      desc_am:
        'አንጎለላ ጠራ ከዘመናት በፊት የተተከሉ በርካታ ታሪካዊ ገዳማትና አብያተ ክርስቲያናት መገኛ ነው። እነዚህ ገዳማት የብራና መጻሕፍት፣ የጥንት መስቀሎች፣ የነገሥታት መዋጮዎችና ባህላዊ የሸዋ ስነ-ስዕላትን በጥንቃቄ ጠብቀው ይዘዋል።',
      highlights: [
        isAmharic ? 'የብራና ድርሳናትና ጥንታዊ የዜማ መጻሕፍት' : 'Ancient parchment illuminated manuscripts and hymnals',
        isAmharic ? 'ባህላዊ የቤተ ክርስቲያን ስነ-ህንጻና የጥበቃ ዛፎች' : 'Distinct circular architecture surrounded by sacred old-growth groves',
        isAmharic ? 'በዓላተ ንግስ በልዩ መንፈሳዊ ድምቀት የሚከበሩባቸው' : 'Annual patron saint feasts celebrated with traditional liturgical chants',
      ],
      visitorTips: isAmharic
        ? 'ወደ ቅዱሳን ስፍራዎች ሲገቡ ባህላዊ አለባበስን (ነጭ ነጠላ/ጋቢ) መልበስና የስፍራውን ክብር መጠበቅ ግዴታ ነው።'
        : 'Modest attire (covering shoulders and legs) is required. Photography inside holy sanctuaries requires prior permission from church authorities.',
    },
    {
      id: 'chacha-historical-crossing',
      name_en: 'Chacha River Historic Crossing & Battlegrounds',
      name_am: 'የጫጫ ወንዝ ታሪካዊ መሻገሪያና የጦር ሜዳዎች',
      category_en: 'Military & Regional History',
      category_am: 'የወታደራዊና የክልል ታሪክ',
      location_en: 'Chacha River Gorge and Old Trade Caravan Route',
      location_am: 'የጫጫ ወንዝ ሸለቆና የቀድሞ የንግድ መስመር',
      desc_en:
        'The deep canyon of the Chacha River historically represented a strategic natural border and tactical defense line in central Shewa. Centuries of salt and coffee trade caravans traversed this gorge. Historic bridges, stone paving traces, and local battle narratives from feudal unification epochs highlight this dramatic terrain.',
      desc_am:
        'የጫጫ ወንዝ ጥልቅ ሸለቆ በቀድሞ ዘመናት በመካከለኛው ሸዋ ውስጥ ስትራቴጂካዊ የተፈጥሮ ምሽግ እና የመከላከያ ወሰን ነበር። የጨውና የቡና የካራቫን ነጋዴዎች ይህንን ወንዝ ተሻግረው ወደ መሃል አገር ይገቡ ነበር። ጥንታዊ የድንጋይ ድልድዮችና የመተላለፊያ መንገዶች አሻራ ዛሬም ይታያል።',
      highlights: [
        isAmharic ? 'የድሮው የካራቫን የንግድ መስመር አሻራ' : 'Traces of the historical salt-trade caravan trail',
        isAmharic ? 'የጫጫ ወንዝ ተፈጥሮአዊ የሸለቆ ምሽግ' : 'Dramatic river gorge battle vantage points',
        isAmharic ? 'የወረዳው ወጣቶችና የአካባቢ አስጎብኚዎች ታሪክ ማብራሪያ' : 'Guided historical walks led by certified woreda youth associations',
      ],
      visitorTips: isAmharic
        ? 'የሸለቆው መንገድ ገደላማ ስለሆነ ምቹ የእግር ጉዞ ጫማዎችን ማድረግ ይመረጣል።'
        : 'Sturdy trekking footwear is recommended for descending the rocky gorge trails.',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-[#0d2340] text-white p-8 sm:p-10 rounded-2xl border-b-4 border-[#c8931a] shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#fed100] mb-3 uppercase tracking-wider font-semibold">
            <Link href={`/${locale}`} className="hover:underline">
              {isAmharic ? 'ዋና ገጽ' : 'Home'}
            </Link>
            <span>›</span>
            <Link href={`/${locale}/tourism`} className="hover:underline">
              {isAmharic ? 'ቱሪዝም' : 'Tourism'}
            </Link>
            <span>›</span>
            <span>{isAmharic ? 'ታሪካዊ ስፍራዎች' : 'Historical & Religious Sites'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'ታሪካዊና ሃይማኖታዊ ቅርሶች በአንጎለላ ጠራ'
              : 'Historical & Religious Heritage in Angolela Tera'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'ከ19ኛው ክፍለ ዘመን የንጉሥ ሣህለ ሥላሴ ሸዋ መቀመጫ ጀምሮ እስከ ጥንታዊ ገዳማትና የንግድ መስመሮች ድረስ ያለውን ታሪክ ያስሱ።'
              : 'Discover 19th-century royal Shewan diplomacy, sacred highland monastic sanctuaries, and dramatic historical caravan crossings.'}
          </p>
        </div>

        {/* Sites List */}
        <div className="space-y-6">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <div>
                  <span className="text-[10px] font-bold text-[#c8931a] uppercase tracking-wider">
                    {isAmharic ? site.category_am : site.category_en}
                  </span>
                  <h2 className="text-xl font-bold text-[#0d2340]">
                    {isAmharic ? site.name_am : site.name_en}
                  </h2>
                </div>
                <div className="text-xs font-semibold text-gray-500">
                  📍 {isAmharic ? site.location_am : site.location_en}
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {isAmharic ? site.desc_am : site.desc_en}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                    {isAmharic ? 'ዋና ዋና ገጽታዎች፡' : 'Key Highlights:'}
                  </h3>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    {site.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">✦</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/50 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-amber-900 mb-1 uppercase tracking-wider">
                      {isAmharic ? 'ለጎብኚዎች ጠቃሚ ምክር፡' : 'Visitor Advisory & Etiquette:'}
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      {site.visitorTips}
                    </p>
                  </div>
                  <div className="pt-3 mt-2 border-t border-amber-200/40 text-[11px] text-amber-900 font-medium">
                    {isAmharic
                      ? 'የወረዳው ኮሙዩኒኬሽንና ቱሪዝም ቢሮ፡ 058 661 0100'
                      : 'Woreda Tourism Desk Assistance: +251 (0) 58 661 0100'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Responsible Tourism Notice */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <h2 className="text-lg font-bold text-[#0d2340]">
            {isAmharic ? 'የሃይማኖትና የታሪክ ቅርሶች ጥበቃ መመሪያ' : 'Heritage Preservation & Responsible Tourism Guidelines'}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {isAmharic
              ? 'የአንጎለላ ጠራ ወረዳ ታሪካዊና ሃይማኖታዊ ስፍራዎች በህግ የተጠበቁ ቅርሶች ናቸው። ጎብኚዎች የስፍራውን ንጽህና እንዲጠብቁ፣ የቤተ ክርስቲያን ህጎችን እንዲያከብሩና ያለ ፈቃድ ምንም ዓይነት የጥንት እቃዎችን እንዳይነኩ በጥብቅ ይሳሰባሉ።'
              : 'All historical and ecclesiastical sites are protected under regional cultural heritage laws. Visitors are requested to preserve environmental cleanliness, respect monastic sanctity, and refrain from touching or disturbing ancient parchment texts and architectural masonry.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-gray-100 text-xs">
            <Link
              href={`/${locale}/tourism/scenic-landscapes`}
              className="text-[#1a4f8b] font-bold hover:underline"
            >
              {isAmharic ? 'የተፈጥሮ መስህቦችና የእግር ጉዞ መንገዶች ›' : 'Explore Scenic Landscapes & Trekking ›'}
            </Link>
            <Link
              href={`/${locale}/tourism/culture-festivals`}
              className="text-[#1a4f8b] font-bold hover:underline"
            >
              {isAmharic ? 'ባህላዊ በዓላትና እሴቶች ›' : 'View Culture & Festivals ›'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
