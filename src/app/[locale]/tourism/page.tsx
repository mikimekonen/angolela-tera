import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function TourismPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Heritage, Culture & Highland Ecotourism',
      title: 'Discover Angolela Tera: Nature & History',
      subtitle: 'From historic 19th-century royal Shewan capitals to breath-taking highland escarpments, ancient monasteries, and vibrant cultural traditions.',
      attractionsTitle: 'Key Historical & Natural Attractions',
      attractions: [
        {
          title: 'Royal Historic Palace Grounds of King Sahle Selassie',
          category: 'Historical Heritage',
          desc: 'The former royal encampment where King Sahle Selassie of Shewa signed historic 19th-century diplomatic treaties with British and French envoys before the founding of Addis Ababa.',
          icon: '👑',
        },
        {
          title: 'Chacha River Gorges & Highland Escarpment Vistas',
          category: 'Ecotourism & Nature',
          desc: 'Spectacular river gorges, seasonal highland waterfalls, and hiking trails overlooking the Great Rift Valley edge and scenic high Shewan farmland.',
          icon: '🏞️',
        },
        {
          title: 'Historic Highland Monasteries & Churches',
          category: 'Religious & Architectural Heritage',
          desc: 'Centuries-old Orthodox Christian churches housing precious Ge\'ez manuscripts, historic ecclesiastical crowns, and traditional religious artistry.',
          icon: '⛪',
        },
        {
          title: 'Traditional Highland Sheep Wool Weaving & Crafts',
          category: 'Cultural Handicrafts',
          desc: 'Artisanal production of authentic highland wool blankets (Gabi & Kuta), warm woolen cloaks (Bernos), and traditional pottery in surrounding rural kebeles.',
          icon: '🧶',
        },
      ],
      festivalsTitle: 'Community Festivals & Celebrations',
      festivalsDesc: 'Experience centuries-old Ethiopian cultural hospitality during religious and seasonal celebrations: Meskel (Finding of the True Cross), Timket (Epiphany celebrations along the Chacha riverbanks), and local harvest festivals.',
      ctaVisit: 'Plan a Tour & Contact Visitor Desk',
    },
    am: {
      tag: 'ቅርስ፣ ባህልና የተፈጥሮ ቱሪዝም',
      title: 'አንጎሌላ ተራን ይጎብኙ፡ ተፈጥሮና ታሪክ',
      subtitle: 'ከ19ኛው ክፍለ ዘመን የሸዋ ንጉሣዊ መቀመጫ አንስቶ እስከ አስደናቂ የተፈጥሮ ተራሮች፣ ጥንታዊ ገዳማትና የበለጸጉ ባህላዊ እሴቶች።',
      attractionsTitle: 'ዋና ዋና ታሪካዊና የተፈጥሮ መስህቦች',
      attractions: [
        {
          title: 'የንጉሥ ሳህለ ሥላሴ ታሪካዊ ቤተ-መንግሥት ስፍራ',
          category: 'ታሪካዊ ቅርስ',
          desc: 'የሸዋው ንጉሥ ሳህለ ሥላሴ ከእንግሊዝና ፈረንሳይ ዲፕሎማቶች ጋር ታሪካዊ ስምምነቶችን የተፈራረሙበት ጥንታዊ የክረምት ቤተ-መንግሥትና የጦር ማዕከል።',
          icon: '👑',
        },
        {
          title: 'የጫቻ ወንዝ ገደላማ ስፍራዎችና የተፈጥሮ ፏፏቴዎች',
          category: 'የተፈጥሮ ቱሪዝም',
          desc: 'አስደናቂ የወንዝ ገደሎች፣ የደጋ ተራሮች እይታና ለተፈጥሮ የእግር ጉዞ ምቹ የሆኑ ውብ የተፈጥሮ መልክአ ምድሮች።',
          icon: '🏞️',
        },
        {
          title: 'ጥንታዊ ደጋማ ገዳማትና አድባራት',
          category: 'ሃይማኖታዊና ታሪካዊ ቅርስ',
          desc: 'በዘመናት ጥንታዊነት ያላቸው አብያተ-ክርስቲያናት፣ ብራናዎች፣ የነገሥታት ዘውዶችና የጥንት ሃይማኖታዊ ቅርሶች መገኛ።',
          icon: '⛪',
        },
        {
          title: 'የደጋ በግ ሱፍ ባህላዊ ሽመናና የሸክላ ስራ',
          category: 'ባህላዊ እደ-ጥበብ',
          desc: 'የአካባቢው አርሶ አደሮች ከበግ ሱፍ የሚሰሩት ዝነኛው በርኖስ፣ ጋቢና የሸክላ ስራዎች የሚዘጋጁበት ባህላዊ ማዕከል።',
          icon: '🧶',
        },
      ],
      festivalsTitle: 'ባህላዊ በዓላትና አከባበሮች',
      festivalsDesc: 'በየዓመቱ የሚከበሩትን የመስቀል፣ የጥምቀት (በጫቻ ወንዝ ዳርቻ በድምቀት የሚከበረው) እና የገና በዓላት ከህዝቡ የእንግዳ ተቀባይነት ባህል ጋር አብረው ያሳልፉ።',
      ctaVisit: 'የጎብኚዎች ዴስክን ያነጋግሩ',
    },
    om: {
      tag: 'Tuuriizimii fi Aadaa',
      title: 'Angolallaa Xaraa Daawwadhaa',
      subtitle: 'Bakka seenaa mootota Shawaa, tulluuwwan babbaddaa fi aadaa boonsaa.',
      attractionsTitle: 'Bakkeewwan Daawwannaaf Mijatan',
      attractions: [
        { title: 'Teessoo Mootii Saahila Sillaasee', category: 'Seenaa', desc: 'Bakka mootichi dipilomaasii itti gaggeessaa ture.', icon: '👑' },
        { title: 'Laga fi Sulula Magaalaa Caaccetti', category: 'Uumama', desc: 'Sulula bareedaa fi tulluuwwan baddaa.', icon: '🏞️' },
        { title: 'Manneen Amantaa Durii', category: 'Seenaa fi Amantaa', desc: 'Bataskaana waggoota dhibbaa dura ijaaraman.', icon: '⛪' },
        { title: 'Hojii Harkaa Aadaa', category: 'Aadaa', desc: 'Uffata aadaa rifeensa hoolaa irraa hojjetamu (Barnoos).', icon: '🧶' },
      ],
      festivalsTitle: 'Ayyaanota Aadaa',
      festivalsDesc: 'Ayyaana Masqalaa, Cuuphaa laga Caaccetti kabajamu fi ayyaanota biroo hirmaadhaa.',
      ctaVisit: 'Kutaa Daawwattootaa Qunnamaa',
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

        {/* Attractions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {content.attractions.map((att, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl p-2.5 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                    {att.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {att.category}
                  </span>
                </div>

                <h2 className="text-base font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors">
                  {att.title}
                </h2>

                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {att.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Cultural Festivals Feature */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-extrabold text-[#0d2340] mb-2">
            {content.festivalsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-3xl">
            {content.festivalsDesc}
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">
              Chacha Tourism & Heritage Division
            </span>
            <Link
              href={`/${locale}/contact`}
              className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-xs transition-colors"
            >
              {content.ctaVisit}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
