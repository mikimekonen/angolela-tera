import React from 'react'
import Link from 'next/link'
import { Emblem } from '@/components/ui/Emblem'
import type { Locale } from '@/i18n/config'
import { OFFICIAL_SOCIAL_LINKS } from '@/lib/constants'

interface FooterProps {
  locale: Locale
  settings?: Record<string, string>
}

// Accessible SVG Social Icons
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 12 5 12 5s6.255 0 7.812.418ZM10.003 9.002v6.002l5.247-3.001-5.247-3.001Z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function ExternalIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
        clipRule="evenodd"
      />
    </svg>
  )
}

export function Footer({ locale, settings }: FooterProps) {
  // Resolve official social media links (centralized config with database overrides)
  const facebookUrl = settings?.social_facebook || OFFICIAL_SOCIAL_LINKS.facebook
  const youtubeUrl = settings?.social_youtube || OFFICIAL_SOCIAL_LINKS.youtube
  const xUrl = settings?.social_x || OFFICIAL_SOCIAL_LINKS.x

  const contentDict = {
    en: {
      tagline:
        'Serving our communities through transparent governance, accessible public services, and sustainable economic development.',
      addressTitle: 'Administration Headquarters',
      addressLine1: 'Angolela Tera Woreda Administrative Complex',
      addressLine2: 'Chacha Town, North Shewa Zone',
      addressLine3: 'Amhara National Regional State, Ethiopia',
      emergencyTitle: 'Emergency Hotlines',
      police: 'Woreda Police Division: +251 (0) 58 661 0111',
      health: 'Chacha Primary Hospital: +251 (0) 58 661 0222',
      fire: 'Disaster Prevention: +251 (0) 58 661 0333',
      quickLinks: 'Public Services',
      officesTitle: 'Economy & Enterprise Hub',
      workingHours: 'Working Hours',
      hoursDetail: 'Monday – Friday: 8:30 AM – 5:30 PM (Lunch break: 12:30 PM – 1:30 PM)',
      rights: 'All rights reserved. Official Portal of Angolela Tera Woreda.',
      portalNotice: 'Developed in compliance with Federal E-Government standards of Ethiopia.',
      followTitle: 'Follow Angolela Tera Woreda',
      followSubtitle:
        'Connect with our official government channels for verified news, public notices, and civic broadcasts.',
      followAriaFacebook: 'Visit our official Facebook page (opens in a new tab)',
      followAriaYouTube: 'Visit our official YouTube channel (opens in a new tab)',
      followAriaX: 'Visit our official X page (opens in a new tab)',
      facebookChannel: 'Official Page',
      youtubeChannel: 'Official Channel',
      xAccount: 'Official Account',
    },
    am: {
      tagline: 'ተደራሽ የህዝብ አገልግሎት፣ ግልጽነት እና ዘላቂ የኢኮኖሚ ልማት ለማህበረሰባችን።',
      addressTitle: 'የወረዳው ዋና መሥሪያ ቤት',
      addressLine1: 'የአንጎለላ ጠራ ወረዳ ጽህፈት ቤቶች ቅጥር ጊቢ',
      addressLine2: 'ጫጫ ከተማ፣ ሰሜን ሸዋ ዞን',
      addressLine3: 'የአማራ ብሔራዊ ክልላዊ መንግሥት፣ ኢትዮጵያ',
      emergencyTitle: 'የአደጋ ጊዜ ስልኮች',
      police: 'የወረዳው ፖሊስ መምሪያ፡ +251 (0) 58 661 0111',
      health: 'የጫጫ የመጀመሪያ ደረጃ ሆስፒታል፡ +251 (0) 58 661 0222',
      fire: 'የአደጋ መከላከልና ዝግጁነት፡ +251 (0) 58 661 0333',
      quickLinks: 'የህዝብ አገልግሎቶች',
      officesTitle: 'ኢኮኖሚና የግል ድርጅቶች',
      workingHours: 'የስራ ሰዓት',
      hoursDetail: 'ከሰኞ – አርብ፡ ከጠዋቱ 2:30 – 11:30 (የምሳ እረፍት ከ 6:30 – 7:30)',
      rights: 'መብቱ በህግ የተጠበቀ ነው። የአንጎለላ ጠራ ወረዳ ይፋዊ ፖርታል።',
      portalNotice: 'በኢትዮጵያ የኤሌክትሮኒክስ መንግሥት (E-Government) መመዘኛዎች መሰረት የተዘጋጀ።',
      followTitle: 'አንጎለላ ጠራ ወረዳን ይከታተሉ',
      followSubtitle:
        'ወቅታዊ ይፋዊ መረጃዎችን፣ ማስታወቂያዎችንና የወረዳውን ዜናዎች በማህበራዊ ሚዲያ ገጾቻችን ይከታተሉ።',
      followAriaFacebook: 'ይፋዊ የፌስቡክ (Facebook) ገጻችንን ይጎብኙ (በአዲስ መስኮት ይከፈታል)',
      followAriaYouTube: 'ይፋዊ የዩቲዩብ (YouTube) ቻናላችንን ይጎብኙ (በአዲስ መስኮት ይከፈታል)',
      followAriaX: 'ይፋዊ የኤክስ (X/Twitter) ገጻችንን ይጎብኙ (በአዲስ መስኮት ይከፈታል)',
      facebookChannel: 'ይፋዊ ገጽ',
      youtubeChannel: 'ይፋዊ ቻናል',
      xAccount: 'ይፋዊ አካውንት',
    },
  }
  const content = contentDict[locale] || contentDict.en

  return (
    <footer className="bg-[#0d2340] text-gray-300 border-t-4 border-[#c8931a] relative z-20">
      {/* Upper Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {/* Column 1: Identity & Crest */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Emblem size={52} />
              <div>
                <h2 className="text-white font-bold text-base leading-tight">
                  Angolela Tera Woreda
                </h2>
                <span className="text-[#c8931a] text-xs font-semibold">
                  Official Portal
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              {content.tagline}
            </p>
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-md px-3 py-1.5 text-xs text-gray-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>19 Rural Kebeles • 2 Urban Centers</span>
              </div>
            </div>

            {/* Quick Compact Social Links in Column 1 */}
            <div className="pt-2 flex items-center gap-2">
              <span className="text-[11px] text-gray-400 font-medium">
                {locale === 'am' ? 'ማህበራዊ ሚዲያ፡' : 'Official Social:'}
              </span>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={content.followAriaFacebook}
                title="Facebook • Angolela Tera Woreda"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#1877F2]/20 border border-white/10 hover:border-[#1877F2]/40 text-gray-300 hover:text-[#1877F2] flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8931a]"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
              </a>
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={content.followAriaYouTube}
                title="YouTube • Angolela Tera Woreda"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-[#FF0000]/20 border border-white/10 hover:border-[#FF0000]/40 text-gray-300 hover:text-[#FF0000] flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8931a]"
              >
                <YouTubeIcon className="w-4 h-4 fill-current" />
              </a>
              <a
                href={xUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={content.followAriaX}
                title="X (Twitter) • @angolela79256"
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/20 border border-white/10 hover:border-white/40 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8931a]"
              >
                <XIcon className="w-3.5 h-3.5 fill-current" />
              </a>
            </div>
          </div>

          {/* Column 2: Public Services */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-white/10 pb-2">
              {content.quickLinks}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/services/civil-registration`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> {locale === 'am' ? 'የወሳኝ ኩነት ምዝገባና ሰርተፊኬት' : 'Civil Status & Vital Certificates'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/land-certificate`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> {locale === 'am' ? 'የገጠር መሬት ይዞታ ምዝገባ' : 'Rural Land Holding Registration'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/agriculture`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> {locale === 'am' ? 'የግብርና ግብዓትና ኤክስቴንሽን' : 'Agricultural Input & Extension'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/business-license`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> {locale === 'am' ? 'የንግድ ፈቃድና የግብር አገልግሎት' : 'Trade Licensing & Tax Advisory'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/investment/land-bank`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> {locale === 'am' ? 'የኢንቨስትመንት መሬት ማመልከቻ' : 'Investment Land Application'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/track`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5 text-amber-300 font-semibold">
                  <span className="text-[#c8931a]">›</span> {locale === 'am' ? 'የጉዳይ ወይም የአቤቱታ ደረጃ መከታተያ' : 'Track Request / Grievance'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/offices`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> {locale === 'am' ? 'የሴክተር መሥሪያ ቤቶች ማውጫ' : 'Government Offices Directory'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/resources/forms`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> {locale === 'am' ? 'የዜጎች አገልግሎት መጠየቂያ ቅጾች' : 'Citizen Service Request Forms'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Economy & Enterprise Hub */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-white/10 pb-2">
              {content.officesTitle}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/companies`} className="hover:text-[#FED100] transition-colors">
                  {locale === 'am' ? 'የግል ድርጅቶችና ፋብሪካዎች' : 'Private Industries & Enterprises'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/investment`} className="hover:text-[#FED100] transition-colors">
                  {locale === 'am' ? 'የኢንቨስትመንት መመሪያ' : 'Industrial Investment Guide'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/kebeles`} className="hover:text-[#FED100] transition-colors">
                  {locale === 'am' ? '19ቱ የገጠርና ከተማ ቀበሌዎች' : '19 Kebele Administrations'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/about/leadership`} className="hover:text-[#FED100] transition-colors">
                  {locale === 'am' ? 'የወረዳው ካቢኔ አመራር' : 'Woreda Cabinet Leadership'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/development`} className="hover:text-[#FED100] transition-colors">
                  {locale === 'am' ? 'የልማት ፕሮጀክቶች' : 'Capital Development Projects'}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/partners`} className="hover:text-[#FED100] transition-colors">
                  {locale === 'am' ? 'አጋር ድርጅቶች' : 'Development Partners'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Address, Emergency & Hours */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-white/10 pb-2">
              {content.addressTitle}
            </h3>
            <div className="text-xs text-gray-400 space-y-1">
              <p className="text-gray-200 font-medium">{content.addressLine1}</p>
              <p>{content.addressLine2}</p>
              <p>{content.addressLine3}</p>
            </div>

            <div className="pt-2">
              <div className="text-[11px] font-semibold text-[#FED100] mb-1">
                {content.emergencyTitle}
              </div>
              <p className="text-xs text-gray-300 font-mono">
                {settings?.emergency_police ? `Woreda Police: ${settings.emergency_police}` : content.police}
              </p>
              <p className="text-xs text-gray-300 font-mono">
                {settings?.emergency_health ? `Chacha Hospital: ${settings.emergency_health}` : content.health}
              </p>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 border-t border-white/5">
              <span className="font-semibold text-gray-300">{content.workingHours}: </span>
              {settings?.[`working_hours_${locale}`] || settings?.working_hours_en || content.hoursDetail}
            </div>
          </div>
        </div>

        {/* Dedicated Social Media Section: Follow Angolela Tera Woreda */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#c8931a]" />
              <h3 className="text-white font-extrabold text-sm sm:text-base tracking-wide">
                {content.followTitle}
              </h3>
            </div>
            <p className="text-xs text-gray-400 max-w-xl leading-relaxed">
              {content.followSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Facebook Card */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.followAriaFacebook}
              title="Facebook • Angolela Tera Woreda"
              className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#1877F2]/15 border border-white/10 hover:border-[#1877F2]/50 text-gray-200 hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8931a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d2340] min-h-[44px]"
            >
              <span className="w-8 h-8 rounded-lg bg-[#1877F2]/20 text-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0">
                <FacebookIcon className="w-4 h-4 fill-current" />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold leading-tight text-white">Facebook</span>
                <span className="block text-[10px] text-gray-400 group-hover:text-gray-300">{content.facebookChannel}</span>
              </span>
              <ExternalIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 ml-0.5 shrink-0" />
            </a>

            {/* YouTube Card */}
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.followAriaYouTube}
              title="YouTube • Angolela Tera Woreda"
              className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#FF0000]/15 border border-white/10 hover:border-[#FF0000]/50 text-gray-200 hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8931a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d2340] min-h-[44px]"
            >
              <span className="w-8 h-8 rounded-lg bg-[#FF0000]/20 text-[#FF0000] flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0">
                <YouTubeIcon className="w-4 h-4 fill-current" />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold leading-tight text-white">YouTube</span>
                <span className="block text-[10px] text-gray-400 group-hover:text-gray-300">{content.youtubeChannel}</span>
              </span>
              <ExternalIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 ml-0.5 shrink-0" />
            </a>

            {/* X (formerly Twitter) Card */}
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={content.followAriaX}
              title="X (Twitter) • @angolela79256"
              className="group inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 hover:border-white/40 text-gray-200 hover:text-white transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c8931a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d2340] min-h-[44px]"
            >
              <span className="w-8 h-8 rounded-lg bg-white/10 text-white flex items-center justify-center group-hover:scale-110 transition-transform duration-200 shrink-0">
                <XIcon className="w-3.5 h-3.5 fill-current" />
              </span>
              <span className="text-left">
                <span className="block text-xs font-bold leading-tight text-white">X (Twitter)</span>
                <span className="block text-[10px] text-gray-400 group-hover:text-gray-300">@angolela79256</span>
              </span>
              <ExternalIcon className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 ml-0.5 shrink-0" />
            </a>
          </div>
        </div>
      </div>

      {/* Institutional Bottom Bar */}
      <div className="bg-[#08182d] border-t border-white/10 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <div>
            <p>© {new Date().getFullYear()} {content.rights}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{content.portalNotice}</p>
          </div>

          {/* Official Regional Links */}
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <a
              href="https://www.amhara.gov.et"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FED100] transition-colors"
            >
              {locale === 'am' ? 'የአማራ ብሔራዊ ክልላዊ መንግሥት' : 'Amhara Regional State'}
            </a>
            <span>•</span>
            <Link href={`/${locale}/privacy`} className="hover:text-[#FED100] transition-colors">
              {locale === 'am' ? 'የግላዊነት ፖሊሲ' : 'Privacy Policy'}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/accessibility`} className="hover:text-[#FED100] transition-colors">
              {locale === 'am' ? 'ተደራሽነት (Accessibility)' : 'Accessibility'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
