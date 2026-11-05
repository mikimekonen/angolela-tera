'use client'

import React, { useState, useEffect, useMemo } from 'react'
import type { UserRole, AdminResource } from '@/types'

interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  officeId?: string | null
  designation?: string
  phone?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
  permissions: {
    id: string
    resource: AdminResource
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canPublish: boolean
    officeScopeId?: string | null
  }[]
}

const RESOURCES: { key: AdminResource; label: string }[] = [
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

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-amber-50 text-amber-900 border-amber-300',
  ADMIN: 'bg-blue-50 text-blue-900 border-blue-300',
  OFFICE_EDITOR: 'bg-emerald-50 text-emerald-900 border-emerald-300',
  REVIEWER: 'bg-purple-50 text-purple-900 border-purple-300',
  VIEWER: 'bg-gray-100 text-gray-800 border-gray-300',
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Filtering states
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('ALL')

  // Create Modal State
  const [isCreating, setIsCreating] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createEmail, setCreateEmail] = useState('')
  const [createPassword, setCreatePassword] = useState('')
  const [createRole, setCreateRole] = useState<UserRole>('OFFICE_EDITOR')
  const [createOfficeScope, setCreateOfficeScope] = useState('education')
  const [createDesignation, setCreateDesignation] = useState('')
  const [createPhone, setCreatePhone] = useState('')
  const [createResources, setCreateResources] = useState<Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canPublish: boolean }>>({
    NEWS: { canCreate: true, canEdit: true, canDelete: false, canPublish: false },
    SERVICES: { canCreate: true, canEdit: true, canDelete: false, canPublish: false },
    DOCUMENTS: { canCreate: true, canEdit: true, canDelete: false, canPublish: false },
  })

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState<UserRole>('OFFICE_EDITOR')
  const [editOfficeScope, setEditOfficeScope] = useState('')
  const [editDesignation, setEditDesignation] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editResources, setEditResources] = useState<Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canPublish: boolean }>>({})
  const [savingEdit, setSavingEdit] = useState(false)

  // Reset Password Modal State
  const [pwResetUser, setPwResetUser] = useState<AdminUser | null>(null)
  const [newPassword, setNewPassword] = useState('')
  const [resettingPw, setResettingPw] = useState(false)

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
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to load administrator accounts.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Communication error with users service.' })
    } finally {
      setLoading(false)
    }
  }

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.designation && u.designation.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesRole = roleFilter === 'ALL' || u.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchQuery, roleFilter])

  // Toggle Active/Suspended
  const handleToggleStatus = async (user: AdminUser) => {
    const nextStatus = !user.isActive
    try {
      const res = await fetch('/api/v1/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggleStatus',
          userId: user.id,
          isActive: nextStatus,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, isActive: nextStatus } : u))
        )
        setMsg({
          type: 'success',
          text: `Account for ${user.name} is now ${nextStatus ? 'ACTIVE' : 'SUSPENDED'}.`,
        })
      } else {
        setMsg({ type: 'error', text: data.error || 'Status update failed.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication failure.' })
    }
  }

  // Generate Temporary Password
  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%&*='
    let pass = ''
    for (let i = 0; i < 12; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewPassword(pass)
  }

  // Submit Password Reset
  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pwResetUser || !newPassword.trim()) return

    setResettingPw(true)
    try {
      const res = await fetch('/api/v1/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'resetPassword',
          userId: pwResetUser.id,
          newPassword: newPassword.trim(),
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({
          type: 'success',
          text: `Password for ${pwResetUser.name} (${pwResetUser.email}) reset successfully.`,
        })
        setPwResetUser(null)
        setNewPassword('')
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to reset password.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Error connecting to auth service.' })
    } finally {
      setResettingPw(false)
    }
  }

  // Open Edit User Modal
  const openEditModal = (user: AdminUser) => {
    setEditingUser(user)
    setEditName(user.name)
    setEditRole(user.role)
    setEditOfficeScope(user.officeId || '')
    setEditDesignation(user.designation || '')
    setEditPhone(user.phone || '')

    const resMap: Record<string, { canCreate: boolean; canEdit: boolean; canDelete: boolean; canPublish: boolean }> = {}
    ;(user.permissions || []).forEach((p) => {
      resMap[p.resource] = {
        canCreate: p.canCreate,
        canEdit: p.canEdit,
        canDelete: p.canDelete,
        canPublish: p.canPublish,
      }
    })
    setEditResources(resMap)
  }

  // Submit User Edit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return

    setSavingEdit(true)
    try {
      const permissionArray = Object.entries(editResources).map(([resKey, perms]) => ({
        resource: resKey,
        canView: true,
        canCreate: perms.canCreate,
        canEdit: perms.canEdit,
        canDelete: perms.canDelete,
        canPublish: perms.canPublish,
        officeScopeId: editOfficeScope || null,
      }))

      const res = await fetch('/api/v1/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateUser',
          userId: editingUser.id,
          name: editName.trim(),
          role: editRole,
          officeId: editOfficeScope || null,
          designation: editDesignation.trim(),
          phone: editPhone.trim(),
          permissions: permissionArray,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMsg({ type: 'success', text: `Profile and permissions for ${editName} updated successfully.` })
        setEditingUser(null)
        await fetchUsers()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to update user account.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Error communicating with user registry.' })
    } finally {
      setSavingEdit(false)
    }
  }

  // Create User Submit
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!createName.trim() || !createEmail.trim() || !createPassword.trim()) {
      setMsg({ type: 'error', text: 'Name, email, and initial password are required.' })
      return
    }

    try {
      const permissionArray = Object.entries(createResources).map(([resKey, perms]) => ({
        resource: resKey,
        canView: true,
        canCreate: perms.canCreate,
        canEdit: perms.canEdit,
        canDelete: perms.canDelete,
        canPublish: perms.canPublish,
        officeScopeId: createOfficeScope || null,
      }))

      const res = await fetch('/api/v1/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: createName.trim(),
          email: createEmail.trim(),
          password: createPassword.trim(),
          role: createRole,
          officeId: createRole === 'OFFICE_EDITOR' ? createOfficeScope : null,
          designation: createDesignation.trim() || undefined,
          phone: createPhone.trim() || undefined,
          permissions: permissionArray,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setMsg({ type: 'success', text: `Administrator account for ${createName} created successfully.` })
        setIsCreating(false)
        setCreateName('')
        setCreateEmail('')
        setCreatePassword('')
        setCreateDesignation('')
        setCreatePhone('')
        await fetchUsers()
      } else {
        setMsg({ type: 'error', text: data.error || 'Failed to create user.' })
      }
    } catch {
      setMsg({ type: 'error', text: 'Network communication failure.' })
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Super Admin Control Plane
            </span>
            <span className="text-xs font-semibold text-gray-500">
              Role-Based Access Control (RBAC)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight">
            User Accounts & Security Credentials
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Provision official woreda administrative accounts, assign sector office scopes, configure fine-grained editorial permissions, and suspend compromised accounts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer self-start md:self-auto"
        >
          <span>➕</span>
          <span>Create Administrator</span>
        </button>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Administrators</p>
          <p className="text-2xl font-black text-[#0d2340] mt-1">{users.length}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Super Admins</p>
          <p className="text-2xl font-black text-amber-700 mt-1">
            {users.filter((u) => u.role === 'SUPER_ADMIN').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Office Editors</p>
          <p className="text-2xl font-black text-emerald-700 mt-1">
            {users.filter((u) => u.role === 'OFFICE_EDITOR').length}
          </p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-xs">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Suspended Accounts</p>
          <p className="text-2xl font-black text-rose-700 mt-1">
            {users.filter((u) => !u.isActive).length}
          </p>
        </div>
      </div>

      {/* Status Notification */}
      {msg && (
        <div
          className={`p-4 rounded-xl text-xs font-bold flex items-center justify-between ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <span>{msg.text}</span>
          <button type="button" onClick={() => setMsg(null)} className="opacity-70 hover:opacity-100 text-sm">
            ×
          </button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <span className="absolute left-3 top-2.5 text-gray-400 text-sm">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search administrators by name, email, or designation..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
          >
            <option value="ALL">All Roles</option>
            <option value="SUPER_ADMIN">Super Admin</option>
            <option value="ADMIN">Woreda Admin</option>
            <option value="OFFICE_EDITOR">Office Editor</option>
            <option value="REVIEWER">Reviewer</option>
            <option value="VIEWER">Viewer</option>
          </select>
        </div>
      </div>

      {/* User Accounts Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-gray-500">Loading administrator registry...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-16 text-center text-xs text-gray-500">No administrators match your search query.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase tracking-wider text-[10px] font-bold">
                <tr>
                  <th className="py-3 px-4">Administrator</th>
                  <th className="py-3 px-4">Role & Directorate</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Last Login</th>
                  <th className="py-3 px-4">Permissions</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1a4f8b] to-[#0d2340] flex items-center justify-center text-white text-xs font-black shadow-2xs shrink-0">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-[#0d2340] leading-tight truncate">{user.name}</p>
                          <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                          {user.designation && (
                            <p className="text-[10px] text-gray-400 truncate">{user.designation}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${ROLE_COLORS[user.role] || ROLE_COLORS.VIEWER}`}>
                        {user.role}
                      </span>
                      {user.officeId && (
                        <p className="text-[11px] text-gray-600 mt-1 capitalize font-medium">
                          🏛️ {user.officeId}
                        </p>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(user)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all cursor-pointer ${
                          user.isActive
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title="Click to toggle account state"
                      >
                        <span className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                        <span>{user.isActive ? 'Active' : 'Suspended'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-gray-500">
                      {user.lastLoginAt ? (
                        <div>
                          <p className="font-semibold text-gray-700">
                            {new Date(user.lastLoginAt).toLocaleDateString()}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(user.lastLoginAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Never</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 font-mono text-[11px]">
                        {user.permissions?.length || 0} modules scoped
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-[#1a4f8b] font-bold rounded-lg transition-colors cursor-pointer"
                        title="Edit user information and permissions"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPwResetUser(user)
                          setNewPassword('')
                        }}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold rounded-lg transition-colors cursor-pointer"
                        title="Reset administrator password"
                      >
                        Reset PW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reset Password Modal */}
      {pwResetUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Reset Administrator Password</h3>
                <p className="text-xs text-gray-500">{pwResetUser.name} ({pwResetUser.email})</p>
              </div>
              <button
                type="button"
                onClick={() => setPwResetUser(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordResetSubmit} className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-gray-700">New Temporary Password</label>
                  <button
                    type="button"
                    onClick={generateRandomPassword}
                    className="text-[11px] font-bold text-[#1a4f8b] hover:underline"
                  >
                    🎲 Generate Secure Key
                  </button>
                </div>
                <input
                  type="text"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 font-mono text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  The user will be required to change this credential on their subsequent login.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setPwResetUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={resettingPw}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b] disabled:opacity-50"
                >
                  {resettingPw ? 'Resetting...' : 'Commit Password Change'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Edit Administrator Profile</h3>
                <p className="text-xs text-gray-500 font-mono">{editingUser.email}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    <option value="SUPER_ADMIN">Super Administrator (Full System Access)</option>
                    <option value="ADMIN">Woreda Administrator</option>
                    <option value="OFFICE_EDITOR">Office Editor (Scoped to Directorate)</option>
                    <option value="REVIEWER">Editorial Reviewer</option>
                    <option value="VIEWER">Read-Only Viewer</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Designation / Title</label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    placeholder="e.g., Senior Communications Officer"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official Mobile Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+251 9XX XXX XXX"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {editRole === 'OFFICE_EDITOR' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Directorate Office Scope</label>
                  <select
                    value={editOfficeScope}
                    onChange={(e) => setEditOfficeScope(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    <option value="">-- No Directorate Constraint --</option>
                    {OFFICES.map((o) => (
                      <option key={o.slug} value={o.slug}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Granular Permissions Matrix */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-2">Granular Module Permissions</h4>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-56 overflow-y-auto">
                  {RESOURCES.map((res) => {
                    const isConfigured = Boolean(editResources[res.key])
                    const current = editResources[res.key] || { canCreate: false, canEdit: false, canDelete: false, canPublish: false }
                    return (
                      <div key={res.key} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                          <input
                            type="checkbox"
                            checked={isConfigured}
                            onChange={() => {
                              setEditResources((prev) => {
                                const copy = { ...prev }
                                if (copy[res.key]) {
                                  delete copy[res.key]
                                } else {
                                  copy[res.key] = { canCreate: true, canEdit: true, canDelete: false, canPublish: false }
                                }
                                return copy
                              })
                            }}
                            className="rounded text-[#1a4f8b]"
                          />
                          <span>{res.label}</span>
                        </label>

                        {isConfigured && (
                          <div className="flex items-center gap-3 text-[11px] text-gray-600">
                            {(['canCreate', 'canEdit', 'canDelete', 'canPublish'] as const).map((act) => (
                              <label key={act} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={current[act]}
                                  onChange={() => {
                                    setEditResources((prev) => ({
                                      ...prev,
                                      [res.key]: {
                                        ...prev[res.key],
                                        [act]: !prev[res.key][act],
                                      },
                                    }))
                                  }}
                                  className="rounded text-[#1a4f8b]"
                                />
                                <span className="capitalize">{act.replace('can', '')}</span>
                              </label>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b] disabled:opacity-50"
                >
                  {savingEdit ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-[#0d2340]">Create New Administrator Account</h3>
                <p className="text-xs text-gray-500">Provide official identity and assign security role.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={createName}
                    onChange={(e) => setCreateName(e.target.value)}
                    placeholder="e.g., Almaz Tefera"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official Email Address *</label>
                  <input
                    type="email"
                    required
                    value={createEmail}
                    onChange={(e) => setCreateEmail(e.target.value)}
                    placeholder="name@angolelatera.gov.et"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Initial Password *</label>
                  <input
                    type="password"
                    required
                    value={createPassword}
                    onChange={(e) => setCreatePassword(e.target.value)}
                    placeholder="Minimum 8 characters"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Role *</label>
                  <select
                    value={createRole}
                    onChange={(e) => setCreateRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    <option value="OFFICE_EDITOR">Sector Office Editor</option>
                    <option value="ADMIN">Woreda Administrator</option>
                    <option value="REVIEWER">Editorial Reviewer</option>
                    <option value="SUPER_ADMIN">Super Administrator</option>
                    <option value="VIEWER">Institutional Auditor (Viewer)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={createDesignation}
                    onChange={(e) => setCreateDesignation(e.target.value)}
                    placeholder="e.g., Agricultural Desk Officer"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Official Mobile Phone</label>
                  <input
                    type="text"
                    value={createPhone}
                    onChange={(e) => setCreatePhone(e.target.value)}
                    placeholder="+251 9XX XXX XXX"
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>
              </div>

              {createRole === 'OFFICE_EDITOR' && (
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Assigned Office Scope</label>
                  <select
                    value={createOfficeScope}
                    onChange={(e) => setCreateOfficeScope(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-300 text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    {OFFICES.map((o) => (
                      <option key={o.slug} value={o.slug}>
                        {o.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Granular Module Checkboxes */}
              <div>
                <h4 className="text-xs font-bold text-gray-700 mb-2">Configure Default Permissions</h4>
                <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-48 overflow-y-auto">
                  {RESOURCES.map((res) => {
                    const isChecked = Boolean(createResources[res.key])
                    const current = createResources[res.key] || { canCreate: false, canEdit: false, canDelete: false, canPublish: false }
                    return (
                      <div key={res.key} className="p-3 flex items-center justify-between text-xs hover:bg-gray-50">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-800">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              setCreateResources((prev) => {
                                const copy = { ...prev }
                                if (copy[res.key]) {
                                  delete copy[res.key]
                                } else {
                                  copy[res.key] = { canCreate: true, canEdit: true, canDelete: false, canPublish: false }
                                }
                                return copy
                              })
                            }}
                            className="rounded text-[#1a4f8b]"
                          />
                          <span>{res.label}</span>
                        </label>

                        {isChecked && (
                          <div className="flex items-center gap-3 text-[11px] text-gray-600">
                            {(['canCreate', 'canEdit', 'canDelete', 'canPublish'] as const).map((act) => (
                              <label key={act} className="flex items-center gap-1 cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={current[act]}
                                  onChange={() => {
                                    setCreateResources((prev) => ({
                                      ...prev,
                                      [res.key]: {
                                        ...prev[res.key],
                                        [act]: !prev[res.key][act],
                                      },
                                    }))
                                  }}
                                  className="rounded text-[#1a4f8b]"
                                />
                                <span className="capitalize">{act.replace('can', '')}</span>
                              </label>
                            ))}
                          </div>
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
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-[#1a4f8b] text-white hover:bg-[#133a6b]"
                >
                  Create & Grant Credentials
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
