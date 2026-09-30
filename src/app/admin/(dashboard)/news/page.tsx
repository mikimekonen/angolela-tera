'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { mockNews } from '@/data/mockData'

export default function AdminNewsPage() {
  const [newsList, setNewsList] = useState(mockNews)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newCategory, setNewCategory] = useState('Official Press Release')
  const [newExcerpt, setNewExcerpt] = useState('')
  const [isFeatured, setIsFeatured] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const filteredNews = newsList.filter((n) =>
    n.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.category_en.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    setSubmitting(true)
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    try {
      const res = await fetch('/api/v1/news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title_en: newTitle,
          title_am: newTitle,
          title_om: newTitle,
          excerpt_en: newExcerpt,
          category_en: newCategory,
          isFeatured,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setNewsList([data.data, ...newsList])
        setShowModal(false)
        setNewTitle('')
        setNewExcerpt('')
      } else {
        alert(data.error || 'Failed to create article')
      }
    } catch {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0d2340]">
            News & Press Releases Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Publish official announcements, executive communiqués, and administrative directives.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>➕</span>
          <span>Publish New Announcement</span>
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <input
          type="text"
          placeholder="Filter announcements by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
        />
      </div>

      {/* News Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Title & Details</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Languages</th>
                <th className="py-3.5 px-4">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredNews.map((item) => (
                <tr key={item.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 max-w-md">
                    <span className="font-bold text-[#0d2340] block line-clamp-1">
                      {item.title_en}
                    </span>
                    <span className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                      {item.summary_en || (item as any).excerpt_en}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1a4f8b] border border-blue-100">
                      {item.category_en}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex gap-1">
                      <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-700">EN</span>
                      <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold">AM</span>
                      <span className="px-1.5 py-0.5 bg-purple-50 text-purple-700 rounded text-[10px] font-bold">OM</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {item.isFeatured ? (
                      <span className="text-amber-500 font-bold text-xs">⭐ Featured</span>
                    ) : (
                      <span className="text-gray-400 text-xs">Standard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/en/news/${item.slug}`}
                      target="_blank"
                      className="text-[#1a4f8b] hover:underline font-bold text-xs"
                    >
                      View Public ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Creating News */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-[#0d2340]">
                Publish New Woreda Announcement
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Article Title (English)
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Woreda Council Approves New Infrastructure Grant"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                >
                  <option value="Official Press Release">Official Press Release</option>
                  <option value="Agriculture & Food Security">Agriculture & Food Security</option>
                  <option value="Economic Development">Economic Development</option>
                  <option value="Social Services">Social Services</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Summary / Excerpt
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Concise executive summary for the public feed..."
                  value={newExcerpt}
                  onChange={(e) => setNewExcerpt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="rounded text-[#1a4f8b]"
                />
                <label htmlFor="featured" className="text-xs text-gray-700 font-semibold cursor-pointer">
                  Feature prominently on Woreda homepage banner
                </label>
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
                  {submitting ? 'Publishing...' : 'Publish Official Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
