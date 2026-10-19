'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { Locale } from '@/i18n/config'

interface SearchResult {
  id: string
  title: string
  description?: string
  category: string
  href: string
  categoryColor: string
}

interface GlobalSearchProps {
  locale: Locale
  placeholder?: string
}

const CATS: Record<string, { label: string; amLabel: string; bgClass: string }> = {
  news:        { label: 'News',       amLabel: 'ዜና',         bgClass: 'bg-blue-100 text-blue-800' },
  services:    { label: 'Services',   amLabel: 'አገልግሎት',    bgClass: 'bg-green-100 text-green-800' },
  offices:     { label: 'Office',     amLabel: 'መስሪያ ቤት',  bgClass: 'bg-purple-100 text-purple-800' },
  kebeles:     { label: 'Kebele',     amLabel: 'ቀበሌ',       bgClass: 'bg-amber-100 text-amber-800' },
  investments: { label: 'Investment', amLabel: 'ኢንቨስትመንት', bgClass: 'bg-cyan-100 text-cyan-800' },
  tenders:     { label: 'Tender',     amLabel: 'ጨረታ',       bgClass: 'bg-red-100 text-red-800' },
}

function useDebounce<T>(value: T, delay: number): T {
  const [d, setD] = useState(value)
  useEffect(() => { const t = setTimeout(() => setD(value), delay); return () => clearTimeout(t) }, [value, delay])
  return d
}

export function GlobalSearch({ locale, placeholder }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [focusedIdx, setFocusedIdx] = useState(-1)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const dq = useDebounce(query, 280)

  const ph: Record<Locale, string> = {
    en: placeholder || 'Search services, news, tenders...',
    am: 'አገልግሎቶችን፣ ዜናዎችን፣ ጨረታዎችን ይፈልጉ...',
    om: 'Tajaajiloota, oduu, bittaa barbaadi...',
  }

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  const search = useCallback(async (q: string) => {
    if (!q.trim() || q.length < 2) { setResults([]); setOpen(false); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/search?q=${encodeURIComponent(q)}`)
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        const out: SearchResult[] = json.data.slice(0, 8).map((it: any) => ({
          id: it.id,
          title: (locale === 'am' && it.title_am ? it.title_am : it.title).slice(0, 58),
          description: it.description ? it.description.slice(0, 78) : undefined,
          category: it.categoryLabel || it.type,
          href: `/${locale}${it.url}`,
          categoryColor: 'bg-blue-100 text-blue-800',
        }))
        setResults(out)
        setOpen(true)
      } else {
        setResults([])
      }
    } catch {
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [locale])

  useEffect(() => { search(dq) }, [dq, search])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocusedIdx((p) => Math.min(p + 1, results.length - 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusedIdx((p) => Math.max(p - 1, 0)) }
    else if (e.key === 'Enter') {
      e.preventDefault()
      if (focusedIdx >= 0 && results[focusedIdx]) { router.push(results[focusedIdx].href); setOpen(false); setQuery('') }
      else if (query.trim()) { router.push(`/${locale}/search?q=${encodeURIComponent(query)}`); setOpen(false) }
    } else if (e.key === 'Escape') { setOpen(false); inputRef.current?.blur() }
  }

  const goSearch = () => { if (query.trim()) { router.push(`/${locale}/search?q=${encodeURIComponent(query)}`); setOpen(false) } }

  return (
    <div ref={containerRef} className="relative w-72 xl:w-80" role="search">
      <form onSubmit={(e) => { e.preventDefault(); goSearch() }}>
        <div className="relative">
          <input
            ref={inputRef} id="global-search-input" type="text" value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => { if (results.length > 0) setOpen(true) }}
            onKeyDown={handleKeyDown} placeholder={ph[locale]} autoComplete="off"
            aria-label="Global search" aria-expanded={open} aria-haspopup="listbox"
            className="w-full pl-9 pr-10 py-2 bg-gray-50 border border-gray-300 rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#1a4f8b] focus:ring-2 focus:ring-[#1a4f8b]/20 focus:bg-white transition-all shadow-inner"
          />
          <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          {loading && (
            <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            </span>
          )}
          {query && !loading && (
            <button type="button"
              onClick={() => { setQuery(''); setResults([]); setOpen(false); inputRef.current?.focus() }}
              className="absolute right-3 top-2 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Clear">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          )}
        </div>
      </form>

      {open && (
        <div id="search-results-dropdown" role="listbox"
          className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-2xl border border-gray-200 z-[200] max-h-[420px] overflow-y-auto">
          {results.length === 0 && !loading && query.length >= 2 && (
            <div className="px-4 py-6 text-center text-xs">
              <svg className="w-8 h-8 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <p className="font-medium text-gray-600">No results for &quot;{query}&quot;</p>
            </div>
          )}
          {results.length > 0 && (
            <>
              <div className="px-3 py-2 border-b border-gray-100 flex items-center justify-between">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{results.length} result{results.length !== 1 ? 's' : ''}</span>
                <button onClick={goSearch} className="text-[10px] font-semibold text-[#1a4f8b] hover:underline">See all</button>
              </div>
              <ul className="py-1">
                {results.map((r, idx) => (
                  <li key={r.id} role="option" aria-selected={focusedIdx === idx}>
                    <Link href={r.href} onClick={() => { setOpen(false); setQuery('') }}
                      className={`flex items-start gap-3 px-4 py-2.5 hover:bg-blue-50 transition-colors group ${focusedIdx === idx ? 'bg-blue-50' : ''}`}>
                      <span className={`flex-shrink-0 mt-0.5 text-[9px] font-bold px-1.5 py-0.5 rounded ${r.categoryColor}`}>{r.category}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-800 group-hover:text-[#1a4f8b] truncate">{r.title}</p>
                        {r.description && <p className="text-[10px] text-gray-500 truncate mt-0.5">{r.description}</p>}
                      </div>
                      <svg className="w-3.5 h-3.5 text-gray-300 group-hover:text-[#1a4f8b] flex-shrink-0 mt-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-100 px-4 py-2">
                <button onClick={goSearch}
                  className="w-full flex items-center justify-center gap-2 text-[11px] font-semibold text-[#1a4f8b] hover:bg-blue-50 py-1.5 rounded-lg transition-colors">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                  </svg>
                  Search all for &quot;{query}&quot;
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
