'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface CitizenActionFinderProps {
  locale: Locale
}

interface ActionItem {
  id: string
  label_en: string
  label_am: string
  label_om: string
  desc_en: string
  desc_am: string
  desc_om: string
  href: string
  icon: string
  category: 'CITIZEN' | 'BUSINESS' | 'FARMER' | 'COMPLAINT'
}

const POPULAR_ACTIONS: ActionItem[] = [
  {
    id: 'act-land',
    label_en: 'Verify or Register Land Holding',
    label_am: 'የገጠር መሬት ይዞታ ማረጋገጥ ወይም መመዝገብ',
    label_om: 'Waraqaa Ragaa Qabiyyee Lafaa Mirkaneessuu',
    desc_en: 'Get green book certificate, boundary verification, or parcel inheritance transfer.',
    desc_am: 'የይዞታ ደብተር፣ የወሰን ማረጋገጫና የወራሽነት ዝውውር አገልግሎት ማግኘት።',
    desc_om: 'Waraqaa ragaa qabiyyee lafaa fi daddabarsa dhaaltummaa raawwachuu.',
    href: '/services/land-certificate',
    icon: '🗺️',
    category: 'CITIZEN',
  },
  {
    id: 'act-civil',
    label_en: 'Obtain Vital Events Certificate (Birth, Marriage, Death)',
    label_am: 'የወሳኝ ኩነት ምዝገባ (ልደት፣ ጋብቻ፣ ሞት) ምስክር ወረቀት',
    label_om: 'Ragaa Dhalootaa, Fuudhaa fi Heerumaa, fi Du\'aa Fuchuu',
    desc_en: 'Official vital registration records issued by Kebele and Civil Registry Desk.',
    desc_am: 'በቀበሌ እና በወረዳ ወሳኝ ኩነት ጽ/ቤት የሚሰጥ ህጋዊ የምስክር ወረቀት።',
    desc_om: 'Waajjira galmee ragaalee murteessoo irraa waraqaa ragaa fudhachuu.',
    href: '/services/civil-registration',
    icon: '📜',
    category: 'CITIZEN',
  },
  {
    id: 'act-seeds',
    label_en: 'Request Certified Agricultural Seeds & Fertilizer',
    label_am: 'ምርጥ ዘር እና የአፈር ማዳበሪያ አቅርቦት መጠየቅ',
    label_om: 'Sanyii Filatamaa fi Xaa\'oo Qonnaa Gaafachuu',
    desc_en: 'Rust-resistant wheat, barley, teff, and urea/NPS supply for farming season.',
    desc_am: 'ለእርሻ ወቅት የሚሆን የስንዴ፣ ገብስ፣ ጤፍ ምርጥ ዘር እና ዩሪያ/ኤን.ፒ.ኤስ ማዳበሪያ።',
    desc_om: 'Sanyii qamadii, garbuu fi xaa\'oo yeroo qonnaaf dhiyeessuu.',
    href: '/services/agriculture',
    icon: '🌾',
    category: 'FARMER',
  },
  {
    id: 'act-permit',
    label_en: 'Renew Trade License or Commercial Tax Assessment',
    label_am: 'የንግድ ፈቃድ ማደስ ወይም የታክስ ግብር መክፈል',
    label_om: 'Hayyama Daldalaa Haaromsuu fi Gibira Kaffaluu',
    desc_en: 'Commercial registration, taxpayer clearance, and annual business renewals.',
    desc_am: 'የንግድ ምዝገባ፣ የግብር ከፋይ ክሊራንስ እና ዓመታዊ የፈቃድ እድሳት።',
    desc_om: 'Galmee daldalaa fi kaffaltii gibiraa raawwachuu.',
    href: '/services/business-license',
    icon: '💼',
    category: 'BUSINESS',
  },
  {
    id: 'act-invest',
    label_en: 'Apply for Agro-Industrial Corridor Investment Land',
    label_am: 'በጫቻ አግሮ-ኢንዱስትሪ ኮሪደር የኢንቨስትመንት መሬት መጠየቅ',
    label_om: 'Lafa Invastimantii Caccetti Qonnaa fi Industirii Gaafachuu',
    desc_en: 'Explore agro-processing, dairy, and manufacturing plots with 70-year lease security.',
    desc_am: 'የ70 ዓመት የሊዝ ዋስትና ባለው የአግሮ-ኢንዱስትሪ እና የወተት ማቀነባበሪያ መሬት ላይ ኢንቨስት ማድረግ።',
    desc_om: 'Carraawwan invastimantii qonnaa fi industirii qorachuu.',
    href: '/investment',
    icon: '🏭',
    category: 'BUSINESS',
  },
  {
    id: 'act-grievance',
    label_en: 'Submit a Citizen Grievance or Public Inquiry',
    label_am: 'የዜጎች ቅሬታ ወይም ጥቆማ ማቅረብ',
    label_om: 'Komii Lammiiwwanii ykn Gaaffii Dhiyeessuu',
    desc_en: 'Direct submission to Woreda Ombudsperson Desk with SMS tracking code.',
    desc_am: 'በወረዳው የቅሬታ ሰሚ አካል ቀጥታ ክትትል የሚደረግበትና የመከታተያ ኮድ የሚሰጥበት አሰራር።',
    desc_om: 'Komii keessan kallattiin bulchiinsa aanaatti dhiyeessaa.',
    href: '/contact',
    icon: '⚖️',
    category: 'COMPLAINT',
  },
]

export function CitizenActionFinder({ locale }: CitizenActionFinderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [search, setSearch] = useState<string>('')

  const t = {
    en: {
      heading: 'How can the Woreda assist you today?',
      subheading: 'Search procedures, download official requirements, or access instant citizen services.',
      placeholder: 'Type what you want to do (e.g. land certificate, vital registration, business tax, fertilizer)...',
      all: 'All Actions',
      citizen: 'Citizens',
      farmers: 'Farmers & Agriculture',
      business: 'Businesses & Investors',
      grievance: 'Grievance & Legal',
      startBtn: 'Start Service Procedure',
      noMatch: 'No direct matching procedure found. Contact the Woreda Help Desk at +251 58 661 0000 or view all services.',
      viewAll: 'Browse Complete Citizen Catalog (18 Services) →',
    },
    am: {
      heading: 'ዛሬ ምን አገልግሎት ማግኘት ይፈልጋሉ?',
      subheading: 'የአገልግሎት መስፈርቶችን ይመልከቱ፣ ቅጾችን ያውርዱ ወይም ቀጥታ አገልግሎት ያግኙ።',
      placeholder: 'የሚፈልጉትን አገልግሎት ይጻፉ (ለምሳሌ፦ የመሬት ካርታ፣ የልደት ምስክር፣ ንግድ ፈቃድ፣ ማዳበሪያ)...',
      all: 'ሁሉም አገልግሎቶች',
      citizen: 'ለዜጎች',
      farmers: 'ለአርሶ አደሮች',
      business: 'ለንግድና ኢንቨስትመንት',
      grievance: 'ቅሬታና ህጋዊ ጉዳዮች',
      startBtn: 'አገልግሎቱን ጀምር',
      noMatch: 'የተፈለገው አገልግሎት አልተገኘም። በስልክ +251 58 661 0000 ይደውሉ ወይም ሁሉንም አገልግሎቶች ይመልከቱ።',
      viewAll: 'ሁሉንም 18ቱን የህዝብ አገልግሎቶች ይመልከቱ →',
    },
    om: {
      heading: 'Har\'a tajaajila akkamii argachuu barbaaddu?',
      subheading: 'Ulaagaalee tajaajilaa ilaalaa, unkaalee buufadhaa ykn tajaajila argadhaa.',
      placeholder: 'Tajaajila barbaaddan barreessaa (fkn: waraqaa lafaa, ragaa dhalootaa, gibira)...',
      all: 'Tajaajiloota Mara',
      citizen: 'Lammiiwwaniif',
      farmers: 'Qonnaan Bultootaaf',
      business: 'Daldala fi Invastimantii',
      grievance: 'Komii fi Seera',
      startBtn: 'Tajaajila Jalqabaa',
      noMatch: 'Tajaajilli barbaaddan hin argamne. Lakkoofsa +251 58 661 0000 bilbilaa.',
      viewAll: 'Tajaajiloota Uummataa Hunda Ilaalaa →',
    },
  }[locale]

  const filtered = POPULAR_ACTIONS.filter((act) => {
    const matchesCat =
      selectedCategory === 'ALL' ||
      (selectedCategory === 'CITIZEN' && act.category === 'CITIZEN') ||
      (selectedCategory === 'FARMER' && act.category === 'FARMER') ||
      (selectedCategory === 'BUSINESS' && act.category === 'BUSINESS') ||
      (selectedCategory === 'COMPLAINT' && act.category === 'COMPLAINT')

    const term = search.toLowerCase()
    const matchesSearch =
      !term ||
      act.label_en.toLowerCase().includes(term) ||
      act.label_am.includes(term) ||
      act.label_om.toLowerCase().includes(term) ||
      act.desc_en.toLowerCase().includes(term) ||
      act.desc_am.includes(term)

    return matchesCat && matchesSearch
  })

  return (
    <section className="relative -mt-8 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-8 backdrop-blur-md">
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#1a4f8b] bg-blue-50 px-3 py-1 rounded-full border border-blue-200 inline-block mb-2">
            ⚡ Citizen Action Finder • የዜጎች ፈጣን የአገልግሎት መስኮት
          </span>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#0d2340] tracking-tight">
            {t.heading}
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1.5">
            {t.subheading}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative max-w-3xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <svg className="w-5 h-5 text-[#1a4f8b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.placeholder}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 hover:bg-gray-100/70 focus:bg-white border-2 border-gray-200 focus:border-[#1a4f8b] rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 shadow-inner focus:outline-hidden transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 text-sm font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-[#0d2340] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {t.all}
          </button>
          <button
            onClick={() => setSelectedCategory('CITIZEN')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'CITIZEN'
                ? 'bg-[#1a4f8b] text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            👤 {t.citizen}
          </button>
          <button
            onClick={() => setSelectedCategory('FARMER')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'FARMER'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            🌾 {t.farmers}
          </button>
          <button
            onClick={() => setSelectedCategory('BUSINESS')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'BUSINESS'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            💼 {t.business}
          </button>
          <button
            onClick={() => setSelectedCategory('COMPLAINT')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
              selectedCategory === 'COMPLAINT'
                ? 'bg-purple-700 text-white shadow-xs'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            ⚖️ {t.grievance}
          </button>
        </div>

        {/* Action Cards Grid */}
        {filtered.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600 mb-3">{t.noMatch}</p>
            <Link
              href={`/${locale}/services`}
              className="inline-flex items-center text-xs font-bold text-[#1a4f8b] hover:underline"
            >
              {t.viewAll}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((action) => {
              const label =
                locale === 'am' ? action.label_am :
                locale === 'om' ? action.label_om :
                action.label_en

              const desc =
                locale === 'am' ? action.desc_am :
                locale === 'om' ? action.desc_om :
                action.desc_en

              return (
                <Link
                  key={action.id}
                  href={`/${locale}${action.href}`}
                  className="group bg-gradient-to-b from-gray-50/50 to-white hover:to-blue-50/30 border border-gray-200 hover:border-[#1a4f8b] rounded-2xl p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-3xl p-2 bg-white rounded-xl shadow-xs border border-gray-100 group-hover:scale-105 transition-transform">
                        {action.icon}
                      </span>
                      <span className="text-[10px] font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                        {action.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-snug">
                      {label}
                    </h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#1a4f8b]">
                    <span>{t.startBtn}</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <Link
            href={`/${locale}/services`}
            className="text-xs font-bold text-[#1a4f8b] hover:text-[#0d2340] transition-colors inline-flex items-center gap-1.5"
          >
            <span>{t.viewAll}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
