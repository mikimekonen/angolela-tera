'use client'

import React, { useState, useEffect } from 'react'

interface DocumentItem {
  id: string
  title_en: string
  title_am?: string
  category: string
  fileUrl: string
  fileSize?: string
  fileType?: string
  officeName?: string
  description_en?: string
  description_am?: string
  status: 'PUBLISHED' | 'ARCHIVED'
  publishedAt?: string
  displayOrder: number
}

export default function AdminDocumentsPage() {
  const [items, setItems] = useState<DocumentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DocumentItem | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form fields
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [category, setCategory] = useState('Application Forms')
  const [officeName, setOfficeName] = useState('Vital Events Registration Desk')
  const [fileUrl, setFileUrl] = useState('/uploads/documents/vital-events-form.pdf')
  const [fileSize, setFileSize] = useState('500 KB')
  const [fileType, setFileType] = useState('PDF')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAm, setDescriptionAm] = useState('')
  const [status, setStatus] = useState<'PUBLISHED' | 'ARCHIVED'>('PUBLISHED')
  const [publishedAt, setPublishedAt] = useState(new Date().toISOString().split('T')[0])
  const [displayOrder, setDisplayOrder] = useState('1')

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

  const handleOpenCreate = () => {
    setEditingItem(null)
    setTitleEn('')
    setTitleAm('')
    setCategory('Application Forms')
    setOfficeName('Vital Events Registration Desk')
    setFileUrl('/uploads/documents/document-form.pdf')
    setFileSize('450 KB')
    setFileType('PDF')
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
    setOfficeName(item.officeName || '')
    setFileUrl(item.fileUrl || '')
    setFileSize(item.fileSize || '500 KB')
    setFileType(item.fileType || 'PDF')
    setDescriptionEn(item.description_en || '')
    setDescriptionAm(item.description_am || '')
    setStatus(item.status || 'PUBLISHED')
    setPublishedAt(item.publishedAt || new Date().toISOString().split('T')[0])
    setDisplayOrder(item.displayOrder ? item.displayOrder.toString() : '1')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleEn.trim()) {
      setMsg({ type: 'error', text: 'Document title (English) is required.' })
      return
    }

    try {
      const payload = {
        title_en: titleEn.trim(),
        title_am: titleAm.trim() || null,
        category,
        officeName: officeName.trim() || null,
        fileUrl: fileUrl.trim() || '/uploads/documents/document.pdf',
        fileSize: fileSize.trim() || '500 KB',
        fileType: fileType.trim() || 'PDF',
        description_en: descriptionEn.trim() || null,
        description_am: descriptionAm.trim() || null,
        status,
        publishedAt: publishedAt.trim() || new Date().toISOString().split('T')[0],
        displayOrder: parseInt(displayOrder) || 1,
      }

      if (editingItem) {
        const res = await fetch('/api/v1/documents', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingItem.id }),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: 'Document updated successfully.' })
          setIsModalOpen(false)
          fetchDocuments()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to update document.' })
        }
      } else {
        const res = await fetch('/api/v1/documents', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: 'Document uploaded to repository.' })
          setIsModalOpen(false)
          fetchDocuments()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to create document.' })
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'An unexpected error occurred while saving.' })
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return
    try {
      const res = await fetch(`/api/v1/documents?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Deleted "${title}".` })
        fetchDocuments()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete document.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' })
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Official Document & Legal Repository</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Manage public downloadable application forms, proclamations, directives, budgets, and audit reports.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <span>+</span> Upload Document
        </button>
      </div>

      {/* Alert */}
      {msg && (
        <div
          className={`p-4 rounded-lg flex items-center justify-between text-sm ${
            msg.type === 'success'
              ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
              : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-gray-400 hover:text-white ml-3 font-bold">✕</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-[#0b1626] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h2 className="font-semibold text-white text-sm">Official Document Library ({items.length})</h2>
          <span className="text-xs text-gray-400">Public Portal Synchronized</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading document registry...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No documents found. Click "+ Upload Document" to add one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Document Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Office / Origin</th>
                  <th className="px-4 py-3">Format / Size</th>
                  <th className="px-4 py-3">Published Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{item.title_en}</div>
                      {item.title_am && <div className="text-xs text-gray-400">{item.title_am}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {item.officeName || 'General Administration'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300 font-mono">
                      {item.fileType || 'PDF'} • {item.fileSize || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {item.publishedAt || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="px-2.5 py-1 text-xs bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded border border-blue-500/30 transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id, item.title_en)}
                        className="px-2.5 py-1 text-xs bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded border border-red-500/30 transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b1626] border border-white/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Document' : 'Upload Document to Repository'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Document Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Citizen Vital Events Application Form"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">የሰነዱ ርዕስ (አማርኛ)</label>
                  <input
                    type="text"
                    value={titleAm}
                    onChange={(e) => setTitleAm(e.target.value)}
                    placeholder="ምሳሌ፡ የወሳኝ ኩነት ምዝገባ ማመልከቻ ቅጽ"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#081220] border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Application Forms">Application Forms</option>
                    <option value="Annual Reports">Annual Reports</option>
                    <option value="Legal Directives">Legal Directives</option>
                    <option value="Proclamations & Regulations">Proclamations & Regulations</option>
                    <option value="Financial & Audit Summaries">Financial & Audit Summaries</option>
                    <option value="Public Notices">Public Notices</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Issuing Office / Desk</label>
                  <input
                    type="text"
                    value={officeName}
                    onChange={(e) => setOfficeName(e.target.value)}
                    placeholder="e.g. Finance & Economic Development Office"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">File URL / Download Path</label>
                  <input
                    type="text"
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="/uploads/documents/form.pdf"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">File Size</label>
                  <input
                    type="text"
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="420 KB"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">File Format</label>
                  <input
                    type="text"
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    placeholder="PDF, DOCX, XLSX"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description (English)</label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Official instructions or purpose of this document..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">መግለጫ (አማርኛ)</label>
                <textarea
                  rows={2}
                  value={descriptionAm}
                  onChange={(e) => setDescriptionAm(e.target.value)}
                  placeholder="የሰነዱ ማብራሪያ ወይም ጥቅም..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Publication Date</label>
                  <input
                    type="date"
                    value={publishedAt}
                    onChange={(e) => setPublishedAt(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#081220] border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="PUBLISHED">Published</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-gray-300 text-sm font-medium rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-emerald-950/40 transition-colors cursor-pointer"
                >
                  {editingItem ? 'Save Changes' : 'Upload to Library'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
