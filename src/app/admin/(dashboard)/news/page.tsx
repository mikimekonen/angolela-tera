'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export interface NewsItem {
  id?: string
  slug: string
  title_en: string
  title_am?: string
  category_en: string
  category_am?: string
  date_en?: string
  date_am?: string
  author_en?: string
  author_am?: string
  summary_en?: string
  summary_am?: string
  content_en?: string[] | string
  content_am?: string[] | string
  isFeatured?: boolean
  status?: 'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'ARCHIVED'
  createdAt?: string
}

const CATEGORY_OPTIONS = [
  { en: 'Official Press Release', am: 'ይፋዊ መግለጫ' },
  { en: 'Agriculture & Food Security', am: 'ግብርናና የምግብ ዋስትና' },
  { en: 'Economic Development & Investment', am: 'ኢኮኖሚ ልማትና ኢንቨስትመንት' },
  { en: 'Infrastructure & Public Works', am: 'መሠረተ ልማትና የህዝብ ግንባታ' },
  { en: 'Social Services & Health', am: 'ማህበራዊ አገልግሎትና ጤና' },
  { en: 'Peace, Security & Justice', am: 'ሰላም፣ ጸጥታና ፍትህ' },
]

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState<NewsItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  // Form Fields
  const [slug, setSlug] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [categoryEn, setCategoryEn] = useState('Official Press Release')
  const [categoryAm, setCategoryAm] = useState('ይፋዊ መግለጫ')
  const [summaryEn, setSummaryEn] = useState('')
  const [summaryAm, setSummaryAm] = useState('')
  const [contentEn, setContentEn] = useState('')
  const [contentAm, setContentAm] = useState('')
  const [authorEn, setAuthorEn] = useState('Woreda Communication Directorate')
  const [authorAm, setAuthorAm] = useState('የወረዳው ኮሙኒኬሽን ዳይሬክቶሬት')
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'ARCHIVED'>('PUBLISHED')

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/news')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setNewsList(json.data)
      } else {
        setMsg({ type: 'error', text: json.error || 'Failed to load news articles.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error occurred while fetching news.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchNews()
  }, [fetchNews])

  const openCreateModal = () => {
    setEditingItem(null)
    setSlug('')
    setTitleEn('')
    setTitleAm('')
    setCategoryEn('Official Press Release')
    setCategoryAm('ይፋዊ መግለጫ')
    setSummaryEn('')
    setSummaryAm('')
    setContentEn('')
    setContentAm('')
    setAuthorEn('Woreda Communication Directorate')
    setAuthorAm('የወረዳው ኮሙኒኬሽን ዳይሬክቶሬት')
    setIsFeatured(false)
    setStatus('PUBLISHED')
    setShowModal(true)
  }

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item)
    setSlug(item.slug)
    setTitleEn(item.title_en || '')
    setTitleAm(item.title_am || '')
    setCategoryEn(item.category_en || 'Official Press Release')
    setCategoryAm(item.category_am || 'ይፋዊ መግለጫ')
    setSummaryEn(item.summary_en || (item as any).excerpt_en || '')
    setSummaryAm(item.summary_am || (item as any).excerpt_am || '')
    
    // Content can be an array of strings or single string
    if (Array.isArray(item.content_en)) {
      setContentEn(item.content_en.join('\n\n'))
    } else {
      setContentEn(item.content_en || '')
    }

    if (Array.isArray(item.content_am)) {
      setContentAm(item.content_am.join('\n\n'))
    } else {
      setContentAm(item.content_am || '')
    }

    setAuthorEn(item.author_en || 'Woreda Communication Directorate')
    setAuthorAm(item.author_am || 'የወረዳው ኮሙኒኬሽን ዳይሬክቶሬት')
    setIsFeatured(Boolean(item.isFeatured))
    setStatus(item.status || 'PUBLISHED')
    setShowModal(true)
  }

  const handleTitleChange = (val: string) => {
    setTitleEn(val)
    if (!editingItem) {
      // Auto-generate clean URL slug
      const generated = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
      setSlug(generated)
    }
  }

  const handleCategorySelect = (enVal: string) => {
    setCategoryEn(enVal)
    const match = CATEGORY_OPTIONS.find((c) => c.en === enVal)
    if (match) {
      setCategoryAm(match.am)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleEn.trim() || !slug.trim()) {
      setMsg({ type: 'error', text: 'Article title and slug are required.' })
      return
    }

    setSubmitting(true)
    setMsg(null)

    const payload = {
      slug: slug.trim(),
      title_en: titleEn.trim(),
      title_am: titleAm.trim() || titleEn.trim(),
      category_en: categoryEn,
      category_am: categoryAm,
      author_en: authorEn.trim() || 'Woreda Communication Directorate',
      author_am: authorAm.trim() || 'የወረዳው ኮሙኒኬሽን ዳይሬክቶሬት',
      summary_en: summaryEn.trim(),
      summary_am: summaryAm.trim() || summaryEn.trim(),
      content_en: contentEn ? contentEn.split('\n\n').filter((p) => p.trim()) : [],
      content_am: contentAm ? contentAm.split('\n\n').filter((p) => p.trim()) : [],
      isFeatured,
      status,
    }

    try {
      const res = await fetch('/api/v1/news', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({
          type: 'success',
          text: editingItem
            ? `Article "${titleEn}" successfully updated.`
            : `Article "${titleEn}" successfully published.`,
        })
        setShowModal(false)
        fetchNews()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to save news article.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error occurred while saving.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (slugToDelete: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This audit trail event will be recorded.`)) {
      return
    }

    try {
      setDeletingSlug(slugToDelete)
      const res = await fetch(`/api/v1/news?slug=${encodeURIComponent(slugToDelete)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Article "${title}" deleted successfully.` })
        fetchNews()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete article.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error occurred during deletion.' })
    } finally {
      setDeletingSlug(null)
    }
  }

  const filteredNews = newsList.filter((n) => {
    const matchesSearch =
      n.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.title_am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.category_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.summary_en?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'ALL' || n.category_en === categoryFilter
    const matchesStatus = statusFilter === 'ALL' || (n.status || 'PUBLISHED') === statusFilter

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="space-y-6">
      {/* Top Banner / Feedback Alert */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            msg.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}
        >
          <span>{msg.text}</span>
          <button
            type="button"
            onClick={() => setMsg(null)}
            className="text-gray-400 hover:text-gray-700 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">📰</span>
            <h1 className="text-2xl font-extrabold text-[#0d2340]">
              News & Press Releases Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Author, review, publish, and archive official Woreda communiqués, administrative directives, and public notices.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>➕</span>
          <span>Publish New Announcement</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-4 gap-3">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Search Announcements</label>
          <input
            type="text"
            placeholder="Search by title, headline, summary..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Category Filter</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.en} value={c.en}>
                {c.en}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Workflow Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="REVIEW">Under Review</option>
            <option value="DRAFT">Draft</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      {/* News Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <span className="inline-block animate-spin mr-2">🔄</span> Loading news articles from database...
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No news articles match your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Article Title & Overview</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Workflow Status</th>
                  <th className="py-3.5 px-4">Placement</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredNews.map((item) => {
                  const currentStatus = item.status || 'PUBLISHED'
                  return (
                    <tr key={item.slug} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 max-w-md">
                        <div className="font-bold text-[#0d2340] line-clamp-1 text-sm">
                          {item.title_en}
                        </div>
                        {item.title_am && (
                          <div className="text-[11px] text-gray-500 font-ethiopic line-clamp-1 mt-0.5">
                            {item.title_am}
                          </div>
                        )}
                        <div className="text-[11px] text-gray-400 mt-1 flex items-center gap-2">
                          <span>📅 {item.date_en || 'Recent'}</span>
                          <span>•</span>
                          <span>✍️ {item.author_en || 'Administration'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1a4f8b] border border-blue-100">
                          {item.category_en}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {currentStatus === 'PUBLISHED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                            PUBLISHED
                          </span>
                        )}
                        {currentStatus === 'REVIEW' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            IN REVIEW
                          </span>
                        )}
                        {currentStatus === 'DRAFT' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                            DRAFT
                          </span>
                        )}
                        {currentStatus === 'ARCHIVED' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 inline-flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                            ARCHIVED
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {item.isFeatured ? (
                          <span className="text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-bold text-[11px] inline-flex items-center gap-1">
                            ⭐ Featured Banner
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">Standard Feed</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/en/news/${item.slug}`}
                            target="_blank"
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#1a4f8b] hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                          >
                            Preview ↗
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.slug, item.title_en)}
                            disabled={deletingSlug === item.slug}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                          >
                            {deletingSlug === item.slug ? 'Deleting...' : '🗑️ Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating / Editing News */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{editingItem ? '✏️' : '📢'}</span>
                <h3 className="text-base font-bold text-[#0d2340]">
                  {editingItem ? 'Edit Official Announcement' : 'Publish New Woreda Announcement'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Article Title (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Woreda Council Approves New Infrastructure Grant"
                    value={titleEn}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Article Title (Amharic / አማርኛ)
                  </label>
                  <input
                    type="text"
                    placeholder="ለምሳሌ፡ የወረዳው ምክር ቤት አዲስ የመሠረተ ልማት ድጋፍ አጸደቀ"
                    value={titleAm}
                    onChange={(e) => setTitleAm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-ethiopic focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    URL Slug (Identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingItem)}
                    placeholder="e.g. woreda-council-approves-grant"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50 disabled:text-gray-500"
                  />
                  {editingItem && (
                    <span className="text-[10px] text-gray-400 mt-0.5 block">
                      Slug is immutable to preserve public URL integrity.
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    value={categoryEn}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    {CATEGORY_OPTIONS.map((c) => (
                      <option key={c.en} value={c.en}>
                        {c.en} ({c.am})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Author / Office (English)
                  </label>
                  <input
                    type="text"
                    value={authorEn}
                    onChange={(e) => setAuthorEn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Author / Office (Amharic)
                  </label>
                  <input
                    type="text"
                    value={authorAm}
                    onChange={(e) => setAuthorAm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-ethiopic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Executive Summary (English) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Short overview for citizen newsfeed cards..."
                    value={summaryEn}
                    onChange={(e) => setSummaryEn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Executive Summary (Amharic)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="አጭር ይዘት ማጠቃለያ..."
                    value={summaryAm}
                    onChange={(e) => setSummaryAm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-ethiopic"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Article Content (English) — Separate paragraphs with blank lines
                </label>
                <textarea
                  rows={4}
                  placeholder="Detailed body text for this announcement..."
                  value={contentEn}
                  onChange={(e) => setContentEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Article Content (Amharic)
                </label>
                <textarea
                  rows={4}
                  placeholder="ሙሉ መግለጫ በአማርኛ..."
                  value={contentAm}
                  onChange={(e) => setContentAm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-ethiopic"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Workflow Status *
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white font-bold"
                  >
                    <option value="PUBLISHED">🟢 PUBLISHED (Live to Public)</option>
                    <option value="REVIEW">🟡 IN REVIEW (Pending Cabinet Clearance)</option>
                    <option value="DRAFT">⚪ DRAFT (Internal Editorial Only)</option>
                    <option value="ARCHIVED">🔴 ARCHIVED (Removed from Active Feeds)</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 rounded text-[#1a4f8b] border-gray-300 focus:ring-[#1a4f8b]"
                    />
                    <span className="text-xs text-gray-700 font-semibold">
                      Pin to Homepage Featured Banner
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? 'Processing...'
                    : editingItem
                    ? 'Save Communiqué Changes'
                    : 'Publish Official Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
