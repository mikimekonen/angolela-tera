'use client'

import React, { useState, useEffect } from 'react'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
  officeId?: string | null
  isActive: boolean
  createdAt: string
  permissions: {
    id: string
    resource: string
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canPublish: boolean
    officeScopeId?: string | null
  }[]
}

const RESOURCES = [
  { key: 'NEWS', label: 'News & Press Releases' },
  { key: 'OFFICES', label: 'Sector Directorates' },
  { key: 'SERVICES', label: 'Citizen Services' },
  { key: 'DOCUMENTS', label: 'Document Library' },
  { key: 'PROJECTS', label: 'Development Projects' },
  { key: 'COMPANIES', label: 'Private Enterprises' },
  { key: 'PARTNERS', label: 'Partner Organizations' },
  { key: 'INVESTMENTS', label: 'Investment Corridor' },
  { key: 'KEBELES', label: 'Kebeles & Towns' },
  { key: 'HOMEPAGE', label: 'Homepage Sections' },
  { key: 'SETTINGS', label: 'Site System Settings' },
]

const OFFICES = [
  { slug: 'agriculture', name: 'Agriculture & Rural Development' },
  { slug: 'education', name: 'Education & Capacity Building' },
  { slug: 'health', name: 'Health Bureau & Medical Services' },
  { slug: 'finance', name: 'Finance & Economic Development' },
  { slug: 'trade-investment', name: 'Trade, Industry & Investment' },
  { slug: 'water-energy', name: 'Water, Irrigation & Energy' },
  { slug: 'land-administration', name: 'Land Administration & Use' },
  { slug: 'administration', name: 'General Woreda Administration' },
]

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Creation form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'ADMIN' | 'OFFICE_EDITOR' | 'REVIEWER' | 'VIEWER'>('OFFICE_EDITOR')
  const [officeScope, setOfficeScope] = useState<string>('education')
  const [selectedResources, setSelectedResources] = useState<Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canPublish: boolean }>>({
    NEWS: { canCreate: true, canEdit: true, canDelete: false, canPublish: false },
    SERVICES: { canCreate: true, canEdit: true, canDelete: false, canPublish: false },
    DOCUMENTS: { canCreate: true, canEdit: true, canDelete: false, canPublish: false },
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/users')
      const data = await res.json()
      if (data.success && Array.isArray(data.data)) {
        setUsers(data.data)
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to load administrator accounts.' })
    } finally {
      setLoading(false)
    }
  }

  const handleToggleResource = (key: string) => {
    setSelectedResources((prev) => {
      const copy = { ...prev }
      if (copy[key]) {
        delete copy[key]
      } else {
        copy[key] = { canCreate: true, canEdit: true, canDelete: false, canPublish: false }
      }
      return copy
    })
  }

  const handleTogglePermAction = (resourceKey: string, action: 'canCreate' | 'canEdit' | 'canDelete' | 'canPublish') => {
    setSelectedResources((prev) => {
      const current = prev[resourceKey] || { canCreate: false, canEdit: false, canDelete: false, canPublish: false }
      return {
        ...prev,
        [resourceKey]: {
          ...current,
          [action]: !current[action],
        },
      }
    })
  }

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !password.trim()) {
      setMsg({ type: 'error', text: 'All basic fields are required.' })
      return
    }

    try {
      const permissionArray = Object.entries(selectedResources).map(([resKey, perms]) => ({
        resource: resKey,
        canView: true,
        canCreate: perms.canCreate,
        canEdit: perms.canEdit,
        canDelete: perms.canDelete,
        canPublish: perms.canPublish,
        officeScopeId: role === 'OFFICE_EDITOR' ? officeScope : null,
      }))

      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          officeId: role === 'OFFICE_EDITOR' ? officeScope : null,
          permissions: permissionArray,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMsg({
          type: 'success',
          text: `Department Administrator [${email}] created with granular scope successfully.`,
        })
        setIsCreating(false)
        setName('')
        setEmail('')
        setPassword('')
        fetchUsers()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create user.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network request error creating administrator.' })
    }
  }

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      const res = await fetch('/api/v1/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggleStatus',
          userId: user.id,
          isActive: !user.isActive,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isActive: !user.isActive } : u))
        )
        setMsg({
          type: 'success',
          text: `User ${user.email} is now ${!user.isActive ? 'Active' : 'Deactivated'}.`,
        })
      }
    } catch {
      setMsg({ type: 'error', text: 'Failed to update user status.' })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
              Super Admin Authority
            </span>
          </div>
          <h1 className="text-2xl font-black text-[#0d2340]">
            Administrator Access & Granular Permissions (RBAC)
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Provision departmental administrators, toggle access switches ON/OFF per sector, and enforce office scoping.
          </p>
        </div>

        <button
          onClick={() => setIsCreating(true)}
          className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
        >
          + Provision New Administrator
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

      {/* Creation Modal / Form */}
      {isCreating && (
        <div className="bg-white border-2 border-[#1a4f8b] rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#0d2340]">
                Provision New Departmental Administrator
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Assign a specific sector desk and independently switch permissions ON or OFF without developer intervention.
              </p>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-gray-400 hover:text-gray-700 text-sm font-bold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Full Official Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ato Daniel Kebede"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Government Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. daniel.k@angolela-tera.gov.et"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Initial Password *
                </label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  System Role Tier *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                >
                  <option value="OFFICE_EDITOR">Office Editor (Scoped to a single Sector Bureau)</option>
                  <option value="ADMIN">Full Content Admin (Across all bureaus)</option>
                  <option value="REVIEWER">Reviewer (Can approve/review, cannot publish directly)</option>
                  <option value="VIEWER">Read-Only Viewer</option>
                </select>
              </div>

              {role === 'OFFICE_EDITOR' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Jurisdiction Office Scope * (Where can they edit?)
                  </label>
                  <select
                    value={officeScope}
                    onChange={(e) => setOfficeScope(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    {OFFICES.map((off) => (
                      <option key={off.slug} value={off.slug}>
                        {off.name}
                      </option>
                    ))}
                  </select>
                  <p className="text-[11px] text-gray-500 mt-1">
                    This admin will be restricted to managing content for this office only.
                  </p>
                </div>
              )}
            </div>

            {/* Granular Permission Switches */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                Granular Resource Permissions (ON / OFF Switches)
              </label>
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 overflow-hidden">
                {RESOURCES.map((res) => {
                  const isEnabled = Boolean(selectedResources[res.key])
                  const perms = selectedResources[res.key] || { canCreate: false, canEdit: false, canDelete: false, canPublish: false }

                  return (
                    <div key={res.key} className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          id={`chk-${res.key}`}
                          checked={isEnabled}
                          onChange={() => handleToggleResource(res.key)}
                          className="rounded text-[#1a4f8b] focus:ring-[#1a4f8b]"
                        />
                        <label htmlFor={`chk-${res.key}`} className="text-xs font-bold text-[#0d2340] cursor-pointer">
                          {res.label}
                        </label>
                      </div>

                      {isEnabled ? (
                        <div className="flex flex-wrap items-center gap-2 pl-7 sm:pl-0">
                          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            <input
                              type="checkbox"
                              checked={perms.canCreate}
                              onChange={() => handleTogglePermAction(res.key, 'canCreate')}
                              className="rounded text-[#1a4f8b]"
                            />
                            <span>Create</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            <input
                              type="checkbox"
                              checked={perms.canEdit}
                              onChange={() => handleTogglePermAction(res.key, 'canEdit')}
                              className="rounded text-[#1a4f8b]"
                            />
                            <span>Edit</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            <input
                              type="checkbox"
                              checked={perms.canDelete}
                              onChange={() => handleTogglePermAction(res.key, 'canDelete')}
                              className="rounded text-rose-600"
                            />
                            <span>Delete</span>
                          </label>
                          <label className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                            <input
                              type="checkbox"
                              checked={perms.canPublish}
                              onChange={() => handleTogglePermAction(res.key, 'canPublish')}
                              className="rounded text-emerald-600"
                            />
                            <span>Publish</span>
                          </label>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-400 italic pl-7 sm:pl-0">
                          Access OFF (Denied)
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg shadow-2xs"
              >
                Save & Provision Account
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      {loading ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
          Loading authorized administrators...
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs divide-y divide-gray-200">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Admin Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role Tier</th>
                <th className="py-3 px-4">Office Scope</th>
                <th className="py-3 px-4">Active Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/50">
                  <td className="py-3.5 px-4 font-bold text-[#0d2340]">
                    {user.name}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-gray-600">
                    {user.email}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        user.role === 'SUPER_ADMIN'
                          ? 'bg-amber-100 text-amber-800'
                          : user.role === 'ADMIN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {user.officeId ? (
                      <span className="font-mono text-xs text-[#1a4f8b] bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {user.officeId}
                      </span>
                    ) : (
                      <span className="text-gray-400">Global (All Sectors)</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        user.isActive
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {user.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {user.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleToggleStatus(user)}
                        className={`px-2.5 py-1 text-xs font-semibold rounded border ${
                          user.isActive
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {user.isActive ? 'Disable Admin' : 'Activate Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
