'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string }>
}

interface MediaItem {
  id: string
  title_en: string
  title_am: string
  type: 'PHOTO' | 'VIDEO'
  category: 'INFRASTRUCTURE' | 'AGRICULTURE' | 'CULTURE' | 'CEREMONIES' | 'EDUCATION_HEALTH'
  caption_en: string
  caption_am: string
  altText_en: string
  altText_am: string
  url: string
  thumbnailUrl: string
  date: string
}

export default function GalleryPage({ params }: PageProps) {
  const { locale } = use(params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PHOTO' | 'VIDEO'>('ALL')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null)

  const mediaList: MediaItem[] = [
    {
      id: 'media-01',
      title_en: 'Ajima-Chacha Dam & Irrigation Canal Construction Progress',
      title_am: 'የአጂማ-ጫጫ ግድብና የመስኖ ካናል ግንባታ ሂደት',
      type: 'PHOTO',
      category: 'INFRASTRUCTURE',
      caption_en:
        'Engineers and construction teams completing concrete spillway reinforcement at the Ajima-Chacha mega reservoir.',
      caption_am: 'በአጂማ-ጫጫ ግዙፍ የውሃ ማጠራቀሚያ ላይ የኮንክሪት የውሃ ማስተንፈሻ ስራ ሲጠናቀቅ።',
      altText_en: 'Panoramic view of Ajima-Chacha dam spillway construction and heavy machinery',
      altText_am: 'የአጂማ ጫጫ ግድብ ስራ እና የከባድ ማሽነሪዎች እንቅስቃሴ ገጽታ',
      url: '/images/hero/hero-highland.jpg',
      thumbnailUrl: '/images/hero/hero-highland.jpg',
      date: '2026-10-24',
    },
    {
      id: 'media-02',
      title_en: 'Certified Highland Malt Barley Cooperative Harvest Festival',
      title_am: 'የምርጥ ዘር የደጋ ብቅል ገብስ ምርት የመኸር አከባበር',
      type: 'PHOTO',
      category: 'AGRICULTURE',
      caption_en:
        'Farmers and agricultural extension officers inspecting high-yield malt barley crops ready for brewery procurement.',
      caption_am: 'አርሶ አደሮችና የግብርና ኤክስቴንሽን ባለሙያዎች ለቢራ ፋብሪካዎች የሚቀርበውን የገብስ ምርት ሲሰበስቡ።',
      altText_en: 'Golden barley fields with farmers and agricultural extension specialists',
      altText_am: 'የወርቃማ የገብስ ማሳ ከአርሶ አደሮች ጋር',
      url: '/images/hero/hero-bg.jpg',
      thumbnailUrl: '/images/hero/hero-bg.jpg',
      date: '2026-10-18',
    },
    {
      id: 'media-03',
      title_en: 'Timket Epiphany Celebration Along the Historic Chacha River',
      title_am: 'የጥምቀት በዓል በታሪካዊው የጫጫ ወንዝ ጥምቀተ ባህር',
      type: 'PHOTO',
      category: 'CULTURE',
      caption_en:
        'Thousands of faithful congregating in white cotton shawls for the holy baptismal blessing ceremony on Chacha riverbanks.',
      caption_am: 'በሺዎች የሚቆጠሩ ምዕመናን በነጭ ባህላዊ ልብስ አጊጠው በጫጫ ወንዝ ጥምቀተ ባህር ሲያከብሩ።',
      altText_en: 'Timket Epiphany celebration procession by priests and crowd on riverbank',
      altText_am: 'የጥምቀት በዓል ሰልፍና የካህናት ዝማሬ በወንዝ ዳርቻ',
      url: '/images/about/administration.jpg',
      thumbnailUrl: '/images/about/administration.jpg',
      date: '2026-09-28',
    },
    {
      id: 'media-04',
      title_en: 'Chacha North Industrial Corridor Infrastructure Inspection',
      title_am: 'የጫጫ ሰሜን ኢንዱስትሪ ኮሪደር የመሰረተ ልማት የመስክ ምልከታ',
      type: 'PHOTO',
      category: 'INFRASTRUCTURE',
      caption_en:
        'Woreda cabinet leadership inspecting newly erected 33kV high-voltage lines and paved access roads in the industrial zone.',
      caption_am: 'የወረዳው ካቢኔ አመራሮች በኢንዱስትሪ ዞኑ የተዘረጋውን የኤሌክትሪክና የአስፋልት መንገድ ሲጎበኙ።',
      altText_en: 'Industrial zone inspection by cabinet officers and utility engineers',
      altText_am: 'የኢንዱስትሪ ኮሪደር የመሰረተ ልማት ፍተሻ በካቢኔ አመራሮች',
      url: '/images/about/ict-lab.jpg',
      thumbnailUrl: '/images/about/ict-lab.jpg',
      date: '2026-09-12',
    },
    {
      id: 'media-05',
      title_en: 'Highland Traditional Sheep Wool Artisanal Weaving Guilds',
      title_am: 'የደጋ የበግ ፀጉር ባህላዊ ሽመና ባለሙያዎች ማህበር',
      type: 'PHOTO',
      category: 'CULTURE',
      caption_en:
        'Master craftswomen demonstrating spinning and wooden handloom weaving of traditional warm winter Burnous capes.',
      caption_am: 'የእጅ ጥበብ ባለሙያዎች የበግ ፀጉርን በመፍተልና በባህላዊ ሸማ ድንቅ ካባዎችን ሲያዘጋጁ።',
      altText_en: 'Traditional wool spinning and weaving on wooden loom by Ethiopian artisans',
      altText_am: 'የበግ ፀጉር ፈተላና ሽመና በባህላዊ ሸማ',
      url: '/images/hero/hero-highland.jpg',
      thumbnailUrl: '/images/hero/hero-highland.jpg',
      date: '2026-08-30',
    },
    {
      id: 'media-06',
      title_en: 'Documentary: Angolela Tera Digital Governance Transformation',
      title_am: 'ዶክመንተሪ፡ የአንጎለላ ጠራ ወረዳ የዲጂታል አስተዳደር ሽግግር',
      type: 'VIDEO',
      category: 'CEREMONIES',
      caption_en:
        'Official video report presenting the launch of civil service digitization, land registration portals, and citizen charter services.',
      caption_am: 'የወረዳው የሲቪል ሰርቪስ ዲጂታላይዜሽንና የዜጎች የመረጃ ፖርታል ይፋ መሆንን የሚያሳይ ይፋዊ ቪዲዮ።',
      altText_en: 'Video thumbnail showing digital governance portal inauguration',
      altText_am: 'የዲጂታል አስተዳደር ፖርታል ምረቃ ቪዲዮ',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnailUrl: '/images/about/ict-lab.jpg',
      date: '2026-08-15',
    },
  ]

  const categories = [
    { key: 'ALL', label_en: 'All Media', label_am: 'ሁሉም ሚዲያ' },
    { key: 'INFRASTRUCTURE', label_en: 'Infrastructure & Projects', label_am: 'መሰረተ ልማትና ፕሮጀክቶች' },
    { key: 'AGRICULTURE', label_en: 'Agriculture & Harvest', label_am: 'ግብርናና መከር' },
    { key: 'CULTURE', label_en: 'Culture & Heritage', label_am: 'ባህልና ቅርስ' },
    { key: 'CEREMONIES', label_en: 'Official Ceremonies', label_am: 'ይፋዊ መርሃ-ግብሮች' },
  ]

  const filtered = mediaList.filter((m) => {
    const matchesType = typeFilter === 'ALL' || m.type === typeFilter
    const matchesCat = selectedCategory === 'ALL' || m.category === selectedCategory
    return matchesType && matchesCat
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#0d2340] text-white p-8 sm:p-10 rounded-2xl border-b-4 border-[#c8931a] shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#fed100] mb-3 uppercase tracking-wider font-semibold">
            <Link href={`/${locale}`} className="hover:underline">
              {isAmharic ? 'ዋና ገጽ' : 'Home'}
            </Link>
            <span>›</span>
            <Link href={`/${locale}/news`} className="hover:underline">
              {isAmharic ? 'ዜናና መረጃ' : 'News & Media'}
            </Link>
            <span>›</span>
            <span>{isAmharic ? 'የፎቶና ቪዲዮ ጋለሪ' : 'Gallery'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'ይፋዊ የፎቶ እና ቪዲዮ ጋለሪ'
              : 'Official Photo & Video Documentary Gallery'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'የአንጎለላ ጠራ ወረዳ የልማት ፕሮጀክቶችን፣ የግብርና ተፋሰሶችን፣ ባህላዊ በዓላትንና የመንግስት ስራዎችን የሚያሳዩ ምስሎችና ቪዲዮዎች።'
              : 'Visual documentary of capital infrastructure projects, vibrant agricultural harvests, cultural festivals, and community life in Angolela Tera.'}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Type Toggle */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl w-full sm:w-auto">
            {(['ALL', 'PHOTO', 'VIDEO'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === t
                    ? 'bg-[#0d2340] text-white shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t === 'ALL'
                  ? isAmharic ? 'ሁሉም' : 'All'
                  : t === 'PHOTO'
                  ? isAmharic ? '📸 ፎቶዎች' : '📸 Photos'
                  : isAmharic ? '🎥 ቪዲዮዎች' : '🎥 Videos'}
              </button>
            ))}
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-start sm:justify-end">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === c.key
                    ? 'bg-[#c8931a] text-[#0d2340]'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isAmharic ? c.label_am : c.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveMedia(item)}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:border-[#1a4f8b] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
            >
              <div>
                <div className="relative aspect-video bg-gray-100 overflow-hidden">
                  <img
                    src={item.thumbnailUrl}
                    alt={isAmharic ? item.altText_am : item.altText_en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2 py-0.5 bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold rounded-md">
                      {item.type === 'PHOTO' ? '📷 PHOTO' : '▶ VIDEO'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <p className="text-[10px] font-bold text-[#c8931a] uppercase tracking-wider">
                    {item.category.replace('_', ' & ')}
                  </p>
                  <h3 className="text-sm font-bold text-[#0d2340] leading-snug line-clamp-2">
                    {isAmharic ? item.title_am : item.title_en}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {isAmharic ? item.caption_am : item.caption_en}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 mt-2">
                <span>{item.date}</span>
                <span className="text-[#1a4f8b] font-bold group-hover:underline">
                  {isAmharic ? 'ይመልከቱ ›' : 'View ›'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Lightbox / Player */}
        {activeMedia && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl space-y-4">
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold text-[#c8931a] uppercase tracking-wider">
                    {activeMedia.category}
                  </span>
                  <h3 className="text-base font-black text-[#0d2340]">
                    {isAmharic ? activeMedia.title_am : activeMedia.title_en}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveMedia(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="px-4">
                {activeMedia.type === 'PHOTO' ? (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden flex items-center justify-center">
                    <img
                      src={activeMedia.url}
                      alt={isAmharic ? activeMedia.altText_am : activeMedia.altText_en}
                      className="max-h-[60vh] w-auto object-contain"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden">
                    <iframe
                      src={activeMedia.url}
                      title={activeMedia.title_en}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              <div className="p-4 pt-0 space-y-1">
                <p className="text-xs text-gray-700 leading-relaxed">
                  {isAmharic ? activeMedia.caption_am : activeMedia.caption_en}
                </p>
                <p className="text-[11px] text-gray-400 font-medium">
                  {isAmharic ? 'የቀረጸው ቀን፡' : 'Published:'} {activeMedia.date} • Angolela Tera Woreda Communications
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
