'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Locale } from '@/i18n/config'
import { MOCK_PARTNERS } from '@/data/entityData'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ExternalLink,
  Phone,
  Mail,
  Building2,
  Globe,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react'

interface PartnersSectionProps {
  locale: Locale
}

export function PartnersSection({ locale }: PartnersSectionProps) {
  const [partners, setPartners] = useState(MOCK_PARTNERS)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    fetch('/api/v1/partners')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setPartners(data.data)
        }
      })
      .catch(() => {})
  }, [])

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % partners.length)
  }, [partners.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + partners.length) % partners.length)
  }, [partners.length])

  // Autoplay timer
  useEffect(() => {
    if (!isPlaying || isHovered || partners.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }

    timerRef.current = setInterval(() => {
      nextSlide()
    }, 5500)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, isHovered, nextSlide, partners.length])

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50
    if (isLeftSwipe) nextSlide()
    if (isRightSwipe) prevSlide()
  }

  const t = {
    en: {
      badge: 'Strategic Development Partners',
      title: 'Our Partner Organizations',
      subtitle:
        'Angolela Tera Woreda proudly collaborates with our leading private industrial enterprises — JERR PLC and Komari Beverage PLC — to drive local job creation, farmer grain aggregation, and sustainable community investment.',
      partnerSince: 'Partner Since',
      sectorLabel: 'Private Sector Strategic Partner',
      visitWebsite: 'Official Website',
      callDesk: 'Direct Office Phone',
      emailDesk: 'Official Email',
      viewAll: 'Explore All Development Partnerships',
      featured: 'Featured Partner Showcase',
      slideOf: 'Partner',
      of: 'of',
      keyContributions: 'Key Strategic Cooperation Areas',
      pause: 'Pause autoplay',
      play: 'Resume autoplay',
      next: 'Next Partner',
      prev: 'Previous Partner',
      tags: {
        'partner-jerr': [
          'Agro-Processing & Edible Oil',
          'Commercial Animal Feed',
          'Local Farmer Grain Linkage',
          '350+ Woreda Jobs',
        ],
        'partner-komari': [
          'Beverage Manufacturing (Arada)',
          'Youth Vocational Skills',
          'Water Resource Stewardship',
          '250+ Woreda Jobs',
        ],
      },
    },
    am: {
      badge: 'ስትራቴጂካዊ የልማት አጋሮች',
      title: 'አጋር ድርጅቶቻችን',
      subtitle:
        'አንጎሌላ ተራ ወረዳ ከአካባቢው ቀዳሚ የግል ኢንዱስትሪዎች — ጄር ኃ.የተ.የ.ማ እና ኮማሪ ቤቨሬጅ ኃ.የተ.የ.ማ — ጋር በመተባበር የስራ እድል ፈጠራን፣ የአርሶ አደሮች የገበያ ትስስርንና ዘላቂ ማህበረሰባዊ ልማትን በጋራ እያሳካ ይገኛል።',
      partnerSince: 'አጋር የሆነበት ዘመን',
      sectorLabel: 'የግል ዘርፍ ስትራቴጂካዊ የልማት አጋር',
      visitWebsite: 'ይፋዊ ድረ-ገጽ',
      callDesk: 'የስልክ መስመር',
      emailDesk: 'ኢሜይል አድራሻ',
      viewAll: 'የሁሉንም አጋር ድርጅቶች ሙሉ ዝርዝር ይመልከቱ',
      featured: 'የአጋር ድርጅቶች ልዩ ማስተዋወቂያ',
      slideOf: 'አጋር',
      of: 'ከ',
      keyContributions: 'ዋና ዋና የትብብርና የልማት ዘርፎች',
      pause: 'ተንቀሳቃሹን አቁም',
      play: 'ተንቀሳቃሹን አስጀምር',
      next: 'ቀጣይ አጋር',
      prev: 'ቀዳሚ አጋር',
      tags: {
        'partner-jerr': [
          'አግሮ-ኢንዱስትሪና የምግብ ዘይት',
          'የእንስሳት መኖ ማቀነባበሪያ',
          'የአርሶ አደር እህል ገበያ ትስስር',
          '350+ የወረዳው የስራ እድል',
        ],
        'partner-komari': [
          'ዘመናዊ የመጠጥ ማምረቻ (አራዳ)',
          'የወጣቶች የሙያ ስልጠና',
          'የአካባቢና የውሃ ጥበቃ',
          '250+ የወረዳው የስራ እድል',
        ],
      },
    },
    om: {
      badge: 'Dhaabbilee Qindoomina Misoomaa',
      title: 'Dhaabbilee Hiriyyummaa Keenya',
      subtitle:
        'Aanaan Angolallaa Xaraa warshaalee dhuunfaa gurguddoo — JERR PLC fi Komaarii PLC — waliin carraa hojii uumuu, gabaa qonnaan bultootaa fi misooma naannoo mirkaneessuuf qindoominaan hojjeta.',
      partnerSince: 'Bara Qindoominaa',
      sectorLabel: 'Dhaabbata Dhuunfaa Hiriyyaa Misoomaa',
      visitWebsite: 'Marsariitii',
      callDesk: 'Lakkoofsa Bilbilaa',
      emailDesk: 'Imeelii',
      viewAll: 'Tarree Dhaabbilee Hiriyyummaa Hunda Ilaali',
      featured: 'Agarsiisa Dhaabbilee Hiriyyummaa',
      slideOf: 'Hiriyyaa',
      of: 'keessaa',
      keyContributions: 'Kanneen Qindoominaan Hojjetaman',
      pause: 'Dhaabi',
      play: 'Jalqabsiisi',
      next: 'Itti Aanu',
      prev: 'Duraa',
      tags: {
        'partner-jerr': [
          'Oomisha Nyaataa fi Zayitii',
          'Nyaata Beeyladaa',
          'Gabaa Qonnaan Bultootaa',
          'Hojii 350+ Uumame',
        ],
        'partner-komari': [
          'Warshaa Dhugaatii (Arada)',
          'Leenjii Ogummaa Dargaggootaa',
          'Eegumsa Qabeenya Bishaanii',
          'Hojii 250+ Uumame',
        ],
      },
    },
  }[locale]

  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50/60 via-white to-gray-50/40 border-t border-gray-200/80 relative overflow-hidden">
      {/* Decorative ambient background blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200/80 px-3.5 py-1.5 rounded-full mb-3 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#c8931a]" />
              <span>{t.badge}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d2340] tracking-tight">
              {t.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2.5 leading-relaxed">
              {t.subtitle}
            </p>
          </div>

          {/* Slider Control Toolbar */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-end">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                aria-label={isPlaying ? t.pause : t.play}
                title={isPlaying ? t.pause : t.play}
                className="p-2 text-gray-500 hover:text-[#0d2340] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 text-[#1a4f8b]" />}
              </button>
              <div className="h-4 w-px bg-gray-200 mx-1" />
              <button
                onClick={prevSlide}
                aria-label={t.prev}
                title={t.prev}
                className="p-2 text-gray-600 hover:text-[#0d2340] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                aria-label={t.next}
                title={t.next}
                className="p-2 text-gray-600 hover:text-[#0d2340] hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <Link
              href={`/${locale}/partners`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] hover:text-[#0d2340] bg-white border border-gray-200 hover:border-[#1a4f8b] px-4 py-2.5 rounded-xl shadow-xs transition-all"
            >
              <span>{t.viewAll}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Interactive Dual-Slider Container */}
        <div
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Grid Layout (Desktop shows both gracefully side-by-side, active spotlight highlights; mobile slides) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {partners.map((partner, index) => {
              const isSelected = index === currentIndex
              const name =
                locale === 'am' ? partner.name_am || partner.name_en :
                locale === 'om' ? partner.name_om || partner.name_en :
                partner.name_en

              const desc =
                locale === 'am' ? partner.description_am || partner.description_en :
                locale === 'om' ? partner.description_om || partner.description_en :
                partner.description_en

              const partnerTags = (t.tags as Record<string, string[]>)[partner.id] || []
              const hasLogo = Boolean(partner.logo?.url)

              return (
                <div
                  key={partner.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`group relative bg-white border-2 rounded-3xl p-6 sm:p-8 transition-all duration-300 shadow-sm hover:shadow-xl cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#1a4f8b] ring-4 ring-[#1a4f8b]/10 bg-gradient-to-br from-white via-blue-50/15 to-white shadow-md'
                      : 'border-gray-200/80 hover:border-blue-300 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Active Slide Spotlight Ribbon */}
                  {isSelected && (
                    <div className="absolute -top-3.5 left-8 bg-[#1a4f8b] text-[#FED100] text-[10px] font-black uppercase tracking-wider px-3.5 py-1 rounded-full shadow-xs flex items-center gap-1.5 border border-white/20">
                      <Sparkles className="w-3 h-3 text-[#FED100]" />
                      <span>{t.featured}</span>
                    </div>
                  )}

                  <div>
                    {/* Top Identity Row: Logo / Emblem & Badges */}
                    <div className="flex items-start justify-between gap-4 mb-6 pt-1">
                      {/* Logo or Emblem Container */}
                      <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border border-gray-200 p-2 shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform overflow-hidden">
                        {hasLogo && partner.logo?.url ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={partner.logo.url}
                              alt={name}
                              fill
                              sizes="96px"
                              className="object-contain p-1"
                            />
                          </div>
                        ) : (
                          // Prestigious geometric emblem for JERR (no fake AI image)
                          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0d2340] to-[#1a4f8b] flex flex-col items-center justify-center text-white text-center p-1 shadow-inner">
                            <Building2 className="w-6 h-6 text-[#FED100] mb-0.5" />
                            <span className="text-[11px] font-black tracking-wider text-white">JERR</span>
                            <span className="text-[8px] font-bold text-blue-200 uppercase tracking-widest">PLC</span>
                          </div>
                        )}
                      </div>

                      {/* Right Meta Column */}
                      <div className="flex flex-col items-end gap-2 text-right">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#1a4f8b] bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5 text-[#1a4f8b]" />
                          <span>{t.sectorLabel}</span>
                        </span>

                        <span className="text-[11px] text-gray-500 font-semibold bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-lg">
                          {partner.country} 🇪🇹
                        </span>
                      </div>
                    </div>

                    {/* Company Name */}
                    <h3 className="text-xl sm:text-2xl font-black text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-tight">
                      {name}
                    </h3>

                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 mt-3 leading-relaxed">
                      {desc}
                    </p>

                    {/* Strategic Contributions Tags */}
                    {partnerTags.length > 0 && (
                      <div className="mt-5 pt-4 border-t border-gray-100">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 block mb-2">
                          {t.keyContributions}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {partnerTags.map((tag, tagIdx) => (
                            <span
                              key={tagIdx}
                              className="text-[11px] font-semibold text-gray-700 bg-gray-100/80 hover:bg-blue-50 hover:text-[#1a4f8b] px-2.5 py-1 rounded-md transition-colors"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Footer Contact & Website Links */}
                  <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 text-gray-500">
                      {partner.phone && (
                        <a
                          href={`tel:${partner.phone.replace(/[^0-9+]/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 hover:text-[#1a4f8b] transition-colors"
                          title={`${t.callDesk}: ${partner.phone}`}
                        >
                          <Phone className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-semibold text-gray-700">{partner.phone}</span>
                        </a>
                      )}
                      {partner.email && (
                        <a
                          href={`mailto:${partner.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="hidden sm:inline-flex items-center gap-1 hover:text-[#1a4f8b] transition-colors"
                          title={`${t.emailDesk}: ${partner.email}`}
                        >
                          <Mail className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-medium">{partner.email}</span>
                        </a>
                      )}
                    </div>

                    {partner.website && (
                      <a
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 font-bold text-[#1a4f8b] bg-blue-50 hover:bg-[#1a4f8b] hover:text-white px-3.5 py-2 rounded-xl transition-all shadow-2xs"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>{t.visitWebsite}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Slider Pagination Indicators & Mobile Nav */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200/60">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">
                {t.slideOf} <strong className="text-[#0d2340]">{currentIndex + 1}</strong> {t.of}{' '}
                <strong className="text-[#0d2340]">{partners.length}</strong>
              </span>
              <div className="flex items-center gap-1.5 ml-3">
                {partners.map((_, dotIdx) => (
                  <button
                    key={dotIdx}
                    onClick={() => setCurrentIndex(dotIdx)}
                    aria-label={`Go to slide ${dotIdx + 1}`}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      dotIdx === currentIndex
                        ? 'w-8 bg-[#1a4f8b]'
                        : 'w-2.5 bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="sm:hidden w-full text-center">
              <Link
                href={`/${locale}/partners`}
                className="inline-flex items-center justify-center gap-1.5 text-xs font-bold text-[#1a4f8b] bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-xs w-full"
              >
                <span>{t.viewAll}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
