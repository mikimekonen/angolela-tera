'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
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
    category: 'general',
    message: '',
  })

  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const content = {
    en: {
      tag: 'Citizen Voice & Direct Engagement',
      title: 'Contact Us & Citizen Grievance Desk',
      subtitle: 'Reach out to Angolela Tera Woreda. Submit citizen feedback, report service delays, or contact our team directly.',
      formTitle: 'Submit a Citizen Inquiry or Feedback',
      nameLabel: 'Full Legal Name *',
      namePlaceholder: 'e.g., Abebe Kebede Tessema',
      phoneLabel: 'Telephone Number *',
      phonePlaceholder: 'e.g., 0911 234 567',
      emailLabel: 'Email Address (Optional)',
      emailPlaceholder: 'name@example.com',
      kebeleLabel: 'Kebele of Residence *',
      kebelePlaceholder: 'e.g., Chacha 01 or Rural Kebele name',
      categoryLabel: 'Subject Category *',
      categories: [
        { value: 'general', label: 'General Administrative Inquiry' },
        { value: 'grievance', label: 'Citizen Service Grievance / Appeal' },
        { value: 'land', label: 'Land Administration & Boundary Question' },
        { value: 'investment', label: 'Investment & Trade Permitting' },
        { value: 'agriculture', label: 'Agricultural Input Request' },
        { value: 'suggestion', label: 'Community Development Proposal' },
      ],
      messageLabel: 'Detailed Message / Petition *',
      messagePlaceholder: 'Provide clear details including any relevant previous service reference numbers...',
      submitBtn: 'Submit Official Inquiry',
      submittingBtn: 'Submitting...',
      successTitle: 'Inquiry Successfully Submitted!',
      successDesc: 'Thank you for contacting Angolela Tera Woreda. Your inquiry has been registered with the Citizen Desk. Our officers will follow up through the provided phone number.',
      submitAnother: 'Submit Another Inquiry',
      hqTitle: 'Administration Headquarters',
      hqAddress: 'Main Administrative Complex, Chacha Town, North Shewa Zone, Amhara Region',
      hqHours: 'Monday – Friday: 8:30 AM – 5:30 PM (EAT)',
      hqPhone: 'General Desk: +251 (0) 58 661 0000',
      hqEmail: 'info@angolela-tera.gov.et',
      hotlinesTitle: 'Emergency Sector Hotlines',
      policeHotline: 'Woreda Police Division: +251 (0) 58 661 0111',
      hospitalHotline: 'Chacha Primary Hospital: +251 (0) 58 661 0222',
      investmentHotline: 'Investor One-Stop Desk: +251 (0) 58 661 0444',
    },
    am: {
      tag: 'የዜጎች ድምጽና ቀጥታ ግንኙነት',
      title: 'ያግኙን እና የዜጎች ቅሬታ ሰሚ ዴስክ',
      subtitle: 'ከአንጎሌላ ተራ ወረዳ ጋር በቀጥታ ይገናኙ። አስተያየትዎን ይስጡ፣ የአገልግሎት ቅሬታዎን ያስመዝግቡ ወይም ቢሮዎቻችንን ያነጋግሩ።',
      formTitle: 'የዜጎች ጥያቄ ወይም አቤቱታ ማመልከቻ',
      nameLabel: 'ሙሉ ስም *',
      namePlaceholder: 'ምሳሌ፡ አበበ ከበደ ተሰማ',
      phoneLabel: 'ስልክ ቁጥር *',
      phonePlaceholder: 'ምሳሌ፡ 0911 234 567',
      emailLabel: 'ኢሜይል (ካለ)',
      emailPlaceholder: 'name@example.com',
      kebeleLabel: 'የሚኖሩበት ቀበሌ *',
      kebelePlaceholder: 'ምሳሌ፡ ጫቻ 01 ወይም የገጠር ቀበሌው ስም',
      categoryLabel: 'የጉዳዩ አይነት *',
      categories: [
        { value: 'general', label: 'አጠቃላይ አስተዳደራዊ ጥያቄ' },
        { value: 'grievance', label: 'የአገልግሎት አሰጣጥ ቅሬታ / አቤቱታ' },
        { value: 'land', label: 'የመሬት ይዞታና የወሰን ጉዳይ' },
        { value: 'investment', label: 'የኢንቨስትመንትና ንግድ ፈቃድ' },
        { value: 'agriculture', label: 'የግብርና ግብአት ጥያቄ' },
        { value: 'suggestion', label: 'የማህበረሰብ ልማት አስተያየት' },
      ],
      messageLabel: 'ዝርዝር መልዕክት ወይም አቤቱታ *',
      messagePlaceholder: 'የጉዳዩን ዝርዝር መረጃ፣ የቀድሞ የማጣቀሻ ቁጥሮችን ጨምሮ ያስገቡ...',
      submitBtn: 'ማመልከቻውን አስገባ',
      submittingBtn: 'በማስገባት ላይ...',
      successTitle: 'ማመልከቻዎ በተሳካ ሁኔታ ደርሷል!',
      successDesc: 'የአንጎሌላ ተራ ወረዳን ስላነጋገሩ እናመሰግናለን። ማመልከቻዎ በቅሬታ ሰሚ ዴስክ የተመዘገበ ሲሆን በሰጡን ስልክ ቁጥር ምላሽ ይሰጥዎታል።',
      submitAnother: 'ሌላ ማመልከቻ ያስገቡ',
      hqTitle: 'የአስተዳደሩ ዋና መሥሪያ ቤት',
      hqAddress: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ጫቻ ከተማ፣ ሰሜን ሸዋ ዞን፣ አማራ ክልል',
      hqHours: 'ከሰኞ – አርብ፡ 2:30 – 11:30',
      hqPhone: 'ዋና ስልክ፡ +251 (0) 58 661 0000',
      hqEmail: 'info@angolela-tera.gov.et',
      hotlinesTitle: 'የአደጋና አጣዳፊ ጊዜ ስልኮች',
      policeHotline: 'የወረዳው ፖሊስ መምሪያ፡ +251 (0) 58 661 0111',
      hospitalHotline: 'የጫቻ የመጀመሪያ ደረጃ ሆስፒታል፡ +251 (0) 58 661 0222',
      investmentHotline: 'የኢንቨስትመንት ዴስክ፡ +251 (0) 58 661 0444',
    },
    om: {
      tag: 'Sagalee Lammiilee',
      title: 'Nu Qunnamaa fi Kutaa Komii',
      subtitle: 'Aanaa Angolallaa Xaraa waliin kallattiin walqunnamaa.',
      formTitle: 'Iyyannoo yookiin Yaada Galchaa',
      nameLabel: 'Maqaa Guutuu *',
      namePlaceholder: 'Fkn: Tolasaa Caalaa',
      phoneLabel: 'Lakkoofsa Bilbilaa *',
      phonePlaceholder: 'Fkn: 0911 234 567',
      emailLabel: 'Imeelii',
      emailPlaceholder: 'name@example.com',
      kebeleLabel: 'Ganda Teessumaa *',
      kebelePlaceholder: 'Fkn: Magaalaa Caccetti 01',
      categoryLabel: 'Gosa Dhimmaa *',
      categories: [
        { value: 'general', label: 'Gaaffii Waliigalaa' },
        { value: 'grievance', label: 'Komii Tajaajilaa' },
        { value: 'land', label: 'Dhimma Lafaa' },
        { value: 'investment', label: 'Daldala fi Invastimantii' },
        { value: 'agriculture', label: 'Galtee Qonnaa' },
        { value: 'suggestion', label: 'Yaada Misoomaa' },
      ],
      messageLabel: 'Ibsa Dhimmaa *',
      messagePlaceholder: 'Odeeffannoo bal\'aa barreessaa...',
      submitBtn: 'Iyyannoo Galchi',
      submittingBtn: 'Galchaa jira...',
      successTitle: 'Iyyannoon Keessan Galmaa\'eera!',
      successDesc: 'Galatoomaa, iyyannoon keessan kutaa komiitiin simatameera.',
      submitAnother: 'Iyyannoo Biroo Galchi',
      hqTitle: 'Waajjira Ol\'aanaa',
      hqAddress: 'Magaalaa Caccetti, Godina Shawaa Kaabaa',
      hqHours: 'Wiixata – Jimmata: 2:30 – 11:30',
      hqPhone: 'Bilbila: +251 (0) 58 661 0000',
      hqEmail: 'info@angolela-tera.gov.et',
      hotlinesTitle: 'Bilbila Ariifachiisaa',
      policeHotline: 'Poolisii: +251 (0) 58 661 0111',
      hospitalHotline: 'Hospitaala: +251 (0) 58 661 0222',
      investmentHotline: 'Invastimantii: +251 (0) 58 661 0444',
    },
  }[locale]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
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
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 sm:p-8 text-center space-y-3">
                <span className="text-4xl block">✅</span>
                <h3 className="text-lg font-bold text-emerald-900">
                  {content.successTitle}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                  {content.successDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false)
                    setFormData({ name: '', phone: '', email: '', kebele: '', category: 'general', message: '' })
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
                      required
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
                      {content.categories.map((cat) => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {content.messageLabel}
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder={content.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-[#1a4f8b] focus:ring-1 focus:ring-[#1a4f8b]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#1a4f8b] hover:bg-[#133a6b] text-white font-bold text-xs px-6 py-3 rounded-lg shadow-sm transition-all"
                >
                  {loading ? content.submittingBtn : content.submitBtn}
                </button>
              </form>
            )}
          </div>

          {/* Contact Details & Hotlines Sidebar (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
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
