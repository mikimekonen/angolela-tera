'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'

interface SearchResult {
  id: string
  type: string
  categoryLabel: string
  title: string
  title_am?: string
  description?: string
  url: string
  badge?: string
}

const CATEGORIES = [
  { id: 'all', label_en: 'All Categories', label_am: 'ሁሉም' },
  { id: 'services', label_en: 'Citizen Services', label_am: 'የህዝብ አገልግሎቶች' },
  { id: 'offices', label_en: 'Sector Offices', label_am: 'የሴክተር መስሪያ ቤቶች' },
  { id: 'news', label_en: 'News & Press', label_am: 'ዜናና መግለጫዎች' },
  { id: 'tourism', label_en: 'Tourism Destinations', label_am: 'የቱሪዝም መስህቦች' },
  { id: 'projects', label_en: 'Development Projects', label_am: 'የልማት ፕሮጀክቶች' },
  { id: 'investment', label_en: 'Investment', label_am: 'ኢንቨስትመንት' },
  { id: 'documents', label_en: 'Forms & Documents', label_am: 'ቅጾችና ሰነዶች' },
  { id: 'kebeles', label_en: 'Kebeles & Towns', label_am: 'ቀበሌዎችና ከተሞች' },
  { id: 'companies', label_en: 'Enterprises', label_am: 'ድርጅቶች' },
  { id: 'tenders', label_en: 'Public Tenders', label_am: 'ጨረታዎች' },
]

export default function SearchPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen py-16 text-center text-gray-500">Loading search...</div>}>
      <SearchContent />
    </React.Suspense>
  )
}

function SearchContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = (params?.locale as string) || 'en'
  const isAm = locale === 'am'

  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [selectedCat, setSelectedCat] = useState('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    if (initialQuery.trim()) {
      executeSearch(initialQuery, selectedCat)
    }
  }, [initialQuery])

  const executeSearch = async (searchTerm: string, category: string) => {
    if (!searchTerm.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    try {
      setLoading(true)
      setSearched(true)
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(searchTerm.trim())}&category=${category}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setResults(data.data)
      } else {
        setResults([])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    executeSearch(query, selectedCat)
  }

  const handleCategoryChange = (catId: string) => {
    setSelectedCat(catId)
    if (query.trim()) {
      executeSearch(query, catId)
    }
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            {isAm ? 'የፖርታል አጠቃላይ ፍለጋ' : 'Unified Global Portal Search'}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
            {isAm ? 'የአንጎሌላ ተራ መረጃዎችን ይፈልጉ' : 'Search Angolela Tera Public Portal'}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            {isAm
              ? 'አገልግሎቶች፣ ሴክተር መስሪያ ቤቶች፣ ዜናዎች፣ ሰነዶች፣ ኢንቨስትመንት፣ ቱሪዝም እና የልማት ፕሮጀክቶችን በአንድ ላይ ያግኙ።'
              : 'Find citizen services, sector offices, news, official forms, investment opportunities, tourism, and development projects in one place.'}
          </p>

          {/* Search Input Bar */}
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAm ? 'ለምሳሌ፡ የልደት ምስክር ወረቀት፣ ጫቻ፣ ግብርና፣ ኢንቨስትመንት...' : 'e.g. Birth certificate, Chacha, Agriculture, Investment, Roads...'}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 text-sm focus:border-[#1a4f8b] focus:bg-white focus:outline-none transition-all shadow-inner"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-[#1a4f8b] hover:bg-[#133a6b] text-white font-bold text-sm rounded-xl transition-colors shadow-md cursor-pointer shrink-0"
            >
              {isAm ? 'ፈልግ' : 'Search Portal'}
            </button>
          </form>

          {/* Category Filter Pills */}
          <div className="mt-5 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                  selectedCat === cat.id
                    ? 'bg-[#1a4f8b] text-white shadow-xs'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {isAm ? cat.label_am : cat.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Results Area */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 shadow-xs">
            <div className="inline-block animate-spin text-2xl mb-2">⏳</div>
            <p className="text-sm font-medium">{isAm ? 'ፍለጋው በሂደት ላይ ነው...' : 'Searching woreda registry...'}</p>
          </div>
        ) : searched && results.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500 shadow-xs">
            <p className="text-base font-bold text-[#0d2340] mb-1">
              {isAm ? 'ምንም አይነት ውጤት አልተገኘም' : 'No matching results found'}
            </p>
            <p className="text-xs text-gray-500">
              {isAm
                ? `ለ "${query}" የተገኘ መረጃ የለም። እባክዎ ሌሎች ቃላትን ተጠቅመው ይሞክሩ።`
                : `No results found for "${query}". Try searching with different keywords or switch categories.`}
            </p>
          </div>
        ) : results.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
              <span>{isAm ? `የተገኙ ውጤቶች (${results.length})` : `Found ${results.length} result(s)`}</span>
              <span>{isAm ? 'ይፋዊ የመንግሥት መረጃ' : 'Official Woreda Records'}</span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {results.map((res) => {
                const title = isAm ? (res.title_am || res.title) : res.title

                return (
                  <Link
                    key={res.id}
                    href={`/${locale}${res.url}`}
                    className="block bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-[#1a4f8b] hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-xs font-semibold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                        {res.categoryLabel}
                      </span>
                      {res.badge && (
                        <span className="text-[11px] text-gray-500 font-medium">
                          {res.badge}
                        </span>
                      )}
                    </div>

                    <h2 className="text-base sm:text-lg font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors">
                      {title}
                    </h2>

                    {res.description && (
                      <p className="text-xs sm:text-sm text-gray-600 mt-1.5 leading-relaxed line-clamp-2">
                        {res.description}
                      </p>
                    )}

                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                      <span className="group-hover:text-[#1a4f8b] font-medium transition-colors">
                        {isAm ? 'ዝርዝር መረጃ ይመልከቱ →' : 'View details →'}
                      </span>
                      <span className="font-mono text-[11px] text-gray-300">/{locale}{res.url}</span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
