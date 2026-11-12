'use client'

import React, { useState, useEffect, useMemo, useTransition, Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  Shield,
  Users,
  Activity,
  Bell,
  Lock,
  Wrench,
  History,
  Settings,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
  Filter,
  UserPlus,
  Key,
  UserX,
  UserCheck,
  Trash2,
  Edit,
  Eye,
  LogOut,
  AlertOctagon,
  Clock,
  Server,
  Layers,
  FileText,
  Mail,
  Phone,
  Globe,
  Copy,
  Check,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  ShieldAlert,
  Download,
} from 'lucide-react'
import type { UserRole } from '@/types'

type ControlCenterTab =
  | 'overview'
  | 'users'
  | 'roles'
  | 'activity'
  | 'notifications'
  | 'security'
  | 'maintenance'
  | 'history'
  | 'settings'

interface AdminUser {
  id: string
  name: string
  email: string
  role: UserRole
  officeId?: string | null
  designation?: string
  phone?: string
  isActive: boolean
  tokenVersion: number
  mustChangePassword?: boolean
  lockedUntil?: string
  failedLoginAttempts: number
  suspendedAt?: string
  suspendedBy?: string
  lastLoginAt?: string
  lastLoginIp?: string
  createdAt: string
}

interface ActivityLogItem {
  id: string
  userId: string
  userName: string
  userRole?: string
  action: string
  category: 'USER_MANAGEMENT' | 'CONTENT_MANAGEMENT' | 'GOVERNMENT_SERVICES' | 'SYSTEM_SECURITY'
  entityType?: string
  entityId?: string
  notes?: string
  ipAddress: string
  result: 'SUCCESS' | 'FAILURE'
  createdAt: string
}

interface NotificationItem {
  id: string
  title: string
  message: string
  severity: 'INFO' | 'WARNING' | 'CRITICAL'
  category: string
  isRead: boolean
  createdAt: string
  metadata?: Record<string, any>
}

interface MaintenanceEvent {
  id: string
  isActive: boolean
  activatedAt: string
  activatedBy: string
  deactivatedAt?: string
  deactivatedBy?: string
  reason: string
  announcement_en: string
  announcement_am: string
  expectedReopening?: string
  durationMinutes?: number
}

const ROLES_INFO: { role: UserRole; title: string; color: string; desc: string; permissions: string[] }[] = [
  {
    role: 'SUPER_ADMIN',
    title: 'Chief Government Administrator (Super Admin)',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    desc: 'Unrestricted system authority, user lifecycle, maintenance switch, security and global governance.',
    permissions: ['Manage all staff accounts & roles', 'Toggle Emergency Maintenance Mode', 'Bulk session revocation', 'Modify system settings & contacts', 'Full content authoring & publishing'],
  },
  {
    role: 'ADMIN',
    title: 'General Woreda Administrator (Admin)',
    color: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    desc: 'Broad operational control over public services, tenders, sector offices, and official news publications.',
    permissions: ['Create, edit & publish all content', 'Manage sector offices & kebeles', 'Respond to citizen inquiries & grievances', 'View system audit trails', 'Cannot manage users or maintenance'],
  },
  {
    role: 'OFFICE_EDITOR',
    title: 'Sector Directorate Editor',
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    desc: 'Scoped exclusively to assigned sector office (e.g. Health, Education, Agriculture) for designated updates.',
    permissions: ['Create & edit assigned office news', 'Update office citizen service catalog', 'Upload office regulatory documents', 'Requires approval for public release'],
  },
  {
    role: 'REVIEWER',
    title: 'Government Editorial Reviewer',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    desc: 'Quality assurance, factual validation, and bilingual compliance verification before official publication.',
    permissions: ['Inspect draft publications', 'Review citizen grievance reports', 'Recommend approvals / revisions', 'Read-only access to system logs'],
  },
  {
    role: 'VIEWER',
    title: 'Auditing & Supervisory Viewer',
    color: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
    desc: 'Read-only observatory access for external compliance audits and regional council oversight.',
    permissions: ['View internal dashboards', 'Inspect public record registries', 'Zero edit or publishing authority'],
  },
]

const OFFICES = [
  { slug: 'agriculture', name: 'Agriculture & Natural Resources Office' },
  { slug: 'education', name: 'Education & Capacity Building Office' },
  { slug: 'health', name: 'Health Bureau & Medical Services Desk' },
  { slug: 'finance', name: 'Finance & Economic Development Office' },
  { slug: 'trade-investment', name: 'Trade, Industry & Investment Desk' },
  { slug: 'water-energy', name: 'Water, Irrigation & Energy Office' },
  { slug: 'land-administration', name: 'Rural Land Administration Desk' },
  { slug: 'administration', name: 'General Woreda Council & Cabinet' },
]

function ControlCenterInner({ defaultTab }: { defaultTab?: ControlCenterTab }) {
  const searchParams = useSearchParams()
  const tabFromQuery = searchParams.get('tab') as ControlCenterTab | null
  const [activeTab, setActiveTab] = useState<ControlCenterTab>(defaultTab || tabFromQuery || 'overview')
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Metrics Data
  const [metrics, setMetrics] = useState<any>(null)

  // Users Data
  const [users, setUsers] = useState<AdminUser[]>([])
  const [userSearch, setUserSearch] = useState('')
  const [userRoleFilter, setUserRoleFilter] = useState('ALL')
  const [userStatusFilter, setUserStatusFilter] = useState('ALL')
  const [userPage, setUserPage] = useState(1)
  const [userTotalPages, setUserTotalPages] = useState(1)

  // Modals
  const [showAddUserModal, setShowAddUserModal] = useState(false)
  const [newUserName, setNewUserName] = useState('')
  const [newUserEmail, setNewUserEmail] = useState('')
  const [newUserRole, setNewUserRole] = useState<UserRole>('OFFICE_EDITOR')
  const [newUserOffice, setNewUserOffice] = useState('agriculture')
  const [newUserPhone, setNewUserPhone] = useState('')
  const [newUserDesignation, setNewUserDesignation] = useState('')
  const [newUserCustomPassword, setNewUserCustomPassword] = useState('')

  // Edit User Modal
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [editName, setEditName] = useState('')
  const [editEmail, setEditEmail] = useState('')
  const [editRole, setEditRole] = useState<UserRole>('OFFICE_EDITOR')
  const [editOffice, setEditOffice] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editDesignation, setEditDesignation] = useState('')

  // Temporary Password Reveal Modal (strictly one-time display)
  const [revealedCreds, setRevealedCreds] = useState<{
    email: string
    name: string
    tempPassword: string
  } | null>(null)
  const [copiedPass, setCopiedPass] = useState(false)

  // Activity Log Data
  const [activities, setActivities] = useState<ActivityLogItem[]>([])
  const [activityCategory, setActivityCategory] = useState<string>('ALL')
  const [activityResult, setActivityResult] = useState<string>('ALL')
  const [activitySearch, setActivitySearch] = useState('')

  // Notifications Data
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadOnlyNotifs, setUnreadOnlyNotifs] = useState(false)
  const [unreadNotifCount, setUnreadNotifCount] = useState(0)

  // Maintenance Data
  const [maintStatus, setMaintStatus] = useState<{ isActive: boolean; currentEvent?: MaintenanceEvent; settings: Record<string, string> } | null>(null)
  const [maintHistory, setMaintHistory] = useState<MaintenanceEvent[]>([])
  const [maintReason, setMaintReason] = useState('Scheduled Government Infrastructure Upgrades & Security Patching')
  const [maintAnnouncementEn, setMaintAnnouncementEn] = useState('The Angolela Tera Woreda official portal is undergoing scheduled administrative maintenance. Public services will be restored shortly.')
  const [maintAnnouncementAm, setMaintAnnouncementAm] = useState('የአንጎለላ ጠራ ወረዳ አስተዳደር ይፋዊ ፖርታል በታቀደ የጥገናና ማሻሻያ ስራ ላይ ይገኛል። የህዝብ አገልግሎቶች በቅርቡ ይመለሳሉ።')
  const [maintExpectedReopening, setMaintExpectedReopening] = useState('')
  const [maintConfirmCode, setMaintConfirmCode] = useState('')
  const [showMaintModal, setShowMaintModal] = useState(false)

  // Security Center Data
  const [securityData, setSecurityData] = useState<any>(null)
  const [bulkRevokeConfirm, setBulkRevokeConfirm] = useState('')
  const [showBulkRevokeModal, setShowBulkRevokeModal] = useState(false)

  // Site Settings
  const [settingsForm, setSettingsForm] = useState<Record<string, string>>({})
  const [savingSettings, setSavingSettings] = useState(false)

  // Initial load
  useEffect(() => {
    loadAllData()
  }, [])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  const loadAllData = async () => {
    setRefreshing(true)
    try {
      await Promise.all([
        fetchDashboardMetrics(),
        fetchUsers(),
        fetchActivities(),
        fetchNotifications(),
        fetchMaintenanceData(),
        fetchSecurityData(),
        fetchSettings(),
      ])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchDashboardMetrics = async () => {
    try {
      const res = await fetch('/api/v1/super-admin/dashboard')
      const json = await res.json()
      if (json.success) setMetrics(json.data)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams()
      if (userSearch) params.set('search', userSearch)
      if (userRoleFilter !== 'ALL') params.set('role', userRoleFilter)
      if (userStatusFilter !== 'ALL') params.set('status', userStatusFilter)
      params.set('page', String(userPage))
      params.set('limit', '15')

      const res = await fetch(`/api/v1/super-admin/users?${params.toString()}`)
      const json = await res.json()
      if (json.success) {
        setUsers(json.users)
        setUserTotalPages(json.pagination.totalPages || 1)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchActivities = async () => {
    try {
      const params = new URLSearchParams()
      if (activityCategory !== 'ALL') params.set('category', activityCategory)
      if (activityResult !== 'ALL') params.set('result', activityResult)
      if (activitySearch) params.set('search', activitySearch)
      params.set('limit', '60')

      const res = await fetch(`/api/v1/super-admin/activity?${params.toString()}`)
      const json = await res.json()
      if (json.success) setActivities(json.logs)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/v1/super-admin/notifications?unread=${unreadOnlyNotifs}`)
      const json = await res.json()
      if (json.success) {
        setNotifications(json.notifications)
        setUnreadNotifCount(json.unreadCount)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchMaintenanceData = async () => {
    try {
      const res = await fetch('/api/v1/super-admin/maintenance')
      const json = await res.json()
      if (json.success) {
        setMaintStatus(json.status)
        setMaintHistory(json.history)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const fetchSecurityData = async () => {
    try {
      const res = await fetch('/api/v1/super-admin/security')
      const json = await res.json()
      if (json.success) setSecurityData(json.security)
    } catch (e) {
      console.error(e)
    }
  }

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/v1/settings')
      const json = await res.json()
      if (json.success) setSettingsForm(json.data)
    } catch (e) {
      console.error(e)
    }
  }

  // --- Handlers: Users ---
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/v1/super-admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          role: newUserRole,
          officeId: newUserOffice,
          phone: newUserPhone,
          designation: newUserDesignation,
          password: newUserCustomPassword,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Failed to create user')
        return
      }

      showToast('success', `User account created for ${json.user.email}`)
      setShowAddUserModal(false)
      setRevealedCreds({
        email: json.user.email,
        name: json.user.name,
        tempPassword: json.temporaryPassword,
      })
      setNewUserName('')
      setNewUserEmail('')
      setNewUserCustomPassword('')
      fetchUsers()
      fetchDashboardMetrics()
    } catch (err: any) {
      showToast('error', err.message || 'Error creating user')
    }
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingUser) return
    try {
      const res = await fetch('/api/v1/super-admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingUser.id,
          name: editName,
          email: editEmail,
          role: editRole,
          officeId: editOffice,
          phone: editPhone,
          designation: editDesignation,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Failed to update user')
        return
      }

      showToast('success', `Updated user ${json.user.email}`)
      setEditingUser(null)
      fetchUsers()
    } catch (err: any) {
      showToast('error', err.message || 'Error updating user')
    }
  }

  const handleToggleUserStatus = async (user: AdminUser) => {
    const newStatus = !user.isActive
    if (!confirm(`Are you sure you want to ${newStatus ? 'ACTIVATE' : 'SUSPEND'} user [${user.email}]?`)) {
      return
    }

    try {
      const res = await fetch('/api/v1/super-admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'TOGGLE_STATUS',
          userId: user.id,
          isActive: newStatus,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Action denied by security guard')
        return
      }

      showToast('success', json.message)
      fetchUsers()
      fetchDashboardMetrics()
    } catch (err: any) {
      showToast('error', err.message || 'Error toggling user status')
    }
  }

  const handleResetUserPassword = async (user: AdminUser) => {
    if (
      !confirm(
        `INITIATE SECURE PASSWORD RESET for [${user.email}]?\n\nA blind, single-use 14-character temporary password will be generated. All existing sessions will be immediately terminated. You will be shown the password once.`
      )
    ) {
      return
    }

    try {
      const res = await fetch('/api/v1/super-admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'RESET_PASSWORD',
          userId: user.id,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Password reset failed')
        return
      }

      setRevealedCreds({
        email: user.email,
        name: user.name,
        tempPassword: json.temporaryPassword,
      })
      showToast('success', 'Temporary password generated successfully')
      fetchUsers()
      fetchActivities()
    } catch (err: any) {
      showToast('error', err.message || 'Failed to reset password')
    }
  }

  const handleRevokeUserSessions = async (user: AdminUser) => {
    if (!confirm(`Revoke all active sessions for [${user.email}]? The user will be forced to log in again.`)) {
      return
    }

    try {
      const res = await fetch('/api/v1/super-admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REVOKE_SESSIONS',
          userId: user.id,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Failed to revoke sessions')
        return
      }

      showToast('success', json.message)
      fetchUsers()
      fetchActivities()
    } catch (err: any) {
      showToast('error', err.message || 'Failed to revoke sessions')
    }
  }

  const handleDeleteUser = async (user: AdminUser) => {
    if (
      !confirm(
        `PERMANENTLY DELETE user [${user.email}]?\n\nThis action cannot be undone. System protection will prevent deletion if this is the last Super Admin.`
      )
    ) {
      return
    }

    try {
      const res = await fetch(`/api/v1/super-admin/users?id=${user.id}`, {
        method: 'DELETE',
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Failed to delete user')
        return
      }

      showToast('success', json.message)
      fetchUsers()
      fetchDashboardMetrics()
    } catch (err: any) {
      showToast('error', err.message || 'Failed to delete user')
    }
  }

  // --- Handlers: Notifications ---
  const handleMarkNotificationRead = async (id: string) => {
    try {
      const res = await fetch('/api/v1/super-admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (json.success) {
        fetchNotifications()
        fetchDashboardMetrics()
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleMarkAllNotificationsRead = async () => {
    try {
      const res = await fetch('/api/v1/super-admin/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'MARK_ALL_READ' }),
      })
      const json = await res.json()
      if (json.success) {
        showToast('success', json.message)
        fetchNotifications()
        fetchDashboardMetrics()
      }
    } catch (e) {
      console.error(e)
    }
  }

  // --- Handlers: Maintenance ---
  const handleToggleMaintenance = async (enable: boolean) => {
    if (enable && maintConfirmCode !== 'MAINTENANCE') {
      showToast('error', 'Confirmation failed: You must type "MAINTENANCE" exactly.')
      return
    }

    try {
      const res = await fetch('/api/v1/super-admin/maintenance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enable,
          confirmationText: maintConfirmCode,
          reason: maintReason,
          announcement_en: maintAnnouncementEn,
          announcement_am: maintAnnouncementAm,
          expectedReopening: maintExpectedReopening || undefined,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Failed to update maintenance state')
        return
      }

      showToast('success', json.message)
      setShowMaintModal(false)
      setMaintConfirmCode('')
      fetchMaintenanceData()
      fetchDashboardMetrics()
    } catch (err: any) {
      showToast('error', err.message || 'Operation failed')
    }
  }

  // --- Handlers: Security Center ---
  const handleBulkRevokeAllSessions = async () => {
    if (bulkRevokeConfirm !== 'REVOKE') {
      showToast('error', 'Confirmation keyword "REVOKE" required.')
      return
    }

    try {
      const res = await fetch('/api/v1/super-admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'REVOKE_ALL_SESSIONS',
          confirmationText: bulkRevokeConfirm,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Failed to revoke all sessions')
        return
      }

      showToast('success', json.message)
      setShowBulkRevokeModal(false)
      setBulkRevokeConfirm('')
      fetchSecurityData()
      fetchActivities()
    } catch (err: any) {
      showToast('error', err.message || 'Operation failed')
    }
  }

  const handleUnlockUser = async (targetUserId: string) => {
    try {
      const res = await fetch('/api/v1/super-admin/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UNLOCK_USER',
          targetUserId,
        }),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Failed to unlock user')
        return
      }

      showToast('success', json.message)
      fetchSecurityData()
      fetchUsers()
    } catch (err: any) {
      showToast('error', err.message || 'Operation failed')
    }
  }

  // --- Handlers: System Settings ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      })
      const json = await res.json()
      if (!json.success) {
        showToast('error', json.error || 'Failed to save settings')
        return
      }

      showToast('success', 'Official system settings saved successfully')
    } catch (err: any) {
      showToast('error', err.message || 'Error saving settings')
    } finally {
      setSavingSettings(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopiedPass(true)
    setTimeout(() => setCopiedPass(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl border flex items-center gap-3 text-sm font-medium animate-in fade-in slide-in-from-bottom-4 ${
            toast.type === 'success'
              ? 'bg-emerald-950 border-emerald-700 text-emerald-200'
              : 'bg-red-950 border-red-700 text-red-200'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Government Control Center Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-500/10 via-emerald-500/5 to-transparent blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative w-14 h-14 rounded-2xl bg-slate-950 border border-amber-500/30 p-1 flex items-center justify-center shadow-lg shrink-0">
              <Image
                src="/logo.png"
                alt="Government Emblem"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Government System Control Center
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Operational
                </span>
                {maintStatus?.isActive && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-red-500/30 text-red-200 border border-red-500/60 flex items-center gap-1 animate-pulse">
                    <AlertOctagon className="w-3 h-3" />
                    Maintenance Active
                  </span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-100">
                Angolela Tera Woreda Administration
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                North Shewa Zone, Amhara National Regional State, Ethiopia
              </p>
            </div>
          </div>

          {/* Quick Operations Button Strip */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setShowAddUserModal(true)
              }}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Staff</span>
            </button>

            {maintStatus?.isActive ? (
              <button
                onClick={() => handleToggleMaintenance(false)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Deactivate Maintenance</span>
              </button>
            ) : (
              <button
                onClick={() => setShowMaintModal(true)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition shadow-md border border-red-500/50"
              >
                <AlertOctagon className="w-4 h-4" />
                <span>Emergency Maintenance</span>
              </button>
            )}

            <button
              onClick={loadAllData}
              disabled={refreshing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition border border-slate-700"
              title="Refresh Control Center"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* 9-Section Tab Navigation Strip */}
        <div className="mt-8 border-t border-slate-800/80 pt-4 -mb-2 overflow-x-auto scrollbar-none">
          <nav className="flex space-x-2 min-w-max pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: Layers },
              { id: 'users', label: 'User Management', icon: Users },
              { id: 'roles', label: 'Roles & RBAC', icon: Shield },
              { id: 'activity', label: 'System Activity', icon: Activity },
              { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifCount },
              { id: 'security', label: 'Security Center', icon: Lock, badge: securityData?.lockedCount },
              { id: 'maintenance', label: 'Maintenance Control', icon: Wrench },
              { id: 'history', label: 'Maintenance History', icon: History },
              { id: 'settings', label: 'System Settings', icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon
              const isSelected = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ControlCenterTab)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {Boolean(tab.badge && tab.badge > 0) && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isSelected
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-red-500 text-white animate-pulse'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* ============================================================== */}
      {/* SECTION 1: OVERVIEW (DASHBOARD)                                */}
      {/* ============================================================== */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Top KPI Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Total Administrators</span>
                <Users className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {metrics?.users?.total ?? users.length}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span className="text-emerald-600 font-semibold">{metrics?.users?.active ?? 0} active</span>
                <span>•</span>
                <span className="text-slate-400">{metrics?.users?.suspended ?? 0} suspended</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Security Posture</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-3xl font-black text-emerald-600">
                {metrics?.users?.lockedUsers > 0 ? (
                  <span className="text-red-600">{metrics.users.lockedUsers} Locked</span>
                ) : (
                  'Optimal'
                )}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>JWT HS256 + Invalidation</span>
                <span>•</span>
                <span className="font-semibold text-emerald-600">Active Guard</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>System Alerts</span>
                <Bell className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-3xl font-black text-slate-900">
                {unreadNotifCount}
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span className="text-red-600 font-semibold">{metrics?.notifications?.critical ?? 0} critical</span>
                <span>•</span>
                <span>{metrics?.notifications?.total ?? 0} historical</span>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">
                <span>Maintenance Status</span>
                <Wrench className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-2xl font-black">
                {maintStatus?.isActive ? (
                  <span className="text-red-600 animate-pulse">ACTIVE (Locked)</span>
                ) : (
                  <span className="text-emerald-600">Operational</span>
                )}
              </div>
              <div className="mt-2 text-xs text-slate-500">
                <span>{maintStatus?.isActive ? 'Public traffic diverted' : 'All public services normal'}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Hub & Health Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Health */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-600" />
                <span>Government Server Health</span>
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Platform Environment</span>
                  <span className="font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                    {metrics?.nodeEnv || 'production'}
                  </span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Database Engine</span>
                  <span className="font-semibold text-slate-800">Prisma / High-Availability Store</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-slate-100">
                  <span className="text-slate-500">Session Revocation Engine</span>
                  <span className="font-semibold text-emerald-600">Active (v1.0 Live Invalidation)</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-slate-500">System Uptime</span>
                  <span className="font-mono text-slate-800">
                    {Math.floor((metrics?.systemUptime || 3600) / 3600)}h {Math.floor(((metrics?.systemUptime || 3600) % 3600) / 60)}m
                  </span>
                </div>
              </div>
            </div>

            {/* Live Activity Stream (Recent 8) */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <Activity className="w-4 h-4 text-amber-500" />
                  <span>Real-Time Audit Stream</span>
                </h3>
                <button
                  onClick={() => setActiveTab('activity')}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <span>View All Logs</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {activities.slice(0, 6).map((act) => (
                  <div
                    key={act.id}
                    className="flex items-start justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-slate-900">{act.action}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                          {act.category}
                        </span>
                        {act.result === 'FAILURE' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">
                            BLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-slate-600 text-xs line-clamp-1">{act.notes}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <p className="text-[11px] text-slate-400">
                        {new Date(act.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] text-slate-500 font-mono">{act.ipAddress}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 2: USER MANAGEMENT                                     */}
      {/* ============================================================== */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, designation..."
                  value={userSearch}
                  onChange={(e) => {
                    setUserSearch(e.target.value)
                    setUserPage(1)
                  }}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <select
                value={userRoleFilter}
                onChange={(e) => {
                  setUserRoleFilter(e.target.value)
                  setUserPage(1)
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Roles</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="ADMIN">Admin</option>
                <option value="OFFICE_EDITOR">Office Editor</option>
                <option value="REVIEWER">Reviewer</option>
                <option value="VIEWER">Viewer</option>
              </select>

              <select
                value={userStatusFilter}
                onChange={(e) => {
                  setUserStatusFilter(e.target.value)
                  setUserPage(1)
                }}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="SUSPENDED">Suspended Only</option>
              </select>
            </div>

            <button
              onClick={() => setShowAddUserModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-sm"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Administrator</span>
            </button>
          </div>

          {/* User Table */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-bold">
                  <tr>
                    <th className="px-5 py-3.5">User Identity</th>
                    <th className="px-5 py-3.5">Role & Scope</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Security / Token</th>
                    <th className="px-5 py-3.5">Last Login</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900 text-sm">{u.name}</div>
                        <div className="text-slate-500 text-xs">{u.email}</div>
                        {u.designation && (
                          <div className="text-[11px] text-slate-400">{u.designation}</div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                            u.role === 'SUPER_ADMIN'
                              ? 'bg-amber-50 text-amber-900 border-amber-300'
                              : u.role === 'ADMIN'
                              ? 'bg-blue-50 text-blue-900 border-blue-300'
                              : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                          }`}
                        >
                          {u.role}
                        </span>
                        {u.officeId && (
                          <div className="text-[11px] text-slate-400 mt-1 capitalize">
                            Office: {u.officeId.replace(/-/g, ' ')}
                          </div>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-50 text-red-700 border border-red-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Suspended
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="text-xs text-slate-700 font-mono">
                          v{u.tokenVersion || 1}
                        </div>
                        {u.mustChangePassword && (
                          <span className="text-[10px] font-bold text-amber-600 uppercase">
                            Must Change PW
                          </span>
                        )}
                        {u.lockedUntil && new Date(u.lockedUntil) > new Date() && (
                          <span className="text-[10px] font-bold text-red-600 block">
                            Locked Out
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {u.lastLoginAt ? (
                          <div>
                            <div>{new Date(u.lastLoginAt).toLocaleDateString()}</div>
                            <div className="text-[10px] text-slate-400 font-mono">
                              {u.lastLoginIp || 'Local'}
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-400 italic">Never</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right space-x-1 whitespace-nowrap">
                        {/* Edit Profile */}
                        <button
                          onClick={() => {
                            setEditingUser(u)
                            setEditName(u.name)
                            setEditEmail(u.email)
                            setEditRole(u.role)
                            setEditOffice(u.officeId || '')
                            setEditPhone(u.phone || '')
                            setEditDesignation(u.designation || '')
                          }}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-slate-100 transition"
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4" />
                        </button>

                        {/* Reset Password */}
                        <button
                          onClick={() => handleResetUserPassword(u)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-amber-600 hover:bg-slate-100 transition"
                          title="Secure Password Reset (Generates Temp Password)"
                        >
                          <Key className="w-4 h-4" />
                        </button>

                        {/* Revoke Sessions */}
                        <button
                          onClick={() => handleRevokeUserSessions(u)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-purple-600 hover:bg-slate-100 transition"
                          title="Terminate Active Sessions Immediately"
                        >
                          <LogOut className="w-4 h-4" />
                        </button>

                        {/* Status Toggle */}
                        <button
                          onClick={() => handleToggleUserStatus(u)}
                          className={`p-1.5 rounded-lg transition ${
                            u.isActive
                              ? 'text-slate-600 hover:text-red-600 hover:bg-red-50'
                              : 'text-slate-600 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={u.isActive ? 'Suspend User' : 'Reactivate User'}
                        >
                          {u.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                        </button>

                        {/* Delete User */}
                        <button
                          onClick={() => handleDeleteUser(u)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Permanently Delete Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-400">
                        No administrators found matching criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {userTotalPages > 1 && (
              <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Page {userPage} of {userTotalPages}</span>
                <div className="flex gap-1">
                  <button
                    disabled={userPage <= 1}
                    onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    disabled={userPage >= userTotalPages}
                    onClick={() => setUserPage((p) => Math.min(userTotalPages, p + 1))}
                    className="px-3 py-1 rounded bg-slate-100 hover:bg-slate-200 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 3: ROLES & RBAC MATRIX                                 */}
      {/* ============================================================== */}
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Government Administrative RBAC Hierarchy
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Official 5-tier role-based access control matrix governing staff authorizations, editorial workflows, and security safeguards across Angolela Tera Woreda.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ROLES_INFO.map((r) => (
                <div
                  key={r.role}
                  className="bg-slate-50 border border-slate-200 rounded-xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border mb-2 ${r.color}`}>
                      {r.role}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mb-1">{r.title}</h3>
                    <p className="text-xs text-slate-600 mb-4">{r.desc}</p>

                    <h4 className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Authorized Permissions:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {r.permissions.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 4: SYSTEM ACTIVITY CENTER                              */}
      {/* ============================================================== */}
      {activeTab === 'activity' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 flex-wrap">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter by action, user, IP, or keywords..."
                  value={activitySearch}
                  onChange={(e) => setActivitySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <select
                value={activityCategory}
                onChange={(e) => setActivityCategory(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All 4 Activity Pillars</option>
                <option value="USER_MANAGEMENT">User Management</option>
                <option value="CONTENT_MANAGEMENT">Content Management</option>
                <option value="GOVERNMENT_SERVICES">Government Services</option>
                <option value="SYSTEM_SECURITY">System Security</option>
              </select>

              <select
                value={activityResult}
                onChange={(e) => setActivityResult(e.target.value)}
                className="px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-slate-700 font-medium"
              >
                <option value="ALL">All Outcomes</option>
                <option value="SUCCESS">Success Only</option>
                <option value="FAILURE">Failure / Blocked</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/api/v1/super-admin/activity/export?category=${activityCategory}&result=${activityResult}&search=${encodeURIComponent(activitySearch)}`}
                download
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-semibold transition"
              >
                <Download className="w-3.5 h-3.5 text-amber-700" />
                <span>Export CSV</span>
              </a>

              <button
                onClick={fetchActivities}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Refresh Log</span>
              </button>
            </div>
          </div>

          {/* Activity Log List */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100">
            {activities.map((act) => (
              <div key={act.id} className="p-4 sm:p-5 hover:bg-slate-50 transition flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-sm">{act.action}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                      {act.category}
                    </span>
                    {act.result === 'FAILURE' ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 border border-red-200">
                        FAILED / REJECTED
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        SUCCESS
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">{act.notes}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span>Actor: <strong className="text-slate-600">{act.userName}</strong> ({act.userRole || 'SYSTEM'})</span>
                    <span>•</span>
                    <span>IP: <strong className="font-mono text-slate-600">{act.ipAddress}</strong></span>
                  </div>
                </div>

                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  <div>{new Date(act.createdAt).toLocaleDateString()}</div>
                  <div className="font-mono">{new Date(act.createdAt).toLocaleTimeString()}</div>
                </div>
              </div>
            ))}

            {activities.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">
                No activity records matched your filter criteria.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 5: NOTIFICATIONS CENTER                                */}
      {/* ============================================================== */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setUnreadOnlyNotifs(false)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  !unreadOnlyNotifs
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                All Alerts ({notifications.length})
              </button>
              <button
                onClick={() => setUnreadOnlyNotifs(true)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  unreadOnlyNotifs
                    ? 'bg-amber-500 text-slate-950'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                Unread Only ({unreadNotifCount})
              </button>
            </div>

            {unreadNotifCount > 0 && (
              <button
                onClick={handleMarkAllNotificationsRead}
                className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Mark All as Read</span>
              </button>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm divide-y divide-slate-100">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className={`p-5 transition flex items-start justify-between gap-4 ${
                  notif.isRead ? 'bg-white opacity-80' : 'bg-amber-50/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      notif.severity === 'CRITICAL'
                        ? 'bg-red-100 text-red-600'
                        : notif.severity === 'WARNING'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-blue-100 text-blue-600'
                    }`}
                  >
                    {notif.severity === 'CRITICAL' ? (
                      <AlertOctagon className="w-5 h-5 animate-pulse" />
                    ) : (
                      <Bell className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900">{notif.title}</h4>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          notif.severity === 'CRITICAL'
                            ? 'bg-red-50 text-red-700 border border-red-200'
                            : 'bg-slate-100 text-slate-700 border border-slate-200'
                        }`}
                      >
                        {notif.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl">{notif.message}</p>
                    <p className="text-[11px] text-slate-400">
                      {new Date(notif.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!notif.isRead && (
                  <button
                    onClick={() => handleMarkNotificationRead(notif.id)}
                    className="text-xs text-slate-500 hover:text-emerald-600 transition shrink-0 p-1"
                    title="Mark as Read"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="p-12 text-center text-slate-400 text-sm">
                No notifications to display.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 6: SECURITY CENTER                                     */}
      {/* ============================================================== */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Security Threat Monitoring Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500 mb-1">
                Active Staff Sessions
              </div>
              <div className="text-2xl font-black text-slate-900">
                {securityData?.activeSessionsEstimated ?? 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">Live token-validated connections</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500 mb-1">
                Locked Out Accounts (Brute Force)
              </div>
              <div className={`text-2xl font-black ${securityData?.lockedCount > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                {securityData?.lockedCount ?? 0}
              </div>
              <p className="text-xs text-slate-500 mt-1">15-minute temporary safety lockouts</p>
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <div className="text-xs font-bold uppercase text-slate-500 mb-1">
                Token Version Engine
              </div>
              <div className="text-2xl font-black text-emerald-600">
                Active
              </div>
              <p className="text-xs text-slate-500 mt-1">Instant session revocation enabled</p>
            </div>
          </div>

          {/* Locked Accounts Table */}
          {securityData?.lockedUsers && securityData.lockedUsers.length > 0 && (
            <div className="bg-red-50/50 border border-red-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-red-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Accounts Temporarily Locked Due to Excessive Failed Attempts</span>
              </h3>
              <div className="space-y-3 mt-4">
                {securityData.lockedUsers.map((u: any) => (
                  <div key={u.id} className="bg-white rounded-xl p-4 border border-red-200 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{u.name} ({u.email})</p>
                      <p className="text-red-600 font-semibold">
                        {u.failedLoginAttempts} failed attempts • Locked until: {new Date(u.lockedUntil).toLocaleTimeString()}
                      </p>
                    </div>
                    <button
                      onClick={() => handleUnlockUser(u.id)}
                      className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition text-xs"
                    >
                      Unlock Now
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Emergency Kill-Switch: Global Bulk Session Revocation */}
          <div className="bg-white border-2 border-red-300 rounded-2xl p-6 shadow-sm">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="text-base font-bold text-red-950">
                  Emergency Bulk Session Invalidation (Global Kill-Switch)
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl">
                  In case of suspected credential compromise or staff security breaches, immediately terminate all active administrator sessions across the entire portal. All existing JWT tokens will be rejected on their next request. Your current Super Admin session will remain active.
                </p>
                <button
                  onClick={() => setShowBulkRevokeModal(true)}
                  className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-sm"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Terminate All Staff Sessions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 7: EMERGENCY MAINTENANCE CONTROL                       */}
      {/* ============================================================== */}
      {activeTab === 'maintenance' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Global System Safeguard
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">
                  Emergency Maintenance Mode Kill-Switch
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Activating Emergency Maintenance Mode locks out public visitors and standard staff administrators, displaying the official bilingual government maintenance notice with emergency contacts while preserving Super Admin console recovery access.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/en"
                  target="_blank"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition"
                >
                  <span>Preview Public Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Current Status Box */}
            <div
              className={`p-6 rounded-2xl border mb-6 flex items-center justify-between flex-wrap gap-4 ${
                maintStatus?.isActive
                  ? 'bg-red-50 border-red-300 text-red-950'
                  : 'bg-emerald-50 border-emerald-300 text-emerald-950'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    maintStatus?.isActive
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <Wrench className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">
                    Maintenance Mode is currently {maintStatus?.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </h3>
                  <p className="text-xs opacity-80 mt-0.5">
                    {maintStatus?.isActive
                      ? `Activated by ${maintStatus.currentEvent?.activatedBy} on ${new Date(
                          maintStatus.currentEvent?.activatedAt || ''
                        ).toLocaleString()}`
                      : 'Public services and all sector offices are operating normally.'}
                  </p>
                </div>
              </div>

              {maintStatus?.isActive ? (
                <button
                  onClick={() => handleToggleMaintenance(false)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md"
                >
                  Restore Public Portal Now
                </button>
              ) : (
                <button
                  onClick={() => setShowMaintModal(true)}
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition shadow-md"
                >
                  Activate Maintenance Window
                </button>
              )}
            </div>

            {/* Maintenance Scope Details */}
            {maintStatus?.isActive && maintStatus.currentEvent && (
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 text-xs space-y-3">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px]">
                  Active Maintenance Parameters:
                </h4>
                <div>
                  <span className="text-slate-500 font-semibold">Scope / Reason:</span>
                  <p className="font-bold text-slate-800">{maintStatus.currentEvent.reason}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">English Notice:</span>
                  <p className="text-slate-700">{maintStatus.currentEvent.announcement_en}</p>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold">Amharic Notice:</span>
                  <p className="text-slate-700">{maintStatus.currentEvent.announcement_am}</p>
                </div>
                {maintStatus.currentEvent.expectedReopening && (
                  <div>
                    <span className="text-slate-500 font-semibold">Expected Reopening:</span>
                    <p className="font-bold text-amber-700">
                      {new Date(maintStatus.currentEvent.expectedReopening).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 8: MAINTENANCE HISTORY                                 */}
      {/* ============================================================== */}
      {activeTab === 'history' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900 mb-1">
              Historical Maintenance Logs
            </h2>
            <p className="text-xs text-slate-500 mb-6">
              Complete chronological audit record of all past emergency maintenance actions, infrastructure upgrades, and system interruptions.
            </p>

            <div className="space-y-4">
              {maintHistory.map((h) => (
                <div key={h.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 text-xs space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{h.reason}</span>
                      {h.isActive ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 animate-pulse">
                          ONGOING
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                          COMPLETED ({h.durationMinutes ?? 0}m)
                        </span>
                      )}
                    </div>
                    <span className="text-slate-400 text-[11px]">
                      {new Date(h.activatedAt).toLocaleString()}
                    </span>
                  </div>

                  <p className="text-slate-600">{h.announcement_en}</p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>Activated by: <strong>{h.activatedBy}</strong></span>
                    {h.deactivatedBy && (
                      <span>Terminated by: <strong>{h.deactivatedBy}</strong></span>
                    )}
                  </div>
                </div>
              ))}

              {maintHistory.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No maintenance history records found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* SECTION 9: SYSTEM SETTINGS                                     */}
      {/* ============================================================== */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">
                Official Government Portal Settings
              </h2>
              <p className="text-xs text-slate-500">
                Centralized system configuration, official emergency contacts, and social media identifiers for Angolela Tera Woreda.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Government Name (English)</label>
                <input
                  type="text"
                  value={settingsForm.government_name_en || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, government_name_en: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">የመንግሥት ስም (አማርኛ)</label>
                <input
                  type="text"
                  value={settingsForm.government_name_am || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, government_name_am: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none font-sans"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Official Contact Phone</label>
                <input
                  type="text"
                  value={settingsForm.contact_phone || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Official Contact Email</label>
                <input
                  type="email"
                  value={settingsForm.contact_email || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, contact_email: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Police Emergency Helpline</label>
                <input
                  type="text"
                  value={settingsForm.emergency_police || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, emergency_police: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1.5">Health & Ambulance Helpline</label>
                <input
                  type="text"
                  value={settingsForm.emergency_health || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, emergency_health: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
                  Official Social Media Account URLs
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Official Facebook URL</label>
                    <input
                      type="url"
                      value={settingsForm.social_facebook || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_facebook: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Official YouTube Channel URL</label>
                    <input
                      type="url"
                      value={settingsForm.social_youtube || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_youtube: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-600 mb-1">Official X (Twitter) URL</label>
                    <input
                      type="url"
                      value={settingsForm.social_x || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, social_x: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-sm disabled:opacity-50"
              >
                {savingSettings ? 'Saving...' : 'Save System Settings'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ============================================================== */}
      {/* MODAL 1: ADD USER                                              */}
      {/* ============================================================== */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Register New Administrator</h3>
            <p className="text-xs text-slate-500 mb-5">
              Create an administrative user profile. A secure 14-character temporary password can be auto-generated or specified.
            </p>

            <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="e.g. Ato Dawit Kebede"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Official Email Address *</label>
                <input
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="user@angolela-tera.gov.et"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role *</label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="OFFICE_EDITOR">Office Editor</option>
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="REVIEWER">Reviewer</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Assigned Office Scope</label>
                  <select
                    value={newUserOffice}
                    onChange={(e) => setNewUserOffice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                  >
                    {OFFICES.map((o) => (
                      <option key={o.slug} value={o.slug}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={newUserDesignation}
                    onChange={(e) => setNewUserDesignation(e.target.value)}
                    placeholder="e.g. Lead Agronomist"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newUserPhone}
                    onChange={(e) => setNewUserPhone(e.target.value)}
                    placeholder="+251 91 123 4567"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Temporary Password (Optional)
                </label>
                <input
                  type="text"
                  value={newUserCustomPassword}
                  onChange={(e) => setNewUserCustomPassword(e.target.value)}
                  placeholder="Leave empty to auto-generate a secure 14-char password"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Register User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 2: EDIT USER                                             */}
      {/* ============================================================== */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Edit User Profile</h3>
            <p className="text-xs text-slate-500 mb-5">
              Update administrative metadata for [{editingUser.email}].
            </p>

            <form onSubmit={handleUpdateUser} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Role</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="OFFICE_EDITOR">Office Editor</option>
                    <option value="REVIEWER">Reviewer</option>
                    <option value="VIEWER">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Office Scope</label>
                  <select
                    value={editOffice}
                    onChange={(e) => setEditOffice(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium"
                  >
                    <option value="">None / Global</option>
                    {OFFICES.map((o) => (
                      <option key={o.slug} value={o.slug}>{o.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Designation</label>
                  <input
                    type="text"
                    value={editDesignation}
                    onChange={(e) => setEditDesignation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 3: ONE-TIME TEMPORARY PASSWORD REVEAL                    */}
      {/* ============================================================== */}
      {revealedCreds && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-amber-400 animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center text-amber-600 mb-4 mx-auto">
              <Key className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 text-center mb-1">
              One-Time Temporary Password
            </h3>
            <p className="text-xs text-slate-500 text-center mb-5 leading-relaxed">
              This credential has been bcrypt-hashed. For security compliance, <strong>this temporary password will NOT be displayed again</strong>.
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3 mb-6">
              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">User Account</p>
                <p className="text-sm font-bold text-slate-800">{revealedCreds.name} ({revealedCreds.email})</p>
              </div>

              <div>
                <p className="text-[10px] uppercase font-bold text-slate-400">Temporary Password</p>
                <div className="flex items-center justify-between mt-1 bg-white border border-slate-300 rounded-lg p-2.5">
                  <span className="font-mono text-base font-extrabold text-slate-900 tracking-wider">
                    {revealedCreds.tempPassword}
                  </span>
                  <button
                    onClick={() => copyToClipboard(revealedCreds.tempPassword)}
                    className="p-1.5 rounded-md hover:bg-slate-100 text-slate-600 transition"
                    title="Copy Password"
                  >
                    {copiedPass ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 mb-6 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                The administrator will be strictly required to establish a new confidential password upon their first login attempt.
              </span>
            </div>

            <button
              onClick={() => setRevealedCreds(null)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition"
            >
              I Have Securely Copied This Password
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 4: EMERGENCY MAINTENANCE ACTIVATION CONFIRMATION         */}
      {/* ============================================================== */}
      {showMaintModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-red-500">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-100 border border-red-300 flex items-center justify-center text-red-600 shrink-0">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-black text-red-950">
                  ACTIVATE EMERGENCY MAINTENANCE MODE
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  This will immediately divert all public portal traffic to the official maintenance page and lock out standard staff.
                </p>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Technical Scope / Reason *</label>
                <input
                  type="text"
                  value={maintReason}
                  onChange={(e) => setMaintReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Public English Announcement</label>
                <textarea
                  rows={2}
                  value={maintAnnouncementEn}
                  onChange={(e) => setMaintAnnouncementEn(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">የአማርኛ ይፋዊ ማስታወቂያ</label>
                <textarea
                  rows={2}
                  value={maintAnnouncementAm}
                  onChange={(e) => setMaintAnnouncementAm(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Estimated Reopening Time</label>
                <input
                  type="datetime-local"
                  value={maintExpectedReopening}
                  onChange={(e) => setMaintExpectedReopening(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                <p className="font-bold text-red-900 mb-1">Safety Confirmation Guard:</p>
                <p className="text-slate-600 mb-2">
                  Please type the word <strong className="text-red-700 font-mono">MAINTENANCE</strong> in all caps to unlock the kill-switch:
                </p>
                <input
                  type="text"
                  value={maintConfirmCode}
                  onChange={(e) => setMaintConfirmCode(e.target.value)}
                  placeholder="Type MAINTENANCE here..."
                  className="w-full px-3 py-2 rounded-lg border border-red-300 font-mono text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-bold"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-5 border-t border-slate-100 mt-6">
              <button
                type="button"
                onClick={() => {
                  setShowMaintModal(false)
                  setMaintConfirmCode('')
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Abort
              </button>
              <button
                type="button"
                disabled={maintConfirmCode !== 'MAINTENANCE'}
                onClick={() => handleToggleMaintenance(true)}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition disabled:opacity-40"
              >
                Confirm & Activate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL 5: BULK SESSION REVOCATION CONFIRMATION                  */}
      {/* ============================================================== */}
      {showBulkRevokeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-red-600">
            <h3 className="text-base font-black text-red-950 mb-2">
              Terminate All Administrator Sessions?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              This action immediately revokes active JWT tokens across all staff members. Every administrator will be forcibly signed out. Type <strong className="font-mono text-red-700">REVOKE</strong> to confirm:
            </p>

            <input
              type="text"
              value={bulkRevokeConfirm}
              onChange={(e) => setBulkRevokeConfirm(e.target.value)}
              placeholder="Type REVOKE..."
              className="w-full px-3 py-2 rounded-xl border border-red-300 font-mono text-xs focus:ring-2 focus:ring-red-500 focus:outline-none font-bold mb-4"
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowBulkRevokeModal(false)
                  setBulkRevokeConfirm('')
                }}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={bulkRevokeConfirm !== 'REVOKE'}
                onClick={handleBulkRevokeAllSessions}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition disabled:opacity-40"
              >
                Execute Global Revocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function SuperAdminPage({ defaultTab }: { defaultTab?: ControlCenterTab }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-500 font-semibold tracking-wider uppercase">
              Loading Government Control Center...
            </p>
          </div>
        </div>
      }
    >
      <ControlCenterInner defaultTab={defaultTab} />
    </Suspense>
  )
}
