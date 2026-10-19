'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  Award,
  Landmark,
  Users,
  TrendingUp,
  Pause,
  Play,
  CheckCircle2,
  Building2,
  FileText
} from 'lucide-react'

import { OFFICIAL_LEADERS, type LeaderData } from '@/data/leadershipData'
export type { LeaderData }
export { OFFICIAL_LEADERS }


interface LeadershipSliderProps {
  locale: Locale
}

export function LeadershipSlider({ locale }: LeadershipSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showLanguageAlt, setShowLanguageAlt] = useState(false)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const leaders = OFFICIAL_LEADERS
  const currentLeader = leaders[currentIndex]

  // Slide navigation
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % leaders.length)
  }, [leaders.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + leaders.length) % leaders.length)
  }, [leaders.length])

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying) return
    timerRef.current = setInterval(() => {
      nextSlide()
    }, 8000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, nextSlide])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartX - touchEndX
    if (diff > 50) {
      nextSlide()
    } else if (diff < -50) {
      prevSlide()
    }
    setTouchStartX(null)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide()
    if (e.key === 'ArrowLeft') prevSlide()
  }

  // Localized texts
  const labels = {
    en: {
      badge: 'Official Cabinet & Party Secretariat',
      heading: 'Executive Leadership of Angolela Tera Woreda',
      subheading:
        'Meet the top executive administrators and political leadership driving sustainable regional growth, peace, public service, and citizen empowerment across the district.',
      slideOf: 'Leader',
      portfoliosTitle: 'Key Executive Responsibilities & Strategic Mandates',
      contactTitle: 'Official Direct Contacts',
      verifiedSource: 'Verified Official Communication',
      pause: 'Pause Auto-slide',
      play: 'Play Auto-slide',
      viewOtherLang: 'Switch to Amharic (አማርኛ)',
      viewOriginalLang: 'Switch to English',
      allDirectory: 'View Complete Bureau Cabinet Directory →',
      kebeleCount: 'Governing 19 Rural & Municipal Kebeles'
    },
    am: {
      badge: 'ይፋዊ የወረዳው አስፈጻሚና የፓርቲ አመራር',
      heading: 'የአንጎሌላ ተራ ወረዳ ከፍተኛ አመራሮች',
      subheading:
        'በወረዳው ውስጥ የህዝብ አገልግሎትን፣ ሰላምና ጸጥታን፣ የኢኮኖሚ እድገትን እና የዜጎችን ተጠቃሚነት በበላይነት የሚመሩ ከፍተኛ የመንግስት እና የፖለቲካ መሪዎች።',
      slideOf: 'አመራር',
      portfoliosTitle: 'ዋና ዋና የኃላፊነት ዘርፎችና ስትራቴጂካዊ ተግባራት',
      contactTitle: 'ይፋዊ የአድራሻ መረጃ',
      verifiedSource: 'የተረጋገጠ ይፋዊ መረጃ',
      pause: 'ስላይድ አቁም',
      play: 'ስላይድ አስጀምር',
      viewOtherLang: 'ወደ እንግሊዝኛ ቀይር (English)',
      viewOriginalLang: 'ወደ አማርኛ መልስ',
      allDirectory: 'ሁሉንም የካቢኔ ቢሮዎች ይመልከቱ →',
      kebeleCount: '19 የገጠርና ከተማ ቀበሌዎችን የሚያስተባብር'
    },
    om: {
      badge: 'Hoggansa Ol\'aanaa Aanaa fi Paartii',
      heading: 'Hoggantoota Ol\'aanaa Aanaa Angolallaa Xaraa',
      subheading:
        'Hoggantoota misooma aanaa, nageenya, tajaajila uummataa fi badhaadhina mirkaneessuuf kutannootti hojjetan.',
      slideOf: 'Hoggansa',
      portfoliosTitle: 'Itti Gaafatamummaa fi Hojiiwwan Tarsiimoo',
      contactTitle: 'Teessoo fi Quunnamtii',
      verifiedSource: 'Odeeffannoo Mirkanaa\'aa',
      pause: 'Dhaabi',
      play: 'Jalqabi',
      viewOtherLang: 'Afaan Ingiliffaatti Jijjiiri',
      viewOriginalLang: 'Afaan Oromootti Deebisi',
      allDirectory: 'Hoggantoota Mara Ilaali →',
      kebeleCount: 'Gandoolee 19 Bulcha'
    }
  }[locale]

  // Localized getters
  const getName = (l: LeaderData) => {
    if (showLanguageAlt) {
      return locale === 'en' ? l.name_am : l.name_en
    }
    return locale === 'am' ? l.name_am : locale === 'om' ? l.name_om : l.name_en
  }

  const getSecondaryName = (l: LeaderData) => {
    return locale === 'am' ? l.name_en : l.name_am
  }

  const getTitle = (l: LeaderData) => {
    if (showLanguageAlt) {
      return locale === 'en' ? l.title_am : l.title_en
    }
    return locale === 'am' ? l.title_am : locale === 'om' ? l.title_om : l.title_en
  }

  const getCategory = (l: LeaderData) => {
    return locale === 'am' ? l.category_am : locale === 'om' ? l.category_om : l.category_en
  }

  const getOffice = (l: LeaderData) => {
    return locale === 'am' ? l.office_am : locale === 'om' ? l.office_om : l.office_en
  }

  const getBio = (l: LeaderData) => {
    if (showLanguageAlt) {
      return locale === 'en' ? l.bio_am : l.bio_en
    }
    return locale === 'am' ? l.bio_am : locale === 'om' ? l.bio_om : l.bio_en
  }

  const getPortfolios = (l: LeaderData) => {
    if (showLanguageAlt) {
      return locale === 'en' ? l.portfolios_am : l.portfolios_en
    }
    return locale === 'am' ? l.portfolios_am : locale === 'om' ? l.portfolios_om : l.portfolios_en
  }

  return (
    <section
      className="py-16 bg-gradient-to-b from-[#061224] via-[#091b35] to-[#0d2340] text-white relative overflow-hidden select-none"
      aria-label="Executive Leadership Carousel"
      onKeyDown={handleKeyDown}
      tabIndex={0}
      onMouseEnter={() => setIsPlaying(false)}
      onMouseLeave={() => setIsPlaying(true)}
    >
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#1a4f8b]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#c8931a]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 top-1/2 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Subtle Ethiopian tricolor top edge highlight */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#009b44] via-[#fed100] to-[#e8112d] opacity-90" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative space-y-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#FED100] text-xs font-semibold uppercase tracking-wider backdrop-blur-md mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-[#FED100]" />
              <span>{labels.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {labels.heading}
            </h2>
            <p className="text-sm sm:text-base text-gray-300 mt-2.5 leading-relaxed">
              {labels.subheading}
            </p>
          </div>

          {/* Autoplay & Language toggles */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowLanguageAlt((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-[#FED100] transition-colors"
              title="Toggle English / Amharic view"
            >
              <span>🌐</span>
              <span>{showLanguageAlt ? labels.viewOriginalLang : labels.viewOtherLang}</span>
            </button>

            <button
              onClick={() => setIsPlaying((prev) => !prev)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-medium text-gray-200 transition-colors"
              title={isPlaying ? labels.pause : labels.play}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#FED100]" />
                  <span className="hidden sm:inline">{labels.pause}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{labels.play}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Thumbnail Selector Pills (Tab Carousel Nav) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {leaders.map((leader, idx) => {
            const isActive = idx === currentIndex
            return (
              <button
                key={leader.id}
                onClick={() => setCurrentIndex(idx)}
                className={`text-left p-3 sm:p-3.5 rounded-xl border transition-all duration-300 flex items-center gap-3 relative overflow-hidden group ${
                  isActive
                    ? 'bg-gradient-to-r from-[#1a4f8b]/90 to-[#0e315a]/95 border-[#FED100] shadow-lg shadow-[#1a4f8b]/30 ring-2 ring-[#FED100]/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25 text-gray-300'
                }`}
              >
                {/* Active progress strip */}
                {isActive && isPlaying && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FED100] animate-pulse" />
                )}

                {/* Avatar with gold ring */}
                <div
                  className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden shrink-0 border-2 transition-transform duration-300 ${
                    isActive
                      ? 'border-[#FED100] scale-105 shadow-md shadow-[#FED100]/20'
                      : 'border-white/20 group-hover:border-white/50'
                  }`}
                >
                  <Image
                    src={leader.photo}
                    alt={leader.name_en}
                    fill
                    sizes="48px"
                    className="object-cover"
                    priority={idx === 0}
                  />
                </div>

                {/* Leader Brief */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-[#FED100] text-[#0d2340]'
                          : 'bg-white/10 text-gray-400'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <span
                      className={`text-[11px] font-bold truncate block ${
                        isActive ? 'text-[#FED100]' : 'text-gray-400 group-hover:text-gray-200'
                      }`}
                    >
                      {getTitle(leader).split('•')[0]}
                    </span>
                  </div>
                  <h4
                    className={`text-xs sm:text-sm font-bold truncate mt-0.5 ${
                      isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'
                    }`}
                  >
                    {getName(leader)}
                  </h4>
                </div>
              </button>
            )
          })}
        </div>

        {/* Primary Interactive Slide Card */}
        <div
          className="relative bg-gradient-to-br from-[#0c2340]/90 via-[#0a1c33]/95 to-[#071527] border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl transition-all duration-500 overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Subtle watermark seal */}
          <div className="absolute right-4 bottom-4 text-white/5 pointer-events-none select-none">
            <Landmark className="w-80 h-80 -mr-16 -mb-16" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center relative z-10">
            {/* Left: Leader Portrait Frame (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="relative group w-full max-w-[340px] mx-auto sm:mx-0">
                {/* Glow ring */}
                <div className="absolute -inset-1.5 bg-gradient-to-r from-[#1a4f8b] via-[#FED100] to-[#009b44] rounded-3xl blur-md opacity-40 group-hover:opacity-75 transition duration-500" />

                {/* Main Photo Container */}
                <div className="relative aspect-square w-full rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl bg-[#0d2340]">
                  <Image
                    src={currentLeader.photo}
                    alt={currentLeader.name_en}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    priority
                  />

                  {/* Gradient bottom overlay */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/85 via-black/40 to-transparent flex items-end p-4" />

                  {/* Top-Right Badge: Rank & Authority */}
                  <div className="absolute top-3.5 right-3.5 bg-black/70 backdrop-blur-md border border-[#FED100]/60 px-3 py-1 rounded-full flex items-center gap-1.5 text-xs font-bold text-[#FED100] shadow-md">
                    <Award className="w-3.5 h-3.5 text-[#FED100]" />
                    <span>0{currentIndex + 1} / 04</span>
                  </div>

                  {/* Top-Left: Verified Seal */}
                  <div className="absolute top-3.5 left-3.5 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/50 px-2.5 py-1 rounded-full flex items-center gap-1 text-[11px] font-semibold text-emerald-300">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Official Post</span>
                  </div>
                </div>
              </div>

              {/* Verified Authority & Official Record Badge */}
              {currentLeader.sourceUrl && (
                <div className="mt-5 w-full max-w-[340px]">
                  <a
                    href={currentLeader.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-3.5 rounded-xl bg-blue-900/40 hover:bg-blue-800/60 border border-blue-400/30 text-xs font-medium text-blue-200 hover:text-white transition-all shadow-xs"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#FED100]" />
                    <span>{labels.verifiedSource} ({currentLeader.sourceText})</span>
                  </a>
                </div>
              )}
            </div>

            {/* Right: Leader Detailed Biography & Portfolios (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              <div>
                {/* Category Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a4f8b]/50 border border-[#1a4f8b] text-[#FED100] text-xs font-semibold mb-3">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>{getCategory(currentLeader)}</span>
                </div>

                {/* Full Dual Name */}
                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {getName(currentLeader)}
                  </h3>
                  <p className="text-sm sm:text-base font-semibold text-[#FED100]/90">
                    {getSecondaryName(currentLeader)}
                  </p>
                </div>

                {/* Title & Office */}
                <div className="mt-3 pb-4 border-b border-white/10">
                  <p className="text-base sm:text-lg font-bold text-gray-100 flex items-center gap-2">
                    <span>{getTitle(currentLeader)}</span>
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 mt-1 flex items-center gap-1.5">
                    <Landmark className="w-3.5 h-3.5 text-[#FED100] shrink-0" />
                    <span>{getOffice(currentLeader)}</span>
                  </p>
                </div>

                {/* Official Biography & Executive Quote */}
                <div className="my-5 bg-white/5 border-l-4 border-[#FED100] rounded-r-2xl p-4 sm:p-5 backdrop-blur-xs">
                  <p className="text-sm sm:text-base text-gray-200 leading-relaxed italic">
                    &ldquo;{getBio(currentLeader)}&rdquo;
                  </p>
                </div>

                {/* 4 Portfolios / Strategic Responsibilities */}
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-[#FED100]" />
                    <span>{labels.portfoliosTitle}</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {getPortfolios(currentLeader).map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl p-3 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-gray-200 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Slider Bottom Controls: Prev / Next / Counter */}
              <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={prevSlide}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FED100] hover:text-[#0d2340] border border-white/20 text-white flex items-center justify-center transition-all duration-200 shadow-md active:scale-95"
                    aria-label="Previous Leader"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <button
                    onClick={nextSlide}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-[#FED100] hover:text-[#0d2340] border border-white/20 text-white flex items-center justify-center transition-all duration-200 shadow-md active:scale-95"
                    aria-label="Next Leader"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  <div className="flex items-center gap-1.5 ml-2">
                    {leaders.map((_, dotIdx) => (
                      <button
                        key={dotIdx}
                        onClick={() => setCurrentIndex(dotIdx)}
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          dotIdx === currentIndex
                            ? 'w-8 bg-[#FED100]'
                            : 'w-2.5 bg-white/30 hover:bg-white/60'
                        }`}
                        aria-label={`Go to slide ${dotIdx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400 font-medium">
                    {labels.kebeleCount}
                  </span>
                  <Link
                    href={`/${locale}/about/leadership`}
                    className="text-xs font-bold text-[#FED100] hover:text-white transition-colors"
                  >
                    {labels.allDirectory}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
