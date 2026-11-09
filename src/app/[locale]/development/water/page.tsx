import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function WaterAndIrrigationPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const isAm = locale === 'am'

  const contentDict = {
    en: {
      breadcrumbHome: 'Home',
      breadcrumbDev: 'Development',
      breadcrumbCurrent: 'Water & Irrigation Schemes',
      badge: 'Blue Nile Basin • Jemma River Sub-Basin Infrastructure',
      title: 'Water Resources & Irrigation Schemes',
      subtitle:
        'Harnessing Angolela Tera’s abundant highland river systems, natural springs, and groundwater aquifers to ensure food security, year-round farming, and 100% clean drinking water access.',
      metrics: [
        { value: '5.0+ Billion ETB', label: 'Ajima-Chacha Mega Project Investment' },
        { value: '55 Million m³', label: 'Reservoir Storage Capacity' },
        { value: '7,000 Hectares', label: 'Irrigated Farmland Potential' },
        { value: '28,000+ Households', label: 'Direct Farming Beneficiaries' },
        { value: '64 km', label: 'Main & Secondary Pipelines' },
        { value: '88% Coverage', label: 'Woreda Potable Water Supply Goal' },
      ],
      megaProjectTitle: 'The Ajima-Chacha Irrigation Dam Project',
      megaProjectSubtitle:
        'A flagship federal and regional capital infrastructure initiative revolutionizing agriculture across Angolela Tera and the North Shewa Zone.',
      damSpecs: [
        { label: 'Dam Structure', val: 'Earthen / Rockfill Embankment' },
        { label: 'Dam Height', val: '45.5 Meters' },
        { label: 'Crest Length', val: '371 Meters' },
        { label: 'Storage Reservoir', val: '55 Million Cubic Meters' },
        { label: 'Main Pipeline Length', val: '44 Kilometers' },
        { label: 'Secondary Canal Network', val: '20 Kilometers' },
        { label: 'Executing Contractors', val: 'Amhara Water Works & CCECC' },
        { label: 'Primary Beneficiary Crops', val: 'Malt Barley, Wheat, Potatoes, Cabbages, Pulses' },
      ],
      potableTitle: 'Clean Potable Drinking Water & Urban WASH',
      potableDesc:
        'Ensuring resilient access to treated drinking water through motorized deep boreholes, high-capacity elevated reservoirs, and modernized distribution pipelines in Chacha town and adjacent corridors.',
      potablePoints: [
        'Dedicated high-yield deep boreholes serving Chacha municipality',
        'Automated chlorination, filtration, and water-quality testing protocols',
        'Distribution lines connected to schools, health centers, and commercial dairy processing corridors',
        'Continuous leak detection and smart bulk flow metering program',
      ],
      ruralTitle: 'Rural Spring Development & Community Water Points',
      ruralDesc:
        'Protecting high-altitude perennial gravity springs and establishing communal water points (Bono) across all 19 rural kebeles to eliminate waterborne diseases.',
      ruralPoints: [
        'Over 140 protected spring catchments and gravity flow schemes',
        'Establishment of trained Kebele Water User Associations (WUAs) for local maintenance',
        'Implementation of COWASH (Community-Led Accelerated WASH) programs',
        'Solar-powered submersible pumps for high-altitude highland villages',
      ],
      watershedTitle: 'Watershed Conservation & Aquifer Recharge',
      watershedDesc:
        'Biological and physical soil-water conservation on highland slopes to prevent reservoir siltation, mitigate land degradation, and ensure stable water tables.',
      ctaHelpdesk: 'Water Bureau Customer Service',
      ctaReportLeak: 'Report Water Leak / Outage',
      ctaApply: 'Apply for New Water Connection',
      officeDesk: 'Angolela Tera Woreda Water & Energy Office',
      location: 'Administrative Block C, Chacha Town',
      phone: '+251 (0) 58 661 0204',
      email: 'water@angolela-tera.gov.et',
    },
    am: {
      breadcrumbHome: 'ዋና ገጽ',
      breadcrumbDev: 'ልማት',
      breadcrumbCurrent: 'ውሃና መስኖ',
      badge: 'የዓባይ ተፋሰስ • የጀማ ንዑስ ተፋሰስ መሰረተ ልማት',
      title: 'የውሃ ሀብትና የመስኖ ልማት ፕሮጀክቶች',
      subtitle:
        'የአንጎለላ ጠራ ወረዳን የተትረፈረፈ የደጋማ ወንዞች፣ ምንጮች እና የከርሰ-ምድር ውሃ ሀብት ለምግብ ዋስትና፣ ለዓመታዊ መስኖ እርሻ እና ለንጹህ መጠጥ ውሃ አቅርቦት ማዋል፡',
      metrics: [
        { value: '5.0+ ቢሊዮን ብር', label: 'የአጂማ-ጫቻ ሜጋ ፕሮጀክት በጀት' },
        { value: '55 ሚሊዮን ሜ³', label: 'የግድቡ የውሃ ማቆር አቅም' },
        { value: '7,000 ሄክታር', label: 'የሚለማ የመስኖ መሬት ስፋት' },
        { value: '28,000+ አባወራዎች', label: 'ቀጥተኛ ተጠቃሚ አርሶ አደሮች' },
        { value: '64 ኪ.ሜ', label: 'ዋናና ሁለተኛ ደረጃ የመስኖ መስመሮች' },
        { value: '88% ተደራሽነት', label: 'የንጹህ መጠጥ ውሃ ሽፋን ግብ' },
      ],
      megaProjectTitle: 'የአጂማ-ጫቻ የመስኖ ግድብ ፕሮጀክት',
      megaProjectSubtitle:
        'በአንጎለላ ጠራ ወረዳ እና በሰሜን ሸዋ ዞን የግብርና ምርታማነትንና የምግብ ዋስትናን በከፍተኛ ደረጃ የሚያሸጋግር ግዙፍ የፌደራልና የክልል የልማት ፕሮጀክት።',
      damSpecs: [
        { label: 'የግድቡ ዓይነት', val: 'የአፈርና ድንጋይ ሙሌት (Rockfill Embankment)' },
        { label: 'የግድቡ ቁመት', val: '45.5 ሜትር' },
        { label: 'የግድቡ ርዝመት', val: '371 ሜትር' },
        { label: 'የውሃ ማቆር አቅም', val: '55 ሚሊዮን ኪዩቢክ ሜትር' },
        { label: 'የዋና ቧንቧ ርዝመት', val: '44 ኪሎ ሜትር' },
        { label: 'የሁለተኛ ደረጃ ቦይ ርዝመት', val: '20 ኪሎ ሜትር' },
        { label: 'ስራ ተቋራጮች', val: 'የአማራ ውሃ ስራዎች ኮንስትራክሽንና CCECC' },
        { label: 'ዋና ዋና ሰብሎች', val: 'የብቅል ገብስ፣ ስንዴ፣ ድንች፣ ቀይ ሽንኩርት፣ ጎመንና ጥራጥሬ' },
      ],
      potableTitle: 'የንጹህ መጠጥ ውሃና የከተማ ዋሽ (WASH) አገልግሎት',
      potableDesc:
        'በጫቻ ከተማና በአካባቢው የከርሰ-ምድር ጥልቅ ጉድጓዶችን በመቆፈር፣ ታንከሮችን በመገንባትና የቧንቧ መስመሮችን በመዘርጋት አስተማማኝ ንጹህ ውሃ ማዳረስ።',
      potablePoints: [
        'የጫቻ ከተማን የውሃ ፍላጎት የሚያሟሉ ጥልቅ የከርሰ-ምድር ጉድጓዶች',
        'አስተማማኝ የክሎሪን ህክምና፣ የውሃ ማጣሪያና የጥራት ቁጥጥር ስርዓት',
        'ለትምህርት ቤቶች፣ ጤና ተቋማትና የወተት ማቀነባበሪያ ፋብሪካዎች ቀጥታ ትስስር',
        'የውሃ ብክነትን የሚከላከሉ ዘመናዊ ቆጣሪዎችና የፍተሻ ስራዎች',
      ],
      ruralTitle: 'የገጠር ምንጭ ማጎልበትና የማህበረሰብ ውሃ ጣቢያዎች',
      ruralDesc:
        'በ19ኙም የገጠር ቀበሌዎች የሚገኙ የተፈጥሮ ምንጮችን በማጎልበትና የውሃ ቦኖዎችን በመገንባት የአርሶ አደሩን ህይወት ማሻሻል።',
      ruralPoints: [
        'ከ140 በላይ የተጎለበቱ የተፈጥሮ ምንጮችና በስበት የሚሰሩ የውሃ መስመሮች',
        'በየቀበሌው የተቋቋሙና የሰለጠኑ የውሃ ተጠቃሚዎች ኮሚቴዎች (WUAs)',
        'በማህበረሰብ ተሳትፎ የሚመራ የፈጣን ዋሽ ፕሮግራም (COWASH)',
        'ለደጋማ ቀበሌዎች በፀሐይ ብርሃን ሀይል የሚሰሩ የውሃ ፓምፖች',
      ],
      watershedTitle: 'የተፋሰስ ልማትና የአፈርና ውሃ ጥበቃ ስራዎች',
      watershedDesc:
        'ግድቦችና የውሃ ማጠራቀሚያዎች በደለል እንዳይሞሉና የከርሰ-ምድር ውሃ እንዲመገብ በተራራማ አካባቢዎች የተከናወኑ የአፈር እርከንና የተፋሰስ ልማት ስራዎች።',
      ctaHelpdesk: 'የውሃ አገልግሎት ቢሮ',
      ctaReportLeak: 'የውሃ ብክነት ወይም መቋረጥን ያሳውቁ',
      ctaApply: 'አዲስ የውሃ መስመር ለማስገባት ማመልከት',
      officeDesk: 'የአንጎለላ ጠራ ወረዳ ውሃና ኢነርጂ ጽሕፈት ቤት',
      location: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ሐ፣ ጫቻ ከተማ',
      phone: '+251 (0) 58 661 0204',
      email: 'water@angolela-tera.gov.et',
    },
  }
  const content = (contentDict as any)[locale] || contentDict.en

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbHome}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/development`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbDev}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-semibold">{content.breadcrumbCurrent}</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] via-[#1a4f8b] to-[#0d2340] text-white rounded-3xl p-6 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
          {/* Subtle water wave background motif */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-300/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full mb-4">
              <span>💧</span>
              <span>{content.badge}</span>
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {content.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 mt-4 leading-relaxed font-normal">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Key Metrics Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5 mb-12">
          {content.metrics.map((item: any, idx: number) => (
            <div
              key={idx}
              className="bg-white border border-gray-200/90 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="text-lg sm:text-xl font-black text-[#1a4f8b] tracking-tight">
                {item.value}
              </div>
              <div className="text-[11px] sm:text-xs text-gray-600 mt-2 font-medium leading-snug">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* 1. Flagship Mega Project: Ajima-Chacha Irrigation Dam Project */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 mb-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#009A44] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
              🌾 Flagship Agricultural Infrastructure • ዋና የመስኖ ፕሮጀክት
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#0d2340] tracking-tight">
              {content.megaProjectTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              {content.megaProjectSubtitle}
            </p>
          </div>

          {/* Technical Specifications Table Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {content.damSpecs.map((spec: any, idx: number) => (
              <div
                key={idx}
                className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 hover:bg-blue-50/30 transition-colors"
              >
                <span className="text-[10px] font-bold uppercase text-gray-400 tracking-wider block mb-1">
                  {spec.label}
                </span>
                <span className="text-sm font-extrabold text-[#0d2340] block">
                  {spec.val}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 sm:p-5 bg-blue-50/60 border border-blue-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-gray-700">
            <div className="flex items-center gap-3">
              <span className="text-2xl p-2 bg-white rounded-xl shadow-xs">💧</span>
              <div>
                <strong className="text-[#0d2340] block text-sm">
                  {isAm
                    ? 'የዓመቱን ሙሉ የምግብ ዋስትና ማረጋገጥ'
                    : 'Transforming Rain-Fed into Year-Round Commercial Agriculture'}
                </strong>
                <span>
                  {isAm
                    ? 'በክረምትና በበልግ ወቅት ከመደበኛ እርሻ በተጨማሪ በበጋ ወቅት በከፍተኛ ደረጃ የብቅል ገብስ፣ ስንዴና አትክልቶች ይመረታሉ።'
                    : 'Enables triple-harvest cropping cycles supplying malt barley directly to Debre Birhan and Chacha brewery plants.'}
                </span>
              </div>
            </div>
            <Link
              href={`/${locale}/services/agriculture`}
              className="inline-flex items-center gap-1 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 transition-colors shadow-xs"
            >
              <span>{isAm ? 'የግብርና አገልግሎቶችን ይመልከቱ' : 'View Farming Extension Desk'}</span>
              <span>→</span>
            </Link>
          </div>
        </section>

        {/* 2. Dual Column: Potable Water (WASH) & Rural Spring Development */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Potable Drinking Water in Chacha Town */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl p-2.5 bg-blue-50 text-[#1a4f8b] rounded-2xl border border-blue-100">
                  🚰
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#0d2340]">
                    {content.potableTitle}
                  </h3>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    Urban Supply Network
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                {content.potableDesc}
              </p>

              <ul className="space-y-3 text-xs text-gray-700">
                {content.potablePoints.map((point: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-blue-100 text-[#1a4f8b] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Chacha Water Desk</span>
              <span className="font-bold text-[#1a4f8b]">+251 58 661 0204</span>
            </div>
          </div>

          {/* Rural Spring Development & Community Water Points */}
          <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl p-2.5 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                  🏞️
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-black text-[#0d2340]">
                    {content.ruralTitle}
                  </h3>
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    19 Rural Kebeles Program
                  </span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                {content.ruralDesc}
              </p>

              <ul className="space-y-3 text-xs text-gray-700">
                {content.ruralPoints.map((point: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      ✓
                    </span>
                    <span className="leading-relaxed font-medium">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-gray-500 font-medium">Community WASH (COWASH)</span>
              <span className="font-bold text-emerald-700">140+ Protected Springs</span>
            </div>
          </div>
        </div>

        {/* 3. Watershed Conservation & Highland Aquifer Protection */}
        <div className="bg-gradient-to-r from-emerald-900 via-[#0d2340] to-blue-950 text-white rounded-3xl p-6 sm:p-10 mb-12 shadow-md relative overflow-hidden">
          <div className="relative max-w-3xl">
            <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full inline-block mb-3">
              🌱 Environmental Sustainability & Water Security
            </span>
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              {content.watershedTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 mt-3 leading-relaxed">
              {content.watershedDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 text-xs">
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
                <strong className="block text-[#FED100] text-sm mb-1">
                  {isAm ? 'የተፋሰስ ጥበቃ' : 'Contour Bunding'}
                </strong>
                <span className="text-gray-300">
                  {isAm
                    ? 'በደጋማ ተራራዎች ላይ የአፈር መሸርሸርን መግታት'
                    : 'Highland hillside stabilization capturing monsoon runoff'}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
                <strong className="block text-[#FED100] text-sm mb-1">
                  {isAm ? 'ደለል መከላከል' : 'Siltation Defense'}
                </strong>
                <span className="text-gray-300">
                  {isAm
                    ? 'የግድቡ የውሃ ማቆር አቅም ለረጅም ዓመታት እንዲቆይ ማድረግ'
                    : 'Safeguarding Ajima-Chacha dam lifespan through biological buffer zones'}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/15">
                <strong className="block text-[#FED100] text-sm mb-1">
                  {isAm ? 'የደን ልማት' : 'Agroforestry'}
                </strong>
                <span className="text-gray-300">
                  {isAm
                    ? 'በየዓመቱ በሚሊዮን የሚቆጠሩ ችግኞችን መትከልና መንከባከብ'
                    : 'Over 2.5 million indigenous highland seedlings planted annually'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Citizen Contact & Action Desk for Water Services */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider">
                {content.officeDesk}
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0d2340] mt-1">
                {content.ctaHelpdesk}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                📍 {content.location} • 📞 {content.phone} • ✉️ {content.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md"
              >
                <span>⚠️ {content.ctaReportLeak}</span>
              </Link>

              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-3 rounded-xl transition-all"
              >
                <span>📋 {content.ctaApply}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
