'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { mockOffices } from '@/data/mockData'

export default function AdminOfficesPage() {
  const [offices] = useState(mockOffices)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredOffices = offices.filter((o) =>
    o.name_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.head_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0d2340]">
            Sector Directorates Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Directory of Woreda executive offices, bureau leadership, and sectoral jurisdictions.
          </p>
        </div>

        <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-[#1a4f8b] text-xs font-bold rounded-lg self-start sm:self-auto">
          {offices.length} Active Directorates
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <input
          type="text"
          placeholder="Search by directorate name, office head, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOffices.map((office) => (
          <div
            key={office.slug}
            className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[11px] font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                  {office.slug}
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Active Operational
                </span>
              </div>

              <h2 className="text-base font-bold text-[#0d2340]">
                {office.name_en}
              </h2>

              <div className="mt-3 space-y-1 text-xs text-gray-600">
                <p>
                  <strong>Head:</strong> {office.head_en} ({office.headTitle_en})
                </p>
                <p>
                  <strong>Contact:</strong> {office.phone} • {office.email}
                </p>
                <p>
                  <strong>Services:</strong> {office.servicesProvided_en?.length || 0} cataloged procedures
                </p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">
                {office.responsibilities_en?.length || 0} Mandated Responsibilities
              </span>
              <Link
                href={`/en/offices/${office.slug}`}
                target="_blank"
                className="text-xs font-bold text-[#1a4f8b] hover:underline"
              >
                Inspect Public Directorate ↗
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
