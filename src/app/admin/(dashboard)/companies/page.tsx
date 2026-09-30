'use client'

import React, { useState, useEffect } from 'react'
import type { BusinessItem, BusinessSector } from '@/types'

const SECTORS: { value: BusinessSector; label: string; icon: string }[] = [
  { value: 'AGRO_PROCESSING', label: 'Agro-Processing & Milling', icon: '🏭' },
  { value: 'AGRICULTURE', label: 'Agriculture & Inputs', icon: '🌾' },
  { value: 'CONSTRUCTION', label: 'Construction & Civil Works', icon: '🏗️' },
  { value: 'TRADE', label: 'Commercial Trade & Wholesale', icon: '🛒' },
  { value: 'HOSPITALITY', label: 'Hospitality & Tourism', icon: '🏨' },
  { value: 'MANUFACTURING', label: 'Light Manufacturing', icon: '⚙️' },
  { value: 'TRANSPORT', label: 'Logistics & Transport', icon: '🚚' },
  { value: 'OTHER', label: 'Other Enterprises', icon: '💼' },
]

export default function AdminCompaniesPage() {
  const [companies, setCompanies] = useState<BusinessItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sectorFilter, setSectorFilter] = useState('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editingCompany, setEditingCompany] = useState<BusinessItem | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [nameEn, setNameEn] = useState('')
  const [nameAm, setNameAm] = useState('')
  const [nameOm, setNameOm] = useState('')
  const [sector, setSector] = useState<BusinessSector>('AGRO_PROCESSING')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAm, setDescriptionAm] = useState('')
  const [descriptionOm, setDescriptionOm] = useState('')
  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [website, setWebsite] = useState('')
  const [employeeCount, setEmployeeCount] = useState('')
  const [established, setEstablished] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/companies')
      const json = await res.json()
      if (json.success) {
        setCompanies(json.data)
      }
    } catch {
      console.error('Failed to load companies')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const resetForm = () => {
    setEditingCompany(null)
    setNameEn('')
    setNameAm('')
    setNameOm('')
    setSector('AGRO_PROCESSING')
    setDescriptionEn('')
    setDescriptionAm('')
    setDescriptionOm('')
    setAddress('')
    setPhone('')
    setEmail('')
    setWebsite('')
    setEmployeeCount('')
    setEstablished('')
    setPhotoUrl('')
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (comp: BusinessItem) => {
    setEditingCompany(comp)
    setNameEn(comp.name_en)
    setNameAm(comp.name_am || '')
    setNameOm(comp.name_om || '')
    setSector(comp.sector)
    setDescriptionEn(comp.description_en || '')
    setDescriptionAm(comp.description_am || '')
    setDescriptionOm(comp.description_om || '')
    setAddress(comp.address || '')
    setPhone(comp.phone || '')
    setEmail(comp.email || '')
    setWebsite(comp.website || '')
    setEmployeeCount(comp.employeeCount || '')
    setEstablished(comp.established || '')
    setPhotoUrl(comp.photo?.url || '')
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
        sector,
        description_en: descriptionEn.trim() || undefined,
        description_am: descriptionAm.trim() || undefined,
        description_om: descriptionOm.trim() || undefined,
        address: address.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        employeeCount: employeeCount.trim() || undefined,
        established: established.trim() || undefined,
        photo: photoUrl.trim() || undefined,
      }

      if (editingCompany) {
        payload.id = editingCompany.id
      }

      const res = await fetch('/api/v1/companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        await fetchCompanies()
        setShowModal(false)
        resetForm()
      } else {
        alert(data.error || 'Failed to save company')
      }
    } catch {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove "${name}" from the Woreda Business Directory?`)) {
      return
    }

    try {
      const res = await fetch(`/api/v1/companies?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCompanies((prev) => prev.filter((c) => c.id !== id))
      } else {
        alert(data.error || 'Failed to delete company')
      }
    } catch {
      alert('Network error')
    }
  }

  const filteredCompanies = companies.filter((c) => {
    const matchesSector = sectorFilter === 'ALL' || c.sector === sectorFilter
    const matchesSearch =
      c.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.name_am && c.name_am.includes(searchTerm)) ||
      (c.description_en && c.description_en.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.address && c.address.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesSector && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0d2340]">
            Private Companies & Enterprises Directory
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage registered commercial investors, agro-processing plants, cooperatives, and local businesses in Angolela Tera Woreda.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Register New Company</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search companies by name, sector, address, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            aria-label="Filter by Sector"
            className="px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Economic Sectors ({companies.length})</option>
            {SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.icon} {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Companies Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl">
          Loading Woreda business enterprises...
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="p-12 text-center text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl">
          No enterprises found matching the criteria. Click &quot;Register New Company&quot; to add one.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {filteredCompanies.map((c) => {
            const secInfo = SECTORS.find((s) => s.value === c.sector) || {
              label: c.sector,
              icon: '💼',
            }
            return (
              <div
                key={c.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-[11px] font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100 flex items-center gap-1">
                      <span>{secInfo.icon}</span>
                      <span>{secInfo.label}</span>
                    </span>

                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {c.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#0d2340]">
                    {c.name_en}
                  </h3>
                  {c.name_am && (
                    <p className="text-xs font-medium text-[#c8931a] mt-0.5">
                      {c.name_am}
                    </p>
                  )}

                  <p className="text-xs text-gray-600 mt-2.5 line-clamp-3 leading-relaxed">
                    {c.description_en || 'No English description provided.'}
                  </p>

                  <div className="mt-4 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2 text-[11px] text-gray-600">
                    <div>
                      <span className="text-gray-400 font-medium">Location: </span>
                      <span className="font-semibold text-gray-700">{c.address || 'Angolela Tera'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Workforce: </span>
                      <span className="font-semibold text-gray-700">{c.employeeCount || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Contact: </span>
                      <span className="font-semibold text-gray-700">{c.phone || c.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 font-medium">Est.: </span>
                      <span className="font-semibold text-gray-700">{c.established || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(c)}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(c.id, c.name_en)}
                      className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      🗑️ Delete
                    </button>
                  </div>

                  <span className="text-[10px] text-gray-400 font-mono">
                    ID: {c.id}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-2xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#0d2340]">
                  {editingCompany ? 'Edit Private Company Profile' : 'Register New Private Company'}
                </h2>
                <p className="text-xs text-gray-500">
                  Visible to investors and citizens on the Angolela Tera Woreda portal.
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
              {/* Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Company Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Chacha Agro-Processing PLC"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    የድርጅት ስም (Amharic)
                  </label>
                  <input
                    type="text"
                    value={nameAm}
                    onChange={(e) => setNameAm(e.target.value)}
                    placeholder="ለምሳሌ: ጫቻ አግሮ-ፕሮሰሲንግ ኃ.የተ.የ.ማ"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Maqaa Dhaabbataa (Afaan Oromoo)
                  </label>
                  <input
                    type="text"
                    value={nameOm}
                    onChange={(e) => setNameOm(e.target.value)}
                    placeholder="fkn: Caccetti Agro-Processing PLC"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Sector & Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Economic Sector *
                  </label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value as BusinessSector)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    {SECTORS.map((s) => (
                      <option key={s.value} value={s.value}>
                        {s.icon} {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Workforce / Employees
                  </label>
                  <input
                    type="text"
                    value={employeeCount}
                    onChange={(e) => setEmployeeCount(e.target.value)}
                    placeholder="e.g. 120+ workers"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Established Year
                  </label>
                  <input
                    type="text"
                    value={established}
                    onChange={(e) => setEstablished(e.target.value)}
                    placeholder="e.g. 2018"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Photo and Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Physical Address / Kebele
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Chacha Industrial Area, Kebele 02"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Photo URL or Image Path
                  </label>
                  <input
                    type="text"
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    placeholder="e.g. /images/companies/chacha-mill.jpg"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Telephone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 (0) 91 123 4567"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="info@company.et"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Website (Optional)
                  </label>
                  <input
                    type="url"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Descriptions */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Short Description (English)
                </label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Outline products, capacity, market destination, and community impact..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    አጭር መግለጫ (Amharic)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionAm}
                    onChange={(e) => setDescriptionAm(e.target.value)}
                    placeholder="ስለ ድርጅቱ ምርትና አገልግሎት አጭር መግለጫ..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ibsa Gabaabaa (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={2}
                    value={descriptionOm}
                    onChange={(e) => setDescriptionOm(e.target.value)}
                    placeholder="Ibsa waa'ee dhaabbataa..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Actions */}
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
                  {submitting ? 'Saving...' : editingCompany ? 'Update Company' : 'Save Company'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
