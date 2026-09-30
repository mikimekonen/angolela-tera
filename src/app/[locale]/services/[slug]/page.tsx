import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { CITIZEN_SERVICES, SECTOR_OFFICES } from '@/data/mockData'

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    for (const service of CITIZEN_SERVICES) {
      params.push({ locale, slug: service.slug })
    }
  }
  return params
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const service = CITIZEN_SERVICES.find((s) => s.slug === slug)
  if (!service) notFound()

  const linkedOffice = SECTOR_OFFICES.find((o) => o.slug === service.officeSlug)

  const title = service[`title_${locale as Locale}`] || service.title_en
  const category = service[`category_${locale as Locale}`] || service.category_en
  const officeName = service[`officeName_${locale as Locale}`] || service.officeName_en
  const time = service[`processingTime_${locale as Locale}`] || service.processingTime_en
  const cost = service[`cost_${locale as Locale}`] || service.cost_en
  const desc = service[`description_${locale as Locale}`] || service.description_en
  const requirements = service[`requirements_${locale as Locale}`] || service.requirements_en
  const steps = service[`steps_${locale as Locale}`] || service.steps_en

  const content = {
    en: {
      breadcrumbHome: 'Home',
      breadcrumbServices: 'Services',
      requirementsTitle: 'Prerequisites & Required Supporting Documents',
      stepsTitle: 'Step-by-Step Procedure Guide',
      summaryTitle: 'Service Parameters at a Glance',
      timeLabel: 'Turnaround Time',
      costLabel: 'Statutory Fee',
      officeLabel: 'Service Bureau Desk',
      locationLabel: 'Headquarters Location',
      locationDefault: 'Chacha Administrative Compound, North Shewa Zone',
      downloadForm: 'Download Standard Application Form (PDF)',
      viewBureau: 'View Bureau Profile & Contact',
      appealTitle: 'Questions or Appeals?',
      appealDesc: 'If you face unjustified delays or documentation issues, file a petition with the Woreda Grievance Desk.',
      fileGrievance: 'Submit Service Petition',
    },
    am: {
      breadcrumbHome: 'ዋና ገጽ',
      breadcrumbServices: 'አገልግሎቶች',
      requirementsTitle: 'ቅድመ ሁኔታዎችና የሚያስፈልጉ ሰነዶች',
      stepsTitle: 'የአገልግሎት አሰጣጥ ቅደም ተከተል (መመሪያ)',
      summaryTitle: 'የአገልግሎቱ አጭር መረጃ',
      timeLabel: 'የሚፈጀው ጊዜ',
      costLabel: 'ህጋዊ ክፍያ',
      officeLabel: 'አገልግሎት ሰጪው ቢሮ / መስኮት',
      locationLabel: 'የቢሮው አድራሻ',
      locationDefault: 'የጫቻ አስተዳደር ቅጥር ጊቢ፣ ሰሜን ሸዋ ዞን',
      downloadForm: 'የአገልግሎት ማመልከቻ ቅጽ ያውርዱ (PDF)',
      viewBureau: 'የቢሮውን ሙሉ መረጃ ይመልከቱ',
      appealTitle: 'ቅሬታ ወይም ይግባኝ አለዎት?',
      appealDesc: 'ያልተገባ መዘግየት ወይም የአገልግሎት አሰጣጥ ችግር ካጋጠመዎት ለወረዳው የቅሬታ ሰሚ ያመልክቱ።',
      fileGrievance: 'አቤቱታ ያቅርቡ',
    },
    om: {
      breadcrumbHome: 'Fuula Duraa',
      breadcrumbServices: 'Tajaajiloota',
      requirementsTitle: 'Ulaagaalee fi Ragaalee Barbaachisan',
      stepsTitle: 'Tarkaanfiiwwan Tajaajila Argachuu',
      summaryTitle: 'Odeeffannoo Gabaabaa',
      timeLabel: 'Yeroo Fudhatu',
      costLabel: 'Kaffaltii Seeraa',
      officeLabel: 'Waajjira Kennu',
      locationLabel: 'Teessoo',
      locationDefault: 'Gamooma Bulchiinsa Caaccetti',
      downloadForm: 'Foormii Iyyannoo Buufadhaa (PDF)',
      viewBureau: 'Odeeffannoo Waajjiraa Ilaali',
      appealTitle: 'Komiin qabduu?',
      appealDesc: 'Yoo tajaajilli harkifate kutaa komii aanaatti iyyachuu dandeessu.',
      fileGrievance: 'Iyyannoo Dhiheessaa',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbHome}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/services`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbServices}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-semibold truncate max-w-[200px] sm:max-w-none">
            {title}
          </span>
        </nav>

        {/* Hero Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs font-bold text-[#1a4f8b] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase tracking-wider">
                {category}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
                ⏱️ {time}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-2">
              {title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-3 leading-relaxed">
              {desc}
            </p>
          </div>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content: Steps and Requirements (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Steps Procedure Guide */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#0d2340] border-b border-gray-100 pb-3 mb-6">
                {content.stepsTitle}
              </h2>

              <div className="space-y-4">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                    <span className="h-7 w-7 rounded-full bg-[#1a4f8b] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-gray-800 leading-relaxed font-medium">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Requirements */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
              <h2 className="text-lg font-bold text-[#0d2340] border-b border-gray-100 pb-3 mb-6">
                {content.requirementsTitle}
              </h2>

              <ul className="space-y-3">
                {requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                    <span className="h-5 w-5 rounded-md bg-amber-50 text-[#c8931a] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 border border-amber-200">
                      📄
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0d2340] border-b border-gray-100 pb-3">
                {content.summaryTitle}
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {content.timeLabel}
                  </span>
                  <span className="text-emerald-700 font-bold text-sm block mt-0.5">
                    {time}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {content.costLabel}
                  </span>
                  <span className="text-gray-900 font-medium block mt-0.5">
                    {cost}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {content.officeLabel}
                  </span>
                  <span className="text-gray-900 font-semibold block mt-0.5">
                    {officeName}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    {content.locationLabel}
                  </span>
                  <span className="text-gray-600 block mt-0.5">
                    {linkedOffice ? (linkedOffice[`location_${locale as Locale}`] || linkedOffice.location_en) : content.locationDefault}
                  </span>
                </div>
              </div>

              {linkedOffice && (
                <div className="pt-3 border-t border-gray-100">
                  <Link
                    href={`/${locale}/offices/${linkedOffice.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] hover:text-[#c8931a] transition-colors"
                  >
                    <span>{content.viewBureau}</span>
                    <span>→</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Citizen Grievance Assistance Card */}
            <div className="bg-gradient-to-br from-[#0d2340] to-[#1a4f8b] text-white rounded-xl p-6 shadow-xs space-y-3">
              <h3 className="font-bold text-sm text-[#FED100]">
                {content.appealTitle}
              </h3>
              <p className="text-xs text-gray-200 leading-relaxed">
                {content.appealDesc}
              </p>
              <div className="pt-2">
                <Link
                  href={`/${locale}/contact`}
                  className="w-full text-center block bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] text-xs font-bold py-2.5 rounded-lg shadow-sm transition-colors"
                >
                  {content.fileGrievance}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
