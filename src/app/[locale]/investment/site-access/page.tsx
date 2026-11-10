import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'am' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAmharic = locale === 'am'
  return {
    title: isAmharic
      ? 'የኢንቨስትመንት መሰረተ ልማትና የመንገድ ተደራሽነት | አንጎለላ ጠራ'
      : 'Site Access & Industrial Infrastructure | Angolela Tera Woreda',
    description: isAmharic
      ? 'የአንጎለላ ጠራ ወረዳ የመንገድ፣ የመብራት፣ የውሃና የቴሌኮም መሰረተ ልማት ዝግጁነት መረጃ።'
      : 'Comprehensive connectivity, heavy-duty electrical grid, water networks and digital infrastructure serving investors in Angolela Tera.',
  }
}

export default async function SiteAccessPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const infrastructureSectors = [
    {
      title_en: 'Strategic Highway & Logistics Corridors',
      title_am: 'የአውራ ጎዳና እና ሎጂስቲክስ ትስስር',
      icon: '🛣️',
      headline_en: 'Direct Access on the Federal A2 Arterial Corridor',
      headline_am: 'በፌዴራል A2 ዋና አውራ ጎዳና ላይ ያለ ቀጥተኛ ተደራሽነት',
      desc_en:
        'Angolela Tera is strategically traversed by the federal A2 asphalt highway connecting Addis Ababa with Debre Berhan, Dessie, and the northern industrial nodes. The woreda capital, Chacha, is located just 110 km northeast of Addis Ababa (under 2 hours travel time), drastically lowering freight haulage and cold-chain transportation expenses.',
      desc_am:
        'አንጎለላ ጠራ ወረዳ አዲስ አበባን ከደብረ ብርሃን፣ ደሴና ከሰሜኑ የኢኮኖሚ ኮሪደር ጋር በሚያገናኘው የፌዴራል A2 የአስፋልት አውራ ጎዳና ላይ ይገኛል። የወረዳው ዋና ከተማ ጫጫ ከአዲስ አበባ 110 ኪሜ ርቀት ላይ በመሆኗ የጭነትና የትራንስፖርት ወጪን በእጅጉ ይቀንሳል።',
      highlights: [
        isAmharic ? 'ከአዲስ አበባ ዓለም አቀፍ አውሮፕላን ማረፊያ በ110 ኪሜ ብቻ የተራራቀ' : 'Only 110 km to Addis Ababa Bole International Airport',
        isAmharic ? 'ከደብረ ብርሃን የኢንዱስትሪ ማዕከል በ20 ኪሜ ርቀት' : '20 km to Debre Berhan industrial cluster and university',
        isAmharic ? 'የገጠር ቀበሌዎችን የሚያገናኙ የጠጠርና የኮንክሪት መንገዶች' : 'Engineered all-weather feeder roads connecting agricultural hinterlands',
      ],
    },
    {
      title_en: 'High-Voltage Electrical Grid & Reliability',
      title_am: 'የከፍተኛ ቮልቴጅ ኤሌክትሪክ ሃይል አቅርቦት',
      icon: '⚡',
      headline_en: 'Dedicated 132kV / 33kV Substation Integration',
      headline_am: 'ከ132/33 ኪሎ ቮልት የሃይል ማከፋፈያ ጋር የተገናኘ',
      desc_en:
        'The Chacha industrial corridor is directly supplied by the national grid through high-capacity 33kV and 132kV transmission feeders. Manufacturing plants and agro-processors benefit from dedicated industrial transformers, rapid feeder connections, and competitive industrial electricity tariffs regulated by the Ethiopian Energy Authority.',
      desc_am:
        'የጫጫ ኢንዱስትሪ ኮሪደር ከብሔራዊ የኤሌክትሪክ መስመር በከፍተኛ የ33 ኪሎ ቮልት እና 132 ኪሎ ቮልት ማስተላለፊያ መስመሮች በቀጥታ ይገናኛል። ለፋብሪካዎችና ለአግሮ ፕሮሰሲንግ ተቋማት ፈጣን የትራንስፎርመር ተከላና ተመጣጣኝ የኢንዱስትሪ የታሪፍ ማበረታቻ ይሰጣል።',
      highlights: [
        isAmharic ? 'የወሰነ የኢንዱስትሪ ሃይል መስመር (Dedicated Feeders)' : 'Dedicated industrial feeders minimizing production downtime',
        isAmharic ? 'በኢትዮጵያ ኤሌክትሪክ ሃይል የሚተዳደር የጫጫ ማከፋፈያ ጣቢያ' : 'Continuous monitoring by Ethiopian Electric Power utility substation',
        isAmharic ? 'ለከፍተኛ ማሽነሪዎች የ3-ፌዝ ኤሌክትሪክ ፈጣን ፍቃድ' : 'Fast-tracked 3-phase industrial power supply permits',
      ],
    },
    {
      title_en: 'Potable & Industrial Bulk Water Infrastructure',
      title_am: 'የመጠጥና የኢንዱስትሪ የውሃ አቅርቦት',
      icon: '💧',
      headline_en: 'The Ajima-Chacha Mega Reservoir & Abundant Aquifers',
      headline_am: 'የአጂማ-ጫጫ ግድብ ፕሮጀክትና የተትረፈረፈ የከርሰ-ምድር ውሃ',
      desc_en:
        'Water availability is a paramount competitive edge for Angolela Tera. The landmark Ajima-Chacha dam and reservoir project, together with perennial river flows and shallow high-yield aquifers, guarantees uninterrupted industrial, washing, and steam processing water for malt houses, breweries, and food factories.',
      desc_am:
        'የውሃ አቅርቦት ለአንጎለላ ጠራ ወረዳ ትልቅ የተፈጥሮ ጸጋ ነው። ታላቁ የአጂማ-ጫጫ ግድብ እና የውሃ ማጠራቀሚያ ፕሮጀክት፣ ከዘላቂ የጫጫ ወንዝ ፍሰትና ጥልቅ የከርሰ-ምድር ውሃ ጋር ተዳምሮ ለማልት ፋብሪካዎች፣ ለወተት ማቀነባበሪያና ለኢንዱስትሪዎች ያልተቆራረጠ ውሃ ያቀርባል።',
      highlights: [
        isAmharic ? 'የአጂማ-ጫጫ ግድብ ግዙፍ የውሃ ክምችት' : 'Ajima-Chacha Dam multi-million cubic meter reservoir capacity',
        isAmharic ? 'ከፍተኛ የከርሰ-ምድር ውሃ ምርታማነት (ከ50-80 ሜትር ጥልቀት)' : 'High-yield shallow groundwater table accessible at 50–80m',
        isAmharic ? 'ለማኑፋክቸሪንግ የተዘጋጁ የውሃ ማስተላለፊያ ቱቦዎች' : 'Integrated municipal bulk utility pipeline for industrial parks',
      ],
    },
    {
      title_en: 'Telecommunications & High-Speed Optical Fiber',
      title_am: 'የቴሌኮሙዩኒኬሽንና የኦፕቲካል ፋይበር ኔትወርክ',
      icon: '📡',
      headline_en: 'Ethio Telecom 4G/LTE & Dedicated Enterprise Fiber',
      headline_am: 'የኢትዮ ቴሌኮም 4G/LTE እና የኢንተርፕራይዝ ብሮድባንድ ፋይበር',
      desc_en:
        'Ethio Telecom operates multi-gigabit underground optical fiber trunk cables directly alongside the A2 corridor through Chacha town. Industrial investors enjoy broadband leased-lines, robust 4G LTE mobile data coverage, and enterprise VPN connectivity essential for modern ERP systems, supply-chain monitoring, and automated manufacturing.',
      desc_am:
        'ኢትዮ ቴሌኮም በA2 አውራ ጎዳና በኩል ከፍተኛ ፍጥነት ያለው የከርሰ-ምድር ኦፕቲካል ፋይበር ያሰመረ ሲሆን ሙሉ የ4G LTE የሞባይል ዳታ ሽፋን አለው። ፋብሪካዎች የኢንተርፕራይዝ ብሮድባንድና ቀጥታ የሊዝ መስመር በቀላሉ ማግኘት ይችላሉ።',
      highlights: [
        isAmharic ? 'ከፍተኛ ፍጥነት ያለው ቋሚ የፋይበር ኢንተርኔት መስመር' : 'High-bandwidth enterprise dedicated leased line access',
        isAmharic ? 'በወረዳው ማዕከላትና ኢንዱስትሪ ዞኖች ሙሉ የ4G ሽፋን' : 'Comprehensive 4G LTE wireless network coverage',
        isAmharic ? 'የዲጂታል ክፍያ (ቴሌብር / Telebirr) እና የባንክ ትስስር' : 'Integrated digital payment and National Switch banking infrastructure',
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb & Hero */}
        <div className="bg-[#0d2340] text-white p-8 sm:p-10 rounded-2xl border-b-4 border-[#c8931a] shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#fed100] mb-3 uppercase tracking-wider font-semibold">
            <Link href={`/${locale}`} className="hover:underline">
              {isAmharic ? 'ዋና ገጽ' : 'Home'}
            </Link>
            <span>›</span>
            <Link href={`/${locale}/investment`} className="hover:underline">
              {isAmharic ? 'ኢንቨስትመንት' : 'Investment'}
            </Link>
            <span>›</span>
            <span>{isAmharic ? 'መሰረተ ልማት' : 'Site Access & Infrastructure'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'የኢንዱስትሪ መሰረተ ልማትና የመንገድ ትስስር'
              : 'Site Access & Industrial Infrastructure'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'አንጎለላ ጠራ ወረዳ አዲስ አበባን ከሰሜኑ ኢኮኖሚ ጋር በሚያገናኘው ስትራቴጂካዊ ኮሪደር ላይ በመገኘቱ፣ በኤሌክትሪክ፣ በውሃ፣ በመንገድና በቴሌኮም ሙሉ በሙሉ የተደራጀ ነው።'
              : 'Unbeatable logistics on the federal A2 highway, energized with high-capacity electrical grids, abundant water reservoirs, and carrier-grade fiber optics.'}
          </p>
        </div>

        {/* Infrastructure Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {infrastructureSectors.map((sector, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl p-2.5 bg-gray-50 rounded-xl border border-gray-100">{sector.icon}</span>
                  <div>
                    <span className="text-[10px] font-bold text-[#c8931a] uppercase tracking-wider">
                      {isAmharic ? 'መሰረተ ልማት' : 'Core Utility'}
                    </span>
                    <h2 className="text-lg font-bold text-[#0d2340] leading-tight">
                      {isAmharic ? sector.title_am : sector.title_en}
                    </h2>
                  </div>
                </div>

                <p className="text-xs font-semibold text-gray-800 mb-2">
                  {isAmharic ? sector.headline_am : sector.headline_en}
                </p>
                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {isAmharic ? sector.desc_am : sector.desc_en}
                </p>

                <div className="border-t border-gray-100 pt-3">
                  <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                    {isAmharic ? 'ዋና ዋና አመልካቾች፡' : 'Key Specifications:'}
                  </p>
                  <ul className="space-y-1.5 text-xs text-gray-600">
                    {sector.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-500 font-bold">✓</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Site Preparation Guidelines */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
          <h2 className="text-xl font-bold text-[#0d2340]">
            {isAmharic ? 'የይዞታ ዝግጁነትና የመሬት አቀማመጥ' : 'Topography, Soil Conditions & Site Readiness'}
          </h2>
          <p className="text-xs text-gray-600 leading-relaxed">
            {isAmharic
              ? 'የጫጫ ኢንዱስትሪ ኮሪደር መሬት የተስተካከለ ሜዳማ አቀማመጥ ያለው በመሆኑ ለፋብሪካ ግንባታ፣ ለመጋዘኖችና ለከባድ ማሽነሪዎች ተከላ ምቹ ነው። ጠንካራ የአፈር መዋቅር ስላለው የግንባታ የመሰረት ስራ ወጪን በእጅጉ ይቀንሳል። በተጨማሪም የወረዳው ማዘጋጃ ቤት ከክልሉ ኮንስትራክሽን ቢሮ ጋር በመተባበር ፈጣን የግንባታ ፈቃድ ይሰጣል።'
              : 'The designated Chacha industrial plots sit on gently sloping highland plateaus with stable basaltic sub-strata, offering superior foundation load-bearing capacity and natural drainage. This significantly reduces site grading and civil engineering costs for industrial warehouses, factory sheds, and silo construction.'}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100 text-xs">
            <Link
              href={`/${locale}/investment/land-bank`}
              className="bg-[#0d2340] hover:bg-[#1a4f8b] text-white font-bold px-4 py-2.5 rounded-xl transition-colors"
            >
              {isAmharic ? 'የመሬት ባንክ ዝርዝር ይመልከቱ ›' : 'View Available Land Bank ›'}
            </Link>
            <Link
              href={`/${locale}/investment/one-stop-desk`}
              className="text-[#1a4f8b] font-bold hover:underline"
            >
              {isAmharic ? 'ከአንድ ማዕከል አገልግሎት ጋር ይገናኙ ›' : 'Contact One-Stop Investor Desk ›'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
