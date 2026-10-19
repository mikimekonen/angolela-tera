'use client'

import React, { useState, useEffect } from 'react'

interface DevelopmentProject {
  id: string
  slug: string
  title_en: string
  title_am?: string
  title_om?: string
  sector: string
  description_en?: string
  description_am?: string
  location_en?: string
  budget_etb: number
  fundingSource?: string
  contractor?: string
  startDate?: string
  expectedCompletion?: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PLANNED' | 'DELAYED'
  progressPercent: number
  displayOrder: number
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<DevelopmentProject[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DevelopmentProject | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form fields
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [slug, setSlug] = useState('')
  const [sector, setSector] = useState('Infrastructure')
  const [descriptionEn, setDescriptionEn] = useState('')
  const [descriptionAm, setDescriptionAm] = useState('')
  const [locationEn, setLocationEn] = useState('')
  const [budgetEtb, setBudgetEtb] = useState('10000000')
  const [fundingSource, setFundingSource] = useState('Amhara Regional Road Authority')
  const [contractor, setContractor] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [expectedCompletion, setExpectedCompletion] = useState('')
  const [status, setStatus] = useState<'IN_PROGRESS' | 'COMPLETED' | 'PLANNED' | 'DELAYED'>('IN_PROGRESS')
  const [progressPercent, setProgressPercent] = useState('50')
  const [displayOrder, setDisplayOrder] = useState('1')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/projects')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setItems(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load development projects.' })
    } finally {
      setLoading(false)
    }
  }

  const handleOpenCreate = () => {
    setEditingItem(null)
    setTitleEn('')
    setTitleAm('')
    setSlug('')
    setSector('Infrastructure')
    setDescriptionEn('')
    setDescriptionAm('')
    setLocationEn('')
    setBudgetEtb('10000000')
    setFundingSource('Amhara Regional Government + Woreda Budget')
    setContractor('')
    setStartDate(new Date().toISOString().split('T')[0])
    setExpectedCompletion('')
    setStatus('IN_PROGRESS')
    setProgressPercent('25')
    setDisplayOrder('1')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (item: DevelopmentProject) => {
    setEditingItem(item)
    setTitleEn(item.title_en || '')
    setTitleAm(item.title_am || '')
    setSlug(item.slug || '')
    setSector(item.sector || 'Infrastructure')
    setDescriptionEn(item.description_en || '')
    setDescriptionAm(item.description_am || '')
    setLocationEn(item.location_en || '')
    setBudgetEtb(item.budget_etb ? item.budget_etb.toString() : '0')
    setFundingSource(item.fundingSource || '')
    setContractor(item.contractor || '')
    setStartDate(item.startDate || '')
    setExpectedCompletion(item.expectedCompletion || '')
    setStatus(item.status || 'IN_PROGRESS')
    setProgressPercent(item.progressPercent !== undefined ? item.progressPercent.toString() : '0')
    setDisplayOrder(item.displayOrder ? item.displayOrder.toString() : '1')
    setIsModalOpen(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!titleEn.trim() || !slug.trim()) {
      setMsg({ type: 'error', text: 'Project title and slug are required.' })
      return
    }

    try {
      const payload = {
        title_en: titleEn.trim(),
        title_am: titleAm.trim() || null,
        slug: slug.trim(),
        sector,
        description_en: descriptionEn.trim() || null,
        description_am: descriptionAm.trim() || null,
        location_en: locationEn.trim() || null,
        budget_etb: parseFloat(budgetEtb) || 0,
        fundingSource: fundingSource.trim() || null,
        contractor: contractor.trim() || null,
        startDate: startDate.trim() || null,
        expectedCompletion: expectedCompletion.trim() || null,
        status,
        progressPercent: parseInt(progressPercent) || 0,
        displayOrder: parseInt(displayOrder) || 1,
      }

      if (editingItem) {
        const res = await fetch('/api/v1/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, id: editingItem.id }),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: 'Development project updated successfully.' })
          setIsModalOpen(false)
          fetchProjects()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to update project.' })
        }
      } else {
        const res = await fetch('/api/v1/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })
        const data = await res.json()
        if (data.success) {
          setMsg({ type: 'success', text: 'Development project created successfully.' })
          setIsModalOpen(false)
          fetchProjects()
        } else {
          setMsg({ type: 'error', text: data.error || 'Failed to create project.' })
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'An unexpected error occurred while saving.' })
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) return
    try {
      const res = await fetch(`/api/v1/projects?id=${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Deleted "${title}".` })
        fetchProjects()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete project.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to delete.' })
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏗️</span>
            <h1 className="text-2xl font-bold text-white tracking-tight">Development & Capital Projects</h1>
          </div>
          <p className="text-sm text-gray-400 mt-1">
            Track public infrastructure projects, roads, clean water schemes, schools, and budgets in Angolela Tera Woreda.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg transition-colors shadow-lg shadow-emerald-950/40 cursor-pointer"
        >
          <span>+</span> Add Project
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
          <h2 className="font-semibold text-white text-sm">Capital Investment Registry ({items.length})</h2>
          <span className="text-xs text-gray-400">Public Portal Synchronized</span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading projects registry...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No projects found. Click "+ Add Project" to create one.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="bg-white/5 text-xs uppercase tracking-wider text-gray-400 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3">Project Title</th>
                  <th className="px-4 py-3">Sector</th>
                  <th className="px-4 py-3">Budget (ETB)</th>
                  <th className="px-4 py-3">Completion Status</th>
                  <th className="px-4 py-3">Funding / Contractor</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{item.title_en}</div>
                      {item.title_am && <div className="text-xs text-gray-400">{item.title_am}</div>}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {item.sector}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-amber-300 font-mono">
                      {item.budget_etb ? `${(item.budget_etb / 1000000).toFixed(1)}M ETB` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-36 space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-400">{item.status}</span>
                          <span className="text-white font-semibold">{item.progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.progressPercent >= 100
                                ? 'bg-emerald-500'
                                : item.progressPercent >= 50
                                ? 'bg-blue-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${Math.min(100, Math.max(0, item.progressPercent))}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 max-w-xs truncate">
                      {item.fundingSource || item.contractor || '—'}
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
                {editingItem ? 'Edit Development Project' : 'Add New Development Project'}
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
                  <label className="block text-xs font-medium text-gray-300 mb-1">Project Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => {
                      setTitleEn(e.target.value)
                      if (!editingItem) {
                        setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
                      }
                    }}
                    placeholder="e.g. All-Weather Rural Road Access"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">የፕሮጀክቱ ስም (አማርኛ)</label>
                  <input
                    type="text"
                    value={titleAm}
                    onChange={(e) => setTitleAm(e.target.value)}
                    placeholder="ምሳሌ፡ የገጠር ተደራሽነት መንገድ ግንባታ"
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
                    placeholder="all-weather-rural-road"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Sector</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 bg-[#081220] border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Agriculture & Irrigation">Agriculture & Irrigation</option>
                    <option value="Electrification">Electrification</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">Description (English)</label>
                <textarea
                  rows={3}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  placeholder="Detailed project scope, beneficiary count, kilometers, etc."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">መግለጫ (አማርኛ)</label>
                <textarea
                  rows={2}
                  value={descriptionAm}
                  onChange={(e) => setDescriptionAm(e.target.value)}
                  placeholder="የፕሮጀክቱ ዝርዝር መግለጫ በአማርኛ..."
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Total Budget (ETB)</label>
                  <input
                    type="number"
                    value={budgetEtb}
                    onChange={(e) => setBudgetEtb(e.target.value)}
                    placeholder="45000000"
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
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="PLANNED">Planned</option>
                    <option value="DELAYED">Delayed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Progress Percentage (0-100%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={(e) => setProgressPercent(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Funding Source</label>
                  <input
                    type="text"
                    value={fundingSource}
                    onChange={(e) => setFundingSource(e.target.value)}
                    placeholder="Amhara Regional Road Authority + URRAP"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Contractor / Agency</label>
                  <input
                    type="text"
                    value={contractor}
                    onChange={(e) => setContractor(e.target.value)}
                    placeholder="Amhara Road Construction Enterprise"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Location</label>
                  <input
                    type="text"
                    value={locationEn}
                    onChange={(e) => setLocationEn(e.target.value)}
                    placeholder="14 Kebeles across Angolela Tera"
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">Expected Completion</label>
                  <input
                    type="date"
                    value={expectedCompletion}
                    onChange={(e) => setExpectedCompletion(e.target.value)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                  />
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
                  {editingItem ? 'Save Changes' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
