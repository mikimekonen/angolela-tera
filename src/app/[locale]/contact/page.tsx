'use client'

import React, { useState, use } from 'react'
import type { Locale } from '@/i18n/config'

interface ContactPageProps {
  params: Promise<{ locale: string }>
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = use(params) as { locale: Locale }

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    kebele: '',
    category: 'grievance',
    subject: '',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [issuedCode, setIssuedCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Tracking Lookup State
  const [trackingInput, setTrackingInput] = useState('')
  const [trackingLoading, setTrackingLoading] = useState(false)
  const [trackingResult, setTrackingResult] = useState<{
    trackingCode: string
    subject: string
    status: string
    responseNotes?: string
    createdAt: string
  } | null>(null)
  const [trackingError, setTrackingError] = useState<string | null>(null)

  const content = {
    en: {
      tag: 'Citizen Voice & Direct Engagement',
      title: 'Contact Us & Citizen Grievance Desk',
      subtitle: 'Reach out to Angolela Tera Woreda Administration. Submit citizen feedback, report service disruptions, or track your grievance resolution status.',
      formTitle: 'Submit an Official Grievance or Inquiry',
      nameLabel: 'Full Legal Name *',
      namePlaceholder: 'e.g., Abebe Kebede Tessema',
      phoneLabel: 'Telephone Number *',
      phonePlaceholder: 'e.g., 0911 234 567',
      emailLabel: 'Email Address *',
      emailPlaceholder: 'name@example.com',
      kebeleLabel: 'Kebele of Residence',
      kebelePlaceholder: 'e.g., Chacha 01, Cheki, Kotu...',
      categoryLabel: 'Subject Category *',
      categories: [
        { value: 'grievance', label: 'Citizen Service Grievance / Appeal' },
        { value: 'water_disruption', label: 'Potable Water & Irrigation Pipeline Disruption' },
        { value: 'land', label: 'Rural Land Holding & Cadastral Boundaries' },
        { value: 'general', label: 'General Administrative Inquiry' },
        { value: 'investment', label: 'Investment & Commercial Permitting' },
        { value: 'agriculture', label: 'Agricultural Input & Fertilizer Voucher' },
      ],
      subjectLabel: 'Petition Subject *',
      subjectPlaceholder: 'Brief summary of your petition...',
      messageLabel: 'Detailed Message / Petition Statement *',
      messagePlaceholder: 'Provide clear details including any dates, locations, and previous reference notes...',
      submitBtn: 'Submit Official Petition',
      submittingBtn: 'Submitting...',
      successTitle: 'Inquiry Successfully Submitted!',
      successDesc: 'Your petition has been officially recorded in the Woreda Citizen Charter registry. Please keep your tracking code safe:',
      submitAnother: 'Submit Another Petition',
      trackTitle: 'Track Your Existing Grievance / Petition',
      trackSubtitle: 'Enter your tracking code (e.g. AT-GR-2026-0042) to check the current review status and official resolution notes.',
      trackPlaceholder: 'Enter Tracking Code...',
      trackBtn: 'Check Status',
      hqTitle: 'Administration Headquarters',
      hqAddress: 'Main Administrative Complex, Chacha Town, North Shewa Zone, Amhara Region',
      hqHours: 'Monday – Friday: 8:30 AM – 5:30 PM (Closed 12:30 – 1:30 PM)',
      hqPhone: 'General Desk: +251 (0) 58 661 0100',
      hqEmail: 'info@angolela-tera.gov.et',
      hotlinesTitle: 'Public Safety Emergency Hotlines',
      policeHotline: 'Police Emergency Dispatch: 991 / +251 58 661 0110',
      hospitalHotline: 'Medical Emergency & Health Post: 907 / +251 58 661 0112',
      investmentHotline: 'Investment Desk: +251 58 661 0180',
    },
    am: {
      tag: 'የዜጎች ድምፅና ቀጥተኛ ተሳትፎ',
      title: 'አድራሻና የዜጎች ቅሬታ ማስተናገጃ መስኮት',
      subtitle: 'የአንጎሌላ ተራ ወረዳ አስተዳደርን ያግኙ። ቅሬታዎን፣ የአገልግሎት መስተጓጎልን ወይም ጥያቄዎን ያቅርቡ፤ የደረሰበትንም ደረጃ በኮድ ይከታተሉ።',
      formTitle: 'አቤቱታ ወይም የአገልግሎት ጥያቄ ማቅረቢያ',
      nameLabel: 'ሙሉ ስም *',
      namePlaceholder: 'ምሳሌ፡ አበበ ከበደ ተሰማ',
      phoneLabel: 'ስልክ ቁጥር *',
      phonePlaceholder: 'ምሳሌ፡ 0911 234 567',
      emailLabel: 'ኢሜይል አድራሻ *',
      emailPlaceholder: 'name@example.com',
      kebeleLabel: 'የመኖሪያ ቀበሌ',
      kebelePlaceholder: 'ምሳሌ፡ ጫቻ 01፣ ጨቂ፣ ኮቱ...',
      categoryLabel: 'የጉዳዩ ዘርፍ *',
      categories: [
        { value: 'grievance', label: 'የአገልግሎት አሰጣጥ ቅሬታ / አቤቱታ' },
        { value: 'water_disruption', label: 'የመጠጥ ውሃና መስኖ መስመር መቆራረጥ' },
        { value: 'land', label: 'የመሬት ይዞታና ወሰን ጉዳዮች' },
        { value: 'general', label: 'አጠቃላይ አስተዳደራዊ ጥያቄ' },
        { value: 'investment', label: 'የንግድና ኢንቨስትመንት ፈቃድ' },
        { value: 'agriculture', label: 'የግብርና ግብዓትና ማዳበሪያ አቅርቦት' },
      ],
      subjectLabel: 'የአቤቱታው ርዕስ *',
      subjectPlaceholder: 'የጉዳዩ አጭር ማጠቃለያ...',
      messageLabel: 'ዝርዝር መልዕክት / ማብራሪያ *',
      messagePlaceholder: 'ስለ ጉዳዩ ዝርዝር መረጃ፣ ቦታና ሁኔታውን በግልጽ ያስቀምጡ...',
      submitBtn: 'አቤቱታውን መዝግብ',
      submittingBtn: 'በመመዝገብ ላይ...',
      successTitle: 'አቤቱታዎ በስኬት ተመዝግቧል!',
      successDesc: 'አቤቱታዎ በወረዳው የዜጎች ቻርተር መዝገብ ሰፍሯል። እባክዎ ይህንን የመከታተያ ኮድ በጥንቃቄ ይያዙ፡',
      submitAnother: 'ሌላ አቤቱታ ለማቅረብ',
      trackTitle: 'የቀረበ አቤቱታ የደረሰበትን ደረጃ ይከታተሉ',
      trackSubtitle: 'የመከታተያ ኮድዎን (ምሳሌ፡ AT-GR-2026-0042) በማስገባት የአቤቱታዎን ሂደትና ምላሽ ይመልከቱ።',
      trackPlaceholder: 'የመከታተያ ኮድ ያስገቡ...',
      trackBtn: 'ደረጃውን መርምር',
      hqTitle: 'የወረዳው ዋና አስተዳደር ጽ/ቤት',
      hqAddress: 'ዋናው የአስተዳደር ቅጥር ግቢ፣ ጫቻ ከተማ፣ ሰሜን ሸዋ ዞን፣ አማራ ክልል',
      hqHours: 'ከሰኞ – አርብ፡ ከጠዋቱ 2:30 – 11:30 (የምሳ እረፍት 6:30 – 7:30)',
      hqPhone: 'ዋና ስልክ፡ +251 (0) 58 661 0100',
      hqEmail: 'info@angolela-tera.gov.et',
      hotlinesTitle: 'የአደጋ ጊዜና የህዝብ ደህንነት ስልኮች',
      policeHotline: 'የወረዳ ፖሊስ አደጋ መቆጣጠሪያ፡ 991 / +251 58 661 0110',
      hospitalHotline: 'የህክምናና አምቡላንስ ጥሪ፡ 907 / +251 58 661 0112',
      investmentHotline: 'የኢንቨስትመንት መስኮት፡ +251 58 661 0180',
    },
    om: {
      tag: 'Sagalee Lammii',
      title: 'Quunnamtii fi Komii Lammiilee',
      subtitle: 'Bulchiinsa Aanaa Angolallaa Xaraa quunnamaa. Komii keessan galchaa, deebii argadhaa.',
      formTitle: 'Komii Galchuu',
      nameLabel: 'Maqaa Guutuu *',
      namePlaceholder: 'Fkn: Tolasaa Baqqalaa',
      phoneLabel: 'Bilbila *',
      phonePlaceholder: '0911 234 567',
      emailLabel: 'Imeelii *',
      emailPlaceholder: 'name@example.com',
      kebeleLabel: 'Ganda',
      kebelePlaceholder: 'Ganda jiraattani...',
      categoryLabel: 'Gosa Dhimmaa *',
      categories: [
        { value: 'grievance', label: 'Komii Tajaajilaa' },
        { value: 'water_disruption', label: 'Dhimma Bishaan Dhugaatii' },
        { value: 'land', label: 'Dhimma Lafaa' },
        { value: 'general', label: 'Gaaffii Waliigalaa' },
        { value: 'investment', label: 'Invastimantii' },
        { value: 'agriculture', label: 'Galtee Qonnaa' },
      ],
      subjectLabel: 'Mata-duree *',
      subjectPlaceholder: 'Ibsa gabaabaa...',
      messageLabel: 'Ibsa Dhimmaa *',
      messagePlaceholder: 'Odeeffannoo bal\'aa barreessaa...',
      submitBtn: 'Galchi',
      submittingBtn: 'Galchaa jira...',
      successTitle: 'Galmaa\'eera!',
      successDesc: 'Iyyannoon keessan lakkoofsa eegumsaa kanaan galmaa\'eera:',
      submitAnother: 'Iyyannoo Biroo',
      trackTitle: 'Sadarkaa Iyyannoo Hordofaa',
      trackSubtitle: 'Koodii keessan galchuun sadarkaa iyyannoo keessanii ilaalaa.',
      trackPlaceholder: 'Koodii galchaa...',
      trackBtn: 'Ilaali',
      hqTitle: 'Waajjira Ol\'aanaa',
      hqAddress: 'Magaalaa Caccetti, Godina Shawaa Kaabaa',
      hqHours: 'Wiixata – Jimmata: 2:30 – 11:30',
      hqPhone: 'Bilbila: +251 (0) 58 661 0100',
      hqEmail: 'info@angolela-tera.gov.et',
      hotlinesTitle: 'Bilbila Ariifachiisaa',
      policeHotline: 'Poolisii: 991 / +251 58 661 0110',
      hospitalHotline: 'Hospitaala: 907 / +251 58 661 0112',
      investmentHotline: 'Invastimantii: +251 58 661 0180',
    },
  }[locale]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || `${formData.category.toUpperCase()} - ${formData.kebele || 'Woreda'}`,
          message: formData.message,
          category: formData.category,
        }),
      })
      const data = await res.json()
      if (data.success) {
        setIssuedCode(data.trackingCode)
        setSubmitted(true)
      } else {
        alert(data.error || 'Failed to submit.')
      }
    } catch {
      alert('Network request error.')
    } finally {
      setLoading(false)
    }
  }

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingInput.trim()) return
    setTrackingLoading(true)
    setTrackingResult(null)
    setTrackingError(null)

    try {
      const res = await fetch(`/api/v1/inquiries?trackingCode=${encodeURIComponent(trackingInput.trim())}`)
      const data = await res.json()
      if (data.success && data.data) {
        setTrackingResult(data.data)
      } else {
        setTrackingError('No petition or inquiry found with this tracking code. Please verify the code.')
      }
    } catch {
      setTrackingError('Network error checking tracking code.')
    } finally {
      setTrackingLoading(false)
    }
  }

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              {content.tag}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Form and Contact Information Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact & Grievance Form (7 cols) */}
          <div className="lg:col-span-7 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h2 className="text-lg font-bold text-[#0d2340] border-b border-gray-100 pb-3 mb-6">
              {content.formTitle}
            </h2>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 sm:p-8 text-center space-y-4">
                <span className="text-4xl block">✅</span>
                <h3 className="text-lg font-bold text-emerald-900">
                  {content.successTitle}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                  {content.successDesc}
                </p>

                {issuedCode && (
                  <div className="p-4 bg-white border-2 border-dashed border-emerald-400 rounded-xl max-w-xs mx-auto">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">
                      Official Tracking Code
                    </span>
                    <span className="text-xl font-mono font-black text-[#1a4f8b] tracking-wider block mt-1">
                      {issuedCode}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', phone: '', email: '', kebele: '', category: 'grievance', subject: '', message: '' })
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-xs"
                >
                  {content.submitAnother}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {content.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={content.namePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1a4f8b] focus:ring-1 focus:ring-[#1a4f8b]"
                  />
                </div>

                {/* Phone & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {content.phoneLabel}
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder={content.phonePlaceholder}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1a4f8b] focus:ring-1 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {content.emailLabel}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder={content.emailPlaceholder}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1a4f8b] focus:ring-1 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>

                {/* Kebele & Category Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {content.kebeleLabel}
                    </label>
                    <input
                      type="text"
                      value={formData.kebele}
                      onChange={(e) => setFormData({ ...formData, kebele: e.target.value })}
                      placeholder={content.kebelePlaceholder}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1a4f8b] focus:ring-1 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {content.categoryLabel}
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1a4f8b] focus:ring-1 focus:ring-[#1a4f8b]"
                    >
                      {content.categories.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {content.subjectLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={content.subjectPlaceholder}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1a4f8b] focus:ring-1 focus:ring-[#1a4f8b]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {content.messageLabel}
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={content.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1a4f8b] focus:ring-1 focus:ring-[#1a4f8b]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {loading ? content.submittingBtn : content.submitBtn}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Tracking Box + Contact Details & Hotlines Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Tracking Card */}
            <div className="bg-gradient-to-tr from-[#0d2340] to-[#1a4f8b] text-white rounded-2xl p-6 shadow-md space-y-4">
              <div>
                <span className="text-[10px] font-bold text-[#FED100] uppercase tracking-wider bg-white/10 px-2.5 py-0.5 rounded-full inline-block mb-1">
                  🔍 Transparency Desk
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {content.trackTitle}
                </h3>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {content.trackSubtitle}
                </p>
              </div>

              <form onSubmit={handleTrack} className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder={content.trackPlaceholder}
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-xs text-white placeholder-gray-400 font-mono focus:bg-white/20 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={trackingLoading}
                  className="px-4 py-2 bg-[#FED100] hover:bg-[#fed100]/90 text-[#0d2340] text-xs font-bold rounded-lg transition-colors shrink-0 disabled:opacity-50"
                >
                  {trackingLoading ? 'Checking...' : content.trackBtn}
                </button>
              </form>

              {trackingError && (
                <div className="p-3 bg-rose-500/20 border border-rose-400/40 rounded-xl text-xs text-rose-200">
                  {trackingError}
                </div>
              )}

              {trackingResult && (
                <div className="p-4 bg-white/10 border border-white/20 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[#FED100] font-bold">
                      {trackingResult.trackingCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        trackingResult.status === 'RESOLVED'
                          ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                          : trackingResult.status === 'UNDER_REVIEW'
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                      }`}
                    >
                      {trackingResult.status}
                    </span>
                  </div>

                  <div className="font-bold text-white">
                    {trackingResult.subject}
                  </div>

                  {trackingResult.responseNotes && (
                    <div className="mt-2 pt-2 border-t border-white/10 text-gray-200 bg-white/5 p-2 rounded">
                      <strong className="text-[#FED100] block text-[10px] uppercase">Official Resolution Notes:</strong>
                      {trackingResult.responseNotes}
                    </div>
                  )}

                  <div className="text-[10px] text-gray-400 pt-1">
                    Filed on: {new Date(trackingResult.createdAt).toLocaleDateString()}
                  </div>
                </div>
              )}
            </div>

            {/* Headquarters Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-[#0d2340] border-b border-gray-100 pb-3">
                {content.hqTitle}
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Physical Address
                  </span>
                  <span className="text-gray-800 leading-relaxed block mt-0.5">
                    {content.hqAddress}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Working Hours
                  </span>
                  <span className="text-gray-800 block mt-0.5">
                    {content.hqHours}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    General Phone
                  </span>
                  <span className="text-[#1a4f8b] font-mono font-bold block mt-0.5">
                    {content.hqPhone}
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 font-semibold block uppercase tracking-wider text-[10px]">
                    Email Address
                  </span>
                  <span className="text-gray-800 font-mono block mt-0.5">
                    {content.hqEmail}
                  </span>
                </div>
              </div>
            </div>

            {/* Hotlines Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-[#0d2340] border-b border-gray-100 pb-3">
                {content.hotlinesTitle}
              </h3>

              <div className="space-y-2 text-xs">
                <p className="text-gray-700 font-mono">
                  🚨 {content.policeHotline}
                </p>
                <p className="text-gray-700 font-mono">
                  🚑 {content.hospitalHotline}
                </p>
                <p className="text-gray-700 font-mono">
                  💼 {content.investmentHotline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
