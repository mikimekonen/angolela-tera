'use client'

import React, { useState, useEffect } from 'react'

interface SliderItem {
  id: string
  title_en: string
  title_am?: string
  subtitle_en?: string
  subtitle_am?: string
  imageUrl: string
  buttonText_en?: string
  buttonText_am?: string
  buttonUrl?: string
  displayOrder: number
  isActive: boolean
}

export default function AdminSlidersPage() {
  const [items, setItems] = useState<SliderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<SliderItem | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form fields
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [subtitleEn, setSubtitleEn] = useState('')
  const [subtitleAm, setSubtitleAm] = useState('')
  const [imageUrl, setImageUrl] = useState('/images/hero-slider-1.jpg')
  const [buttonTextEn, setButtonTextEn] = useState('Explore Services')
  const [buttonTextAm, setButtonTextAm] = useState('አገልግሎቶችን ይመልከቱ')
  const [buttonUrl, setButtonUrl] = useState('/services')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    fetchSliders()
  }, [])

  const fetchSliders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/sliders')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load homepage sliders.' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setTitleEn('')
    setTitleAm('')
    setSubtitleEn('')
    setSubtitleAm('')
    setImageUrl('/images/hero-slider-1.jpg')
    setButtonTextEn('Explore Services')
    setButtonTextAm('አገልግሎቶችን ይመልከቱ')
    setButtonUrl('/services')
    setDisplayOrder('1')
    setIsActive(true)
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: SliderItem) => {
    setEditingItem(item)
    setTitleEn(item.title_en || '')
    setTitleAm(item.title_am || '')
    setSubtitleEn(item.subtitle_en || '')
    setSubtitleAm(item.subtitle_am || '')
    setImageUrl(item.imageUrl || '')
    setButtonTextEn(item.buttonText_en || '')
    setButtonTextAm(item.buttonText_am || '')
    setButtonUrl(item.buttonUrl || '')
    setDisplayOrder(item.displayOrder ? item.displayOrder.toString() : '1')
    setIsActive(item.isActive)
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleEn.trim()) {
      setMsg({ type: 'error', text: 'Slider title (English) is required.' })
      return
    }

    try {
      const payload = {
        title_en: titleEn.trim(),
        title_am: titleAm.trim() || null,
        subtitle_en: subtitleEn.trim() || null,
        subtitle_am: subtitleAm.trim() || null,
        imageUrl: imageUrl.trim() || '/images/hero-slider-1.jpg',
        buttonText_en: buttonTextEn.trim() || null,
        buttonText_am: buttonTextAm.trim() || null,
        buttonUrl: buttonUrl.trim() || '/services',
        displayOrder: parseInt(displayOrder) || 1,
        isActive,
      }

      if (editingItem) {
        const res = await fetch('/api/v1/sliders', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingItem.id }),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: 'Hero slider updated successfully.' })
          setIsModalOpen(false)
          fetchSliders()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to update slider.' })
        }
      } else {
        const res = await fetch('/api/v1/sliders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: 'Hero slider created successfully.' })
          setIsModalOpen(false)
          fetchSliders()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to create slider.' })
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'An unexpected error occurred while saving.' })
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete slider "${title}"?`)) return
    try {
      const res = await fetch(`/api/v1/sliders?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Deleted slider "${title}".` })
        fetchSliders()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete slider.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete slider.' })
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🖼️</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Homepage Hero / Main Sliders</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Manage full-width homepage campaign banners, government leadership announcements, and priority initiatives.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <span>+</span> Add Slider Slide
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
          <h2 className="font-semibold text-white text-sm">Active Homepage Hero Slides ({items.length})</h2>
          <span className="text-xs text-gray-400">Synchronized with Public Portal</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading sliders...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No sliders found. Click "+ Add Slider Slide" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Slide Title & Subtitle</th>
                  <th className="px-4 py-3">Button Call-to-Action</th>
                  <th className="px-4 py-3">Image Path</th>
                  <th className="px-4 py-3">Active Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 text-gray-400 font-mono text-xs">{item.displayOrder}</td>
                    <td className="px-4 py-3 max-w-md">
                      <div className="font-semibold text-white">{item.title_en}</div>
                      {item.title_am && <div className="text-xs text-gray-400 mt-0.5">{item.title_am}</div>}
                    </td>
                    <td className="px-4 py-3 text-xs text-blue-300">
                      {item.buttonText_en ? `${item.buttonText_en} → ${item.buttonUrl}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 font-mono truncate max-w-xs">
                      {item.imageUrl}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                          item.isActive
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                        }`}
                      >
                        {item.isActive ? 'Active' : 'Disabled'}
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
                {editingItem ? 'Edit Hero Slider Slide' : 'Add Hero Slider Slide'}
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
                  <label className="block text-xs font-medium text-gray-300 mb-1">Headline (English) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="Welcome to Angolela Tera Woreda..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">ዋና ርዕስ (አማርኛ)</label>
                  <input
                    type="text"
                    value={titleAm}
                    onChange={(e) => setTitleAm(e.target.value)}
                    placeholder="እንኳን ወደ አንጎሌላ ተራ ወረዳ በደህና መጡ..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Subtitle / Supporting Description (English)</label>
                <textarea
                  rows={2}
                  value={subtitleEn}
                  onChange={(e) => setSubtitleEn(e.target.value)}
                  placeholder="North Shewa Zone, Amhara Region • Driving Agricultural Modernization..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">ንዑስ ርዕስ (አማርኛ)</label>
                <textarea
                  rows={2}
                  value={subtitleAm}
                  onChange={(e) => setSubtitleAm(e.target.value)}
                  placeholder="ሰሜን ሸዋ ዞን፣ አማራ ክልል • የግብርና ዘመናዊነትን..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Button Text (English)</label>
                  <input
                    type="text"
                    value={buttonTextEn}
                    onChange={(e) => setButtonTextEn(e.target.value)}
                    placeholder="Explore Services"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">የአዝራሩ ጽሑፍ (አማርኛ)</label>
                  <input
                    type="text"
                    value={buttonTextAm}
                    onChange={(e) => setButtonTextAm(e.target.value)}
                    placeholder="አገልግሎቶችን ይመልከቱ"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Button Link URL</label>
                  <input
                    type="text"
                    value={buttonUrl}
                    onChange={(e) => setButtonUrl(e.target.value)}
                    placeholder="/services or /investment"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Background Image Path</label>
                  <input
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/hero-slider-1.jpg"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="sliderActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="sliderActive" className="text-xs text-white font-medium cursor-pointer">
                    Enable & Display on Homepage
                  </label>
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
                  {editingItem ? 'Save Changes' : 'Create Slide'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
