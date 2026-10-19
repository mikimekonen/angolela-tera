import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/i18n/config'
import { LeadershipSlider } from './LeadershipSlider'

interface LeadershipSectionProps {
  locale: Locale
}

export function LeadershipSection({ locale }: LeadershipSectionProps) {
  const content = {
    en: {
      tag: 'Leadership & Executive Governance',
      title: 'Message from the Chief Administrator',
      name: 'Ato Derese Dememe',
      office: 'Chief Administrator • Angolela Tera Woreda',
      quote:
        '“Our administration is deeply committed to building an accountable, responsive, and growth-oriented local government. By overseeing public policies, local security, budget management, and regional development programs across our 19 kebeles, we are laying the groundwork for sustainable peace and shared prosperity.”',
      pillarsTitle: 'Strategic Governance Pillars',
      pillars: [
        {
          title: 'Agricultural Transformation',
          desc: 'Modernizing highland farming, certified wheat and malt barley cluster production, and expanding irrigation schemes.',
          icon: '🌾',
        },
        {
          title: 'Infrastructure & Connectivity',
          desc: 'Connecting every kebele with all-weather roads, expanding rural electricity, and providing clean water access.',
          icon: '🛣️',
        },
        {
          title: 'Transparent Public Service',
          desc: 'Ensuring zero tolerance for maladministration, digitizing citizen records, and honoring public trust.',
          icon: '🏛️',
        },
        {
          title: 'Investment & Job Creation',
          desc: 'Leveraging our strategic position on the Addis Ababa–Dessie corridor to develop agro-industrial processing hubs.',
          icon: '💼',
        },
      ],
      readMore: 'Learn More About Woreda Governance',
    },
    am: {
      tag: 'አመራርና አስፈጻሚ ራዕይ',
      title: 'የዋና አስተዳዳሪው መልዕክት',
      name: 'አቶ ደረሰ ደመመ',
      office: 'የወረዳ ዋና አስተዳዳሪ • አንጎሌላ ተራ ወረዳ',
      quote:
        '“የወረዳችን አስተዳደር ተጠያቂነት ያለው፣ ለህዝብ ጥያቄ ፈጣን ምላሽ የሚሰጥ እና የኢኮኖሚ እድገትን የሚያፋጥን አካባቢያዊ አስተዳደር ለመገንባት በቁርጠኝነት እየሰራ ይገኛል። በወረዳው ውስጥ የልማት ፕሮግራሞችን፣ የበጀት አስተዳደርን፣ የህዝብ ፖሊሲዎችን እና የሰላምና ጸጥታ ስራዎችን በበላይነት በመምራት የህዝባችንን ሁለንተናዊ ተጠቃሚነት እናረጋግጣለን።”',
      pillarsTitle: 'የአስተዳደሩ ዋና ዋና የትኩረት አቅጣጫዎች',
      pillars: [
        {
          title: 'የግብርና ሽግግር',
          desc: 'የደጋማ አካባቢ ግብርናን ማዘመን፣ የስንዴና የገብስ ክላስተር ልማትን ማስፋፋትና የአርሶ አደሩን ገቢ ማሳደግ።',
          icon: '🌾',
        },
        {
          title: 'መሰረተ ልማትና ትስስር',
          desc: 'ሁሉንም ቀበሌዎች በዘመናዊ መንገድ ማስተሳሰር፣ የመብራትና የንጹህ መጠጥ ውሃ ተደራሽነትን ማረጋገጥ።',
          icon: '🛣️',
        },
        {
          title: 'ግልጽና ፍትሃዊ አገልግሎት',
          desc: 'መልካም አስተዳደርን ማስፈን፣ የህዝብ አገልግሎትን በቴክኖሎጂ ማዘመንና የዜጎችን መብት ማስጠበቅ።',
          icon: '🏛️',
        },
        {
          title: 'ኢንቨስትመንትና የስራ እድል',
          desc: 'በአዲስ አበባ-ደሴ ኮሪደር ያለውን መልካም አጋጣሚ በመጠቀም አግሮ-ኢንዱስትሪንና የንግድ ኢንቨስትመንትን ማበረታታት።',
          icon: '💼',
        },
      ],
      readMore: 'ስለ ወረዳው አስተዳደር የበለጠ ይወቁ',
    },
    om: {
      tag: 'Hoggansa fi Ilaalcha',
      title: "Ergaa Bulchaa Ol'aanaa Aanaa",
      name: 'Obbo Darrasaa Dammaqqaa',
      office: "Bulchaa Ol'aanaa • Aanaa Angolallaa Xaraa",
      quote:
        "“Bulchiinsi keenya tajaajila uummataa ifa ta'e kennuuf, nageenya amansiisaa mirkaneessuuf, baajata sirnaan bulchuuf fi misooma gandoolee 19 maraaf cimsee hojjetaa jira.”",
      pillarsTitle: 'Utuboota Misooma Keenyaa',
      pillars: [
        { title: "Ce'umsa Qonnaa", desc: 'Qonna ammayyeessuu, sanyii filatamaa raabsuu fi galii qonnaan bulaa dabaluu.', icon: '🌾' },
        { title: "Bu'uuraalee Misoomaa", desc: "Daandii fi bishaan qulqulluu gandoolee maraaf dhiheessuu.", icon: '🛣️' },
        { title: 'Tajaajila Iftoomina Qabu', desc: 'Bulchiinsa gaarii fi tajaajila teeknooloojiin deeggarame.', icon: '🏛️' },
        { title: "Invastimantii fi Hojii Uumuu", desc: "Carraawwan invastimantii qonnaa fi industirii magaalaa Caacceetti babal'isuu.", icon: '💼' },
      ],
      readMore: "Waa'ee Hoggansa Aanaa Dabalataan Dubbisi",
    },
  }[locale]

  return (
    <div className="flex flex-col w-full">
      {/* 1. Chief Administrator Executive Welcome & Strategic Pillars Section */}
      <section className="py-16 bg-[#08172c] text-white relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#1a4f8b]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 top-1/3 w-80 h-80 bg-[#c8931a]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Official Message & Portrait Frame (5 cols) */}
            <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xs relative overflow-hidden group">
              <div className="flex items-center gap-4 mb-6">
                {/* Official Portrait Avatar with Gold Border */}
                <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#FED100] shadow-lg shrink-0 bg-[#0d2340]">
                  <Image
                    src="/images/leadership/derese-dememe.jpg"
                    alt={content.name}
                    fill
                    sizes="64px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                    {content.name}
                  </h3>
                  <p className="text-xs text-[#FED100] mt-0.5 font-medium">
                    {content.office}
                  </p>
                </div>
              </div>

              <blockquote className="text-sm sm:text-base text-gray-200 leading-relaxed italic border-l-2 border-[#FED100] pl-4 my-4">
                {content.quote}
              </blockquote>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <Link
                  href={`/${locale}/about/leadership`}
                  className="inline-flex items-center gap-2 text-xs font-semibold text-[#FED100] hover:text-white transition-colors"
                >
                  <span>{content.readMore}</span>
                  <span>→</span>
                </Link>
                <span className="text-[11px] text-gray-400">Angolela Tera Woreda</span>
              </div>
            </div>

            {/* Right Column: Strategic Pillars (7 cols) */}
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full">
                {content.tag}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-3 mb-6">
                {content.pillarsTitle}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {content.pillars.map((pillar, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-5 transition-all duration-200 group"
                  >
                    <span className="text-2xl block mb-2">{pillar.icon}</span>
                    <h4 className="text-sm font-bold text-white group-hover:text-[#FED100] transition-colors">
                      {pillar.title}
                    </h4>
                    <p className="text-xs text-gray-300 mt-1.5 leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Interactive Executive Leadership & Party Secretariat Slider Carousel */}
      <LeadershipSlider locale={locale} />
    </div>
  )
}
