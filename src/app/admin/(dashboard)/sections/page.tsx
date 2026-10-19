'use client'

import React, { useState, useEffect } from 'react'

interface SectionItem {
  id: string
  sectionKey: string
  title_en: string
  isEnabled: boolean
  displayOrder: number
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  hero: 'Full-width official government slider, campaign headlines, and citizen quick access pills.',
  action_finder: 'Interactive citizen action directory ("I Want To..." / "ምን ማድረግ ይፈልጋሉ?").',
  at_a_glance: 'Woreda demographic profile, verified census figures, area metrics, and kebele counts.',
  services: 'Public citizen & business services catalog with requirements, costs, and processing times.',
  companies: 'Local private manufacturing plants, agro-processors, and commercial enterprises.',
  partners: 'Bilateral development partners, research institutions, and international NGO collaborations.',
  leadership: 'Executive messages from the Woreda Chief Administrator and cabinet director roster.',
  investment: 'Highland agro-industrial corridor incentives, land allocations, and investment procedures.',
  news: 'Official press releases, council proclamations, public notices, and tender announcements.',
}

export default function AdminSectionsPage() {
  const [sections, setSections] = useState<SectionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [savingKey, setSavingKey] = useState<string | null>(null)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchSections()
  }, [])

  const fetchSections = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/sections')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setSections(data.data.sort((a: SectionItem, b: SectionItem) => a.displayOrder - b.displayOrder))
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to fetch section settings.' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (sectionKey: string, currentStatus: boolean) => {
    try {
      setSavingKey(sectionKey)
      setMsg(null)
      const res = await fetch('/api/v1/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle',
          sectionKey,
          isEnabled: !currentStatus,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setSections((prev) =>
          prev.map((s) => (s.sectionKey === sectionKey ? { ...s, isEnabled: !currentStatus } : s))
        )
        setMsg({
          type: 'success',
          text: `Section [${sectionKey}] updated to ${!currentStatus ? 'ON (Visible)' : 'OFF (Hidden)'}.`,
        })
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update section.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication error.' })
    } finally {
      setSavingKey(null)
    }
  }

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1
    if (newIdx < 0 || newIdx >= sections.length) return

    const newSections = [...sections]
    const temp = newSections[index]
    newSections[index] = newSections[newIdx]
    newSections[newIdx] = temp

    // Update display orders
    const updated = newSections.map((s, idx) => ({ ...s, displayOrder: idx + 1 }))
    setSections(updated)

    try {
      const orderedKeys = updated.map((s) => s.sectionKey)
      await fetch('/api/v1/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reorder', orderedKeys }),
      })
      setMsg({ type: 'success', text: 'Homepage section order re-sequenced successfully.' })
    } catch {
      setMsg({ type: 'error', text: 'Failed to save new order.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              CMS Layout Controller
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Homepage Section Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Toggle visibility (ON / OFF) and reorder sections displayed on the live public portal without editing code.
          </p>
        </div>

        <button
          onClick={fetchSections}
          className="px-3.5 py-1.5 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50 self-start sm:self-auto shadow-2xs"
        >
          ↻ Refresh Layout
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

      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
          Loading configured homepage sections...
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-xs font-bold text-gray-700">
            <span>Section Module & Jurisdiction</span>
            <span>Controls & Status</span>
          </div>

          <div className="divide-y divide-gray-100">
            {sections.map((sec, idx) => (
              <div
                key={sec.sectionKey}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex flex-col gap-1 pt-1">
                    <button
                      onClick={() => handleMove(idx, 'up')}
                      disabled={idx === 0}
                      className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-[10px] flex items-center justify-center font-bold text-gray-700"
                      title="Move Up"
                    >
                      ▲
                    </button>
                    <button
                      onClick={() => handleMove(idx, 'down')}
                      disabled={idx === sections.length - 1}
                      className="w-6 h-6 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-30 text-[10px] flex items-center justify-center font-bold text-gray-700"
                      title="Move Down"
                    >
                      ▼
                    </button>
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0d2340]">
                        {idx + 1}. {sec.title_en || sec.sectionKey}
                      </span>
                      <span className="text-[10px] font-mono bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        key: {sec.sectionKey}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 max-w-xl">
                      {SECTION_DESCRIPTIONS[sec.sectionKey] || 'Configurable homepage content module.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${
                        sec.isEnabled
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {sec.isEnabled ? 'ON • Visible' : 'OFF • Hidden'}
                    </span>

                    <button
                      onClick={() => handleToggle(sec.sectionKey, sec.isEnabled)}
                      disabled={savingKey === sec.sectionKey}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                        sec.isEnabled
                          ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                      }`}
                    >
                      {savingKey === sec.sectionKey
                        ? 'Updating...'
                        : sec.isEnabled
                        ? 'Disable Section'
                        : 'Enable Section'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
