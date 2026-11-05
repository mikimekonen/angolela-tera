'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'

export interface ProjectMilestone {
  title: string
  date?: string
  completed: boolean
}

export interface DevelopmentProject {
  id: string
  slug: string
  title_en: string
  title_am?: string
  sector: string
  description_en?: string
  description_am?: string
  location_en?: string
  budget_etb: number
  fundingSource?: string
  contractor?: string
  beneficiaries?: string
  startDate?: string
  expectedCompletion?: string
  status: 'IN_PROGRESS' | 'COMPLETED' | 'PLANNED' | 'DELAYED'
  progressPercent: number
  images?: string[]
  milestones?: ProjectMilestone[]
  isPublicTransparency?: boolean
  displayOrder: number
}

const SECTORS = [
  'Infrastructure',
  'Water & Sanitation',
  'Education',
  'Health',
  'Agriculture & Irrigation',
  'Renewable Energy',
]

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  IN_PROGRESS: { label: 'In Progress', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  COMPLETED: { label: 'Completed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
  PLANNED: { label: 'Planned / Tender', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  DELAYED: { label: 'Delayed / Audit', color: 'bg-rose-50 text-rose-800 border-rose-200' },
}

export default function AdminProjectsPage() {
  const [items, setItems] = useState<DevelopmentProject[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<DevelopmentProject | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [sectorFilter, setSectorFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')

  // Form Fields
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
  const [beneficiaries, setBeneficiaries] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0])
  const [expectedCompletion, setExpectedCompletion] = useState('')
  const [status, setStatus] = useState<'IN_PROGRESS' | 'COMPLETED' | 'PLANNED' | 'DELAYED'>('IN_PROGRESS')
  const [progressPercent, setProgressPercent] = useState('50')
  const [isPublicTransparency, setIsPublicTransparency] = useState(true)
  const [images, setImages] = useState<string[]>([])
  const [newImageUrl, setNewImageUrl] = useState('')
  const [milestones, setMilestones] = useState<ProjectMilestone[]>([])
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const [newMilestoneDate, setNewMilestoneDate] = useState('')
  const [displayOrder, setDisplayOrder] = useState('1')
  const [submitting, setSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

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

  const filteredItems = useMemo(() => {
    return items.filter((p) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        p.title_en.toLowerCase().includes(q) ||
        (p.title_am && p.title_am.includes(q)) ||
        (p.contractor && p.contractor.toLowerCase().includes(q)) ||
        (p.fundingSource && p.fundingSource.toLowerCase().includes(q))
      const matchesSector = sectorFilter === 'ALL' || p.sector === sectorFilter
      const matchesStatus = statusFilter === 'ALL' || p.status === statusFilter
      return matchesSearch && matchesSector && matchesStatus
    })
  }, [items, searchQuery, sectorFilter, statusFilter])

  // Total investment aggregate
  const totalBudgetEtb = useMemo(() => {
    return items.reduce((sum, p) => sum + (Number(p.budget_etb) || 0), 0)
  }, [items])

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
    setBeneficiaries('')
    setStartDate(new Date().toISOString().split('T')[0])
    setExpectedCompletion('')
    setStatus('IN_PROGRESS')
    setProgressPercent('25')
    setIsPublicTransparency(true)
    setImages([])
    setMilestones([
      { title: 'Feasibility study and site survey completed', date: '2024-01-15', completed: true },
      { title: 'Civil contractor mobilization and ground breaking', date: '2024-03-01', completed: true },
      { title: 'Sub-structure foundation inspection', date: '2024-08-30', completed: false },
    ])
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
    setBeneficiaries(item.beneficiaries || '')
    setStartDate(item.startDate ? item.startDate.split('T')[0] : '')
    setExpectedCompletion(item.expectedCompletion ? item.expectedCompletion.split('T')[0] : '')
    setStatus(item.status || 'IN_PROGRESS')
    setProgressPercent(item.progressPercent ? item.progressPercent.toString() : '0')
    setIsPublicTransparency(item.isPublicTransparency !== undefined ? item.isPublicTransparency : true)
    setImages(Array.isArray(item.images) ? [...item.images] : [])
    setMilestones(Array.isArray(item.milestones) ? [...item.milestones] : [])
    setDisplayOrder(item.displayOrder ? item.displayOrder.toString() : '1')
    setIsModalOpen(true)
  }

  // Handle Direct Photo Upload
  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingImage(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('category', 'PROJECTS')
    fd.append('title', `${titleEn || 'Project Site'} Inspection Photo`)

    try {
      const res = await fetch('/api/v1/media/upload', {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setImages((prev) => [...prev, data.url])
      } else {
        alert(data.error || 'Failed to upload project photo.')
      }
    } catch {
      alert('Upload communication error.')
    } finally {
      setUploadingImage(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const addManualImageUrl = () => {
    if (!newImageUrl.trim()) return
    setImages((prev) => [...prev, newImageUrl.trim()])
    setNewImageUrl('')
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const addMilestone = () => {
    if (!newMilestoneTitle.trim()) return
    setMilestones((prev) => [
      ...prev,
      {
        title: newMilestoneTitle.trim(),
        date: newMilestoneDate || undefined,
        completed: false,
      },
    ])
    setNewMilestoneTitle('')
    setNewMilestoneDate('')
  }

  const toggleMilestone = (index: number) => {
    setMilestones((prev) =>
      prev.map((m, i) => (i === index ? { ...m, completed: !m.completed } : m))
    )
  }

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg(null)

    const payload = {
      title_en: titleEn.trim(),
      title_am: titleAm.trim() || undefined,
      slug: slug.trim() || titleEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      sector,
      description_en: descriptionEn.trim() || undefined,
      description_am: descriptionAm.trim() || undefined,
      location_en: locationEn.trim() || undefined,
      budget_etb: parseFloat(budgetEtb) || 0,
      fundingSource: fundingSource.trim() || undefined,
      contractor: contractor.trim() || undefined,
      beneficiaries: beneficiaries.trim() || undefined,
      startDate: startDate || undefined,
      expectedCompletion: expectedCompletion || undefined,
      status,
      progressPercent: parseInt(progressPercent, 10) || 0,
      images,
      milestones,
      isPublicTransparency,
      displayOrder: parseInt(displayOrder, 10) || 1,
    }

    try {
      const url = '/api/v1/projects'
      const method = editingItem ? 'PUT' : 'POST'
      const body = editingItem ? { id: editingItem.id, ...payload } : payload

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()

      if (res.ok && data.success) {
        setMsg({
          type: 'success',
          text: `Project "${titleEn}" ${editingItem ? 'updated' : 'created'} successfully with transparency disclosures.`,
        })
        setIsModalOpen(false)
        await fetchProjects()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to save project.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication failure.' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}"?`)) return
    try {
      const res = await fetch(`/api/v1/projects?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Project "${name}" removed.` })
        await fetchProjects()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to delete project.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Civic Infrastructure & Capital Works
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Open Contracting & Public Expenditure
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight">
            Development Projects Transparency Desk
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Track capital infrastructure, multi-village water systems, feeder roads, school expansions, and verified contractor progress across all 19 kebeles.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer self-start md:self-auto"
        >
          <span>🏗️</span>
          <span>Add New Project</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Active Capital Projects</p>
          <p className="text-2xl font-black text-[#0d2340] mt-1">{items.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Investment Pool</p>
          <p className="text-2xl font-black text-[#1a4f8b] mt-1">
            {(totalBudgetEtb / 1000000).toFixed(1)}M <span className="text-xs font-normal text-gray-500">ETB</span>
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Under Construction</p>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {items.filter((p) => p.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Commissioned / Completed</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {items.filter((p) => p.status === 'COMPLETED').length}
          </p>
        </div>
      </div>

      {/* Alert Banner */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="opacity-70 hover:opacity-100 text-sm">
            ×
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects by title, contractor, or funding source..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Sectors</option>
            {SECTORS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="PLANNED">Planned / Tender</option>
            <option value="DELAYED">Delayed / Audit</option>
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center text-xs text-gray-500">
          Loading capital projects ledger...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-16 text-center text-xs text-gray-500">
          No projects match your current filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((project) => {
            const badge = STATUS_BADGES[project.status] || STATUS_BADGES.IN_PROGRESS
            return (
              <div
                key={project.id}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all flex flex-col justify-between"
              >
                {/* Visual Header / Site Inspection Cover */}
                <div className="relative aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <img
                      src={project.images[0]}
                      alt={project.title_en}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none' }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-400">
                      <span className="text-3xl">🏗️</span>
                      <span className="text-[10px] mt-1 font-bold">Site Progress Verification</span>
                    </div>
                  )}

                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/75 backdrop-blur-xs text-white">
                      {project.sector}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border backdrop-blur-xs ${badge.color}`}>
                      {badge.label}
                    </span>
                  </div>

                  {project.images && project.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                      📸 {project.images.length} Photos
                    </span>
                  )}
                </div>

                {/* Project Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#0d2340] line-clamp-1">{project.title_en}</h3>
                    {project.title_am && (
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 font-medium">{project.title_am}</p>
                    )}

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="text-gray-500">Physical Progress</span>
                        <span className="text-[#1a4f8b] font-mono">{project.progressPercent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#1a4f8b] to-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </div>

                    {/* Financial & Contracting Badges */}
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-[11px]">Approved Budget:</span>
                        <span className="font-bold text-[#0d2340] font-mono">
                          {Number(project.budget_etb).toLocaleString()} ETB
                        </span>
                      </div>

                      {project.contractor && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-[11px]">Contractor:</span>
                          <span className="font-semibold text-gray-700 truncate max-w-[180px]" title={project.contractor}>
                            {project.contractor}
                          </span>
                        </div>
                      )}

                      {project.fundingSource && (
                        <div className="flex items-center justify-between">
                          <span className="text-gray-400 text-[11px]">Funding Agency:</span>
                          <span className="text-gray-600 truncate max-w-[180px]" title={project.fundingSource}>
                            {project.fundingSource}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(project)}
                      className="flex-1 py-1.5 bg-blue-50 hover:bg-blue-100 text-[#1a4f8b] font-bold text-xs rounded-xl transition-colors text-center cursor-pointer"
                    >
                      Edit & Disclose
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id, project.title_en)}
                      className="px-3 py-1.5 text-gray-400 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer text-xs"
                      title="Delete project record"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Create / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">
                  {editingItem ? 'Edit Development Project' : 'Register New Capital Project'}
                </h3>
                <p className="text-xs text-gray-500">Comply with Ethiopian open procurement transparency standards.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Project Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g., Chacha–Cheki All-Weather Feeder Road"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Project Title (Amharic / አማርኛ)</label>
                  <input
                    type="text"
                    value={titleAm}
                    onChange={(e) => setTitleAm(e.target.value)}
                    placeholder="የፕሮጀክቱ ይፋዊ ስም በአማርኛ..."
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Development Sector *</label>
                  <select
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Contract Status *</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    <option value="IN_PROGRESS">In Progress (Active Works)</option>
                    <option value="COMPLETED">Completed (Handed Over)</option>
                    <option value="PLANNED">Planned (Bidding Phase)</option>
                    <option value="DELAYED">Delayed (Audit / Variation)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Completion Progress (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={progressPercent}
                    onChange={(e) => setProgressPercent(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Financial & Contracting Transparency Section */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Expenditure & Contracting Disclosures
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Approved Budget (ETB) *</label>
                    <input
                      type="number"
                      required
                      value={budgetEtb}
                      onChange={(e) => setBudgetEtb(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 font-mono focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Funding Agency / Source</label>
                    <input
                      type="text"
                      value={fundingSource}
                      onChange={(e) => setFundingSource(e.target.value)}
                      placeholder="e.g., Regional Road Authority"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Contractor</label>
                    <input
                      type="text"
                      value={contractor}
                      onChange={(e) => setContractor(e.target.value)}
                      placeholder="e.g., Amhara Construction Enterprise"
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Contract Start Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Target Completion Date</label>
                    <input
                      type="date"
                      value={expectedCompletion}
                      onChange={(e) => setExpectedCompletion(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Site Inspection Photo Gallery */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Site Inspection Photo Gallery
                    </h4>
                    <p className="text-[11px] text-gray-500">Visual proof of civil construction progress.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="px-3 py-1.5 bg-[#1a4f8b] text-white text-xs font-bold rounded-lg hover:bg-[#133a6b] cursor-pointer"
                  >
                    {uploadingImage ? 'Uploading...' : '📸 Upload Photo'}
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handlePhotoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>

                {images.length > 0 ? (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((imgUrl, i) => (
                      <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-gray-300 group">
                        <img src={imgUrl} alt="Inspection" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-gray-400 italic">No site photos uploaded yet.</p>
                )}

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="text"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    placeholder="Or enter image URL (/images/photo.jpg)..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={addManualImageUrl}
                    className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-xs font-bold rounded-lg"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              {/* Milestones Breakdown */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                  Deliverable Milestones
                </h4>
                {milestones.length > 0 && (
                  <div className="space-y-1.5">
                    {milestones.map((m, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-gray-200 text-xs"
                      >
                        <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
                          <input
                            type="checkbox"
                            checked={m.completed}
                            onChange={() => toggleMilestone(idx)}
                            className="rounded text-[#1a4f8b]"
                          />
                          <span className={m.completed ? 'line-through text-gray-400' : ''}>
                            {m.title}
                          </span>
                        </label>
                        <div className="flex items-center gap-2">
                          {m.date && <span className="text-[10px] text-gray-400 font-mono">{m.date}</span>}
                          <button
                            type="button"
                            onClick={() => removeMilestone(idx)}
                            className="text-gray-400 hover:text-rose-600 font-bold"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    placeholder="New milestone (e.g. Masonry structure complete)..."
                    className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-800"
                  />
                  <input
                    type="date"
                    value={newMilestoneDate}
                    onChange={(e) => setNewMilestoneDate(e.target.value)}
                    className="px-3 py-1.5 rounded-lg border border-gray-300 text-xs text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={addMilestone}
                    className="px-3 py-1.5 bg-[#1a4f8b] text-white text-xs font-bold rounded-lg hover:bg-[#133a6b]"
                  >
                    + Add
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Project Description & Scope (English)</label>
                <textarea
                  rows={2}
                  value={descriptionEn}
                  onChange={(e) => setDescriptionEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b] disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingItem ? 'Update Project' : 'Commit Project to Portal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
