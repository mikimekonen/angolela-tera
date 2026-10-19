'use client'

import React, { useState, useEffect } from 'react'

interface TourismItem {
  id: string
  slug: string
  name_en: string
  name_am?: string
  name_om?: string
  category: string
  description_en?: string
  description_am?: string
  location_en?: string
  mapCoordinates?: string
  activities_en?: string[]
  nearbyFacilities_en?: string[]
  culturalSignificance_en?: string
  bestVisitMonths?: string
  coverImage?: string
  displayOrder: number
  status: 'PUBLISHED' | 'DRAFT' | 'ARCHIVED'
}

export default function AdminTourismPage() {
  const [items, setItems] = useState<TourismItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<TourismItem | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form fields
  const [nameEn, setNameEn] = useState('')
  const [nameAm, setNameAm] = useState('')
  const [slug, setSlug] = useState('')
  const [category, setCategory] = useState('Historical Heritage')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAm, setDescriptionAm] = useState('')
  const [locationEn, setLocationEn] = useState('')
  const [mapCoordinates, setMapCoordinates] = useState('')
  const [activitiesEn, setActivitiesEn] = useState('')
  const [nearbyFacilitiesEn, setNearbyFacilitiesEn] = useState('')
  const [culturalSignificanceEn, setCulturalSignificanceEn] = useState('')
  const [bestVisitMonths, setBestVisitMonths] = useState('')
  const [coverImage, setCoverImage] = useState('/images/tourism-placeholder.jpg')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [status, setStatus] = useState<'PUBLISHED' | 'DRAFT' | 'ARCHIVED'>('PUBLISHED')

  useEffect(() => {
    fetchTourism()
  }, [])

  const fetchTourism = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/tourism')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load tourism attractions.' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setNameEn('')
    setNameAm('')
    setSlug('')
    setCategory('Historical Heritage')
    setDescriptionEn('')
    setDescriptionAm('')
    setLocationEn('')
    setMapCoordinates('')
    setActivitiesEn('')
    setNearbyFacilitiesEn('')
    setCulturalSignificanceEn('')
    setBestVisitMonths('October–January')
    setCoverImage('/images/tourism-placeholder.jpg')
    setDisplayOrder('1')
    setStatus('PUBLISHED')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: TourismItem) => {
    setEditingItem(item)
    setNameEn(item.name_en || '')
    setNameAm(item.name_am || '')
    setSlug(item.slug || '')
    setCategory(item.category || 'Historical Heritage')
    setDescriptionEn(item.description_en || '')
    setDescriptionAm(item.description_am || '')
    setLocationEn(item.location_en || '')
    setMapCoordinates(item.mapCoordinates || '')
    setActivitiesEn(Array.isArray(item.activities_en) ? item.activities_en.join(', ') : '')
    setNearbyFacilitiesEn(Array.isArray(item.nearbyFacilities_en) ? item.nearbyFacilities_en.join(', ') : '')
    setCulturalSignificanceEn(item.culturalSignificance_en || '')
    setBestVisitMonths(item.bestVisitMonths || '')
    setCoverImage(item.coverImage || '/images/tourism-placeholder.jpg')
    setDisplayOrder(item.displayOrder ? item.displayOrder.toString() : '1')
    setStatus(item.status || 'PUBLISHED')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameEn.trim() || !slug.trim()) {
      setMsg({ type: 'error', text: 'Attraction name and slug are required.' })
      return
    }

    try {
      const payload = {
        name_en: nameEn.trim(),
        name_am: nameAm.trim() || null,
        slug: slug.trim(),
        category,
        description_en: descriptionEn.trim() || null,
        description_am: descriptionAm.trim() || null,
        location_en: locationEn.trim() || null,
        mapCoordinates: mapCoordinates.trim() || null,
        activities_en: activitiesEn.split(',').map(s => s.trim()).filter(Boolean),
        nearbyFacilities_en: nearbyFacilitiesEn.split(',').map(s => s.trim()).filter(Boolean),
        culturalSignificance_en: culturalSignificanceEn.trim() || null,
        bestVisitMonths: bestVisitMonths.trim() || null,
        coverImage: coverImage.trim() || '/images/tourism-placeholder.jpg',
        displayOrder: parseInt(displayOrder) || 1,
        status,
      }

      if (editingItem) {
        const res = await fetch('/api/v1/tourism', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingItem.id }),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: 'Tourism destination updated successfully.' })
          setIsModalOpen(false)
          fetchTourism()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to update destination.' })
        }
      } else {
        const res = await fetch('/api/v1/tourism', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: 'Tourism destination created successfully.' })
          setIsModalOpen(false)
          fetchTourism()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to create destination.' })
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'An unexpected error occurred while saving.' })
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) return
    try {
      const res = await fetch(`/api/v1/tourism?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Deleted "${name}".` })
        fetchTourism()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete destination.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' })
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏞️</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Tourism & Heritage Destinations</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Manage tourist attractions, historic sites, river gorges, waterfalls, and cultural routes of Angolela Tera Woreda.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <span>+</span> Add Destination
        </button>
      </div>

      {/* Alert Message */}
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

      {/* Attractions Table */}
      <div className="bg-[#0b1626] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <h2 className="font-semibold text-white text-sm">Official Registered Attractions ({items.length})</h2>
          <span className="text-xs text-gray-400">Public Portal Synchronized</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading tourism registry...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No destinations found. Click "+ Add Destination" to register one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Destination</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Coordinates / Location</th>
                  <th className="px-4 py-3">Best Months</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{item.displayOrder}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{item.name_en}</div>
                      {item.name_am && <div className="text-xs text-gray-400">{item.name_am}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {item.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-300 max-w-xs truncate">
                      {item.mapCoordinates || item.location_en || '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400">
                      {item.bestVisitMonths || 'All year'}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          item.status === 'PUBLISHED'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : item.status === 'DRAFT'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
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
                        onClick={() => handleDelete(item.id, item.name_en)}
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0b1626] border border-white/20 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="p-5 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
              <h3 className="text-lg font-bold text-white">
                {editingItem ? 'Edit Tourism Destination' : 'Add New Tourism Destination'}
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
                  <label className="block text-xs font-medium text-gray-300 mb-1">Destination Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => {
                      setNameEn(e.target.value)
                      if (!editingItem) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                      }
                    }}
                    placeholder="e.g. Chacha River Waterfalls"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">የመስህቡ ስም (አማርኛ)</label>
                  <input
                    type="text"
                    value={nameAm}
                    onChange={(e) => setNameAm(e.target.value)}
                    placeholder="ምሳሌ፡ የጫቻ ወንዝ ፏፏቴ"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="chacha-river-waterfalls"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[#081220] border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Historical Heritage">Historical Heritage</option>
                    <option value="Natural Landscape">Natural Landscape</option>
                    <option value="Religious Heritage">Religious Heritage</option>
                    <option value="Agro-Tourism">Agro-Tourism</option>
                    <option value="Cultural Handicrafts">Cultural Handicrafts</option>
                    <option value="Wildlife & Ecotourism">Wildlife & Ecotourism</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description (English)</label>
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Detailed description of the attraction..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">መግለጫ (አማርኛ)</label>
                <textarea
                  rows={2}
                  value={descriptionAm}
                  onChange={(e) => setDescriptionAm(e.target.value)}
                  placeholder="የመስህቡ ዝርዝር መግለጫ በአማርኛ..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Location / Directions</label>
                  <input
                    type="text"
                    value={locationEn}
                    onChange={(e) => setLocationEn(e.target.value)}
                    placeholder="14 km west of Chacha town"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">GPS Coordinates</label>
                  <input
                    type="text"
                    value={mapCoordinates}
                    onChange={(e) => setMapCoordinates(e.target.value)}
                    placeholder="9.6890° N, 39.6721° E"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Activities (comma-separated)</label>
                  <input
                    type="text"
                    value={activitiesEn}
                    onChange={(e) => setActivitiesEn(e.target.value)}
                    placeholder="Hiking, Bird Watching, Photography"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Nearby Facilities (comma-separated)</label>
                  <input
                    type="text"
                    value={nearbyFacilitiesEn}
                    onChange={(e) => setNearbyFacilitiesEn(e.target.value)}
                    placeholder="Guesthouse, Local guide, Parking"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Best Visit Months</label>
                  <input
                    type="text"
                    value={bestVisitMonths}
                    onChange={(e) => setBestVisitMonths(e.target.value)}
                    placeholder="October–January"
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
                    <option value="DRAFT">Draft</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Cover Image Path</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="/images/tourism-placeholder.jpg"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
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
                  {editingItem ? 'Save Changes' : 'Create Destination'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
