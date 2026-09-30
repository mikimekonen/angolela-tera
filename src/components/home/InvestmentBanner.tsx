import React from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface InvestmentBannerProps {
  locale: Locale
}

export function InvestmentBanner({ locale }: InvestmentBannerProps) {
  const content = {
    en: {
      badge: 'Economic Corridors & Industrial Growth',
      title: 'Invest in Angolela Tera: The Highland Gateway',
      desc: 'With immediate proximity to the Addis Ababa–Debre Birhan economic highway, dependable highland water basins, and fertile agricultural land, Angolela Tera offers prime investment potential in agro-processing, dairy farming, poultry, and cold-chain logistics.',
      cta: 'Explore Investment Guide & Land Bank',
      hotline: 'Investment Desk: +251 (0) 58 661 0444',
      advantages: [
        'Dedicated 1-Stop Licensing Desk',
        'Direct Paved Highway Access',
        'Competitive Leases & Land Bank',
        'Abundant Agro-Produce Sourcing',
      ],
    },
    am: {
      badge: 'የኢኮኖሚ ኮሪደርና የኢንዱስትሪ ልማት',
      title: 'በአንጎሌላ ተራ ኢንቨስት ያድርጉ፡ የደጋማው ቀጠና በር',
      desc: 'ከአዲስ አበባ-ደብረ ብርሃን የኢኮኖሚ መስመር አጠገብ የምትገኘው አንጎሌላ ተራ ወረዳ፣ ለአግሮ-ፕሮሰሲንግ፣ ለወተትና ከብት እርባታ፣ ለዶሮ እርባታ እና ለቅዝቃዜ ማከማቻ ኢንዱስትሪዎች ተመራጭ መዳረሻ ናት።',
      cta: 'የኢንቨስትመንት መመሪያና የመሬት ባንክ',
      hotline: 'የኢንቨስትመንት ዴስክ፡ +251 (0) 58 661 0444',
      advantages: [
        'የአንድ መስኮት የፈቃድ አሰጣጥ',
        'ቀጥታ የአስፋልት መንገድ ትስስር',
        'ምቹ የሊዝ ዋጋና የመሬት ባንክ',
        'አስተማማኝ የግብርና ጥሬ እቃ አቅርቦት',
      ],
    },
    om: {
      badge: 'Misooma Diinagdee fi Industirii',
      title: 'Angolallaa Xaraatti Invast Godhaa',
      desc: 'Daandii guddaa Finfinnee-Dabra Birhaan irratti kan argamtu ta\'uu isheetiin, qonnaa fi industiriif bakka filatamaadha.',
      cta: 'Qajeelfama Invastimantii fi Lafa',
      hotline: 'Kutaa Invastimantii: +251 (0) 58 661 0444',
      advantages: [
        'Tajaajila Gamoo Tokkoo',
        'Daandii Asfaaltii Dhihoo',
        'Gatii Liizii Madaalawaa',
        'Dhiheessa Oomisha Qonnaa',
      ],
    },
  }[locale]

  return (
    <section className="py-16 bg-gradient-to-r from-[#0d2340] via-[#1a4f8b] to-[#0d2340] text-white relative overflow-hidden">
      {/* Decorative Golden Highlights */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#c8931a]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-3xl">
          <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full">
            {content.badge}
          </span>

          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-4 leading-tight">
            {content.title}
          </h2>

          <p className="text-sm sm:text-base text-gray-200 mt-3 leading-relaxed">
            {content.desc}
          </p>

          {/* Advantages Bullet Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6">
            {content.advantages.map((adv, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-gray-200 font-medium">
                <span className="h-5 w-5 rounded-full bg-[#009A44] flex items-center justify-center text-white text-[10px] shrink-0">
                  ✓
                </span>
                <span>{adv}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href={`/${locale}/investment`}
              className="inline-flex items-center gap-2 bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] font-bold text-xs sm:text-sm px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
            >
              <svg className="w-4 h-4 text-[#0d2340]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <span>{content.cta}</span>
            </Link>

            <span className="text-xs text-gray-300 font-mono bg-white/10 px-3.5 py-3 rounded-lg border border-white/10">
              📞 {content.hotline}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
