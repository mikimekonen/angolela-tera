'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string }>
}

interface Announcement {
  id: string
  title_en: string
  title_am: string
  category: 'DECISION' | 'TENDER' | 'RECRUITMENT' | 'PUBLIC_NOTICE' | 'MEETING'
  issuingOffice_en: string
  issuingOffice_am: string
  date: string
  deadline?: string
  refNumber: string
  content_en: string
  content_am: string
  actionLink?: string
}

export default function AnnouncementsPage({ params }: PageProps) {
  const { locale } = use(params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [activeModal, setActiveModal] = useState<Announcement | null>(null)

  const announcements: Announcement[] = [
    {
      id: 'ann-01',
      title_en: 'Call for Proposals: Agricultural Input Supply Cooperatives',
      title_am: 'የግብርና ግብዓት አቅርቦት ህብረት ስራ ማህበራት ጥሪ',
      category: 'PUBLIC_NOTICE',
      issuingOffice_en: 'Agriculture & Natural Resource Office',
      issuingOffice_am: 'የግብርናና የተፈጥሮ ሀብት ጽ/ቤት',
      date: '2026-11-04',
      deadline: '2026-11-25',
      refNumber: 'ATW-AGR-094/2026',
      content_en:
        'The Angolela Tera Woreda Agriculture & Natural Resource Office invites certified primary agricultural cooperatives to participate in the pre-distribution verification of certified highland seed varieties and organic bio-fertilizer vouchers for the upcoming Meher farming season. Cooperatives must submit legal audit certificates and active member registries.',
      content_am:
        'የአንጎለላ ጠራ ወረዳ ግብርናና ተፈጥሮ ሀብት ጽህፈት ቤት ህጋዊ እውቅና ያላቸው የአንደኛ ደረጃ የግብርና ህብረት ስራ ማህበራት ለመጪው የመኸር እርሻ ወቅት የዘርና ማዳበሪያ ቫውቸር ስርጭት ዝግጅት ላይ እንዲሳተፉ ጥሪ ያቀርባል። ማህበራት የኦዲት ሪፖርትና የአባላት መዝገብ ማቅረብ አለባቸው።',
    },
    {
      id: 'ann-02',
      title_en: 'Public Invitation: Chacha Town Urban Master Plan Review Hearing',
      title_am: 'የጫጫ ከተማ ማስተር ፕላን ክለሳ የህዝብ ውይይት ጥሪ',
      category: 'MEETING',
      issuingOffice_en: 'Municipal Administration & Urban Planning Desk',
      issuingOffice_am: 'የከተማ ማዘጋጃ ቤትና ፕላን አስተዳደር',
      date: '2026-10-28',
      refNumber: 'ATW-MUN-112/2026',
      content_en:
        'A public stakeholder consultation will be held at the Chacha Town Municipal Assembly Hall concerning the proposed 10-year master plan extension. The session will cover residential zoning, green corridors along the Chacha River, and logistics terminal designations. Citizens and business owners are encouraged to attend.',
      content_am:
        'በጫጫ ከተማ ማዘጋጃ ቤት አዳራሽ በከተማው የ10 ዓመት ማስተር ፕላን ክለሳ ዙሪያ የህዝብ አስተያየት መቀበያ መድረክ ይካሄዳል። ውይይቱ በመኖሪያ መንደሮች፣ በጫጫ ወንዝ አረንጓዴ ፓርክ እና በኢንዱስትሪ ኮሪደር ድልድል ላይ ያተኩራል። የከተማው ነዋሪዎችና ባለሀብቶች እንዲገኙ ተጋብዘዋል።',
    },
    {
      id: 'ann-03',
      title_en: 'Open National Tender: Rural Feeder Road Construction (Lot 3)',
      title_am: 'ግልጽ ብሔራዊ ጨረታ፡ የገጠር ተደራሽነት መንገድ ግንባታ (ሎት 3)',
      category: 'TENDER',
      issuingOffice_en: 'Finance & Economic Development Office',
      issuingOffice_am: 'የፋይናንስና ኢኮኖሚ ልማት ጽ/ቤት',
      date: '2026-10-22',
      deadline: '2026-11-18',
      refNumber: 'NCB/ATW/RDS/04/2026',
      content_en:
        'Angolela Tera Woreda Administration announces an open competitive national bidding process for licensed Grade 5 and above General/Road Contractors for the upgrading of 12.4 km engineered gravel road connecting Kotu to Cheki kebele. Bidding documents can be purchased at Room 08.',
      content_am:
        'የአንጎለላ ጠራ ወረዳ አስተዳደር ከኮቱ እስከ ጨቂ ቀበሌ የሚዘልቀውን 12.4 ኪሜ የገጠር ጠጠር መንገድ ደረጃ ለማሻሻል ደረጃ 5 እና ከዚያ በላይ የሆኑ የኮንትራክተሮችን በግልጽ ጨረታ አወዳድሮ ማሰራት ይፈልጋል። የጨረታ ሰነዱን በቢሮ ቁጥር 08 መግዛት ይቻላል።',
    },
    {
      id: 'ann-04',
      title_en: 'Civil Service Vacancy: Primary Health Care Clinical Officers',
      title_am: 'የስራ ቅጥር ማስታወቂያ፡ የመጀመሪያ ደረጃ የጤና ባለሙያዎች',
      category: 'RECRUITMENT',
      issuingOffice_en: 'Civil Service & Human Resource Development Office',
      issuingOffice_am: 'የፐብሊክ ሰርቪስና የሰው ሀብት ልማት ጽ/ቤት',
      date: '2026-10-15',
      deadline: '2026-11-12',
      refNumber: 'ATW-HR-208/2026',
      content_en:
        'Applications are invited from qualified and certified health professionals for 6 permanent civil service positions at Chacha Primary Hospital and rural health posts across Angolela Tera Woreda. Minimum qualification: BSc in Public Health / Clinical Nursing with valid COC and professional license.',
      content_am:
        'በጫጫ የመጀመሪያ ደረጃ ሆስፒታልና በወረዳው የገጠር ጤና ኬላዎች ለሚመደቡ 6 ቋሚ የጤና ባለሙያዎች ክፍት የስራ መደቦች ማስታወቂያ። ተፈላጊ የትምህርት ዝግጅት፡ በህዝብ ጤና ወይም ክሊኒካል ነርሲንግ የመጀመሪያ ዲግሪ፣ የCOC ማረጋገጫና የታደሰ የስራ ፈቃድ።',
    },
    {
      id: 'ann-05',
      title_en: 'Cabinet Directive: Environmental Standards for Highland Quarries',
      title_am: 'የካቢኔ ውሳኔ፡ የተፈጥሮ ድንጋይ ማውጫዎች የአካባቢ ጥበቃ መመሪያ',
      category: 'DECISION',
      issuingOffice_en: 'Woreda Executive Cabinet Secretariat',
      issuingOffice_am: 'የወረዳው ዋና አስተዳደር ካቢኔ ጽ/ቤት',
      date: '2026-10-08',
      refNumber: 'DIR-ATW-ENV-01/2026',
      content_en:
        'The Woreda Executive Council has passed Resolution No. 14/2026 requiring all commercial basalt and ballast quarry operators to implement mandatory slope reforestation and sediment runoff controls within 60 calendar days to protect the Chacha and Ajima river basins.',
      content_am:
        'የወረዳው ስራ አስፈጻሚ ካቢኔ ባሳለፈው ውሳኔ ቁጥር 14/2026 መሰረት፣ በአንጎለላ ጠራ ወረዳ የሚሰሩ ሁሉም የኮንስትራክሽን ድንጋይ አውጪዎች የጫጫና አጂማ ተፋሰስን ከአፈር መሸርሸር ለመከላከል በ60 ቀናት ውስጥ ዛፎችን የመትከልና የተቆፈሩ ጉድጓዶችን የማስተካከል ግዴታ ተጥሎባቸዋል።',
    },
  ]

  const categories = [
    { key: 'ALL', label_en: 'All Notices', label_am: 'ሁሉም ማስታወቂያዎች' },
    { key: 'DECISION', label_en: 'Executive Decisions', label_am: 'የካቢኔ ውሳኔዎች' },
    { key: 'TENDER', label_en: 'Tenders & Bids', label_am: 'ጨረታዎች' },
    { key: 'RECRUITMENT', label_en: 'Recruitment & Vacancies', label_am: 'የስራ ቅጥር' },
    { key: 'MEETING', label_en: 'Public Meetings', label_am: 'የህዝብ ውይይቶች' },
    { key: 'PUBLIC_NOTICE', label_en: 'General Notices', label_am: 'አጠቃላይ ጥሪዎች' },
  ]

  const filtered = announcements.filter((item) => {
    const matchesCat = selectedCategory === 'ALL' || item.category === selectedCategory
    const q = search.toLowerCase()
    const matchesSearch =
      item.title_en.toLowerCase().includes(q) ||
      item.title_am.includes(q) ||
      item.refNumber.toLowerCase().includes(q) ||
      item.content_en.toLowerCase().includes(q) ||
      item.content_am.includes(q)
    return matchesCat && matchesSearch
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
            <span>{isAmharic ? 'ማስታወቂያዎች' : 'Announcements'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'ይፋዊ የመንግስት ማስታወቂያዎችና ጥሪዎች'
              : 'Official Government Announcements & Public Gazettes'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'የአንጎለላ ጠራ ወረዳ አስተዳደር ካቢኔ ውሳኔዎች፣ ግልጽ ጨረታዎች፣ የስራ ቅጥር ማስታወቂያዎችና የህዝብ መድረክ ጥሪዎች።'
              : 'Official gazetted notices, executive resolutions, civil service recruitments, and procurement tenders from Angolela Tera Woreda Administration.'}
          </p>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  isAmharic
                    ? 'በማስታወቂያ ርዕስ፣ በማጣቀሻ ቁጥር ወይም በይዘት ይፈልጉ...'
                    : 'Search announcements by keyword, reference code, or office...'
                }
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelectedCategory(c.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === c.key
                    ? 'bg-[#0d2340] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isAmharic ? c.label_am : c.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Announcement Feed */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
              {isAmharic
                ? 'ምንም ዓይነት ማስታወቂያ አልተገኘም። እባክዎ ፍለጋዎን ይቀይሩ።'
                : 'No announcements match your filter criteria.'}
            </div>
          ) : (
            filtered.map((ann) => (
              <div
                key={ann.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-[#1a4f8b] font-bold text-[10px] rounded-full border border-blue-200 uppercase tracking-wider">
                      {ann.category}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-gray-500">
                      #{ann.refNumber}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      • {new Date(ann.date).toLocaleDateString()}
                    </span>
                    {ann.deadline && (
                      <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-md border border-rose-200">
                        {isAmharic ? 'የማብቂያ ቀን፡' : 'Deadline:'} {ann.deadline}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-bold text-[#0d2340] leading-snug">
                    {isAmharic ? ann.title_am : ann.title_en}
                  </h2>

                  <p className="text-xs text-[#c8931a] font-semibold">
                    🏛️ {isAmharic ? ann.issuingOffice_am : ann.issuingOffice_en}
                  </p>

                  <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                    {isAmharic ? ann.content_am : ann.content_en}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModal(ann)}
                  className="bg-gray-50 hover:bg-[#0d2340] text-gray-700 hover:text-white border border-gray-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-all shrink-0 cursor-pointer self-start sm:self-center"
                >
                  {isAmharic ? 'ሙሉውን አንብብ ›' : 'Read Full Notice ›'}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Modal Notice Viewer */}
        {activeModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-start justify-between border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-[#1a4f8b] font-bold text-[10px] rounded-full border border-blue-200">
                      {activeModal.category}
                    </span>
                    <span className="text-xs font-mono text-gray-500">#{activeModal.refNumber}</span>
                  </div>
                  <h3 className="text-xl font-black text-[#0d2340] leading-snug">
                    {isAmharic ? activeModal.title_am : activeModal.title_en}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="text-gray-400 hover:text-gray-600 text-lg font-bold cursor-pointer p-1"
                >
                  ✕
                </button>
              </div>

              <div className="text-xs text-gray-500 flex flex-wrap gap-4 py-1 border-b border-gray-100">
                <p>
                  <strong>{isAmharic ? 'አውጪ ቢሮ፡' : 'Issuing Directorate:'}</strong>{' '}
                  {isAmharic ? activeModal.issuingOffice_am : activeModal.issuingOffice_en}
                </p>
                <p>
                  <strong>{isAmharic ? 'ቀን፡' : 'Date Gazetted:'}</strong> {activeModal.date}
                </p>
                {activeModal.deadline && (
                  <p className="text-rose-600 font-bold">
                    <strong>{isAmharic ? 'የማብቂያ ቀን፡' : 'Submission Deadline:'}</strong> {activeModal.deadline}
                  </p>
                )}
              </div>

              <div className="text-xs sm:text-sm text-gray-700 leading-relaxed space-y-3 whitespace-pre-wrap py-2">
                {isAmharic ? activeModal.content_am : activeModal.content_en}
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs text-gray-600 space-y-1">
                <p className="font-bold text-[#0d2340]">{isAmharic ? 'ህጋዊ ማረጋገጫ፡' : 'Verification & Submissions:'}</p>
                <p>
                  {isAmharic
                    ? 'ስለዚህ ማስታወቂያ ተጨማሪ ማብራሪያ ለመጠየቅ ወይም ሰነድ ለማስገባት በስልክ 058 661 0100 ወይም በኢሜይል angolelatera1@gmail.com ያግኙን።'
                    : 'To verify this gazette or submit formal bids, contact the Secretariat at +251 58 661 0100 or email angolelatera1@gmail.com.'}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="bg-[#0d2340] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#1a4f8b] cursor-pointer"
                >
                  {isAmharic ? 'ዝጋ' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
