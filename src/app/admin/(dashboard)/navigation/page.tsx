'use client'

import React, { useState, useEffect } from 'react'

interface NavItem {
  id: string
  label_en: string
  label_am?: string
  label_om?: string
  url: string
  displayOrder: number
  isActive: boolean
  isExternal: boolean
}

export default function AdminNavigationPage() {
  const [items, setItems] = useState<NavItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editingItem, setEditingItem] = useState<NavItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [labelEn, setLabelEn] = useState('')
  const [labelAm, setLabelAm] = useState('')
  const [labelOm, setLabelOm] = useState('')
  const [url, setUrl] = useState('')
  const [isExternal, setIsExternal] = useState(false)
  const [isActive, setIsActive] = useState(true)

  useEffect(() => {
    fetchNav()
  }, [])

  const fetchNav = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/navigation?all=true')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data.sort((a: NavItem, b: NavItem) => a.displayOrder - b.displayOrder))
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load navigation items.' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setLabelEn('')
    setLabelAm('')
    setLabelOm('')
    setUrl('/')
    setIsExternal(false)
    setIsActive(true)
    setIsCreating(true)
  }

  const handleOpenEdit = (item: NavItem) => {
    setEditingItem(item)
    setLabelEn(item.label_en)
    setLabelAm(item.label_am || '')
    setLabelOm(item.label_om || '')
    setUrl(item.url)
    setIsExternal(item.isExternal)
    setIsActive(item.isActive)
    setIsCreating(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!labelEn.trim() || !url.trim()) {
      setMsg({ type: 'error', text: 'Label (EN) and URL are required.' })
      return
    }

    try {
      if (editingItem) {
        // Update
        const res = await fetch('/api/v1/navigation', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            label_en: labelEn,
            label_am: labelAm || null,
            label_om: labelOm || null,
            url,
            isExternal,
            isActive,
          }),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: `Menu item "${labelEn}" updated.` })
          setIsCreating(false)
          fetchNav()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to update item.' })
        }
      } else {
        // Create
        const res = await fetch('/api/v1/navigation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            label_en: labelEn,
            label_am: labelAm || null,
            label_om: labelOm || null,
            url,
            isExternal,
            isActive,
            displayOrder: items.length + 1,
          }),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: `Menu item "${labelEn}" created.` })
          setIsCreating(false)
          fetchNav()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to create item.' })
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'Network request error.' })
    }
  }

  const handleDelete = async (id: string, label: string) => {
    if (!confirm(`Are you sure you want to remove menu link "${label}"?`)) return

    try {
      const res = await fetch(`/api/v1/navigation?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Menu item "${label}" deleted.` })
        fetchNav()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error deleting item.' })
    }
  }

  const handleToggleStatus = async (item: NavItem) => {
    try {
      const res = await fetch('/api/v1/navigation', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: item.id, isActive: !item.isActive }),
      })
      const data = await res.json()
      if (data.success) {
        setItems((prev) => prev.map((n) => (n.id === item.id ? { ...n, isActive: !item.isActive } : n)))
        setMsg({ type: 'success', text: `Status for "${item.label_en}" updated.` })
      }
    } catch {
      setMsg({ type: 'error', text: 'Error toggling status.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Dynamic Navigation
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Portal Menu & Navigation Manager
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Manage links, submenus, external routes, and bilingual labels on the primary government navbar.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          + Add New Menu Item
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

      {/* Modal / Form Card when Creating or Editing */}
      {isCreating && (
        <div className="bg-white border-2 border-[#1a4f8b] rounded-2xl p-6 shadow-md">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <h2 className="text-base font-bold text-[#0d2340]">
              {editingItem ? `Edit Menu Item: ${editingItem.label_en}` : 'Create New Menu Item'}
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
                  Label (English) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tenders"
                  value={labelEn}
                  onChange={(e) => setLabelEn(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Label (Amharic - አማርኛ)
                </label>
                <input
                  type="text"
                  placeholder="e.g. ጨረታዎች"
                  value={labelAm}
                  onChange={(e) => setLabelAm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Label (Afaan Oromo)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Caalbaasii"
                  value={labelOm}
                  onChange={(e) => setLabelOm(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  URL / Route Path *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /tenders or https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs font-mono focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
              <div className="flex items-center gap-6 pt-5">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isExternal}
                    onChange={(e) => setIsExternal(e.target.checked)}
                    className="rounded border-gray-300 text-[#1a4f8b] focus:ring-[#1a4f8b]"
                  />
                  <span>Opens External Site (New Tab)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-gray-300 text-[#1a4f8b] focus:ring-[#1a4f8b]"
                  />
                  <span>Active on Public Navbar</span>
                </label>
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
                {editingItem ? 'Save Changes' : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Menu Table */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
          Loading navigation links...
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Order</th>
                <th className="py-3 px-4">English Label</th>
                <th className="py-3 px-4">Amharic (አማርኛ)</th>
                <th className="py-3 px-4">URL / Path</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 font-mono text-gray-400">{index + 1}</td>
                  <td className="py-3.5 px-4 font-bold text-[#0d2340]">
                    {item.label_en}
                    {item.isExternal && <span className="ml-1 text-gray-400">↗</span>}
                  </td>
                  <td className="py-3.5 px-4 text-gray-700">{item.label_am || '—'}</td>
                  <td className="py-3.5 px-4 font-mono text-blue-700">{item.url}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleStatus(item)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                        item.isActive
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {item.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#1a4f8b] hover:bg-blue-50 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.label_en)}
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
