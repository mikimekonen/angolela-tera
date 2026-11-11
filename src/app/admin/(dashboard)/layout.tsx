import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { getMaintenanceStatus } from '@/lib/dataStore'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'
import { CommandPalette } from '@/components/admin/CommandPalette'
import { AlertOctagon, Wrench, ShieldAlert } from 'lucide-react'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  const maint = getMaintenanceStatus()

  // If maintenance mode is active and user is NOT a Super Admin, block console access
  if (maint.isActive && session.role !== 'SUPER_ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-2xl p-8 text-center shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto mb-4 text-amber-400">
            <Wrench className="w-8 h-8 animate-spin" />
          </div>
          <h2 className="text-xl font-bold mb-2">Staff Portal Under Maintenance</h2>
          <p className="text-sm text-slate-300 mb-6">
            The Angolela Tera Woreda system is currently in Emergency Maintenance Mode. Administrative access is restricted to Chief System Administrators until maintenance completes.
          </p>
          <div className="bg-slate-900/60 rounded-lg p-3 text-xs text-slate-400 mb-6 border border-slate-700 text-left">
            <p className="font-semibold text-slate-300 mb-1">Reason:</p>
            <p>{maint.currentEvent?.reason || 'Scheduled system maintenance'}</p>
          </div>
          <form action="/api/v1/auth/logout" method="POST">
            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-semibold transition"
            >
              Sign Out
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-row font-sans">
      <CommandPalette />
      <AdminSidebar user={session} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {maint.isActive && (
          <div className="bg-red-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-inner">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 animate-pulse" />
              <span>EMERGENCY MAINTENANCE MODE ACTIVE: Public website and standard staff logins are disabled.</span>
            </div>
            <Link
              href="/admin/super-admin"
              className="underline text-white hover:text-red-200 transition"
            >
              Manage Maintenance in Control Center →
            </Link>
          </div>
        )}
        <AdminHeader user={session} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 sm:p-8 max-w-7xl w-full mx-auto min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
