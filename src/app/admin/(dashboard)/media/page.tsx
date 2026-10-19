'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'

interface MediaFile {
  filename: string
  url: string
  size: number
  modified: string
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

export default function MediaLibraryPage() {
  const [tab, setTab] = useState<'images' | 'documents'>('images')
  const [files, setFiles] = useState<MediaFile[]>([])
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadFiles = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/v1/media/upload?type=${tab}`)
      const data = await res.json()
      setFiles(data.files || [])
    } catch {
      setError('Failed to load media library.')
    } finally {
      setLoading(false)
    }
  }, [tab])

  useEffect(() => { loadFiles() }, [loadFiles])

  const handleUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return
    setError('')
    setSuccess('')
    setUploading(true)

    const results: string[] = []
    for (const file of Array.from(fileList)) {
      const fd = new FormData()
      fd.append('file', file)
      try {
        const res = await fetch('/api/v1/media/upload', {
          method: 'POST',
          body: fd,
          credentials: 'include',
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'Upload failed')
        results.push(data.url)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload error')
      }
    }

    if (results.length > 0) {
      setSuccess(`✅ Uploaded ${results.length} file(s) successfully.`)
      await loadFiles()
    }
    setUploading(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    handleUpload(e.dataTransfer.files)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500 mt-0.5">Upload and manage images and documents for the portal</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white font-semibold px-4 py-2.5 rounded-lg shadow text-sm transition-colors disabled:opacity-60"
        >
          {uploading ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Uploading…</>
          ) : (
            <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>Upload Files</>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,application/pdf"
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
        />
      </div>

      {/* Feedback messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* Drag-and-drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed border-gray-300 hover:border-[#1a4f8b] rounded-xl p-8 text-center transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50"
        onClick={() => fileInputRef.current?.click()}
      >
        <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <p className="text-sm font-medium text-gray-600">Drag & drop files here, or <span className="text-[#1a4f8b] underline">click to browse</span></p>
        <p className="text-xs text-gray-400 mt-1">Images (JPEG, PNG, WebP, SVG) or PDF — max 8 MB per file</p>
      </div>

      {/* Tab selector */}
      <div className="flex border-b border-gray-200">
        {(['images', 'documents'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-[#1a4f8b] text-[#1a4f8b]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'images' ? '🖼️ Images' : '📄 Documents'}
            <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full">{tab === t ? files.length : '—'}</span>
          </button>
        ))}
        <button onClick={loadFiles} className="ml-auto px-3 py-2 text-xs text-gray-400 hover:text-gray-600 transition-colors" title="Refresh">
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
        </button>
      </div>

      {/* File grid */}
      {loading && (
        <div className="text-center py-12 text-gray-400 text-sm">Loading media library…</div>
      )}

      {!loading && files.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-16 h-16 mx-auto text-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
          <p className="text-gray-500 font-medium">No {tab} uploaded yet.</p>
          <p className="text-gray-400 text-sm mt-1">Upload files using the button or drag & drop above.</p>
        </div>
      )}

      {!loading && files.length > 0 && (
        <div className={tab === 'images'
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'
          : 'divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden'
        }>
          {files.map((f) => (
            tab === 'images' ? (
              <div key={f.filename} className="group relative bg-gray-100 rounded-lg overflow-hidden aspect-square cursor-pointer border border-gray-200 hover:border-[#1a4f8b] transition-colors" onClick={() => setPreviewUrl(f.url)}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.filename} className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2">
                  <p className="text-white text-xs font-medium text-center truncate w-full">{f.filename}</p>
                  <p className="text-white/70 text-[10px]">{formatSize(f.size)}</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(f.url); setSuccess(`Copied: ${f.url}`) }}
                    className="mt-2 text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-1 rounded transition-colors"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ) : (
              <div key={f.filename} className="flex items-center gap-4 px-4 py-3 bg-white hover:bg-gray-50 transition-colors">
                <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">📄</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{f.filename}</p>
                  <p className="text-xs text-gray-500">{formatSize(f.size)} • {new Date(f.modified).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a href={f.url} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1a4f8b] hover:underline">View</a>
                  <button
                    onClick={() => { navigator.clipboard.writeText(f.url); setSuccess(`Copied: ${f.url}`) }}
                    className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Copy
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {/* Image preview modal */}
      {previewUrl && (
        <div className="fixed inset-0 bg-black/80 z-[300] flex items-center justify-center p-4" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-3xl max-h-[85vh]" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="max-h-[80vh] max-w-full rounded-lg shadow-2xl" />
            <div className="mt-3 flex gap-3 items-center justify-between">
              <p className="text-white text-xs truncate">{previewUrl}</p>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { navigator.clipboard.writeText(previewUrl); setSuccess(`Copied: ${previewUrl}`) }} className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded transition-colors">Copy URL</button>
                <button onClick={() => setPreviewUrl(null)} className="bg-white/20 hover:bg-white/30 text-white text-xs px-3 py-1.5 rounded transition-colors">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
