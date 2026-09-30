'use client'

import React, { useState } from 'react'

const MOCK_AUDIT_LOGS = [
  {
    id: 'log_01',
    timestamp: '2026-09-30 09:44:12',
    action: 'LOGIN',
    entityType: 'User',
    entityId: 'usr_superadmin_01',
    actor: 'Woreda Head Administrator',
    role: 'SUPER_ADMIN',
    ipAddress: '127.0.0.1',
    notes: 'User logged into administration console as SUPER_ADMIN',
  },
  {
    id: 'log_02',
    timestamp: '2026-09-30 08:30:00',
    action: 'CREATE',
    entityType: 'ContactSubmission',
    entityId: 'AGT-2026-4891',
    actor: 'Public Citizen Gateway',
    role: 'CITIZEN',
    ipAddress: '197.156.104.22',
    notes: 'Citizen grievance submitted: Chacha Kebele 02 Clean Potable Water Supply Pipeline Disruption',
  },
  {
    id: 'log_03',
    timestamp: '2026-09-29 17:15:44',
    action: 'PUBLISH',
    entityType: 'News',
    entityId: 'wheat-distribution',
    actor: 'Sector Bureau Communications Officer',
    role: 'OFFICE_EDITOR',
    ipAddress: '10.146.128.7',
    notes: 'Published trilingual news release for certified highland seed distribution',
  },
  {
    id: 'log_04',
    timestamp: '2026-09-29 14:02:18',
    action: 'UPDATE',
    entityType: 'Service',
    entityId: 'rural-land-holding',
    actor: 'Land Administration Directorate',
    role: 'OFFICE_EDITOR',
    ipAddress: '10.146.128.12',
    notes: 'Updated procedural requirements and biometric parcel verification steps',
  },
  {
    id: 'log_05',
    timestamp: '2026-09-29 11:10:05',
    action: 'PUBLISH',
    entityType: 'Project',
    entityId: 'chacha-water-supply',
    actor: 'Woreda Cabinet Secretariat',
    role: 'ADMIN',
    ipAddress: '10.146.128.5',
    notes: 'Commissioned status updated to 82% completion milestone',
  },
]

export default function AdminAuditLogPage() {
  const [logs] = useState(MOCK_AUDIT_LOGS)
  const [filterAction, setFilterAction] = useState('ALL')

  const filteredLogs = logs.filter(
    (l) => filterAction === 'ALL' || l.action === filterAction
  )

  const getActionColor = (action: string) => {
    switch (action) {
      case 'LOGIN':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'PUBLISH':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'CREATE':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'UPDATE':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'DELETE':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0d2340]">
            Institutional Security & Audit Trail
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Immutable log of all user logins, administrative modifications, publications, and security events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Filter Action:
          </label>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700"
          >
            <option value="ALL">All Event Types</option>
            <option value="LOGIN">LOGIN</option>
            <option value="PUBLISH">PUBLISH</option>
            <option value="CREATE">CREATE</option>
            <option value="UPDATE">UPDATE</option>
          </select>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Entity</th>
                <th className="py-3.5 px-4">Actor & Role</th>
                <th className="py-3.5 px-4">IP Address</th>
                <th className="py-3.5 px-4">Audit Details & Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getActionColor(
                        log.action
                      )}`}
                    >
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap font-medium text-[#0d2340]">
                    {log.entityType} ({log.entityId})
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="font-bold text-[#0d2340] block">
                      {log.actor}
                    </span>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {log.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                    {log.ipAddress}
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 max-w-sm">
                    {log.notes}
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
