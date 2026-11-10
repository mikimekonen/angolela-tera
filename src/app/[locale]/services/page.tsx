import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getServices } from '@/lib/dataStore'
import { ServicesDirectory } from '@/components/services/ServicesDirectory'
import { Landmark, ArrowRight, ShieldCheck } from 'lucide-react'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const isAm = locale === 'am'
  const services = getServices()

  const content = {
    tag: isAm ? 'የህዝብ አገልግሎት አሰጣጥ' : 'Public Service Delivery',
    title: isAm ? 'የዜጎችና የንግድ አገልግሎቶች ማውጫ' : 'Citizen & Commercial Services Directory',
    subtitle: isAm
      ? 'በአንጎለላ ጠራ ወረዳ የሚሰጡ ህጋዊ አገልግሎቶች፣ ቅድመ ሁኔታዎች፣ የሚፈጀው ጊዜ፣ የአገልግሎት ክፍያዎች እና የማመልከቻ ቅጾች።'
      : 'Complete guidelines, requirements, turnaround timelines, statutory fees, and downloadable official forms for public services provided in Angolela Tera Woreda.',
    needHelp: isAm ? 'ቅሬታ ወይም ተጨማሪ ጥያቄ አለዎት?' : 'Have Questions or Service Grievances?',
    helpDesc: isAm
      ? 'በጫጫ ከተማ የሚገኘው የወረዳው የዜጎች ቅሬታ ሰሚ ዴስክ የአገልግሎት መዘግየት፣ የመብት ጥሰት እና ይግባኞችን በህጉ መሰረት ይመረምራል።'
      : 'Our Citizen Grievance Redress Office in Chacha handles administrative delays, document appeals, and procedural hearings under the Citizen Charter.',
    contactHelp: isAm ? 'የወረዳውን የቅሬታ ሰሚ ያነጋግሩ' : 'Visit Citizen Help Desk',
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {isAm ? 'መነሻ' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-bold">{isAm ? 'አገልግሎቶች' : 'Services'}</span>
        </nav>

        {/* Hero Header Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              <Landmark className="w-3.5 h-3.5" />
              <span>{content.tag}</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Interactive Services Directory Component */}
        <ServicesDirectory initialServices={services} locale={locale as Locale} />

        {/* Help Banner */}
        <div className="mt-14 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
          <div className="max-w-2xl">
            <h3 className="font-bold text-sm sm:text-base text-[#0d2340]">
              {content.needHelp}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 leading-relaxed">
              {content.helpDesc}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href={`/${locale}/contact`}
              className="inline-flex items-center gap-2 bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <span>{content.contactHelp}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
