'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import DownloadButton from '@/components/resources/DownloadButton'

interface PageProps {
  params: Promise<{ locale: string }>
}

interface ReportItem {
  id: string
  title_en: string
  title_am: string
  fiscalYear: string
  period_en: string
  period_am: string
  refNumber: string
  category: 'ANNUAL' | 'FINANCIAL_AUDIT' | 'CAPITAL_PROJECTS' | 'SECTORAL'
  highlights_en: string[]
  highlights_am: string[]
  budgetExecution: string
  fileSize: string
  date: string
}

export default function AnnualReportsPage({ params }: PageProps) {
  const { locale } = use(params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const [selectedYear, setSelectedYear] = useState('ALL')

  const reports: ReportItem[] = [
    {
      id: 'rep-2025-annual',
      title_en: 'Angolela Tera Woreda Comprehensive Annual Performance & Audit Report (2017 E.C. / 2024–2025)',
      title_am: 'የአንጎለላ ጠራ ወረዳ የ2017 ዓ.ም ዓመታዊ የስራ አፈጻጸምና የኦዲት ሪፖርት',
      fiscalYear: '2024-2025',
      period_en: 'Full Fiscal Year (July 2024 – June 2025)',
      period_am: 'የሙሉ በጀት ዓመት (ከሐምሌ 2016 – ሰኔ 2017)',
      refNumber: 'ATW-REP-2025-01',
      category: 'ANNUAL',
      highlights_en: [
        '96.4% capital development budget execution across 19 rural kebeles',
        'Completion of 28.6 km of rural feeder roads connecting agricultural hinterlands',
        '88.2% potable drinking water coverage achieved through spring development & deep wells',
        'Collection of over 42,000 metric tons of certified highland malt barley',
      ],
      highlights_am: [
        'በ19ኙ የገጠር ቀበሌዎች 96.4% የካፒታል ልማት በጀት አፈጻጸም ተመዝግቧል',
        '28.6 ኪሎ ሜትር የገጠር ተደራሽነት ጠጠር መንገዶች ግንባታ ተጠናቋል',
        'የንጹህ መጠጥ ውሃ ሽፋን በምንጭ ማጎልበትና ጥልቅ ጉድጓዶች 88.2% ደርሷል',
        'ከ42,000 ሜትሪክ ቶን በላይ ጥራት ያለው የደጋ ብቅል ገብስ ለገበያ ቀርቧል',
      ],
      budgetExecution: '96.4%',
      fileSize: '1.4 MB',
      date: '2025-07-28',
    },
    {
      id: 'rep-2025-midterm',
      title_en: 'Mid-Year Capital Projects Progress & Budget Execution Review (2025)',
      title_am: 'የግማሽ ዓመት የካፒታል ፕሮጀክቶች አፈጻጸምና የበጀት ክለሳ ሪፖርት',
      fiscalYear: '2024-2025',
      period_en: 'Semi-Annual (July – December 2024)',
      period_am: 'የስድስት ወራት (ከሐምሌ – ታህሳስ 2017)',
      refNumber: 'ATW-REP-2025-MID',
      category: 'CAPITAL_PROJECTS',
      highlights_en: [
        'Ajima-Chacha dam primary canal civil works reached 64% completion',
        'Expansion of Chacha Primary Hospital outpatient pharmacy and emergency room',
        'Distribution of 14,000 quintals of organic & chemical fertilizer vouchers',
      ],
      highlights_am: [
        'የአጂማ-ጫጫ ግድብ ዋና የመስኖ ካናል ሲቪል ስራዎች 64% ደርሰዋል',
        'የጫጫ የመጀመሪያ ደረጃ ሆስፒታል የተመላላሽ ታካሚዎችና የአደጋ ጊዜ ክፍል ተስፋፍቷል',
        '14,000 ኩንታል ማዳበሪያና ምርጥ ዘር ለአርሶ አደሮች ተሰራጭቷል',
      ],
      budgetExecution: '92.1%',
      fileSize: '890 KB',
      date: '2025-01-20',
    },
    {
      id: 'rep-2024-audit',
      title_en: 'Office of the Regional Auditor General: Woreda Financial Compliance & Audit Clearance',
      title_am: 'የክልሉ ዋና ኦዲተር መ/ቤት የወረዳው የፋይናንስ ህጋዊነትና የኦዲት ግኝት ሪፖርት',
      fiscalYear: '2023-2024',
      period_en: 'Fiscal Year Audit (2023–2024)',
      period_am: 'የ2016 በጀት ዓመት የፋይናንስ ኦዲት',
      refNumber: 'ATW-AUD-2024-AG',
      category: 'FINANCIAL_AUDIT',
      highlights_en: [
        'Unqualified (Clean) Audit Opinion issued by Regional Audit Bureau',
        'Zero material irregularities in municipal procurement and tender evaluations',
        '100% reconciliation of regional subsidy transfers and local revenue receipts',
      ],
      highlights_am: [
        'በክልሉ ዋና ኦዲተር መ/ቤት ንጹህ (ያልተዛባ) የኦዲት አስተያየት ተሰጥቷል',
        'በግዥና በጨረታ አፈጻጸም ላይ ምንም አይነት የጎላ የፋይናንስ ግድፈት አልተገኘም',
        'የክልል ድጎማና የወረዳው የውስጥ ገቢ አሰባሰብ ሙሉ በሙሉ ተጣጥሟል',
      ],
      budgetExecution: '100% Audited',
      fileSize: '2.1 MB',
      date: '2024-10-15',
    },
  ]

  const filtered = reports.filter((r) => {
    return selectedYear === 'ALL' || r.fiscalYear === selectedYear
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
            <span>{isAmharic ? 'ዓመታዊ ሪፖርቶች' : 'Annual Reports'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'ዓመታዊ የስራ አፈጻጸምና የኦዲት ሪፖርቶች'
              : 'Annual Performance, Progress & Audit Reports'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'የአንጎለላ ጠራ ወረዳ አስተዳደር የበጀት አጠቃቀም፣ የመሰረተ ልማት ዝርጋታዎችና የዘርፍ ቢሮዎች ዓመታዊ የስራ አፈጻጸም ግልጽ መረጃ።'
              : 'Public accountability and expenditure transparency reports gazetted by the Woreda Finance Office and Regional Auditor General.'}
          </p>
        </div>

        {/* Year Filter */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs flex items-center justify-between">
          <span className="text-xs font-bold text-gray-700">
            {isAmharic ? 'የበጀት ዓመት ምረጡ፡' : 'Filter by Fiscal Year:'}
          </span>
          <div className="flex gap-2">
            {['ALL', '2024-2025', '2023-2024'].map((yr) => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedYear === yr
                    ? 'bg-[#0d2340] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {yr === 'ALL' ? (isAmharic ? 'ሁሉም ዓመታት' : 'All Fiscal Years') : yr}
              </button>
            ))}
          </div>
        </div>

        {/* Report Cards */}
        <div className="space-y-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-[#1a4f8b] font-bold text-[10px] rounded-full border border-blue-200">
                      {item.category.replace('_', ' ')}
                    </span>
                    <span className="font-mono text-xs font-bold text-gray-500">
                      #{item.refNumber}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#0d2340] leading-snug">
                    {isAmharic ? item.title_am : item.title_en}
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    📅 {isAmharic ? item.period_am : item.period_en} • {isAmharic ? 'የታተመበት፡' : 'Published:'} {item.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
                    📈 {item.budgetExecution}
                  </span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                  {isAmharic ? 'ዋና ዋና የተከናወኑ ተግባራት፡' : 'Key Performance Milestones:'}
                </h3>
                <ul className="space-y-1.5 text-xs text-gray-600">
                  {(isAmharic ? item.highlights_am : item.highlights_en).map((h, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <span className="text-[11px] text-gray-400 font-mono">
                  Official Woreda Gazette Document • {item.fileSize}
                </span>
                <div className="w-full sm:w-60">
                  <DownloadButton
                    title={isAmharic ? item.title_am : item.title_en}
                    label={isAmharic ? 'ሙሉ ሪፖርቱን ያውርዱ' : 'Download Full Report'}
                    refNumber={item.refNumber}
                    category="Annual Performance Audit"
                    contentSnippet={`REPORT TITLE: ${item.title_en}
FISCAL PERIOD: ${item.period_en}
BUDGET EXECUTION RATE: ${item.budgetExecution}
AUDIT LEVEL: Certified by Regional Audit Bureau & Woreda Cabinet

EXECUTIVE SUMMARY OF ACHIEVEMENTS:
${item.highlights_en.map((h, i) => `  ${i + 1}. ${h}`).join('\n')}

CERTIFICATION:
This annual performance and financial report is certified by the Head of Finance 
and the Chief Administrator of Angolela Tera Woreda.`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
