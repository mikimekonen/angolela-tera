'use client'

import React, { useState, useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { SessionPayload } from '@/types'

const PAGE_TITLES: Record<string, { label: string; desc: string }> = {
  '/admin/dashboard': { label: 'Dashboard', desc: 'Executive command center overview' },
  '/admin/profile': { label: 'Administrator Profile', desc: 'Manage credentials, password & account security' },
  '/admin/news': { label: 'News & Press Releases', desc: 'Manage official announcements' },
  '/admin/offices': { label: 'Sector Offices', desc: 'Government directorate directory' },
  '/admin/services': { label: 'Citizen Services', desc: 'Public services catalog management' },
  '/admin/inquiries': { label: 'Grievances & Inquiries', desc: 'Citizen inquiry response desk' },
  '/admin/tenders': { label: 'Public Procurement', desc: 'Official government tenders and bid opportunities' },
  '/admin/kebeles': { label: 'Kebeles & Towns', desc: 'Territorial administrations and rural kebeles' },
  '/admin/investments': { label: 'Investment Corridor', desc: 'Strategic investment packages & incentives' },
  '/admin/projects': { label: 'Development Projects', desc: 'Capital investments and civic infrastructure' },
  '/admin/tourism': { label: 'Tourism & Heritage', desc: 'Cultural, historic and natural sites' },
  '/admin/companies': { label: 'Private Enterprises', desc: 'Commercial and industrial directory' },
  '/admin/partners': { label: 'Development Partners', desc: 'Cooperation agencies and NGOs' },
  '/admin/documents': { label: 'Document Library', desc: 'Official forms, circulars and public downloads' },
  '/admin/media': { label: 'Media Assets', desc: 'Centralized government media library' },
  '/admin/users': { label: 'Users & RBAC', desc: 'Account credentials and granular permissions' },
  '/admin/settings': { label: 'Official Site Settings', desc: 'Contact details, social links and institutional branding' },
  '/admin/audit-log': { label: 'Audit Log', desc: 'Institutional activity and security audit trail' },
}

function getPageInfo(pathname: string) {
  return (
    PAGE_TITLES[pathname] ||
    Object.entries(PAGE_TITLES).find(([key]) => pathname.startsWith(key + '/'))?.[1] ||
    { label: 'Admin Panel', desc: 'Angolela Tera Woreda' }
  )
}

function getCurrentTime() {
  return new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

function getCurrentDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AdminHeader({ user }: { user: SessionPayload }) {
  const pathname = usePathname()
  const router = useRouter()
  const pageInfo = getPageInfo(pathname)
  const [time, setTime] = useState(getCurrentTime())
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTime()), 30000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch {
      router.push('/admin/login')
    }
  }

  const initials = user.name
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()

  return (
    <header className="h-16 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-6 flex items-center justify-between sticky top-0 z-20 shadow-sm">
      {/* Left — Page Breadcrumb */}
      <div className="flex items-center gap-3">
        <div>
          <h2 className="text-sm font-bold text-[#0d2340] leading-tight">{pageInfo.label}</h2>
          <p className="text-[11px] text-gray-400 leading-tight hidden sm:block">{pageInfo.desc}</p>
        </div>
      </div>

      {/* Right — Status Bar */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* System Status */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-100">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-semibold text-emerald-700">System Online</span>
        </div>

        {/* Date & Time */}
        <div className="hidden lg:flex flex-col items-end">
          <span className="text-[11px] font-bold text-gray-700">{time}</span>
          <span className="text-[10px] text-gray-400">{getCurrentDate()}</span>
        </div>

        {/* Quick Command Trigger */}
        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))
          }}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-xs text-gray-500 font-medium transition-colors cursor-pointer"
          title="Quick jump to any module (Ctrl+K)"
        >
          <span>🔍</span>
          <span>Quick Jump</span>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white border border-gray-200 font-mono text-gray-400">
            Ctrl+K
          </kbd>
        </button>

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-gray-200" />

        {/* Interactive User Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-left"
            aria-label="User Account Menu"
          >
            <div className="flex flex-col items-end hidden sm:flex">
              <span className="text-[11px] font-bold text-[#0d2340] leading-tight">{user.name}</span>
              <span className="text-[10px] text-gray-400 leading-tight">{user.role.replace('_', ' ')}</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a4f8b] to-[#0d2340] flex items-center justify-center text-white text-xs font-black shadow-sm">
              {initials}
            </div>
            <svg
              className={`w-3.5 h-3.5 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-xs font-bold text-[#0d2340] truncate">{user.name}</p>
                <p className="text-[11px] text-gray-500 truncate">{user.email}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                    {user.role}
                  </span>
                </div>
              </div>

              <div className="py-1">
                <Link
                  href="/admin/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50/60 hover:text-[#1a4f8b] transition-colors"
                >
                  <span>👤</span>
                  <span>My Profile & Password</span>
                </Link>
                <Link
                  href="/admin/audit-log"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50/60 hover:text-[#1a4f8b] transition-colors"
                >
                  <span>📜</span>
                  <span>System Audit Log</span>
                </Link>
                <Link
                  href="/en"
                  target="_blank"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-blue-50/60 hover:text-[#1a4f8b] transition-colors"
                >
                  <span>🌐</span>
                  <span>Public Portal (Live)</span>
                </Link>
              </div>

              <div className="border-t border-gray-100 pt-1 mt-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors text-left cursor-pointer"
                >
                  <span>🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Version Tag */}
        <div className="hidden xl:flex items-center">
          <span className="px-2 py-0.5 rounded bg-gray-50 font-mono text-[10px] text-gray-400 border border-gray-200">
            v1.1.0
          </span>
        </div>
      </div>
    </header>
  )
}
