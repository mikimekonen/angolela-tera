'use client'

import React from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

interface AtAGlanceProps {
  locale: Locale
}

export function AtAGlance({ locale }: AtAGlanceProps) {
  const isAm = locale === 'am'

  const content = {
    en: {
      tag: 'Key Woreda Profile & Verified Stats',
      title: 'Angolela Tera at a Glance',
      desc: 'Strategically located along the Addis Ababa–Dessie trunk highway in the North Shewa Zone of Amhara Region, Angolela Tera is an agricultural powerhouse, a growing agro-processing corridor, and a historic highland district.',
      viewMore: 'Read Full Woreda Profile',
      stats: [
        {
          label: 'Administrative Capital',
          endNum: null,
          displayValue: 'Chacha Town',
          desc: 'Primary administrative hub and commercial center',
          icon: '🏛️',
          accent: 'border-blue-300',
        },
        {
          label: 'Total Population',
          endNum: 142500,
          suffix: '+',
          displayValue: '142,500+',
          desc: 'Vibrant agrarian community with growing youth workforce',
          icon: '👥',
          accent: 'border-emerald-300',
        },
        {
          label: 'Kebeles',
          endNum: 19,
          suffix: ' Rural / 2 Urban',
          displayValue: '19 Rural / 2 Urban',
          desc: 'Decentralized local administration structure',
          icon: '📍',
          accent: 'border-amber-300',
        },
        {
          label: 'Arable Land',
          endNum: 86400,
          suffix: ' Hectares',
          displayValue: '86,400 Hectares',
          desc: 'Fertile highland soil suited for wheat, barley & pulses',
          icon: '🌾',
          accent: 'border-green-300',
        },
        {
          label: 'Elevation & Climate',
          endNum: 2840,
          prefix: 'Avg ',
          suffix: 'm (Dega)',
          displayValue: '2,600 – 3,050 m',
          desc: 'Dega (temperate highland) with reliable dual rainfall',
          icon: '⛰️',
          accent: 'border-indigo-300',
        },
        {
          label: 'Corridor Proximity',
          endNum: 20,
          suffix: ' km to Debre Birhan',
          displayValue: '20 km to Debre Birhan',
          desc: 'Direct paved expressway access to industrial markets',
          icon: '🚛',
          accent: 'border-cyan-300',
        },
      ],
    },
    am: {
      tag: 'የወረዳው መገለጫና የተረጋገጡ መረጃዎች',
      title: 'አንጎሌላ ተራ በጨረፍታ',
      desc: 'በአማራ ክልል በሰሜን ሸዋ ዞን በአዲስ አበባ-ደሴ ዋና አውራ ጎዳና ላይ የምትገኘው አንጎሌላ ተራ ወረዳ የግብርና ምርታማነት ማዕከል፣ እያደገ ያለ የአግሮ-ኢንዱስትሪ ኮሪደር እና የበለጸገ ታሪክ ያላት ደጋማ ወረዳ ናት።',
      viewMore: 'ሙሉ የወረዳውን መረጃ ያንብቡ',
      stats: [
        {
          label: 'የአስተዳደሩ መቀመጫ',
          endNum: null,
          displayValue: 'ጫቻ ከተማ',
          desc: 'ዋና የአስተዳደርና የንግድ ማዕከል',
          icon: '🏛️',
          accent: 'border-blue-300',
        },
        {
          label: 'ጠቅላላ የህዝብ ብዛት',
          endNum: 142500,
          suffix: '+',
          displayValue: '142,500+',
          desc: 'ንቁ አርሶ አደርና በስራ እድል ላይ ያለ ወጣት ህዝብ',
          icon: '👥',
          accent: 'border-emerald-300',
        },
        {
          label: 'የቀበሌዎች ብዛት',
          endNum: 19,
          suffix: ' የገጠር / 2 የከተማ',
          displayValue: '19 የገጠር / 2 የከተማ',
          desc: 'ያልተማከለ የቀበሌ አስተዳደር መዋቅር',
          icon: '📍',
          accent: 'border-amber-300',
        },
        {
          label: 'የታረሰ ለም መሬት',
          endNum: 86400,
          suffix: ' ሄክታር',
          displayValue: '86,400 ሄክታር',
          desc: 'ለስንዴ፣ ገብስና ጥራጥሬ ተስማሚ ለም መሬት',
          icon: '🌾',
          accent: 'border-green-300',
        },
        {
          label: 'ከፍታና አየር ንብረት',
          endNum: 2840,
          prefix: 'አማካይ ',
          suffix: ' ሜትር (ደጋ)',
          displayValue: '2,600 – 3,050 ሜትር',
          desc: 'ደጋማ የአየር ንብረትና አስተማማኝ የክረምት/በልግ ዝናብ',
          icon: '⛰️',
          accent: 'border-indigo-300',
        },
        {
          label: 'የገበያ ትስስር',
          endNum: 20,
          suffix: ' ኪ.ሜ ከደብረ ብርሃን',
          displayValue: '20 ኪ.ሜ ከደብረ ብርሃን',
          desc: 'ከአዲስ አበባና ደብረ ብርሃን ኢንዱስትሪዎች ጋር ቀጥተኛ ግንኙነት',
          icon: '🚛',
          accent: 'border-cyan-300',
        },
      ],
    },
  }[locale]

  return (
    <section className="py-20 bg-gradient-to-b from-[#f0f4f8] via-white to-[#f0f4f8] border-b border-gray-200 relative overflow-hidden">
      {/* Decorative Topographic Background Glow */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-[#1a4f8b] uppercase tracking-wider bg-blue-100/70 border border-blue-200/80 px-3.5 py-1.5 rounded-full shadow-xs">
              <span>📊</span>
              <span>{content.tag}</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h2>
            <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">
              {content.desc}
            </p>
          </div>

          <Link
            href={`/${locale}/about`}
            className="group inline-flex items-center gap-2 text-xs font-bold text-[#1a4f8b] hover:text-[#133a6b] bg-white border border-blue-200/70 px-4 py-2.5 rounded-xl shadow-xs hover:shadow-md transition-all shrink-0"
          >
            <span>{content.viewMore}</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {/* Interactive Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.stats.map((stat, idx) => (
            <div
              key={idx}
              className={`bg-white/95 border border-gray-200 hover:border-[#1a4f8b] rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden backdrop-blur-xs`}
            >
              {/* Subtle top indicator bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gray-100 group-hover:bg-gradient-to-r group-hover:from-[#1a4f8b] group-hover:to-[#c8931a] transition-all duration-300" />

              <div className="flex items-start justify-between">
                <span className="text-3xl p-3 bg-blue-50/80 group-hover:bg-blue-100 rounded-2xl group-hover:scale-110 transition-all duration-200 shadow-inner">
                  {stat.icon}
                </span>
                <span className="text-[10px] font-black text-gray-400 group-hover:text-[#1a4f8b] uppercase tracking-wider bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 transition-colors">
                  Verified Data
                </span>
              </div>

              <div className="mt-5">
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
                  {stat.label}
                </div>

                <div className="text-2xl sm:text-3xl font-black text-[#0d2340] mt-1.5 group-hover:text-[#1a4f8b] transition-colors tracking-tight">
                  {stat.endNum !== null ? (
                    <AnimatedCounter
                      end={stat.endNum}
                      prefix={stat.prefix || ''}
                      suffix={stat.suffix || ''}
                      duration={2000}
                    />
                  ) : (
                    stat.displayValue
                  )}
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
