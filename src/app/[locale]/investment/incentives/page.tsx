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
      ? 'የኢንቨስትመንት ማበረታቻዎችና ጥቅማጥቅሞች | አንጎለላ ጠራ'
      : 'Government Investment Incentives & Guarantees | Angolela Tera Woreda',
    description: isAmharic
      ? 'በአንጎለላ ጠራ ወረዳ ለሚሰማሩ ባለሀብቶች የተዘጋጁ የግብር፣ የጉምሩክና የመሬት ማበረታቻዎች።'
      : 'Comprehensive statutory tax holidays, customs duty-free exemptions, and preferential lease incentives in Angolela Tera.',
  }
}

export default async function InvestmentIncentivesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const incentivePackages = [
    {
      title_en: 'Income Tax Holiday Exemptions',
      title_am: 'የገቢ ግብር ነፃ ማበረታቻ',
      duration_en: '2 to 6 Years Exemption',
      duration_am: 'ከ2 እስከ 6 ዓመት ከግብር ነጻ',
      icon: '💼',
      desc_en:
        'New investments in agro-processing, dairy transformation, animal feed manufacturing, and export-oriented processing qualify for income tax exemptions ranging from 2 to 6 years depending on value addition depth and export volumes.',
      desc_am:
        'በአግሮ ፕሮሰሲንግ፣ በወተት ማቀነባበሪያ፣ በእንስሳት መኖና ለውጭ ገበያ በሚቀርቡ ምርቶች ላይ ለሚሰማሩ አዳዲስ ባለሀብቶች እንደ ምርቱ ዓይነት ከ2 እስከ 6 ዓመት የሚደርስ የትርፍ ግብር ነፃ ማበረታቻ ይሰጣል።',
      eligibility_en: 'Minimum 50% local agricultural raw material sourcing or 60%+ export commitment.',
      eligibility_am: 'ቢያንስ 50% የወረዳውን የግብርና ጥሬ ዕቃ መጠቀም ወይም 60% ምርቱን ለውጭ ገበያ ማቅረብ።',
    },
    {
      title_en: '100% Duty-Free Customs Privileges',
      title_am: 'የቀረጥና ታክስ ነፃ የማሽነሪ ማስገቢያ ፈቃድ',
      duration_en: 'Full Capital Goods Exemption',
      duration_am: 'ሙሉ የቀረጥ ነፃ መብት',
      icon: '🚢',
      desc_en:
        'Approved investors are entitled to import 100% duty-free capital equipment, processing machinery, factory spare parts (up to 15% of capital goods value), and commercial delivery trucks needed for industrial operations.',
      desc_am:
        'ፈቃድ ያላቸው ባለሀብቶች ለፋብሪካቸው የሚያስፈልጉ ማሽነሪዎችን፣ የላቦራቶሪ እቃዎችን፣ መለዋወጫዎችን (እስከ 15%) እና የኢንዱስትሪ አገልግሎት ሰጪ ተሽከርካሪዎችን ከቀረጥና ታክስ ነጻ የማስገባት መብት አላቸው።',
      eligibility_en: 'Certified investment permit issued by Ethiopian Investment Commission / Regional Bureau.',
      eligibility_am: 'በኢትዮጵያ ኢንቨስትመንት ኮሚሽን ወይም በክልሉ ኢንቨስትመንት ቢሮ የተረጋገጠ ፈቃድ።',
    },
    {
      title_en: 'Preferential Long-Term Land Lease Terms',
      title_am: 'ተመጣጣኝና የረጅም ጊዜ የኢንዱስትሪ ሊዝ',
      duration_en: 'Up to 70 Years Industrial Lease',
      duration_am: 'እስከ 70 ዓመት የሊዝ ዘመን',
      icon: '📜',
      desc_en:
        'Land allocation for manufacturing in the Chacha Industrial Corridor carries favorable statutory base lease rates, with deferred grace periods during project construction and guaranteed contractual renewal rights.',
      desc_am:
        'በጫጫ ኢንዱስትሪ ኮሪደር የሚሰጡ ይዞታዎች በክልሉ መንግስት የተወሰነ ዝቅተኛ የሊዝ መነሻ ዋጋ ያላቸው ሲሆን በግንባታ ወቅት የክፍያ እፎይታ ጊዜ (Grace Period) ይሰጣቸዋል።',
      eligibility_en: 'Submission of bank guarantee and approved factory engineering drawings.',
      eligibility_am: 'የባንክ ማረጋገጫ እና በከተማ ልማት የጸደቀ የግንባታ ፕላን ማቅረብ።',
    },
    {
      title_en: 'Guaranteed Cooperative Supply Linkages',
      title_am: 'የጥሬ ዕቃ አቅርቦት ትስስር ዋስትና',
      duration_en: 'Institutional Backward Linkages',
      duration_am: 'ቀጥተኛ የህብረት ስራ ማህበራት ትስስር',
      icon: '🤝',
      desc_en:
        'The Woreda Agriculture and Cooperatives Office directly links processors with local farmer unions, guaranteeing direct farm-gate procurement of malt barley, wheat, high-grade milk, and highland livestock without middleman price spikes.',
      desc_am:
        'የወረዳው ግብርናና ህብረት ስራ ማህበራት ጽ/ቤት ፋብሪካዎችን ከአርሶ አደሩና ከህብረት ስራ ዩኒየኖች ጋር በቀጥታ በማስተሳሰር የገብስ፣ የወተትና የከብት አቅርቦት ያለ ደላላ ጣልቃ ገብነት እንዲያገኙ ያረጋግጣል።',
      eligibility_en: 'Contract farming or tripartite memorandum of understanding with local woreda cooperatives.',
      eligibility_am: 'ከወረዳው ህብረት ስራ ማህበራት ጋር የውል ስምምነት መፈረም።',
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
            <span>{isAmharic ? 'ማበረታቻዎች' : 'Incentives & Guarantees'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'የኢንቨስትመንት ማበረታቻዎችና የመንግስት ዋስትናዎች'
              : 'Official Investment Incentives & Guarantees'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'በአንጎለላ ጠራ ወረዳ ለሚሰማሩ ባለሀብቶች የተዘጋጁ የፌዴራልና የክልል የግብር፣ የቀረጥና የአስተዳደራዊ ማበረታቻ ጥቅሎች።'
              : 'Maximize capital ROI with statutory tax holidays, zero-tariff machinery imports, long-term land tenures, and direct agricultural supply chain guarantees.'}
          </p>
        </div>

        {/* Incentives Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {incentivePackages.map((pkg, i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-gray-50 rounded-xl border border-gray-100">{pkg.icon}</span>
                    <div>
                      <h2 className="text-lg font-bold text-[#0d2340] leading-snug">
                        {isAmharic ? pkg.title_am : pkg.title_en}
                      </h2>
                      <span className="inline-block px-2.5 py-0.5 mt-1 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-full border border-amber-200">
                        {isAmharic ? pkg.duration_am : pkg.duration_en}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed mb-4">
                  {isAmharic ? pkg.desc_am : pkg.desc_en}
                </p>

                <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100 text-xs">
                  <span className="font-bold text-gray-800">{isAmharic ? 'የብቃት መስፈርት፡' : 'Eligibility Baseline:'} </span>
                  <span className="text-gray-600">{isAmharic ? pkg.eligibility_am : pkg.eligibility_en}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Required Documents Checklist */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-[#0d2340]">
            {isAmharic ? 'የማበረታቻዎች ማመልከቻ አስፈላጊ ሰነዶች' : 'Required Application Documentation Checklist'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {[
              {
                en: '1. Validated Investment Permit or Memorandum of Association',
                am: '1. የኢንቨስትመንት ፈቃድ ወይም የመመስረቻ ጽሁፍ',
              },
              {
                en: '2. Comprehensive Technical & Economic Feasibility Study',
                am: '2. የተሟላ የፕሮጀክት ቴክኒካልና ኢኮኖሚያዊ አዋጭነት ጥናት',
              },
              {
                en: '3. Bank Statement confirming capital adequacy (Minimum 30% equity)',
                am: '3. የካፒታል አቅምን የሚያረጋግጥ የባንክ መግለጫ (ቢያንስ 30% የራስ ድርሻ)',
              },
              {
                en: '4. Environmental & Social Impact Assessment (ESIA) commitment',
                am: '4. የአካባቢና ማህበራዊ ተፅዕኖ ግምገማ (ESIA) ማረጋገጫ',
              },
              {
                en: '5. Detailed machinery import list with HS codes (for customs duty-free)',
                am: '5. ለቀረጥ ነፃ ማስገቢያ የሚቀርብ የማሽነሪዎች ዝርዝርና የHS ኮድ',
              },
              {
                en: '6. Taxpayer Identification Number (TIN) & commercial registration',
                am: '6. የታክስ ከፋይ መለያ ቁጥር (TIN) እና የንግድ ምዝገባ ሰርተፊኬት',
              },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-emerald-500 font-bold">✓</span>
                <span className="text-gray-700 font-medium">{isAmharic ? item.am : item.en}</span>
              </div>
            ))}
          </div>

          <div className="bg-[#0d2340] text-white p-6 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-bold text-sm">
                {isAmharic ? 'የማበረታቻ ፈቃድ ለማግኘት እገዛ ይፈልጋሉ?' : 'Ready to Expedite Your Incentive Clearance?'}
              </p>
              <p className="text-xs text-gray-300 mt-0.5">
                {isAmharic
                  ? 'የአንድ ማዕከል አገልግሎታችን በ48 ሰዓት ውስጥ የማጣራት ስራ ያከናውናል።'
                  : 'Our One-Stop Desk officers provide end-to-end guidance through regional authorities.'}
              </p>
            </div>
            <Link
              href={`/${locale}/investment/one-stop-desk`}
              className="bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] font-black text-xs px-5 py-2.5 rounded-xl shrink-0 transition-colors"
            >
              {isAmharic ? 'የአንድ ማዕከል ዴስክን ያግኙ' : 'Access One-Stop Desk'}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
