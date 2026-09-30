'use client'

import React, { useState, useEffect } from 'react'
import type { LeaderProfile } from '@/data/entityData'

export default function AdminLeadershipPage() {
  const [leaders, setLeaders] = useState<LeaderProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingLeader, setEditingLeader] = useState<LeaderProfile | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Form states
  const [nameEn, setNameEn] = useState('')
  const [nameAm, setNameAm] = useState('')
  const [nameOm, setNameOm] = useState('')
  const [titleEn, setTitleEn] = useState('')
  const [titleAm, setTitleAm] = useState('')
  const [titleOm, setTitleOm] = useState('')
  const [bioEn, setBioEn] = useState('')
  const [bioAm, setBioAm] = useState('')
  const [bioOm, setBioOm] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [photo, setPhoto] = useState('')
  const [displayOrder, setDisplayOrder] = useState<number>(1)

  const fetchLeaders = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/leadership')
      const json = await res.json()
      if (json.success) {
        setLeaders(json.data)
      }
    } catch {
      console.error('Failed to load leaders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLeaders()
  }, [])

  const resetForm = () => {
    setEditingLeader(null)
    setNameEn('')
    setNameAm('')
    setNameOm('')
    setTitleEn('')
    setTitleAm('')
    setTitleOm('')
    setBioEn('')
    setBioAm('')
    setBioOm('')
    setPhone('')
    setEmail('')
    setPhoto('')
    setDisplayOrder(leaders.length + 1)
  }

  const openCreateModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (l: LeaderProfile) => {
    setEditingLeader(l)
    setNameEn(l.name_en)
    setNameAm(l.name_am)
    setNameOm(l.name_om)
    setTitleEn(l.title_en)
    setTitleAm(l.title_am)
    setTitleOm(l.title_om)
    setBioEn(l.bio_en)
    setBioAm(l.bio_am)
    setBioOm(l.bio_om)
    setPhone(l.phone || '')
    setEmail(l.email || '')
    setPhoto(l.photo || '')
    setDisplayOrder(l.displayOrder)
    setShowModal(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nameEn.trim() || !titleEn.trim()) return

    setSubmitting(true)
    try {
      const payload: any = {
        name_en: nameEn.trim(),
        name_am: nameAm.trim() || nameEn.trim(),
        name_om: nameOm.trim() || nameEn.trim(),
        title_en: titleEn.trim(),
        title_am: titleAm.trim() || titleEn.trim(),
        title_om: titleOm.trim() || titleEn.trim(),
        bio_en: bioEn.trim() || undefined,
        bio_am: bioAm.trim() || undefined,
        bio_om: bioOm.trim() || undefined,
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        photo: photo.trim() || undefined,
        displayOrder: Number(displayOrder) || 1,
      }

      if (editingLeader) {
        payload.id = editingLeader.id
      }

      const res = await fetch('/api/v1/leadership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        await fetchLeaders()
        setShowModal(false)
        resetForm()
      } else {
        alert(data.error || 'Failed to save leadership profile')
      }
    } catch {
      alert('Network error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from executive leadership?`)) {
      return
    }

    try {
      const res = await fetch(`/api/v1/leadership?id=${id}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setLeaders((prev) => prev.filter((l) => l.id !== id))
      } else {
        alert(data.error || 'Failed to delete leadership profile')
      }
    } catch {
      alert('Network error')
    }
  }

  const filteredLeaders = leaders.filter((l) =>
    l.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.name_am.includes(searchTerm) ||
    l.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.title_am.includes(searchTerm)
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0d2340]">
            Executive Leadership & Sector Directors Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Maintain public leadership profiles, photos, biographies, and contact details for the Woreda Chief Administrator, Cabinet Secretariat, and Sector Directors.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <span>➕</span>
          <span>Add Executive / Sector Director</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <input
          type="text"
          placeholder="Search by leader name, official title, or cabinet position..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
        />
      </div>

      {/* Leadership Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl">
          Loading leadership profiles...
        </div>
      ) : filteredLeaders.length === 0 ? (
        <div className="p-12 text-center text-xs text-gray-500 bg-white border border-gray-200 rounded-2xl">
          No leadership profiles found. Click &quot;Add Executive / Sector Director&quot; to create one.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLeaders.map((leader) => (
            <div
              key={leader.id}
              className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  {/* Portrait / Avatar */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#1a4f8b] to-[#c8931a] flex items-center justify-center text-white text-xl font-bold border-2 border-white shadow-sm shrink-0 overflow-hidden">
                    {leader.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={leader.photo}
                        alt={leader.name_en}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{leader.name_en.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>

                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-[#c8931a] uppercase tracking-wider block truncate">
                      {leader.title_en}
                    </span>
                    <h3 className="text-sm font-extrabold text-[#0d2340] truncate">
                      {leader.name_en}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">
                      {leader.name_am}
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-gray-600 bg-gray-50 p-3 rounded-xl mb-3">
                  <p className="line-clamp-3 italic text-gray-600">
                    &ldquo;{leader.bio_en || leader.bio_am || 'No biography available.'}&rdquo;
                  </p>
                </div>

                <div className="space-y-1 text-[11px] text-gray-500">
                  <p>
                    <strong className="text-gray-700">Phone:</strong> {leader.phone || 'N/A'}
                  </p>
                  <p>
                    <strong className="text-gray-700">Email:</strong> {leader.email || 'N/A'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(leader)}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    ✏️ Update Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(leader.id, leader.name_en)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    🗑️ Delete
                  </button>
                </div>

                <span className="text-[10px] text-gray-400 font-bold bg-gray-100 px-2 py-0.5 rounded">
                  Order #{leader.displayOrder}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-xl max-w-2xl w-full p-6 space-y-4 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h2 className="text-lg font-bold text-[#0d2340]">
                  {editingLeader ? 'Update Leadership / Sector Director Profile' : 'Add New Executive Leader'}
                </h2>
                <p className="text-xs text-gray-500">
                  Allows changing sector directors and leadership personnel with photo and description.
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
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Full Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={nameEn}
                    onChange={(e) => setNameEn(e.target.value)}
                    placeholder="e.g. Ato Alemu Bekele Demissie"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    ሙሉ ስም (Amharic)
                  </label>
                  <input
                    type="text"
                    value={nameAm}
                    onChange={(e) => setNameAm(e.target.value)}
                    placeholder="ለምሳሌ: አቶ አለሙ በቀለ ደምሰው"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Maqaa Guutuu (Afaan Oromoo)
                  </label>
                  <input
                    type="text"
                    value={nameOm}
                    onChange={(e) => setNameOm(e.target.value)}
                    placeholder="fkn: Obbo Aleemuu Baqalee"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Official Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Official Position (English) *
                  </label>
                  <input
                    type="text"
                    required
                    value={titleEn}
                    onChange={(e) => setTitleEn(e.target.value)}
                    placeholder="e.g. Woreda Administrator / Agriculture Head"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    የስራ ሃላፊነት (Amharic)
                  </label>
                  <input
                    type="text"
                    value={titleAm}
                    onChange={(e) => setTitleAm(e.target.value)}
                    placeholder="የወረዳ አስተዳዳሪ / የግብርና ጽ/ቤት ኃላፊ"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Itti Gaafatamummaa (Oromo)
                  </label>
                  <input
                    type="text"
                    value={titleOm}
                    onChange={(e) => setTitleOm(e.target.value)}
                    placeholder="Bulchaa Aanaa / Itti Gaafatamaa"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Photo & Contacts */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Photo URL or Local Path
                  </label>
                  <input
                    type="text"
                    value={photo}
                    onChange={(e) => setPhoto(e.target.value)}
                    placeholder="/images/leadership/leader-1.jpg"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Direct Phone / Desk Ext.
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 (0) 58 661 0100"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Official Government Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="leader@angolela-tera.gov.et"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {/* Short Bio */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Executive Short Biography & Vision (English)
                </label>
                <textarea
                  rows={2}
                  value={bioEn}
                  onChange={(e) => setBioEn(e.target.value)}
                  placeholder="Summary of experience, key priorities, and leadership vision..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    አጭር የህይወት ታሪክና የስራ ልምድ (Amharic)
                  </label>
                  <textarea
                    rows={2}
                    value={bioAm}
                    onChange={(e) => setBioAm(e.target.value)}
                    placeholder="የስራ ልምድና የወረዳውን ህዝብ ለማገልገል ያላቸው ራዕይ..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Ibsa Seenaa fi Hojii (Afaan Oromoo)
                  </label>
                  <textarea
                    rows={2}
                    value={bioOm}
                    onChange={(e) => setBioOm(e.target.value)}
                    placeholder="Muuxannoo hojii..."
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
                  {submitting ? 'Saving...' : editingLeader ? 'Update Profile' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
