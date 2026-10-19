'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface HeroSectionProps {
  locale: Locale
  sliders?: any[]
}

export function HeroSection({ locale, sliders = [] }: HeroSectionProps) {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0)
  const isAm = locale === 'am'
  const isOm = locale === 'om'

  // Filter active slides
  const activeSliders = sliders.filter((s) => s.isActive !== false)

  useEffect(() => {
    if (activeSliders.length <= 1) return
    const timer = setInterval(() => {
      setActiveSlideIdx((prev) => (prev + 1) % activeSliders.length)
    }, 7000)
    return () => clearInterval(timer)
  }, [activeSliders.length])

  const content = {
    en: {
      badge: 'Official Portal • North Shewa Zone',
      title: 'Welcome to Angolela Tera Woreda',
      subtitle: 'Building a prosperous, transparent, and resilient community through modernized public services, agricultural innovation, and sustainable investment.',
      ctaServices: 'Explore Public Services',
      ctaInvestment: 'Investment Opportunities',
      quickTitle: 'Citizen Quick Access',
      quickPills: [
        { label: 'Civil Registration', href: `/${locale}/services/civil-registration`, icon: '📜' },
        { label: 'Land Holding Certificate', href: `/${locale}/services/land-certificate`, icon: '🗺️' },
        { label: 'Agricultural Inputs', href: `/${locale}/services/agriculture`, icon: '🌾' },
        { label: 'Business Permits & Tax', href: `/${locale}/services/business-license`, icon: '💼' },
        { label: 'Citizen Grievance Desk', href: `/${locale}/contact`, icon: '⚖️' },
      ],
      highlights: [
        { value: '19', label: 'Rural & Urban Kebeles' },
        { value: '140K+', label: 'Citizens Served' },
        { value: '110 km', label: 'Distance from Addis Ababa' },
        { value: '2,800m', label: 'Highland Agro-Ecology' },
      ],
    },
    am: {
      badge: 'ይፋዊ ፖርታል • ሰሜን ሸዋ ዞን',
      title: 'እንኳን ወደ አንጎሌላ ተራ ወረዳ በደህና መጡ',
      subtitle: 'በዘመናዊ የህዝብ አገልግሎት፣ በግብርና ልማትና በኢንቨስትመንት መስፋፋት የበለጸገ፣ ፍትሃዊና ጠንካራ ማህበረሰብ እየገነባን ነው።',
      ctaServices: 'የህዝብ አገልግሎቶች',
      ctaInvestment: 'የኢንቨስትመንት አማራጮች',
      quickTitle: 'ፈጣን የአገልግሎት መስኮት',
      quickPills: [
        { label: 'የወሳኝ ኩነት ምዝገባ', href: `/${locale}/services/civil-registration`, icon: '📜' },
        { label: 'የመሬት ይዞታ ምስክር', href: `/${locale}/services/land-certificate`, icon: '🗺️' },
        { label: 'የግብርና ግብአቶች', href: `/${locale}/services/agriculture`, icon: '🌾' },
        { label: 'ንግድ ፈቃድና ታክስ', href: `/${locale}/services/business-license`, icon: '💼' },
        { label: 'የቅሬታ ማስተናገጃ', href: `/${locale}/contact`, icon: '⚖️' },
      ],
      highlights: [
        { value: '19', label: 'የገጠርና ከተማ ቀበሌዎች' },
        { value: '140 ሺህ+', label: 'ተገልጋይ ህዝብ' },
        { value: '110 ኪ.ሜ', label: 'ከአዲስ አበባ ርቀት' },
        { value: '2,800 ሜ', label: 'ደጋማ ስነ-ምህዳር' },
      ],
    },
    om: {
      badge: 'Fuula Mootummaa • Godina Shawaa Kaabaa',
      title: 'Baga Gara Aanaa Angolallaa Xaraatti Nagaan Dhuftan',
      subtitle: 'Tajaajila uummataa ammayyaa, misooma qonnaa fi carraa invastimantiitiin hawaasa badhaadhe ijaaraa jirra.',
      ctaServices: 'Tajaajiloota Uummataa',
      ctaInvestment: 'Carraawwan Invastimantii',
      quickTitle: 'Tajaajila Saffisaa',
      quickPills: [
        { label: 'Galmee Murtii', href: `/${locale}/services/civil-registration`, icon: '📜' },
        { label: 'Ragaa Qabiyyee Lafaa', href: `/${locale}/services/land-certificate`, icon: '🗺️' },
        { label: 'Galtee Qonnaa', href: `/${locale}/services/agriculture`, icon: '🌾' },
        { label: 'Hayaama Daldalaa', href: `/${locale}/services/business-license`, icon: '💼' },
        { label: 'Komiin Dhaggeeffachuu', href: `/${locale}/contact`, icon: '⚖️' },
      ],
      highlights: [
        { value: '19', label: 'Gandoolee Baadiyyaa fi Magaalaa' },
        { value: '140K+', label: 'Uummata Tajaajilamu' },
        { value: '110 km', label: 'Fageenya Finfinnee Irraa' },
        { value: '2,800m', label: 'Olka\'iinsa Baddaa' },
      ],
    },
  }[locale]

  const currentSlider = activeSliders[activeSlideIdx]

  const headline = currentSlider
    ? (isAm ? (currentSlider.title_am || currentSlider.title_en) : currentSlider.title_en)
    : content.title

  const subline = currentSlider
    ? (isAm ? (currentSlider.subtitle_am || currentSlider.subtitle_en) : currentSlider.subtitle_en)
    : content.subtitle

  const ctaBtnText = currentSlider
    ? (isAm ? (currentSlider.buttonText_am || currentSlider.buttonText_en) : currentSlider.buttonText_en)
    : content.ctaServices

  const ctaBtnUrl = currentSlider?.buttonUrl
    ? (currentSlider.buttonUrl.startsWith('http') ? currentSlider.buttonUrl : `/${locale}${currentSlider.buttonUrl.startsWith('/') ? currentSlider.buttonUrl : '/' + currentSlider.buttonUrl}`)
    : `/${locale}/services`

  return (
    <section className="relative bg-gradient-to-b from-[#0a192f] via-[#0d2340] to-[#133a6b] text-white pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden">
      {/* Decorative Ethiopian Tricolor Glow & Geometric Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8931a]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1a4f8b]/30 rounded-full blur-2xl pointer-events-none" />

      {/* Subtle Pattern Grid Overlay */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 mb-10">
          <div className="max-w-2xl min-h-[300px] flex flex-col justify-center">
            {/* Institutional Status Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#FED100] mb-6 shadow-xs w-fit">
              <span className="h-2 w-2 rounded-full bg-[#009A44] animate-ping" />
              <span>{content.badge}</span>
            </div>

            {/* Main Title (Animated Transition) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight sm:leading-tight mb-4 drop-shadow-md transition-all duration-500">
              {headline}
            </h1>

            {/* Subtitle / Mission Statement */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 font-normal leading-relaxed mb-8 max-w-2xl drop-shadow-xs transition-all duration-500">
              {subline}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={ctaBtnUrl}
                className="inline-flex items-center gap-2 bg-[#c8931a] hover:bg-[#b08015] text-[#0d2340] font-bold text-xs sm:text-sm px-5 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 text-[#0d2340]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>{ctaBtnText}</span>
              </Link>

              <Link
                href={`/${locale}/investment`}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/30 font-semibold text-xs sm:text-sm px-5 py-3 rounded-lg backdrop-blur-xs transition-all duration-200"
              >
                <svg className="w-4 h-4 text-[#FED100]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>{content.ctaInvestment}</span>
              </Link>
            </div>

            {/* Slider Dots if multiple slides */}
            {activeSliders.length > 1 && (
              <div className="flex items-center gap-2 mt-6">
                {activeSliders.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSlideIdx(idx)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      idx === activeSlideIdx ? 'w-8 bg-[#FED100]' : 'w-2 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Official Seal Feature */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 pr-4">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-[#c8931a]/40 via-blue-500/30 to-[#009A44]/40 rounded-full blur-xl opacity-60 group-hover:opacity-90 transition duration-500" />
              <div className="relative w-52 h-52 xl:w-60 xl:h-60 rounded-full bg-white/10 p-3 backdrop-blur-md border-2 border-white/25 shadow-2xl flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Official Seal of Angolela Tera Woreda"
                  className="w-full h-full object-contain rounded-full drop-shadow-2xl"
                />
              </div>
            </div>
            <span className="mt-4 inline-block text-[11px] font-bold tracking-widest text-[#FED100] uppercase text-center bg-white/10 px-3 py-1 rounded-full border border-white/15">
              Official Woreda Seal
            </span>
          </div>
        </div>

        {/* Quick Access Pills Row */}
        <div className="pt-6 border-t border-white/10">
          <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {content.quickTitle}
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {content.quickPills.map((pill, idx) => (
              <Link
                key={idx}
                href={pill.href}
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1.5 rounded-full text-xs font-medium text-gray-100 hover:text-white transition-all shadow-xs"
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Highlight Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/10">
          {content.highlights.map((item, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-xs">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#FED100] tracking-tight">
                {item.value}
              </div>
              <div className="text-xs text-gray-300 mt-1 font-medium">
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
