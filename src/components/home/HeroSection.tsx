'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { AnimatedCounter } from '@/components/ui/AnimatedCounter'

interface HeroSectionProps {
  locale: Locale
  sliders?: any[]
}

export function HeroSection({ locale, sliders = [] }: HeroSectionProps) {
  const [activeSlideIdx, setActiveSlideIdx] = useState(0)
  const isAm = locale === 'am'

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
      climateBadge: 'Chacha: 18°C • Alt: 2,840m • Highland Corridor',
      title: 'Welcome to Angolela Tera Woreda',
      subtitle:
        'Building a prosperous, transparent, and resilient community through modernized public services, agricultural innovation, and sustainable investment.',
      ctaServices: 'Explore Public Services',
      ctaInvestment: 'Investment Opportunities',
      quickTitle: 'Citizen Quick Access Desk',
      quickPills: [
        { label: 'Civil Registration', href: `/${locale}/services/civil-registration`, icon: '📜' },
        { label: 'Land Holding Certificate', href: `/${locale}/services/land-certificate`, icon: '🗺️' },
        { label: 'Agricultural Inputs', href: `/${locale}/services/agriculture`, icon: '🌾' },
        { label: 'Business Permits & Tax', href: `/${locale}/services/business-license`, icon: '💼' },
        { label: 'Citizen Grievance Desk', href: `/${locale}/contact`, icon: '⚖️' },
      ],
      highlights: [
        { num: 19, suffix: '', label: 'Rural & Urban Kebeles' },
        { num: 140, suffix: 'K+', label: 'Citizens Served' },
        { num: 110, suffix: ' km', label: 'Distance from Addis Ababa' },
        { num: 2800, suffix: 'm', label: 'Highland Agro-Ecology' },
      ],
    },
    am: {
      badge: 'ይፋዊ ፖርታል • ሰሜን ሸዋ ዞን',
      climateBadge: 'ጫቻ፡ 18°ሴ • ከፍታ፡ 2,840 ሜ • ደጋማ ቀጠና',
      title: 'እንኳን ወደ አንጎሌላ ተራ ወረዳ በደህና መጡ',
      subtitle:
        'በዘመናዊ የህዝብ አገልግሎት፣ በግብርና ልማትና በኢንቨስትመንት መስፋፋት የበለጸገ፣ ፍትሃዊና ጠንካራ ማህበረሰብ እየገነባን ነው።',
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
        { num: 19, suffix: '', label: 'የገጠርና ከተማ ቀበሌዎች' },
        { num: 140, suffix: ' ሺህ+', label: 'ተገልጋይ ህዝብ' },
        { num: 110, suffix: ' ኪ.ሜ', label: 'ከአዲስ አበባ ርቀት' },
        { num: 2800, suffix: ' ሜትር', label: 'ደጋማ ስነ-ምህዳር' },
      ],
    },
  }[locale]

  const currentSlider = activeSliders[activeSlideIdx]

  const headline = currentSlider
    ? isAm
      ? currentSlider.title_am || currentSlider.title_en
      : currentSlider.title_en
    : content.title

  const subline = currentSlider
    ? isAm
      ? currentSlider.subtitle_am || currentSlider.subtitle_en
      : currentSlider.subtitle_en
    : content.subtitle

  const ctaBtnText = currentSlider
    ? isAm
      ? currentSlider.buttonText_am || currentSlider.buttonText_en
      : currentSlider.buttonText_en
    : content.ctaServices

  const ctaBtnUrl = currentSlider?.buttonUrl
    ? currentSlider.buttonUrl.startsWith('http')
      ? currentSlider.buttonUrl
      : `/${locale}${
          currentSlider.buttonUrl.startsWith('/')
            ? currentSlider.buttonUrl
            : '/' + currentSlider.buttonUrl
        }`
    : `/${locale}/services`

  return (
    <section className="relative bg-gradient-to-b from-[#061426] via-[#0d2340] to-[#133a6b] text-white pt-10 pb-16 lg:pt-14 lg:pb-24 overflow-hidden">
      {/* Dynamic Animated Ambient Glow Orbs */}
      <div className="absolute top-[-10%] right-[5%] w-[450px] h-[450px] bg-[#c8931a]/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#1a4f8b]/35 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-[#009A44]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Animated Highland Topographic SVG Lines Backdrop */}
      <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
        <svg
          className="w-full h-full object-cover animate-float-slow"
          viewBox="0 0 1440 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M-100 200 C 300 120, 600 350, 1100 180 C 1300 120, 1500 240, 1600 210"
            stroke="rgba(254, 209, 0, 0.4)"
            strokeWidth="1.5"
            strokeDasharray="6 8"
          />
          <path
            d="M-80 320 C 350 210, 750 420, 1200 260 C 1380 200, 1550 310, 1650 280"
            stroke="rgba(255, 255, 255, 0.25)"
            strokeWidth="1.2"
          />
          <path
            d="M-120 440 C 280 360, 680 500, 1050 380 C 1320 290, 1500 420, 1620 390"
            stroke="rgba(0, 154, 68, 0.35)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
          />
          <path
            d="M-50 120 C 420 40, 800 220, 1300 100 C 1450 70, 1580 150, 1680 120"
            stroke="rgba(255, 255, 255, 0.15)"
            strokeWidth="1"
          />
        </svg>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Climate & Status Indicator Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          {/* Institutional Status Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#FED100] shadow-sm hover:bg-white/15 transition-colors">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#009A44] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#009A44]" />
            </span>
            <span>{content.badge}</span>
          </div>

          {/* Highland Weather & Altitude Sensor Tag */}
          <div className="inline-flex items-center gap-2 bg-[#0d2340]/70 backdrop-blur-md border border-[#c8931a]/30 px-3.5 py-1.5 rounded-full text-[11px] font-medium text-amber-200/90 shadow-inner">
            <span className="animate-spin-slow">⛅</span>
            <span>{content.climateBadge}</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10 mb-10">
          <div className="max-w-2xl min-h-[290px] flex flex-col justify-center">
            {/* Main Title (Animated Transition) */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15] sm:leading-[1.18] mb-4 drop-shadow-md transition-all duration-500">
              {headline}
            </h1>

            {/* Subtitle / Mission Statement */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-200/90 font-normal leading-relaxed mb-8 max-w-2xl drop-shadow-xs transition-all duration-500">
              {subline}
            </p>

            {/* Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href={ctaBtnUrl}
                className="group relative inline-flex items-center gap-2.5 bg-gradient-to-r from-[#c8931a] to-[#e5a924] hover:from-[#dca01e] hover:to-[#f0b938] text-[#0d2340] font-black text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg
                  className="w-4 h-4 text-[#0d2340] group-hover:rotate-12 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>{ctaBtnText}</span>
              </Link>

              <Link
                href={`/${locale}/investment`}
                className="group inline-flex items-center gap-2.5 bg-white/10 hover:bg-white/20 text-white border border-white/30 hover:border-white/50 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl backdrop-blur-md transition-all duration-200 transform hover:-translate-y-0.5"
              >
                <svg
                  className="w-4 h-4 text-[#FED100] group-hover:scale-110 transition-transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
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
                      idx === activeSlideIdx
                        ? 'w-8 bg-[#FED100] shadow-sm shadow-amber-400/50'
                        : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    aria-label={`Slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Official Seal Feature with Rotating Orbit Ring */}
          <div className="hidden lg:flex flex-col items-center justify-center shrink-0 pr-4">
            <div className="relative group">
              {/* Outer Golden Aura */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[#c8931a]/40 via-blue-500/30 to-[#009A44]/40 rounded-full blur-2xl opacity-60 group-hover:opacity-90 transition duration-700" />

              {/* Rotating Dashed Orbit Ring */}
              <div
                className="absolute -inset-3 rounded-full border border-dashed border-[#FED100]/40 pointer-events-none animate-spin"
                style={{ animationDuration: '30s' }}
              />

              <div className="relative w-52 h-52 xl:w-60 xl:h-60 rounded-full bg-white/10 p-3.5 backdrop-blur-xl border-2 border-white/30 shadow-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                <img
                  src="/logo.png"
                  alt="Official Seal of Angolela Tera Woreda"
                  className="w-full h-full object-contain rounded-full drop-shadow-2xl"
                />
              </div>
            </div>
            <span className="mt-5 inline-block text-[11px] font-black tracking-widest text-[#FED100] uppercase text-center bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-xs">
              Official Woreda Administration Seal
            </span>
          </div>
        </div>

        {/* Quick Access Pills Row with Micro-Interactions */}
        <div className="pt-6 border-t border-white/15">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
              <span>⚡</span> {content.quickTitle}
            </span>
            <span className="text-[11px] text-[#FED100]/80 hidden sm:inline-block">
              Immediate processing desks
            </span>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            {content.quickPills.map((pill, idx) => (
              <Link
                key={idx}
                href={pill.href}
                className="group inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 hover:border-[#FED100]/50 px-3.5 py-1.5 rounded-full text-xs font-semibold text-gray-100 hover:text-white transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="group-hover:scale-125 transition-transform duration-200">
                  {pill.icon}
                </span>
                <span>{pill.label}</span>
                <span className="text-gray-400 group-hover:text-[#FED100] transition-colors text-[10px]">
                  →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Animated Highlight Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/15">
          {content.highlights.map((item, idx) => (
            <div
              key={idx}
              className="group bg-white/8 hover:bg-white/15 border border-white/15 hover:border-[#c8931a]/60 rounded-2xl p-4 sm:p-5 backdrop-blur-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#FED100] tracking-tight flex items-baseline">
                <AnimatedCounter
                  end={item.num}
                  suffix={item.suffix}
                  duration={2000}
                />
              </div>
              <div className="text-xs sm:text-sm text-gray-200 mt-1.5 font-medium leading-snug group-hover:text-white transition-colors">
                {item.label}
              </div>
              <div className="w-6 h-0.5 bg-[#009A44] group-hover:w-full transition-all duration-300 mt-2.5 rounded-full opacity-70 group-hover:opacity-100" />
            </div>
          ))}
        </div>
      </div>

      {/* Ethiopian Flag Tibeb Accent Ribbon at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 tibeb-accent-border" />
    </section>
  )
}
