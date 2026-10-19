'use client'

import React, { useState, useEffect } from 'react'
import type { TenderItem } from '@/types'

export default function AdminTendersPage() {
  const [tenders, setTenders] = useState<TenderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingItem, setEditingItem] = useState<TenderItem | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [bidNumber, setBidNumber] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [procuringEntity, setProcuringEntity] = useState('Office of Agriculture and Natural Resources')
  const [bidBondAmount, setBidBondAmount] = useState('50,000 ETB (CPO)')
  const [documentPrice, setDocumentPrice] = useState('200 ETB Non-refundable')
  const [closingDate, setClosingDate] = useState('')
  const [tenderStatus, setTenderStatus] = useState<'ACTIVE' | 'EVALUATING' | 'AWARDED' | 'CANCELLED'>('ACTIVE')
  const [descriptionEn, setDescriptionEn] = useState('')

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
      setMsg({ type: 'error', text: 'Failed to load procurement bids.' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    const currentYear = 2018 // Ethiopian calendar year or 2026
    const randomId = Math.floor(10 + Math.random() * 90)
    setBidNumber(`ATW/OF/${randomId}/2018`)
    setTitleEn('')
    setTitleAm('')
    setProcuringEntity('Woreda Office of Agriculture and Natural Resources')
    setBidBondAmount('50,000 ETB (CPO)')
    setDocumentPrice('200 ETB Non-refundable')
    setClosingDate(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0])
    setTenderStatus('ACTIVE')
    setDescriptionEn('')
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
    setTenderStatus(item.tenderStatus)
    setDescriptionEn(item.description_en || '')
    setIsCreating(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bidNumber.trim() || !titleEn.trim() || !closingDate) {
      setMsg({ type: 'error', text: 'Bid Number, Title (EN), and Closing Date are required.' })
      return
    }

    try {
      const payload = {
        bidNumber,
        title_en: titleEn,
        title_am: titleAm || null,
        procuringEntity,
        bidBondAmount,
        documentPrice,
        closingDate: new Date(closingDate).toISOString(),
        tenderStatus,
        description_en: descriptionEn,
      }

      if (editingItem) {
        const res = await fetch('/api/v1/tenders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingItem.id, ...payload }),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: `Tender "${bidNumber}" updated.` })
          setIsCreating(false)
          fetchTenders()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to update tender.' })
        }
      } else {
        const res = await fetch('/api/v1/tenders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: `Tender "${bidNumber}" published.` })
          setIsCreating(false)
          fetchTenders()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to create tender.' })
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    }
  }

  const handleDelete = async (id: string, bid: string) => {
    if (!confirm(`Are you sure you want to delete tender bid "${bid}"?`)) return

    try {
      const res = await fetch(`/api/v1/tenders?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Tender "${bid}" removed.` })
        fetchTenders()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network request error.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Procurement Transparency
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Government Tenders & Bidding Announcements
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage public procurement bids, CPO bond security, submission deadlines, and bid documents for contractors and suppliers.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          + Publish New Tender Notice
        </button>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-sm font-bold opacity-70 hover:opacity-100">
            ×
          </button>
        </div>
      )}

      {/* Creation / Edit Form Card */}
      {isCreating && (
        <div className="bg-white border-2 border-[#1a4f8b] rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
            <h2 className="text-base font-bold text-[#0d2340]">
              {editingItem ? `Edit Tender: ${editingItem.bidNumber}` : 'Publish New Tender Announcement'}
            </h2>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-gray-700 text-sm font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Official Bid Reference Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ATW/OF/01/2018"
                  value={bidNumber}
                  onChange={(e) => setBidNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Procuring Woreda Bureau / Directorate *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Woreda Office of Health"
                  value={procuringEntity}
                  onChange={(e) => setProcuringEntity(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tender Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Construction of Grade-1 Health Post in Cheki Kebele"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  የጨረታ ርዕስ (አማርኛ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. በጨቂ ቀበሌ ደረጃ-1 የጤና ኬላ ግንባታ ግልጽ ጨረታ"
                  value={titleAm}
                  onChange={(e) => setTitleAm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Bid Bond Security (CPO)
                </label>
                <input
                  type="text"
                  placeholder="e.g. 50,000 ETB (CPO)"
                  value={bidBondAmount}
                  onChange={(e) => setBidBondAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Document Purchase Price
                </label>
                <input
                  type="text"
                  placeholder="e.g. 200 ETB Non-refundable"
                  value={documentPrice}
                  onChange={(e) => setDocumentPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Submission Closing Date *
                </label>
                <input
                  type="date"
                  required
                  value={closingDate}
                  onChange={(e) => setClosingDate(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Tender Lifecycle Status
                </label>
                <select
                  value={tenderStatus}
                  onChange={(e) => setTenderStatus(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                >
                  <option value="ACTIVE">ACTIVE (Open for Submission)</option>
                  <option value="EVALUATING">EVALUATING (Bids Closed, Under Review)</option>
                  <option value="AWARDED">AWARDED (Contract Awarded)</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Tender Scope & Eligibility Requirements (English)
              </label>
              <textarea
                rows={3}
                placeholder="Contractor license Grade-4 or above, VAT registration, renewed trade license for current fiscal year..."
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                {editingItem ? 'Save Updates' : 'Publish Tender'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tender Items Table */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
          Loading tender records...
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Bid Ref No.</th>
                <th className="py-3 px-4">Tender Title</th>
                <th className="py-3 px-4">Procuring Bureau</th>
                <th className="py-3 px-4">Closing Deadline</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tenders.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#1a4f8b]">
                    {t.bidNumber}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#0d2340]">{t.title_en}</div>
                    {t.title_am && <div className="text-gray-500">{t.title_am}</div>}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    {t.procuringEntity}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-700">
                    {new Date(t.closingDate).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        t.tenderStatus === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : t.tenderStatus === 'EVALUATING'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }`}
                    >
                      {t.tenderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(t)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#1a4f8b] hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, t.bidNumber)}
                      className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded"
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
  )
}
