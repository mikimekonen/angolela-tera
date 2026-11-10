'use client'

import React, { useState, useEffect, use } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import {
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  ShieldCheck,
  Building2,
  Calendar,
  ArrowRight,
} from 'lucide-react'

interface TrackingPageProps {
  params: Promise<{ locale: string }>
}

interface TrackingData {
  trackingCode: string
  subject: string
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED' | string
  responseNotes?: string
  createdAt: string
  updatedAt?: string
}

export default function TrackingPortalPage({ params }: TrackingPageProps) {
  const { locale } = use(params) as { locale: Locale }
  const isAm = locale === 'am'

  const [inputCode, setInputCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<TrackingData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Auto-lookup if ?code= in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const codeFromUrl = urlParams.get('code')
      if (codeFromUrl) {
        setInputCode(codeFromUrl)
        performLookup(codeFromUrl)
      }
    }
  }, [])

  const performLookup = async (code: string) => {
    const trimmed = code.trim()
    if (!trimmed) {
      setError(isAm ? 'እባክዎ ትክክለኛ የክትትል ኮድ ያስገቡ።' : 'Please provide a valid tracking reference code.')
      return
    }

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(`/api/v1/inquiries?trackingCode=${encodeURIComponent(trimmed)}`)
      const data = await res.json()

      if (data.success && data.data) {
        setResult(data.data)
      } else {
        setError(
          data.error ||
            (isAm
              ? 'የተሰጠው የክትትል ቁጥር አልተገኘም። እባክዎ ቁጥሩን በትክክል መጻፍዎን ያረጋግጡ።'
              : 'The requested tracking code was not found. Please verify the reference characters.')
        )
      }
    } catch {
      setError(
        isAm
          ? 'ከአገልጋይ ጋር መገናኘት አልተቻለም። እባክዎ ቆየት ብለው ይሞክሩ።'
          : 'Unable to connect to the tracking server. Please try again later.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performLookup(inputCode)
  }

  const content = {
    tag: isAm ? 'የዜጎች አቤቱታና አገልግሎት ክትትል' : 'Citizen Request & Grievance Tracking',
    title: isAm ? 'የጉዳይ ወይም የአቤቱታ ደረጃ መከታተያ' : 'Official Service Request & Grievance Tracker',
    subtitle: isAm
      ? 'በአንጎለላ ጠራ ወረዳ አስተዳደር ያቀረቡትን አቤቱታ፣ የመሬት ይዞታ ጥያቄ ወይም አገልግሎት የደረሰበትን አስተዳደራዊ ደረጃ በኮድዎ ይከታተሉ።'
      : 'Verify real-time review progress, assigned sector desks, SLA turnaround status, and official resolution findings for your submitted inquiries or grievances.',
    inputPlaceholder: isAm ? 'ምሳሌ፡ AT-GR-2026-0042' : 'Enter tracking code (e.g. AT-GR-2026-0042)...',
    searchBtn: isAm ? 'ደረጃውን አረጋግጥ' : 'Check Status',
    searchingBtn: isAm ? 'በማረጋገጥ ላይ...' : 'Checking...',
    ticketDetails: isAm ? 'የጉዳዩ ይፋዊ ዝርዝር' : 'Official Case Details',
    trackingCodeLabel: isAm ? 'የክትትል ቁጥር' : 'Tracking Reference',
    subjectLabel: isAm ? 'የቀረበው ርዕስ' : 'Petition Subject',
    submittedDate: isAm ? 'የቀረበበት ቀን' : 'Submission Date',
    statusLabel: isAm ? 'የአሁኑ ደረጃ' : 'Current Review Status',
    resolutionNotes: isAm ? 'ይፋዊ አስተዳደራዊ ምላሽና ውሳኔ' : 'Official Administrative Resolution & Notes',
    noNotesYet: isAm
      ? 'ጉዳይዎ በሚመለከተው ሴክተር ጽ/ቤት በምርመራ ላይ ይገኛል። ውሳኔው እንደተጠናቀቀ እዚህ ላይ ይለጠፋል።'
      : 'Your petition is actively under review by the designated sector desk. Official notes will appear here once finalized.',
    submitNewTitle: isAm ? 'አዲስ አቤቱታ ወይም የአገልግሎት ጥያቄ አለዎት?' : 'Need to submit a new petition or report an issue?',
    submitNewDesc: isAm
      ? 'የዜጎች ቅሬታ ሰሚ መስኮትን በመጠቀም አዲስ አቤቱታ ማቅረብ እና የክትትል ቁጥር ማግኘት ይችላሉ።'
      : 'Use the official citizen grievance desk to submit a formal petition and receive an instant reference tracking number.',
    submitNewBtn: isAm ? 'አዲስ አቤቱታ ያቅርቡ' : 'Submit New Petition',
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'RESOLVED':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          label: isAm ? 'እልባት ያገኘ / የተጠናቀቀ' : 'Resolved & Concluded',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
        }
      case 'UNDER_REVIEW':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-300',
          label: isAm ? 'በምርመራ / በግምገማ ሂደት ላይ' : 'Active Administrative Review',
          icon: <Clock className="w-4 h-4 text-blue-600" />,
        }
      case 'REJECTED':
        return {
          bg: 'bg-red-50 text-red-800 border-red-300',
          label: isAm ? 'ውድቅ የተደረገ' : 'Declined / Incomplete Evidence',
          icon: <AlertCircle className="w-4 h-4 text-red-600" />,
        }
      default:
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-300',
          label: isAm ? 'በመዝገብ ላይ የሰፈረ' : 'Registered / Queued',
          icon: <Clock className="w-4 h-4 text-amber-600" />,
        }
    }
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6 font-medium">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {isAm ? 'መነሻ' : 'Home'}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/contact`} className="hover:text-[#1a4f8b] transition-colors">
            {isAm ? 'ቅሬታና አድራሻ' : 'Contact & Grievance'}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-bold">{isAm ? 'ክትትል' : 'Track'}</span>
        </nav>

        {/* Hero Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs mb-8">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{content.tag}</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight mt-3">
            {content.title}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
            {content.subtitle}
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value)}
                placeholder={content.inputPlaceholder}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono text-[#0d2340] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#1a4f8b] focus:border-transparent transition-all"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs transition-colors disabled:opacity-50 shrink-0"
            >
              <span>{loading ? content.searchingBtn : content.searchBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-3 text-[11px] text-gray-500 flex items-center gap-2">
            <span>{isAm ? 'የናሙና መለያ ኮድ፡' : 'Example active reference:'}</span>
            <button
              type="button"
              onClick={() => {
                setInputCode('AT-GR-2026-0042')
                performLookup('AT-GR-2026-0042')
              }}
              className="font-mono text-[#1a4f8b] hover:underline font-bold"
            >
              AT-GR-2026-0042
            </button>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-xs sm:text-sm text-red-800 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Search Results Display */}
        {result && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs mb-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                  {content.trackingCodeLabel}
                </span>
                <p className="text-xl font-extrabold font-mono text-[#1a4f8b] mt-0.5">
                  {result.trackingCode}
                </p>
              </div>

              {(() => {
                const badge = getStatusBadge(result.status)
                return (
                  <div
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold ${badge.bg}`}
                  >
                    {badge.icon}
                    <span>{badge.label}</span>
                  </div>
                )
              })()}
            </div>

            {/* Stepper Progress Bar */}
            <div className="py-2">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                {/* Step 1 */}
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mb-1 shadow-xs">
                    ✓
                  </div>
                  <span className="font-bold text-gray-900">{isAm ? '1. የቀረበ' : '1. Submitted'}</span>
                  <span className="text-[10px] text-gray-500">
                    {result.createdAt ? new Date(result.createdAt).toLocaleDateString() : 'Recorded'}
                  </span>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow-xs ${
                      result.status === 'UNDER_REVIEW' || result.status === 'RESOLVED'
                        ? 'bg-[#1a4f8b] text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    2
                  </div>
                  <span className="font-bold text-gray-900">{isAm ? '2. በምርመራ ላይ' : '2. Under Review'}</span>
                  <span className="text-[10px] text-gray-500">{isAm ? 'የሴክተር ፍተሻ' : 'Sector Desk'}</span>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-1 shadow-xs ${
                      result.status === 'RESOLVED'
                        ? 'bg-emerald-600 text-white'
                        : result.status === 'REJECTED'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    3
                  </div>
                  <span className="font-bold text-gray-900">{isAm ? '3. ውሳኔ / እልባት' : '3. Resolution'}</span>
                  <span className="text-[10px] text-gray-500">{isAm ? 'ይፋዊ ምላሽ' : 'Final Notes'}</span>
                </div>
              </div>
            </div>

            {/* Metadata Rows */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs">
              <div>
                <span className="text-gray-500 block mb-0.5">{content.subjectLabel}:</span>
                <span className="font-bold text-[#0d2340] text-sm">{result.subject}</span>
              </div>
              <div>
                <span className="text-gray-500 block mb-0.5">{content.submittedDate}:</span>
                <span className="font-semibold text-gray-800">
                  {result.createdAt ? new Date(result.createdAt).toLocaleString() : 'N/A'}
                </span>
              </div>
            </div>

            {/* Official Response Notes */}
            <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1a4f8b] uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>{content.resolutionNotes}</span>
              </div>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-sans">
                {result.responseNotes || content.noNotesYet}
              </p>
            </div>
          </div>
        )}

        {/* Submit New Request CTA */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-[#0d2340]">{content.submitNewTitle}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{content.submitNewDesc}</p>
          </div>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-1.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors shrink-0"
          >
            <span>{content.submitNewBtn}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
