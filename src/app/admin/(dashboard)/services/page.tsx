'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { mockServices } from '@/data/mockData'

export default function AdminServicesPage() {
  const [services] = useState(mockServices)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredServices = services.filter((s) =>
    s.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.category_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.officeName_en.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0d2340]">
            Citizen Services Catalog Management
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Service standards, procedural steps, required documentation, and processing timelines.
          </p>
        </div>

        <span className="px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-lg self-start sm:self-auto">
          {services.length} Cataloged Services
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
        <input
          type="text"
          placeholder="Filter services by title, category, or issuing bureau..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
        />
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Service Name</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Issuing Office</th>
                <th className="py-3.5 px-4">Timeline</th>
                <th className="py-3.5 px-4">Statutory Fee</th>
                <th className="py-3.5 px-4 text-right">Public Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {filteredServices.map((srv) => (
                <tr key={srv.slug} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#0d2340]">
                    {srv.title_en}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-[#1a4f8b] border border-blue-100">
                      {srv.category_en}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap text-gray-600">
                    🏛️ {srv.officeName_en}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-gray-800">
                    ⏱️ {srv.processingTime_en}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-mono text-gray-600">
                    {srv.cost_en}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/en/services/${srv.slug}`}
                      target="_blank"
                      className="text-[#1a4f8b] hover:underline font-bold text-xs"
                    >
                      View Guide ↗
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
