import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import DownloadButton from '@/components/resources/DownloadButton'
import { getDocuments } from '@/lib/dataStore'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const isAm = locale === 'am'
  const isOm = locale === 'om'

  const liveDocs = getDocuments().filter((d: any) => d.status === 'PUBLISHED' || !d.status)

  const content = {
    en: {
      tag: 'Public Documents & Legal Repository',
      title: 'Resources, Forms & Legal Directives',
      subtitle: 'Official archive of printable application forms, local council proclamations, annual financial audit summaries, and operational guidelines for citizens and businesses.',
      downloadBtn: 'Download Document',
    },
    am: {
      tag: 'የመንግሥት ሰነዶችና የህግ ማዕቀፎች ማህደር',
      title: 'ሰነዶች፣ ቅጾችና ህጋዊ መመሪያዎች',
      subtitle: 'የህዝብ አገልግሎት ማመልከቻ ቅጾች፣ የወረዳ ምክር ቤት አዋጆች፣ ዓመታዊ የፋይናንስ ኦዲት ሪፖርቶችና ለነዋሪዎችና ለንግድ ማህበረሰቡ የተዘጋጁ ይፋዊ ሰነዶች።',
      downloadBtn: 'ሰነዱን ያውርዱ',
    },
    om: {
      tag: 'Sanadoota Mootummaa',
      title: 'Qabeenya, Foormiiwwan fi Qajeelfamoota',
      subtitle: 'Foormiiwwan tajaajilaa, qajeelfamoota seeraa fi gabaasaalee aanaa keenyaa.',
      downloadBtn: 'Sanada Buufadhaa',
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

        {/* Dynamic Documents Grid from dataStore */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {liveDocs.map((doc: any) => {
            const title = isAm ? (doc.title_am || doc.title_en) : isOm ? (doc.title_om || doc.title_en) : doc.title_en
            const desc = isAm ? (doc.description_am || doc.description_en) : isOm ? (doc.description_om || doc.description_en) : doc.description_en

            return (
              <div
                key={doc.id}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-[#1a4f8b] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {doc.category}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">
                      {doc.fileSize || 'PDF'}
                    </span>
                  </div>

                  <h2 className="text-base font-bold text-[#0d2340] leading-snug">
                    {title}
                  </h2>

                  <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-500 font-medium">
                    {doc.officeName || 'Woreda Desk'}
                  </span>
                  <div className="w-44">
                    <DownloadButton
                      title={title}
                      label={content.downloadBtn}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
