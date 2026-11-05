'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'

export interface DocumentItem {
  id: string
  title_en: string
  title_am?: string
  category: string
  fileUrl: string
  fileSize?: string
  fileType?: string
  officeName?: string
  referenceNumber?: string
  version?: string
  downloadCount?: number
  description_en?: string
  description_am?: string
  status: 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string
  displayOrder: number
}

const DOCUMENT_CATEGORIES = [
  'Application Forms',
  'Annual Reports & Plans',
  'Legal Directives & Gazettes',
  'Citizen Charters & Guidelines',
  'Statistical Bulletins',
  'Public Procurement Notices',
]

const POPULAR_OFFICES = [
  'Vital Events Registration Desk',
  'Land Administration & Use Bureau',
  'Finance & Economic Development Office',
  'Trade & Investment Office',
  'Agriculture & Rural Development Office',
  'Woreda Administration Executive Cabinet',
]

export default function AdminDocumentsPage() {
  const [items, setItems] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DocumentItem | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Form fields
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [category, setCategory] = useState('Application Forms')
  const [officeName, setOfficeName] = useState('Vital Events Registration Desk')
  const [fileUrl, setFileUrl] = useState('')
  const [fileSize, setFileSize] = useState('500 KB')
  const [fileType, setFileType] = useState('PDF')
  const [referenceNumber, setReferenceNumber] = useState('')
  const [version, setVersion] = useState('1.0')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAm, setDescriptionAm] = useState('')
  const [status, setStatus] = useState<'PUBLISHED' | 'ARCHIVED'>('PUBLISHED')
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0])
  const [displayOrder, setDisplayOrder] = useState('1')
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchDocuments()
  }, [])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/documents')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load official documents repository.' })
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = useMemo(() => {
    return items.filter((d) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        d.title_en.toLowerCase().includes(q) ||
        (d.title_am && d.title_am.includes(q)) ||
        (d.referenceNumber && d.referenceNumber.toLowerCase().includes(q)) ||
        (d.officeName && d.officeName.toLowerCase().includes(q))
      const matchesCategory = categoryFilter === 'ALL' || d.category === categoryFilter
      const matchesStatus = statusFilter === 'ALL' || d.status === statusFilter
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [items, searchQuery, categoryFilter, statusFilter])

  const handleOpenCreate = () => {
    setEditingItem(null)
    const randomNum = Math.floor(10 + Math.random() * 90)
    setTitleEn('')
    setTitleAm('')
    setCategory('Application Forms')
    setOfficeName('Vital Events Registration Desk')
    setFileUrl('')
    setFileSize('450 KB')
    setFileType('PDF')
    setReferenceNumber(`ATW/DOC/2026/${randomNum}`)
    setVersion('1.0')
    setDescriptionEn('')
    setDescriptionAm('')
    setStatus('PUBLISHED')
    setPublishedAt(new Date().toISOString().split('T')[0])
    setDisplayOrder('1')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: DocumentItem) => {
    setEditingItem(item)
    setTitleEn(item.title_en || '')
    setTitleAm(item.title_am || '')
    setCategory(item.category || 'Application Forms')
    setOfficeName(item.officeName || 'Woreda Administration Office')
    setFileUrl(item.fileUrl || '')
    setFileSize(item.fileSize || '500 KB')
    setFileType(item.fileType || 'PDF')
    setReferenceNumber(item.referenceNumber || '')
    setVersion(item.version || '1.0')
    setDescriptionEn(item.description_en || '')
    setDescriptionAm(item.description_am || '')
    setStatus(item.status || 'PUBLISHED')
    setPublishedAt(item.publishedAt ? item.publishedAt.split('T')[0] : '')
    setDisplayOrder(item.displayOrder ? item.displayOrder.toString() : '1')
    setIsModalOpen(true)
  }

  // Handle PDF upload
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPdf(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', 'DOCUMENTS')
    fd.append('title', titleEn || file.name)

    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setFileUrl(data.url)
        const sizeFormatted = file.size < 1024 * 1024 ? `${(file.size / 1024).toFixed(0)} KB` : `${(file.size / 1024 / 1024).toFixed(1)} MB`
        setFileSize(sizeFormatted)
        if (!titleEn) {
          setTitleEn(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '))
        }
      } else {
        alert(data.error || 'Failed to upload document.')
      }
    } catch {
      alert('Upload communication error.')
    } finally {
      setUploadingPdf(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)

    const payload = {
      title_en: titleEn.trim(),
      title_am: titleAm.trim() || undefined,
      category,
      officeName,
      fileUrl: fileUrl.trim() || '/uploads/documents/document-template.pdf',
      fileSize,
      fileType,
      referenceNumber: referenceNumber.trim() || undefined,
      version: version.trim() || '1.0',
      description_en: descriptionEn.trim() || undefined,
      description_am: descriptionAm.trim() || undefined,
      status,
      publishedAt: publishedAt || undefined,
      displayOrder: parseInt(displayOrder, 10) || 1,
    }

    try {
      const url = '/api/v1/documents'
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem ? { id: editingItem.id, ...payload } : payload

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setMsg({
          type: 'success',
          text: `Document "${titleEn}" ${editingItem ? 'updated' : 'published'} successfully.`,
        })
        setIsModalOpen(false)
        await fetchDocuments()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to save document.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication failure.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Permanently delete document "${name}"?`)) return
    try {
      const res = await fetch(`/api/v1/documents?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Document "${name}" removed.` })
        await fetchDocuments()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete document.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Civil Service Documentation & Gazette
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Open Download Repository
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight">
            Official Documents & Public Forms Library
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Maintain gazetted administrative directives, citizen service application forms, fiscal plans, and circulars for public and institutional download.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer self-start md:self-auto"
        >
          <span>📄</span>
          <span>Upload New Document</span>
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Stored Files</p>
          <p className="text-2xl font-black text-[#0d2340] mt-1">{items.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Application Forms</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {items.filter((d) => d.category === 'Application Forms').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Directives & Gazettes</p>
          <p className="text-2xl font-black text-[#1a4f8b] mt-1">
            {items.filter((d) => d.category.includes('Directives')).length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Archived Documents</p>
          <p className="text-2xl font-black text-gray-600 mt-1">
            {items.filter((d) => d.status === 'ARCHIVED').length}
          </p>
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

      {/* Filter Toolbar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents by title, circular number, or office..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Categories</option>
            {DOCUMENT_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-gray-500">Loading document vault...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-16 text-center text-xs text-gray-500">No documents found matching your filter.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Document Title & Gazette Ref</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Authorizing Directorate</th>
                  <th className="py-3 px-4">File Specs</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredItems.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xl">📄</span>
                        <div>
                          <p className="font-bold text-[#0d2340] leading-tight">{doc.title_en}</p>
                          {doc.title_am && <p className="text-[11px] text-gray-500">{doc.title_am}</p>}
                          {doc.referenceNumber && (
                            <span className="inline-block mt-1 font-mono text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-200">
                              Ref: {doc.referenceNumber} • v{doc.version || '1.0'}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#1a4f8b] border border-blue-200">
                        {doc.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-gray-600 font-medium">
                      {doc.officeName || 'General Administration'}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-mono text-gray-700 font-bold">{doc.fileSize || 'PDF'}</span>
                      <p className="text-[10px] text-gray-400">{doc.fileType || 'PDF'}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                          doc.status === 'PUBLISHED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-gray-100 text-gray-700 border-gray-200'
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      {doc.fileUrl && (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-colors inline-block"
                        >
                          👁️ View
                        </a>
                      )}
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(doc)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1a4f8b] font-bold rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(doc.id, doc.title_en)}
                        className="p-1 text-gray-400 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create / Edit Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">
                  {editingItem ? 'Edit Document Entry' : 'Upload & Publish Government Document'}
                </h3>
                <p className="text-xs text-gray-500">Provide official gazette reference metadata and attach file.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Title (English) *</label>
                <input
                  type="text"
                  required
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g., Vital Events Civil Registration Application Form"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Title (Amharic / አማርኛ)</label>
                <input
                  type="text"
                  value={titleAm}
                  onChange={(e) => setTitleAm(e.target.value)}
                  placeholder="የሰነዱ ይፋዊ ርዕስ..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Document Classification *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    {DOCUMENT_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Authorizing Office Directorate</label>
                  <select
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    {POPULAR_OFFICES.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official Circular / Reference #</label>
                  <input
                    type="text"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    placeholder="e.g., ATW/CIR/2026/05"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Document Version</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="e.g., 1.0 or 2026 Revision"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* Direct PDF Upload Area */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Attach Document File (PDF)
                    </h4>
                    <p className="text-[11px] text-gray-500">Secure upload directly to official downloads repository.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPdf}
                    className="px-3 py-1.5 bg-[#1a4f8b] text-white text-xs font-bold rounded-lg hover:bg-[#133a6b]"
                  >
                    {uploadingPdf ? 'Uploading...' : '📁 Select PDF File'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePdfUpload}
                    accept="application/pdf"
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  required
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="/uploads/documents/file.pdf"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Document Summary & Purpose (English)</label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b] disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Document' : 'Commit to Repository'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
