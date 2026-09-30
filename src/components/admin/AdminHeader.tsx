'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import type { SessionPayload } from '@/types'

const PAGE_TITLES: Record<string, { label: string; desc: string }> = {
  '/admin/dashboard': { label: 'Dashboard', desc: 'Executive command center overview' },
  '/admin/news': { label: 'News & Press Releases', desc: 'Manage official announcements' },
  '/admin/offices': { label: 'Sector Offices', desc: 'Government directorate directory' },
  '/admin/services': { label: 'Citizen Services', desc: 'Public services catalog management' },
  '/admin/inquiries': { label: 'Grievances & Inquiries', desc: 'Citizen inquiry response desk' },
  '/admin/audit-log': { label: 'Audit Log', desc: 'Institutional activity trail' },
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
  const pageInfo = getPageInfo(pathname)
  const [time, setTime] = useState(getCurrentTime())

  useEffect(() => {
    const interval = setInterval(() => setTime(getCurrentTime()), 30000)
    return () => clearInterval(interval)
  }, [])

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

        {/* Divider */}
        <div className="hidden sm:block w-px h-6 bg-gray-200" />

        {/* User Badge */}
        <div className="flex items-center gap-2">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[11px] font-bold text-[#0d2340] leading-tight">{user.name}</span>
            <span className="text-[10px] text-gray-400 leading-tight">{user.role.replace('_', ' ')}</span>
          </div>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1a4f8b] to-[#0d2340] flex items-center justify-center text-white text-xs font-black shadow-sm">
            {user.name.split(' ').slice(0, 2).map((n: string) => n[0]).join('').toUpperCase()}
          </div>
        </div>

        {/* Version Tag */}
        <div className="hidden xl:flex items-center">
          <span className="px-2 py-0.5 rounded bg-gray-50 font-mono text-[10px] text-gray-400 border border-gray-200">
            v1.0.4
          </span>
        </div>
      </div>
    </header>
  )
}
