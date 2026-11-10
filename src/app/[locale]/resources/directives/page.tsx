'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import DownloadButton from '@/components/resources/DownloadButton'

interface PageProps {
  params: Promise<{ locale: string }>
}

interface DirectiveItem {
  id: string
  title_en: string
  title_am: string
  refNumber: string
  type: 'PROCLAMATION' | 'REGULATION' | 'DIRECTIVE' | 'GUIDELINE'
  issuingOffice_en: string
  issuingOffice_am: string
  gazetteDate: string
  effectiveDate: string
  summary_en: string
  summary_am: string
  fileSize: string
}

export default function DirectivesPage({ params }: PageProps) {
  const { locale } = use(params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')

  const directives: DirectiveItem[] = [
    {
      id: 'dir-01',
      title_en: 'Rural Land Holding Administration & Cadastral Registration Directive',
      title_am: 'የገጠር መሬት ይዞታ አስተዳደርና የካዳስተር ምዝገባ መመሪያ',
      refNumber: 'DIR-ATW-LND-02/2025',
      type: 'DIRECTIVE',
      issuingOffice_en: 'Rural Land Administration & Use Office',
      issuingOffice_am: 'የገጠር መሬት አስተዳደርና አጠቃቀም ጽ/ቤት',
      gazetteDate: '2025-04-12',
      effectiveDate: '2025-05-01',
      summary_en:
        'Enacts standardized survey protocols, boundary resolution arbitration procedures, and certificate issuance guidelines for rural agricultural land holdings across all 19 rural kebeles.',
      summary_am:
        'በ19ኙ የገጠር ቀበሌዎች የሚገኙ የገጠር መሬት ይዞታዎችን ለመመዝገብ፣ የወሰን አለመግባባቶችን በሽምግልና ለመፍታትና የይዞታ ማረጋገጫ ደብተር ለመስጠት የወጣ ዝርዝር የአሰራር መመሪያ።',
      fileSize: '340 KB',
    },
    {
      id: 'dir-02',
      title_en: 'Municipal Business Licensing & Trade Standards Regulation',
      title_am: 'የንግድ ስራ ፈቃድና የከተማ ንግድ ደረጃዎች ደንብ',
      refNumber: 'REG-ATW-TRD-05/2025',
      type: 'REGULATION',
      issuingOffice_en: 'Trade & Market Development Office',
      issuingOffice_am: 'የንግድና ገበያ ልማት ጽ/ቤት',
      gazetteDate: '2025-08-20',
      effectiveDate: '2025-09-01',
      summary_en:
        'Defines commercial inspection criteria, sanitary requirements for food and beverage establishments, and annual trade license renewal schedules in Chacha town and rural commercial nodes.',
      summary_am:
        'በጫጫ ከተማና በወረዳው የገጠር ማዕከላት የሚገኙ የንግድ ድርጅቶች የጥራት ደረጃ፣ የምግብና መጠጥ ንፅህና ቁጥጥር እና የንግድ ፈቃድ እድሳት ስርዓትን የሚደነግግ ደንብ።',
      fileSize: '410 KB',
    },
    {
      id: 'dir-03',
      title_en: 'Chacha River Corridor Environmental Protection & Buffer Zone Directive',
      title_am: 'የጫጫ ወንዝ ኮሪደር የአካባቢ ጥበቃና የወሰን ክልል መመሪያ',
      refNumber: 'DIR-ATW-ENV-01/2026',
      type: 'DIRECTIVE',
      issuingOffice_en: 'Environmental Protection Desk & Executive Council',
      issuingOffice_am: 'የአካባቢ ጥበቃ ዴስክና ስራ አስፈጻሚ ምክር ቤት',
      gazetteDate: '2026-02-15',
      effectiveDate: '2026-03-01',
      summary_en:
        'Mandates a strict 100-meter protected buffer zone on both banks of the Chacha River prohibiting untreated industrial effluent discharge, unsustainable gravel quarrying, and unauthorized civil construction.',
      summary_am:
        'በጫጫ ወንዝ በሁለቱም አቅጣጫ 100 ሜትር የተከለለ ክልል እንዲጠበቅ፣ የፋብሪካ ቆሻሻ ፍሳሽ እንዳይለቀቅ እና ህገ-ወጥ የድንጋይና አሸዋ ማውጣት እንዲቆም የሚያስገድድ የአካባቢ ጥበቃ መመሪያ።',
      fileSize: '290 KB',
    },
    {
      id: 'dir-04',
      title_en: 'Citizen Grievance Redressal and Administrative Review Proclamation Guidelines',
      title_am: 'የዜጎች አቤቱታ አቀራረብና አስተዳደራዊ ፍትህ አሰጣጥ መመሪያ',
      refNumber: 'GUI-ATW-ADM-08/2024',
      type: 'GUIDELINE',
      issuingOffice_en: 'Woreda Grievance Desk & Justice Bureau',
      issuingOffice_am: 'የወረዳው አቤቱታ ሰሚና የፍትህ ጽ/ቤት',
      gazetteDate: '2024-11-10',
      effectiveDate: '2024-12-01',
      summary_en:
        'Guarantees citizens statutory rights to formal petition registration, sets mandatory 15-day official investigation timelines, and establishes hierarchical appeal pathways from kebele to woreda cabinet.',
      summary_am:
        'ዜጎች የሚያቀርቧቸው አቤቱታዎች በ15 ቀናት ውስጥ ተመርምረው ውሳኔ እንዲያገኙ የሚያስገድድና ከቀበሌ እስከ ወረዳ ካቢኔ ድረስ ያለውን የይግባኝ ቅደም ተከተል የሚያስቀምጥ የአሰራር መመሪያ።',
      fileSize: '315 KB',
    },
    {
      id: 'dir-05',
      title_en: 'Smallholder Irrigation Water Users Association (WUA) Operational Bylaws',
      title_am: 'የአነስተኛ መስኖ ተጠቃሚዎች የውሃ ማህበራት የአሰራር ደንብ',
      refNumber: 'REG-ATW-WTR-03/2025',
      type: 'REGULATION',
      issuingOffice_en: 'Water, Irrigation & Energy Office',
      issuingOffice_am: 'የውሃ፣ መስኖና ኢነርጂ ጽ/ቤት',
      gazetteDate: '2025-06-18',
      effectiveDate: '2025-07-01',
      summary_en:
        'Establishes cooperative governance frameworks, maintenance fee assessments, and fair rotational water distribution schedules for irrigation command areas downstream of the Ajima-Chacha scheme.',
      summary_am:
        'ከአጂማ-ጫጫ መስኖ ፕሮጀክት በታች የሚገኙ አርሶ አደሮች ውሃን በፍትሃዊ ተራ እንዲጠቀሙ፣ የካናሎችን ጥገና እንዲያካሂዱና ማህበራትን እንዲመሩ የሚያስችል ደንብ።',
      fileSize: '380 KB',
    },
  ]

  const types = [
    { key: 'ALL', label_en: 'All Enactments', label_am: 'ሁሉም ህጎችና መመሪያዎች' },
    { key: 'DIRECTIVE', label_en: 'Directives', label_am: 'መመሪያዎች' },
    { key: 'REGULATION', label_en: 'Regulations', label_am: 'ደንቦች' },
    { key: 'GUIDELINE', label_en: 'Guidelines', label_am: 'የአሰራር ማኑዋሎች' },
  ]

  const filtered = directives.filter((d) => {
    const matchesType = typeFilter === 'ALL' || d.type === typeFilter
    const q = search.toLowerCase()
    const matchesSearch =
      d.title_en.toLowerCase().includes(q) ||
      d.title_am.includes(q) ||
      d.refNumber.toLowerCase().includes(q) ||
      d.summary_en.toLowerCase().includes(q) ||
      d.summary_am.includes(q)
    return matchesType && matchesSearch
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
            <Link href={`/${locale}/resources`} className="hover:underline">
              {isAmharic ? 'ሰነዶች' : 'Resources'}
            </Link>
            <span>›</span>
            <span>{isAmharic ? 'ህጎችና መመሪያዎች' : 'Directives & Regulations'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'ይፋዊ መመሪያዎች፣ ደንቦችና አዋጆች'
              : 'Official Directives, Regulations & Bylaws'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'በአንጎለላ ጠራ ወረዳ ምክር ቤትና ካቢኔ የጸደቁ የህግ ማዕቀፎች፣ የመሬት አስተዳደር መመሪያዎች፣ የንግድ ደረጃዎችና አስተዳደራዊ ደንቦች።'
              : 'Authoritative archive of woreda council enactments, land governance directives, municipal standards, and environmental bylaws.'}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isAmharic
                  ? 'በመመሪያ ርዕስ፣ በማጣቀሻ ቁጥር ወይም በይዘት ይፈልጉ...'
                  : 'Search directives by title, reference code, or subject...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {types.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTypeFilter(t.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  typeFilter === t.key
                    ? 'bg-[#0d2340] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isAmharic ? t.label_am : t.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Directives List */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
              {isAmharic ? 'ምንም ሰነድ አልተገኘም።' : 'No directives matched your query.'}
            </div>
          ) : (
            filtered.map((d) => (
              <div
                key={d.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col md:flex-row md:items-start justify-between gap-6"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-[#1a4f8b] font-bold text-[10px] rounded-full border border-blue-200">
                      {d.type}
                    </span>
                    <span className="font-mono text-xs font-bold text-gray-500">
                      #{d.refNumber}
                    </span>
                    <span className="text-xs text-gray-400">
                      • {isAmharic ? 'የጸደቀበት፡' : 'Gazetted:'} {d.gazetteDate}
                    </span>
                    <span className="text-xs text-gray-400">
                      • {isAmharic ? 'ተፈጻሚ የሆነበት፡' : 'Effective:'} {d.effectiveDate}
                    </span>
                  </div>

                  <h2 className="text-lg font-bold text-[#0d2340] leading-snug">
                    {isAmharic ? d.title_am : d.title_en}
                  </h2>

                  <p className="text-xs text-[#c8931a] font-semibold">
                    🏛️ {isAmharic ? d.issuingOffice_am : d.issuingOffice_en}
                  </p>

                  <p className="text-xs text-gray-600 leading-relaxed">
                    {isAmharic ? d.summary_am : d.summary_en}
                  </p>
                </div>

                <div className="w-full md:w-56 shrink-0 flex flex-col justify-between items-end gap-2 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  <span className="text-[11px] text-gray-400 font-mono self-start md:self-end">
                    Format: Official Plaintext Text/PDF • {d.fileSize}
                  </span>
                  <div className="w-full">
                    <DownloadButton
                      title={isAmharic ? d.title_am : d.title_en}
                      label={isAmharic ? 'መመሪያውን ያውርዱ' : 'Download Directive'}
                      refNumber={d.refNumber}
                      category="Official Legal Enactment"
                      contentSnippet={`OFFICIAL STATUTORY SUMMARY:
${d.summary_en}

ISSUING DIRECTORATE: ${d.issuingOffice_en}
GAZETTED: ${d.gazetteDate} | EFFECTIVE: ${d.effectiveDate}
COMPLIANCE JURISDICTION: All Kebeles within Angolela Tera Woreda Administration.`}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
