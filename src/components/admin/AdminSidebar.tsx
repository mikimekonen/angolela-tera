'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import type { SessionPayload } from '@/types'

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: '◈' },
    ],
  },
  {
    label: 'Government & Sectors',
    items: [
      { href: '/admin/offices', label: 'Sector Offices', icon: '🏛️' },
      { href: '/admin/services', label: 'Citizen Services', icon: '📋' },
      { href: '/admin/leadership', label: 'Executive Leaders', icon: '👤' },
      { href: '/admin/kebeles', label: 'Kebeles & Towns', icon: '🗺️' },
    ],
  },
  {
    label: 'Economy & Investment',
    items: [
      { href: '/admin/investments', label: 'Investment Corridor', icon: '📈' },
      { href: '/admin/projects', label: 'Development Projects', icon: '🏗️' },
      { href: '/admin/tourism', label: 'Tourism & Heritage', icon: '🏞️' },
      { href: '/admin/companies', label: 'Private Enterprises', icon: '💼' },
      { href: '/admin/partners', label: 'Strategic Partners', icon: '🤝' },
      { href: '/admin/tenders', label: 'Public Tenders', icon: '⚖️' },
    ],
  },
  {
    label: 'Communication & Civic',
    items: [
      { href: '/admin/news', label: 'News & Press', icon: '📰' },
      { href: '/admin/documents', label: 'Documents & Forms', icon: '📄' },
      { href: '/admin/media', label: 'Media Library', icon: '🖼️' },
      { href: '/admin/inquiries', label: 'Grievances & Inquiries', icon: '📥' },
    ],
  },
  {
    label: 'CMS Configuration',
    items: [
      { href: '/admin/sliders', label: 'Hero Sliders', icon: '🖼️' },
      { href: '/admin/sections', label: 'Homepage Sections', icon: '⚙️' },
      { href: '/admin/navigation', label: 'Menu Management', icon: '🧭' },
      { href: '/admin/users', label: 'Admin Users & RBAC', icon: '🛡️' },
      { href: '/admin/settings', label: 'Official Site Settings', icon: '🔧' },
      { href: '/admin/audit-log', label: 'Audit Trail', icon: '📜' },
    ],
  },
]

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: 'Super Admin',
  ADMIN: 'Admin',
  OFFICE_EDITOR: 'Office Editor',
  REVIEWER: 'Reviewer',
  VIEWER: 'Viewer',
}

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN: 'bg-amber-400/20 text-amber-300 border-amber-400/30',
  ADMIN: 'bg-blue-400/20 text-blue-300 border-blue-400/30',
  OFFICE_EDITOR: 'bg-emerald-400/20 text-emerald-300 border-emerald-400/30',
  REVIEWER: 'bg-purple-400/20 text-purple-300 border-purple-400/30',
  VIEWER: 'bg-gray-400/20 text-gray-300 border-gray-400/30',
}

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
}

export default function AdminSidebar({ user }: { user: SessionPayload }) {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' })
    } catch { /* ignore */ }
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <aside
      className={`${
        collapsed ? 'w-[68px]' : 'w-64'
      } bg-[#071220] flex flex-col shrink-0 min-h-screen border-r border-white/5 transition-all duration-300 relative z-30`}
    >
      {/* Top Brand */}
      <div className={`flex items-center gap-3 px-4 h-16 border-b border-white/5 ${collapsed ? 'justify-center' : ''}`}>
        <div className="w-9 h-9 rounded-full bg-white/10 p-0.5 border border-white/20 shrink-0 shadow-md flex items-center justify-center overflow-hidden">
          <img
            src="/logo.png"
            alt="Angolela Tera Woreda"
            className="w-full h-full object-contain rounded-full"
          />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-[#c8931a] uppercase tracking-widest leading-none">Admin Console</p>
            <p className="text-xs font-bold text-white tracking-tight truncate leading-tight mt-0.5">Angolela Tera</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`ml-auto text-gray-500 hover:text-white transition-colors cursor-pointer ${collapsed ? 'hidden' : 'block'}`}
          aria-label="Collapse sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7M18 19l-7-7 7-7" />
          </svg>
        </button>
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            className="absolute -right-3 top-5 bg-[#0d1c30] border border-white/10 rounded-full p-1 text-gray-400 hover:text-white shadow-lg cursor-pointer"
            aria-label="Expand sidebar"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>

      {/* User Card */}
      {!collapsed && (
        <div className="mx-3 mt-3 p-3 rounded-xl bg-white/5 border border-white/8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a4f8b] to-[#0a1b32] flex items-center justify-center text-xs font-black text-white shrink-0">
              {getInitials(user.name)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">{user.name}</p>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${ROLE_COLORS[user.role] || ROLE_COLORS.VIEWER}`}>
              {ROLE_LABELS[user.role] || user.role}
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-5 scrollbar-none">
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-2 mb-1.5">
                {group.label}
              </p>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={collapsed ? item.label : undefined}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                      isActive
                        ? 'bg-[#1a4f8b]/80 text-white shadow-sm shadow-blue-900/40'
                        : 'text-gray-400 hover:text-white hover:bg-white/6'
                    } ${collapsed ? 'justify-center' : ''}`}
                  >
                    <span className={`text-base leading-none shrink-0 ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-200'}`}>
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.label}</span>}
                    {!collapsed && isActive && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8931a]" />
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom Actions */}
      <div className={`p-3 border-t border-white/5 space-y-1 ${collapsed ? 'flex flex-col items-center' : ''}`}>
        <Link
          href="/en"
          target="_blank"
          title={collapsed ? 'View Public Portal' : undefined}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-white hover:bg-white/6 rounded-lg transition-all ${collapsed ? 'justify-center w-full' : ''}`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          {!collapsed && <span>Public Portal</span>}
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          title={collapsed ? 'Sign Out' : undefined}
          className={`flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-gray-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer w-full ${collapsed ? 'justify-center' : ''}`}
        >
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
