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
      ? 'የተፈጥሮ መስህቦችና የተራራ የእግር ጉዞ | አንጎለላ ጠራ'
      : 'Scenic Landscapes & Trekking | Angolela Tera Tourism',
    description: isAmharic
      ? 'የጫጫ ወንዝ ሸለቆ፣ የአጂማ ግድብ የተፈጥሮ ማራኪ ገጽታ፣ የደጋ ተራሮች የእግር ጉዞ እና የስነ-ምህዳር መስህቦች።'
      : 'Breathtaking highland canyons, Chacha river gorge, Ajima reservoir basin, and highland trekking in Angolela Tera.',
  }
}

export default async function ScenicLandscapesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const trails = [
    {
      title_en: 'The Grand Chacha River Canyon & Gorges',
      title_am: 'የታላቁ የጫጫ ወንዝ ሸለቆና ገደላማ የተፈጥሮ እይታዎች',
      difficulty_en: 'Moderate • 8 Km Circuit',
      difficulty_am: 'መካከለኛ • የ8 ኪሜ የእግር ጉዞ',
      elevation: '2,650m – 2,850m',
      icon: '🏞️',
      desc_en:
        'A spectacular volcanic rift canyon carved over millennia by the perennial Chacha River. Massive basaltic cliffs drop hundreds of meters into lush green riparian riverbanks. The canyon is home to endemic raptors, highland rock hyraxes, and scenic cascading waterfalls during the post-rainy season.',
      desc_am:
        'በዘመናት የጫጫ ወንዝ ፍሰት የተቦረቦረ አስደናቂ የተፈጥሮ ገደልና የድንጋይ ንጣፍ። ጥልቅ የሆነው ሸለቆ የበርካታ የዱር አራዊት፣ የደጋ አዕዋፋት እና በክረምት ወራት የሚያማምሩ ፏፏቴዎች መገኛ ነው።',
      highlights: [
        isAmharic ? 'የባዝልት ዓለት አቀበቶችና አስደናቂ የሸለቆ እይታ' : 'Sheer basalt columns and dramatic valley viewpoints',
        isAmharic ? 'የወንዝ ዳርቻ የዱር አራዊትና የአእዋፍ ዝርያዎች' : 'Abyssinian long-claw and augur buzzard birdwatching',
        isAmharic ? 'በጥቅምትና ህዳር ወራት የሚፈሱ የፏፏቴ መስመሮች' : 'Seasonal post-monsoon waterfalls and pristine river pools',
      ],
    },
    {
      title_en: 'Ajima Dam Lake Basin & Wetland Sanctuary',
      title_am: 'የአጂማ ግድብ ሀይቅና የውሃ ዳርቻ ስነ-ምህዳር',
      difficulty_en: 'Easy Leisure Walk • 5 Km',
      difficulty_am: 'ቀላል የመዝናኛ ጉዞ • 5 ኪሜ',
      elevation: '2,780m',
      icon: '🛶',
      desc_en:
        'The vast reservoir of the Ajima-Chacha dam project has fostered an expansive high-altitude wetland. Calm shimmering waters bordered by gentle agricultural hills provide prime opportunities for photography, peaceful picnics, recreational fishing, and observing migratory waterfowl.',
      desc_am:
        'የአጂማ-ጫጫ ግድብ ፕሮጀክት የፈጠረው ሰፊ ሰው ሰራሽ ሀይቅ ማራኪ የተፈጥሮ መዝናኛ ሆኗል። በዙሪያው ያሉ አረንጓዴ ኮረብቶች፣ ንጹህ አየርና የውሃ ወፎች ስፍራውን ለፎቶግራፍና ለዕረፍት ጉብኝት እጅግ ተመራጭ ያደርጉታል።',
      highlights: [
        isAmharic ? 'የሀይቅ ዳርቻ የእግር ጉዞና የመዝናኛ ስፍራዎች' : 'Scenic lakeside perimeter trails and picnic lookouts',
        isAmharic ? 'የደጋ ወፎች መመልከቻ (Waterfowl Watching)' : 'Observation of migratory and resident highland water birds',
        isAmharic ? 'የአካባቢው አርሶ አደሮች ባህላዊ ጀልባዎች' : 'Traditional wooden skiffs and community boat crossings',
      ],
    },
    {
      title_en: 'Angolela Highland Escarpment & Ridge Traverse',
      title_am: 'የአንጎለላ ደጋማ ሰንሰለታማ ተራሮች አሰሳ',
      difficulty_en: 'Challenging Trek • 14 Km',
      difficulty_am: 'ጠንካራ የተራራ ጉዞ • 14 ኪሜ',
      elevation: '2,800m – 3,100m',
      icon: '⛰️',
      desc_en:
        'Traversing the highest ridges of Angolela Tera, this trek delivers sweeping 360-degree panoramas extending across the North Shewa plateau towards the Great Rift Valley edge. Hikers experience cool crisp mountain breezes, expansive barley fields, and traditional highland stone homesteads.',
      desc_am:
        'የአንጎለላ ጠራ ከፍተኛ የተራራ ሰንሰለቶችን አቋርጦ የሚሄድ የእግር ጉዞ። ከ3,000 ሜትር በላይ ከፍታ ላይ ሆኖ ሰፊውን የሰሜን ሸዋ ሜዳና የስምጥ ሸለቆ ዳርቻ ማየት ያስችላል። ንጹህ የደጋ አየር፣ ለም የእህል ማሳዎችና ባህላዊ የድንጋይ ቤቶች ይጎበኙበታል።',
      highlights: [
        isAmharic ? 'የ360 ዲግሪ የሰሜን ሸዋ ሜዳማ ፓኖራማ' : 'Panoramic vistas reaching across the Shewan plateau',
        isAmharic ? 'ባህላዊ የደጋ አርሶ አደር መንደሮች መስተንግዶ' : 'Authentic highland hospitality at traditional stone hamlets',
        isAmharic ? 'የፈረስ ግልቢያ አማራጭ (Highland Horse Treks)' : 'Equestrian trekking options with local horseback guides',
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
            <span>{isAmharic ? 'የተፈጥሮ መስህቦች' : 'Scenic Landscapes'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'የተፈጥሮ መስህቦችና የተራራ የእግር ጉዞ'
              : 'Scenic Landscapes & Highland Trekking'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'የጫጫ ወንዝ አስደናቂ ሸለቆ፣ የአጂማ ግድብ ማራኪ ሀይቅና ከ3,000 ሜትር በላይ ከፍታ ያላቸው የሰሜን ሸዋ ተራሮች።'
              : 'Experience dramatic basaltic gorges, serene high-altitude dam reservoirs, and pristine trekking ridges in Angolela Tera.'}
          </p>
        </div>

        {/* Trail Cards */}
        <div className="space-y-6">
          {trails.map((t, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-gray-50 rounded-xl border border-gray-100">{t.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-[#0d2340]">
                      {isAmharic ? t.title_am : t.title_en}
                    </h2>
                    <span className="text-xs text-gray-500 font-mono">
                      ▲ {t.elevation}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-50 text-[#1a4f8b] font-bold text-xs rounded-full border border-blue-200 self-start sm:self-auto">
                  {isAmharic ? t.difficulty_am : t.difficulty_en}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                {isAmharic ? t.desc_am : t.desc_en}
              </p>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">
                  {isAmharic ? 'ዋና ዋና መስህቦች፡' : 'Trail Highlights & Ecology:'}
                </h3>
                <ul className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs text-gray-600">
                  {t.highlights.map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Hiker Safety Advisory */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-[#0d2340]">
            {isAmharic ? 'ለተጓዦች የደህንነትና የዝግጅት መመሪያ' : 'Highland Hiker Safety & Packing Guidelines'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-bold text-[#0d2340] mb-1">
                {isAmharic ? 'የአየር ንብረትና አልባሳት' : 'Highland Climate & Layers'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {isAmharic
                  ? 'ከፍታው 2,800 ሜትር በላይ በመሆኑ የሙቀት መጠኑ በቀን ሞቅ ያለ ቢሆንም አመሻሽ ላይ በፍጥነት ይቀዘቅዛል። የንፋስና የዝናብ መከላከያ ጃኬት ይያዙ።'
                  : 'Temperatures fluctuate sharply between midday sun and rapid evening chill. Pack windbreakers, thermal fleece, and sun protection.'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-bold text-[#0d2340] mb-1">
                {isAmharic ? 'የእግር ጫማና ዱላ' : 'Footwear & Equipment'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {isAmharic
                  ? 'የሸለቆው መውረጃና የተራራ መንገዶች ድንጋያማ በመሆናቸው ጠንካራ የእግር ጉዞ ጫማዎችን እና የእግር መደገፊያ ዱላ (Trekking Poles) መጠቀም ይመከራል።'
                  : 'High-traction ankle-support hiking boots and trekking poles are strongly recommended for steep basaltic gorge descents.'}
              </p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <p className="font-bold text-[#0d2340] mb-1">
                {isAmharic ? 'አስጎብኚና ማህበረሰብ' : 'Certified Local Guides'}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {isAmharic
                  ? 'በወረዳው ቱሪዝም ቢሮ የተመዘገቡ የአካባቢው ወጣቶች አስጎብኚ ማህበራትን መጠቀም ደህንነትዎን ለማረጋገጥና ለማህበረሰቡ ድጋፍ ለመስጠት ይረዳል።'
                  : 'Always register with the Woreda Tourism Desk in Chacha to hire certified local youth guides who know weather shifts and trail conditions.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
