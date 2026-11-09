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
  desc_en: string
  desc_am: string
  href: string
  icon: string
  category: 'CITIZEN' | 'BUSINESS' | 'FARMER' | 'COMPLAINT'
  processingTime_en: string
  processingTime_am: string
  fee_en: string
  fee_am: string
  documents_en: string[]
  documents_am: string[]
  office_en: string
  office_am: string
}

const POPULAR_ACTIONS: ActionItem[] = [
  {
    id: 'act-land',
    label_en: 'Verify or Register Land Holding',
    label_am: 'የገጠር መሬት ይዞታ ማረጋገጥ ወይም መመዝገብ',
    desc_en: 'Get green book certificate, boundary verification, or parcel inheritance transfer.',
    desc_am: 'የይዞታ ደብተር፣ የወሰን ማረጋገጫና የወራሽነት ዝውውር አገልግሎት ማግኘት።',
    href: '/services/land-certificate',
    icon: '🗺️',
    category: 'CITIZEN',
    processingTime_en: '2–5 Working Days',
    processingTime_am: 'ከ 2–5 የስራ ቀናት',
    fee_en: '50 ETB (Service Stamp)',
    fee_am: '50 ብር (የቴምብር ክፍያ)',
    documents_en: ['Kebele Resident ID', 'Previous Holding Proof', '2 Passport Photos'],
    documents_am: ['የቀበሌ ነዋሪነት መታወቂያ', 'የቀድሞ ይዞታ ማረጋገጫ', '2 ጉርድ ፎቶግራፍ'],
    office_en: 'Land Administration & Use Desk',
    office_am: 'የመሬት አስተዳደርና አጠቃቀም ጽ/ቤት',
  },
  {
    id: 'act-civil',
    label_en: 'Obtain Vital Events Certificate (Birth, Marriage, Death)',
    label_am: 'የወሳኝ ኩነት ምዝገባ (ልደት፣ ጋብቻ፣ ሞት) ምስክር ወረቀት',
    desc_en: 'Official vital registration records issued by Kebele and Civil Registry Desk.',
    desc_am: 'በቀበሌ እና በወረዳ ወሳኝ ኩነት ጽ/ቤት የሚሰጥ ህጋዊ የምስክር ወረቀት።',
    href: '/services/civil-registration',
    icon: '📜',
    category: 'CITIZEN',
    processingTime_en: 'Same Day / 24 Hours',
    processingTime_am: 'በተመሳሳይ ቀን / 24 ሰዓት',
    fee_en: 'Free (Within 90 days)',
    fee_am: 'ነፃ (በ90 ቀናት ውስጥ)',
    documents_en: ['Notification Slip from Health Facility', 'Parents/Spouse IDs'],
    documents_am: ['ከጤና ተቋም የተሰጠ ማስረጃ', 'የወላጆች/የትዳር አጋር መታወቂያ'],
    office_en: 'Vital Events Registration Desk',
    office_am: 'የወሳኝ ኩነት ምዝገባ አገልግሎት',
  },
  {
    id: 'act-seeds',
    label_en: 'Request Certified Agricultural Seeds & Fertilizer',
    label_am: 'ምርጥ ዘር እና የአፈር ማዳበሪያ አቅርቦት መጠየቅ',
    desc_en: 'Rust-resistant wheat, barley, teff, and urea/NPS supply for farming season.',
    desc_am: 'ለእርሻ ወቅት የሚሆን የስንዴ፣ ገብስ፣ ጤፍ ምርጥ ዘር እና ዩሪያ/ኤን.ፒ.ኤስ ማዳበሪያ።',
    href: '/services/agriculture',
    icon: '🌾',
    category: 'FARMER',
    processingTime_en: '1 Working Day (Seasonal distribution)',
    processingTime_am: '1 የስራ ቀን (ወቅታዊ ስርጭት)',
    fee_en: 'Subsidized Market Rate via Farmers Union',
    fee_am: 'በገበሬዎች ዩኒየን በድጎማ ዋጋ',
    documents_en: ['Kebele DA Voucher', 'Farmer Cooperative Card'],
    documents_am: ['የቀበሌ ግብርና ባለሙያ ቫውቸር', 'የህብረት ስራ ማህበር አባልነት ካርድ'],
    office_en: 'Agriculture & Rural Development Office',
    office_am: 'የግብርናና ገጠር ልማት ጽ/ቤት',
  },
  {
    id: 'act-permit',
    label_en: 'Renew Trade License or Commercial Tax Assessment',
    label_am: 'የንግድ ፈቃድ ማደስ ወይም የታክስ ግብር መክፈል',
    desc_en: 'Commercial registration, taxpayer clearance, and annual business renewals.',
    desc_am: 'የንግድ ምዝገባ፣ የግብር ከፋይ ክሊራንስ እና ዓመታዊ የፈቃድ እድሳት።',
    href: '/services/business-license',
    icon: '💼',
    category: 'BUSINESS',
    processingTime_en: '1–2 Working Days',
    processingTime_am: 'ከ 1–2 የስራ ቀናት',
    fee_en: 'Based on Commercial Category & Capital',
    fee_am: 'እንደ ንግድ ደረጃውና ካፒታሉ የሚወሰን',
    documents_en: ['Tax Clearance Certificate', 'Current Business License', 'Lease Contract'],
    documents_am: ['የታክስ ክሊራንስ', 'ያለፈው ዓመት የንግድ ፈቃድ', 'የኪራይ ውል'],
    office_en: 'Trade & Industry Development Desk',
    office_am: 'የንግድና ኢንዱስትሪ ልማት ጽ/ቤት',
  },
  {
    id: 'act-invest',
    label_en: 'Apply for Agro-Industrial Corridor Investment Land',
    label_am: 'በጫጫ አግሮ-ኢንዱስትሪ ኮሪደር የኢንቨስትመንት መሬት መጠየቅ',
    desc_en: 'Explore agro-processing, dairy, and manufacturing plots with 70-year lease security.',
    desc_am: 'የ70 ዓመት የሊዝ ዋስትና ባለው የአግሮ-ኢንዱስትሪ እና የወተት ማቀነባበሪያ መሬት ላይ ኢንቨስት ማድረግ።',
    href: '/investment',
    icon: '🏭',
    category: 'BUSINESS',
    processingTime_en: '3–7 Days (Fast-Track 1-Stop Desk)',
    processingTime_am: 'ከ 3–7 ቀናት (ፈጣን የአንድ መስኮት አገልግሎት)',
    fee_en: 'Investment Application Verification (Standard)',
    fee_am: 'የኢንቨስትመንት ማመልከቻ ማረጋገጫ ክፍያ',
    documents_en: ['Feasibility Study / Project Proposal', 'Bank Statement', 'Company Registration'],
    documents_am: ['የፕሮጀክት ማዋጣት ጥናት (Project Proposal)', 'የባንክ ሂሳብ መግለጫ', 'የድርጅት ምዝገባ'],
    office_en: 'Woreda Investment & Industry Bureau',
    office_am: 'የወረዳው ኢንቨስትመንትና ኢንዱስትሪ ጽ/ቤት',
  },
  {
    id: 'act-grievance',
    label_en: 'Submit a Citizen Grievance or Public Inquiry',
    label_am: 'የዜጎች ቅሬታ ወይም ጥቆማ ማቅረብ',
    desc_en: 'Direct submission to Woreda Ombudsperson Desk with SMS tracking code.',
    desc_am: 'በወረዳው የቅሬታ ሰሚ አካል ቀጥታ ክትትል የሚደረግበትና የመከታተያ ኮድ የሚሰጥበት አሰራር።',
    href: '/contact',
    icon: '⚖️',
    category: 'COMPLAINT',
    processingTime_en: '3 Working Days (Immediate Tracking Code)',
    processingTime_am: '3 የስራ ቀናት (ወዲያውኑ የመከታተያ ኮድ ይሰጣል)',
    fee_en: 'Free Public Grievance Service',
    fee_am: 'ሙሉ በሙሉ ነፃ አገልግሎት',
    documents_en: ['Written statement or incident summary', 'Relevant supporting documents'],
    documents_am: ['የተዘጋጀ የቅሬታ ማመልከቻ', 'አስረጂ ማስረጃዎች (ካሉ)'],
    office_en: 'Chief Administrator Grievance & Inspection Desk',
    office_am: 'የዋና አስተዳዳሪ የቅሬታና ቁጥጥር መስኮት',
  },
]

export function CitizenActionFinder({ locale }: CitizenActionFinderProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')
  const [search, setSearch] = useState<string>('')
  const [previewActionId, setPreviewActionId] = useState<string | null>(null)

  const isAm = locale === 'am'

  const tDict = {
    en: {
      heading: 'How can the Woreda assist you today?',
      subheading:
        'Search procedures, inspect official requirements, or access verified citizen services directly.',
      placeholder:
        'Type what you need (e.g. land certificate, vital registration, business tax, seeds, investment)...',
      all: 'All Actions',
      citizen: 'Citizens',
      farmers: 'Farmers & Agriculture',
      business: 'Businesses & Investors',
      grievance: 'Grievance & Legal',
      startBtn: 'Begin Procedure',
      previewBtn: 'View Requirements',
      closePreview: 'Close',
      time: 'Processing Time',
      cost: 'Official Fee',
      docs: 'Required Documents',
      desk: 'Responsible Desk',
      noMatch:
        'No direct matching procedure found. Contact the Woreda Help Desk at +251 58 661 0201 or view all cataloged services.',
      viewAll: 'Browse Complete Citizen Catalog (18 Services) →',
    },
    am: {
      heading: 'ዛሬ ምን አገልግሎት ማግኘት ይፈልጋሉ?',
      subheading:
        'የአገልግሎት መስፈርቶችን ይመልከቱ፣ ቅጾችን ያውርዱ ወይም ቀጥታ አገልግሎት ያግኙ።',
      placeholder:
        'የሚፈልጉትን አገልግሎት ይጻፉ (ለምሳሌ፦ የመሬት ካርታ፣ የልደት ምስክር፣ ንግድ ፈቃድ፣ ማዳበሪያ)...',
      all: 'ሁሉም አገልግሎቶች',
      citizen: 'ለዜጎች',
      farmers: 'ለአርሶ አደሮች',
      business: 'ለንግድና ኢንቨስትመንት',
      grievance: 'ቅሬታና ህጋዊ ጉዳዮች',
      startBtn: 'አገልግሎቱን ጀምር',
      previewBtn: 'መስፈርቱን ተመልከት',
      closePreview: 'ዝጋ',
      time: 'የሚፈጀው ጊዜ',
      cost: 'የአገልግሎት ክፍያ',
      docs: 'አስፈላጊ ሰነዶች',
      desk: 'ኃላፊው ጽ/ቤት',
      noMatch:
        'የተፈለገው አገልግሎት አልተገኘም። በስልክ +251 58 661 0201 ይደውሉ ወይም ሁሉንም አገልግሎቶች ይመልከቱ።',
      viewAll: 'ሁሉንም 18ቱን የህዝብ አገልግሎቶች ይመልከቱ →',
    },
  }
  const t = tDict[locale] || tDict.en

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
      act.desc_en.toLowerCase().includes(term) ||
      act.desc_am.includes(term)

    return matchesCat && matchesSearch
  })

  const previewItem = POPULAR_ACTIONS.find((a) => a.id === previewActionId)

  return (
    <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white/95 rounded-3xl shadow-2xl border border-gray-200/80 p-6 sm:p-8 lg:p-10 backdrop-blur-xl transition-all">
        {/* Section Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-[#1a4f8b] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-200/80 mb-2 shadow-xs">
            <span className="animate-pulse">⚡</span>
            <span>Citizen Action Finder • የዜጎች ፈጣን የአገልግሎት መስኮት</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#0d2340] tracking-tight">
            {t.heading}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            {t.subheading}
          </p>
        </div>

        {/* Dynamic Search Bar with Instant Clear */}
        <div className="relative max-w-3xl mx-auto mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
            <svg
              className="w-5 h-5 text-[#1a4f8b]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.placeholder}
            className="w-full pl-12 pr-10 py-3.5 bg-gray-50/80 hover:bg-gray-100/70 focus:bg-white border-2 border-gray-200 focus:border-[#1a4f8b] rounded-2xl text-xs sm:text-sm text-gray-800 placeholder-gray-400 shadow-inner focus:outline-hidden transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-700 text-sm font-bold cursor-pointer"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Interactive Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[
            { key: 'ALL', label: t.all, icon: '🏛️', color: 'bg-[#0d2340]' },
            { key: 'CITIZEN', label: t.citizen, icon: '👤', color: 'bg-[#1a4f8b]' },
            { key: 'FARMER', label: t.farmers, icon: '🌾', color: 'bg-emerald-700' },
            { key: 'BUSINESS', label: t.business, icon: '💼', color: 'bg-amber-700' },
            { key: 'COMPLAINT', label: t.grievance, icon: '⚖️', color: 'bg-purple-700' },
          ].map((cat) => {
            const isSelected = selectedCategory === cat.key
            return (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-xs ${
                  isSelected
                    ? `${cat.color} text-white shadow-md scale-105`
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-[#0d2340]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((action) => {
              const label = isAm ? action.label_am : action.label_en
              const desc = isAm ? action.desc_am : action.desc_en
              const isInspected = previewActionId === action.id

              return (
                <div
                  key={action.id}
                  className={`group relative bg-gradient-to-b from-gray-50/70 to-white hover:to-blue-50/20 border rounded-2xl p-5 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 ${
                    isInspected
                      ? 'border-[#c8931a] ring-2 ring-[#c8931a]/30 shadow-lg'
                      : 'border-gray-200 hover:border-[#1a4f8b]'
                  }`}
                >
                  <div>
                    {/* Header badge & icon */}
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <span className="text-3xl p-2.5 bg-white rounded-xl shadow-xs border border-gray-100 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-200">
                        {action.icon}
                      </span>
                      <span className="text-[10px] font-extrabold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
                        {action.category}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-snug">
                      {label}
                    </h3>

                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {desc}
                    </p>

                    {/* Quick Specs Micro-Badges */}
                    <div className="mt-3.5 flex flex-wrap gap-2 text-[11px] text-gray-500 font-medium">
                      <span className="bg-gray-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                        ⏱️ {isAm ? action.processingTime_am : action.processingTime_en}
                      </span>
                      <span className="bg-gray-100/90 px-2 py-0.5 rounded-md flex items-center gap-1">
                        💰 {isAm ? action.fee_am : action.fee_en}
                      </span>
                    </div>
                  </div>

                  {/* Action Controls */}
                  <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setPreviewActionId(isInspected ? null : action.id)
                      }
                      className="text-[11px] font-bold text-gray-600 hover:text-[#1a4f8b] px-2 py-1 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                    >
                      {isInspected ? `✕ ${t.closePreview}` : `ℹ️ ${t.previewBtn}`}
                    </button>

                    <Link
                      href={`/${locale}${action.href}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#1a4f8b] group-hover:text-[#133a6b] transition-colors hover:underline"
                    >
                      <span>{t.startBtn}</span>
                      <span className="group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Interactive Requirements Inspection Drawer / Modal */}
        {previewItem && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50/90 via-white to-amber-50/50 border-2 border-[#1a4f8b]/30 rounded-2xl shadow-lg animate-fadeIn">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-bold text-[#c8931a] uppercase tracking-wider bg-amber-100/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Official Requirements Verification
                </span>
                <h4 className="text-base font-extrabold text-[#0d2340] mt-1">
                  {isAm ? previewItem.label_am : previewItem.label_en}
                </h4>
              </div>
              <button
                onClick={() => setPreviewActionId(null)}
                className="text-gray-400 hover:text-gray-700 text-lg font-bold p-1 cursor-pointer"
                aria-label="Close preview"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <span className="text-gray-400 font-semibold uppercase block mb-1">
                  ⏱️ {t.time}
                </span>
                <span className="font-bold text-[#0d2340]">
                  {isAm ? previewItem.processingTime_am : previewItem.processingTime_en}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <span className="text-gray-400 font-semibold uppercase block mb-1">
                  💰 {t.cost}
                </span>
                <span className="font-bold text-[#0d2340]">
                  {isAm ? previewItem.fee_am : previewItem.fee_en}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <span className="text-gray-400 font-semibold uppercase block mb-1">
                  🏢 {t.desk}
                </span>
                <span className="font-bold text-[#0d2340]">
                  {isAm ? previewItem.office_am : previewItem.office_en}
                </span>
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-gray-200">
                <span className="text-gray-400 font-semibold uppercase block mb-1">
                  📋 {t.docs}
                </span>
                <ul className="list-disc list-inside text-gray-700 font-medium space-y-0.5">
                  {(isAm ? previewItem.documents_am : previewItem.documents_en).map((doc, i) => (
                    <li key={i}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-200/60 flex items-center justify-end gap-3">
              <Link
                href={`/${locale}${previewItem.href}`}
                className="inline-flex items-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
              >
                <span>{t.startBtn}</span>
                <span>→</span>
              </Link>
            </div>
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
