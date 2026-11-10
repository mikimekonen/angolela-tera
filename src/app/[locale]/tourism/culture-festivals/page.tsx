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
      ? 'ባህልና ባህላዊ በዓላት | አንጎለላ ጠራ ቱሪዝም'
      : 'Culture & Festivals | Angolela Tera Tourism',
    description: isAmharic
      ? 'የጥምቀት በዓል በጫጫ ወንዝ፣ የመስቀል ደመራ፣ የፈረስ ጉግስ፣ የበግ ፀጉር ጥበብና የሸዋ ባህላዊ እሴቶች።'
      : 'Vibrant cultural heritage, Timket epiphany celebrations on the Chacha river, Shewan horse traditions, and wool weaving in Angolela Tera.',
  }
}

export default async function CultureFestivalsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const culturalPillars = [
    {
      title_en: 'Timket (Epiphany) on the Chacha Riverbanks',
      title_am: 'የጥምቀት በዓል አከባበር በጫጫ ወንዝ ዳርቻ',
      season_en: 'January 19 (Tir 11)',
      season_am: 'ጥር 11 ቀን',
      icon: '✝️',
      desc_en:
        'Timket in Angolela Tera is an unforgettable spiritual and cultural spectacle. Ark of the Covenants (Tabots) from historic churches converge upon the sacred baptismal waters of the Chacha River. Thousands of congregants dressed in sparkling white traditional cotton robes (Shemma) gather for night-long liturgical chants, drum processions, and early-morning baptismal immersions.',
      desc_am:
        'የጥምቀት በዓል በአንጎለላ ጠራ ወረዳ በታላቅ ድምቀት የሚከበር መንፈሳዊና ባህላዊ ክስተት ነው። ከአካባቢው ጥንታዊ አብያተ ክርስቲያናት ታቦታቱ ወጥተው ወደ ጫጫ ወንዝ ጥምቀተ ባህር ይሰበሰባሉ። ህዝቡ ነጭ ባህላዊ አልባሳትን ለብሶ ሌሊቱን ሙሉ በዝማሬ፣ በከበሮና በማህሌት ያሳልፋል።',
      features: [
        isAmharic ? 'የታቦታት ሰልፍና የካህናት ያሬዳዊ ዝማሬ' : 'Processions of the Holy Tabots accompanied by liturgical vestments',
        isAmharic ? 'የወጣቶች የሆታና የፈረስ ግልቢያ በወንዙ ዳርቻ' : 'Traditional youth hymns and vibrant equestrian displays',
        isAmharic ? 'የጫጫ ጥምቀተ ባህር ልዩ መንፈሳዊ ውበት' : 'Sacred blessing and mass water sprinkling at dawn',
      ],
    },
    {
      title_en: 'Shewan Equestrian Heritage & Traditional "Guks"',
      title_am: 'የሸዋ የፈረስ ባህልና የጉግስ ጨዋታ',
      season_en: 'Major Holidays (Meskel, Timket, Genna)',
      season_am: 'በዋና ዋና በዓላት (መስቀል፣ ጥምቀት፣ ገና)',
      icon: '🐎',
      desc_en:
        'North Shewa holds an illustrious cavalry tradition dating back to medieval campaigns and 19th-century defense. In Angolela Tera, skilled highland horsemen adorned in traditional lion-mane headdresses and vibrant saddle trappings gather for the daring equestrian mock-jousting sport of "Guks", showcasing speed, agility, and horseback mastery.',
      desc_am:
        'ሰሜን ሸዋ ጥንታዊ የፈረሰኞችና የጀግንነት ታሪክ አለው። በአንጎለላ ጠራ ፈረሰኞች በበዓላት ወቅት ባህላዊ የፈረስ እቃዎችን፣ የብር አምባሮችንና የቆዳ ጋሻዎችን ታጥቀው በሜዳ ላይ የሚካሄደውን የጉግስ ጨዋታ በከፍተኛ ፍጥነትና ብቃት ያሳያሉ።',
      features: [
        isAmharic ? 'የፈረሰኞች ጀግንነትና የጉግስ ጨዋታ ውድድር' : 'High-speed traditional jousting with blunt wooden lances',
        isAmharic ? 'ባህላዊ የፈረስ ጌጦችና የኮርቻ ስራዎች' : 'Artisanal leathercraft saddles, silver harnesses, and capes',
        isAmharic ? 'የጀግንነት ፉከራና ቀረርቶ' : 'Traditional warrior chants (Fukera) celebrating ancestral bravery',
      ],
    },
    {
      title_en: 'Highland Sheep Wool Artisanship & Weaving',
      title_am: 'የበግ ፀጉር ጥበብና ባህላዊ ሽመና',
      season_en: 'Year-Round Artisanal Practice',
      season_am: 'ዓመቱን ሙሉ የሚሰራ ባህላዊ ሙያ',
      icon: '🧶',
      desc_en:
        'The cold highland climate is the historic cradle of Ethiopia’s wool artisanship. Local craft guilds shear indigenous highland sheep, clean, card, and spin the natural black and cream fleece, hand-weaving dense insulating blankets (Gabi, Kaba, and Burnous). These wool items are prized nationally for warmth and durability.',
      desc_am:
        'የአንጎለላ ጠራ ብርዳማ አየር ለበግ ፀጉር ስራ ምቹ ነው። የአካባቢው የእጅ ጥበብ ባለሙያዎች የበግ ፀጉርን አጥበው፣ ፈትለውና ሸምነው ድንቅ የሆኑ ብርዱን የሚከላከሉ ካባዎችን፣ ጋቢዎችንና ምንጣፎችን ያዘጋጃሉ። እነዚህ ምርቶች በመላው ሀገሪቱ በከፍተኛ ጥራታቸው ይታወቃሉ።',
      features: [
        isAmharic ? 'ተፈጥሮአዊ የበግ ፀጉር ፈተላና ሽመና' : 'Traditional wooden hand-loom weaving of 100% pure wool',
        isAmharic ? 'የባህላዊ ካባና በርኖስ ማምረት' : 'Crafting of highland hooded capes (Burnous) and thick blankets',
        isAmharic ? 'ከባለሙያዎቹ ጋር የሚደረግ የሽመና ትምህርት' : 'Opportunity to observe master spinners and purchase direct from weavers',
      ],
    },
    {
      title_en: 'Traditional Shewan Gastronomy & Hospitality',
      title_am: 'ባህላዊ የሸዋ ምግቦችና የእንግዳ አቀባበል',
      season_en: 'Harvest & Celebration Seasons',
      season_am: 'የመከርና የበዓላት ወቅት',
      icon: '🍲',
      desc_en:
        'Highland hospitality is rooted in wholesome organic agricultural products. Savor dishes crafted from roasted malt and barley flour: savory Genfo (barley porridge with spiced butter and berbere), Kinche, fresh cottage cheese infused with highland herbs, roasted Kollo, and sweet honey mead (Tej) brewed with local mountain flora.',
      desc_am:
        'የአንጎለላ ጠራ ማህበረሰብ እንግዳ ተቀባይነት በኦርጋኒክ የደጋ ምርቶች የተመሰረተ ነው። ከተመረጡ የገብስ ዝርያዎች የሚዘጋጀው የገብስ ገንፎ፣ ቅንጬ፣ አይብ፣ ቆሎ እና ከደጋ ማር የሚጣለው ንጹህ ጠጅ ለጎብኚዎች በክብር ይቀርባል።',
      features: [
        isAmharic ? 'ኦርጋኒክ የገብስ ገንፎ በቅቤና በሚጥሚጣ' : 'Traditional barley Genfo served with spiced niter kibbeh',
        isAmharic ? 'የንጹህ የደጋ ማርና ባህላዊ ጠጅ' : 'Highland mountain honey and traditionally fermented honey wine',
        isAmharic ? 'የቡና ማፍላት ስነ-ስርዓት ከእጣንና ሳር ጋር' : 'Complete three-round Ethiopian coffee ceremony with frankincense',
      ],
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
            <span>{isAmharic ? 'ባህልና በዓላት' : 'Culture & Festivals'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'ባህላዊ እሴቶች፣ በዓላትና የእጅ ጥበባት'
              : 'Living Culture, Festivals & Artisanship'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'የጥምቀትና የመስቀል ደማቅ በዓላት፣ የፈረስ ጉግስ ጨዋታ፣ የበግ ፀጉር ሽመና ጥበብና የወረዳው ህዝብ የእንግዳ ተቀባይነት ወጎች።'
              : 'Immerse yourself in authentic Ethiopian spiritual celebrations, chivalric horsemanship, ancient wool weaving guilds, and highland culinary hospitality.'}
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {culturalPillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl p-2.5 bg-gray-50 rounded-xl border border-gray-100">{item.icon}</span>
                  <span className="px-2.5 py-1 bg-amber-50 text-amber-900 font-bold text-[10px] rounded-full border border-amber-200">
                    📅 {isAmharic ? item.season_am : item.season_en}
                  </span>
                </div>

                <h2 className="text-lg font-bold text-[#0d2340] mb-2 leading-snug">
                  {isAmharic ? item.title_am : item.title_en}
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {isAmharic ? item.desc_am : item.desc_en}
                </p>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <h3 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {isAmharic ? 'ዋና ዋና መገለጫዎች፡' : 'Key Cultural Highlights:'}
                  </h3>
                  <ul className="space-y-1 text-xs text-gray-600">
                    {item.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-600 font-bold">✦</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Community Engagement & Tourism Desk */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-[#0d2340]">
              {isAmharic ? 'ባህላዊ በዓላትን በአካል ለመታደም ይፈልጋሉ?' : 'Planning to Attend Local Festivals or Craft Workshops?'}
            </h3>
            <p className="text-xs text-gray-600 mt-1 max-w-xl leading-relaxed">
              {isAmharic
                ? 'የወረዳው ባህልና ቱሪዝም ቢሮ የበዓላት መርሃ-ግብሮችን፣ የፈረስ ጉግስ ቀናትንና የአስጎብኚዎችን መረጃ ያመቻቻል።'
                : 'Contact the Woreda Tourism Desk to verify festival calendar dates, coordinate homestays, or arrange visits with master wool artisans.'}
            </p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="bg-[#0d2340] hover:bg-[#1a4f8b] text-white text-xs font-bold px-5 py-3 rounded-xl shrink-0 transition-colors"
          >
            {isAmharic ? 'የቱሪዝም ዴስክን ያነጋግሩ' : 'Contact Visitor Desk'}
          </Link>
        </div>
      </div>
    </div>
  )
}
