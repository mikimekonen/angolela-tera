'use client'

import React, { useState } from 'react'

interface Inquiry {
  id: string
  trackingNumber: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED'
  submittedAt: string
}

const INITIAL_INQUIRIES: Inquiry[] = [
  {
    id: 'inq_1',
    trackingNumber: 'AGT-2026-4891',
    name: 'Abebe Tadesse Worku',
    email: 'abebe.t@gmail.com',
    phone: '+251 91 123 4567',
    subject: 'Chacha Kebele 02 Clean Potable Water Supply Pipeline Disruption',
    message: 'The distribution main line in Kebele 02 near the primary school has had intermittent pressure for three days. Requesting municipal water desk inspection.',
    status: 'UNDER_REVIEW',
    submittedAt: 'Today at 08:30 AM',
  },
  {
    id: 'inq_2',
    trackingNumber: 'AGT-2026-4882',
    name: 'Marta Hailu Desta',
    email: 'marta.h@yahoo.com',
    phone: '+251 92 345 6789',
    subject: 'Farmer Cooperative Fertiliser Voucher Allocation Schedule',
    message: 'Inquiring when the second tranche of highland DAP/Urea vouchers will be distributed at the Angolela cooperative warehouse.',
    status: 'PENDING',
    submittedAt: 'Yesterday at 04:15 PM',
  },
  {
    id: 'inq_3',
    trackingNumber: 'AGT-2026-4760',
    name: 'Getachew Bekele',
    email: 'g.bekele@outlook.com',
    phone: '+251 94 567 8901',
    subject: 'Commercial Trade Competence Verification Application',
    message: 'Submitted renewal documentation for dairy processing premises. Inquiring regarding site inspection verification timeline.',
    status: 'RESOLVED',
    submittedAt: '2 days ago',
  },
]

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>(INITIAL_INQUIRIES)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)

  const updateStatus = (id: string, newStatus: Inquiry['status']) => {
    setInquiries((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    )
    if (selectedInquiry?.id === id) {
      setSelectedInquiry((prev) => prev ? { ...prev, status: newStatus } : null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0d2340]">
            Citizen Grievances & Inquiries Desk
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Tracking public feedback, municipal service inquiries, and official woreda grievance resolutions.
          </p>
        </div>

        <div className="flex gap-2">
          <span className="px-3 py-1 bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold rounded-lg">
            {inquiries.length} Active Records
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table / List */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Citizen Submissions Log
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {inquiries.map((inq) => (
              <div
                key={inq.id}
                onClick={() => setSelectedInquiry(inq)}
                className={`p-4 hover:bg-blue-50/50 cursor-pointer transition-colors ${
                  selectedInquiry?.id === inq.id ? 'bg-blue-50/80 border-l-4 border-l-[#1a4f8b]' : ''
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-mono font-bold text-[#1a4f8b] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                    {inq.trackingNumber}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      inq.status === 'RESOLVED'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : inq.status === 'UNDER_REVIEW'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-purple-50 text-purple-700 border border-purple-200'
                    }`}
                  >
                    {inq.status.replace('_', ' ')}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-[#0d2340]">
                  {inq.subject}
                </h3>

                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                  From: {inq.name} ({inq.email})
                </p>

                <div className="text-[10px] text-gray-400 mt-2">
                  Received: {inq.submittedAt}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Details Pane */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs h-fit space-y-4">
          {selectedInquiry ? (
            <div>
              <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
                <span className="text-xs font-mono font-bold text-[#1a4f8b]">
                  {selectedInquiry.trackingNumber}
                </span>
                <span className="text-xs text-gray-400">
                  {selectedInquiry.submittedAt}
                </span>
              </div>

              <h3 className="text-sm font-bold text-[#0d2340] mb-3">
                {selectedInquiry.subject}
              </h3>

              <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-700 leading-relaxed mb-4 border border-gray-100">
                {selectedInquiry.message}
              </div>

              <div className="space-y-1.5 text-xs text-gray-600 mb-6">
                <p><strong>Citizen:</strong> {selectedInquiry.name}</p>
                <p><strong>Email:</strong> {selectedInquiry.email}</p>
                <p><strong>Phone:</strong> {selectedInquiry.phone}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Update Official Status
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedInquiry.id, 'PENDING')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 cursor-pointer"
                  >
                    Pending
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedInquiry.id, 'UNDER_REVIEW')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 cursor-pointer"
                  >
                    Under Review
                  </button>
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedInquiry.id, 'RESOLVED')}
                    className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 cursor-pointer"
                  >
                    Resolved
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400 text-xs">
              Select a citizen inquiry from the list to review detailed grievance submissions and update resolution status.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
