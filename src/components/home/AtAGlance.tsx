import React from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface AtAGlanceProps {
  locale: Locale
}

export function AtAGlance({ locale }: AtAGlanceProps) {
  const content = {
    en: {
      tag: 'Key Woreda Profile',
      title: 'Angolela Tera at a Glance',
      desc: 'Strategically located along the Addis Ababa–Dessie trunk highway in the North Shewa Zone of Amhara Region, Angolela Tera is an agricultural powerhouse, a growing agro-processing corridor, and a historic highland district.',
      viewMore: 'Read Full Woreda Profile',
      stats: [
        {
          label: 'Administrative Capital',
          value: 'Chacha Town',
          desc: 'Primary administrative hub and commercial center',
          icon: '🏛️',
        },
        {
          label: 'Total Population',
          value: '142,500+',
          desc: 'Vibrant agrarian community with growing youth workforce',
          icon: '👥',
        },
        {
          label: 'Kebeles',
          value: '19 Rural / 2 Urban',
          desc: 'Decentralized local administration structure',
          icon: '📍',
        },
        {
          label: 'Arable Land',
          value: '86,400 Hectares',
          desc: 'Fertile highland soil suited for wheat, barley & pulses',
          icon: '🌾',
        },
        {
          label: 'Elevation & Climate',
          value: '2,600 – 3,050 m',
          desc: 'Dega (temperate highland) with reliable dual rainfall',
          icon: '⛰️',
        },
        {
          label: 'Corridor Proximity',
          value: '20 km to Debre Birhan',
          desc: 'Direct paved expressway access to industrial markets',
          icon: '🚛',
        },
      ],
    },
    am: {
      tag: 'የወረዳው መገለጫ',
      title: 'አንጎሌላ ተራ በጨረፍታ',
      desc: 'በአማራ ክልል በሰሜን ሸዋ ዞን በአዲስ አበባ-ደሴ ዋና አውራ ጎዳና ላይ የምትገኘው አንጎሌላ ተራ ወረዳ የግብርና ምርታማነት ማዕከል፣ እያደገ ያለ የአግሮ-ኢንዱስትሪ ኮሪደር እና የበለጸገ ታሪክ ያላት ደጋማ ወረዳ ናት።',
      viewMore: 'ሙሉ የወረዳውን መረጃ ያንብቡ',
      stats: [
        {
          label: 'የአስተዳደሩ መቀመጫ',
          value: 'ጫቻ ከተማ',
          desc: 'ዋና የአስተዳደርና የንግድ ማዕከል',
          icon: '🏛️',
        },
        {
          label: 'ጠቅላላ የህዝብ ብዛት',
          value: '142,500+',
          desc: 'ንቁ አርሶ አደርና በስራ እድል ላይ ያለ ወጣት ህዝብ',
          icon: '👥',
        },
        {
          label: 'የቀበሌዎች ብዛት',
          value: '19 የገጠር / 2 የከተማ',
          desc: 'ያልተማከለ የቀበሌ አስተዳደር መዋቅር',
          icon: '📍',
        },
        {
          label: 'የታረሰ መሬት',
          value: '86,400 ሄክታር',
          desc: 'ለስንዴ፣ ገብስና ጥራጥሬ ተስማሚ ለም መሬት',
          icon: '🌾',
        },
        {
          label: 'ከፍታና አየር ንብረት',
          value: '2,600 – 3,050 ሜትር',
          desc: 'ደጋማ የአየር ንብረትና አስተማማኝ ዝናብ',
          icon: '⛰️',
        },
        {
          label: 'የገበያ ትስስር',
          value: '20 ኪ.ሜ ከደብረ ብርሃን',
          desc: 'ከአዲስ አበባና ደብረ ብርሃን ኢንዱስትሪዎች ጋር ቀጥተኛ ግንኙነት',
          icon: '🚛',
        },
      ],
    },
    om: {
      tag: 'Ibsa Aanaa',
      title: 'Aanaa Angolallaa Xaraa Gamisaan',
      desc: 'Godina Shawaa Kaabaa keessatti daandii guddaa Finfinnee-Dasee irratti argamti. Bakka qonnaa bal\'aa fi misooma saffisaa qabduudha.',
      viewMore: 'Odeeffannoo Guutuu Dubbisi',
      stats: [
        {
          label: 'Magaalaa Teessumaa',
          value: 'Magaalaa Caaccetti',
          desc: 'Wiirtuu bulchiinsaa fi daldalaa',
          icon: '🏛️',
        },
        {
          label: 'Baay\'ina Uummataa',
          value: '142,500+',
          desc: 'Hawaasa qonnaan bulaa fi dargaggoota qabu',
          icon: '👥',
        },
        {
          label: 'Gandoolee',
          value: '19 Baadiyyaa / 2 Magaalaa',
          desc: 'Caasaa bulchiinsa gandoolee',
          icon: '📍',
        },
        {
          label: 'Lafa Qotamu',
          value: '86,400 Hektaara',
          desc: 'Qamadii, garbuu fi baaqelaaf kan oolu',
          icon: '🌾',
        },
        {
          label: 'Olka\'iinsa fi Qilleensa',
          value: '2,600 – 3,050 m',
          desc: 'Qilleensa baddaa fi rooba gahaa',
          icon: '⛰️',
        },
        {
          label: 'Dhiheenya Gabaa',
          value: '20 km gara Dabra Birhaan',
          desc: 'Gabaa fi industirii waliin walqunnamtii qaba',
          icon: '🚛',
        },
      ],
    },
  }[locale]

  return (
    <section className="py-16 bg-[#f0f4f8] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-full">
              {content.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {content.desc}
            </p>
          </div>

          <Link
            href={`/${locale}/about`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] hover:text-[#133a6b] hover:underline shrink-0"
          >
            <span>{content.viewMore}</span>
            <span>→</span>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow duration-200 group"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl p-2 bg-blue-50 group-hover:bg-blue-100 rounded-lg transition-colors">
                  {stat.icon}
                </span>
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Verified Data
                </span>
              </div>
              <div className="mt-4">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </div>
                <div className="text-xl sm:text-2xl font-extrabold text-[#0d2340] mt-1 group-hover:text-[#1a4f8b] transition-colors">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
