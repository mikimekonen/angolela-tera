'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Wrench,
  ShieldAlert,
  Clock,
  Phone,
  Mail,
  ArrowRight,
  AlertTriangle,
} from 'lucide-react'
import type { MaintenanceEvent } from '@/lib/dataStore'

interface MaintenanceScreenProps {
  locale?: string
  maintenanceEvent?: MaintenanceEvent
  settings?: Record<string, string>
}

export function MaintenanceScreen({
  locale = 'en',
  maintenanceEvent,
  settings,
}: MaintenanceScreenProps) {
  const isAmharic = locale === 'am'

  const reason = maintenanceEvent?.reason || 'Scheduled Government System Maintenance'
  const announcementEn =
    maintenanceEvent?.announcement_en ||
    'The Angolela Tera Woreda official portal is undergoing scheduled administrative maintenance. Public services will be restored shortly.'
  const announcementAm =
    maintenanceEvent?.announcement_am ||
    'የአንጎለላ ጠራ ወረዳ አስተዳደር ይፋዊ ፖርታል በታቀደ የጥገናና ማሻሻያ ስራ ላይ ይገኛል። የህዝብ አገልግሎቶች በቅርቡ ይመለሳሉ።'

  const expectedReopening = maintenanceEvent?.expectedReopening
    ? new Date(maintenanceEvent.expectedReopening).toLocaleString(isAmharic ? 'am-ET' : 'en-US', {
        dateStyle: 'full',
        timeStyle: 'short',
      })
    : null

  const emergencyPolice = settings?.emergency_police || '991 / +251 58 661 0110'
  const emergencyHealth = settings?.emergency_health || '907 / +251 58 661 0112'
  const contactPhone = settings?.contact_phone || '+251 (0) 58 661 0100'
  const contactEmail = settings?.contact_email || 'angolelatera1@gmail.com'

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950 font-sans relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-amber-500/10 via-emerald-600/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top Government Bar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 relative z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-amber-500/40 bg-slate-900 p-0.5">
              <Image
                src="/logo.png"
                alt="Angolela Tera Woreda"
                width={40}
                height={40}
                className="object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-wider uppercase text-amber-400">
                FDRE • Amhara National Regional State
              </p>
              <h1 className="text-sm font-bold text-slate-100">
                {isAmharic ? 'የአንጎለላ ጠራ ወረዳ አስተዳደር' : 'Angolela Tera Woreda Administration'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{isAmharic ? 'የስርዓት ጥገና' : 'Maintenance Mode'}</span>
          </div>
        </div>
      </header>

      {/* Main Hero Card */}
      <main className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="max-w-3xl w-full bg-slate-900/80 border border-slate-800 rounded-2xl shadow-2xl p-8 sm:p-12 backdrop-blur-xl">
          <div className="flex flex-col items-center text-center">
            {/* Maintenance Icon Badge */}
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 shadow-lg shadow-amber-500/5">
              <Wrench className="w-10 h-10 animate-bounce" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/50 text-red-300 text-xs font-semibold uppercase tracking-wider mb-4">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>{isAmharic ? 'ይፋዊ ማስታወቂያ' : 'Official Government Notice'}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              {isAmharic ? 'የታቀደ የመንግሥት ሲስተም ጥገናና ማሻሻያ' : 'Scheduled System Maintenance'}
            </h2>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mb-6">
              {isAmharic ? announcementAm : announcementEn}
            </p>

            {/* Expected Reopening Alert */}
            {expectedReopening && (
              <div className="w-full max-w-xl bg-amber-950/30 border border-amber-800/40 rounded-xl p-4 flex items-center gap-3 text-left mb-8">
                <Clock className="w-6 h-6 text-amber-400 shrink-0" />
                <div>
                  <p className="text-xs text-amber-300/80 font-medium">
                    {isAmharic ? 'የሚጠናቀቅበት የተገመተ ጊዜ' : 'Estimated Completion & Restoration'}
                  </p>
                  <p className="text-sm font-semibold text-amber-200">
                    {expectedReopening}
                  </p>
                </div>
              </div>
            )}

            {/* Reason details */}
            <div className="w-full text-left bg-slate-950/50 rounded-xl p-4 border border-slate-800 mb-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>{isAmharic ? 'የስራው ምክንያት' : 'Technical Scope'}</span>
              </div>
              <p className="text-sm text-slate-300">
                {reason}
              </p>
            </div>

            {/* Emergency Contacts Strip */}
            <div className="w-full border-t border-slate-800 pt-6">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                {isAmharic ? 'የአስቸኳይ ጊዜ እና የቀጥታ የስልክ መስመሮች' : 'Emergency & Public Helplines (24/7)'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-left">
                  <p className="text-xs text-slate-400 mb-1">{isAmharic ? 'የወረዳው ፖሊስ' : 'Woreda Police'}</p>
                  <a href={`tel:${emergencyPolice.split('/')[0].trim()}`} className="text-sm font-bold text-amber-400 hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{emergencyPolice}</span>
                  </a>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-left">
                  <p className="text-xs text-slate-400 mb-1">{isAmharic ? 'የጤና እና አምቡላንስ' : 'Health & Ambulance'}</p>
                  <a href={`tel:${emergencyHealth.split('/')[0].trim()}`} className="text-sm font-bold text-emerald-400 hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{emergencyHealth}</span>
                  </a>
                </div>
                <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3 text-left">
                  <p className="text-xs text-slate-400 mb-1">{isAmharic ? 'የአስተዳደር ጽ/ቤት' : 'Administration Desk'}</p>
                  <a href={`tel:${contactPhone}`} className="text-sm font-bold text-sky-400 hover:underline flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{contactPhone}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Super Admin recovery bypass */}
            <div className="mt-8 pt-4 border-t border-slate-800/60 w-full flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{contactEmail}</span>
              </span>
              <Link
                href="/admin/login"
                className="text-slate-400 hover:text-amber-400 transition-colors inline-flex items-center gap-1 underline underline-offset-4"
              >
                <span>{isAmharic ? 'የባለስልጣናት መግቢያ' : 'Super Admin Recovery'}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-600 relative z-10">
        <p>© 2026 Angolela Tera Woreda Administration. All rights reserved. Government of Ethiopia.</p>
      </footer>
    </div>
  )
}
