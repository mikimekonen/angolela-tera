'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'

export interface ServiceItem {
  id?: string
  slug: string
  title_en: string
  title_am?: string
  officeSlug?: string
  officeName_en: string
  officeName_am?: string
  category_en: string
  category_am?: string
  processingTime_en: string
  processingTime_am?: string
  cost_en: string
  cost_am?: string
  description_en: string
  description_am?: string
  requirements_en?: string[]
  requirements_am?: string[]
  steps_en?: string[]
  steps_am?: string[]
  status?: string
}

const SERVICE_CATEGORIES = [
  { en: 'Civil Registration & Vital Events', am: 'የወሳኝ ኩነት ምዝገባ' },
  { en: 'Agriculture, Inputs & Livestock', am: 'ግብርና፣ ግብዓትና እንስሳት ሀብት' },
  { en: 'Trade, Licensing & Investment', am: 'ንግድ፣ ፈቃድና ኢንቨስትመንት' },
  { en: 'Public Health & Social Safety', am: 'የህዝብ ጤናና ማህበራዊ ጥበቃ' },
  { en: 'Land Administration & Use', am: 'የመሬት አስተዳደርና አጠቃቀም' },
  { en: 'Revenue, Tax & Customs', am: 'ገቢዎች፣ ታክስና ጉምሩክ' },
  { en: 'General Public Service', am: 'አጠቃላይ የህዝብ አገልግሎት' },
]

const POPULAR_OFFICES = [
  { slug: 'vital-events', en: 'Vital Events Registration Desk', am: 'የወሳኝ ኩነት ምዝገባ ዴስክ' },
  { slug: 'agriculture', en: 'Office of Agriculture and Natural Resources', am: 'የግብርናና የተፈጥሮ ሀብት ጽ/ቤት' },
  { slug: 'trade', en: 'Trade & Industry Development Office', am: 'የንግድና ኢንዱስትሪ ልማት ጽ/ቤት' },
  { slug: 'health', en: 'Woreda Health Office & Kebele Health Posts', am: 'የወረዳው ጤና ጥበቃ ጽ/ቤትና የቀበሌ ጤና ኬላዎች' },
  { slug: 'land', en: 'Rural Land Administration and Use Office', am: 'የገጠር መሬት አስተዳደርና አጠቃቀም ጽ/ቤት' },
  { slug: 'administration', en: 'Woreda Administration Executive Cabinet', am: 'የወረዳው አስተዳደር ስራ አስፈፃሚ ካቢኔ' },
]

export default function AdminServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<ServiceItem | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingSlug, setDeletingSlug] = useState<string | null>(null)

  // Form Fields
  const [slug, setSlug] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [categoryEn, setCategoryEn] = useState('Civil Registration & Vital Events')
  const [categoryAm, setCategoryAm] = useState('የወሳኝ ኩነት ምዝገባ')
  const [officeSlug, setOfficeSlug] = useState('vital-events')
  const [officeNameEn, setOfficeNameEn] = useState('Vital Events Registration Desk')
  const [officeNameAm, setOfficeNameAm] = useState('የወሳኝ ኩነት ምዝገባ ዴስክ')
  const [processingTimeEn, setProcessingTimeEn] = useState('Same Day / Immediate')
  const [processingTimeAm, setProcessingTimeAm] = useState('በዕለቱ / ወዲያውኑ')
  const [costEn, setCostEn] = useState('Free of Charge')
  const [costAm, setCostAm] = useState('ያለ ክፍያ')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAm, setDescriptionAm] = useState('')
  const [requirementsEn, setRequirementsEn] = useState('')
  const [requirementsAm, setRequirementsAm] = useState('')
  const [stepsEn, setStepsEn] = useState('')
  const [stepsAm, setStepsAm] = useState('')

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/services')
      const json = await res.json()
      if (json.success && Array.isArray(json.data)) {
        setServices(json.data)
      } else {
        setMsg({ type: 'error', text: json.error || 'Failed to load services catalogue.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error occurred while fetching services.' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const openCreateModal = () => {
    setEditingItem(null)
    setSlug('')
    setTitleEn('')
    setTitleAm('')
    setCategoryEn('Civil Registration & Vital Events')
    setCategoryAm('የወሳኝ ኩነት ምዝገባ')
    setOfficeSlug('vital-events')
    setOfficeNameEn('Vital Events Registration Desk')
    setOfficeNameAm('የወሳኝ ኩነት ምዝገባ ዴስክ')
    setProcessingTimeEn('Same Day / Immediate')
    setProcessingTimeAm('በዕለቱ / ወዲያውኑ')
    setCostEn('Free of Charge')
    setCostAm('ያለ ክፍያ')
    setDescriptionEn('')
    setDescriptionAm('')
    setRequirementsEn('')
    setRequirementsAm('')
    setStepsEn('')
    setStepsAm('')
    setShowModal(true)
  }

  const openEditModal = (item: ServiceItem) => {
    setEditingItem(item)
    setSlug(item.slug)
    setTitleEn(item.title_en || '')
    setTitleAm(item.title_am || '')
    setCategoryEn(item.category_en || 'Civil Registration & Vital Events')
    setCategoryAm(item.category_am || 'የወሳኝ ኩነት ምዝገባ')
    setOfficeSlug(item.officeSlug || 'vital-events')
    setOfficeNameEn(item.officeName_en || '')
    setOfficeNameAm(item.officeName_am || '')
    setProcessingTimeEn(item.processingTime_en || 'Same Day / Immediate')
    setProcessingTimeAm(item.processingTime_am || 'በዕለቱ / ወዲያውኑ')
    setCostEn(item.cost_en || 'Free of Charge')
    setCostAm(item.cost_am || 'ያለ ክፍያ')
    setDescriptionEn(item.description_en || '')
    setDescriptionAm(item.description_am || '')
    setRequirementsEn(Array.isArray(item.requirements_en) ? item.requirements_en.join('\n') : '')
    setRequirementsAm(Array.isArray(item.requirements_am) ? item.requirements_am.join('\n') : '')
    setStepsEn(Array.isArray(item.steps_en) ? item.steps_en.join('\n') : '')
    setStepsAm(Array.isArray(item.steps_am) ? item.steps_am.join('\n') : '')
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
    const match = SERVICE_CATEGORIES.find((c) => c.en === enVal)
    if (match) setCategoryAm(match.am)
  }

  const handleOfficeSelect = (slugVal: string) => {
    setOfficeSlug(slugVal)
    const match = POPULAR_OFFICES.find((o) => o.slug === slugVal)
    if (match) {
      setOfficeNameEn(match.en)
      setOfficeNameAm(match.am)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleEn.trim() || !slug.trim()) {
      setMsg({ type: 'error', text: 'Service title and slug are required.' })
      return
    }

    setSubmitting(true)
    setMsg(null)

    const payload = {
      slug: slug.trim(),
      title_en: titleEn.trim(),
      title_am: titleAm.trim() || titleEn.trim(),
      category_en: categoryEn,
      category_am: categoryAm,
      officeSlug,
      officeName_en: officeNameEn.trim(),
      officeName_am: officeNameAm.trim() || officeNameEn.trim(),
      processingTime_en: processingTimeEn.trim(),
      processingTime_am: processingTimeAm.trim() || processingTimeEn.trim(),
      cost_en: costEn.trim(),
      cost_am: costAm.trim() || costEn.trim(),
      description_en: descriptionEn.trim(),
      description_am: descriptionAm.trim() || descriptionEn.trim(),
      requirements_en: requirementsEn.split('\n').map((r) => r.trim()).filter(Boolean),
      requirements_am: requirementsAm.split('\n').map((r) => r.trim()).filter(Boolean),
      steps_en: stepsEn.split('\n').map((s) => s.trim()).filter(Boolean),
      steps_am: stepsAm.split('\n').map((s) => s.trim()).filter(Boolean),
      status: 'PUBLISHED',
    }

    try {
      const res = await fetch('/api/v1/services', {
        method: editingItem ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({
          type: 'success',
          text: editingItem
            ? `Service "${titleEn}" successfully updated.`
            : `Service "${titleEn}" successfully registered.`,
        })
        setShowModal(false)
        fetchServices()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to save citizen service.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error occurred while saving.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (slugToDelete: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete service "${title}"?`)) {
      return
    }

    try {
      setDeletingSlug(slugToDelete)
      const res = await fetch(`/api/v1/services?slug=${encodeURIComponent(slugToDelete)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Service "${title}" deleted successfully.` })
        fetchServices()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete service.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error occurred during deletion.' })
    } finally {
      setDeletingSlug(null)
    }
  }

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.title_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.title_am?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.category_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.officeName_en?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.description_en?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'ALL' || s.category_en === categoryFilter

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
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
            className="text-gray-400 hover:text-gray-700 ml-4 font-bold"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">🏛️</span>
            <h1 className="text-2xl font-extrabold text-[#0d2340]">
              Citizen Services Catalog Management
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Service standards, procedural steps, required documentation, and processing timelines for Woreda residents.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>➕</span>
          <span>Register New Service Standard</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="md:col-span-2">
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Search Service Catalog</label>
          <input
            type="text"
            placeholder="Search by service name, sector, bureau, or procedural keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Service Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Categories ({services.length})</option>
            {SERVICE_CATEGORIES.map((c) => (
              <option key={c.en} value={c.en}>
                {c.en}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-gray-500">
            <span className="inline-block animate-spin mr-2">🔄</span> Loading citizen services database...
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="p-12 text-center text-xs text-gray-500">
            No citizen services found matching your criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3.5 px-4">Service Name & Scope</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Issuing Office</th>
                  <th className="py-3.5 px-4">Timeline</th>
                  <th className="py-3.5 px-4">Statutory Fee</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {filteredServices.map((srv) => (
                  <tr key={srv.slug} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-[#0d2340] line-clamp-1 text-sm">
                        {srv.title_en}
                      </div>
                      {srv.title_am && (
                        <div className="text-[11px] text-gray-500 font-ethiopic line-clamp-1 mt-0.5">
                          {srv.title_am}
                        </div>
                      )}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1a4f8b] border border-blue-100">
                        {srv.category_en}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                      🏛️ {srv.officeName_en}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-medium text-gray-800">
                      ⏱️ {srv.processingTime_en}
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap font-mono text-gray-600">
                      {srv.cost_en}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/en/services/${srv.slug}`}
                          target="_blank"
                          className="px-2.5 py-1 text-[11px] font-semibold text-[#1a4f8b] hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors"
                        >
                          View Guide ↗
                        </Link>
                        <button
                          type="button"
                          onClick={() => openEditModal(srv)}
                          className="px-2.5 py-1 text-[11px] font-semibold text-gray-700 hover:bg-gray-100 border border-gray-300 rounded-lg transition-colors cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(srv.slug, srv.title_en)}
                          disabled={deletingSlug === srv.slug}
                          className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                        >
                          {deletingSlug === srv.slug ? 'Deleting...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for Creating / Editing Service */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{editingItem ? '✏️' : '📋'}</span>
                <h3 className="text-base font-bold text-[#0d2340]">
                  {editingItem ? 'Edit Service Specification' : 'Register New Citizen Service'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Service Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Birth Certificate Registration"
                    value={titleEn}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Service Name (Amharic / አማርኛ)
                  </label>
                  <input
                    type="text"
                    placeholder="ለምሳሌ፡ የልደት ምስክር ወረቀት ምዝገባ"
                    value={titleAm}
                    onChange={(e) => setTitleAm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-ethiopic"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    URL Slug (Identifier) *
                  </label>
                  <input
                    type="text"
                    required
                    disabled={Boolean(editingItem)}
                    placeholder="e.g. birth-certificate"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ''))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono bg-gray-50 disabled:text-gray-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Service Category *
                  </label>
                  <select
                    value={categoryEn}
                    onChange={(e) => handleCategorySelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                  >
                    {SERVICE_CATEGORIES.map((c) => (
                      <option key={c.en} value={c.en}>
                        {c.en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Responsible Office Desk *
                  </label>
                  <select
                    value={officeSlug}
                    onChange={(e) => handleOfficeSelect(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs bg-white"
                  >
                    {POPULAR_OFFICES.map((o) => (
                      <option key={o.slug} value={o.slug}>
                        {o.en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Office Display Name (English)
                  </label>
                  <input
                    type="text"
                    value={officeNameEn}
                    onChange={(e) => setOfficeNameEn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Processing Timeline (English)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Same Day / Immediate"
                    value={processingTimeEn}
                    onChange={(e) => setProcessingTimeEn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Statutory Fee / Cost (English)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Free of Charge or 150 ETB"
                    value={costEn}
                    onChange={(e) => setCostEn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Service Description (English)
                </label>
                <textarea
                  rows={2}
                  placeholder="Comprehensive description of the service and citizen eligibility..."
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Service Description (Amharic)
                </label>
                <textarea
                  rows={2}
                  placeholder="የአገልግሎቱ ዝርዝር መግለጫ በአማርኛ..."
                  value={descriptionAm}
                  onChange={(e) => setDescriptionAm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-ethiopic"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Required Documents (One per line - English)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Kebele Resident ID&#10;Birth Notification Certificate&#10;Two passport photographs"
                    value={requirementsEn}
                    onChange={(e) => setRequirementsEn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Step-by-Step Procedure (One per line - English)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Step 1: Obtain hospital birth slip&#10;Step 2: Submit to Kebele desk&#10;Step 3: Collect authenticated certificate"
                    value={stepsEn}
                    onChange={(e) => setStepsEn(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? 'Saving...'
                    : editingItem
                    ? 'Save Service Specification'
                    : 'Register Service Standard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
