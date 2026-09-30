'use client'

import React, { useState, useEffect } from 'react'
import type { PartnerItem, PartnerType } from '@/types'

const PARTNER_TYPES: { value: PartnerType; label: string; icon: string }[] = [
  { value: 'DEVELOPMENT_PARTNER', label: 'Development Partner / Bilateral', icon: '🌍' },
  { value: 'ACADEMIC', label: 'Academic & Research Institution', icon: '🎓' },
  { value: 'INTERNATIONAL_ORG', label: 'International Organization', icon: '🌐' },
  { value: 'GOVERNMENT_AGENCY', label: 'Government & Zonal Agency', icon: '🏛️' },
  { value: 'NGO', label: 'Non-Governmental Org (NGO)', icon: '🤝' },
  { value: 'PRIVATE_SECTOR', label: 'Private Sector Strategic Partner', icon: '💼' },
  { value: 'OTHER', label: 'Other Institution', icon: '📌' },
]

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<PartnerItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editingPartner, setEditingPartner] = useState<PartnerItem | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [nameEn, setNameEn] = useState('')
  const [nameAm, setNameAm] = useState('')
  const [nameOm, setNameOm] = useState('')
  const [partnerType, setPartnerType] = useState<PartnerType>('DEVELOPMENT_PARTNER')
  const [country, setCountry] = useState('Ethiopia')
  const [website, setWebsite] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [partnerSince, setPartnerSince] = useState('')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAm, setDescriptionAm] = useState('')
  const [descriptionOm, setDescriptionOm] = useState('')
  const [logoUrl, setLogoUrl] = useState('')

  const fetchPartners = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/partners')
      const json = await res.json()
      if (json.success) {
        setPartners(json.data)
      }
    } catch {
      console.error('Failed to load partners')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPartners()
  }, [])

  const resetForm = () => {
    setEditingPartner(null)
    setNameEn('')
    setNameAm('')
    setNameOm('')
    setPartnerType('DEVELOPMENT_PARTNER')
    setCountry('Ethiopia')
    setWebsite('')
    setPhone('')
    setEmail('')
    setPartnerSince('')
    setDescriptionEn('')
    setDescriptionAm('')
    setDescriptionOm('')
    setLogoUrl('')
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (p: PartnerItem) => {
    setEditingPartner(p)
    setNameEn(p.name_en)
    setNameAm(p.name_am || '')
    setNameOm(p.name_om || '')
    setPartnerType(p.partnerType)
    setCountry(p.country || 'Ethiopia')
    setWebsite(p.website || '')
    setPhone(p.phone || '')
    setEmail(p.email || '')
    setPartnerSince(p.partnerSince || '')
    setDescriptionEn(p.description_en || '')
    setDescriptionAm(p.description_am || '')
    setDescriptionOm(p.description_om || '')
    setLogoUrl(p.logo?.url || '')
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameEn.trim()) return

    setSubmitting(true)
    try {
      const payload: any = {
        name_en: nameEn.trim(),
        name_am: nameAm.trim() || undefined,
        name_om: nameOm.trim() || undefined,
        partnerType,
        country: country.trim() || undefined,
        website: website.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        partnerSince: partnerSince.trim() || undefined,
        description_en: descriptionEn.trim() || undefined,
        description_am: descriptionAm.trim() || undefined,
        description_om: descriptionOm.trim() || undefined,
      }

      if (editingPartner) {
        payload.id = editingPartner.id
      }

      const res = await fetch('/api/v1/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        await fetchPartners()
        setShowModal(false)
        resetForm()
      } else {
        alert(data.error || 'Failed to save partner')
      }
    } catch {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove partner "${name}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/v1/partners?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setPartners((prev) => prev.filter((p) => p.id !== id))
      } else {
        alert(data.error || 'Failed to delete partner')
      }
    } catch {
      alert('Network error')
    }
  }

  const filteredPartners = partners.filter((p) => {
    const matchesType = typeFilter === 'ALL' || p.partnerType === typeFilter
    const matchesSearch =
      p.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.name_am && p.name_am.includes(searchTerm)) ||
      (p.country && p.country.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.description_en && p.description_en.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesType && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0d2340]">
            Partnership Organizations & Development Agencies
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Maintain active partnerships with regional universities, international development institutions, NGOs, and federal stakeholders.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Add Strategic Partner</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search partners by organization name, country, or scope..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Filter by Partner Classification"
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Partner Classifications ({partners.length})</option>
            {PARTNER_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.icon} {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Partners Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl">
          Loading strategic partners...
        </div>
      ) : filteredPartners.length === 0 ? (
        <div className="p-12 text-center text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl">
          No partnership organizations found. Click &quot;Add Strategic Partner&quot; to register an agency.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredPartners.map((p) => {
            const typeInfo = PARTNER_TYPES.find((t) => t.value === p.partnerType) || {
              label: p.partnerType,
              icon: '🤝',
            }
            return (
              <div
                key={p.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                      <span>{typeInfo.icon}</span>
                      <span>{typeInfo.label}</span>
                    </span>

                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {p.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#0d2340]">
                    {p.name_en}
                  </h3>
                  {p.name_am && (
                    <p className="text-xs font-medium text-[#c8931a] mt-0.5">
                      {p.name_am}
                    </p>
                  )}

                  <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {p.description_en || 'No English description provided.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                    <div>
                      <span className="text-gray-400 font-medium">Headquarters: </span>
                      <span className="font-semibold text-gray-700">{p.country || 'Ethiopia'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Partner Since: </span>
                      <span className="font-semibold text-gray-700">{p.partnerSince || 'N/A'}</span>
                    </div>
                    {p.website && (
                      <div className="col-span-2">
                        <span className="text-gray-400 font-medium">Website: </span>
                        <a
                          href={p.website}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold text-[#1a4f8b] hover:underline"
                        >
                          {p.website.replace(/^https?:\/\//, '')} ↗
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(p)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.name_en)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono">
                    ID: {p.id}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-2xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#0d2340]">
                  {editingPartner ? 'Edit Partnership Organization' : 'Register Strategic Partner'}
                </h2>
                <p className="text-xs text-gray-500">
                  Visible to citizens and visitors on the Angolela Tera Woreda portal.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Partner Organization Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. USAID — Feed the Future Ethiopia"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    የአጋር ድርጅት ስም (Amharic)
                  </label>
                  <input
                    type="text"
                    value={nameAm}
                    onChange={(e) => setNameAm(e.target.value)}
                    placeholder="ለምሳሌ: ደብረ ብርሃን ዩኒቨርሲቲ — የምርምር አጋርነት"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Maqaa Dhaabbata Hiriyyummaa (Afaan Oromoo)
                  </label>
                  <input
                    type="text"
                    value={nameOm}
                    onChange={(e) => setNameOm(e.target.value)}
                    placeholder="fkn: Yuniversiitii Dabra Birhan"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Classification *
                  </label>
                  <select
                    value={partnerType}
                    onChange={(e) => setPartnerType(e.target.value as PartnerType)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    {PARTNER_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Country / Base
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Ethiopia / USA"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Partner Since Year
                  </label>
                  <input
                    type="text"
                    value={partnerSince}
                    onChange={(e) => setPartnerSince(e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Official Website
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://www.usaid.gov"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Logo / Emblem URL
                  </label>
                  <input
                    type="text"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    placeholder="/images/partners/usaid.svg"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Partnership Scope & Cooperation Details (English)
                </label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Detail programs, technical assistance, agricultural inputs, or capacity building support..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    የትብብር ዘርፍና ዝርዝር (Amharic)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionAm}
                    onChange={(e) => setDescriptionAm(e.target.value)}
                    placeholder="ከትብብሩ የሚገኙ ጥቅሞችና የጋራ ስራዎች..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Balbalina Qindoominaa (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionOm}
                    onChange={(e) => setDescriptionOm(e.target.value)}
                    placeholder="Ibsa qindoominaa..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingPartner ? 'Update Partner' : 'Save Partner'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
