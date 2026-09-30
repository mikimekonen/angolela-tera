'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { MOCK_BUSINESSES } from '@/data/entityData'

interface CompaniesSectionProps {
  locale: Locale
}

export function CompaniesSection({ locale }: CompaniesSectionProps) {
  const [activeSector, setActiveSector] = useState<string>('ALL')

  const t = {
    en: {
      badge: 'Economic Vitality & Investment Hub',
      title: 'Private Enterprises & Industries',
      subtitle:
        'Angolela Tera is home to thriving agro-processing, seed distribution, highland honey, and engineering firms powering local employment and economic growth along the Chacha corridor.',
      viewAll: 'Explore All Woreda Companies',
      exploreBtn: 'View Business Profile',
      investorNotice: 'Are you an investor? Explore available industrial land and lease incentives.',
      investBtn: 'Investment Corridor Guide →',
      employees: 'Employees',
      established: 'Est.',
      sectors: {
        ALL: 'All Enterprises',
        AGRO_PROCESSING: 'Agro-Processing',
        AGRICULTURE: 'Seed & Inputs',
        CONSTRUCTION: 'Construction',
      },
    },
    am: {
      badge: 'የኢኮኖሚ እድገትና የኢንቨስትመንት ማዕከል',
      title: 'የግል ድርጅቶችና ፋብሪካዎች',
      subtitle:
        'በአንጎሌላ ተራ ወረዳ በጫቻ አግሮ-ኢንዱስትሪ ኮሪደር የሚገኙ የሰብል ማቀነባበሪያ፣ ምርጥ ዘር አቅራቢ፣ የደጋ ማር አምራች እና የኮንስትራክሽን ድርጅቶች ሰፊ የስራ እድልና የኢኮኖሚ መነቃቃት እየፈጠሩ ይገኛሉ።',
      viewAll: 'ሁሉንም የወረዳ ድርጅቶች ይመልከቱ',
      exploreBtn: 'የድርጅቱን መረጃ ይመልከቱ',
      investorNotice: 'ባለሀብት ነዎት? ለኢንቨስትመንት የተዘጋጁ የሊዝ መሬቶችና ማበረታቻዎችን ይመልከቱ።',
      investBtn: 'የኢንቨስትመንት መመሪያ →',
      employees: 'ሰራተኞች',
      established: 'የተመሰረተበት',
      sectors: {
        ALL: 'ሁሉም ድርጅቶች',
        AGRO_PROCESSING: 'አግሮ-ፕሮሰሲንግ',
        AGRICULTURE: 'ዘርና ግብዓት',
        CONSTRUCTION: 'ኮንስትራክሽን',
      },
    },
    om: {
      badge: 'Guddina Dinagdee fi Wiirtuu Invastimantii',
      title: 'Dhaabbilee Dhuunfaa fi Warshaalee',
      subtitle:
        'Aanaa Angolallaa Xaraa keessatti warshaaleen midhaan qopheessan, dhiyeessitoonni sanyii filatamaa fi dhaabbileen ijaarsaa carraa hojii uumaa jiru.',
      viewAll: 'Dhaabbilee Hunda Ilaalaa',
      exploreBtn: 'Ibsa Dhaabbataa',
      investorNotice: 'Abbaa qabeenyaa? Carraawwan invastimantii qoradhaa.',
      investBtn: 'Qajeelfama Invastimantii →',
      employees: 'Hojjettoota',
      established: 'Kan Hundeeffame',
      sectors: {
        ALL: 'Hunda',
        AGRO_PROCESSING: 'Warshaa Qonnaa',
        AGRICULTURE: 'Sanyii fi Meeshaa',
        CONSTRUCTION: 'Ijaarsa',
      },
    },
  }[locale]

  const filtered = MOCK_BUSINESSES.filter(
    (b) => activeSector === 'ALL' || b.sector === activeSector
  )

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50/70 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
              🏢 {t.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d2340] tracking-tight">
              {t.title}
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSector('ALL')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSector === 'ALL'
                  ? 'bg-[#0d2340] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t.sectors.ALL}
            </button>
            <button
              onClick={() => setActiveSector('AGRO_PROCESSING')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSector === 'AGRO_PROCESSING'
                  ? 'bg-[#1a4f8b] text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏭 {t.sectors.AGRO_PROCESSING}
            </button>
            <button
              onClick={() => setActiveSector('AGRICULTURE')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSector === 'AGRICULTURE'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              🌾 {t.sectors.AGRICULTURE}
            </button>
            <button
              onClick={() => setActiveSector('CONSTRUCTION')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeSector === 'CONSTRUCTION'
                  ? 'bg-amber-700 text-white shadow-xs'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
              }`}
            >
              🏗️ {t.sectors.CONSTRUCTION}
            </button>
          </div>
        </div>

        {/* Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((biz) => {
            const name =
              locale === 'am' ? biz.name_am || biz.name_en :
              locale === 'om' ? biz.name_om || biz.name_en :
              biz.name_en

            const desc =
              locale === 'am' ? biz.description_am || biz.description_en :
              locale === 'om' ? biz.description_om || biz.description_en :
              biz.description_en

            return (
              <div
                key={biz.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-lg hover:border-[#1a4f8b] transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Photo Frame / Icon */}
                  <div className="w-full h-36 bg-gradient-to-tr from-gray-100 to-gray-200 rounded-xl mb-4 overflow-hidden relative border border-gray-200 flex items-center justify-center">
                    {biz.photo?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={biz.photo.url}
                        alt={name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="text-center p-4">
                        <span className="text-4xl block mb-1">
                          {biz.sector === 'AGRO_PROCESSING' ? '🏭' : biz.sector === 'AGRICULTURE' ? '🌾' : biz.sector === 'CONSTRUCTION' ? '🏗️' : '💼'}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          {biz.sector.replace('_', ' ')}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#0d2340]/80 text-white backdrop-blur-xs">
                      {biz.employeeCount} {t.employees}
                    </span>
                  </div>

                  {/* Title & Badge */}
                  <h3 className="text-base font-extrabold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-snug line-clamp-2">
                    {name}
                  </h3>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-3 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="text-[11px] font-medium text-gray-400">
                    📍 {biz.address?.split(',')[0]}
                  </span>
                  <Link
                    href={`/${locale}/companies`}
                    className="font-bold text-[#1a4f8b] hover:text-[#0d2340] group-hover:translate-x-0.5 transition-transform"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        {/* Investment CTA banner */}
        <div className="mt-10 bg-gradient-to-r from-[#0d2340] to-[#1a4f8b] rounded-2xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">
              {t.investorNotice}
            </h3>
            <p className="text-xs text-blue-100">
              One-stop permit processing, priority electrical connectivity, and direct highway frontage in Chacha.
            </p>
          </div>
          <Link
            href={`/${locale}/investment`}
            className="bg-[#c8931a] hover:bg-[#b07d12] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs transition-colors shrink-0"
          >
            {t.investBtn}
          </Link>
        </div>
      </div>
    </section>
  )
}
