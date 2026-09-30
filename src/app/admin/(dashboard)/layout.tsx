import React from 'react'
import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import AdminSidebar from '@/components/admin/AdminSidebar'
import AdminHeader from '@/components/admin/AdminHeader'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-row font-sans">
      <AdminSidebar user={session} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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
