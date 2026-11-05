'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'
import type { TenderItem } from '@/types'

const STATUS_CONFIG: Record<string, { label: string; badge: string; icon: string }> = {
  ACTIVE: { label: 'Active & Accepting Bids', badge: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '🟢' },
  EVALUATING: { label: 'Under Technical Evaluation', badge: 'bg-amber-50 text-amber-800 border-amber-200', icon: '🟡' },
  AWARDED: { label: 'Contract Officially Awarded', badge: 'bg-blue-50 text-blue-800 border-blue-200', icon: '🔵' },
  CANCELLED: { label: 'Cancelled / Retendered', badge: 'bg-rose-50 text-rose-800 border-rose-200', icon: '⚪' },
}

export default function AdminTendersPage() {
  const [tenders, setTenders] = useState<TenderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingItem, setEditingItem] = useState<TenderItem | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Form state
  const [bidNumber, setBidNumber] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [procuringEntity, setProcuringEntity] = useState('Office of Agriculture and Natural Resources')
  const [bidBondAmount, setBidBondAmount] = useState('50,000 ETB (CPO)')
  const [documentPrice, setDocumentPrice] = useState('200 ETB Non-refundable')
  const [closingDate, setClosingDate] = useState('')
  const [openingDate, setOpeningDate] = useState('')
  const [tenderStatus, setTenderStatus] = useState<'ACTIVE' | 'EVALUATING' | 'AWARDED' | 'CANCELLED'>('ACTIVE')
  const [documentUrl, setDocumentUrl] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAm, setDescriptionAm] = useState('')
  const [criteria, setCriteria] = useState<string[]>([])
  const [newCriterion, setNewCriterion] = useState('')
  const [awardedContractor, setAwardedContractor] = useState('')
  const [winningBidAmount, setWinningBidAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [uploadingPdf, setUploadingPdf] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetchTenders()
  }, [])

  const fetchTenders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/tenders')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setTenders(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load procurement notices.' })
    } finally {
      setLoading(false)
    }
  }

  // Calculate Days Remaining
  const getDaysRemaining = (closing: string | Date) => {
    const end = new Date(closing).getTime()
    const now = Date.now()
    const diff = end - now
    if (diff <= 0) return { expired: true, text: 'Expired / Closed' }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    return {
      expired: false,
      text: days === 0 ? `${hours} hours remaining` : `${days} day${days > 1 ? 's' : ''} left`,
      isUrgent: days < 3,
    }
  }

  const filteredTenders = useMemo(() => {
    return tenders.filter((t) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        t.title_en.toLowerCase().includes(q) ||
        (t.title_am && t.title_am.includes(q)) ||
        t.bidNumber.toLowerCase().includes(q) ||
        t.procuringEntity.toLowerCase().includes(q)
      const matchesStatus = statusFilter === 'ALL' || t.tenderStatus === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [tenders, searchQuery, statusFilter])

  const handleOpenCreate = () => {
    setEditingItem(null)
    const randomId = Math.floor(10 + Math.random() * 90)
    setBidNumber(`ATW/NCB/${randomId}/2026`)
    setTitleEn('')
    setTitleAm('')
    setProcuringEntity('Woreda Office of Agriculture and Natural Resources')
    setBidBondAmount('50,000 ETB (CPO)')
    setDocumentPrice('200 ETB Non-refundable')
    setClosingDate(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0])
    setOpeningDate(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0])
    setTenderStatus('ACTIVE')
    setDocumentUrl('')
    setDescriptionEn('')
    setDescriptionAm('')
    setCriteria([
      'Valid & renewed trade license for the current fiscal year',
      'Tax Clearance Certificate from Ethiopian Revenues and Customs Authority',
      'VAT Registration Certificate & TIN Identification Number',
      'Bid Security (CPO) unconditional bank guarantee payable to Angolela Tera Woreda',
    ])
    setAwardedContractor('')
    setWinningBidAmount('')
    setIsCreating(true)
  }

  const handleOpenEdit = (item: TenderItem) => {
    setEditingItem(item)
    setBidNumber(item.bidNumber)
    setTitleEn(item.title_en)
    setTitleAm(item.title_am || '')
    setProcuringEntity(item.procuringEntity)
    setBidBondAmount(item.bidBondAmount || '')
    setDocumentPrice(item.documentPrice || '')
    setClosingDate(new Date(item.closingDate).toISOString().split('T')[0])
    setOpeningDate(item.openingDate ? new Date(item.openingDate).toISOString().split('T')[0] : '')
    setTenderStatus(item.tenderStatus)
    setDocumentUrl(item.documentUrl || '')
    setDescriptionEn(item.description_en || '')
    setDescriptionAm(item.description_am || '')
    setCriteria(Array.isArray(item.eligibilityCriteria) ? [...item.eligibilityCriteria] : [])
    setAwardedContractor(item.awardedContractor || '')
    setWinningBidAmount(item.winningBidAmount || '')
    setIsCreating(true)
  }

  // Upload Tender Dossier PDF
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingPdf(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', 'DOCUMENTS')
    fd.append('title', `Tender Specification Dossier - ${bidNumber}`)

    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setDocumentUrl(data.url)
        alert('Tender specification PDF uploaded successfully.')
      } else {
        alert(data.error || 'Failed to upload tender document.')
      }
    } catch {
      alert('Communication error while uploading document.')
    } finally {
      setUploadingPdf(false)
      if (pdfInputRef.current) pdfInputRef.current.value = ''
    }
  }

  const addCriterion = () => {
    if (!newCriterion.trim()) return
    setCriteria((prev) => [...prev, newCriterion.trim()])
    setNewCriterion('')
  }

  const removeCriterion = (idx: number) => {
    setCriteria((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)

    const payload = {
      bidNumber: bidNumber.trim(),
      title_en: titleEn.trim(),
      title_am: titleAm.trim() || undefined,
      procuringEntity: procuringEntity.trim(),
      bidBondAmount: bidBondAmount.trim() || undefined,
      documentPrice: documentPrice.trim() || undefined,
      closingDate,
      openingDate: openingDate || undefined,
      tenderStatus,
      documentUrl: documentUrl.trim() || undefined,
      description_en: descriptionEn.trim() || undefined,
      description_am: descriptionAm.trim() || undefined,
      eligibilityCriteria: criteria,
      awardedContractor: tenderStatus === 'AWARDED' ? awardedContractor.trim() || undefined : undefined,
      winningBidAmount: tenderStatus === 'AWARDED' ? winningBidAmount.trim() || undefined : undefined,
    }

    try {
      const url = '/api/v1/tenders'
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
          text: `Tender notice ${bidNumber} ${editingItem ? 'updated' : 'published'} successfully.`,
        })
        setIsCreating(false)
        await fetchTenders()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to save tender notice.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication failure.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, ref: string) => {
    if (!window.confirm(`Permanently remove tender notice ${ref}?`)) return
    try {
      const res = await fetch(`/api/v1/tenders?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Tender notice ${ref} deleted.` })
        await fetchTenders()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete tender.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Federal & Regional Procurement Guidelines
            </span>
            <span className="text-xs font-semibold text-gray-500">
              National Competitive Bidding (NCB)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight">
            Public Tenders & Procurement Desk
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Publish official woreda tenders, upload technical bid specifications, enforce statutory closing deadlines, and disclose final contract award results.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer self-start md:self-auto"
        >
          <span>⚖️</span>
          <span>Publish Tender Notice</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Notices</p>
          <p className="text-2xl font-black text-[#0d2340] mt-1">{tenders.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Open for Bidding</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {tenders.filter((t) => t.tenderStatus === 'ACTIVE').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Evaluating Bids</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {tenders.filter((t) => t.tenderStatus === 'EVALUATING').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Awarded Contracts</p>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {tenders.filter((t) => t.tenderStatus === 'AWARDED').length}
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

      {/* Filters Toolbar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tenders by bid number, procuring office, or title..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Lifecycle:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Lifecycles</option>
            <option value="ACTIVE">Active & Open</option>
            <option value="EVALUATING">Evaluating</option>
            <option value="AWARDED">Officially Awarded</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Tenders List */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-xs text-gray-500">
          Loading government procurement ledger...
        </div>
      ) : filteredTenders.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center text-xs text-gray-500">
          No procurement notices match your search criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTenders.map((tender) => {
            const statusInfo = STATUS_CONFIG[tender.tenderStatus] || STATUS_CONFIG.ACTIVE
            const countdown = getDaysRemaining(tender.closingDate)
            return (
              <div
                key={tender.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-black bg-gray-100 text-[#0d2340] border border-gray-300">
                      {tender.bidNumber}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusInfo.badge}`}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                    {!countdown.expired && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        countdown.isUrgent ? 'bg-rose-100 text-rose-800 animate-pulse' : 'bg-gray-100 text-gray-600'
                      }`}>
                        ⏳ {countdown.text}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-[#0d2340]">{tender.title_en}</h3>
                    {tender.title_am && <p className="text-xs text-gray-500 font-medium">{tender.title_am}</p>}
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500 pt-1">
                    <span>🏛️ <strong>Procuring Entity:</strong> {tender.procuringEntity}</span>
                    <span>💰 <strong>CPO Bid Bond:</strong> {tender.bidBondAmount || 'N/A'}</span>
                    <span>📑 <strong>Document Fee:</strong> {tender.documentPrice || 'Free'}</span>
                    <span>📅 <strong>Closing:</strong> {new Date(tender.closingDate).toLocaleDateString()}</span>
                  </div>

                  {/* Award Disclosure */}
                  {tender.tenderStatus === 'AWARDED' && tender.awardedContractor && (
                    <div className="mt-2 p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 flex items-center justify-between">
                      <div>
                        🏆 <strong>Awarded Contractor:</strong> {tender.awardedContractor}
                      </div>
                      {tender.winningBidAmount && (
                        <span className="font-mono font-bold text-blue-950">
                          {tender.winningBidAmount}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Column */}
                <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                  {tender.documentUrl && (
                    <a
                      href={tender.documentUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors"
                      title="Download Specification Dossier PDF"
                    >
                      📄 PDF Specs
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(tender)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1a4f8b] font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Edit / Award
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(tender.id, tender.bidNumber)}
                    className="p-1.5 text-gray-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    title="Delete tender notice"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Tender Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">
                  {editingItem ? 'Edit Procurement Tender Notice' : 'Publish Official Public Tender'}
                </h3>
                <p className="text-xs text-gray-500">Comply with public procurement and property administration directive.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bid Notice Number *</label>
                  <input
                    type="text"
                    required
                    value={bidNumber}
                    onChange={(e) => setBidNumber(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Procuring Directorate Entity *</label>
                  <input
                    type="text"
                    required
                    value={procuringEntity}
                    onChange={(e) => setProcuringEntity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tender Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g., Procurement of Hybrid Maize Seed & Irrigation Pumps"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tender Title (Amharic / አማርኛ)</label>
                  <input
                    type="text"
                    value={titleAm}
                    onChange={(e) => setTitleAm(e.target.value)}
                    placeholder="የጨረታው ይፋዊ ርዕስ..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tender Lifecycle Status</label>
                  <select
                    value={tenderStatus}
                    onChange={(e) => setTenderStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    <option value="ACTIVE">Active & Open for Bids</option>
                    <option value="EVALUATING">Under Evaluation</option>
                    <option value="AWARDED">Officially Awarded</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bid Bond / CPO Amount</label>
                  <input
                    type="text"
                    value={bidBondAmount}
                    onChange={(e) => setBidBondAmount(e.target.value)}
                    placeholder="e.g., 50,000 ETB (CPO)"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Document Fee</label>
                  <input
                    type="text"
                    value={documentPrice}
                    onChange={(e) => setDocumentPrice(e.target.value)}
                    placeholder="e.g., 200 ETB"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Bid Submission Deadline *</label>
                  <input
                    type="date"
                    required
                    value={closingDate}
                    onChange={(e) => setClosingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Public Bid Opening Date</label>
                  <input
                    type="date"
                    value={openingDate}
                    onChange={(e) => setOpeningDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                  />
                </div>
              </div>

              {/* Award Disclosure Section when Status is AWARDED */}
              {tenderStatus === 'AWARDED' && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider">
                    🏆 Contract Award Disclosure (Public Accountability)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1">Winning Contractor / Supplier *</label>
                      <input
                        type="text"
                        required
                        value={awardedContractor}
                        onChange={(e) => setAwardedContractor(e.target.value)}
                        placeholder="e.g., Berhan Engineering & Trade PLC"
                        className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs text-gray-800 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-900 mb-1">Final Winning Amount (ETB)</label>
                      <input
                        type="text"
                        value={winningBidAmount}
                        onChange={(e) => setWinningBidAmount(e.target.value)}
                        placeholder="e.g., 4,850,000 ETB"
                        className="w-full px-3 py-2 rounded-xl border border-blue-300 text-xs text-gray-800 bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Bid Dossier PDF Upload */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Technical Specification Dossier (PDF)
                    </h4>
                    <p className="text-[11px] text-gray-500">Official bill of quantities, terms of reference, and drawings.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={uploadingPdf}
                    className="px-3 py-1.5 bg-[#1a4f8b] text-white text-xs font-bold rounded-lg hover:bg-[#133a6b]"
                  >
                    {uploadingPdf ? 'Uploading PDF...' : '📄 Upload PDF'}
                  </button>
                  <input
                    type="file"
                    ref={pdfInputRef}
                    onChange={handlePdfUpload}
                    accept="application/pdf"
                    className="hidden"
                  />
                </div>
                <input
                  type="text"
                  value={documentUrl}
                  onChange={(e) => setDocumentUrl(e.target.value)}
                  placeholder="Or enter direct document URL (/uploads/documents/tender.pdf)..."
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                />
              </div>

              {/* Eligibility Criteria Checklist */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Mandatory Eligibility Requirements
                </h4>
                {criteria.length > 0 && (
                  <ul className="space-y-1.5">
                    {criteria.map((c, i) => (
                      <li key={i} className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 text-xs">
                        <span className="text-gray-700">✓ {c}</span>
                        <button
                          type="button"
                          onClick={() => removeCriterion(i)}
                          className="text-gray-400 hover:text-rose-600 font-bold"
                        >
                          ×
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newCriterion}
                    onChange={(e) => setNewCriterion(e.target.value)}
                    placeholder="Add eligibility requirement..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={addCriterion}
                    className="px-3 py-1.5 bg-[#1a4f8b] text-white text-xs font-bold rounded-lg"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tender Scope Description (English)</label>
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
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b] disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Tender Notice' : 'Publish Tender'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
