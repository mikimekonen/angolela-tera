'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'

export interface GalleryImage {
  url: string
  caption_en?: string
  caption_am?: string
}

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
  imageUrl?: string | null
  imageCaption_en?: string
  imageCaption_am?: string
  videoUrl?: string | null
  videoType?: 'embed' | 'upload'
  gallery?: GalleryImage[]
  documentUrl?: string | null
  documentTitle?: string
  referenceNumber?: string
  isFeatured?: boolean
  status?: 'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'ARCHIVED'
  editorialNotes?: string
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

  // Modal State & Tabs
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState<'content_en' | 'content_am' | 'media' | 'workflow' | 'preview'>('content_en')
  const [editingItem, setEditingItem] = useState<NewsItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  // Form Fields - Multilingual Content
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

  // Form Fields - Media & Attachments
  const [imageUrl, setImageUrl] = useState('')
  const [imageCaptionEn, setImageCaptionEn] = useState('')
  const [imageCaptionAm, setImageCaptionAm] = useState('')
  const [videoMode, setVideoMode] = useState<'none' | 'embed' | 'upload'>('none')
  const [videoUrl, setVideoUrl] = useState('')
  const [gallery, setGallery] = useState<GalleryImage[]>([])
  const [documentUrl, setDocumentUrl] = useState('')
  const [documentTitle, setDocumentTitle] = useState('')
  const [referenceNumber, setReferenceNumber] = useState('')

  // Form Fields - Workflow & Editorial
  const [isFeatured, setIsFeatured] = useState(false)
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'REVIEW' | 'ARCHIVED'>('PUBLISHED')
  const [editorialNotes, setEditorialNotes] = useState('')

  // Upload progress states
  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [uploadingDoc, setUploadingDoc] = useState(false)

  const coverInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const docInputRef = useRef<HTMLInputElement>(null)

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
    setModalTab('content_en')
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
    setImageUrl('')
    setImageCaptionEn('')
    setImageCaptionAm('')
    setVideoMode('none')
    setVideoUrl('')
    setGallery([])
    setDocumentUrl('')
    setDocumentTitle('')
    setReferenceNumber(`ATW/PR/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 900) + 100)}`)
    setIsFeatured(false)
    setStatus('PUBLISHED')
    setEditorialNotes('')
    setShowModal(true)
  }

  const openEditModal = (item: NewsItem) => {
    setEditingItem(item)
    setModalTab('content_en')
    setSlug(item.slug)
    setTitleEn(item.title_en || '')
    setTitleAm(item.title_am || '')
    setCategoryEn(item.category_en || 'Official Press Release')
    setCategoryAm(item.category_am || 'ይፋዊ መግለጫ')
    setSummaryEn(item.summary_en || (item as any).excerpt_en || '')
    setSummaryAm(item.summary_am || (item as any).excerpt_am || '')

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

    setImageUrl(item.imageUrl || (item as any).coverImage || '')
    setImageCaptionEn(item.imageCaption_en || '')
    setImageCaptionAm(item.imageCaption_am || '')

    if (item.videoUrl) {
      setVideoUrl(item.videoUrl)
      setVideoMode(item.videoType === 'upload' ? 'upload' : 'embed')
    } else {
      setVideoUrl('')
      setVideoMode('none')
    }

    setGallery(item.gallery || [])
    setDocumentUrl(item.documentUrl || '')
    setDocumentTitle(item.documentTitle || '')
    setReferenceNumber(item.referenceNumber || '')

    setIsFeatured(Boolean(item.isFeatured))
    setStatus(item.status || 'PUBLISHED')
    setEditorialNotes(item.editorialNotes || '')
    setShowModal(true)
  }

  const handleTitleChange = (val: string) => {
    setTitleEn(val)
    if (!editingItem) {
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

  // File Upload Handlers
  const handleFileUpload = async (file: File, type: 'cover' | 'video' | 'gallery' | 'document') => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      if (type === 'cover') setUploadingCover(true)
      if (type === 'video') setUploadingVideo(true)
      if (type === 'gallery') setUploadingGallery(true)
      if (type === 'document') setUploadingDoc(true)

      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setMsg({ type: 'error', text: data.error || 'Failed to upload media file.' })
        return
      }

      if (type === 'cover') {
        setImageUrl(data.url)
        setMsg({ type: 'success', text: `Cover photo uploaded successfully (${(data.size / 1024).toFixed(0)} KB).` })
      } else if (type === 'video') {
        setVideoUrl(data.url)
        setVideoMode('upload')
        setMsg({ type: 'success', text: `Official video uploaded successfully (${(data.size / 1024 / 1024).toFixed(1)} MB).` })
      } else if (type === 'gallery') {
        setGallery((prev) => [...prev, { url: data.url, caption_en: file.name.replace(/\.[^/.]+$/, '') }])
        setMsg({ type: 'success', text: 'Photo added to event gallery.' })
      } else if (type === 'document') {
        setDocumentUrl(data.url)
        if (!documentTitle) setDocumentTitle(file.name)
        setMsg({ type: 'success', text: 'Official signed document attached successfully.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error during media upload.' })
    } finally {
      if (type === 'cover') setUploadingCover(false)
      if (type === 'video') setUploadingVideo(false)
      if (type === 'gallery') setUploadingGallery(false)
      if (type === 'document') setUploadingDoc(false)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleEn.trim() || !slug.trim()) {
      setMsg({ type: 'error', text: 'Article title and slug are required.' })
      setModalTab('content_en')
      return
    }

    setSubmitting(true)
    setMsg(null)

    const payload = {
      slug,
      title_en: titleEn,
      title_am: titleAm || titleEn,
      category_en: categoryEn,
      category_am: categoryAm,
      summary_en: summaryEn,
      summary_am: summaryAm || summaryEn,
      content_en: contentEn ? contentEn.split('\n\n').filter((p) => p.trim()) : [],
      content_am: contentAm ? contentAm.split('\n\n').filter((p) => p.trim()) : [],
      author_en: authorEn,
      author_am: authorAm,
      imageUrl: imageUrl || null,
      imageCaption_en: imageCaptionEn,
      imageCaption_am: imageCaptionAm,
      videoUrl: videoMode !== 'none' ? videoUrl : null,
      videoType: videoMode === 'upload' ? 'upload' : 'embed',
      gallery,
      documentUrl: documentUrl || null,
      documentTitle: documentTitle || null,
      referenceNumber: referenceNumber || null,
      isFeatured,
      status,
      editorialNotes,
    }

    try {
      const url = '/api/v1/news'
      const method = editingItem ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()

      if (json.success) {
        setMsg({
          type: 'success',
          text: editingItem
            ? `Successfully updated announcement: "${titleEn}"`
            : `Successfully published new announcement: "${titleEn}"`,
        })
        setShowModal(false)
        fetchNews()
      } else {
        setMsg({ type: 'error', text: json.error || 'Failed to save announcement.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (targetSlug: string) => {
    if (!confirm('Are you sure you want to permanently delete this official announcement?')) {
      return
    }

    setDeletingSlug(targetSlug)
    try {
      const res = await fetch(`/api/v1/news?slug=${encodeURIComponent(targetSlug)}`, {
        method: 'DELETE',
      })
      const json = await res.json()

      if (json.success) {
        setMsg({ type: 'success', text: 'Announcement successfully deleted from public records.' })
        fetchNews()
      } else {
        setMsg({ type: 'error', text: json.error || 'Failed to delete announcement.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    } finally {
      setDeletingSlug(null)
    }
  }

  // Translation completeness calculation
  const isEnDone = Boolean(titleEn && summaryEn)
  const isAmDone = Boolean(titleAm && summaryAm)

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
            className="text-gray-400 hover:text-gray-700 ml-4 font-bold cursor-pointer"
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
            Author, review, publish, and archive official Woreda communiqués with direct photo/video media and signed document attachments.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-gradient-to-r from-[#1a4f8b] to-[#0d2340] hover:opacity-95 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all inline-flex items-center gap-2 cursor-pointer shrink-0"
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
            <option value="PUBLISHED">🟢 Published (Live)</option>
            <option value="REVIEW">🟡 In Review</option>
            <option value="DRAFT">⚪ Draft</option>
            <option value="ARCHIVED">🔴 Archived</option>
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
                  <th className="py-3.5 px-4">Media</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Placement</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {filteredNews.map((item) => {
                  const currentStatus = item.status || 'PUBLISHED'
                  const hasMedia = Boolean(item.imageUrl || item.videoUrl || (item.gallery && item.gallery.length > 0))
                  return (
                    <tr key={item.slug} className="hover:bg-gray-50 transition-colors">
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="flex items-start gap-3">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt=""
                              className="w-12 h-12 rounded-lg object-cover border border-gray-200 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-base shrink-0">
                              📰
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-[#0d2340] line-clamp-1">{item.title_en}</p>
                            {item.title_am && (
                              <p className="text-[11px] text-gray-500 font-ethiopic line-clamp-1 mt-0.5">
                                {item.title_am}
                              </p>
                            )}
                            <p className="text-[10px] text-gray-400 font-mono mt-1">
                              /{item.slug} • {item.date_en || 'Recent'}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {item.imageUrl && (
                            <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200" title="Cover Photo">
                              🖼️ Photo
                            </span>
                          )}
                          {item.videoUrl && (
                            <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200" title="Video Broadcast">
                              🎥 Video
                            </span>
                          )}
                          {item.gallery && item.gallery.length > 0 && (
                            <span className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200" title="Multi-photo Gallery">
                              📸 {item.gallery.length} Photos
                            </span>
                          )}
                          {item.documentUrl && (
                            <span className="px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-bold border border-amber-200" title="PDF Document Attached">
                              📄 PDF
                            </span>
                          )}
                          {!hasMedia && !item.documentUrl && (
                            <span className="text-[10px] text-gray-400">Text Only</span>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#1a4f8b] border border-blue-100">
                          {item.category_en}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            currentStatus === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : currentStatus === 'REVIEW'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : currentStatus === 'DRAFT'
                              ? 'bg-gray-100 text-gray-700 border-gray-300'
                              : 'bg-rose-50 text-rose-800 border-rose-200'
                          }`}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {item.isFeatured ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                            ★ Featured Pin
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[11px]">Standard Feed</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/en/news/${item.slug}`}
                            target="_blank"
                            className="px-2 py-1 text-gray-500 hover:text-[#1a4f8b] rounded hover:bg-gray-100 text-[11px] font-semibold"
                            title="Preview on Public Site"
                          >
                            👁️ View
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(item)}
                            className="px-2 py-1 text-blue-600 hover:text-blue-800 rounded hover:bg-blue-50 text-[11px] font-semibold cursor-pointer"
                          >
                            ✏️ Edit
                          </button>
                          <button
                            type="button"
                            disabled={deletingSlug === item.slug}
                            onClick={() => handleDelete(item.slug)}
                            className="px-2 py-1 text-rose-600 hover:text-rose-800 rounded hover:bg-rose-50 text-[11px] font-semibold cursor-pointer disabled:opacity-50"
                          >
                            {deletingSlug === item.slug ? '...' : '🗑️ Delete'}
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

      {/* MODAL FOR CREATING / EDITING NEWS */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4 shrink-0">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{editingItem ? '✏️' : '📢'}</span>
                <div>
                  <h3 className="text-lg font-bold text-[#0d2340]">
                    {editingItem ? 'Edit Official Announcement' : 'Publish New Woreda Announcement'}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-gray-400">Translation Readiness:</span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${isEnDone ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                      EN {isEnDone ? '✓' : '...'}
                    </span>
                    <span className={`px-2 py-0.2 rounded text-[10px] font-bold ${isAmDone ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      AM {isAmDone ? '✓' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl cursor-pointer p-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-1.5 border-b border-gray-100 pb-2 overflow-x-auto scrollbar-none shrink-0">
              <button
                type="button"
                onClick={() => setModalTab('content_en')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'content_en' ? 'bg-[#1a4f8b] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🇬🇧 English Content *
              </button>
              <button
                type="button"
                onClick={() => setModalTab('content_am')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'content_am' ? 'bg-[#1a4f8b] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                🇪🇹 አማርኛ (Amharic)
              </button>
              <button
                type="button"
                onClick={() => setModalTab('media')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'media' ? 'bg-[#1a4f8b] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>📷 Media & Video</span>
                {(imageUrl || videoUrl || gallery.length > 0 || documentUrl) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                )}
              </button>
              <button
                type="button"
                onClick={() => setModalTab('workflow')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  modalTab === 'workflow' ? 'bg-[#1a4f8b] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                ⚙️ Workflow & Category
              </button>
              <button
                type="button"
                onClick={() => setModalTab('preview')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  modalTab === 'preview' ? 'bg-[#1a4f8b] text-white shadow-sm' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>🔍 SERP & Preview</span>
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSave} className="flex-1 overflow-y-auto space-y-4 pr-1">
              {/* TAB 1: ENGLISH CONTENT */}
              {modalTab === 'content_en' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Article Title (English) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Woreda Council Approves New Agricultural Grant"
                        value={titleEn}
                        onChange={(e) => handleTitleChange(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Author / Issuing Directorate (English)
                      </label>
                      <input
                        type="text"
                        value={authorEn}
                        onChange={(e) => setAuthorEn(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Executive Summary (English) <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      required
                      placeholder="Concise 1-2 sentence overview for news cards, social shares, and mobile feeds..."
                      value={summaryEn}
                      onChange={(e) => setSummaryEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Article Body Text (English) — Separate paragraphs with blank lines
                    </label>
                    <textarea
                      rows={7}
                      placeholder="Write the full communique, resolution text, quotes, and ministerial directives here..."
                      value={contentEn}
                      onChange={(e) => setContentEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl text-xs font-sans leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: AMHARIC CONTENT */}
              {modalTab === 'content_am' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Article Title (Amharic / አማርኛ)
                      </label>
                      <input
                        type="text"
                        placeholder="ለምሳሌ፡ የወረዳው ምክር ቤት አዲስ የግብርና ድጋፍ አጸደቀ"
                        value={titleAm}
                        onChange={(e) => setTitleAm(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl text-xs font-ethiopic focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Author / Issuing Directorate (Amharic)
                      </label>
                      <input
                        type="text"
                        value={authorAm}
                        onChange={(e) => setAuthorAm(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl text-xs font-ethiopic focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                      />
                    </div>
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
                      className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl text-xs font-ethiopic focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Full Article Body Text (Amharic)
                    </label>
                    <textarea
                      rows={7}
                      placeholder="ሙሉ መግለጫውን እዚህ ይጻፉ..."
                      value={contentAm}
                      onChange={(e) => setContentAm(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-gray-50/70 border border-gray-300 rounded-xl text-xs font-ethiopic leading-relaxed focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: MEDIA & BROADCAST */}
              {modalTab === 'media' && (
                <div className="space-y-6 animate-in fade-in duration-150">
                  {/* 1. Cover Photo Section */}
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#0d2340]">1. Featured Cover Photo</h4>
                        <p className="text-[11px] text-gray-500">
                          High-resolution JPEG, PNG, or WebP image displayed at the top of the news bulletin.
                        </p>
                      </div>
                      {imageUrl && (
                        <button
                          type="button"
                          onClick={() => setImageUrl('')}
                          className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                        >
                          Remove Photo
                        </button>
                      )}
                    </div>

                    {imageUrl ? (
                      <div className="flex items-center gap-4">
                        <img
                          src={imageUrl}
                          alt="Preview"
                          className="w-24 h-24 rounded-xl object-cover border border-gray-300 shadow-xs"
                        />
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-600"
                            placeholder="Image URL"
                          />
                          <input
                            type="text"
                            value={imageCaptionEn}
                            onChange={(e) => setImageCaptionEn(e.target.value)}
                            placeholder="Image caption (English) e.g. Woreda Administrator presiding over cabinet session"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            value={imageCaptionAm}
                            onChange={(e) => setImageCaptionAm(e.target.value)}
                            placeholder="የፎቶ መግለጫ (አማርኛ) ለምሳሌ፡ የወረዳው ዋና አስተዳዳሪ በምክር ቤት ስብሰባ ወቅት"
                            className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-ethiopic"
                          />
                        </div>
                      </div>
                    ) : (
                      <div>
                        <input
                          type="file"
                          ref={coverInputRef}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'cover')
                          }}
                        />
                        <div
                          onClick={() => coverInputRef.current?.click()}
                          className="border-2 border-dashed border-gray-300 hover:border-[#1a4f8b] bg-white rounded-xl p-5 text-center cursor-pointer transition-colors"
                        >
                          {uploadingCover ? (
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#1a4f8b]">
                              <div className="w-4 h-4 border-2 border-[#1a4f8b] border-t-transparent rounded-full animate-spin" />
                              Uploading and verifying image security...
                            </div>
                          ) : (
                            <div>
                              <span className="text-2xl block mb-1">🖼️</span>
                              <p className="text-xs font-bold text-gray-700">Click to upload cover photo</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">JPEG, PNG, WebP up to 15 MB</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 text-center">
                          <span className="text-[10px] text-gray-400">or paste direct image URL below:</span>
                          <input
                            type="text"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://... or /uploads/images/photo.jpg"
                            className="mt-1 w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. Official Video Broadcast Section */}
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#0d2340]">2. Video Communiqué / Broadcast</h4>
                        <p className="text-[11px] text-gray-500">
                          Embed an official YouTube/Vimeo press briefing or directly upload an MP4/WebM video clip.
                        </p>
                      </div>
                      {videoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setVideoUrl('')
                            setVideoMode('none')
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                        >
                          Remove Video
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="videoMode"
                          checked={videoMode === 'none'}
                          onChange={() => {
                            setVideoMode('none')
                            setVideoUrl('')
                          }}
                        />
                        <span>No Video</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="videoMode"
                          checked={videoMode === 'embed'}
                          onChange={() => setVideoMode('embed')}
                        />
                        <span>YouTube / Vimeo Embed</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-gray-700 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="videoMode"
                          checked={videoMode === 'upload'}
                          onChange={() => setVideoMode('upload')}
                        />
                        <span>Upload MP4 / WebM File</span>
                      </label>
                    </div>

                    {videoMode === 'embed' && (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={videoUrl}
                          onChange={(e) => setVideoUrl(e.target.value)}
                          placeholder="Paste YouTube or Vimeo URL (e.g. https://www.youtube.com/watch?v=...)"
                          className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                        />
                        {videoUrl && (
                          <p className="text-[10px] text-emerald-600 font-bold">
                            ✓ Video link ready. Public page will render responsive video player.
                          </p>
                        )}
                      </div>
                    )}

                    {videoMode === 'upload' && (
                      <div>
                        <input
                          type="file"
                          ref={videoInputRef}
                          accept="video/mp4,video/webm"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'video')
                          }}
                        />
                        {videoUrl ? (
                          <div className="space-y-2">
                            <video src={videoUrl} controls className="w-full max-h-48 rounded-xl bg-black" />
                            <p className="text-[11px] text-gray-500 font-mono truncate">{videoUrl}</p>
                          </div>
                        ) : (
                          <div
                            onClick={() => videoInputRef.current?.click()}
                            className="border-2 border-dashed border-gray-300 hover:border-[#1a4f8b] bg-white rounded-xl p-5 text-center cursor-pointer transition-colors"
                          >
                            {uploadingVideo ? (
                              <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#1a4f8b]">
                                <div className="w-4 h-4 border-2 border-[#1a4f8b] border-t-transparent rounded-full animate-spin" />
                                Uploading government video clip (up to 50 MB)...
                              </div>
                            ) : (
                              <div>
                                <span className="text-2xl block mb-1">🎥</span>
                                <p className="text-xs font-bold text-gray-700">Click to upload MP4 / WebM video clip</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">Maximum size: 50 MB</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 3. Event Photo Gallery Section */}
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#0d2340]">3. Event Photo Gallery</h4>
                        <p className="text-[11px] text-gray-500">
                          Attach additional ceremony or field inspection photos to this news item.
                        </p>
                      </div>
                      <div>
                        <input
                          type="file"
                          ref={galleryInputRef}
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleFileUpload(file, 'gallery')
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => galleryInputRef.current?.click()}
                          disabled={uploadingGallery}
                          className="px-3 py-1.5 bg-white border border-gray-300 hover:border-gray-400 rounded-lg text-xs font-bold text-gray-700 shadow-2xs cursor-pointer"
                        >
                          {uploadingGallery ? 'Uploading...' : '➕ Add Gallery Photo'}
                        </button>
                      </div>
                    </div>

                    {gallery.length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        {gallery.map((g, idx) => (
                          <div key={idx} className="relative group rounded-xl overflow-hidden border border-gray-300 bg-white">
                            <img src={g.url} alt="" className="w-full h-24 object-cover" />
                            <button
                              type="button"
                              onClick={() => setGallery(gallery.filter((_, i) => i !== idx))}
                              className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-sm"
                            >
                              ✕
                            </button>
                            <input
                              type="text"
                              value={g.caption_en || ''}
                              onChange={(e) => {
                                const copy = [...gallery]
                                copy[idx].caption_en = e.target.value
                                setGallery(copy)
                              }}
                              placeholder="Photo caption..."
                              className="w-full px-2 py-1 text-[10px] border-t border-gray-200 focus:outline-hidden"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 4. Signed Communiqué PDF Document Attachment */}
                  <div className="p-4 bg-gray-50/80 rounded-2xl border border-gray-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-[#0d2340]">4. Official Signed Document (PDF)</h4>
                        <p className="text-[11px] text-gray-500">
                          Attach an official signed government letter, gazette, or circular for citizens to download.
                        </p>
                      </div>
                      {documentUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setDocumentUrl('')
                            setDocumentTitle('')
                          }}
                          className="text-xs text-rose-600 hover:text-rose-800 font-bold cursor-pointer"
                        >
                          Remove Document
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Official Reference / Dispatch Number
                        </label>
                        <input
                          type="text"
                          value={referenceNumber}
                          onChange={(e) => setReferenceNumber(e.target.value)}
                          placeholder="e.g. ATW/PR/2026/042"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs font-mono"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-gray-700 mb-1">
                          Document Title
                        </label>
                        <input
                          type="text"
                          value={documentTitle}
                          onChange={(e) => setDocumentTitle(e.target.value)}
                          placeholder="e.g. Signed Resolution Directive No. 04"
                          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <input
                        type="file"
                        ref={docInputRef}
                        accept="application/pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleFileUpload(file, 'document')
                        }}
                      />
                      {documentUrl ? (
                        <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-emerald-200">
                          <span className="text-2xl">📄</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-emerald-900 truncate">
                              {documentTitle || 'Attached PDF Document'}
                            </p>
                            <p className="text-[10px] text-gray-400 font-mono truncate">{documentUrl}</p>
                          </div>
                          <span className="text-xs text-emerald-700 font-bold">✓ Attached</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => docInputRef.current?.click()}
                          disabled={uploadingDoc}
                          className="w-full py-3 bg-white border-2 border-dashed border-gray-300 hover:border-[#1a4f8b] rounded-xl text-xs font-bold text-gray-700 cursor-pointer flex items-center justify-center gap-2"
                        >
                          {uploadingDoc ? (
                            <>
                              <div className="w-3.5 h-3.5 border-2 border-[#1a4f8b] border-t-transparent rounded-full animate-spin" />
                              Verifying and uploading PDF...
                            </>
                          ) : (
                            <>
                              <span>📎</span> Click to upload Signed PDF Document
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: WORKFLOW & CATEGORY */}
              {modalTab === 'workflow' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        URL Slug (Permanent Identifier) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        disabled={Boolean(editingItem)}
                        placeholder="e.g. woreda-council-approves-grant"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs font-mono bg-gray-50 disabled:text-gray-500 focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                      />
                      {editingItem && (
                        <span className="text-[10px] text-gray-400 mt-0.5 block">
                          Slug is immutable to preserve public URL links and SEO integrity.
                        </span>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Government Classification Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={categoryEn}
                        onChange={(e) => handleCategorySelect(e.target.value)}
                        className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs bg-white font-medium focus:ring-2 focus:ring-[#1a4f8b]"
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.en} value={c.en}>
                            {c.en} ({c.am})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">
                        Official Approval Lifecycle State <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { val: 'PUBLISHED', label: 'Published (Live)', desc: 'Visible to public citizens', color: 'border-emerald-500 bg-emerald-50 text-emerald-900' },
                          { val: 'REVIEW', label: 'Under Review', desc: 'Pending editorial clearance', color: 'border-amber-500 bg-amber-50 text-amber-900' },
                          { val: 'DRAFT', label: 'Internal Draft', desc: 'Authoring in progress', color: 'border-gray-400 bg-gray-100 text-gray-800' },
                          { val: 'ARCHIVED', label: 'Archived', desc: 'Preserved record, hidden', color: 'border-rose-400 bg-rose-50 text-rose-900' },
                        ].map((s) => (
                          <button
                            key={s.val}
                            type="button"
                            onClick={() => setStatus(s.val as any)}
                            className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                              status === s.val ? `${s.color} ring-2 ring-[#1a4f8b]/20 shadow-xs font-bold` : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            <span className="block text-xs">{s.label}</span>
                            <span className="text-[10px] text-gray-400 block mt-0.5">{s.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        Editorial / Rejection Notes (Internal Cabinet / Reviewer Guidance)
                      </label>
                      <textarea
                        rows={2}
                        value={editorialNotes}
                        onChange={(e) => setEditorialNotes(e.target.value)}
                        placeholder="Leave notes if revisions are requested before clearance..."
                        className="w-full px-3.5 py-2 bg-white border border-gray-300 rounded-xl text-xs focus:ring-2 focus:ring-[#1a4f8b]"
                      />
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isFeatured}
                          onChange={(e) => setIsFeatured(e.target.checked)}
                          className="w-4 h-4 rounded text-[#1a4f8b] border-gray-300 focus:ring-[#1a4f8b]"
                        />
                        <div>
                          <span className="text-xs text-gray-800 font-bold block">
                            Pin to Homepage Top Highlights
                          </span>
                          <span className="text-[10px] text-gray-500">
                            Showcases this announcement prominently on the portal homepage header cards.
                          </span>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: SERP & SOCIAL PREVIEW */}
              {modalTab === 'preview' && (
                <div className="space-y-5 animate-in fade-in duration-150">
                  {/* Google Search Simulation */}
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">🌐</span>
                      <h4 className="text-xs font-bold text-gray-700">Google Search Result Preview (SERP)</h4>
                    </div>
                    <div className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 font-sans">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1 truncate">
                        <span className="font-medium text-gray-700">angolela-tera.gov.et</span>
                        <span>›</span>
                        <span>en</span>
                        <span>›</span>
                        <span>news</span>
                        <span>›</span>
                        <span className="text-gray-400">{slug || 'article-slug'}</span>
                      </div>
                      <h5 className="text-base text-[#1a0dab] hover:underline font-medium cursor-pointer leading-tight">
                        {titleEn || 'Article Title Preview | Angolela Tera Woreda Administration'}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1 leading-normal line-clamp-2">
                        {summaryEn || 'Executive overview of the official government communique and announcements issued by the Woreda Communications Directorate.'}
                      </p>
                    </div>
                  </div>

                  {/* Social Media Share Card Simulation */}
                  <div className="p-4 bg-white rounded-2xl border border-gray-200 shadow-xs space-y-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm">📱</span>
                      <h4 className="text-xs font-bold text-gray-700">Social Media & Messaging Card Preview (Telegram, Facebook, X)</h4>
                    </div>
                    <div className="max-w-md bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
                      <div className="h-44 bg-gray-100 overflow-hidden relative">
                        {imageUrl ? (
                          <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 text-xs">
                            <span className="text-3xl mb-1">🏛️</span>
                            <span>Angolela Tera Official Emblem</span>
                          </div>
                        )}
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-bold">
                          Official Bulletin
                        </span>
                      </div>
                      <div className="p-3.5 bg-gray-50">
                        <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">ANGOLELA-TERA.GOV.ET</p>
                        <p className="text-xs font-bold text-[#0d2340] line-clamp-1 mt-0.5">
                          {titleEn || 'Headline Preview'}
                        </p>
                        <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                          {summaryEn || 'Executive summary text preview for citizen engagement channels.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Pre-publication Quality Gate Checklist */}
                  <div className="p-4 bg-blue-50/60 rounded-2xl border border-blue-200 space-y-2.5">
                    <h4 className="text-xs font-bold text-[#1a4f8b] flex items-center gap-1.5">
                      <span>✓</span>
                      <span>Government Editorial Quality Assurance Gate</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-2 ${isEnDone ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                        <span>{isEnDone ? '✅' : '⚪'}</span> English Title & Summary Completed
                      </div>
                      <div className={`flex items-center gap-2 ${isAmDone ? 'text-emerald-700 font-bold' : 'text-amber-700 font-semibold'}`}>
                        <span>{isAmDone ? '✅' : '⚠️'}</span> Amharic Translation {isAmDone ? 'Ready' : 'Pending'}
                      </div>
                      <div className={`flex items-center gap-2 ${imageUrl ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                        <span>{imageUrl ? '✅' : '⚪'}</span> Featured Cover Photo Attached
                      </div>
                      <div className={`flex items-center gap-2 ${referenceNumber ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
                        <span>{referenceNumber ? '✅' : '⚪'}</span> Official Reference Number Assigned
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Modal Footer Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Current tab:</span>
                  <span className="text-xs font-bold text-gray-700 capitalize">
                    {modalTab.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#1a4f8b] to-[#0d2340] hover:opacity-95 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-900/20 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : editingItem ? (
                      'Save Communiqué Changes'
                    ) : (
                      'Publish Official Announcement'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
