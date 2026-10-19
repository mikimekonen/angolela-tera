import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getTourism } from '@/lib/dataStore'

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

  const isAm = locale === 'am'
  const isOm = locale === 'om'

  const liveTourism = getTourism().filter((t: any) => t.status === 'PUBLISHED' || !t.status)

  const content = {
    en: {
      tag: 'Heritage, Culture & Highland Ecotourism',
      title: 'Discover Angolela Tera: Nature & History',
      subtitle: 'From historic 19th-century royal Shewan capitals to breath-taking highland escarpments, ancient monasteries, and vibrant cultural traditions.',
      attractionsTitle: 'Key Historical & Natural Attractions',
      festivalsTitle: 'Community Festivals & Celebrations',
      festivalsDesc: 'Experience centuries-old Ethiopian cultural hospitality during religious and seasonal celebrations: Meskel (Finding of the True Cross), Timket (Epiphany celebrations along the Chacha riverbanks), and local harvest festivals.',
      ctaVisit: 'Plan a Tour & Contact Visitor Desk',
      activitiesLabel: 'Highlights & Activities',
      locationLabel: 'Location / Coordinates',
      bestSeasonLabel: 'Best Season',
    },
    am: {
      tag: 'ቅርስ፣ ባህልና የተፈጥሮ ቱሪዝም',
      title: 'አንጎሌላ ተራን ይጎብኙ፡ ተፈጥሮና ታሪክ',
      subtitle: 'ከ19ኛው ክፍለ ዘመን የሸዋ ንጉሣዊ መቀመጫ አንስቶ እስከ አስደናቂ የተፈጥሮ ተራሮች፣ ጥንታዊ ገዳማትና የበለጸጉ ባህላዊ እሴቶች።',
      attractionsTitle: 'ዋና ዋና ታሪካዊና የተፈጥሮ መስህቦች',
      festivalsTitle: 'ባህላዊ በዓላትና አከባበሮች',
      festivalsDesc: 'በየዓመቱ የሚከበሩትን የመስቀል፣ የጥምቀት (በጫቻ ወንዝ ዳርቻ በድምቀት የሚከበረው) እና የገና በዓላት ከህዝቡ የእንግዳ ተቀባይነት ባህል ጋር አብረው ያሳልፉ።',
      ctaVisit: 'የጎብኚዎች ዴስክን ያነጋግሩ',
      activitiesLabel: 'ዋና ዋና እንቅስቃሴዎች',
      locationLabel: 'አድራሻ / ኮኦርዲኔት',
      bestSeasonLabel: 'ምቹ ወቅት',
    },
    om: {
      tag: 'Tuuriizimii fi Aadaa',
      title: 'Angolallaa Xaraa Daawwadhaa',
      subtitle: 'Bakka seenaa mootota Shawaa, tulluuwwan babbaddaa fi aadaa boonsaa.',
      attractionsTitle: 'Bakkeewwan Daawwannaaf Mijatan',
      festivalsTitle: 'Ayyaanota Aadaa',
      festivalsDesc: 'Ayyaana Masqalaa, Cuuphaa laga Caaccetti kabajamu fi ayyaanota biroo hirmaadhaa.',
      ctaVisit: 'Kutaa Daawwattootaa Qunnamaa',
      activitiesLabel: 'Sochiiwwan',
      locationLabel: 'Bakka / Teessoo',
      bestSeasonLabel: 'Yeroo Gaarii',
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

        {/* Attractions Grid - Dynamic from dataStore */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {liveTourism.map((att: any) => {
            const name = isAm ? (att.name_am || att.name_en) : isOm ? (att.name_om || att.name_en) : att.name_en
            const desc = isAm ? (att.description_am || att.description_en) : isOm ? (att.description_om || att.description_en) : att.description_en

            return (
              <div
                key={att.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow group flex flex-col justify-between"
              >
                <div>
                  {/* Card Header badge */}
                  <div className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-xs font-semibold text-[#1a4f8b] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                        {att.category || 'Tourism Destination'}
                      </span>
                      {att.bestVisitMonths && (
                        <span className="text-[11px] text-gray-500 font-medium">
                          {att.bestVisitMonths}
                        </span>
                      )}
                    </div>

                    <h2 className="text-lg font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-snug">
                      {name}
                    </h2>

                    <p className="text-xs sm:text-sm text-gray-600 mt-2.5 leading-relaxed line-clamp-4">
                      {desc}
                    </p>
                  </div>

                  {/* Highlights / Activities */}
                  {Array.isArray(att.activities_en) && att.activities_en.length > 0 && (
                    <div className="px-5 py-3 bg-gray-50/60 border-t border-gray-100">
                      <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        {content.activitiesLabel}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {att.activities_en.map((act: string, i: number) => (
                          <span
                            key={i}
                            className="text-[11px] bg-white border border-gray-200 px-2 py-0.5 rounded text-gray-700"
                          >
                            ✓ {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer details */}
                {(att.location_en || att.mapCoordinates) && (
                  <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="truncate max-w-[200px]">📍 {att.location_en || att.mapCoordinates}</span>
                    {att.mapCoordinates && (
                      <span className="font-mono text-[10px] text-gray-400 shrink-0">{att.mapCoordinates}</span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Cultural Festivals Feature */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-extrabold text-[#0d2340] mb-2">
            {content.festivalsTitle}
          </h2>
          <p className="text-xs sm:text-sm text-gray-700 leading-relaxed max-w-3xl">
            {content.festivalsDesc}
          </p>

          <div className="mt-6 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-gray-500 font-medium">
              Chacha Tourism & Heritage Division • Angolela Tera Woreda Administration
            </span>
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center justify-center bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-5 py-2.5 rounded-lg shadow-xs transition-colors"
            >
              {content.ctaVisit}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
