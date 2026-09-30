import React from 'react'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { mockOffices, mockServices, mockNews } from '@/data/mockData'
import { MOCK_BUSINESSES, MOCK_PARTNERS, MOCK_LEADERSHIP } from '@/data/entityData'

export default async function AdminDashboardPage() {
  const session = await getSession()

  const stats = [
    {
      title: 'Sector Directorates',
      value: mockOffices.length.toString(),
      change: 'Active across woreda',
      icon: '🏛️',
      href: '/admin/offices',
      color: 'border-l-blue-600',
    },
    {
      title: 'Citizen Services',
      value: mockServices.length.toString(),
      change: 'Fully documented procedures',
      icon: '📑',
      href: '/admin/services',
      color: 'border-l-emerald-600',
    },
    {
      title: 'Official News & Press',
      value: mockNews.length.toString(),
      change: 'Published in 3 languages',
      icon: '📰',
      href: '/admin/news',
      color: 'border-l-amber-600',
    },
    {
      title: 'Citizen Grievances',
      value: '24',
      change: '8 awaiting review',
      icon: '📥',
      href: '/admin/inquiries',
      color: 'border-l-purple-600',
    },
    {
      title: 'Private Enterprises',
      value: MOCK_BUSINESSES.length.toString(),
      change: 'Registered investors & plants',
      icon: '💼',
      href: '/admin/companies',
      color: 'border-l-teal-600',
    },
    {
      title: 'Partner Organizations',
      value: MOCK_PARTNERS.length.toString(),
      change: 'Active bilateral/academic ties',
      icon: '🤝',
      href: '/admin/partners',
      color: 'border-l-indigo-600',
    },
    {
      title: 'Sector Directors & Leaders',
      value: MOCK_LEADERSHIP.length.toString(),
      change: 'Cabinet & executive profiles',
      icon: '👤',
      href: '/admin/leadership',
      color: 'border-l-rose-600',
    },
  ]

  const recentLogs = [
    {
      action: 'LOGIN',
      actor: session?.name || 'Administrator',
      role: session?.role || 'SUPER_ADMIN',
      target: 'Administrative Portal',
      time: 'Just now',
      badge: 'bg-blue-100 text-blue-800',
    },
    {
      action: 'PUBLISH',
      actor: 'Woreda Cabinet Secretariat',
      role: 'ADMIN',
      target: 'News: 2026 Fiscal Year Budget Ratification',
      time: '2 hours ago',
      badge: 'bg-emerald-100 text-emerald-800',
    },
    {
      action: 'UPDATE',
      actor: 'Land Administration Directorate',
      role: 'OFFICE_EDITOR',
      target: 'Service: Rural Land Holding Certificate Verification',
      time: 'Yesterday',
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      action: 'INQUIRY_RECEIVED',
      actor: 'Citizen Grievance System',
      role: 'CITIZEN',
      target: 'Ticket: AGT-2026-4891 (Potable Water Supply Inflow)',
      time: 'Yesterday',
      badge: 'bg-purple-100 text-purple-800',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Woreda Cabinet Operations
            </span>
            <span className="text-xs font-bold text-gray-500">
              Role: <span className="text-[#0d2340] font-mono">{session?.role}</span>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight">
            Welcome, {session?.name}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Angolela Tera Woreda Central Executive Dashboard & Digital Governance Command Center.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/news"
            className="bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors inline-flex items-center gap-2"
          >
            <span>✍️</span>
            <span>Publish Announcement</span>
          </Link>
          <Link
            href="/admin/inquiries"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
          >
            <span>📥</span>
            <span>Review Inquiries</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => (
          <Link
            key={idx}
            href={s.href}
            className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all border-l-4 ${s.color} block`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                {s.title}
              </span>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div className="text-3xl font-black text-[#0d2340] mt-2">
              {s.value}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {s.change}
            </p>
          </Link>
        ))}
      </div>

      {/* Two Column Layout: Quick Management & Recent Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Operations Column */}
        <div className="lg:col-span-1 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-[#0d2340] border-b border-gray-100 pb-3">
            Quick Operations
          </h2>

          <div className="space-y-2.5">
            <Link
              href="/admin/news"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📰</span>
                <span>Manage News Releases</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/services"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">📑</span>
                <span>Update Citizen Services Catalog</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/offices"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🏛️</span>
                <span>Sector Directorate Directories</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/companies"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">💼</span>
                <span>Private Companies & Enterprises</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/partners"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🤝</span>
                <span>Partnership Organizations</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/leadership"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">👤</span>
                <span>Sector Directors & Leadership Profiles</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>

            <Link
              href="/admin/audit-log"
              className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-blue-50 border border-gray-100 hover:border-blue-200 transition-all text-xs font-semibold text-gray-800"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">🛡️</span>
                <span>Security & Audit Trails</span>
              </div>
              <span className="text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* Audit Log Stream Column */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
            <h2 className="text-base font-bold text-[#0d2340]">
              Recent Administrative Activity
            </h2>
            <Link
              href="/admin/audit-log"
              className="text-xs font-bold text-[#1a4f8b] hover:underline"
            >
              View Full Audit Trail →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentLogs.map((log, idx) => (
              <div key={idx} className="py-3.5 flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${log.badge}`}>
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-[#0d2340]">
                      {log.actor}
                    </span>
                    <span className="text-[11px] text-gray-400 font-mono">
                      ({log.role})
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {log.target}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {log.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
