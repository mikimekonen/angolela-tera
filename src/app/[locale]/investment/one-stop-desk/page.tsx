'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default function OneStopDeskPage({ params }: PageProps) {
  const { locale } = use(params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    serviceRequested: 'business_registration',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [ticket, setTicket] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const deskServices = [
    {
      title_en: 'Expedited Commercial Registration & Licensing',
      title_am: 'ፈጣን የንግድ ምዝገባና የፈቃድ አሰጣጥ',
      icon: '🏢',
      desc_en:
        'Complete registration of sole proprietorships, share companies, and private limited companies (PLC). Direct issuance of woreda trade permits and TIN registration within 24 to 48 hours.',
      desc_am:
        'የግል፣ የኃላፊነቱ የተወሰነ የግል ማህበር (PLC) እና የአክሲዮን ማህበራት ምዝገባ። የወረዳ የንግድ ስራ ፈቃድና የግብር ከፋይ መለያ (TIN) በ24 እስከ 48 ሰዓታት ውስጥ ማጠናቀቅ።',
      turnaround: '24 – 48 Hours',
    },
    {
      title_en: 'Land Identification & Cadastral Handover',
      title_am: 'የይዞታ መረጣና የካዳስተር ርክክብ',
      icon: '🗺️',
      desc_en:
        'Guided inspection of available parcels in the Chacha Industrial Corridor. Field surveying, site boundary demarcation, and cadastral lease contract execution with municipal surveyors.',
      desc_am:
        'በጫጫ ኢንዱስትሪ ኮሪደር የሚገኙ ይዞታዎችን በአካል ጎብኝቶ መምረጥ። የመሬት ልኬት፣ የወሰን ድንጋይ ተከላና ህጋዊ የሊዝ ውል ርክክብ ማጠናቀቅ።',
      turnaround: '3 – 5 Days',
    },
    {
      title_en: 'Fast-Track Construction & Environmental Permits',
      title_am: 'የግንባታና የአካባቢ ጥበቃ ፈቃዶች',
      icon: '🏗️',
      desc_en:
        'One-window coordination with North Shewa environmental protection desks and municipal building authorities for structural drawings approval and environmental clearance (ESIA).',
      desc_am:
        'የፋብሪካ ግንባታ ፕላን ማጽደቅ፣ የአካባቢ ተፅዕኖ ግምገማ (ESIA) ፍተሻና የግንባታ መጀመሪያ ፈቃድ በአንድ ማዕከል መስኮት ማከናወን።',
      turnaround: '5 – 7 Days',
    },
    {
      title_en: 'Direct Utility Interconnection Facilitation',
      title_am: 'የመብራት፣ ውሃና ቴሌኮም መስመር ትስስር',
      icon: '🔌',
      desc_en:
        'Direct institutional liaison with Ethiopian Electric Utility (EEU), Ethio Telecom enterprise desk, and Woreda Water Resource Development Bureau for rapid transformer and pipeline hookups.',
      desc_am:
        'ከኢትዮጵያ ኤሌክትሪክ አገልግሎት፣ ከኢትዮ ቴሌኮምና ከወረዳው ውሃ ቢሮ ጋር በመቀናጀት የትራንስፎርመርና የውሃ መስመር በፍጥነት እንዲዘረጋ ማመቻቸት።',
      turnaround: 'Continuous Liaison',
    },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${formData.name} (${formData.company || 'Investor'})`,
          email: formData.email,
          phone: formData.phone,
          category: 'investment',
          subject: `One-Stop Investor Desk Inquiry: ${formData.serviceRequested}`,
          message: `Investor Support Desk Submission:
Applicant: ${formData.name}
Company: ${formData.company || 'Not provided'}
Phone: ${formData.phone}
Email: ${formData.email}
Service Category: ${formData.serviceRequested}

Inquiry Statement:
${formData.message}
`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitted(true)
        setTicket(data.trackingCode || `AT-INV-${Date.now().toString().slice(-6)}`)
      } else {
        setError(data.error || 'Failed to submit inquiry.')
      }
    } catch {
      setError('Communication error. Please verify your connection.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header */}
        <div className="bg-[#0d2340] text-white p-8 sm:p-10 rounded-2xl border-b-4 border-[#c8931a] shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#fed100] mb-3 uppercase tracking-wider font-semibold">
            <Link href={`/${locale}`} className="hover:underline">
              {isAmharic ? 'ዋና ገጽ' : 'Home'}
            </Link>
            <span>›</span>
            <Link href={`/${locale}/investment`} className="hover:underline">
              {isAmharic ? 'ኢንቨስትመንት' : 'Investment'}
            </Link>
            <span>›</span>
            <span>{isAmharic ? 'የአንድ ማዕከል ዴስክ' : 'One-Stop Desk'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic ? 'የአንድ ማዕከል የባለሀብቶች አገልግሎት ዴስክ' : 'One-Stop Investor Facilitation Desk'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'የቢሮክራሲ ውጣ ውረድን በማስቀረት የንግድ ምዝገባን፣ የመሬት ርክክብን፣ የግንባታ ፈቃድንና የመሰረተ ልማት ዝርጋታን በአንድ ጣሪያ ስር የሚያከናውን ይፋዊ ዴስክ።'
              : 'Eliminating bureaucratic bottlenecks. Complete commercial registration, land demarcation, construction permits, and utility interconnections under a single unified desk.'}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deskServices.map((srv, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl p-2.5 bg-gray-50 rounded-xl border border-gray-100">{srv.icon}</span>
                  <span className="px-2.5 py-1 bg-blue-50 text-[#1a4f8b] font-bold text-[10px] rounded-full border border-blue-200">
                    ⏱️ {srv.turnaround}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#0d2340] mb-2 leading-snug">
                  {isAmharic ? srv.title_am : srv.title_en}
                </h2>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {isAmharic ? srv.desc_am : srv.desc_en}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Info & Application Form */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Desk Contact Box */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-bold text-[#c8931a] uppercase tracking-wider">
                {isAmharic ? 'የቢሮ መረጃ' : 'Direct Facilitation'}
              </span>
              <h3 className="text-xl font-bold text-[#0d2340] mt-1">
                {isAmharic ? 'የዴስኩ አስተባባሪዎች' : 'One-Stop Desk Secretariat'}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {isAmharic ? 'ለአካል ጉዳተኞችና ለባለሀብቶች ክፍት የሆኑ የቢሮ ሰዓታት።' : 'Available Mon – Fri, 8:30 AM – 5:30 PM (East Africa Time).'}
              </p>
            </div>

            <div className="space-y-4 text-xs text-gray-700">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-[#0d2340]">{isAmharic ? 'የቢሮው አድራሻ፡' : 'Physical Location:'}</p>
                <p className="text-gray-600 mt-0.5">
                  {isAmharic
                    ? 'ጫጫ ከተማ፣ የወረዳ አስተዳደር ቅጥር ግቢ፣ የኢንዱስትሪና ንግድ ጽ/ቤት ህንፃ፣ ቢሮ 04'
                    : 'Office of Industry & Trade, Administration Compound, Office 04, Chacha Town, Ethiopia'}
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-[#0d2340]">{isAmharic ? 'ይፋዊ የኢንቨስትመንት ኢሜይል፡' : 'Official Investor Email:'}</p>
                <p className="text-blue-700 font-semibold mt-0.5">
                  <a href="mailto:angolelatera1@gmail.com">angolelatera1@gmail.com</a>
                </p>
              </div>

              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
                <p className="font-bold text-[#0d2340]">{isAmharic ? 'የኢንቨስትመንት ቀጥታ ስልክ፡' : 'Investment Direct Desk:'}</p>
                <p className="font-mono text-gray-800 font-bold mt-0.5">+251 (0) 58 661 0180</p>
                <p className="text-[11px] text-gray-500 mt-1">{isAmharic ? 'ዋና ዴስክ፡' : 'General Desk:'} +251 (0) 58 661 0100</p>
              </div>
            </div>
          </div>

          {/* Direct Support Request Form */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-xl font-bold text-[#0d2340] mb-1">
              {isAmharic ? 'ለአንድ ማዕከል ዴስክ መልዕክት ወይም ጥያቄ ይላኩ' : 'Request Facilitation or Schedule a Site Visit'}
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              {isAmharic
                ? 'ጥያቄዎን ያስገቡ፤ የወረዳው የኢንቨስትመንት ኦፊሰር በ24 ሰዓታት ውስጥ ምላሽ ይሰጥዎታል።'
                : 'Submit your requirements and an investment officer will coordinate with relevant sector bureaus.'}
            </p>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h4 className="text-base font-bold text-emerald-900">
                  {isAmharic ? 'ጥያቄዎ በስኬት ተመዝግቧል!' : 'Inquiry Successfully Submitted!'}
                </h4>
                <p className="text-xs text-emerald-800">
                  {isAmharic
                    ? 'የመከታተያ ኮድዎን በመጠቀም የጉዳይዎን ሂደት በድረ-ገጻችን መከታተል ይችላሉ።'
                    : 'Your facilitation docket has been created. A dedicated investor officer has been assigned.'}
                </p>
                <div className="inline-block bg-white px-4 py-2 rounded-xl border border-emerald-300 font-mono text-sm font-bold text-emerald-900">
                  {ticket}
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ስም *' : 'Contact Person Full Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Daniel Mekonnen"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ድርጅት / ተቋም' : 'Company / Venture Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g., Horn Agro Industries"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ኢሜይል *' : 'Email Address *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ስልክ ቁጥር *' : 'Phone Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+251 9XX XXX XXX"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isAmharic ? 'የአገልግሎት ዓይነት' : 'Assistance Category'}
                  </label>
                  <select
                    value={formData.serviceRequested}
                    onChange={(e) => setFormData({ ...formData, serviceRequested: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  >
                    <option value="business_registration">
                      {isAmharic ? 'የንግድ ምዝገባና ፈቃድ' : 'Trade Licensing & Business Registration'}
                    </option>
                    <option value="site_inspection">
                      {isAmharic ? 'የመሬት ጉብኝትና የይዞታ ርክክብ' : 'Site Inspection & Land Demarcation'}
                    </option>
                    <option value="utility_hookup">
                      {isAmharic ? 'የመብራትና ውሃ መስመር ትስስር' : 'Electricity & Water Interconnection'}
                    </option>
                    <option value="incentive_endorsement">
                      {isAmharic ? 'የቀረጥ ነፃና የታክስ ማበረታቻ' : 'Duty-Free Clearance & Tax Incentive'}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isAmharic ? 'መልዕክት / ጥያቄ *' : 'Inquiry or Special Request *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={
                      isAmharic
                        ? 'የስራዎን ዝርዝር፣ የሚፈልጉትን እገዛ ወይም የጉብኝት ቀን ያስቀምጡ...'
                        : 'Describe your proposed project, planned capital, questions, or requested meeting schedule...'
                    }
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0d2340] hover:bg-[#1a4f8b] text-white text-xs font-bold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {submitting
                    ? isAmharic ? 'በመላክ ላይ...' : 'Sending Request...'
                    : isAmharic ? 'ጥያቄውን ለዴስኩ ላክ' : 'Send Request to One-Stop Desk'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
