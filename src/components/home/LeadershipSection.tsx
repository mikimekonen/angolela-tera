import React from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { MOCK_LEADERSHIP } from '@/data/entityData'

interface LeadershipSectionProps {
  locale: Locale
}

export function LeadershipSection({ locale }: LeadershipSectionProps) {
  const content = {
    en: {
      tag: 'Leadership & Executive Vision',
      title: 'Message from the Chief Administrator',
      name: 'Ato Alemu Bekele Demissie',
      office: 'Woreda Chief Administrator • Angolela Tera Woreda',
      quote:
        '“Our administration is deeply committed to building an accountable, responsive, and growth-oriented local government. By investing in our agricultural base, expanding rural road networks, providing clean water to every kebele, and opening our woreda to responsible private investment, we are laying the groundwork for shared prosperity for all our citizens.”',
      pillarsTitle: 'Our Strategic Governance Pillars',
      pillars: [
        {
          title: 'Agricultural Transformation',
          desc: 'Modernizing highland farming, expanding irrigation schemes, and boosting smallholder farmer incomes.',
          icon: '🌾',
        },
        {
          title: 'Infrastructure & Connectivity',
          desc: 'Connecting every kebele with all-weather roads and expanding electric grid and clean water access.',
          icon: '🛣️',
        },
        {
          title: 'Transparent Public Service',
          desc: 'Ensuring zero tolerance for maladministration, digitizing citizen records, and honoring public trust.',
          icon: '🏛️',
        },
        {
          title: 'Investment & Job Creation',
          desc: 'Leveraging our strategic position on the A2 corridor to develop agro-industrial processing hubs.',
          icon: '💼',
        },
      ],
      readMore: 'Learn More About Woreda Cabinet',
      execHeading: 'Executive Leadership & Sector Directors',
      execSubtitle: 'Dedicated civil servants directing Woreda bureaus, sectoral reforms, and public service delivery.',
      cabinetLink: 'View Complete Directorate Directory →',
    },
    am: {
      tag: 'አመራርና ራዕይ',
      title: 'የዋና አስተዳዳሪው መልዕክት',
      name: 'አቶ አለሙ በቀለ ደምሰው',
      office: 'የወረዳ ዋና አስተዳዳሪ • አንጎሌላ ተራ ወረዳ',
      quote:
        '“አስተዳደራችን ተጠያቂነት ያለው፣ ለህዝብ ጥያቄ ፈጣን ምላሽ የሚሰጥ እና የኢኮኖሚ እድገትን የሚያፋጥን አካባቢያዊ አስተዳደር ለመገንባት በቁርጠኝነት እየሰራ ይገኛል። የግብርና ምርታማነታችንን በማሳደግ፣ የገጠር መንገዶችን በማስፋፋት፣ ንጹህ መጠጥ ውሃ ለሁሉም ቀበሌዎች በማዳረስ እና ለባለሀብቶች ምቹ ሁኔታ በመፍጠር የህዝባችንን ሁለንተናዊ ተጠቃሚነት እናረጋግጣለን።”',
      pillarsTitle: 'የአስተዳደሩ ዋና ዋና የትኩረት አቅጣጫዎች',
      pillars: [
        {
          title: 'የግብርና ሽግግር',
          desc: 'የደጋማ አካባቢ ግብርናን ማዘመን፣ የመስኖ ልማት ማስፋፋትና የአርሶ አደሩን ገቢ ማሳደግ።',
          icon: '🌾',
        },
        {
          title: 'መሰረተ ልማትና ትስስር',
          desc: 'ቀበሌዎችን በዘመናዊ መንገድ ማስተሳሰር፣ የመብራትና የንጹህ ውሃ ተደራሽነትን ማረጋገጥ።',
          icon: '🛣️',
        },
        {
          title: 'ግልጽና ፍትሃዊ አገልግሎት',
          desc: 'መልካም አስተዳደርን ማስፈን፣ የህዝብ አገልግሎትን በዲጂታል ቴክኖሎጂ ማዘመንና የዜጎችን መብት ማስጠበቅ።',
          icon: '🏛️',
        },
        {
          title: 'ኢንቨስትመንትና የስራ እድል',
          desc: 'በአዲስ አበባ-ደሴ ኮሪደር ያለውን መልካም አጋጣሚ በመጠቀም አግሮ-ኢንዱስትሪን ማበረታታት።',
          icon: '💼',
        },
      ],
      readMore: 'ስለ ወረዳው ካቢኔ አመራር የበለጠ ይወቁ',
      execHeading: 'የወረዳው ካቢኔ አመራርና የዘርፍ ኃላፊዎች',
      execSubtitle: 'የህዝብ አገልግሎትን በቁርጠኝነት የሚመሩ የወረዳው ከፍተኛ አመራሮችና የሴክተር ዳይሬክተሮች።',
      cabinetLink: 'ሁሉንም የመስሪያ ቤት ኃላፊዎች ይመልከቱ →',
    },
    om: {
      tag: 'Hoggansa fi Ilaalcha',
      title: 'Ergaa Bulchaa Ol\'aanaa Aanaa',
      name: 'Obbo Aleemuu Baqalee Damiissee',
      office: 'Bulchaa Ol\'aanaa • Aanaa Angolallaa Xaraa',
      quote:
        '“Bulchiinsi keenya tajaajila uummataa ifa ta\'e kennuuf, misooma qonnaa guddisuuf fi daandiiwwan baadiyyaa babal\'isuuf cimsee hojjetaa jira.”',
      pillarsTitle: 'Utuboota Misooma Keenyaa',
      pillars: [
        { title: 'Ce\'umsa Qonnaa', desc: 'Qonna ammayyeessuu fi galii qonnaan bulaa dabaluu.', icon: '🌾' },
        { title: 'Bu\'uuraalee Misoomaa', desc: 'Daandii fi bishaan qulqulluu gandoolee maraaf dhiheessuu.', icon: '🛣️' },
        { title: 'Tajaajila Iftoomina Qabu', desc: 'Bulchiinsa gaarii fi tajaajila teeknooloojiin deeggarame.', icon: '🏛️' },
        { title: 'Invastimantii fi Hojii Uumuu', desc: 'Carraawwan invastimantii qonnaa fi industirii babal\'isuu.', icon: '💼' },
      ],
      readMore: 'Waa\'ee Kaabinee Aanaa Dabalataan Dubbisi',
      execHeading: 'Hoggantoota Kaabinee fi Daayirektaroota Damee',
      execSubtitle: 'Tajaajila uummataa qulqulluu fi ifa ta\'e mirkaneessuuf kan kutannootti hojjetan.',
      cabinetLink: 'Hoggantoota Mara Ilaalaa →',
    },
  }[locale]

  return (
    <section className="py-16 bg-[#0a192f] text-white relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-80 h-80 bg-[#1a4f8b]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-16">
        {/* Top Part: Chief Administrator Message & Strategic Pillars */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Official Message & Portrait Frame (5 cols) */}
          <div className="lg:col-span-5 bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xs">
            <div className="flex items-center gap-4 mb-6">
              {/* Official Seal / Portrait Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#1a4f8b] to-[#c8931a] flex items-center justify-center text-white text-2xl font-bold shadow-inner border-2 border-white/20 shrink-0">
                🏛️
              </div>
              <div>
                <h3 className="text-base font-bold text-white leading-tight">
                  {content.name}
                </h3>
                <p className="text-xs text-[#FED100] mt-0.5">
                  {content.office}
                </p>
              </div>
            </div>

            <blockquote className="text-sm sm:text-base text-gray-200 leading-relaxed italic border-l-2 border-[#c8931a] pl-4 my-4">
              {content.quote}
            </blockquote>

            <div className="mt-6 pt-4 border-t border-white/10">
              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 text-xs font-semibold text-[#FED100] hover:text-white transition-colors"
              >
                <span>{content.readMore}</span>
                <span>→</span>
              </Link>
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

        {/* Bottom Part: Leadership & Sector Directors Profiles Grid */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full inline-block mb-2">
                👤 Woreda Executive Roster
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {content.execHeading}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {content.execSubtitle}
              </p>
            </div>

            <Link
              href={`/${locale}/offices`}
              className="text-xs font-bold text-[#FED100] hover:text-white transition-colors self-start sm:self-auto"
            >
              {content.cabinetLink}
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_LEADERSHIP.map((leader) => {
              const name =
                locale === 'am' ? leader.name_am :
                locale === 'om' ? leader.name_om :
                leader.name_en

              const title =
                locale === 'am' ? leader.title_am :
                locale === 'om' ? leader.title_om :
                leader.title_en

              const bio =
                locale === 'am' ? leader.bio_am :
                locale === 'om' ? leader.bio_om :
                leader.bio_en

              return (
                <div
                  key={leader.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#c8931a]/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-4">
                      {/* Photo / Avatar with Gold Border */}
                      <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1a4f8b] to-[#c8931a] border-2 border-[#FED100]/60 flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-sm overflow-hidden">
                        {leader.photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={leader.photo}
                            alt={name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{leader.name_en.slice(0, 2).toUpperCase()}</span>
                        )}
                      </div>

                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-[#FED100] uppercase tracking-wider block truncate">
                          {title}
                        </span>
                        <h4 className="text-sm font-bold text-white truncate group-hover:text-[#FED100] transition-colors">
                          {name}
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 line-clamp-4 leading-relaxed italic border-l-2 border-white/10 pl-3">
                      &ldquo;{bio}&rdquo;
                    </p>
                  </div>

                  <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-400">
                    <span>{leader.phone || '+251 58 661 xxxx'}</span>
                    <span className="text-gray-500">Official Cabinet</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
