'use client'

import React, { useState, useMemo } from 'react'
import Image from 'next/image'
import type { Locale } from '@/i18n/config'
import type { LeaderData } from '@/data/leadershipData'
import {
  Search,
  SlidersHorizontal,
  Landmark,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Users,
  Building2,
  Sparkles,
  ChevronRight,
  Filter
} from 'lucide-react'

interface LeadershipDirectoryProps {
  leaders: LeaderData[]
  locale: Locale
}

export function LeadershipDirectory({ leaders, locale }: LeadershipDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL')

  const tDict = {
    en: {
      searchPlaceholder: 'Search leaders by name, sector, or office...',
      allCategories: 'All Portfolios',
      allCount: 'Total Roster',
      categories: {
        ALL: 'All Sectors (20)',
        EXECUTIVE: 'Executive & Administration',
        AGRICULTURE: 'Agriculture & Land',
        ECONOMY: 'Economy, Trade & Investment',
        INFRASTRUCTURE: 'Infrastructure & Utilities',
        SOCIAL: 'Health, Education & Culture',
        JUSTICE: 'Peace, Security & Justice',
        PARTY: 'Ruling Party Secretariat',
      },
      cabinetOnly: 'Woreda Cabinet Sector Leaders',
      verifiedGov: 'Official Government Cabinet Member',
      verifiedParty: 'Ruling Party Secretariat Member',
      officeDesk: 'Governing Office',
      mandatesTitle: 'Strategic Mandates & Sector Portfolios',
      noResults: 'No leaders found matching your search.',
      resetFilter: 'Reset Filters',
      totalCount: 'Official Leaders in Woreda Cabinet & Secretariat',
      featuredExecutive: 'Executive Cabinet Leadership',
      allRosterTitle: 'Complete Sector Cabinet Roster',
      maleHon: 'Ato',
      femaleHon: 'W/ro',
    },
    am: {
      searchPlaceholder: 'አመራሮችን በስም፣ በሴክተር ወይም በቢሮ ይፈልጉ...',
      allCategories: 'ሁሉም ዘርፎች',
      allCount: 'አጠቃላይ ዝርዝር',
      categories: {
        ALL: 'ሁሉም ሴክተሮች (20)',
        EXECUTIVE: 'የበላይ አመራርና አስተዳደር',
        AGRICULTURE: 'ግብርና፣ መሬትና እንስሳት',
        ECONOMY: 'ኢኮኖሚ፣ ንግድና ኢንቨስትመንት',
        INFRASTRUCTURE: 'መሰረተ ልማትና ውሃ',
        SOCIAL: 'ጤና፣ ትምህርትና ባህል',
        JUSTICE: 'ሰላም፣ ጸጥታና ፍትሕ',
        PARTY: 'የገዥው ፓርቲ ጽህፈት ቤት',
      },
      cabinetOnly: 'የወረዳው ካቢኔ ሴክተር አመራሮች',
      verifiedGov: 'ይፋዊ የወረዳው ካቢኔ አባል',
      verifiedParty: 'የገዥው ፓርቲ ሴክሬተሪያት አባል',
      officeDesk: 'የሚመሩት ጽህፈት ቤት',
      mandatesTitle: 'ዋና ዋና ስትራቴጂካዊ ተግባራትና ኃላፊነቶች',
      noResults: 'በፍለጋዎ መሰረት የተገኘ አመራር የለም።',
      resetFilter: 'ማጣሪያውን አጽዳ',
      totalCount: 'ይፋዊ የወረዳው ካቢኔና ሴክሬተሪያት አመራሮች',
      featuredExecutive: 'የወረዳው የበላይ ካቢኔ አመራር',
      allRosterTitle: 'የሴክተር መስሪያ ቤቶች ካቢኔ ሙሉ ዝርዝር',
      maleHon: 'አቶ',
      femaleHon: 'ወ/ሮ',
    },
  }
  const t = tDict[locale] || tDict.en

  // Map category filters
  const categoryFilters = [
    { key: 'ALL', label: t.categories.ALL },
    { key: 'EXECUTIVE', label: t.categories.EXECUTIVE },
    { key: 'AGRICULTURE', label: t.categories.AGRICULTURE },
    { key: 'ECONOMY', label: t.categories.ECONOMY },
    { key: 'INFRASTRUCTURE', label: t.categories.INFRASTRUCTURE },
    { key: 'SOCIAL', label: t.categories.SOCIAL },
    { key: 'JUSTICE', label: t.categories.JUSTICE },
    { key: 'PARTY', label: t.categories.PARTY },
  ]

  const matchesCategory = (leader: LeaderData, cat: string) => {
    if (cat === 'ALL') return true
    if (cat === 'PARTY') return !leader.isCabinet
    if (cat === 'EXECUTIVE') {
      return ['chief_admin', 'deputy_admin_revenues', 'administration', 'civil_service', 'planning'].includes(leader.sector_key)
    }
    if (cat === 'AGRICULTURE') {
      return ['agriculture', 'land', 'livestock'].includes(leader.sector_key)
    }
    if (cat === 'ECONOMY') {
      return ['trade', 'investment', 'finance', 'labor_skills'].includes(leader.sector_key)
    }
    if (cat === 'INFRASTRUCTURE') {
      return ['water_energy', 'urban_infrastructure'].includes(leader.sector_key)
    }
    if (cat === 'SOCIAL') {
      return ['health', 'education', 'culture_tourism_sports'].includes(leader.sector_key)
    }
    if (cat === 'JUSTICE') {
      return ['peace_security', 'justice'].includes(leader.sector_key)
    }
    return true
  }

  // Filtered leaders
  const filteredLeaders = useMemo(() => {
    return leaders.filter((l) => {
      const inCat = matchesCategory(l, selectedCategory)
      if (!inCat) return false

      if (!searchQuery.trim()) return true
      const q = searchQuery.toLowerCase().trim()

      const nameMatch =
        l.name_en.toLowerCase().includes(q) ||
        l.name_am.toLowerCase().includes(q)

      const titleMatch =
        l.title_en.toLowerCase().includes(q) ||
        l.title_am.toLowerCase().includes(q)

      const officeMatch =
        l.office_en.toLowerCase().includes(q) ||
        l.office_am.toLowerCase().includes(q)

      const portfolioMatch =
        l.portfolios_en.some((p) => p.toLowerCase().includes(q)) ||
        l.portfolios_am.some((p) => p.toLowerCase().includes(q))

      return nameMatch || titleMatch || officeMatch || portfolioMatch
    })
  }, [leaders, selectedCategory, searchQuery])

  // Top executive leaders (Derese Dememe & Yordanos Tekeste)
  const executiveLeaders = useMemo(() => {
    return leaders.filter((l) => l.id === 'leader-1' || l.id === 'leader-2')
  }, [leaders])

  return (
    <div className="space-y-12">
      {/* Featured Executive Spotlight */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#FED100] rounded-full" />
            <h2 className="text-xl sm:text-2xl font-black text-[#0d2340] tracking-tight">
              {t.featuredExecutive}
            </h2>
          </div>
          <span className="text-xs font-bold text-[#1a4f8b] bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            Top Executive Council
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {executiveLeaders.map((leader, idx) => {
            const name = locale === 'am' ? leader.name_am : leader.name_en
            const secondaryName = locale === 'am' ? leader.name_en : leader.name_am
            const title = locale === 'am' ? leader.title_am : leader.title_en
            const office = locale === 'am' ? leader.office_am : leader.office_en
            const bio = locale === 'am' ? leader.bio_am : leader.bio_en
            const portfolios = (locale === 'am' ? leader.portfolios_am : leader.portfolios_en) || leader.portfolios_en || leader.portfolios_am || []

            return (
              <div
                key={leader.id}
                className="relative bg-gradient-to-br from-[#0c2340] via-[#0e2c52] to-[#143a68] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-white/10 overflow-hidden group hover:border-[#FED100]/50 transition-all duration-300"
              >
                {/* Glow accent */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FED100]/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10 mb-6">
                  {/* Photo or Emblem */}
                  <div className="relative shrink-0">
                    <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden border-2 border-[#FED100] shadow-xl relative bg-[#061426]">
                      {leader.photo ? (
                        <Image
                          src={leader.photo}
                          alt={name}
                          fill
                          className="object-cover group-hover:scale-105 transition duration-500"
                          sizes="128px"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-4xl bg-gradient-to-br from-[#1a4f8b] to-[#0d2340]">
                          <span>{leader.icon || '🏛️'}</span>
                        </div>
                      )}
                    </div>
                    <span className="absolute -bottom-2 -right-2 bg-[#FED100] text-[#0d2340] font-black text-xs px-2.5 py-0.5 rounded-full shadow-md">
                      #{idx + 1}
                    </span>
                  </div>

                  {/* Leader Info */}
                  <div className="text-center sm:text-left min-w-0 flex-1">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[#FED100] text-[11px] font-bold mb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#FED100]" />
                      <span>{t.verifiedGov}</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {name}
                    </h3>
                    <p className="text-xs text-blue-200 font-medium mt-0.5">
                      {secondaryName}
                    </p>
                    <p className="text-sm font-extrabold text-[#FED100] mt-1.5">
                      {title}
                    </p>
                    <p className="text-xs text-gray-300 mt-1 flex items-center justify-center sm:justify-start gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                      <span className="line-clamp-1">{office}</span>
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs sm:text-sm text-gray-200 italic bg-white/5 border-l-2 border-[#FED100] p-3.5 rounded-r-xl mb-5 leading-relaxed">
                  &ldquo;{bio}&rdquo;
                </p>

                {/* Portfolios */}
                <div className="space-y-2 pt-4 border-t border-white/10">
                  <p className="text-[11px] font-bold text-[#FED100] uppercase tracking-wider">
                    {t.mandatesTitle}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-200">
                    {(portfolios || []).slice(0, 4).map((p, pIdx) => (
                      <div key={pIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-[11px] sm:text-xs leading-snug">{p}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Directory Section with Search and Filters */}
      <div className="pt-6">
        {/* Section Heading & Stats Bar */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#1a4f8b] border border-blue-200 text-xs font-bold mb-2">
                <Landmark className="w-3.5 h-3.5" />
                <span>{t.cabinetOnly}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0d2340] tracking-tight">
                {t.allRosterTitle}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {locale === 'am'
                  ? 'የአንጎሌላ ተራ ወረዳ የ20ዎቹም ሴክተር መስሪያ ቤቶች ዋና ኃላፊዎች ይፋዊ ማውጫ'
                  : 'Authoritative roster of all 20 Woreda sector bureau heads and key cabinet leadership.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 text-center shrink-0">
                <span className="block text-2xl font-black text-[#1a4f8b]">20</span>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  {locale === 'am' ? 'የሴክተር ጽ/ቤቶች' : 'Sector Offices'}
                </span>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-center shrink-0">
                <span className="block text-2xl font-black text-[#c8931a]">19+2</span>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  {locale === 'am' ? 'ቀበሌዎች' : 'Kebeles'}
                </span>
              </div>
            </div>
          </div>

          {/* Search Input & Live Filter Controls */}
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm text-[#0d2340] placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b] focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 hover:text-gray-600 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded-md transition"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-gray-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>{locale === 'am' ? 'ዘርፍ:' : 'Sector:'}</span>
              </span>
              {categoryFilters.map((cat) => {
                const isActive = selectedCategory === cat.key
                return (
                  <button
                    key={cat.key}
                    onClick={() => setSelectedCategory(cat.key)}
                    className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
                      isActive
                        ? 'bg-[#1a4f8b] text-white shadow-sm ring-2 ring-[#1a4f8b]/30'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between mb-6 px-1">
          <p className="text-xs sm:text-sm font-semibold text-gray-600">
            {locale === 'am'
              ? `የተገኙ አመራሮች: ${filteredLeaders.length}`
              : `Showing ${filteredLeaders.length} official leaders`}
          </p>
          {(searchQuery || selectedCategory !== 'ALL') && (
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('ALL')
              }}
              className="text-xs font-bold text-[#1a4f8b] hover:underline"
            >
              {t.resetFilter}
            </button>
          )}
        </div>

        {/* Leaders Grid (All 20 Sector Leaders) */}
        {filteredLeaders.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center space-y-3">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base font-bold text-[#0d2340]">{t.noResults}</h3>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('ALL')
              }}
              className="text-xs font-bold text-white bg-[#1a4f8b] px-4 py-2 rounded-xl"
            >
              {t.resetFilter}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLeaders.map((leader, idx) => {
              const name = locale === 'am' ? leader.name_am : leader.name_en
              const secondaryName = locale === 'am' ? leader.name_en : leader.name_am
              const title = locale === 'am' ? leader.title_am : leader.title_en
              const office = locale === 'am' ? leader.office_am : leader.office_en
              const bio = locale === 'am' ? leader.bio_am : leader.bio_en
              const category = locale === 'am' ? leader.category_am : leader.category_en
              const portfolios = (locale === 'am' ? leader.portfolios_am : leader.portfolios_en) || leader.portfolios_en || leader.portfolios_am || []

              return (
                <div
                  key={leader.id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:shadow-lg hover:border-[#1a4f8b]/50 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Row: Sector Badge + Order number */}
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-[#1a4f8b] border border-blue-100 truncate max-w-[200px]">
                        {category}
                      </span>
                      <span className="text-xs font-black px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600 shrink-0">
                        #{leader.displayOrder}
                      </span>
                    </div>

                    {/* Header: Photo / Insignia + Name + Role */}
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border-2 border-gray-100 group-hover:border-[#c8931a] transition-colors relative bg-gradient-to-br from-[#0c2340] to-[#1a4f8b] flex items-center justify-center text-white text-2xl shadow-sm">
                        {leader.photo ? (
                          <Image
                            src={leader.photo}
                            alt={name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        ) : (
                          <span>{leader.icon || '🏛️'}</span>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-bold text-[#0d2340] leading-snug group-hover:text-[#1a4f8b] transition-colors">
                          {name}
                        </h3>
                        <p className="text-[11px] text-gray-400 font-medium truncate">
                          {secondaryName}
                        </p>
                        <p className="text-xs font-bold text-[#c8931a] mt-1 line-clamp-2">
                          {title}
                        </p>
                      </div>
                    </div>

                    {/* Governing Office */}
                    <div className="mb-4 bg-gray-50 border border-gray-100 rounded-xl p-2.5 flex items-center gap-2 text-xs text-gray-700">
                      <Building2 className="w-4 h-4 text-[#1a4f8b] shrink-0" />
                      <span className="line-clamp-1 font-medium">{office}</span>
                    </div>

                    {/* Bio Summary */}
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4 italic">
                      &ldquo;{bio}&rdquo;
                    </p>

                    {/* Key Portfolios (check marks) */}
                    <div className="space-y-1.5 mb-5 pt-3 border-t border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        {t.mandatesTitle}
                      </p>
                      {(portfolios || []).slice(0, 3).map((item, pIdx) => (
                        <div key={pIdx} className="flex items-start gap-2 text-xs text-gray-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1 leading-tight">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer verification info */}
                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400 flex items-center gap-1 font-medium">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{leader.isCabinet ? 'Official Cabinet' : 'Party Office'}</span>
                    </span>

                    {leader.sourceUrl ? (
                      <a
                        href={leader.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#1a4f8b] hover:text-[#c8931a] font-semibold flex items-center gap-1 hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Source</span>
                      </a>
                    ) : (
                      <span className="text-gray-400 text-[10px]">Angolela Tera</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
