'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import {
  Search,
  Clock,
  CreditCard,
  Building,
  ArrowRight,
  ShieldCheck,
  FileText,
  Filter,
} from 'lucide-react'

interface ServicesDirectoryProps {
  initialServices: any[]
  locale: Locale
}

export function ServicesDirectory({ initialServices, locale }: ServicesDirectoryProps) {
  const isAm = locale === 'am'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  const categories = useMemo(() => {
    return [
      { key: 'ALL', label: isAm ? 'ሁሉም አገልግሎቶች' : 'All Services' },
      { key: 'Civil Registration', label: isAm ? 'ወሳኝ ኩነት (ልደት/ጋብቻ)' : 'Civil Status & Vital' },
      { key: 'Land Administration', label: isAm ? 'የመሬት ይዞታና ካዳስተር' : 'Land & Cadastre' },
      { key: 'Agriculture & Extension', label: isAm ? 'ግብርናና ግብዓት' : 'Agriculture' },
      { key: 'Trade & Licensing', label: isAm ? 'ንግድና ፈቃድ' : 'Trade & Permits' },
      { key: 'Social Services', label: isAm ? 'ጤናና ማህበራዊ' : 'Health & Social' },
    ]
  }, [isAm])

  const filteredServices = useMemo(() => {
    return initialServices.filter((srv) => {
      if (srv.status === 'ARCHIVED') return false

      const title = (isAm ? (srv.title_am || srv.title_en) : srv.title_en) || ''
      const desc = (isAm ? (srv.description_am || srv.description_en) : srv.description_en) || ''
      const category = (isAm ? (srv.category_am || srv.category_en) : srv.category_en) || srv.category || ''
      const office = (isAm ? (srv.officeName_am || srv.officeName_en) : srv.officeName_en) || ''

      const matchesSearch =
        !searchQuery.trim() ||
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.toLowerCase().includes(searchQuery.toLowerCase()) ||
        category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory =
        selectedCategory === 'ALL' ||
        category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
        (selectedCategory === 'Civil Registration' && (category.includes('Civil') || category.includes('ኩነት') || category.includes('ምዝገባ'))) ||
        (selectedCategory === 'Land Administration' && (category.includes('Land') || category.includes('መሬት'))) ||
        (selectedCategory === 'Agriculture & Extension' && (category.includes('Agri') || category.includes('ግብርና'))) ||
        (selectedCategory === 'Trade & Licensing' && (category.includes('Trade') || category.includes('ንግድ') || category.includes('ፈቃድ'))) ||
        (selectedCategory === 'Social Services' && (category.includes('Health') || category.includes('Social') || category.includes('ጤና') || category.includes('ትምህርት')))

      return matchesSearch && matchesCategory
    })
  }, [initialServices, searchQuery, selectedCategory, isAm])

  const content = {
    searchPlaceholder: isAm ? 'በአገልግሎት ስም፣ ጽ/ቤት ወይም ቁልፍ ቃል ይፈልጉ...' : 'Search services by name, bureau, or keyword...',
    timeLabel: isAm ? 'የሚፈጀው ጊዜ' : 'Processing Time',
    costLabel: isAm ? 'ህጋዊ ክፍያ' : 'Statutory Fee',
    officeLabel: isAm ? 'አገልግሎት ሰጪው ቢሮ' : 'Service Desk',
    viewGuide: isAm ? 'የአገልግሎት መመሪያና ቅድመ ሁኔታዎችን ይመልከቱ' : 'Read Guide & Requirements',
    trackingTitle: isAm ? 'ቀደም ሲል ያመለከቱትን አገልግሎት ይከታተሉ' : 'Track an Existing Service Application or Petition',
    trackingDesc: isAm
      ? 'የተሰጠዎትን የክትትል ኮድ (ምሳሌ፡ AT-GR-2026-0042) በመጠቀም የጉዳይዎን ደረጃ እና አስተዳደራዊ ምላሽ ይመልከቱ።'
      : 'Enter your official reference number to inspect processing progress, assigned sector desks, and decision notes.',
    trackBtn: isAm ? 'የጉዳይ ደረጃን አረጋግጥ' : 'Check Request Status',
    emptyTitle: isAm ? 'ምንም አይነት አገልግሎት አልተገኘም' : 'No matching services found',
    emptyDesc: isAm ? 'እባክዎ የተለየ የፍለጋ ቃል ወይም ሁሉንም ዘርፎች መርጠው ይሞክሩ።' : 'Try adjusting your search criteria or select All Services.',
  }

  return (
    <div className="space-y-8">
      {/* Search Bar & Category Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={content.searchPlaceholder}
            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm text-[#0d2340] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 ml-1 hidden sm:block" />
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                selectedCategory === cat.key
                  ? 'bg-[#1a4f8b] text-white shadow-xs'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Direct Application Tracking Card */}
      <div className="bg-gradient-to-r from-blue-900 to-[#0d2340] text-white rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>{isAm ? 'ይፋዊ የክትትል መስኮት' : 'Citizen Tracking Portal'}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight">
            {content.trackingTitle}
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 mt-1.5 leading-relaxed">
            {content.trackingDesc}
          </p>
        </div>

        <Link
          href={`/${locale}/track`}
          className="inline-flex items-center gap-2 bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] text-xs font-extrabold px-6 py-3 rounded-xl shadow-xs transition-colors shrink-0"
        >
          <span>{content.trackBtn}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Services Grid */}
      {filteredServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredServices.map((srv: any) => {
            const title = isAm ? (srv.title_am || srv.title_en) : srv.title_en
            const category = isAm ? (srv.category_am || srv.category_en) : srv.category_en || srv.category
            const officeName = isAm ? (srv.officeName_am || srv.officeName_en) : srv.officeName_en || srv.officeName
            const time = isAm ? (srv.processingTime_am || srv.processingTime_en) : srv.processingTime_en || srv.processingTime
            const cost = isAm ? (srv.cost_am || srv.cost_en) : srv.cost_en || srv.cost
            const desc = isAm ? (srv.description_am || srv.description_en) : srv.description_en || srv.description

            return (
              <div
                key={srv.slug}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="text-[11px] font-bold text-[#1a4f8b] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
                      {category}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-700" />
                      <span>{time}</span>
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0d2340] hover:text-[#1a4f8b] transition-colors leading-snug">
                    <Link href={`/${locale}/services/${srv.slug}`}>
                      {title}
                    </Link>
                  </h3>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed line-clamp-3">
                    {desc}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <CreditCard className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-semibold text-[#0d2340] w-28 shrink-0">
                        {content.costLabel}:
                      </span>
                      <span className="text-gray-900 font-medium">
                        {cost}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-700">
                      <Building className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                      <span className="font-semibold text-[#0d2340] w-28 shrink-0">
                        {content.officeLabel}:
                      </span>
                      <span className="text-gray-600 truncate">
                        {officeName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/${locale}/services/${srv.slug}`}
                    className="w-full text-center inline-flex items-center justify-center gap-1.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-semibold py-2.5 px-4 rounded-xl shadow-xs transition-colors"
                  >
                    <span>{content.viewGuide}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center max-w-md mx-auto">
          <FileText className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-gray-800">{content.emptyTitle}</h3>
          <p className="text-xs text-gray-500 mt-1">{content.emptyDesc}</p>
          <button
            onClick={() => {
              setSearchQuery('')
              setSelectedCategory('ALL')
            }}
            className="mt-4 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-[#0d2340] text-xs font-bold rounded-lg transition-colors"
          >
            {isAm ? 'ፍለጋውን ዳግም አስጀምር' : 'Reset Filters'}
          </button>
        </div>
      )}
    </div>
  )
}
