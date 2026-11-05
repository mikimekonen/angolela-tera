'use client'

import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import type { MediaAssetItem, MediaCategory } from '@/types'

const CATEGORIES: { key: MediaCategory | 'ALL'; label: string; icon: string; countDesc: string }[] = [
  { key: 'ALL', label: 'All Digital Assets', icon: '📁', countDesc: 'Complete repository' },
  { key: 'BRANDING', label: 'Logos & Official Branding', icon: '🏛️', countDesc: 'Emblems & seals' },
  { key: 'NEWS', label: 'News & Press Releases', icon: '📰', countDesc: 'Civic announcements' },
  { key: 'PROJECTS', label: 'Development Projects', icon: '🏗️', countDesc: 'Site inspection photos' },
  { key: 'TOURISM', label: 'Tourism & Culture', icon: '🏞️', countDesc: 'Monasteries & nature' },
  { key: 'VIDEOS', label: 'Official Video Assets', icon: '🎥', countDesc: 'MP4 / WebM broadcasts' },
  { key: 'DOCUMENTS', label: 'Public Documents & PDFs', icon: '📄', countDesc: 'Signed circulars & forms' },
]

function formatSize(bytes: number) {
  if (!bytes) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function MediaLibraryPage() {
  const [assets, setAssets] = useState<MediaAssetItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<MediaCategory | 'ALL'>('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Upload modal & form
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadCategory, setUploadCategory] = useState<MediaCategory>('NEWS')
  const [uploadTitle, setUploadTitle] = useState('')
  const [uploadAltEn, setUploadAltEn] = useState('')
  const [uploadAltAm, setUploadAltAm] = useState('')
  const [uploadCaption, setUploadCaption] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Asset Preview modal
  const [previewAsset, setPreviewAsset] = useState<MediaAssetItem | null>(null)

  // Metadata Edit modal
  const [editAsset, setEditAsset] = useState<MediaAssetItem | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editCategory, setEditCategory] = useState<MediaCategory>('GENERAL')
  const [editAltEn, setEditAltEn] = useState('')
  const [editAltAm, setEditAltAm] = useState('')
  const [editCaption, setEditCaption] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  // Deletion state & usage confirmation
  const [deletingAsset, setDeletingAsset] = useState<MediaAssetItem | null>(null)
  const [checkingUsage, setCheckingUsage] = useState(false)
  const [activeUsages, setActiveUsages] = useState<Array<{ entityType: string; entityTitle: string; entityId: string }> | null>(null)
  const [deleteConfirmed, setDeleteConfirmed] = useState(false)

  // Copied indicator
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'ALL') params.set('category', selectedCategory)
      if (searchQuery.trim()) params.set('search', searchQuery.trim())

      const res = await fetch(`/api/v1/media?${params.toString()}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.assets)) {
        setAssets(data.assets)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load media assets from server.' })
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    loadAssets()
  }, [loadAssets])

  // Aggregate Stats
  const totalStorageBytes = useMemo(() => {
    return assets.reduce((sum, item) => sum + (item.fileSize || 0), 0)
  }, [assets])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: assets.length }
    CATEGORIES.forEach((c) => {
      if (c.key !== 'ALL') {
        counts[c.key] = assets.filter((a) => a.category === c.key).length
      }
    })
    return counts
  }, [assets])

  const handleCopyUrl = (url: string) => {
    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`
    navigator.clipboard.writeText(fullUrl)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(null), 2500)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      if (!uploadTitle) {
        setUploadTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
      }
      if (file.type.startsWith('video/')) {
        setUploadCategory('VIDEOS')
      } else if (file.type === 'application/pdf') {
        setUploadCategory('DOCUMENTS')
      }
      setShowUploadModal(true)
    }
  }

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    setUploadProgress(20)
    setMsg(null)

    const fd = new FormData()
    fd.append('file', selectedFile)
    fd.append('category', uploadCategory)
    fd.append('title', uploadTitle.trim() || selectedFile.name)
    if (uploadAltEn) fd.append('altText_en', uploadAltEn.trim())
    if (uploadAltAm) fd.append('altText_am', uploadAltAm.trim())
    if (uploadCaption) fd.append('caption', uploadCaption.trim())

    try {
      setUploadProgress(50)
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      setUploadProgress(90)

      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Asset "${data.asset.title}" uploaded and registered into the library.` })
        setShowUploadModal(false)
        setSelectedFile(null)
        setUploadTitle('')
        setUploadAltEn('')
        setUploadAltAm('')
        setUploadCaption('')
        await loadAssets()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to upload asset.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error during media upload.' })
    } finally {
      setUploading(false)
      setUploadProgress(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // Open Edit Modal
  const openEditModal = (asset: MediaAssetItem) => {
    setEditAsset(asset)
    setEditTitle(asset.title)
    setEditCategory(asset.category)
    setEditAltEn(asset.altText_en || '')
    setEditAltAm(asset.altText_am || '')
    setEditCaption(asset.caption || '')
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editAsset) return

    setSavingEdit(true)
    try {
      const res = await fetch('/api/v1/media', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editAsset.id,
          title: editTitle.trim(),
          category: editCategory,
          altText_en: editAltEn.trim(),
          altText_am: editAltAm.trim(),
          caption: editCaption.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Metadata for "${editTitle}" updated successfully.` })
        setEditAsset(null)
        await loadAssets()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update metadata.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Error connecting to media server.' })
    } finally {
      setSavingEdit(false)
    }
  }

  // Initiate Deletion with Reference Check
  const initiateDelete = async (asset: MediaAssetItem) => {
    setDeletingAsset(asset)
    setCheckingUsage(true)
    setActiveUsages(null)
    setDeleteConfirmed(false)

    try {
      const res = await fetch(`/api/v1/media?checkUsage=${encodeURIComponent(asset.url)}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.usages)) {
        setActiveUsages(data.usages)
      }
    } catch {
      setActiveUsages([])
    } finally {
      setCheckingUsage(false)
    }
  }

  const executeDelete = async () => {
    if (!deletingAsset) return
    try {
      const res = await fetch(`/api/v1/media?id=${encodeURIComponent(deletingAsset.id)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Asset "${deletingAsset.title}" deleted from repository.` })
        setDeletingAsset(null)
        await loadAssets()
      } else {
        setMsg({ type: 'error', text: data.error || 'Could not delete media asset.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error while attempting to delete asset.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Storage KPIs */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
                Institutional Digital Asset Management (DAM)
              </span>
              <span className="text-xs font-semibold text-gray-500">
                WCAG 2.2 Accessible Media Vault
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight">
              Central Media Library
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
              Centralized repository for official woreda logos, sector photographs, civil construction progress assets, YouTube/MP4 documentaries, and signed PDF gazettes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer"
            >
              <span>📤</span>
              <span>Upload New Media</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/mp4,video/webm,application/pdf"
              className="hidden"
            />
          </div>
        </div>

        {/* Storage Health Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Stored Assets</p>
            <p className="text-xl font-black text-[#0d2340] mt-0.5">{assets.length}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Storage Footprint</p>
            <p className="text-xl font-black text-[#1a4f8b] mt-0.5">{formatSize(totalStorageBytes)}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Photos & Branding</p>
            <p className="text-xl font-black text-emerald-700 mt-0.5">
              {assets.filter((a) => a.mediaType === 'IMAGE').length}
            </p>
          </div>
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Videos & Documents</p>
            <p className="text-xl font-black text-amber-700 mt-0.5">
              {assets.filter((a) => a.mediaType !== 'IMAGE').length}
            </p>
          </div>
        </div>
      </div>

      {/* Alert Notification */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="opacity-70 hover:opacity-100 text-sm">
            ×
          </button>
        </div>
      )}

      {/* Category Tabs & Search Toolbar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-4">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.key
            const count = categoryCounts[cat.key] || 0
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setSelectedCategory(cat.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#1a4f8b] text-white shadow-xs'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Search & Layout Toggle Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, filename, caption or alt-text..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-xs text-gray-500 font-medium mr-1">View:</span>
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-blue-50 text-[#1a4f8b] border border-blue-200'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Grid view"
            >
              ⊞ Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-blue-50 text-[#1a4f8b] border border-blue-200'
                  : 'text-gray-400 hover:text-gray-700'
              }`}
              title="Table view"
            >
              ☰ Table
            </button>
          </div>
        </div>
      </div>

      {/* Main Asset Gallery / Table Area */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-xs text-gray-500">
          <svg className="w-8 h-8 animate-spin mx-auto text-[#1a4f8b] mb-3" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Scanning government digital asset repository...
        </div>
      ) : assets.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center">
          <span className="text-4xl">📂</span>
          <h3 className="text-base font-bold text-gray-800 mt-2">No media assets found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery
              ? `No items match the search query "${searchQuery}". Try clearing search or choosing another category.`
              : 'Start by uploading institutional photos, videos, or documents.'}
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-4 py-2 bg-[#1a4f8b] text-white text-xs font-bold rounded-xl hover:bg-[#133a6b] transition-colors cursor-pointer"
          >
            Upload First Asset
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Display */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group flex flex-col justify-between"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-gray-100 overflow-hidden flex items-center justify-center">
                {asset.mediaType === 'IMAGE' ? (
                  <img
                    src={asset.url}
                    alt={asset.altText_en || asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      // Fallback placeholder if image fails to render
                      ;(e.target as HTMLElement).style.display = 'none'
                    }}
                  />
                ) : asset.mediaType === 'VIDEO' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
                    <span className="text-3xl mb-1">🎥</span>
                    <span className="text-[11px] font-bold text-gray-200">Video Asset</span>
                    <span className="text-[10px] text-gray-400 mt-0.5 truncate max-w-full">{asset.filename}</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-rose-50 text-rose-700 p-4 text-center">
                    <span className="text-3xl mb-1">📄</span>
                    <span className="text-[11px] font-bold text-rose-900">PDF Document</span>
                    <span className="text-[10px] text-rose-600 mt-0.5 truncate max-w-full">{asset.filename}</span>
                  </div>
                )}

                {/* Type & Category Badges */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 backdrop-blur-xs text-white">
                    {asset.category}
                  </span>
                </div>

                <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white">
                  {formatSize(asset.fileSize)}
                </span>
              </div>

              {/* Asset Information */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[#0d2340] line-clamp-1 group-hover:text-[#1a4f8b] transition-colors" title={asset.title}>
                    {asset.title}
                  </h4>
                  {asset.caption && (
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-1 leading-snug">
                      {asset.caption}
                    </p>
                  )}
                  <div className="mt-2 text-[10px] text-gray-400 font-mono truncate" title={asset.filename}>
                    📁 {asset.filename}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(asset.url)}
                    className="flex-1 flex items-center justify-center gap-1 px-2.5 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 transition-colors cursor-pointer"
                    title="Copy direct URL to clipboard"
                  >
                    <span>{copiedUrl === asset.url ? '✓' : '🔗'}</span>
                    <span>{copiedUrl === asset.url ? 'Copied!' : 'Copy URL'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreviewAsset(asset)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-[#1a4f8b] hover:bg-blue-50 border border-gray-200 transition-colors cursor-pointer"
                    title="Preview asset"
                  >
                    👁️
                  </button>

                  <button
                    type="button"
                    onClick={() => openEditModal(asset)}
                    className="p-1.5 rounded-lg text-gray-500 hover:text-amber-700 hover:bg-amber-50 border border-gray-200 transition-colors cursor-pointer"
                    title="Edit metadata & alt text"
                  >
                    ✏️
                  </button>

                  <button
                    type="button"
                    onClick={() => initiateDelete(asset)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-rose-700 hover:bg-rose-50 border border-gray-200 transition-colors cursor-pointer"
                    title="Delete asset safely"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Detailed Table Display */
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Title & Context</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">File Specs</th>
                  <th className="py-3 px-4">Alt Text (EN / AM)</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {assets.map((asset) => (
                  <tr key={asset.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                        {asset.mediaType === 'IMAGE' ? (
                          <img src={asset.url} alt="" className="w-full h-full object-cover" />
                        ) : asset.mediaType === 'VIDEO' ? (
                          <span className="text-xl">🎥</span>
                        ) : (
                          <span className="text-xl">📄</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 max-w-xs">
                      <p className="font-bold text-[#0d2340] truncate" title={asset.title}>{asset.title}</p>
                      <p className="text-[10px] text-gray-400 font-mono truncate">{asset.filename}</p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1a4f8b] border border-blue-200">
                        {asset.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-mono text-gray-700">{formatSize(asset.fileSize)}</p>
                      <p className="text-[10px] text-gray-400 uppercase">{asset.mediaType}</p>
                    </td>
                    <td className="py-3 px-4 max-w-xs truncate text-[11px] text-gray-500">
                      {asset.altText_en || '—'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-1">
                      <button
                        type="button"
                        onClick={() => handleCopyUrl(asset.url)}
                        className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 rounded text-[11px] font-bold text-gray-700 transition-colors cursor-pointer"
                      >
                        {copiedUrl === asset.url ? '✓ Copied' : '🔗 Copy'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setPreviewAsset(asset)}
                        className="p-1 rounded text-gray-500 hover:text-[#1a4f8b]"
                        title="Preview"
                      >
                        👁️
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(asset)}
                        className="p-1 rounded text-gray-500 hover:text-amber-700"
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        type="button"
                        onClick={() => initiateDelete(asset)}
                        className="p-1 rounded text-gray-400 hover:text-rose-700"
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && selectedFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Register New Media Asset</h3>
                <p className="text-xs text-gray-500">Provide official accessibility metadata and categorization.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false)
                  setSelectedFile(null)
                }}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 flex items-center gap-3">
                <span className="text-2xl">
                  {selectedFile.type.startsWith('video/') ? '🎥' : selectedFile.type === 'application/pdf' ? '📄' : '🖼️'}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[#0d2340] truncate">{selectedFile.name}</p>
                  <p className="text-[10px] text-gray-500 font-mono">
                    {formatSize(selectedFile.size)} • {selectedFile.type}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Asset Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  placeholder="e.g., Chacha Central Water Basin Inspection"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Media Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={uploadCategory}
                  onChange={(e) => setUploadCategory(e.target.value as MediaCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                >
                  <option value="BRANDING">Logos & Official Branding</option>
                  <option value="NEWS">News & Press Releases</option>
                  <option value="PROJECTS">Development Projects</option>
                  <option value="TOURISM">Tourism & Cultural Sites</option>
                  <option value="VIDEOS">Official Videos & Documentaries</option>
                  <option value="DOCUMENTS">Public Documents & Circulars</option>
                  <option value="OFFICES">Directorate & Sector Offices</option>
                  <option value="GENERAL">General Media</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Alt-Text (English, Accessibility)
                  </label>
                  <input
                    type="text"
                    value={uploadAltEn}
                    onChange={(e) => setUploadAltEn(e.target.value)}
                    placeholder="Descriptive text for screen-readers"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Alt-Text (Amharic / አማርኛ)
                  </label>
                  <input
                    type="text"
                    value={uploadAltAm}
                    onChange={(e) => setUploadAltAm(e.target.value)}
                    placeholder="የምስል ገላጭ ጽሑፍ"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Official Caption / Notes</label>
                <textarea
                  rows={2}
                  value={uploadCaption}
                  onChange={(e) => setUploadCaption(e.target.value)}
                  placeholder="Contextual description, date of photography, or publication notes..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              {uploadProgress !== null && (
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#1a4f8b] h-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowUploadModal(false)
                    setSelectedFile(null)
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {uploading ? 'Processing & Securing...' : 'Upload & Save Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Lightbox Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">{previewAsset.title}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a4f8b] border border-blue-200">
                  {previewAsset.category}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="bg-black/5 rounded-xl overflow-hidden flex items-center justify-center max-h-96">
              {previewAsset.mediaType === 'IMAGE' ? (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.altText_en || previewAsset.title}
                  className="max-h-96 max-w-full object-contain"
                />
              ) : previewAsset.mediaType === 'VIDEO' ? (
                <video src={previewAsset.url} controls className="max-h-96 max-w-full rounded-xl" autoPlay />
              ) : (
                <div className="p-8 text-center">
                  <span className="text-5xl">📄</span>
                  <p className="text-xs font-bold text-gray-700 mt-2">{previewAsset.filename}</p>
                  <a
                    href={previewAsset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-block mt-3 px-4 py-2 bg-[#1a4f8b] text-white text-xs font-bold rounded-xl"
                  >
                    Download / View PDF in New Tab
                  </a>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 rounded-xl p-3 text-xs border border-gray-100">
              <div>
                <span className="text-gray-400 text-[10px] uppercase block font-bold">File Size</span>
                <span className="font-bold text-gray-800">{formatSize(previewAsset.fileSize)}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block font-bold">MIME Format</span>
                <span className="font-bold text-gray-800">{previewAsset.mimeType}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block font-bold">Uploaded By</span>
                <span className="font-bold text-gray-800 truncate block">{previewAsset.uploadedBy || 'Admin'}</span>
              </div>
              <div>
                <span className="text-gray-400 text-[10px] uppercase block font-bold">Created Date</span>
                <span className="font-bold text-gray-800">
                  {new Date(previewAsset.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleCopyUrl(previewAsset.url)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {copiedUrl === previewAsset.url ? '✓ Copied!' : '🔗 Copy Direct URL'}
              </button>
              <button
                type="button"
                onClick={() => setPreviewAsset(null)}
                className="px-4 py-2 bg-[#1a4f8b] text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Metadata Modal */}
      {editAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Edit Asset Metadata</h3>
                <p className="text-xs text-gray-500 font-mono truncate">{editAsset.filename}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditAsset(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Asset Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value as MediaCategory)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                >
                  <option value="BRANDING">Logos & Official Branding</option>
                  <option value="NEWS">News & Press Releases</option>
                  <option value="PROJECTS">Development Projects</option>
                  <option value="TOURISM">Tourism & Cultural Sites</option>
                  <option value="VIDEOS">Official Videos & Documentaries</option>
                  <option value="DOCUMENTS">Public Documents & Circulars</option>
                  <option value="OFFICES">Directorate & Sector Offices</option>
                  <option value="GENERAL">General Media</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Alt-Text (English)</label>
                  <input
                    type="text"
                    value={editAltEn}
                    onChange={(e) => setEditAltEn(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Alt-Text (Amharic)</label>
                  <input
                    type="text"
                    value={editAltAm}
                    onChange={(e) => setEditAltAm(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Caption / Context</label>
                <textarea
                  rows={2}
                  value={editCaption}
                  onChange={(e) => setEditCaption(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditAsset(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b] disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Update Metadata'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal with Reference Safety Check */}
      {deletingAsset && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center text-xl shrink-0 font-bold">
                ⚠️
              </span>
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Delete Media Asset</h3>
                <p className="text-xs text-gray-500 font-mono truncate">{deletingAsset.filename}</p>
              </div>
            </div>

            {checkingUsage ? (
              <div className="p-4 bg-gray-50 rounded-xl text-center text-xs text-gray-500">
                Checking usage references across woreda portal...
              </div>
            ) : activeUsages && activeUsages.length > 0 ? (
              <div className="space-y-3">
                <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  <p className="font-bold mb-1">Cannot Delete: Asset In Active Use</p>
                  This media file is currently linked to <strong>{activeUsages.length}</strong> public record(s). Deleting it would result in broken images or links.
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5 p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {activeUsages.map((u, i) => (
                    <div key={i} className="text-[11px] p-2 bg-white rounded-lg border border-gray-100">
                      <span className="font-bold text-[#1a4f8b]">{u.entityType}:</span> {u.entityTitle}
                    </div>
                  ))}
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setDeletingAsset(null)}
                    className="px-4 py-2 bg-gray-800 text-white text-xs font-bold rounded-xl hover:bg-black"
                  >
                    Understood (Close)
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-gray-600">
                  This asset is <strong>not currently referenced</strong> in any live publications. Are you sure you want to permanently delete <strong>{deletingAsset.title}</strong>?
                </p>
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setDeletingAsset(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={executeDelete}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                  >
                    Confirm Permanent Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
