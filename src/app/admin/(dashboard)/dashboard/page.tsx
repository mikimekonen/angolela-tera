import React from 'react'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getStore } from '@/lib/dataStore'

export default async function AdminDashboardPage() {
  const session = await getSession()
  const store = getStore()

  const pendingInquiries = store.inquiries.filter((i) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW').length

  const stats = [
    {
      title: 'Sector Directorates',
      value: store.offices.length.toString(),
      change: 'Executive bureaus & desks',
      icon: '🏛️',
      href: '/admin/offices',
      color: 'border-l-blue-600',
    },
    {
      title: 'Citizen Services',
      value: store.services.length.toString(),
      change: 'Fully documented procedures',
      icon: '📑',
      href: '/admin/services',
      color: 'border-l-emerald-600',
    },
    {
      title: 'Official News & Press',
      value: store.news.length.toString(),
      change: 'Published press & resolutions',
      icon: '📰',
      href: '/admin/news',
      color: 'border-l-amber-600',
    },
    {
      title: 'Citizen Grievances',
      value: store.inquiries.length.toString(),
      change: `${pendingInquiries} awaiting review`,
      icon: '📥',
      href: '/admin/inquiries',
      color: 'border-l-purple-600',
    },
    {
      title: 'Kebeles & Towns',
      value: store.kebeles.length.toString(),
      change: 'Urban & rural jurisdictions',
      icon: '🗺️',
      href: '/admin/kebeles',
      color: 'border-l-sky-600',
    },
    {
      title: 'Private Enterprises',
      value: store.companies.length.toString(),
      change: 'Industrial plants & businesses',
      icon: '💼',
      href: '/admin/companies',
      color: 'border-l-teal-600',
    },
    {
      title: 'Strategic Partners',
      value: store.partners.length.toString(),
      change: 'NGO & bilateral agreements',
      icon: '🤝',
      href: '/admin/partners',
      color: 'border-l-indigo-600',
    },
    {
      title: 'Investment Corridor',
      value: store.investments.length.toString(),
      change: 'Active land & lease opportunities',
      icon: '📈',
      href: '/admin/investments',
      color: 'border-l-orange-600',
    },
    {
      title: 'Public Tenders',
      value: store.tenders.length.toString(),
      change: 'Active procurement bids',
      icon: '⚖️',
      href: '/admin/tenders',
      color: 'border-l-rose-600',
    },
    {
      title: 'Authorized Admins',
      value: store.users.length.toString(),
      change: 'Scoped departmental editors',
      icon: '🛡️',
      href: '/admin/users',
      color: 'border-l-cyan-600',
    },
  ]

  const recentLogs = store.auditLogs.slice(0, 6)

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
            Official Administrative Control Center • Angolela Tera Woreda Administration (ሰሜን ሸዋ ዞን)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/admin/sections"
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            ⚙️ Homepage Sections
          </Link>
          <Link
            href="/admin/navigation"
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            🧭 Menu Management
          </Link>
          <Link
            href="/admin/news"
            className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg transition-colors shadow-2xs"
          >
            + Publish News / Release
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div>
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
          Government Platform Analytics & Directory Counts
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => (
            <Link
              key={idx}
              href={stat.href}
              className={`bg-white border border-gray-200 border-l-4 ${stat.color} rounded-xl p-5 hover:shadow-md transition-all group`}
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-2xl">{stat.icon}</span>
                <span className="text-xs text-gray-400 group-hover:text-[#1a4f8b] transition-colors">
                  Manage →
                </span>
              </div>
              <div className="text-2xl font-black text-[#0d2340]">
                {stat.value}
              </div>
              <div className="text-xs font-bold text-gray-700 mt-0.5">
                {stat.title}
              </div>
              <div className="text-[11px] text-gray-500 mt-1">
                {stat.change}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Fast Action Quick Links */}
      <div className="bg-gradient-to-r from-[#0d2340] to-[#1a4f8b] rounded-2xl p-6 text-white shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold text-[#FED100] uppercase tracking-wider">
              Super Admin Quick Actions
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Add New Government Entities Without Writing Code
            </h3>
            <p className="text-xs text-gray-300 mt-0.5">
              Newly created sectors, kebeles, leaders, investment opportunities, and partners will immediately appear on the public portal.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/kebeles"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + Add Kebele / Town
            </Link>
            <Link
              href="/admin/investments"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + Add Investment Offer
            </Link>
            <Link
              href="/admin/tenders"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-lg transition-colors"
            >
              + Add Tender Notice
            </Link>
            <Link
              href="/admin/users"
              className="px-3 py-1.5 bg-[#FED100] hover:bg-[#fed100]/90 text-[#0d2340] text-xs font-bold rounded-lg transition-colors shadow-2xs"
            >
              + Create Department Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column: Recent Audit Log & System Readiness */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Recent Audit Trail */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#0d2340]">
                Institutional Audit Trail & Activity Log
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time security tracking of changes, content publications, and administrative mutations.
              </p>
            </div>
            <Link
              href="/admin/audit-log"
              className="text-xs font-bold text-[#1a4f8b] hover:underline"
            >
              View Full Log →
            </Link>
          </div>

          <div className="divide-y divide-gray-100">
            {recentLogs.map((log: any, idx: number) => (
              <div key={idx} className="py-3.5 flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#1a4f8b] border border-blue-200">
                      {log.action}
                    </span>
                    <span className="text-xs font-bold text-[#0d2340]">
                      {log.userName || log.actor || 'Administrator'}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      • {log.entityType || 'Entity'}: {log.entityId}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {log.notes || 'Administrative action performed.'}
                  </p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap">
                  {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Portal Security & Configuration Status */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-[#0d2340] mb-1">
              Government Infrastructure Status
            </h2>
            <p className="text-xs text-gray-500 mb-6">
              Compliance checks & data integrity monitor.
            </p>

            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                <span className="text-gray-600">Dynamic CMS Engine</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">
                  ✓ Active (0 Hardcode)
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                <span className="text-gray-600">Granular RBAC</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">
                  ✓ Enforced
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                <span className="text-gray-600">Multilingual Locales</span>
                <span className="px-2 py-0.5 bg-blue-50 text-[#1a4f8b] font-bold rounded">
                  EN • AM • OM
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2 border-b border-gray-100">
                <span className="text-gray-600">Data Store Persistence</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">
                  ✓ Persistent Disk JSON
                </span>
              </div>
              <div className="flex items-center justify-between text-xs py-2">
                <span className="text-gray-600">Ethiopian Calendar Support</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-bold rounded">
                  ✓ Active (ዓ.ም.)
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <Link
              href="/admin/settings"
              className="block w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 text-center text-xs font-bold text-gray-700 rounded-lg transition-colors"
            >
              Official Portal Site Settings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
