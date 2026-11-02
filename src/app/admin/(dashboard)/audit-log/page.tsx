'use client'

import React, { useState, useEffect, useCallback } from 'react'

interface AuditLogItem {
  id: string
  userId?: string
  userName?: string
  action: string
  entityType?: string
  entityId?: string
  notes?: string
  ipAddress?: string
  userAgent?: string
  createdAt: string
}

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditLogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filterAction, setFilterAction] = useState('ALL')
  const [filterEntity, setFilterEntity] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedLog, setSelectedLog] = useState<AuditLogItem | null>(null)

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (filterAction !== 'ALL') params.set('action', filterAction)
      if (filterEntity !== 'ALL') params.set('entityType', filterEntity)
      if (searchQuery.trim()) params.set('q', searchQuery.trim())
      params.set('page', page.toString())
      params.set('limit', '25')

      const res = await fetch(`/api/v1/audit-log?${params.toString()}`)
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setLogs(data.data)
        setTotal(data.total || 0)
        setTotalPages(data.totalPages || 1)
      } else {
        setError(data.error || 'Failed to retrieve live audit records.')
      }
    } catch {
      setError('Communication error with audit server.')
    } finally {
      setLoading(false)
    }
  }, [filterAction, filterEntity, searchQuery, page])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const getActionColor = (action: string) => {
    switch (action?.toUpperCase()) {
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
      case 'SYSTEM_INITIALIZATION':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const formatDateTime = (iso: string) => {
    try {
      const d = new Date(iso)
      return d.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    } catch {
      return iso
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🛡️</span>
            <h1 className="text-2xl font-extrabold text-[#0d2340] tracking-tight">
              Institutional Security & Audit Trail
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Immutable, real-time tracking of all administrative mutations, logins, and publication actions.
          </p>
        </div>

        <button
          onClick={() => fetchLogs()}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 transition-colors shadow-2xs cursor-pointer"
        >
          <span className={loading ? 'animate-spin' : ''}>🔄</span>
          <span>Refresh Live Logs</span>
        </button>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError('')} className="font-bold text-sm ml-2">✕</button>
        </div>
      )}

      {/* Filters and Search Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search notes, users, entity IDs, or IP addresses..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setPage(1)
            }}
            className="w-full px-3.5 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Action:</label>
            <select
              value={filterAction}
              onChange={(e) => {
                setFilterAction(e.target.value)
                setPage(1)
              }}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">All Actions</option>
              <option value="LOGIN">LOGIN</option>
              <option value="CREATE">CREATE</option>
              <option value="UPDATE">UPDATE</option>
              <option value="DELETE">DELETE</option>
              <option value="PUBLISH">PUBLISH</option>
              <option value="UPLOAD_MEDIA">UPLOAD_MEDIA</option>
              <option value="SYSTEM_INITIALIZATION">INITIALIZATION</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Entity:</label>
            <select
              value={filterEntity}
              onChange={(e) => {
                setFilterEntity(e.target.value)
                setPage(1)
              }}
              className="px-2.5 py-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 focus:bg-white focus:outline-hidden"
            >
              <option value="ALL">All Entities</option>
              <option value="News">News</option>
              <option value="Office">Office</option>
              <option value="Leadership">Leadership</option>
              <option value="Slider">Slider</option>
              <option value="Tender">Tender</option>
              <option value="Kebele">Kebele</option>
              <option value="Company">Company</option>
              <option value="Partner">Partner</option>
              <option value="Investment">Investment</option>
              <option value="Document">Document</option>
              <option value="Project">Project</option>
              <option value="Tourism">Tourism</option>
              <option value="CitizenInquiry">CitizenInquiry</option>
              <option value="Media">Media</option>
              <option value="User">User</option>
            </select>
          </div>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <span className="text-xs font-bold text-gray-700">
            Total Captured Events: <span className="font-mono text-[#1a4f8b]">{total}</span>
          </span>
          <span className="text-xs text-gray-400">
            Page {page} of {totalPages}
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400 text-xs">
            <div className="inline-block animate-spin text-xl mb-2">🔄</div>
            <div>Loading live audit events...</div>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No audit records found matching current criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider font-bold">
                <tr>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity Type</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">IP Address</th>
                  <th className="py-3 px-4">Action Summary</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-sans">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {formatDateTime(log.createdAt)}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap font-medium text-[#0d2340]">
                      {log.entityType || 'General'}
                      {log.entityId ? (
                        <span className="text-[10px] text-gray-400 font-mono ml-1">
                          #{log.entityId}
                        </span>
                      ) : null}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="font-bold text-[#0d2340] block">
                        {log.userName || log.userId || 'Administrator'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-gray-500 whitespace-nowrap">
                      {log.ipAddress || '127.0.0.1'}
                    </td>
                    <td className="py-3 px-4 text-gray-600 max-w-sm truncate">
                      {log.notes || '—'}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="px-2.5 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-[#1a4f8b] font-bold rounded border border-blue-200 transition-colors cursor-pointer"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              ← Previous
            </button>
            <span className="text-xs text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 disabled:opacity-40 transition-colors cursor-pointer"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Inspect Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl w-full max-w-xl overflow-hidden animate-fadeIn">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/60">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold border ${getActionColor(
                    selectedLog.action
                  )}`}
                >
                  {selectedLog.action}
                </span>
                <h3 className="text-sm font-bold text-[#0d2340]">Audit Event Inspection</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3.5 rounded-xl border border-gray-200">
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Event ID</span>
                  <span className="font-mono text-gray-800">{selectedLog.id}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Timestamp</span>
                  <span className="font-mono text-gray-800">{formatDateTime(selectedLog.createdAt)}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Actor / User</span>
                  <span className="font-bold text-[#0d2340]">{selectedLog.userName || selectedLog.userId || 'System'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">IP Address</span>
                  <span className="font-mono text-gray-800">{selectedLog.ipAddress || '127.0.0.1'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Entity Type</span>
                  <span className="font-bold text-gray-800">{selectedLog.entityType || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px] uppercase font-bold">Entity ID / Slug</span>
                  <span className="font-mono text-gray-800">{selectedLog.entityId || 'N/A'}</span>
                </div>
              </div>

              <div>
                <span className="text-gray-500 font-bold block mb-1">Audit Notes & Narrative</span>
                <p className="p-3 bg-blue-50/50 border border-blue-100 rounded-lg text-gray-800 font-sans leading-relaxed">
                  {selectedLog.notes || 'No extended notes provided for this action.'}
                </p>
              </div>

              {selectedLog.userAgent && (
                <div>
                  <span className="text-gray-500 font-bold block mb-1">Client User-Agent</span>
                  <p className="p-2.5 bg-gray-50 border border-gray-200 rounded font-mono text-[11px] text-gray-600 break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs rounded-lg transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
