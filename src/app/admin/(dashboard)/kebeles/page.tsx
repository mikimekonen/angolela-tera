'use client'

import React, { useState, useEffect } from 'react'
import type { KebeleItem } from '@/types'

export default function AdminKebelesPage() {
  const [kebeles, setKebeles] = useState<KebeleItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingItem, setEditingItem] = useState<KebeleItem | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [nameEn, setNameEn] = useState('')
  const [nameAm, setNameAm] = useState('')
  const [nameOm, setNameOm] = useState('')
  const [slug, setSlug] = useState('')
  const [type, setType] = useState<'RURAL_KEBELE' | 'URBAN_TOWN'>('RURAL_KEBELE')
  const [population, setPopulation] = useState('')
  const [distanceKm, setDistanceKm] = useState('')
  const [agroEcology, setAgroEcology] = useState('Dega (Highland)')
  const [economicEn, setEconomicEn] = useState('')
  const [economicAm, setEconomicAm] = useState('')
  const [adminName, setAdminName] = useState('')
  const [contactPhone, setContactPhone] = useState('')

  useEffect(() => {
    fetchKebeles()
  }, [])

  const fetchKebeles = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/kebeles')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setKebeles(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load kebele profiles.' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setNameEn('')
    setNameAm('')
    setNameOm('')
    setSlug('')
    setType('RURAL_KEBELE')
    setPopulation('')
    setDistanceKm('')
    setAgroEcology('Dega (Highland)')
    setEconomicEn('')
    setEconomicAm('')
    setAdminName('')
    setContactPhone('')
    setIsCreating(true)
  }

  const handleOpenEdit = (item: KebeleItem) => {
    setEditingItem(item)
    setNameEn(item.name_en)
    setNameAm(item.name_am || '')
    setNameOm(item.name_om || '')
    setSlug(item.slug)
    setType(item.type)
    setPopulation(item.population ? item.population.toString() : '')
    setDistanceKm(item.distanceFromCapitalKm ? item.distanceFromCapitalKm.toString() : '')
    setAgroEcology(item.mainAgroEcology || 'Dega (Highland)')
    setEconomicEn(item.economicActivities_en || '')
    setEconomicAm(item.economicActivities_am || '')
    setAdminName(item.administratorName || '')
    setContactPhone(item.contactPhone || '')
    setIsCreating(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameEn.trim() || !slug.trim()) {
      setMsg({ type: 'error', text: 'Name (EN) and Slug are required.' })
      return
    }

    try {
      const payload = {
        name_en: nameEn,
        name_am: nameAm || null,
        name_om: nameOm || null,
        slug: slug.toLowerCase().trim().replace(/\s+/g, '-'),
        type,
        population: population ? Number(population) : undefined,
        distanceFromCapitalKm: distanceKm ? Number(distanceKm) : undefined,
        mainAgroEcology: agroEcology,
        economicActivities_en: economicEn,
        economicActivities_am: economicAm,
        administratorName: adminName,
        contactPhone,
      }

      if (editingItem) {
        const res = await fetch('/api/v1/kebeles', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: `Kebele "${nameEn}" updated.` })
          setIsCreating(false)
          fetchKebeles()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to update.' })
        }
      } else {
        const res = await fetch('/api/v1/kebeles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: `Kebele "${nameEn}" created.` })
          setIsCreating(false)
          fetchKebeles()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to create.' })
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    }
  }

  const handleDelete = async (slug: string, name: string) => {
    if (!confirm(`Are you sure you want to delete kebele "${name}"?`)) return

    try {
      const res = await fetch(`/api/v1/kebeles?slug=${slug}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Kebele "${name}" removed.` })
        fetchKebeles()
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
              Jurisdictional Demographics
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Kebeles & Municipal Towns Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage all 19 rural kebeles, municipal town centers, population stats, agro-ecology, and local leadership.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          + Add New Kebele / Town
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
              {editingItem ? `Edit Kebele: ${editingItem.name_en}` : 'Register New Kebele / Town Profile'}
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
                  Name (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kotu Kebele"
                  value={nameEn}
                  onChange={(e) => {
                    setNameEn(e.target.value)
                    if (!editingItem) {
                      setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))
                    }
                  }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Name (Amharic - አማርኛ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ኮቱ ቀበሌ"
                  value={nameAm}
                  onChange={(e) => setNameAm(e.target.value)}
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
                  placeholder="e.g. kotu-kebele"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kebele Jurisdiction Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                >
                  <option value="RURAL_KEBELE">Rural Kebele (የገጠር ቀበሌ)</option>
                  <option value="URBAN_TOWN">Urban Town Center (የከተማ ማዕከል)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Population (Verified Census)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 8450"
                  value={population}
                  onChange={(e) => setPopulation(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Distance from Chacha (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="e.g. 12.5"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Main Agro-Ecology
                </label>
                <select
                  value={agroEcology}
                  onChange={(e) => setAgroEcology(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                >
                  <option value="Dega (Highland)">Dega (Highland - ደጋ)</option>
                  <option value="Weyna Dega">Weyna Dega (Midland - ወይና ደጋ)</option>
                  <option value="Kolla">Kolla (Lowland - ቆላ)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kebele Administrator Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ato Melaku Kebede"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Kebele Desk Phone Contact
                </label>
                <input
                  type="text"
                  placeholder="e.g. +251 58 661 0222"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Main Economic & Farming Activities (English)
                </label>
                <textarea
                  rows={2}
                  placeholder="Cereal production, livestock, cooperative seed farming..."
                  value={economicEn}
                  onChange={(e) => setEconomicEn(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  የኢኮኖሚና የግብርና እንቅስቃሴዎች (አማርኛ)
                </label>
                <textarea
                  rows={2}
                  placeholder="የሰብል ልማት፣ የከብት እርባታ፣ የመስኖ ስራዎች..."
                  value={economicAm}
                  onChange={(e) => setEconomicAm(e.target.value)}
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
                {editingItem ? 'Save Updates' : 'Register Kebele'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Kebeles Cards Grid */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
          Loading woreda kebeles and towns...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {kebeles.map((k) => (
            <div
              key={k.slug}
              className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      k.type === 'URBAN_TOWN'
                        ? 'bg-blue-50 text-[#1a4f8b] border-blue-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    {k.type === 'URBAN_TOWN' ? 'Urban Town' : 'Rural Kebele'}
                  </span>
                  <span className="text-[11px] font-mono text-gray-400">
                    {k.distanceFromCapitalKm !== undefined ? `${k.distanceFromCapitalKm} km from Chacha` : 'Central'}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0d2340]">
                  {k.name_en}
                </h3>
                {k.name_am && (
                  <p className="text-xs text-gray-500">{k.name_am}</p>
                )}

                <div className="my-3 py-2 border-y border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Population:</span>
                  <span className="font-bold text-[#0d2340]">
                    {k.population ? `${k.population.toLocaleString()} citizens` : '—'}
                  </span>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2">
                  {k.economicActivities_en || 'Highland agriculture and rural development.'}
                </p>

                {k.administratorName && (
                  <div className="mt-2 text-[11px] text-gray-500">
                    👤 Admin: <span className="font-semibold text-gray-700">{k.administratorName}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(k)}
                  className="px-2.5 py-1 text-xs font-semibold text-[#1a4f8b] hover:bg-blue-50 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(k.slug, k.name_en)}
                  className="px-2.5 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
