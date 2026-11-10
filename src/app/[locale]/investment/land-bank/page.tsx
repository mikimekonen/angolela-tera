'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface PageProps {
  params: Promise<{ locale: string }>
}

export default function LandBankPage({ params }: PageProps) {
  const { locale } = use(params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const [formData, setFormData] = useState({
    investorName: '',
    companyName: '',
    email: '',
    phone: '',
    sector: 'agro_processing',
    preferredParcel: 'chacha_industrial_zone_a',
    requiredAreaHectares: '2',
    capitalETB: '',
    projectSummary: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [trackingCode, setTrackingCode] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const parcels = [
    {
      id: 'chacha_industrial_zone_a',
      name_en: 'Chacha North Industrial Corridor (Block A)',
      name_am: 'የጫጫ ሰሜን ኢንዱስትሪ ኮሪደር (ብሎክ ኤ)',
      location_en: 'Direct frontage on the A2 Addis Ababa - Debre Berhan Highway (Km 110)',
      location_am: 'በአዲስ አበባ - ደብረ ብርሃን አውራ ጎዳና ዳርቻ (ኪሜ 110)',
      totalSize: '45 Hectares',
      availablePlots: '8 Plots (0.5 to 5 Hectares each)',
      zoning_en: 'Light & Medium Manufacturing, Agro-processing, Warehousing',
      zoning_am: 'ቀላልና መካከለኛ ማኑፋክቸሪንግ፣ አግሮ ፕሮሰሲንግ፣ መጋዘኖች',
      infrastructure: [
        isAmharic ? 'የ132/33 ኪሎ ቮልት ኤሌክትሪክ መስመር' : '33kV dedicated industrial power line',
        isAmharic ? 'የአስፋልት መንገድ ቀጥታ መግቢያ' : 'Direct paved highway access',
        isAmharic ? 'የኢትዮ ቴሌኮም ከፍተኛ ፍጥነት ኦፕቲክስ ፋይበር' : 'High-speed Ethio Telecom fiber optic link',
        isAmharic ? 'የከርሰ-ምድር ጥልቅ የውሃ ጉድጓድ' : 'Deep industrial groundwater borehole connection',
      ],
      leaseRate: isAmharic ? 'በክልሉ ዝቅተኛ የሊዝ መነሻ ዋጋ' : 'Regional statutory preferential industrial lease rate',
      status: 'AVAILABLE',
    },
    {
      id: 'cheki_agro_zone',
      name_en: 'Cheki Integrated Agro-Processing Park (Block B)',
      name_am: 'የጨቂ የተቀናጀ አግሮ ፕሮሰሲንግ ፓርክ (ብሎክ ቢ)',
      location_en: '4 km from Chacha central junction, adjacent to primary barley collection hub',
      location_am: 'ከጫጫ ማዕከላዊ መስቀለኛ መንገድ 4 ኪሜ፣ የገብስ ማሰባሰቢያ ተፋሰስ አጠገብ',
      totalSize: '35 Hectares',
      availablePlots: '6 Plots (1 to 4 Hectares each)',
      zoning_en: 'Dairy Processing, Malt & Grain Conditioning, Cold Storage Facilities',
      zoning_am: 'የወተት ተዋጽኦ ማቀነባበሪያ፣ የገብስና እህል ማበጠሪያ፣ ማቀዝቀዣ መጋዘኖች',
      infrastructure: [
        isAmharic ? 'የውሃ መስመር ከአጂማ-ጫጫ ግድብ ፕሮጀክት ጋር የተገናኘ' : 'Water supply connected to Ajima-Chacha scheme',
        isAmharic ? 'የተስተካከለ ጠጠር መንገድ (በአስፋልት ዝግጅት ላይ ያለ)' : 'Heavy-duty engineered gravel feeder road',
        isAmharic ? 'የ3-ፌዝ የኤሌክትሪክ ሃይል' : '3-Phase electrical connection available',
      ],
      leaseRate: isAmharic ? 'ልዩ የግብርና ኢንቨስትመንት ማበረታቻ ዋጋ' : 'Special agricultural value-addition incentive tariff',
      status: 'AVAILABLE',
    },
    {
      id: 'kotu_commercial_hub',
      name_en: 'Kotu Logistics & Commercial Service Terminal',
      name_am: 'የኮቱ ሎጂስቲክስና ንግድ አገልግሎት ማዕከል',
      location_en: 'Southern entry corridor of Angolela Tera, high transport volume intersection',
      location_am: 'የአንጎለላ ጠራ ደቡባዊ መግቢያ ኮሪደር፣ የከፍተኛ ትራንስፖርት መገጣጠሚያ',
      totalSize: '20 Hectares',
      availablePlots: '5 Plots (0.25 to 2 Hectares each)',
      zoning_en: 'Truck stops, spare-parts logistics, commercial grain trading hubs',
      zoning_am: 'የትራንስፖርት ተርሚናል፣ የመለዋወጫ ሎጂስቲክስ፣ የጅምላ እህል ግብይት',
      infrastructure: [
        isAmharic ? 'የመኪና ማቆሚያና ፔቭመንት ዝግጁነት' : 'High-capacity vehicle staging ground',
        isAmharic ? 'የመብራትና የመጠጥ ውሃ መስመር' : 'Municipal grid water & electricity',
      ],
      leaseRate: isAmharic ? 'የንግድ አገልግሎት የሊዝ ዋጋ' : 'Commercial zoned lease framework',
      status: 'AVAILABLE',
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
          name: `${formData.investorName} (${formData.companyName})`,
          email: formData.email,
          phone: formData.phone,
          category: 'investment',
          subject: `Investment Land Application - ${formData.preferredParcel} (${formData.requiredAreaHectares} Ha)`,
          message: `Official Investment Land Request:
Applicant: ${formData.investorName}
Company: ${formData.companyName}
Telephone: ${formData.phone}
Target Sector: ${formData.sector}
Requested Land Parcel: ${formData.preferredParcel}
Requested Area: ${formData.requiredAreaHectares} Hectares
Estimated Investment Capital: ${formData.capitalETB} ETB

Project Description & Business Scope:
${formData.projectSummary}
`,
        }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setSubmitted(true)
        setTrackingCode(data.trackingCode || `AT-LAND-${Date.now().toString().slice(-6)}`)
      } else {
        setError(data.error || 'Failed to submit application. Please check form values.')
      }
    } catch {
      setError('Communication error. Please verify your network connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Breadcrumb & Header */}
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
            <span>{isAmharic ? 'የመሬት ባንክ' : 'Land Bank'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'የአንጎለላ ጠራ ወረዳ የመሬት ባንክና የይዞታ አቅርቦት'
              : 'Angolela Tera Woreda Serviced Land Bank'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'በጫጫ ኢንዱስትሪ ኮሪደር እና በግብርና ተፋሰሶች ውስጥ የተዘጋጁ፣ ከመሰረተ ልማት ጋር የተሳሰሩ የኢንዱስትሪና የንግድ ይዞታዎች።'
              : 'Pre-zoned, infrastructure-ready industrial and commercial plots along the strategic Addis Ababa - Debre Berhan logistics corridor.'}
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label_en: 'Total Serviced Land Bank', label_am: 'የተዘጋጀ የመሬት መጠን', value: '100+ Ha' },
            { label_en: 'Highway Proximity', label_am: 'ከዋና አውራ ጎዳና', value: '0 - 4 Km' },
            { label_en: 'Distance to Addis Ababa', label_am: 'ከአዲስ አበባ ርቀት', value: '110 Km' },
            { label_en: 'Lease Tenure', label_am: 'የኢንዱስትሪ ሊዝ ዘመን', value: 'Up to 70 Yrs' },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-xl p-5 shadow-xs text-center">
              <p className="text-2xl sm:text-3xl font-black text-[#1a4f8b]">{stat.value}</p>
              <p className="text-xs text-gray-600 font-medium mt-1">
                {isAmharic ? stat.label_am : stat.label_en}
              </p>
            </div>
          ))}
        </div>

        {/* Parcels List */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-[#0d2340]">
              {isAmharic ? 'ለባለሀብቶች የተዘጋጁ ይዞታዎች' : 'Available Land Parcels & Development Zones'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              {isAmharic
                ? 'በወረዳው ካቢኔ እና በክልሉ ኢንቨስትመንት ኮሚሽን የተረጋገጡ የመሬት አማራጮች።'
                : 'Verified land parcels approved for immediate investment licensing and site handover.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {parcels.map((parcel) => (
              <div
                key={parcel.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between hover:border-[#1a4f8b] transition-all"
              >
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] rounded-full border border-emerald-200">
                      {isAmharic ? 'ዝግጁ ይዞታ' : 'Ready for Allocation'}
                    </span>
                    <span className="text-xs font-bold text-gray-500">{parcel.totalSize}</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-[#0d2340] leading-snug">
                      {isAmharic ? parcel.name_am : parcel.name_en}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      📍 {isAmharic ? parcel.location_am : parcel.location_en}
                    </p>
                  </div>

                  <div className="space-y-2 text-xs border-t border-gray-100 pt-3">
                    <div>
                      <span className="font-bold text-gray-700">{isAmharic ? 'የተፈቀደው ዘርፍ፡' : 'Permitted Sectors:'} </span>
                      <span className="text-gray-600">{isAmharic ? parcel.zoning_am : parcel.zoning_en}</span>
                    </div>
                    <div>
                      <span className="font-bold text-gray-700">{isAmharic ? 'የይዞታ ብዛት፡' : 'Subdivided Plots:'} </span>
                      <span className="text-gray-600">{parcel.availablePlots}</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3">
                    <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-2">
                      {isAmharic ? 'ያለው መሰረተ ልማት፡' : 'Site Infrastructure:'}
                    </p>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {parcel.infrastructure.map((inf, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{inf}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="bg-gray-50 border-t border-gray-100 p-4">
                  <a
                    href="#apply-form"
                    onClick={() => setFormData((prev) => ({ ...prev, preferredParcel: parcel.id }))}
                    className="block text-center w-full bg-[#0d2340] hover:bg-[#1a4f8b] text-white text-xs font-bold py-2.5 rounded-xl transition-colors"
                  >
                    {isAmharic ? 'በዚህ ይዞታ ላይ አመልክት' : 'Apply for This Parcel'}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Application Criteria & Process */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
          <h2 className="text-xl font-bold text-[#0d2340]">
            {isAmharic ? 'የመሬት ማመልከቻ ቅደም ተከተልና መስፈርቶች' : 'Eligibility Criteria & Allocation Procedure'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            {[
              {
                step: '01',
                title_en: 'Project Proposal Submission',
                title_am: 'የፕሮጀክት ፕሮፖዛል ማቅረብ',
                desc_en: 'Submit executive feasibility study, business plan, and initial capital verification.',
                desc_am: 'የአዋጭነት ጥናት፣ የንግድ እቅድ እና የካፒታል ማረጋገጫ ሰነድ ማቅረብ።',
              },
              {
                step: '02',
                title_en: 'Technical Screening',
                title_am: 'ቴክኒካዊ ግምገማ',
                desc_en: 'Woreda Investment Committee assesses environmental compatibility and job creation.',
                desc_am: 'የወረዳው ኢንቨስትመንት ኮሚቴ የአካባቢ ጥበቃና የስራ እድል ፈጠራ አቅምን ይገመግማል።',
              },
              {
                step: '03',
                title_en: 'Cabinet Approval & Lease',
                title_am: 'የካቢኔ ውሳኔና የሊዝ ውል',
                desc_en: 'Issuance of investment license and signing of statutory long-term land lease agreement.',
                desc_am: 'የኢንቨስትመንት ፈቃድ መሰጠት እና ህጋዊ የረጅም ጊዜ የሊዝ ውል መፈረም።',
              },
              {
                step: '04',
                title_en: 'Site Demarcation & Handover',
                title_am: 'ይዞታውን መረከብ',
                desc_en: 'Physical site boundary demarcation by municipal surveyors within 5 business days.',
                desc_am: 'በመሬት አስተዳደር ቀያሾች አማካኝነት ወሰን ተለክቶ በ5 የስራ ቀናት ውስጥ ማስረከብ።',
              },
            ].map((p, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                <span className="text-lg font-black text-[#c8931a]">{p.step}</span>
                <h3 className="font-bold text-[#0d2340] mt-1 mb-1">{isAmharic ? p.title_am : p.title_en}</h3>
                <p className="text-gray-500 leading-relaxed">{isAmharic ? p.desc_am : p.desc_en}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Application Form */}
        <div id="apply-form" className="bg-white border-2 border-[#1a4f8b]/30 rounded-2xl p-6 sm:p-10 shadow-md">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="px-3 py-1 bg-blue-50 text-[#1a4f8b] font-bold text-xs rounded-full border border-blue-200 uppercase tracking-widest">
                {isAmharic ? 'ኦፊሴላዊ የኢንቨስትመንት ማመልከቻ' : 'Official Investor Gateway'}
              </span>
              <h2 className="text-2xl font-black text-[#0d2340] mt-3">
                {isAmharic ? 'የኢንቨስትመንት መሬት ማመልከቻ ቅጽ' : 'Apply for Serviced Investment Land'}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isAmharic
                  ? 'ይህንን ቅጽ በመሙላት ማመልከቻዎን ለወረዳው ኢንቨስትመንት ኮሚቴ በቀጥታ ያስገቡ።'
                  : 'Submit your preliminary land request directly to the Angolela Tera Woreda Investment Desk.'}
              </p>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-bold text-emerald-900">
                  {isAmharic ? 'ማመልከቻዎ በተሳካ ሁኔታ ገብቷል!' : 'Application Successfully Received!'}
                </h3>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  {isAmharic
                    ? 'የመሬት ጥያቄዎ በወረዳው የኢንቨስትመንት መዝገብ ሰፍሯል። የመከታተያ ኮድዎን በመያዝ በድረ-ገጻችን ወይም በአካል ሂደቱን መከታተል ይችላሉ።'
                    : 'Your investment dossier has been registered. Our One-Stop Desk officer will review your project requirements and contact you within 48 hours.'}
                </p>
                <div className="inline-block bg-white px-4 py-2 rounded-xl border border-emerald-300 font-mono text-sm font-bold text-emerald-900 shadow-2xs">
                  {trackingCode}
                </div>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false)
                      setFormData({
                        investorName: '',
                        companyName: '',
                        email: '',
                        phone: '',
                        sector: 'agro_processing',
                        preferredParcel: 'chacha_industrial_zone_a',
                        requiredAreaHectares: '2',
                        capitalETB: '',
                        projectSummary: '',
                      })
                    }}
                    className="text-xs text-[#1a4f8b] font-bold hover:underline cursor-pointer"
                  >
                    {isAmharic ? 'ሌላ ማመልከቻ አስገባ' : 'Submit Another Request'}
                  </button>
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
                      {isAmharic ? 'የአመልካች ሙሉ ስም *' : 'Applicant Full Legal Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.investorName}
                      onChange={(e) => setFormData({ ...formData, investorName: e.target.value })}
                      placeholder={isAmharic ? 'አቶ/ወ/ሮ...' : 'e.g., Samuel Tadesse'}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'የድርጅቱ ስም *' : 'Registered Business / Entity Name *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="e.g., Chacha Agro Industries PLC"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ይፋዊ ኢሜይል *' : 'Contact Email *'}
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="investor@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ስልክ ቁጥር *' : 'Telephone Number *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+251 9XX XXX XXX"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'የኢንቨስትመንት ዘርፍ' : 'Investment Sector'}
                    </label>
                    <select
                      value={formData.sector}
                      onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    >
                      <option value="agro_processing">{isAmharic ? 'አግሮ ፕሮሰሲንግና እህል' : 'Agro-processing'}</option>
                      <option value="dairy_livestock">{isAmharic ? 'ወተትና እንስሳት እርባታ' : 'Dairy & Livestock'}</option>
                      <option value="manufacturing">{isAmharic ? 'ማኑፋክቸሪንግና ፋብሪካ' : 'Manufacturing'}</option>
                      <option value="warehousing_logistics">{isAmharic ? 'መጋዘንና ሎጂስቲክስ' : 'Warehousing & Logistics'}</option>
                      <option value="renewable_energy">{isAmharic ? 'ታዳሽ ሃይል' : 'Renewable Energy'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'ተመራጭ ይዞታ' : 'Target Land Parcel'}
                    </label>
                    <select
                      value={formData.preferredParcel}
                      onChange={(e) => setFormData({ ...formData, preferredParcel: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    >
                      <option value="chacha_industrial_zone_a">{isAmharic ? 'ጫጫ ሰሜን ኮሪደር (ብሎክ ኤ)' : 'Chacha North Corridor (Block A)'}</option>
                      <option value="cheki_agro_zone">{isAmharic ? 'ጨቂ አግሮ ፓርክ (ብሎክ ቢ)' : 'Cheki Agro Park (Block B)'}</option>
                      <option value="kotu_commercial_hub">{isAmharic ? 'ኮቱ ሎጂስቲክስ ማዕከል' : 'Kotu Logistics Terminal'}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      {isAmharic ? 'የሚፈለገው ስፋት (በሄክታር)' : 'Area Required (Ha)'}
                    </label>
                    <input
                      type="number"
                      min="0.25"
                      step="0.25"
                      required
                      value={formData.requiredAreaHectares}
                      onChange={(e) => setFormData({ ...formData, requiredAreaHectares: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isAmharic ? 'የተገመተ ካፒታል (በኢትዮጵያ ብር)' : 'Proposed Initial Capital (ETB)'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.capitalETB}
                    onChange={(e) => setFormData({ ...formData, capitalETB: e.target.value })}
                    placeholder="e.g., 25,000,000 ETB"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {isAmharic ? 'የፕሮጀክቱ አጭር መግለጫና ዓላማ *' : 'Brief Project Scope & Production Plan *'}
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.projectSummary}
                    onChange={(e) => setFormData({ ...formData, projectSummary: e.target.value })}
                    placeholder={
                      isAmharic
                        ? 'የሚያመርቱትን ምርት፣ የሚፈጥሩትን የስራ እድል እና የጥሬ ዕቃ ምንጭ በአጭሩ ይግለጹ...'
                        : 'Summarize planned output, target markets, raw material sourcing, and expected employment generation...'
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#0d2340] hover:bg-[#1a4f8b] text-white text-xs font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-60"
                >
                  {submitting
                    ? isAmharic ? 'በመላክ ላይ...' : 'Submitting Application Dossier...'
                    : isAmharic ? 'ማመልከቻውን ለወረዳው ኢንቨስትመንት ዴስክ አስገባ' : 'Submit Official Land Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
