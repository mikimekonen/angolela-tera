import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { getOffices, getOfficeBySlug, getServices } from '@/lib/dataStore'
import {
  Landmark,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowRight,
  FileText,
  UserCheck,
  CheckCircle2,
} from 'lucide-react'

export function generateStaticParams() {
  const offices = getOffices()
  const params: { locale: string; slug: string }[] = []

  for (const locale of locales) {
    for (const office of offices) {
      if (office.slug) {
        params.push({ locale, slug: office.slug })
      }
    }
  }

  return params
}

export default async function OfficeDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const isAm = locale === 'am'
  const office = getOfficeBySlug(slug) as any
  if (!office) notFound()

  const allServices = getServices()
  const linkedServices = allServices.filter(
    (s: any) => s.officeSlug === office.slug || s.officeId === office.id || s.officeId === office.slug
  )

  const name = isAm ? (office.name_am || office.name_en) : office.name_en
  const head = isAm ? (office.head_am || office.head_en) : office.head_en
  const headTitle = isAm ? (office.headTitle_am || office.headTitle_en) : office.headTitle_en
  const location = isAm ? (office.location_am || office.location_en) : office.location_en
  const about = isAm ? (office.about_am || office.about_en) : office.about_en
  const responsibilities: string[] = isAm
    ? (office.responsibilities_am || office.responsibilities_en || [])
    : (office.responsibilities_en || [])

  const content = {
    tag: isAm ? 'ይፋዊ ሴክተር መሥሪያ ቤት' : 'Official Sector Directorate',
    mandateTitle: isAm ? 'ተልዕኮ እና ኃላፊነቶች' : 'Statutory Mandate & Responsibilities',
    headProfileTitle: isAm ? 'የመሥሪያ ቤቱ አመራር' : 'Executive Leadership',
    locationTitle: isAm ? 'የቢሮ አድራሻ እና የስራ ሰዓት' : 'Office Location & Working Hours',
    hoursVal: isAm ? 'ከሰኞ - አርብ፡ 2:30 - 11:30 (የምሳ እረፍት 6:30 - 7:30)' : 'Monday – Friday: 8:30 AM – 5:30 PM (Lunch break: 12:30 – 1:30 PM)',
    servicesTitle: isAm ? 'በዚህ መሥሪያ ቤት የሚሰጡ ይፋዊ አገልግሎቶች' : 'Citizen Services Provided by this Directorate',
    servicesDesc: isAm
      ? 'የአገልግሎት መስፈርቶች፣ የሚፈጀው ጊዜና ቅጾች ለማግኘት አገልግሎቱን ይምረጡ፡'
      : 'Select a service below to review prerequisite documentation, turnaround timelines, fees, and application forms:',
    noServices: isAm ? 'በአሁኑ ሰዓት የተዘረዘሩ አዳዲስ አገልግሎቶች የሉም።' : 'No specialized citizen services cataloged for this bureau at present.',
    viewServiceGuide: isAm ? 'የአገልግሎት መመሪያ ይመልከቱ' : 'Read Service Guidelines',
    grievanceTitle: isAm ? 'በዚህ መሥሪያ ቤት ላይ ቅሬታ ወይም ጥያቄ አለዎት?' : 'Inquiries or Service Appeals with this Directorate?',
    grievanceDesc: isAm
      ? 'ያልተገባ መዘግየት፣ የተጭበረበረ ሰነድ ወይም የአገልግሎት አሰጣጥ ጉድለት ካጋጠመዎት ለወረዳው የቅሬታ ሰሚ ኮሚቴ ይፋዊ አቤቱታዎን ያቅርቡ።'
      : 'If you encounter administrative delays, procedural grievances, or require formal clarification, submit an official petition to the Woreda Grievance Desk.',
    filePetition: isAm ? 'አቤቱታ ያቅርቡ' : 'Submit Official Petition',
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
          <Link href={`/${locale}/offices`} className="hover:text-[#1a4f8b] transition-colors">
            {isAm ? 'ሴክተር መሥሪያ ቤቶች' : 'Offices'}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-bold truncate max-w-xs">{name}</span>
        </nav>

        {/* Hero Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="max-w-4xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              <Landmark className="w-3.5 h-3.5" />
              <span>{content.tag}</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {name}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              {about}
            </p>
          </div>
        </div>

        {/* Grid Layout: Main Mandate + Sidebar Contact/Head */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Statutory Mandates */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#0d2340] flex items-center gap-2 mb-4">
                <ShieldCheck className="w-5 h-5 text-[#1a4f8b]" />
                <span>{content.mandateTitle}</span>
              </h2>

              {responsibilities && responsibilities.length > 0 ? (
                <ul className="space-y-3">
                  {responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700 leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">
                  {isAm ? 'ይፋዊ የኃላፊነት ዝርዝር በመዘጋጀት ላይ ነው።' : 'Statutory mandates documented under Regional Civil Service Gazette.'}
                </p>
              )}
            </div>

            {/* Linked Services */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#0d2340] flex items-center gap-2 mb-2">
                <FileText className="w-5 h-5 text-[#1a4f8b]" />
                <span>{content.servicesTitle}</span>
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                {content.servicesDesc}
              </p>

              {linkedServices.length > 0 ? (
                <div className="space-y-4">
                  {linkedServices.map((srv: any) => {
                    const srvTitle = isAm ? (srv.title_am || srv.title_en) : srv.title_en
                    const srvDesc = isAm ? (srv.description_am || srv.description_en) : srv.description_en
                    const srvTime = isAm ? (srv.processingTime_am || srv.processingTime_en) : srv.processingTime_en
                    const srvCost = isAm ? (srv.cost_am || srv.cost_en) : srv.cost_en

                    return (
                      <div
                        key={srv.slug}
                        className="p-5 border border-gray-200 rounded-xl hover:border-[#1a4f8b] transition-all bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="max-w-xl">
                          <h3 className="text-sm font-bold text-[#0d2340]">
                            <Link href={`/${locale}/services/${srv.slug}`} className="hover:text-[#1a4f8b] transition-colors">
                              {srvTitle}
                            </Link>
                          </h3>
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {srvDesc}
                          </p>
                          <div className="mt-2.5 flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                            <span className="bg-emerald-50 text-emerald-800 font-semibold px-2 py-0.5 rounded border border-emerald-200">
                              ⏱️ {srvTime || (isAm ? '1-3 ቀናት' : '1-3 days')}
                            </span>
                            <span className="bg-blue-50 text-blue-800 font-semibold px-2 py-0.5 rounded border border-blue-200">
                              💳 {srvCost || (isAm ? 'ነጻ / ህጋዊ ተመን' : 'Statutory Fee')}
                            </span>
                          </div>
                        </div>

                        <Link
                          href={`/${locale}/services/${srv.slug}`}
                          className="inline-flex items-center gap-1 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shrink-0"
                        >
                          <span>{content.viewServiceGuide}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl">
                  <p className="text-xs text-gray-500">{content.noServices}</p>
                  <Link
                    href={`/${locale}/services`}
                    className="mt-3 inline-block text-xs font-bold text-[#1a4f8b] hover:underline"
                  >
                    {isAm ? 'ሁሉንም የወረዳውን አገልግሎቶች ይመልከቱ →' : 'Browse All Woreda Services →'}
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Leadership Box */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-[#1a4f8b]" />
                <span>{content.headProfileTitle}</span>
              </h3>
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl">
                <p className="text-sm font-bold text-[#0d2340]">
                  {head || (isAm ? 'ይፋዊ ኃላፊ' : 'Director')}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {headTitle || (isAm ? 'የመሥሪያ ቤቱ ኃላፊ' : 'Head of Directorate')}
                </p>
              </div>
            </div>

            {/* Coordinates & Operating Hours */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
                {content.locationTitle}
              </h3>

              <div className="flex items-start gap-3 text-xs text-gray-700">
                <MapPin className="w-4 h-4 text-[#1a4f8b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-gray-900">{isAm ? 'አድራሻ' : 'Location'}</span>
                  <span>{location || (isAm ? 'የጫጫ አስተዳደር ቅጥር ጊቢ' : 'Chacha Administrative Compound')}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-gray-700">
                <Clock className="w-4 h-4 text-[#1a4f8b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-gray-900">{isAm ? 'የሥራ ሰዓት' : 'Office Hours'}</span>
                  <span>{content.hoursVal}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-gray-700">
                <Phone className="w-4 h-4 text-[#1a4f8b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-gray-900">{isAm ? 'ስልክ' : 'Telephone'}</span>
                  <span>{office.phone || '+251 (0) 58 661 0100'}</span>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs text-gray-700">
                <Mail className="w-4 h-4 text-[#1a4f8b] mt-0.5 shrink-0" />
                <div>
                  <span className="font-semibold block text-gray-900">{isAm ? 'ኢሜይል' : 'Email'}</span>
                  <span className="truncate block">{office.email || 'angolelatera1@gmail.com'}</span>
                </div>
              </div>
            </div>

            {/* Citizen Grievance Assistance Box */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-6 shadow-xs">
              <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
                {content.grievanceTitle}
              </h4>
              <p className="text-xs text-amber-950/80 leading-relaxed">
                {content.grievanceDesc}
              </p>
              <Link
                href={`/${locale}/contact`}
                className="mt-4 w-full text-center inline-flex items-center justify-center gap-1.5 bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
              >
                <span>{content.filePetition}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
