import React from 'react'
import Link from 'next/link'
import { getSession } from '@/lib/auth'
import { getStore } from '@/lib/dataStore'

export default async function AdminDashboardPage() {
  const session = await getSession()
  const store = getStore()

  // Inquiries SLA analysis
  const pendingInquiries = (store.inquiries || []).filter(
    (i) => i.status === 'SUBMITTED' || i.status === 'UNDER_REVIEW'
  )
  const resolvedInquiries = (store.inquiries || []).filter(
    (i) => i.status === 'RESOLVED'
  )

  // News review queue
  const reviewNews = (store.news || []).filter(
    (n) => n.status === 'REVIEW' || n.status === 'DRAFT'
  )
  const publishedNews = (store.news || []).filter(
    (n) => n.status === 'PUBLISHED' || !n.status
  )

  // Tenders deadline analysis
  const activeTenders = (store.tenders || []).filter(
    (t) => t.tenderStatus === 'ACTIVE'
  )
  const closingSoonTenders = activeTenders.filter((t) => {
    const diff = new Date(t.closingDate).getTime() - Date.now()
    return diff > 0 && diff < 5 * 86400000 // less than 5 days
  })

  // Projects in progress
  const activeProjects = (store.developmentProjects || []).filter(
    (p) => p.status === 'IN_PROGRESS'
  )

  // Media assets count
  const mediaCount = (store.mediaAssets || []).length

  // Recent audit trail (latest 6 entries)
  const recentLogs = (store.auditLogs || []).slice(0, 6)

  // Role info
  const isSuperAdmin = session?.role === 'SUPER_ADMIN'
  const isOfficeEditor = session?.role === 'OFFICE_EDITOR'

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* 1. Welcome Header Banner */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
              Woreda Cabinet Operations Center
            </span>
            <span className="text-xs font-bold text-gray-500">
              Role:{' '}
              <span className="text-[#0d2340] font-mono px-2 py-0.5 rounded bg-gray-100 border border-gray-200">
                {session?.role}
              </span>
            </span>
            {isOfficeEditor && session?.officeId && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full capitalize">
                🏛️ {session.officeId} Desk
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight">
            Good day, {session?.name}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 max-w-2xl">
            Official Administrative Command Center • Angolela Tera Woreda Administration (ሰሜን ሸዋ ዞን). Oversee public communications, statutory service SLAs, and civic infrastructure.
          </p>
        </div>

        {/* Quick Fast Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/news"
            className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl transition-all shadow-xs"
          >
            + Publish News
          </Link>
          <Link
            href="/admin/media"
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
          >
            📁 Media Library
          </Link>
          <Link
            href="/en"
            target="_blank"
            className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-colors"
          >
            🌐 Public Portal ↗
          </Link>
        </div>
      </div>

      {/* 2. Critical Attention & Urgent Action Banner */}
      {(pendingInquiries.length > 0 || reviewNews.length > 0 || closingSoonTenders.length > 0) && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <h2 className="text-xs font-extrabold text-amber-950 uppercase tracking-wider">
              Immediate Administrative Action Items ({pendingInquiries.length + reviewNews.length + closingSoonTenders.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Citizen Grievance SLA Alerts */}
            {pendingInquiries.length > 0 && (
              <Link
                href="/admin/inquiries"
                className="bg-white/90 hover:bg-white p-3.5 rounded-xl border border-amber-200/80 transition-all block group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0d2340]">Citizen Grievances</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                    {pendingInquiries.length} Pending
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">
                  Statutory 48-hour Civil Service response window active. Review citizen reports now.
                </p>
                <span className="text-[11px] font-bold text-[#1a4f8b] mt-2 inline-block group-hover:underline">
                  Respond to Grievances →
                </span>
              </Link>
            )}

            {/* Editorial Review Queue */}
            {reviewNews.length > 0 && (
              <Link
                href="/admin/news"
                className="bg-white/90 hover:bg-white p-3.5 rounded-xl border border-amber-200/80 transition-all block group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0d2340]">Editorial Queue</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-900">
                    {reviewNews.length} Awaiting Review
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">
                  Official press releases and articles drafted and waiting for publication certification.
                </p>
                <span className="text-[11px] font-bold text-[#1a4f8b] mt-2 inline-block group-hover:underline">
                  Open Editorial Gate →
                </span>
              </Link>
            )}

            {/* Procurement Deadlines */}
            {closingSoonTenders.length > 0 && (
              <Link
                href="/admin/tenders"
                className="bg-white/90 hover:bg-white p-3.5 rounded-xl border border-amber-200/80 transition-all block group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#0d2340]">Tenders Closing Soon</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-900">
                    {closingSoonTenders.length} Active Bids
                  </span>
                </div>
                <p className="text-[11px] text-gray-600 mt-1">
                  Bidding submission deadlines approaching within 5 calendar days.
                </p>
                <span className="text-[11px] font-bold text-[#1a4f8b] mt-2 inline-block group-hover:underline">
                  Check Bid Ledger →
                </span>
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 3. Primary Government KPI Cards */}
      <div>
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">
          Government Platform Analytics & Directory Counts
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <Link
            href="/admin/news"
            className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-2xl mb-2">
              <span>📰</span>
              <span className="text-[10px] text-gray-400 group-hover:text-[#1a4f8b]">Manage →</span>
            </div>
            <div className="text-2xl font-black text-[#0d2340]">{publishedNews.length}</div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Published News</div>
            <div className="text-[11px] text-gray-400 mt-1">Official releases</div>
          </Link>

          <Link
            href="/admin/services"
            className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-2xl mb-2">
              <span>📋</span>
              <span className="text-[10px] text-gray-400 group-hover:text-[#1a4f8b]">Manage →</span>
            </div>
            <div className="text-2xl font-black text-[#0d2340]">{store.services?.length || 0}</div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Citizen Services</div>
            <div className="text-[11px] text-gray-400 mt-1">Documented procedures</div>
          </Link>

          <Link
            href="/admin/inquiries"
            className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-2xl mb-2">
              <span>📥</span>
              <span className="text-[10px] text-gray-400 group-hover:text-[#1a4f8b]">Manage →</span>
            </div>
            <div className="text-2xl font-black text-purple-700">
              {pendingInquiries.length} <span className="text-xs font-normal text-gray-400">/ {store.inquiries?.length || 0}</span>
            </div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Grievance SLA</div>
            <div className="text-[11px] text-emerald-600 mt-1">{resolvedInquiries.length} closed cases</div>
          </Link>

          <Link
            href="/admin/projects"
            className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-2xl mb-2">
              <span>🏗️</span>
              <span className="text-[10px] text-gray-400 group-hover:text-[#1a4f8b]">Manage →</span>
            </div>
            <div className="text-2xl font-black text-[#0d2340]">{store.developmentProjects?.length || 0}</div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Capital Projects</div>
            <div className="text-[11px] text-blue-600 mt-1">{activeProjects.length} under construction</div>
          </Link>

          <Link
            href="/admin/tenders"
            className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-2xl mb-2">
              <span>⚖️</span>
              <span className="text-[10px] text-gray-400 group-hover:text-[#1a4f8b]">Manage →</span>
            </div>
            <div className="text-2xl font-black text-[#0d2340]">{activeTenders.length}</div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Open Tenders</div>
            <div className="text-[11px] text-gray-400 mt-1">Public procurement</div>
          </Link>

          <Link
            href="/admin/media"
            className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between text-2xl mb-2">
              <span>🖼️</span>
              <span className="text-[10px] text-gray-400 group-hover:text-[#1a4f8b]">Manage →</span>
            </div>
            <div className="text-2xl font-black text-[#1a4f8b]">{mediaCount}</div>
            <div className="text-xs font-bold text-gray-700 mt-0.5">Media Assets</div>
            <div className="text-[11px] text-gray-400 mt-1">Photos, videos, PDFs</div>
          </Link>
        </div>
      </div>

      {/* 4. Super Admin Fast Action Ribbon */}
      {isSuperAdmin && (
        <div className="bg-gradient-to-r from-[#0d2340] to-[#1a4f8b] rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <span className="text-[11px] font-bold text-[#FED100] uppercase tracking-wider">
              Super Admin Executive Plane
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Direct Governance Actions & Configurations
            </h3>
            <p className="text-xs text-gray-300 mt-0.5 max-w-xl">
              Manage system-wide permissions, provision sector administrators, update emergency broadcast advisories, and review the security audit log.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/admin/users"
              className="px-3.5 py-2 bg-[#FED100] hover:bg-[#fed100]/90 text-[#0d2340] text-xs font-bold rounded-xl transition-all shadow-xs"
            >
              🛡️ Admin Users & RBAC
            </Link>
            <Link
              href="/admin/settings"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              ⚙️ Site Settings
            </Link>
            <Link
              href="/admin/audit-log"
              className="px-3.5 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              📜 Full Audit Trail
            </Link>
          </div>
        </div>
      )}

      {/* 5. Two Columns: Institutional Audit Trail & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Real-time Audit Trail */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-bold text-[#0d2340]">
                Institutional Security & Activity Audit Log
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Real-time cryptographic audit trail of editorial mutations, publication actions, and security credentials.
              </p>
            </div>
            <Link
              href="/admin/audit-log"
              className="text-xs font-bold text-[#1a4f8b] hover:underline"
            >
              View Full History →
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
                  <p className="text-xs text-gray-600">{log.notes || 'No log details provided.'}</p>
                </div>
                <span className="text-[11px] text-gray-400 whitespace-nowrap font-mono">
                  {new Date(log.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Technical Readiness & System Health */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-[#0d2340] border-b border-gray-100 pb-3">
              Platform Operational Status
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Core Web Framework:</span>
                <span className="font-bold text-gray-800">Next.js 16 (App Router)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">TypeScript Typecheck:</span>
                <span className="font-bold text-emerald-700">✓ 100% Type-Safe</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Session Authentication:</span>
                <span className="font-bold text-emerald-700">✓ Secure HTTP-Only JWT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Media Upload Security:</span>
                <span className="font-bold text-emerald-700">✓ Magic Bytes Verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Civil Service SLA:</span>
                <span className="font-bold text-[#1a4f8b]">48-Hour Statutory Desk</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-500 font-medium">Languages Supported:</span>
                <span className="font-bold text-gray-800">EN • አማርኛ • Oromoo</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <Link
                href="/admin/profile"
                className="w-full flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 transition-colors"
              >
                <span>👤</span>
                <span>My Profile & Credentials</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
