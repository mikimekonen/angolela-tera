'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface Office {
  id?: string
  slug: string
  name_en: string
  name_am?: string
  name_om?: string
  head_en?: string
  headTitle_en?: string
  head_am?: string
  headTitle_am?: string
  description_en?: string
  description_am?: string
  phone?: string
  email?: string
  location?: string
  workingHours?: string
  status?: string
  responsibilities_en?: string[]
  responsibilities_am?: string[]
  servicesProvided_en?: string[]
}

const EMPTY_OFFICE: Partial<Office> = {
  slug: '',
  name_en: '',
  name_am: '',
  head_en: '',
  headTitle_en: '',
  description_en: '',
  description_am: '',
  phone: '',
  email: '',
  location: '',
  workingHours: 'Mon–Fri: 08:30–17:30',
  status: 'PUBLISHED',
}

export default function AdminOfficesPage() {
  const [offices, setOffices] = useState<Office[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Office | null>(null)
  const [form, setForm] = useState<Partial<Office>>(EMPTY_OFFICE)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const loadOffices = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/offices')
      const data = await res.json()
      setOffices(data.data || [])
    } catch {
      setError('Failed to load offices.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadOffices() }, [loadOffices])

  const filtered = offices.filter((o) => {
    const q = searchTerm.toLowerCase()
    return !q || o.name_en?.toLowerCase().includes(q) || o.head_en?.toLowerCase().includes(q) || o.email?.toLowerCase().includes(q) || o.slug?.toLowerCase().includes(q)
  })

  const openCreate = () => {
    setEditing(null)
    setForm({ ...EMPTY_OFFICE })
    setError('')
    setShowModal(true)
  }

  const openEdit = (office: Office) => {
    setEditing(office)
    setForm({ ...office })
    setError('')
    setShowModal(true)
  }

  const handleSave = async () => {
    if (!form.slug || !form.name_en) {
      setError('Office slug and English name are required.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const method = editing ? 'PUT' : 'POST'
      const url = editing ? `/api/v1/offices?id=${editing.slug}` : '/api/v1/offices'
      const body = editing ? { ...form, id: editing.slug } : form

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')

      setSuccess(editing ? 'Office updated successfully.' : 'Office created successfully.')
      setShowModal(false)
      await loadOffices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return
    setDeleting(slug)
    try {
      const res = await fetch(`/api/v1/offices?id=${slug}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Delete failed')
      setSuccess('Office deleted.')
      await loadOffices()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed')
    } finally {
      setDeleting(null)
    }
  }

  const statusColors: Record<string, string> = {
    PUBLISHED: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    DRAFT: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    ARCHIVED: 'bg-gray-100 text-gray-500 border-gray-200',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sector Offices & Directorates</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage executive bureau offices, leadership, contacts and mandates.</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white font-semibold px-4 py-2.5 rounded-lg shadow text-sm transition-colors self-start sm:self-auto">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>
          Add Office
        </button>
      </div>

      {/* Feedback */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2"><span>⚠️</span>{error}<button onClick={() => setError('')} className="ml-auto text-red-400 hover:text-red-600">✕</button></div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2"><span>✅</span>{success}<button onClick={() => setSuccess('')} className="ml-auto">✕</button></div>}

      {/* Search + Stats */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1">
          <svg className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
          <input type="text" placeholder="Search by name, head, or email..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"/>
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg whitespace-nowrap">{offices.length} Total Offices</span>
        <button onClick={loadOffices} className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1.5 transition-colors">
          <svg className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
          Refresh
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="text-center py-16 text-gray-400 text-sm">Loading offices…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 font-medium">No offices found.</p>
          <button onClick={openCreate} className="mt-3 text-sm text-[#1a4f8b] hover:underline">+ Add the first office</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((office) => (
            <div key={office.slug} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:shadow-md hover:border-[#1a4f8b]/40 transition-all flex flex-col gap-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm font-bold text-gray-900 leading-tight">{office.name_en}</h2>
                  {office.name_am && <p className="text-xs text-gray-500 font-medium mt-0.5">{office.name_am}</p>}
                </div>
                <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded border ${statusColors[office.status || 'PUBLISHED']}`}>
                  {office.status || 'PUBLISHED'}
                </span>
              </div>

              <div className="space-y-1 text-xs text-gray-600">
                {office.head_en && <p><span className="text-gray-400">Head:</span> <strong>{office.head_en}</strong>{office.headTitle_en && <span className="text-gray-400"> — {office.headTitle_en}</span>}</p>}
                {office.phone && <p><span className="text-gray-400">Phone:</span> {office.phone}</p>}
                {office.email && <p><span className="text-gray-400">Email:</span> {office.email}</p>}
                {office.location && <p><span className="text-gray-400">Location:</span> {office.location}</p>}
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                <span className="bg-gray-100 px-1.5 py-0.5 rounded">{office.responsibilities_en?.length || 0} mandates</span>
                <span className="bg-gray-100 px-1.5 py-0.5 rounded">{office.servicesProvided_en?.length || 0} services</span>
              </div>

              <div className="flex gap-2 pt-2 border-t border-gray-100">
                <button onClick={() => openEdit(office)} className="flex-1 text-xs font-semibold text-[#1a4f8b] border border-[#1a4f8b]/30 rounded-lg py-1.5 hover:bg-blue-50 transition-colors">Edit</button>
                <a href="/en/about/leadership" target="_blank" rel="noopener noreferrer" className="flex-1 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg py-1.5 hover:bg-gray-50 text-center transition-colors">Leadership ↗</a>
                <button
                  onClick={() => handleDelete(office.slug, office.name_en)}
                  disabled={deleting === office.slug}
                  className="px-3 text-xs text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  {deleting === office.slug ? '…' : 'Del'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-[200] flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">{editing ? 'Edit Office' : 'Add New Office'}</h2>
              <p className="text-xs text-gray-500 mt-0.5">Fill in office details. Slug is auto-used as the URL identifier.</p>
            </div>

            <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-xs">{error}</div>}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">URL Slug *</label>
                  <input type="text" value={form.slug || ''} onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder="e.g. agriculture" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]" disabled={!!editing}/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                  <select value={form.status || 'PUBLISHED'} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]">
                    <option value="PUBLISHED">Published</option>
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Office Name (English) *</label>
                <input type="text" value={form.name_en || ''} onChange={(e) => setForm({ ...form, name_en: e.target.value })} placeholder="e.g. Agriculture & Rural Development Office" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Office Name (Amharic)</label>
                <input type="text" value={form.name_am || ''} onChange={(e) => setForm({ ...form, name_am: e.target.value })} placeholder="e.g. የግብርና እና ገጠር ልማት ቢሮ" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]" dir="auto"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Head of Office (EN)</label>
                  <input type="text" value={form.head_en || ''} onChange={(e) => setForm({ ...form, head_en: e.target.value })} placeholder="Ato / W/ro Full Name" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Title / Position</label>
                  <input type="text" value={form.headTitle_en || ''} onChange={(e) => setForm({ ...form, headTitle_en: e.target.value })} placeholder="e.g. Bureau Director" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"/>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Phone</label>
                  <input type="tel" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+251 58 661 xxxx" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"/>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Email</label>
                  <input type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="office@angolela-tera.gov.et" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"/>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Office Location / Building</label>
                <input type="text" value={form.location || ''} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g. Chacha Town, Block A, 2nd Floor" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Working Hours</label>
                <input type="text" value={form.workingHours || ''} onChange={(e) => setForm({ ...form, workingHours: e.target.value })} placeholder="Mon–Fri: 08:30–17:30" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description (English)</label>
                <textarea rows={3} value={form.description_en || ''} onChange={(e) => setForm({ ...form, description_en: e.target.value })} placeholder="Brief description of the office mandate and jurisdiction..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] resize-y"/>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description (Amharic)</label>
                <textarea rows={3} value={form.description_am || ''} onChange={(e) => setForm({ ...form, description_am: e.target.value })} placeholder="የቢሮው ተልዕኮ አጭር ግለጫ..." className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] resize-y" dir="auto"/>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={handleSave} disabled={saving} className="px-6 py-2 text-sm font-semibold bg-[#1a4f8b] hover:bg-[#133a6b] text-white rounded-lg transition-colors disabled:opacity-60 flex items-center gap-2">
                {saving && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>}
                {saving ? 'Saving…' : (editing ? 'Save Changes' : 'Create Office')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
