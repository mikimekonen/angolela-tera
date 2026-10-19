'use client'

import React, { useState, useEffect } from 'react'
import type { InvestmentOpportunityItem } from '@/types'

export default function AdminInvestmentsPage() {
  const [investments, setInvestments] = useState<InvestmentOpportunityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingItem, setEditingItem] = useState<InvestmentOpportunityItem | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [slug, setSlug] = useState('')
  const [sector, setSector] = useState('Agro-processing')
  const [landHa, setLandHa] = useState('')
  const [summaryEn, setSummaryEn] = useState('')
  const [summaryAm, setSummaryAm] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [incentivesEn, setIncentivesEn] = useState('')
  const [proceduresEn, setProceduresEn] = useState('')
  const [contactPerson, setContactPerson] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  useEffect(() => {
    fetchInvestments()
  }, [])

  const fetchInvestments = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/investments')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setInvestments(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load investment opportunities.' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setTitleEn('')
    setTitleAm('')
    setSlug('')
    setSector('Agro-processing')
    setLandHa('')
    setSummaryEn('')
    setSummaryAm('')
    setDescriptionEn('')
    setIncentivesEn('')
    setProceduresEn('')
    setContactPerson('Director of Trade & Investment Desk')
    setContactEmail('')
    setContactPhone('+251 58 661 0180')
    setIsCreating(true)
  }

  const handleOpenEdit = (item: InvestmentOpportunityItem) => {
    setEditingItem(item)
    setTitleEn(item.title_en)
    setTitleAm(item.title_am || '')
    setSlug(item.slug)
    setSector(item.sector)
    setLandHa(item.availableLandHa ? item.availableLandHa.toString() : '')
    setSummaryEn(item.summary_en || '')
    setSummaryAm(item.summary_am || '')
    setDescriptionEn(item.description_en || '')
    setIncentivesEn(item.incentives_en || '')
    setProceduresEn(item.procedures_en || '')
    setContactPerson(item.contactPerson || '')
    setContactEmail(item.contactEmail || '')
    setContactPhone(item.contactPhone || '')
    setIsCreating(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleEn.trim() || !slug.trim()) {
      setMsg({ type: 'error', text: 'Title (EN) and Slug are required.' })
      return
    }

    try {
      const payload = {
        title_en: titleEn,
        title_am: titleAm || null,
        slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
        sector,
        availableLandHa: landHa ? Number(landHa) : undefined,
        summary_en: summaryEn,
        summary_am: summaryAm,
        description_en: descriptionEn,
        incentives_en: incentivesEn,
        procedures_en: proceduresEn,
        contactPerson,
        contactEmail,
        contactPhone,
      }

      if (editingItem) {
        const res = await fetch('/api/v1/investments', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: `Investment opportunity "${titleEn}" updated.` })
          setIsCreating(false)
          fetchInvestments()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to update.' })
        }
      } else {
        const res = await fetch('/api/v1/investments', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: `Investment opportunity "${titleEn}" posted.` })
          setIsCreating(false)
          fetchInvestments()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to create.' })
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    }
  }

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to remove investment opportunity "${title}"?`)) return

    try {
      const res = await fetch(`/api/v1/investments?slug=${slug}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Opportunity "${title}" removed.` })
        fetchInvestments()
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
              Economic Development Desk
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Investment Opportunities & Corridor Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Publish priority industrial sectors, allocated land parcels, tax incentives, and streamlined licensing steps for domestic and international investors.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          + Post New Investment Opportunity
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
              {editingItem ? `Edit Investment: ${editingItem.title_en}` : 'Post New Investment Opportunity'}
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
                  Opportunity Title (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Highland Dairy Processing Plant"
                  value={titleEn}
                  onChange={(e) => {
                    setTitleEn(e.target.value)
                    if (!editingItem) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Title (Amharic - አማርኛ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. የደጋ ወተት ማቀነባበሪያ ፋብሪካ"
                  value={titleAm}
                  onChange={(e) => setTitleAm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Unique Slug *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. dairy-processing-plant"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Priority Economic Sector
                </label>
                <select
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                >
                  <option value="Agro-processing">Agro-Processing & Milling</option>
                  <option value="Agriculture">Commercial Agriculture & Seeds</option>
                  <option value="Manufacturing">Light Manufacturing & Assembly</option>
                  <option value="Renewable Energy">Renewable Energy & Solar</option>
                  <option value="Tourism">Highland Eco-Tourism & Hospitality</option>
                  <option value="Mining & Quarrying">Mining, Stone Quarry & Construction</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Available Land (Hectares)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 5.5"
                  value={landHa}
                  onChange={(e) => setLandHa(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Brief Summary (English)
                </label>
                <textarea
                  rows={2}
                  placeholder="Concise executive overview for investors..."
                  value={summaryEn}
                  onChange={(e) => setSummaryEn(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  ማጠቃለያ (አማርኛ)
                </label>
                <textarea
                  rows={2}
                  placeholder="ለባለሀብቶች የተዘጋጀ አጭር ማብራሪያ..."
                  value={summaryAm}
                  onChange={(e) => setSummaryAm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Incentives & Tax Exemptions
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 5-year income tax holiday, duty-free capital equipment import..."
                  value={incentivesEn}
                  onChange={(e) => setIncentivesEn(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Application Procedures & Timelines
                </label>
                <textarea
                  rows={2}
                  placeholder="1. Project proposal submission, 2. Land allocation approval..."
                  value={proceduresEn}
                  onChange={(e) => setProceduresEn(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Responsible Officer / Desk
                </label>
                <input
                  type="text"
                  placeholder="e.g. Head of Investment Desk"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="e.g. +251 58 661 0180"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Official Email
                </label>
                <input
                  type="email"
                  placeholder="contact@example.com"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
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
                {editingItem ? 'Save Updates' : 'Publish Opportunity'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
          Loading investment opportunities...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {investments.map((inv) => (
            <div
              key={inv.slug}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a4f8b] border border-blue-200 uppercase">
                    {inv.sector}
                  </span>
                  {inv.availableLandHa && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {inv.availableLandHa} Hectares Allocated
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-[#0d2340]">
                  {inv.title_en}
                </h3>
                {inv.title_am && (
                  <p className="text-xs text-gray-500 mb-2">{inv.title_am}</p>
                )}

                <p className="text-xs text-gray-600 line-clamp-3 mb-3">
                  {inv.summary_en || inv.description_en || 'Strategic investment opportunity in Angolela Tera.'}
                </p>

                {inv.incentives_en && (
                  <div className="bg-amber-50/60 border border-amber-200/60 rounded-lg p-2.5 text-[11px] text-amber-900 mb-3">
                    <span className="font-bold">Incentives:</span> {inv.incentives_en}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono">{inv.contactEmail || 'Investment Desk'}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleOpenEdit(inv)}
                    className="px-2.5 py-1 text-xs font-semibold text-[#1a4f8b] hover:bg-blue-50 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(inv.slug, inv.title_en)}
                    className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
