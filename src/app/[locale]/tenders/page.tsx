import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getTenders } from '@/lib/dataStore'
import { toEthiopian, formatEthiopianDate } from '@/lib/ethiopianCalendar'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function TendersPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const tenders = getTenders()

  const t = {
    en: {
      tag: 'Public Procurement & Commercial Transparency',
      title: 'Official Government Bids & Tenders',
      subtitle: 'Open procurement tenders, infrastructure contracting invitations, and supply opportunities published by the Angolela Tera Woreda Administration.',
      bidNumber: 'Bid Reference No.',
      procuringEntity: 'Procuring Entity',
      bondSecurity: 'Bid Security (CPO)',
      docPrice: 'Document Fee',
      deadline: 'Submission Deadline',
      status: 'Status',
      activeBids: 'Active Procurement Notices',
      empty: 'No active tender bids currently open.',
      downloadDocs: 'Download Tender Specifications',
      contactDesk: 'Procurement Desk Inquiries',
    },
    am: {
      tag: 'የመንግስት ግዥና የንግድ ግልጽነት',
      title: 'ይፋዊ የመንግሥት ጨረታዎችና ግዥዎች',
      subtitle: 'በአንጎሌላ ተራ ወረዳ አስተዳደር የወጡ የግልጽ ጨረታ ማስታወቂያዎች፣ የመሠረተ ልማት ኮንትራቶች እና የዕቃ አቅርቦት ጥሪዎች።',
      bidNumber: 'የጨረታ ቁጥር',
      procuringEntity: 'ግዥ ፈጻሚ መ/ቤት',
      bondSecurity: 'የጨረታ ማስከበሪያ (CPO)',
      docPrice: 'የሰነድ መግዣ ዋጋ',
      deadline: 'የመጫረቻ ማብቂያ ቀን',
      status: 'የጨረታው ሁኔታ',
      activeBids: 'ክፍት የጨረታ ማስታወቂያዎች',
      empty: 'በአሁኑ ሰዓት ክፍት የሆነ የጨረታ ጥሪ የለም።',
      downloadDocs: 'የጨረታ ሰነድ አውርድ',
      contactDesk: 'የግዥና ንብረት አስተዳደር ዴስክ',
    },
    om: {
      tag: 'Caalbaasii Mootummaa',
      title: 'Beeksisa Caalbaasii Mootummaa',
      subtitle: 'Caalbaasiiwwan ifaa fi bittaa mootummaa Aanaa Angolallaa Xaraa.',
      bidNumber: 'Lakk. Caalbaasii',
      procuringEntity: 'Waajjira Raawwatu',
      bondSecurity: 'Wabii Caalbaasii (CPO)',
      docPrice: 'Gatii Sanadaa',
      deadline: 'Guyyaa Cufiinsaa',
      status: 'Sadarkaa',
      activeBids: 'Caalbaasiiwwan Banamaa',
      empty: 'Caalbaasiin banamaan hin jiru.',
      downloadDocs: 'Sanada Buufadhaa',
      contactDesk: 'Kutaa Bittaa',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] via-[#1a4f8b] to-[#0d2340] text-white rounded-2xl p-6 sm:p-10 mb-10 shadow-lg">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              {t.tag}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-tight">
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 mt-3 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Tenders List */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0d2340]">
              {t.activeBids}
            </h2>
            <span className="text-xs font-bold text-[#1a4f8b] bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {tenders.length} Records
            </span>
          </div>

          {tenders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-sm text-gray-500">
              {t.empty}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {tenders.map((tender) => {
                const title = locale === 'am' ? tender.title_am || tender.title_en : tender.title_en
                const closeDate = new Date(tender.closingDate)
                const etCloseDate = formatEthiopianDate(toEthiopian(closeDate), locale as 'en' | 'am' | 'om')
                const isUrgent = closeDate.getTime() - Date.now() < 5 * 86400000

                return (
                  <div
                    key={tender.id}
                    className="bg-white border-2 border-gray-200 hover:border-[#1a4f8b] rounded-2xl p-6 sm:p-8 shadow-xs transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-extrabold text-[#1a4f8b] bg-blue-50 px-3 py-1 rounded-lg border border-blue-200">
                            {tender.bidNumber}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              tender.tenderStatus === 'ACTIVE'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : 'bg-gray-100 text-gray-600 border-gray-200'
                            }`}
                          >
                            {tender.tenderStatus}
                          </span>
                        </div>

                        {/* Dual Date Display (GC & EC) */}
                        <div className="text-right">
                          <span className="text-[11px] font-bold text-rose-700 block">
                            ⏳ {t.deadline}: {closeDate.toLocaleDateString()}
                          </span>
                          <span className="text-[10px] font-semibold text-gray-500 block">
                            ({etCloseDate})
                          </span>
                        </div>
                      </div>

                      <h3 className="text-lg sm:text-xl font-bold text-[#0d2340] mb-2">
                        {title}
                      </h3>

                      <div className="text-xs text-gray-600 mb-4">
                        🏛️ {t.procuringEntity}: <strong className="text-gray-800">{tender.procuringEntity}</strong>
                      </div>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                        {tender.description_en || 'Public bidding in accordance with Federal and Regional procurement regulations.'}
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs mb-6">
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">
                            {t.bondSecurity}
                          </span>
                          <strong className="text-[#0d2340] text-sm font-mono">
                            {tender.bidBondAmount || 'Conditional'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">
                            {t.docPrice}
                          </span>
                          <strong className="text-[#0d2340] text-sm">
                            {tender.documentPrice || 'Non-refundable'}
                          </strong>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[10px] uppercase font-bold">
                            Urgency / Window
                          </span>
                          <span className={`text-xs font-bold ${isUrgent ? 'text-rose-600' : 'text-emerald-700'}`}>
                            {isUrgent ? 'Closing Soon' : 'Standard 15-Day Window'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-xs text-gray-500">
                        Official Procurement Desk: <strong className="text-[#1a4f8b] font-mono">+251 58 661 0100</strong>
                      </span>
                      <div className="flex items-center gap-3 w-full sm:w-auto">
                        <Link
                          href={`/${locale}/contact`}
                          className="flex-1 sm:flex-none text-center px-4 py-2 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg transition-colors"
                        >
                          {t.contactDesk}
                        </Link>
                        <a
                          href={tender.documentUrl || '#'}
                          className="flex-1 sm:flex-none text-center px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
                        >
                          📄 {t.downloadDocs}
                        </a>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
