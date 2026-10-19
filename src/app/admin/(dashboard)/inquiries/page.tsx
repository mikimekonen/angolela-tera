'use client'

import React, { useState, useEffect } from 'react'

interface Inquiry {
  id: string
  trackingCode: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: string
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED'
  responseNotes?: string
  assignedOfficeId?: string
  createdAt: string
  updatedAt: string
}

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchInquiries()
  }, [])

  const fetchInquiries = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/inquiries')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setInquiries(data.data)
        if (data.data.length > 0 && !selectedInquiry) {
          setSelectedInquiry(data.data[0])
          setNotes(data.data[0].responseNotes || '')
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load citizen grievance records.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSelect = (inq: Inquiry) => {
    setSelectedInquiry(inq)
    setNotes(inq.responseNotes || '')
  }

  const updateStatus = async (newStatus: Inquiry['status']) => {
    if (!selectedInquiry) return
    try {
      setSaving(true)
      const res = await fetch('/api/v1/inquiries', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedInquiry.id,
          status: newStatus,
          responseNotes: notes,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setInquiries((prev) =>
          prev.map((i) =>
            i.id === selectedInquiry.id
              ? { ...i, status: newStatus, responseNotes: notes }
              : i
          )
        )
        setSelectedInquiry((prev) =>
          prev ? { ...prev, status: newStatus, responseNotes: notes } : null
        )
        setMsg({
          type: 'success',
          text: `Ticket [${selectedInquiry.trackingCode}] status changed to ${newStatus}.`,
        })
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update ticket.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network request error.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
              Citizen Charter Desk
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Citizen Grievances & Inquiries Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track citizen petitions, service delays, water disruptions, and review resolution progress with public tracking codes.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1.5 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold rounded-lg self-start sm:self-auto">
            {inquiries.length} Registered Tickets
          </span>
        </div>
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
          Loading citizen tickets...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Table / List */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Submissions Roster
              </span>
              <span className="text-[11px] text-gray-400">Click a ticket to review</span>
            </div>

            <div className="divide-y divide-gray-100">
              {inquiries.map((inq) => (
                <div
                  key={inq.id}
                  onClick={() => handleSelect(inq)}
                  className={`p-4 hover:bg-blue-50/50 cursor-pointer transition-colors ${
                    selectedInquiry?.id === inq.id ? 'bg-blue-50/80 border-l-4 border-l-[#1a4f8b]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-[#1a4f8b] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {inq.trackingCode}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        inq.status === 'RESOLVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : inq.status === 'UNDER_REVIEW'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : inq.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}
                    >
                      {inq.status}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-[#0d2340]">
                    {inq.subject}
                  </h3>

                  <p className="text-xs text-gray-600 line-clamp-2 mt-1">
                    {inq.message}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 mt-2 pt-2 border-t border-gray-50">
                    <span>From: <strong className="text-gray-700">{inq.name}</strong></span>
                    <span>{new Date(inq.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Pane: Selected Details & Action Desk */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
            {selectedInquiry ? (
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-3">
                  <span className="text-[10px] font-mono font-bold bg-blue-50 text-[#1a4f8b] px-2 py-0.5 rounded">
                    Ticket: {selectedInquiry.trackingCode}
                  </span>
                  <h3 className="text-base font-bold text-[#0d2340] mt-2">
                    {selectedInquiry.subject}
                  </h3>
                  <div className="text-xs text-gray-500 mt-1">
                    Filed by: <strong className="text-gray-800">{selectedInquiry.name}</strong> • {selectedInquiry.email}
                  </div>
                  {selectedInquiry.phone && (
                    <div className="text-xs text-gray-500">Phone: {selectedInquiry.phone}</div>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Citizen Message & Submission
                  </label>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 leading-relaxed max-h-48 overflow-y-auto">
                    {selectedInquiry.message}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                    Government Resolution Notes (Visible to Citizen)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter official action taken, desk forwarded to, or resolution timeline..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <span className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Update Investigation Status
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => updateStatus('UNDER_REVIEW')}
                      disabled={saving}
                      className="px-2 py-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold rounded-lg transition-colors text-center"
                    >
                      In Review
                    </button>
                    <button
                      onClick={() => updateStatus('RESOLVED')}
                      disabled={saving}
                      className="px-2 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg transition-colors text-center"
                    >
                      Resolved
                    </button>
                    <button
                      onClick={() => updateStatus('REJECTED')}
                      disabled={saving}
                      className="px-2 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold rounded-lg transition-colors text-center"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-xs text-gray-400 py-12">
                Select an inquiry from the list to view and respond.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
