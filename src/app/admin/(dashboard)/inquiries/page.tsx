'use client'

import React, { useState, useEffect, useMemo } from 'react'

interface StatusHistoryItem {
  status: string
  changedAt: string
  changedBy?: string
  notes?: string
}

interface Inquiry {
  id: string
  trackingCode: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: 'grievance' | 'inquiry' | 'feedback' | 'service_complaint' | string
  status: 'RECEIVED' | 'SUBMITTED' | 'UNDER_REVIEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED' | string
  responseNotes?: string
  internalNotes?: string
  assignedOfficeId?: string
  assignedStaffName?: string
  adminNotificationSent?: boolean
  adminNotificationSentAt?: string
  citizenConfirmationSent?: boolean
  citizenConfirmationSentAt?: string
  emailError?: string
  emailAttempts?: number
  lastEmailAttemptAt?: string
  statusHistory?: StatusHistoryItem[]
  createdAt: string
  updatedAt: string
}

const SECTOR_OFFICES = [
  { id: 'land-admin', name: 'Land Administration & Cadastral Desk', am: 'የመሬት አስተዳደር ዴስክ' },
  { id: 'agriculture', name: 'Agriculture & Rural Development Office', am: 'የግብርናና ገጠር ልማት ጽ/ቤት' },
  { id: 'water-energy', name: 'Water, Minerals & Energy Office', am: 'የውሃ፣ ማዕድንና ኢነርጂ ጽ/ቤት' },
  { id: 'vital-events', name: 'Vital Events & Civil Status Desk', am: 'የወሳኝ ኩነት ምዝገባ ዴስክ' },
  { id: 'trade-industry', name: 'Trade & Business Licensing Desk', am: 'የንግድና ኢንዱስትሪ ዴስክ' },
  { id: 'health', name: 'Health Directorate', am: 'የጤና ጥበቃ መምሪያ' },
  { id: 'education', name: 'Education Office', am: 'የትምህርት ጽ/ቤት' },
  { id: 'administration', name: 'Woreda Cabinet & Grievance Committee', am: 'የወረዳው ካቢኔና የቅሬታ ሰሚ ኮሚቴ' },
]

const RESPONSE_TEMPLATES = [
  {
    title: 'Documents Verified & Ready',
    text: 'Your submitted documentation has been verified by the sectoral desk. Your official certificate is ready for collection at your local Kebele Administration Service Center upon presentation of your valid ID.',
  },
  {
    title: 'Field Inspection Dispatched',
    text: 'A joint engineering and regulatory inspection team has been assigned to investigate your report on-site. The assigned technical officer will contact you within 24 hours to schedule the physical verification.',
  },
  {
    title: 'Additional Evidence Required',
    text: 'To proceed with this administrative review, please provide a certified copy of your Kebele residency certificate and the latest annual land/tax receipt at the Woreda One-Stop Service Hall.',
  },
  {
    title: 'Maintenance Completed & Resolved',
    text: 'The reported municipal service disruption has been resolved by our maintenance division. Service has been restored in accordance with the Angolela Tera Citizen Service Charter.',
  },
]

// 48 Hours statutory response standard under Ethiopian Civil Service guidelines
const SLA_LIMIT_HOURS = 48

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState('')
  const [internalNotes, setInternalNotes] = useState('')
  const [assignedOffice, setAssignedOffice] = useState('')
  const [assignedStaff, setAssignedStaff] = useState('')
  const [saving, setSaving] = useState(false)
  const [retryingEmail, setRetryingEmail] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Filtering states
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [slaFilter, setSlaFilter] = useState<'ALL' | 'OVERDUE' | 'URGENT'>('ALL')

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
          selectTicket(data.data[0])
        }
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load citizen grievance records.' })
    } finally {
      setLoading(false)
    }
  }

  const selectTicket = (inq: Inquiry) => {
    setSelectedInquiry(inq)
    setNotes(inq.responseNotes || '')
    setInternalNotes(inq.internalNotes || '')
    setAssignedOffice(inq.assignedOfficeId || '')
    setAssignedStaff(inq.assignedStaffName || '')
  }

  // Calculate SLA status for a ticket
  const getSlaStatus = (createdAt: string, status: Inquiry['status']) => {
    if (status === 'RESOLVED' || status === 'REJECTED') {
      return { code: 'CLOSED', label: 'Case Closed', badge: 'bg-gray-100 text-gray-700 border-gray-200' }
    }

    const created = new Date(createdAt).getTime()
    const now = Date.now()
    const elapsedHours = (now - created) / (1000 * 60 * 60)
    const remainingHours = SLA_LIMIT_HOURS - elapsedHours

    if (remainingHours <= 0) {
      const overdueBy = Math.abs(Math.round(remainingHours))
      return {
        code: 'OVERDUE',
        label: `SLA Breached (+${overdueBy}h)`,
        badge: 'bg-rose-100 text-rose-800 border-rose-300 font-bold animate-pulse',
        remainingHours,
      }
    } else if (remainingHours <= 12) {
      return {
        code: 'URGENT',
        label: `Urgent (${Math.round(remainingHours)}h left)`,
        badge: 'bg-amber-100 text-amber-900 border-amber-300 font-bold',
        remainingHours,
      }
    }
    return {
      code: 'ON_TRACK',
      label: `On Track (${Math.round(remainingHours)}h left)`,
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      remainingHours,
    }
  }

  const handleApplyTemplate = (tplText: string) => {
    setNotes((prev) => (prev ? `${prev}\n\n${tplText}` : tplText))
  }

  const updateTicket = async (newStatus: Inquiry['status']) => {
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
          internalNotes: internalNotes,
          assignedOfficeId: assignedOffice || null,
          assignedStaffName: assignedStaff || null,
        }),
      })
      const data = await res.json()

      if (data.success && data.data) {
        const updated = data.data as Inquiry
        setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
        setSelectedInquiry(updated)
        setMsg({
          type: 'success',
          text: `Ticket [${updated.trackingCode}] successfully updated to status: ${newStatus}.`,
        })
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update ticket.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network request error during ticket update.' })
    } finally {
      setSaving(false)
    }
  }

  const handleRetryEmail = async () => {
    if (!selectedInquiry) return
    try {
      setRetryingEmail(true)
      setMsg(null)
      const res = await fetch('/api/v1/inquiries/retry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingCode: selectedInquiry.trackingCode,
          target: 'both',
        }),
      })
      const data = await res.json()

      if (data.success || data.data) {
        const updated = data.data as Inquiry
        setInquiries((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
        setSelectedInquiry(updated)
        if (data.adminNotificationSent && data.citizenConfirmationSent) {
          setMsg({
            type: 'success',
            text: `Both Admin notification and Citizen confirmation delivered successfully for [${updated.trackingCode}].`,
          })
        } else if (data.adminNotificationSent || data.citizenConfirmationSent) {
          setMsg({
            type: 'success',
            text: `Partial delivery completed for [${updated.trackingCode}]. Admin: ${data.adminNotificationSent ? 'Sent' : 'Failed'}, Citizen: ${data.citizenConfirmationSent ? 'Sent' : 'Failed'}.`,
          })
        } else {
          setMsg({
            type: 'error',
            text: `Email retry failed: ${data.emailError || 'Please check RESEND_API_KEY or SMTP credentials in your environment settings.'}`,
          })
        }
      } else {
        setMsg({
          type: 'error',
          text: data.error || 'Email retry failed. Check SMTP or Resend API key in environment.',
        })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network error occurred while retrying email delivery.' })
    } finally {
      setRetryingEmail(false)
    }
  }

  // Calculate Metrics
  const metrics = useMemo(() => {
    const total = inquiries.length
    const review = inquiries.filter(
      (i) => i.status === 'UNDER_REVIEW' || i.status === 'SUBMITTED' || i.status === 'RECEIVED' || i.status === 'ASSIGNED'
    ).length
    const resolved = inquiries.filter((i) => i.status === 'RESOLVED').length
    const overdue = inquiries.filter((i) => {
      const sla = getSlaStatus(i.createdAt, i.status)
      return sla.code === 'OVERDUE'
    }).length
    return { total, review, resolved, overdue }
  }, [inquiries])

  // Filter inquiries
  const filteredInquiries = useMemo(() => {
    return inquiries.filter((inq) => {
      const q = search.toLowerCase()
      const matchesSearch =
        inq.trackingCode.toLowerCase().includes(q) ||
        inq.name.toLowerCase().includes(q) ||
        inq.subject.toLowerCase().includes(q) ||
        (inq.phone && inq.phone.includes(q)) ||
        inq.email.toLowerCase().includes(q)

      const matchesCategory = categoryFilter === 'ALL' || inq.category === categoryFilter
      const matchesStatus =
        statusFilter === 'ALL' ||
        inq.status === statusFilter ||
        (statusFilter === 'RECEIVED' && (inq.status === 'RECEIVED' || inq.status === 'SUBMITTED'))

      const sla = getSlaStatus(inq.createdAt, inq.status)
      const matchesSla =
        slaFilter === 'ALL' ||
        (slaFilter === 'OVERDUE' && sla.code === 'OVERDUE') ||
        (slaFilter === 'URGENT' && (sla.code === 'URGENT' || sla.code === 'OVERDUE'))

      return matchesSearch && matchesCategory && matchesStatus && matchesSla
    })
  }, [inquiries, search, categoryFilter, statusFilter, slaFilter])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Ethiopian Civil Service Citizen Charter
            </span>
            <span className="text-xs text-gray-400">• Statutory 48h SLA</span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Citizen Grievance &amp; Service SLA Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track citizen petitions, service complaints, water/road disruption reports, and issue official resolution dispatches.
          </p>
        </div>

        <button
          onClick={fetchInquiries}
          className="px-4 py-2 bg-white border border-gray-200 text-xs font-bold text-gray-700 rounded-xl hover:bg-gray-50 shadow-2xs cursor-pointer flex items-center gap-2 self-start sm:self-auto"
        >
          <span>🔄</span>
          <span>Refresh Tickets</span>
        </button>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Registered</span>
          <p className="text-2xl font-black text-[#0d2340] mt-1">{metrics.total}</p>
          <span className="text-[11px] text-gray-400">All recorded petitions</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Under Investigation</span>
          <p className="text-2xl font-black text-[#1a4f8b] mt-1">{metrics.review}</p>
          <span className="text-[11px] text-blue-500">Active casework</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Successfully Resolved</span>
          <p className="text-2xl font-black text-emerald-700 mt-1">{metrics.resolved}</p>
          <span className="text-[11px] text-emerald-600">Resolution dispatched</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-rose-200 shadow-xs">
          <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">SLA Breached (&gt;48h)</span>
          <p className="text-2xl font-black text-rose-700 mt-1">{metrics.overdue}</p>
          <span className="text-[11px] text-rose-500">Statutory deadline exceeded</span>
        </div>
      </div>

      {/* Top Banner / Feedback Alert */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center justify-between shadow-xs ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button onClick={() => setMsg(null)} className="text-gray-400 hover:text-gray-700 font-bold cursor-pointer">
            ✕
          </button>
        </div>
      )}

      {/* Filter / Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Search Tickets</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search code, name, phone, subject..."
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Category</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Categories</option>
            <option value="grievance">Grievance (ቅሬታ)</option>
            <option value="inquiry">Official Inquiry (ጥያቄ)</option>
            <option value="service_complaint">Service Complaint (የአገልግሎት አቤቱታ)</option>
            <option value="feedback">Civic Feedback (አስተያየት)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">Resolution Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Statuses</option>
            <option value="RECEIVED">Received / New</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="RESOLVED">Resolved</option>
            <option value="REJECTED">Rejected / Ineligible</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-gray-600 mb-1">SLA Health</label>
          <select
            value={slaFilter}
            onChange={(e) => setSlaFilter(e.target.value as any)}
            className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All SLA States</option>
            <option value="OVERDUE">🔴 SLA Breached (&gt;48h)</option>
            <option value="URGENT">🟡 Approaching Deadline (&lt;12h)</option>
          </select>
        </div>
      </div>

      {/* Main Split Layout: Ticket Roster & Dossier */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
          <span className="inline-block animate-spin mr-2">🔄</span> Loading citizen grievance tickets...
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Tickets Roster (5 cols) */}
          <div className="lg:col-span-5 bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden flex flex-col max-h-[850px]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
              <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                Submissions Roster ({filteredInquiries.length})
              </span>
              <span className="text-[10px] text-gray-400">Chronological feed</span>
            </div>

            <div className="divide-y divide-gray-100 overflow-y-auto scrollbar-none flex-1">
              {filteredInquiries.length === 0 ? (
                <div className="p-8 text-center text-xs text-gray-400">
                  No citizen tickets match your current filters.
                </div>
              ) : (
                filteredInquiries.map((inq) => {
                  const isSelected = selectedInquiry?.id === inq.id
                  const sla = getSlaStatus(inq.createdAt, inq.status)

                  return (
                    <div
                      key={inq.id}
                      onClick={() => selectTicket(inq)}
                      className={`p-4 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/70 border-l-4 border-l-[#1a4f8b]'
                          : 'hover:bg-gray-50/80 border-l-4 border-l-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-[11px] font-mono font-bold text-[#1a4f8b] bg-blue-100/60 px-2 py-0.5 rounded">
                          {inq.trackingCode}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${sla.badge}`}>
                          {sla.label}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-[#0d2340] line-clamp-1">{inq.subject}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">{inq.message}</p>

                      {/* Mini Email Flags */}
                      <div className="mt-2 flex items-center gap-1.5 text-[9px]">
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-medium ${
                            inq.adminNotificationSent
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inq.adminNotificationSent ? 'Admin ✓' : 'Admin ⚠️'}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded font-mono font-medium ${
                            inq.citizenConfirmationSent
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {inq.citizenConfirmationSent ? 'Citizen ✓' : 'Citizen ⚠️'}
                        </span>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-[10px] text-gray-400 border-t border-gray-100/60 pt-2">
                        <span className="font-semibold text-gray-600 truncate max-w-[140px]">{inq.name}</span>
                        <span className="capitalize px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">
                          {inq.status.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* Right Column: Active Ticket Dossier & Response Desk (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl shadow-xs p-6 space-y-6 sticky top-20">
            {selectedInquiry ? (
              <>
                {/* Header Information */}
                <div className="border-b border-gray-100 pb-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div>
                      <span className="text-xs font-mono font-bold text-[#1a4f8b] bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">
                        {selectedInquiry.trackingCode}
                      </span>
                      <h3 className="text-base font-bold text-[#0d2340] mt-2">
                        {selectedInquiry.subject}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold border ${
                          selectedInquiry.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : selectedInquiry.status === 'UNDER_REVIEW'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : selectedInquiry.status === 'REJECTED'
                            ? 'bg-rose-50 text-rose-800 border-rose-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {selectedInquiry.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 mt-1">
                    Submitted on: {new Date(selectedInquiry.createdAt).toLocaleString()} • Category: {selectedInquiry.category}
                  </p>
                </div>

                {/* EMAIL NOTIFICATION & DELIVERY AUDIT BOX */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📬</span> Email Delivery Status &amp; Notifications
                    </span>

                    <button
                      type="button"
                      disabled={retryingEmail}
                      onClick={handleRetryEmail}
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg text-xs font-bold text-gray-700 shadow-2xs cursor-pointer disabled:opacity-50 transition-colors"
                    >
                      <span>{retryingEmail ? '⏳ Retrying...' : '🔄 Retry Delivery'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {/* Admin Status */}
                    <div
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        selectedInquiry.adminNotificationSent
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50/70 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-[11px]">Woreda Admin Email</span>
                        <span className="text-[10px] text-gray-600">angolelatera1@gmail.com</span>
                      </div>
                      <span className="text-xs font-bold">
                        {selectedInquiry.adminNotificationSent ? '✓ Sent' : '⚠️ Pending / Failed'}
                      </span>
                    </div>

                    {/* Citizen Status */}
                    <div
                      className={`p-2.5 rounded-lg border flex items-center justify-between ${
                        selectedInquiry.citizenConfirmationSent
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800'
                          : 'bg-amber-50/70 border-amber-200 text-amber-900'
                      }`}
                    >
                      <div>
                        <span className="font-bold block text-[11px]">Citizen Receipt Email</span>
                        <span className="text-[10px] text-gray-600 truncate max-w-[130px] block">
                          {selectedInquiry.email}
                        </span>
                      </div>
                      <span className="text-xs font-bold">
                        {selectedInquiry.citizenConfirmationSent ? '✓ Sent' : '⚠️ Pending / Failed'}
                      </span>
                    </div>
                  </div>

                  {selectedInquiry.emailError && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-800 space-y-1">
                      <span className="font-bold block">Delivery Notice:</span>
                      <p className="font-mono text-[11px] leading-relaxed break-words">
                        {selectedInquiry.emailError}
                      </p>
                      <p className="text-[10px] text-rose-700 italic mt-1">
                        Configure <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">RESEND_API_KEY</code> or Gmail SMTP in your deployment environment variables, then click &ldquo;Retry Delivery&rdquo;.
                      </p>
                    </div>
                  )}

                  {selectedInquiry.emailAttempts !== undefined && selectedInquiry.emailAttempts > 0 && (
                    <p className="text-[10px] text-gray-400">
                      Total delivery attempts: {selectedInquiry.emailAttempts}
                      {selectedInquiry.lastEmailAttemptAt && ` • Last attempt: ${new Date(selectedInquiry.lastEmailAttemptAt).toLocaleString()}`}
                    </p>
                  )}
                </div>

                {/* Citizen Contact Profile Card */}
                <div className="p-4 bg-gray-50/80 rounded-xl border border-gray-200 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">Citizen Name</span>
                    <span className="font-bold text-gray-800">{selectedInquiry.name}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">Official Email</span>
                    <a
                      href={`mailto:${selectedInquiry.email}`}
                      className="text-[#1a4f8b] hover:underline font-mono truncate block"
                    >
                      {selectedInquiry.email}
                    </a>
                  </div>
                  <div>
                    <span className="text-[10px] text-gray-400 block font-bold">Contact Phone</span>
                    {selectedInquiry.phone ? (
                      <a href={`tel:${selectedInquiry.phone}`} className="text-[#1a4f8b] font-bold hover:underline">
                        📞 {selectedInquiry.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">Not provided</span>
                    )}
                  </div>
                </div>

                {/* Citizen Message Body */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Citizen Statement / Grievance:</h4>
                  <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-xs sm:text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>

                {/* Sector Directorate & Caseworker Assignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Sector Directorate:
                    </label>
                    <select
                      value={assignedOffice}
                      onChange={(e) => setAssignedOffice(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                    >
                      <option value="">-- Cabinet Grievance Committee --</option>
                      {SECTOR_OFFICES.map((off) => (
                        <option key={off.id} value={off.id}>
                          {off.name} ({off.am})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                      Assigned Officer / Desk Lead:
                    </label>
                    <input
                      type="text"
                      value={assignedStaff}
                      onChange={(e) => setAssignedStaff(e.target.value)}
                      placeholder="e.g. Ato Solomon Gizaw (Desk Lead)"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>

                {/* SECTION 1: OFFICIAL PUBLIC CITIZEN RESPONSE */}
                <div className="space-y-3 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider flex items-center gap-1.5">
                      <span>🌐</span> Official Citizen Response (Public on Tracking Portal)
                    </h4>
                    <span className="text-[10px] text-gray-400">Visible to citizen</span>
                  </div>

                  {/* GovTech Resolution Templates */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-gray-500">Insert Standard GovTech Resolution Template:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {RESPONSE_TEMPLATES.map((tpl, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleApplyTemplate(tpl.text)}
                          className="px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-blue-50 hover:text-[#1a4f8b] text-[10px] font-semibold text-gray-700 transition-colors border border-gray-200 cursor-pointer"
                        >
                          + {tpl.title}
                        </button>
                      ))}
                    </div>
                  </div>

                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Type official findings, Kebele appointment instructions, or grievance resolution details visible to the citizen..."
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                {/* SECTION 2: INTERNAL ADMINISTRATIVE NOTES (STRICTLY CONFIDENTIAL) */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
                      <span>🔒</span> Internal Staff Casework Notes (Strictly Confidential)
                    </h4>
                    <span className="text-[10px] text-rose-600 font-bold">NEVER visible to citizen</span>
                  </div>

                  <textarea
                    rows={2}
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    placeholder="Private notes for Woreda administration, background check results, legal counsel feedback, or committee deliberations..."
                    className="w-full px-3.5 py-2 bg-amber-50/50 border border-amber-200 rounded-xl text-xs leading-relaxed focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* SECTION 3: AUDIT & STATUS TIMELINE */}
                {selectedInquiry.statusHistory && selectedInquiry.statusHistory.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                      Case Progression History:
                    </span>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {selectedInquiry.statusHistory.map((item, idx) => (
                        <div key={idx} className="p-2 bg-gray-50 rounded-lg border border-gray-200 text-[11px] flex items-start justify-between">
                          <div>
                            <span className="font-bold text-gray-800 capitalize">{item.status.replace('_', ' ')}</span>
                            {item.changedBy && <span className="text-gray-500"> • by {item.changedBy}</span>}
                            {item.notes && <p className="text-gray-600 text-[10px] mt-0.5">{item.notes}</p>}
                          </div>
                          <span className="text-gray-400 text-[10px] shrink-0 ml-2">
                            {new Date(item.changedAt).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Workflow Buttons */}
                <div className="pt-3 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => updateTicket(selectedInquiry.status)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : '💾 Save Notes & Assignment'}
                  </button>

                  <div className="flex items-center gap-2">
                    {selectedInquiry.status !== 'UNDER_REVIEW' && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => updateTicket('UNDER_REVIEW')}
                        className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        Assign &amp; Review
                      </button>
                    )}

                    {selectedInquiry.status !== 'RESOLVED' && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => updateTicket('RESOLVED')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        ✓ Mark Resolved
                      </button>
                    )}

                    {selectedInquiry.status !== 'REJECTED' && (
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => updateTicket('REJECTED')}
                        className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        ✕ Reject
                      </button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-xs text-gray-400">
                Select a citizen grievance ticket from the roster to review dossier and dispatch response.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
