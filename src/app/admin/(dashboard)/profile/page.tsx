'use client'

import React, { useState, useEffect } from 'react'

interface UserProfile {
  id: string
  name: string
  email: string
  role: string
  officeId?: string | null
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
  phone?: string
  designation?: string
  avatarUrl?: string
  office?: {
    id: string
    name_en: string
    name_am?: string
  } | null
  permissions?: Array<{
    id: string
    resource: string
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canPublish: boolean
    officeScopeId?: string | null
  }>
  recentLogs?: Array<{
    id: string
    action: string
    entityType: string
    entityId: string
    notes: string
    createdAt: string
  }>
}

const ROLE_BADGES: Record<string, { label: string; color: string; desc: string }> = {
  SUPER_ADMIN: {
    label: 'Super Administrator',
    color: 'bg-amber-100 text-amber-900 border-amber-300',
    desc: 'Unrestricted system-wide authority across all sector offices, user permissions, and configuration.',
  },
  ADMIN: {
    label: 'Woreda Administrator',
    color: 'bg-blue-100 text-blue-900 border-blue-300',
    desc: 'Full administrative access across all public content, services, projects, and tenders.',
  },
  OFFICE_EDITOR: {
    label: 'Sector Office Editor',
    color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    desc: 'Authorized to draft and maintain records scoped strictly to their assigned directorate office.',
  },
  REVIEWER: {
    label: 'Editorial Reviewer',
    color: 'bg-purple-100 text-purple-900 border-purple-300',
    desc: 'Responsible for reviewing, verifying, and certifying submitted civic content prior to publishing.',
  },
  VIEWER: {
    label: 'Institutional Auditor / Viewer',
    color: 'bg-gray-100 text-gray-800 border-gray-300',
    desc: 'Read-only administrative inspection access for monitoring and records review.',
  },
}

export default function AdminProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'permissions' | 'activity'>('profile')
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Profile Form State
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [designation, setDesignation] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/v1/auth/profile')
      const data = await res.json()
      if (data.success && data.profile) {
        setProfile(data.profile)
        setName(data.profile.name || '')
        setPhone(data.profile.phone || '')
        setDesignation(data.profile.designation || '')
        setAvatarUrl(data.profile.avatarUrl || '')
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Failed to retrieve profile credentials from server.' })
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileSaving(true)
    setProfileMsg(null)

    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, designation, avatarUrl }),
      })
      const data = await res.json()

      if (data.success) {
        setProfileMsg({ type: 'success', text: 'Administrator profile successfully updated.' })
        if (profile) {
          setProfile({ ...profile, name, phone, designation, avatarUrl })
        }
      } else {
        setProfileMsg({ type: 'error', text: data.error || 'Failed to update profile details.' })
      }
    } catch {
      setProfileMsg({ type: 'error', text: 'Network communication error. Please try again.' })
    } finally {
      setProfileSaving(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordSaving(true)
    setPasswordMsg(null)

    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: 'error', text: 'New password and confirmation do not match.' })
      setPasswordSaving(false)
      return
    }

    try {
      const res = await fetch('/api/v1/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const data = await res.json()

      if (data.success) {
        setPasswordMsg({ type: 'success', text: data.message || 'Password successfully changed.' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setPasswordMsg({ type: 'error', text: data.error || 'Failed to change password.' })
      }
    } catch {
      setPasswordMsg({ type: 'error', text: 'Network communication error. Please try again.' })
    } finally {
      setPasswordSaving(false)
    }
  }

  // Password strength calculation
  const getPasswordStrength = (pw: string) => {
    let score = 0
    if (pw.length >= 8) score += 25
    if (/[A-Z]/.test(pw)) score += 25
    if (/[a-z]/.test(pw)) score += 25
    if (/[0-9]/.test(pw)) score += 15
    if (/[^A-Za-z0-9]/.test(pw)) score += 10
    return Math.min(score, 100)
  }

  const pwStrength = getPasswordStrength(newPassword)
  const getStrengthLabel = (s: number) => {
    if (s <= 25) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-600' }
    if (s <= 50) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-600' }
    if (s <= 75) return { label: 'Good', color: 'bg-blue-500', text: 'text-blue-600' }
    return { label: 'Strong (GovTech Standard)', color: 'bg-emerald-500', text: 'text-emerald-600' }
  }
  const strengthInfo = getStrengthLabel(pwStrength)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-9 h-9 border-3 border-[#1a4f8b] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs font-semibold text-gray-500">Loading administrator account credentials...</p>
        </div>
      </div>
    )
  }

  const roleInfo = ROLE_BADGES[profile?.role || 'VIEWER'] || ROLE_BADGES.VIEWER

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header Profile Identity Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-32 bg-gradient-to-bl from-[#1a4f8b]/10 to-transparent pointer-events-none rounded-tr-2xl" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a4f8b] to-[#0d2340] flex items-center justify-center text-white text-xl font-black shadow-md border-2 border-white shrink-0 overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={profile?.name} className="w-full h-full object-cover" />
              ) : (
                profile?.name
                  .split(' ')
                  .slice(0, 2)
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-[#0d2340]">{profile?.name}</h1>
                <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${roleInfo.color}`}>
                  {roleInfo.label}
                </span>
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Account
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">{profile?.email}</p>
              {profile?.office && (
                <p className="text-xs font-semibold text-[#1a4f8b] mt-0.5 flex items-center gap-1.5">
                  <span>🏛️</span> Assigned Directorate: {profile.office.name_en}
                </p>
              )}
            </div>
          </div>

          <div className="flex sm:flex-col items-end gap-1.5 text-right w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
            <span className="text-[11px] text-gray-400">Account ID:</span>
            <code className="text-[11px] bg-gray-50 px-2 py-1 rounded border border-gray-200 font-mono text-gray-700">
              {profile?.id}
            </code>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-gray-100 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'profile'
                ? 'bg-[#1a4f8b] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            👤 Profile Details
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'password'
                ? 'bg-[#1a4f8b] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🔐 Password & Credentials
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'permissions'
                ? 'bg-[#1a4f8b] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            🛡️ Role & Scopes
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              activeTab === 'activity'
                ? 'bg-[#1a4f8b] text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            📜 Activity History
          </button>
        </div>
      </div>

      {/* TAB 1: PROFILE DETAILS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-base font-bold text-[#0d2340]">Official Profile Information</h2>
            <p className="text-xs text-gray-500 mt-1">
              Maintain your official administrative credentials and contact details recorded for civic correspondence.
            </p>

            {profileMsg && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  profileMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <span>{profileMsg.type === 'success' ? '✅' : '⚠️'}</span>
                <span>{profileMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Full Administrator Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Ato Daniel Kebede"
                  className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/20 focus:border-[#1a4f8b] font-medium text-gray-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Official Email (System Login)
                  </label>
                  <input
                    type="email"
                    value={profile?.email || ''}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed font-mono"
                  />
                  <p className="text-[10px] text-gray-400 mt-1">
                    Email is locked to primary authentication identity.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    Official Mobile / Phone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+251 91 234 5678"
                    className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/20 focus:border-[#1a4f8b] text-gray-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Job Designation / Government Title
                </label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Chief ICT Systems Administrator & Communications Officer"
                  className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/20 focus:border-[#1a4f8b] text-gray-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Avatar Photo URL (Optional)
                </label>
                <input
                  type="text"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://... or /uploads/avatars/user.jpg"
                  className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/20 focus:border-[#1a4f8b] text-gray-800"
                />
                <p className="text-[10px] text-gray-400 mt-1">
                  Leave empty to automatically use your capitalized initials.
                </p>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={profileSaving}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#1a4f8b] to-[#0d2340] text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md shadow-blue-900/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {profileSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving Updates...
                    </>
                  ) : (
                    'Save Profile Updates'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: PASSWORD & CREDENTIALS */}
      {activeTab === 'password' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <div className="max-w-2xl">
            <h2 className="text-base font-bold text-[#0d2340]">Update Account Password</h2>
            <p className="text-xs text-gray-500 mt-1">
              Follow Ethiopian GovTech cybersecurity policies. Choose a strong, unique password not shared across other systems.
            </p>

            {passwordMsg && (
              <div
                className={`mt-4 p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                  passwordMsg.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}
              >
                <span>{passwordMsg.type === 'success' ? '✅' : '⚠️'}</span>
                <span>{passwordMsg.text}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    placeholder="Enter your existing account password"
                    className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/20 focus:border-[#1a4f8b] text-gray-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showCurrent ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Enter new strong password"
                    className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/20 focus:border-[#1a4f8b] text-gray-800 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
                  >
                    {showNew ? 'Hide' : 'Show'}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {newPassword && (
                  <div className="mt-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-gray-500">Strength:</span>
                      <span className={`font-bold ${strengthInfo.text}`}>{strengthInfo.label}</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strengthInfo.color} transition-all duration-300`}
                        style={{ width: `${pwStrength}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Re-enter new password to confirm"
                  className="w-full px-4 py-2.5 bg-gray-50/70 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]/20 focus:border-[#1a4f8b] text-gray-800"
                />
              </div>

              {/* GovTech Policy Checklist */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                  Security Standard Requirements:
                </p>
                <ul className="text-xs space-y-1">
                  <li className={`flex items-center gap-2 ${newPassword.length >= 8 ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                    <span>{newPassword.length >= 8 ? '✓' : '○'}</span> Minimum 8 characters in length
                  </li>
                  <li className={`flex items-center gap-2 ${/[A-Z]/.test(newPassword) ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                    <span>{/[A-Z]/.test(newPassword) ? '✓' : '○'}</span> At least one uppercase letter (A-Z)
                  </li>
                  <li className={`flex items-center gap-2 ${/[a-z]/.test(newPassword) ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                    <span>{/[a-z]/.test(newPassword) ? '✓' : '○'}</span> At least one lowercase letter (a-z)
                  </li>
                  <li className={`flex items-center gap-2 ${/[0-9]/.test(newPassword) ? 'text-emerald-700 font-bold' : 'text-gray-500'}`}>
                    <span>{/[0-9]/.test(newPassword) ? '✓' : '○'}</span> At least one numerical digit (0-9)
                  </li>
                </ul>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={passwordSaving || pwStrength < 75}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-xl text-xs font-bold hover:opacity-95 shadow-md shadow-emerald-900/20 disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {passwordSaving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Updating Password...
                    </>
                  ) : (
                    'Confirm & Update Password'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 3: ROLE & SCOPES */}
      {activeTab === 'permissions' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
            <h2 className="text-base font-bold text-[#0d2340]">Institutional Role Assignment</h2>
            <p className="text-xs text-gray-500 mt-1">{roleInfo.desc}</p>

            <div className="mt-6 p-4 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-gray-800">Role Classification:</span>
                  <p className="text-sm font-bold text-[#1a4f8b] mt-0.5">{roleInfo.label}</p>
                </div>
                {profile?.role === 'SUPER_ADMIN' && (
                  <span className="px-3 py-1 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm">
                    Full Root Access
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Scoped Resource Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-sm font-bold text-[#0d2340]">Effective Granular Resource Scopes</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Matrix of permissions granted to your account across government CMS modules.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-6">Resource Module</th>
                    <th className="py-3 px-4 text-center">View</th>
                    <th className="py-3 px-4 text-center">Create</th>
                    <th className="py-3 px-4 text-center">Edit</th>
                    <th className="py-3 px-4 text-center">Delete</th>
                    <th className="py-3 px-4 text-center">Publish</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {[
                    'NEWS',
                    'OFFICES',
                    'SERVICES',
                    'DOCUMENTS',
                    'PROJECTS',
                    'COMPANIES',
                    'PARTNERS',
                    'INVESTMENTS',
                    'KEBELES',
                    'TENDERS',
                    'USERS',
                    'SETTINGS',
                  ].map((res) => {
                    const isSuper = profile?.role === 'SUPER_ADMIN'
                    const p = profile?.permissions?.find((perm) => perm.resource === res)
                    const canView = isSuper || (p ? p.canView : true)
                    const canCreate = isSuper || (p ? p.canCreate : false)
                    const canEdit = isSuper || (p ? p.canEdit : false)
                    const canDelete = isSuper || (p ? p.canDelete : false)
                    const canPublish = isSuper || (p ? p.canPublish : false)

                    return (
                      <tr key={res} className="hover:bg-gray-50/50">
                        <td className="py-3.5 px-6 font-bold text-gray-800">{res}</td>
                        <td className="py-3.5 px-4 text-center">{canView ? '🟢 Yes' : '⚪ No'}</td>
                        <td className="py-3.5 px-4 text-center">{canCreate ? '🟢 Yes' : '⚪ No'}</td>
                        <td className="py-3.5 px-4 text-center">{canEdit ? '🟢 Yes' : '⚪ No'}</td>
                        <td className="py-3.5 px-4 text-center">{canDelete ? '🔴 Yes' : '⚪ No'}</td>
                        <td className="py-3.5 px-4 text-center">{canPublish ? '🌟 Yes' : '⚪ No'}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: ACTIVITY LOG */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
          <h2 className="text-base font-bold text-[#0d2340]">Recent Account Activity Trail</h2>
          <p className="text-xs text-gray-500 mt-1">
            Audit trail of actions, updates, and mutations initiated under your login credentials.
          </p>

          <div className="mt-6 divide-y divide-gray-100">
            {(!profile?.recentLogs || profile.recentLogs.length === 0) ? (
              <p className="text-xs text-gray-400 py-6 text-center">No recent activity entries recorded for this user.</p>
            ) : (
              profile.recentLogs.map((log) => (
                <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <span className="text-base">
                      {log.action === 'CREATE' ? '✨' : log.action === 'UPDATE' ? '✏️' : log.action === 'DELETE' ? '🗑️' : '📜'}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-gray-800">{log.entityType}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-600">
                          {log.action}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{log.notes}</p>
                    </div>
                  </div>
                  <span className="text-[11px] text-gray-400 font-mono shrink-0">
                    {new Date(log.createdAt).toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
