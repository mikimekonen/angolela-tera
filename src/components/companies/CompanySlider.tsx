'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ExternalLink,
  MapPin,
  Users,
  Calendar,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  X,
  Factory,
  Wheat,
  SlidersHorizontal,
  LayoutGrid,
} from 'lucide-react'

export interface CompanyItem {
  id: string
  name_en: string
  name_am?: string
  name_om?: string
  description_en: string
  description_am?: string
  description_om?: string
  sector: string
  address?: string
  phone?: string
  email?: string
  website?: string
  established?: string
  employeeCount?: string
  photo?: {
    url?: string
  }
  displayOrder?: number
  status?: string
}

interface CompanySliderProps {
  companies: CompanyItem[]
  locale: Locale
  showHeading?: boolean
  showViewToggle?: boolean
  initialViewMode?: 'slider' | 'grid'
}

export function CompanySlider({
  companies,
  locale,
  showHeading = true,
  showViewToggle = true,
  initialViewMode = 'slider',
}: CompanySliderProps) {
  const [activeSector, setActiveSector] = useState<string>('ALL')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>(initialViewMode)
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null)
  const [cardsPerView, setCardsPerView] = useState(3)
  const [isHovered, setIsHovered] = useState(false)

  // Touch and drag swipe state
  const [dragStartX, setDragStartX] = useState<number | null>(null)
  const [dragDeltaX, setDragDeltaX] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const autoPlayProgressRef = useRef<HTMLDivElement | null>(null)

  // Multilingual UI translations
  const t = {
    en: {
      badge: 'Chacha Industrial Corridor & Investment Hub',
      title: 'Private Enterprises & Industries Showcase',
      subtitle:
        'Discover Angolela Tera\'s leading beverage distillers, integrated agro-processing factories, dairy plants, and commercial enterprises powering the regional economy.',
      sectors: {
        ALL: 'All Industries',
        AGRO_PROCESSING: 'Agro-Processing & Dairy',
        MANUFACTURING: 'Beverages & Manufacturing',
        AGRICULTURE: 'Seed & Agriculture',
        CONSTRUCTION: 'Construction',
      },
      prev: 'Previous Industry',
      next: 'Next Industry',
      pause: 'Pause Slider',
      play: 'Play Slider',
      employees: 'Employees',
      est: 'Est.',
      quickView: 'Quick Profile',
      details: 'Full Details',
      visitSite: 'Visit Website',
      verified: 'Registered Enterprise',
      address: 'Location',
      contact: 'Contact Desk',
      phone: 'Phone',
      email: 'Email',
      website: 'Official Website',
      sector: 'Industrial Sector',
      sliderView: 'Interactive Slider',
      gridView: 'Catalog Grid',
      showing: 'Industry',
      of: 'of',
      close: 'Close Profile',
      investmentTitle: 'Interested in Industrial Land or Expansion?',
      investmentLink: 'Contact Woreda Investment Desk →',
    },
    am: {
      badge: 'የጫቻ ኢንዱስትሪ ኮሪደር እና የኢንቨስትመንት ማዕከል',
      title: 'የግል ድርጅቶችና ፋብሪካዎች ማሳያ',
      subtitle:
        'በአንጎሌላ ተራ ወረዳ በጫቻ አግሮ-ኢንዱስትሪ ኮሪደር የሚገኙ ዘመናዊ የመጠጥ ፋብሪካዎች፣ የተቀናጀ አግሮ-ኢንዱስትሪ፣ የወተት ማቀነባበሪያ እና የንግድ ተቋማት በይነተገናኝ ስላይደር።',
      sectors: {
        ALL: 'ሁሉም ኢንዱስትሪዎች',
        AGRO_PROCESSING: 'አግሮ-ፕሮሰሲንግና ወተት',
        MANUFACTURING: 'መጠጦችና ማኑፋክቸሪንግ',
        AGRICULTURE: 'ዘርና ግብርና',
        CONSTRUCTION: 'ኮንስትራክሽን',
      },
      prev: 'ቀዳሚ',
      next: 'ቀጣይ',
      pause: 'አፍታ አቁም',
      play: 'አጫውት',
      employees: 'ሰራተኞች',
      est: 'የተመሰረተበት',
      quickView: 'ፈጣን እይታ',
      details: 'ሙሉ መረጃ',
      visitSite: 'ድረ-ገጽ ጎብኝ',
      verified: 'የተረጋገጠ ድርጅት',
      address: 'አድራሻ',
      contact: 'የመገናኛ ዴስክ',
      phone: 'ስልክ',
      email: 'ኢሜይል',
      website: 'ኦፊሴላዊ ድረ-ገጽ',
      sector: 'የስራ ዘርፍ',
      sliderView: 'ስላይደር እይታ',
      gridView: 'ዝርዝር እይታ',
      showing: 'ኢንዱስትሪ',
      of: 'ከ',
      close: 'ዝጋ',
      investmentTitle: 'የኢንዱስትሪ መሬት ወይም የንግድ እድሎችን ይፈልጋሉ?',
      investmentLink: 'የወረዳው ኢንቨስትመንት ዴስክን ያነጋግሩ →',
    },
    om: {
      badge: 'Kooridoorii Warshaalee Caccetti fi Wiirtuu Invastimantii',
      title: 'Agarsiisa Warshaalee fi Dhaabbilee Dhuunfaa',
      subtitle:
        'Aanaa Angolallaa Xaraa keessatti warshaalee dhugaatii ammayyaa, warshaalee qonnaa fi aannanii, fi dhaabbilee daldalaa dinagdee naannoo guddiftan.',
      sectors: {
        ALL: 'Warshaalee Hunda',
        AGRO_PROCESSING: 'Qonnaa fi Aannanii',
        MANUFACTURING: 'Dhugaatii fi Warshaa',
        AGRICULTURE: 'Sanyii fi Qonna',
        CONSTRUCTION: 'Ijaarsa',
      },
      prev: 'Duraa',
      next: 'Itti Aanu',
      pause: 'Dhaabi',
      play: 'Taphachiisi',
      employees: 'Hojjettoota',
      est: 'Bara Hundeeffama',
      quickView: 'Ibsa Gabaabaa',
      details: 'Ibsa Guutuu',
      visitSite: 'Weebsaayitii',
      verified: 'Kan Mirkanaa\'e',
      address: 'Bakka',
      contact: 'Quunnamtii',
      phone: 'Bilbila',
      email: 'Iimeeyilii',
      website: 'Weebsaayitii Seera Qabeessa',
      sector: 'Damee Hojii',
      sliderView: 'Agarsiisa Slaayidii',
      gridView: 'Tarree Hunda',
      showing: 'Warshaa',
      of: 'keessaa',
      close: 'Cufi',
      investmentTitle: 'Lafa invastimantii barbaadduu?',
      investmentLink: 'Waajjira Invastimantii Aanaa Quunnamaa →',
    },
  }[locale]

  // Filter companies by sector
  const filtered = companies.filter(
    (b) => activeSector === 'ALL' || b.sector === activeSector
  )

  // Track responsive cards per view
  useEffect(() => {
    const updateCardsPerView = () => {
      if (typeof window === 'undefined') return
      if (window.innerWidth < 640) {
        setCardsPerView(1)
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2)
      } else {
        setCardsPerView(3)
      }
    }

    updateCardsPerView()
    window.addEventListener('resize', updateCardsPerView)
    return () => window.removeEventListener('resize', updateCardsPerView)
  }, [])

  const maxIndex = Math.max(0, filtered.length - cardsPerView)

  // Navigation handlers
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev >= maxIndex) return 0
      return prev + 1
    })
  }, [maxIndex])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => {
      if (prev <= 0) return maxIndex
      return prev - 1
    })
  }, [maxIndex])

  // Reset index when sector changes
  const handleSectorChange = (sector: string) => {
    setActiveSector(sector)
    setCurrentIndex(0)
  }

  // Autoplay loop with smooth progress animation
  useEffect(() => {
    if (!isPlaying || isHovered || filtered.length <= cardsPerView) return

    const interval = 4500
    timerRef.current = setInterval(() => {
      nextSlide()
    }, interval)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, isHovered, filtered.length, cardsPerView, nextSlide])

  // Touch and drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (dragStartX === null) return
    const currentX = e.touches[0].clientX
    setDragDeltaX(currentX - dragStartX)
  }

  const handleTouchEnd = () => {
    if (dragDeltaX < -45) {
      nextSlide()
    } else if (dragDeltaX > 45) {
      prevSlide()
    }
    setDragStartX(null)
    setDragDeltaX(0)
    setIsDragging(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setDragStartX(e.clientX)
    setIsDragging(true)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartX === null) return
    setDragDeltaX(e.clientX - dragStartX)
  }

  const handleMouseUp = () => {
    if (isDragging) {
      if (dragDeltaX < -45) {
        nextSlide()
      } else if (dragDeltaX > 45) {
        prevSlide()
      }
    }
    setDragStartX(null)
    setDragDeltaX(0)
    setIsDragging(false)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') nextSlide()
    if (e.key === 'ArrowLeft') prevSlide()
  }

  // Sector Badge Helpers
  const getSectorMeta = (sector: string) => {
    switch (sector) {
      case 'AGRO_PROCESSING':
        return {
          icon: <Factory className="w-4 h-4" />,
          emoji: '🏭',
          color: 'bg-amber-50 text-amber-900 border-amber-200',
          gradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
          label: t.sectors.AGRO_PROCESSING,
        }
      case 'MANUFACTURING':
        return {
          icon: <Building2 className="w-4 h-4" />,
          emoji: '⚙️',
          color: 'bg-indigo-50 text-indigo-900 border-indigo-200',
          gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
          label: t.sectors.MANUFACTURING,
        }
      case 'AGRICULTURE':
        return {
          icon: <Wheat className="w-4 h-4" />,
          emoji: '🌾',
          color: 'bg-emerald-50 text-emerald-900 border-emerald-200',
          gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
          label: t.sectors.AGRICULTURE,
        }
      default:
        return {
          icon: <Building2 className="w-4 h-4" />,
          emoji: '💼',
          color: 'bg-blue-50 text-blue-900 border-blue-200',
          gradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
          label: sector.replace('_', ' '),
        }
    }
  }

  return (
    <div
      className="w-full select-none outline-hidden"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        handleMouseUp()
      }}
    >
      {/* Optional Section Header */}
      {showHeading && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200/80 px-3.5 py-1 rounded-full inline-flex items-center gap-1.5 mb-3 shadow-2xs">
              <span className="inline-block w-2 h-2 rounded-full bg-[#1a4f8b] animate-pulse" />
              {t.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d2340] tracking-tight">
              {t.title}
            </h2>
            <p className="text-sm text-gray-600 mt-2.5 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* View toggle (Slider vs Grid) */}
          {showViewToggle && (
            <div className="flex items-center bg-gray-100/90 p-1 rounded-xl border border-gray-200/80 shrink-0 self-start md:self-auto">
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'slider'
                    ? 'bg-white text-[#0d2340] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={t.sliderView}
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#1a4f8b]" />
                <span>{t.sliderView}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-[#0d2340] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={t.gridView}
              >
                <LayoutGrid className="w-3.5 h-3.5 text-gray-600" />
                <span>{t.gridView}</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sector Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-2 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => handleSectorChange('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSector === 'ALL'
                ? 'bg-[#0d2340] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>{t.sectors.ALL}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeSector === 'ALL'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {companies.length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSectorChange('AGRO_PROCESSING')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSector === 'AGRO_PROCESSING'
                ? 'bg-[#1a4f8b] text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>🏭 {t.sectors.AGRO_PROCESSING}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeSector === 'AGRO_PROCESSING'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {companies.filter((c) => c.sector === 'AGRO_PROCESSING').length}
            </span>
          </button>
          <button
            type="button"
            onClick={() => handleSectorChange('MANUFACTURING')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeSector === 'MANUFACTURING'
                ? 'bg-purple-800 text-white shadow-xs'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span>⚙️ {t.sectors.MANUFACTURING}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                activeSector === 'MANUFACTURING'
                  ? 'bg-white/20 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              {companies.filter((c) => c.sector === 'MANUFACTURING').length}
            </span>
          </button>
        </div>

        {/* Live Slider Status and Controls */}
        {viewMode === 'slider' && (
          <div className="flex items-center gap-3 ml-auto">
            {/* Position indicator */}
            <div className="text-xs font-semibold text-gray-500 bg-gray-50 px-3 py-1 rounded-lg border border-gray-200/80">
              <span className="font-bold text-[#0d2340]">
                {String(Math.min(currentIndex + 1, filtered.length)).padStart(2, '0')}
              </span>
              <span className="text-gray-400 mx-1">/</span>
              <span>{String(filtered.length).padStart(2, '0')}</span>
            </div>

            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:text-[#1a4f8b] hover:border-[#1a4f8b] transition-all cursor-pointer shadow-2xs"
              title={isPlaying ? t.pause : t.play}
            >
              {isPlaying ? (
                <Pause className="w-3.5 h-3.5 fill-current" />
              ) : (
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              )}
            </button>

            {/* Prev / Next Arrows */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={prevSlide}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#1a4f8b] hover:text-white hover:border-[#1a4f8b] transition-all cursor-pointer shadow-2xs"
                title={t.prev}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-700 hover:bg-[#1a4f8b] hover:text-white hover:border-[#1a4f8b] transition-all cursor-pointer shadow-2xs"
                title={t.next}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* MODE 1: INTERACTIVE SLIDER VIEW                           */}
      {/* ========================================================= */}
      {viewMode === 'slider' ? (
        <div className="relative">
          {/* Slider Viewport */}
          <div
            className="overflow-hidden py-3 px-1 cursor-grab active:cursor-grabbing"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <div
              className="flex transition-transform duration-500 ease-out gap-6"
              style={{
                transform: `translateX(calc(-${currentIndex * (100 / cardsPerView)}% + ${dragDeltaX}px))`,
              }}
            >
              {filtered.map((biz) => {
                const name =
                  locale === 'am' ? biz.name_am || biz.name_en :
                  locale === 'om' ? biz.name_om || biz.name_en :
                  biz.name_en

                const desc =
                  locale === 'am' ? biz.description_am || biz.description_en :
                  locale === 'om' ? biz.description_om || biz.description_en :
                  biz.description_en

                const sectorMeta = getSectorMeta(biz.sector)

                return (
                  <div
                    key={biz.id}
                    style={{
                      width: `calc(${100 / cardsPerView}% - ${(24 * (cardsPerView - 1)) / cardsPerView}px)`,
                    }}
                    className="shrink-0 flex flex-col justify-between bg-white border border-gray-200/90 rounded-2xl p-5 shadow-xs hover:shadow-xl hover:border-[#1a4f8b] transition-all duration-300 group relative"
                  >
                    <div>
                      {/* Brand Logo Stage / Fallback Insignia */}
                      <div className="w-full h-40 bg-linear-to-b from-gray-50 to-white rounded-xl mb-4 overflow-hidden relative border border-gray-100 flex items-center justify-center p-4">
                        {biz.photo?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={biz.photo.url}
                            alt={name}
                            className="max-h-full max-w-full object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          // Intentional, elegant sector emblem when company does not have a logo
                          <div className="w-full h-full rounded-lg bg-linear-to-br from-[#0d2340]/5 via-[#1a4f8b]/5 to-amber-500/10 flex flex-col items-center justify-center p-3 text-center border border-dashed border-gray-200">
                            <span className="text-4xl mb-1 filter drop-shadow-xs">
                              {sectorMeta.emoji}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#0d2340]">
                              {sectorMeta.label}
                            </span>
                            <span className="text-[9px] text-gray-500 font-medium mt-0.5">
                              Angolela Tera Commercial Directory
                            </span>
                          </div>
                        )}

                        {/* Top-Right Workforce Pill */}
                        {biz.employeeCount && (
                          <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#0d2340]/85 text-white backdrop-blur-xs flex items-center gap-1 shadow-xs">
                            <Users className="w-2.5 h-2.5" />
                            <span>{biz.employeeCount} {t.employees}</span>
                          </span>
                        )}

                        {/* Top-Left Verified Pill */}
                        <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-bold bg-white/90 text-emerald-800 border border-emerald-200 flex items-center gap-1 backdrop-blur-xs shadow-2xs">
                          <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                          <span>{t.verified}</span>
                        </span>
                      </div>

                      {/* Sector Badge */}
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${sectorMeta.color}`}
                        >
                          <span>{sectorMeta.emoji}</span>
                          <span>{sectorMeta.label}</span>
                        </span>
                        {biz.established && (
                          <span className="text-[10px] font-semibold text-gray-500 flex items-center gap-0.5">
                            <Calendar className="w-2.5 h-2.5 text-gray-400" />
                            <span>{t.est} {biz.established}</span>
                          </span>
                        )}
                      </div>

                      {/* Company Name */}
                      <h3
                        onClick={() => setSelectedCompany(biz)}
                        className="text-base font-extrabold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-snug line-clamp-2 cursor-pointer"
                      >
                        {name}
                      </h3>

                      {/* Brief description */}
                      <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    {/* Card Footer: Location & Action Buttons */}
                    <div className="mt-5 pt-3.5 border-t border-gray-100 space-y-2.5">
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0 mr-1" />
                        <span className="truncate text-[11px] font-medium text-gray-600">
                          {biz.address || 'Angolela Tera Woreda, Chacha Corridor'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setSelectedCompany(biz)}
                          className="text-xs font-bold text-[#1a4f8b] hover:text-[#0d2340] bg-blue-50/70 hover:bg-blue-100/70 px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <span>{t.quickView}</span>
                          <span className="text-xs">→</span>
                        </button>

                        {biz.website ? (
                          <a
                            href={biz.website}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-semibold text-gray-500 hover:text-emerald-700 flex items-center gap-1 transition-colors"
                          >
                            <span>{t.visitSite}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <Link
                            href={`/${locale}/companies`}
                            className="text-[11px] font-semibold text-gray-400 hover:text-[#0d2340]"
                          >
                            {t.details}
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Pagination Dots / Pills */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-7 bg-[#1a4f8b]'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      ) : (
        /* ========================================================= */
        /* MODE 2: EXPANDED CATALOG GRID VIEW                        */
        /* ========================================================= */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((biz) => {
            const name =
              locale === 'am' ? biz.name_am || biz.name_en :
              locale === 'om' ? biz.name_om || biz.name_en :
              biz.name_en

            const desc =
              locale === 'am' ? biz.description_am || biz.description_en :
              locale === 'om' ? biz.description_om || biz.description_en :
              biz.description_en

            const sectorMeta = getSectorMeta(biz.sector)

            return (
              <div
                key={biz.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-lg hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-full h-36 bg-gray-50 rounded-xl mb-4 overflow-hidden relative border border-gray-100 flex items-center justify-center p-3">
                    {biz.photo?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={biz.photo.url}
                        alt={name}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-3xl block">{sectorMeta.emoji}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase">
                          {sectorMeta.label}
                        </span>
                      </div>
                    )}
                    {biz.employeeCount && (
                      <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0d2340]/80 text-white">
                        {biz.employeeCount} {t.employees}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border inline-flex items-center gap-1 mb-2 ${sectorMeta.color}`}
                  >
                    <span>{sectorMeta.emoji}</span>
                    <span>{sectorMeta.label}</span>
                  </span>

                  <h3 className="text-base font-extrabold text-[#0d2340] leading-snug">
                    {name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-gray-500 truncate max-w-[60%]">
                    📍 {biz.address?.split(',')[0]}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSelectedCompany(biz)}
                    className="font-bold text-[#1a4f8b] hover:underline cursor-pointer"
                  >
                    {t.quickView} →
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ========================================================= */}
      {/* QUICK VIEW MODAL (Interactive Spotlight Drawer)           */}
      {/* ========================================================= */}
      {selectedCompany && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setSelectedCompany(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedCompany(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors cursor-pointer"
              title={t.close}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 mb-6 pb-6 border-b border-gray-100">
              <div className="w-24 h-24 rounded-2xl border border-gray-200 bg-linear-to-b from-gray-50 to-white p-3 shrink-0 flex items-center justify-center shadow-xs">
                {selectedCompany.photo?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedCompany.photo.url}
                    alt={selectedCompany.name_en}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-3xl block mb-0.5">
                      {getSectorMeta(selectedCompany.sector).emoji}
                    </span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase">
                      {selectedCompany.sector.replace('_', ' ')}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                      getSectorMeta(selectedCompany.sector).color
                    }`}
                  >
                    <span>{getSectorMeta(selectedCompany.sector).emoji}</span>
                    <span>{getSectorMeta(selectedCompany.sector).label}</span>
                  </span>
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>{t.verified}</span>
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-[#0d2340]">
                  {locale === 'am'
                    ? selectedCompany.name_am || selectedCompany.name_en
                    : locale === 'om'
                    ? selectedCompany.name_om || selectedCompany.name_en
                    : selectedCompany.name_en}
                </h3>

                {locale !== 'en' && selectedCompany.name_en && (
                  <p className="text-xs text-gray-400 font-medium mt-0.5">
                    {selectedCompany.name_en}
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                Company Overview & Operations
              </h4>
              <p className="text-sm text-gray-700 leading-relaxed">
                {locale === 'am'
                  ? selectedCompany.description_am || selectedCompany.description_en
                  : locale === 'om'
                  ? selectedCompany.description_om || selectedCompany.description_en
                  : selectedCompany.description_en}
              </p>
            </div>

            {/* Spec grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 rounded-2xl p-4 sm:p-5 border border-gray-100 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#1a4f8b] shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block font-medium">{t.address}:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedCompany.address || 'Angolela Tera Woreda, Chacha Corridor'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Users className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block font-medium">{t.employees}:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedCompany.employeeCount || 'Local Enterprise Staff'}
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-purple-700 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 block font-medium">{t.est}:</span>
                  <span className="font-semibold text-gray-800">
                    {selectedCompany.established || 'Established Corridor Enterprise'}
                  </span>
                </div>
              </div>

              {selectedCompany.phone && (
                <div className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block font-medium">{t.phone}:</span>
                    <a
                      href={`tel:${selectedCompany.phone}`}
                      className="font-semibold text-[#1a4f8b] hover:underline"
                    >
                      {selectedCompany.phone}
                    </a>
                  </div>
                </div>
              )}

              {selectedCompany.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block font-medium">{t.email}:</span>
                    <a
                      href={`mailto:${selectedCompany.email}`}
                      className="font-semibold text-[#1a4f8b] hover:underline"
                    >
                      {selectedCompany.email}
                    </a>
                  </div>
                </div>
              )}

              {selectedCompany.website && (
                <div className="flex items-start gap-2.5">
                  <ExternalLink className="w-4 h-4 text-indigo-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-gray-400 block font-medium">{t.website}:</span>
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#1a4f8b] hover:underline flex items-center gap-1"
                    >
                      <span>{selectedCompany.website.replace('https://', '')}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom CTA */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-gray-500 font-medium">
                {t.investmentTitle}
              </span>
              <Link
                href={`/${locale}/investment`}
                onClick={() => setSelectedCompany(null)}
                className="w-full sm:w-auto px-5 py-2.5 bg-[#0d2340] hover:bg-[#1a4f8b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors text-center"
              >
                {t.investmentLink}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
