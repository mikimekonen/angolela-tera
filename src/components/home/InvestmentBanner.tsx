'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface InvestmentBannerProps {
  locale: Locale
}

interface SectorPillar {
  id: string
  icon: string
  title_en: string
  title_am: string
  desc_en: string
  desc_am: string
  land_en: string
  land_am: string
  incentive_en: string
  incentive_am: string
}

const SECTOR_PILLARS: SectorPillar[] = [
  {
    id: 'dairy',
    icon: '🥛',
    title_en: 'Dairy & Cold-Chain Processing',
    title_am: 'የወተትና ቅዝቃዜ ማከማቻ ኢንዱስትሪ',
    desc_en:
      'Capitalize on Angolela Tera’s massive daily highland raw milk production, crossbreed livestock, and direct market supply to Addis Ababa.',
    desc_am:
      'በወረዳው ያለውን ከፍተኛ የጥሬ ወተት ምርት፣ የዝርያ ማሻሻያ እና ለአዲስ አበባ ገበያ ያለውን ቅርበት በመጠቀም የወተት ምርቶችን ማቀነባበር።',
    land_en: '30 Hectares Reserved in Chacha Dairy Corridor',
    land_am: 'በጫቻ ወተት ኮሪደር 30 ሄክታር የተዘጋጀ መሬት',
    incentive_en: 'Duty-free machinery import + 5-year regional tax exemption',
    incentive_am: 'ከቀረጥ ነፃ የማሽነሪ ማስገባት + የ5 ዓመት የታክስ እፎይታ',
  },
  {
    id: 'grain',
    icon: '🌾',
    title_en: 'Malt Barley & Wheat Agro-Industry',
    title_am: 'የብቅል ገብስና ስንዴ አግሮ-ኢንዱስትሪ',
    desc_en:
      'Direct contract farming and processing for Ethiopia’s major breweries and food mills located within 20km along the highway.',
    desc_am:
      'በአካባቢው ለሚገኙ የቢራ ፋብሪካዎችና የምግብ አቀነባባሪዎች በውል እርሻና ቀጥታ አቅርቦት ትስስር ኢንቨስት ማድረግ።',
    land_en: '45 Hectares designated for agro-processing silos',
    land_am: '45 ሄክታር ለማከማቻ ጎተራዎችና ማቀነባበሪያ',
    incentive_en: 'Streamlined outgrower contracts & certified seed support',
    incentive_am: 'የውል እርሻ ማስተባበርና የምርጥ ዘር አቅርቦት ድጋፍ',
  },
  {
    id: 'industry',
    icon: '🏭',
    title_en: 'Light Manufacturing & Logistics',
    title_am: 'ቀላል ማኑፋክቸሪንግና ሎጅስቲክስ',
    desc_en:
      'Strategic highway-front parcels situated between Addis Ababa and Dessie with reliable electricity and subterranean water supplies.',
    desc_am:
      'በአዲስ አበባ-ደሴ ዋና መንገድ ላይ የሚገኙ፣ አስተማማኝ የመብራትና የከርሰ ምድር ውሃ ያላቸው ምቹ የኢንዱስትሪ ቦታዎች።',
    land_en: '50+ Hectares serviced industrial plots',
    land_am: '50+ ሄክታር መሰረተ-ልማት የተሟላለት የኢንዱስትሪ መሬት',
    incentive_en: '70-year secured lease tenure + Dedicated substation access',
    incentive_am: 'የ70 ዓመት አስተማማኝ የሊዝ ውል + የተለየ የሃይል ማከፋፈያ',
  },
  {
    id: 'tourism',
    icon: '🌲',
    title_en: 'Eco-Tourism & Historic Highland Lodges',
    title_am: 'ኢኮ-ቱሪዝም እና የደጋማው ቀጠና ሎጆች',
    desc_en:
      'Spectacular North Shewa escarpment views, temperate highland air, and close proximity to historical royal sites of King Sahle Selassie.',
    desc_am:
      'አስደናቂ የተራራ እይታ፣ ንጹህ የደጋ አየር እና የንጉሥ ሣህለ ሥላሴ ታሪካዊ የአንጎሌላ ከተማ መገኛ ላይ ማረፊያ ሎጆችን መገንባት።',
    land_en: 'Scenic hilltop parcels overlooking Great Rift escarpments',
    land_am: 'ውብ የተራራማ መልክአ-ምድር ያላቸው የመዝናኛ ስፍራዎች',
    incentive_en: 'Priority municipal licensing + Eco-hospitality concessions',
    incentive_am: 'ቅድሚያ የሚሰጠው የፈቃድ አሰጣጥ + የቱሪዝም ዘርፍ ማበረታቻ',
  },
]

export function InvestmentBanner({ locale }: InvestmentBannerProps) {
  const [activeSectorId, setActiveSectorId] = useState<string>('dairy')
  const isAm = locale === 'am'

  const contentDict = {
    en: {
      badge: 'Strategic Economic Corridors & Industrial Growth',
      title: 'Invest in Angolela Tera: The Highland Gateway',
      desc:
        'With immediate access to the Addis Ababa–Dessie trunk expressway (A2), dependable highland water basins, and fertile land, Angolela Tera is North Shewa’s fastest growing agro-industrial corridor.',
      cta: 'Explore Full Investment Guide & Land Bank',
      hotline: 'Investment Desk Hotline',
      selectPillar: 'Select an Economic Pillar to Inspect Incentives & Land:',
      landAvail: 'Land Availability',
      keyIncentive: 'Verified Incentive',
      advantages: [
        'Dedicated 1-Stop Licensing Desk',
        'Direct Paved Highway Access (A2)',
        'Competitive Leases & 70-Year Security',
        'Abundant Agro-Produce Sourcing',
      ],
    },
    am: {
      badge: 'የኢኮኖሚ ኮሪደርና የኢንዱስትሪ ልማት',
      title: 'በአንጎሌላ ተራ ኢንቨስት ያድርጉ፡ የደጋማው ቀጠና በር',
      desc:
        'ከአዲስ አበባ-ደብረ ብርሃን የኢኮኖሚ መስመር (A2) አጠገብ የምትገኘው አንጎሌላ ተራ ወረዳ፣ ለአግሮ-ፕሮሰሲንግ፣ ለወተትና ከብት እርባታ፣ ለፋብሪካዎችና ለቅዝቃዜ ማከማቻ ኢንዱስትሪዎች ተመራጭ መዳረሻ ናት።',
      cta: 'የኢንቨስትመንት መመሪያና የመሬት ባንክ',
      hotline: 'የኢንቨስትመንት ቀጥታ መስመር',
      selectPillar: 'የኢኮኖሚ ዘርፎችን በመምረጥ የመሬትና ማበረታቻ መረጃ ይመልከቱ፡',
      landAvail: 'የመሬት ዝግጁነት',
      keyIncentive: 'የመንግስት ማበረታቻ',
      advantages: [
        'የአንድ መስኮት ፈጣን የፈቃድ አሰጣጥ',
        'ቀጥታ የአስፋልት መንገድ ትስስር (A2)',
        'ምቹ የሊዝ ዋጋና የ70 ዓመት ዋስትና',
        'አስተማማኝ የግብርና ጥሬ እቃ አቅርቦት',
      ],
    },
    om: {
      badge: 'Kooridarii Diinagdee fi Misooma Indastirii',
      title: 'Angoolaalaa Xaraatti Invast Godhaa: Karra Baddaa',
      desc:
        'Daandii Finfinnee-Dabrabirhaan (A2) cinaatti kan argamtu Aanaan Angoolaalaa Xaraa, agroo-piroosesiingii, misooma aannanii, fi warshaaleef bakka filatamaa dha.',
      cta: 'Qajeelfama Invastimantii fi Baankii Lafaa',
      hotline: 'Toora Kallattii Invastimantii',
      selectPillar: 'Damee diinagdee filachuudhaan odeeffannoo lafaa fi jajjabeessituu ilaalaa:',
      landAvail: 'Qophii Lafaa',
      keyIncentive: 'Jajjabeessituu Mootummaa',
      advantages: [
        'Tajaajila Hayyamaa Foddaa Tokkoo',
        'Walitti Dhufeenya Daandii Aspaaltii (A2)',
        'Gatii Liizii Mijataa fi Wabii Waggaa 70',
        'Dhiyeessii Oomisha Qonnaa Amanamaa',
      ],
    },
  }
  const content = (contentDict as any)[locale] || contentDict.en

  const activeSector =
    SECTOR_PILLARS.find((s) => s.id === activeSectorId) || SECTOR_PILLARS[0]

  return (
    <section className="py-20 bg-gradient-to-br from-[#061426] via-[#0d2340] to-[#133a6b] text-white relative overflow-hidden">
      {/* Decorative Golden Highlights & Ambient Lighting */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-[#c8931a]/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-[#009A44]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Block */}
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-black text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full inline-block mb-3">
            {content.badge}
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-tight">
            {content.title}
          </h2>

          <p className="text-sm sm:text-base text-gray-200/90 mt-3.5 leading-relaxed">
            {content.desc}
          </p>
        </div>

        {/* Advantages Bullet Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          {content.advantages.map((adv: any, idx: number) => (
            <div
              key={idx}
              className="flex items-center gap-2.5 bg-white/8 backdrop-blur-md border border-white/10 rounded-xl p-3 text-xs text-gray-200 font-medium"
            >
              <span className="h-5 w-5 rounded-full bg-[#009A44] flex items-center justify-center text-white text-[10px] shrink-0 font-bold">
                ✓
              </span>
              <span>{adv}</span>
            </div>
          ))}
        </div>

        {/* Interactive Sector Selector Box */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          <p className="text-xs font-bold text-[#FED100] uppercase tracking-wider mb-4">
            {content.selectPillar}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
            {SECTOR_PILLARS.map((sec) => {
              const isSelected = activeSectorId === sec.id
              const title = isAm ? sec.title_am : sec.title_en

              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSectorId(sec.id)}
                  className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#c8931a] to-[#dca01e] text-[#0d2340] border-[#FED100] shadow-lg font-black scale-102'
                      : 'bg-white/5 hover:bg-white/15 text-white border-white/15'
                  }`}
                >
                  <span className="text-2xl p-2 bg-white/20 rounded-xl">
                    {sec.icon}
                  </span>
                  <span className="text-xs sm:text-sm font-bold line-clamp-2">
                    {title}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Active Sector Dynamic Preview Panel */}
          <div className="bg-[#061426]/70 rounded-2xl p-6 sm:p-8 border border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center animate-fadeIn">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase">
                <span>{activeSector.icon}</span>
                <span>{isAm ? activeSector.title_am : activeSector.title_en}</span>
              </div>

              <p className="text-sm sm:text-base text-gray-200 mt-2 leading-relaxed font-normal">
                {isAm ? activeSector.desc_am : activeSector.desc_en}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    📍 {content.landAvail}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#FED100]">
                    {isAm ? activeSector.land_am : activeSector.land_en}
                  </span>
                </div>

                <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                  <span className="text-[10px] font-bold text-gray-400 uppercase block mb-1">
                    🎁 {content.keyIncentive}
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-white">
                    {isAm ? activeSector.incentive_am : activeSector.incentive_en}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Sidebar Action Column */}
            <div className="lg:col-span-4 flex flex-col items-start lg:items-end justify-center gap-4 lg:border-l lg:border-white/15 lg:pl-6 pt-4 lg:pt-0">
              <Link
                href={`/${locale}/investment`}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FED100] hover:bg-[#ffe040] text-[#0d2340] font-black text-xs px-6 py-3.5 rounded-xl shadow-lg transition-transform hover:scale-105"
              >
                <span>{content.cta}</span>
                <span>→</span>
              </Link>

              <div className="text-xs text-gray-300 text-left lg:text-right">
                <span className="block text-[11px] text-gray-400">
                  {content.hotline}
                </span>
                <a
                  href="tel:+251586610203"
                  className="font-mono font-bold text-white hover:text-amber-300 transition-colors"
                >
                  +251 (0) 58 661 0203
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
