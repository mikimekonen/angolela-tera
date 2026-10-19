import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getInvestments } from '@/lib/dataStore'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function InvestmentPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const dynamicInvestments = getInvestments()

  const content = {
    en: {
      tag: 'Economic Development & Industrial Corridor',
      title: 'Invest in Angolela Tera: The Highland Gateway',
      subtitle: 'Capitalize on unmatched logistical proximity to Addis Ababa and Debre Birhan, rich agricultural basins, and attractive regional investment incentives.',
      sectorsTitle: 'Priority Investment Opportunities',
      sectors: [
        {
          title: 'Agro-Processing & Malt Barley Processing',
          desc: 'With thousands of hectares of certified malt and food barley harvested annually, Angolela Tera is a primary supply basin for national breweries and food manufacturing plants.',
          icon: '🌾',
        },
        {
          title: 'Dairy Farming & Modern Milk Processing',
          desc: 'The temperate highland climate (2,800m) is ideal for crossbred Holstein-Friesian dairy cattle. Chilled collection centers and dairy processing plants are prioritized.',
          icon: '🥛',
        },
        {
          title: 'Cold Storage & Seed Multiplication Warehousing',
          desc: 'High-altitude conditions provide optimal pest-free environments for potato seed multiplication, seed conditioning, and bulk vegetable cold-storage hubs.',
          icon: '🥔',
        },
        {
          title: 'Poultry, Sheep Breeding & Export Meat Processing',
          desc: 'Close highway proximity to Addis Ababa international airport enables high-efficiency meat fattening and cold-chain transport for regional and Middle Eastern export markets.',
          icon: '🥩',
        },
      ],
      landTitle: 'Chacha Industrial Corridor & Serviced Land Bank',
      landDesc: 'Over 120 hectares of pre-zoned, level industrial and commercial plots along the main A2 international highway. Fully integrated with high-voltage electricity lines, telecommunications fiber optics, and dedicated groundwater boreholes.',
      incentivesTitle: 'Key Government Incentives for Investors',
      incentives: [
        'Up to 5 years income tax exemption for manufacturing and agro-processing investments',
        '100% duty-free customs import exemptions for capital machinery, equipment, and spare parts',
        'Expedited 70-year industrial lease terms with competitive base land rental rates',
        'Dedicated One-Stop Investor Desk in Chacha: trade registration and site approvals within 48 hours',
        'Guaranteed raw material backward-linkages with local multipurpose agricultural cooperatives',
      ],
      ctaDesk: 'Contact Investment Desk',
      ctaServices: 'Apply for Commercial Permits',
    },
    am: {
      tag: 'የኢኮኖሚ ልማትና የኢንዱስትሪ ኮሪደር',
      title: 'በአንጎሌላ ተራ ኢንቨስት ያድርጉ፡ የደጋው ቀጠና በር',
      subtitle: 'ከአዲስ አበባና ከደብረ ብርሃን ከተሞች ጋር ባለው የቅርብ ርቀት፣ በለም የግብርና ተፋሰሶችና ምቹ የመንግሥት ማበረታቻዎች ተጠቃሚ ይሁኑ።',
      sectorsTitle: 'ዋና ዋና የኢንቨስትመንት አማራጮች',
      sectors: [
        {
          title: 'አግሮ-ፕሮሰሲንግና የብቅል ገብስ ማቀነባበሪያ',
          desc: 'በየዓመቱ በሺዎች የሚቆጠሩ ሄክታር መሬት በምርጥ የስንዴና የብቅል ገብስ የሚሸፈን በመሆኑ ለፋብሪካዎችና ለቢራ ጠማቂዎች አስተማማኝ የጥሬ እቃ ማዕከል ነው።',
          icon: '🌾',
        },
        {
          title: 'የወተት ልማትና ዘመናዊ የወተት ተዋጽኦ ማቀነባበሪያ',
          desc: 'ደጋማው አየር ንብረት (2,800 ሜትር ከፍታ) ለተሻሻሉ የወተት ላሞች ዝርያ እጅግ ተስማሚ ነው። የወተት ማቀዝቀዣ ማዕከላትና ማቀነባበሪያዎች ከፍተኛ ድጋፍ ይሰጣቸዋል።',
          icon: '🥛',
        },
        {
          title: 'የቀዝቃዛ ማከማቻና የድንች ምርጥ ዘር ማባዛት',
          desc: 'ተስማሚው የደጋ አየር ከበሽታ ነጻ የሆነ ምርጥ የድንች ዘር ለማባዛትና የአትክልትና ፍራፍሬ ማከማቻ መጋዘኖችን ለመገንባት ተመራጭ ነው።',
          icon: '🥔',
        },
        {
          title: 'የዶሮ፣ የበግ እርባታና የኤክስፖርት ስጋ ማቀነባበሪያ',
          desc: 'ከአዲስ አበባ ቦሌ አውሮፕላን ማረፊያ በ110 ኪ.ሜ ርቀት ላይ መገኘቱ ስጋን በጥራት አቀነባብሮ ለውጭ ገበያ ለማቅረብ አመቺ ያደርገዋል።',
          icon: '🥩',
        },
      ],
      landTitle: 'የጫቻ የኢንዱስትሪ ኮሪደርና የመሬት ባንክ',
      landDesc: 'በአዲስ አበባ-ደሴ ዋና አስፋልት መንገድ ዳርቻ 120 ሄክታር የተዘጋጀ የኢንዱስትሪና የንግድ መሬት ተዘጋጅቷል። የመብራት ሀይል፣ የቴሌኮም ፋይበር መስመርና አስተማማኝ የከርሰ ምድር ውሃ የተሟላለት ነው።',
      incentivesTitle: 'ለመንግሥት አልሚዎች የሚሰጡ ዋና ዋና ማበረታቻዎች',
      incentives: [
        'ለማኑፋክቸሪንግና አግሮ-ፕሮሰሲንግ አልሚዎች እስከ 5 ዓመት ከገቢ ግብር ነጻ መሆን',
        'ለካፒታል እቃዎች፣ ማሽነሪዎችና መለዋወጫዎች 100% ከቀረጥ ነጻ ማስገባት',
        'እስከ 70 ዓመት የሚቆይ የኢንዱስትሪ ሊዝ ውል በተመጣጣኝ ዋጋ',
        'በጫቻ ከተማ በአንድ መስኮት በ48 ሰዓታት ውስጥ የኢንቨስትመንት ፈቃድ ማጠናቀቅ',
        'ከአካባቢው የገበሬ ህብረት ስራ ማህበራት ጋር አስተማማኝ የጥሬ እቃ አቅርቦት ትስስር ዋስትና',
      ],
      ctaDesk: 'የኢንቨስትመንት ዴስኩን ያነጋግሩ',
      ctaServices: 'የንግድ ፈቃድ ያመልክቱ',
    },
    om: {
      tag: 'Misooma Diinagdee fi Industirii',
      title: 'Angolallaa Xaraatti Invast Godhaa',
      subtitle: 'Dhiheenya Finfinnee fi Dabra Birhaan, qabeenya qonnaa fi carraawwan invastimantii gurguddoo.',
      sectorsTitle: 'Carraawwan Invastimantii Ijoo',
      sectors: [
        { title: 'Industirii Qonnaa fi Qamadii', desc: 'Oomisha qamadii fi garbuu qindeessuuf mijataadha.', icon: '🌾' },
        { title: 'Misooma Aannanii', desc: 'Qilleensa baddaa keessatti loowwan aannanii horsiisuuf gaariidha.', icon: '🥛' },
        { title: 'Misooma Dinnichaa', desc: 'Sanyii dinnichaa baay\'isuu fi kuusaa qabbaneessaa ijaaruuf.', icon: '🥔' },
        { title: 'Horsiisa Hoolotaa fi Lukkuu', desc: 'Gabaa biyya alaa fi Finfinneetiif oomishuuf.', icon: '🥩' },
      ],
      landTitle: 'Lafa Industirii Magaalaa Caaccetti',
      landDesc: 'Lafni hektaara 120 ta\'u daandii guddaa Finfinnee-Dabra Birhaan irratti qophaa\'eera.',
      incentivesTitle: 'Kanneen Mootummaan Kennu',
      incentives: [
        'Gibira irraa bilisa ta\'uu waggaa 5 hanga',
        'Meeshaalee industirii kaffaltii gumruukaa malee galchuu',
        'Waliigaltee liizii waggaa 70',
        'Tajaajila gamoo tokkoo sa\'aatii 48 keessatti',
      ],
      ctaDesk: 'Kutaa Invastimantii Qunnamaa',
      ctaServices: 'Hayaama Daldalaa Galchaa',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] via-[#1a4f8b] to-[#0d2340] text-white rounded-2xl p-6 sm:p-10 mb-10 shadow-lg">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              {content.tag}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-tight">
              {content.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 mt-3 leading-relaxed">
              {content.subtitle}
            </p>
            <div className="mt-6 flex flex-wrap gap-4">
              <Link
                href={`/${locale}/contact`}
                className="bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] font-bold text-xs sm:text-sm px-5 py-2.5 rounded-lg shadow-md transition-all"
              >
                {content.ctaDesk}
              </Link>
              <Link
                href={`/${locale}/services/business-license`}
                className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-lg transition-all"
              >
                {content.ctaServices}
              </Link>
            </div>
          </div>
        </div>

        {/* Live Registered Investment Opportunities */}
        {dynamicInvestments.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div>
                <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  Active Woreda Land Allocations
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d2340] mt-2">
                  {locale === 'am' ? 'ይፋ የተደረጉ የኢንቨስትመንት አማራጮች' : 'Available Commercial Land Parcels & Projects'}
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
                {dynamicInvestments.length} Active Offers
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dynamicInvestments.map((inv) => {
                const title = locale === 'am' ? inv.title_am || inv.title_en : inv.title_en
                const summary = locale === 'am' ? inv.summary_am || inv.summary_en : inv.summary_en
                const incentives = locale === 'am' ? inv.incentives_am || inv.incentives_en : inv.incentives_en

                return (
                  <div
                    key={inv.slug}
                    className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-[#1a4f8b] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 uppercase">
                          {inv.sector}
                        </span>
                        {inv.availableLandHa && (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            {inv.availableLandHa} Ha Allocated
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-[#0d2340] mb-2">
                        {title}
                      </h3>

                      <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                        {summary}
                      </p>

                      {incentives && (
                        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 mb-4">
                          <strong className="block text-[10px] uppercase tracking-wider text-amber-800">
                            {locale === 'am' ? 'የመንግስት ማበረታቻዎች' : 'Incentives & Tax Relief'}:
                          </strong>
                          {incentives}
                        </div>
                      )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-mono">
                        {inv.contactPhone || '+251 58 661 0180'}
                      </span>
                      <Link
                        href={`/${locale}/contact`}
                        className="text-xs font-bold text-[#1a4f8b] hover:underline"
                      >
                        {locale === 'am' ? 'ማመልከቻ አስገባ →' : 'Inquire & Apply →'}
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Priority Sectors */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d2340] mb-6">
            {content.sectorsTitle}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {content.sectors.map((sec, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:shadow-md transition-shadow group"
              >
                <span className="text-3xl p-3 bg-blue-50 rounded-xl inline-block mb-3 group-hover:bg-blue-100 transition-colors">
                  {sec.icon}
                </span>
                <h3 className="text-base font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors">
                  {sec.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
                  {sec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Industrial Corridor Land Bank */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 mb-12 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              Industrial Land Bank
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0d2340] mt-3">
              {content.landTitle}
            </h2>
            <p className="text-sm text-gray-700 mt-2 leading-relaxed">
              {content.landDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xl font-extrabold text-[#1a4f8b]">120+ Ha</span>
              <p className="text-xs text-gray-600 mt-1 font-medium">Demarcated Industrial Corridor</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xl font-extrabold text-[#1a4f8b]">48 Hours</span>
              <p className="text-xs text-gray-600 mt-1 font-medium">One-Stop Licensing Desk</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <span className="text-xl font-extrabold text-[#1a4f8b]">70 Years</span>
              <p className="text-xs text-gray-600 mt-1 font-medium">Long-Term Investment Lease</p>
            </div>
          </div>
        </div>

        {/* Government Incentives Checklist */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <h2 className="text-xl font-extrabold text-[#0d2340] mb-4">
            {content.incentivesTitle}
          </h2>
          <ul className="space-y-3">
            {content.incentives.map((inc, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-gray-700">
                <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  ✓
                </span>
                <span className="leading-relaxed">{inc}</span>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-end text-xs">
            <Link
              href={`/${locale}/contact`}
              className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white font-bold px-6 py-3 rounded-lg shadow-xs transition-colors shrink-0"
            >
              {content.ctaDesk} →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
