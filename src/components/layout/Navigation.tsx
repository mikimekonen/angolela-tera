'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Locale } from '@/i18n/config'

interface NavigationProps {
  locale: Locale
  isMobileOpen?: boolean
  onCloseMobile?: () => void
}

interface NavItem {
  id: string
  label: string
  href: string
  children?: { title: string; href: string; description?: string }[]
}

export function Navigation({ locale, isMobileOpen = false, onCloseMobile }: NavigationProps) {
  const pathname = usePathname()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [mobileExpanded, setMobileExpanded] = useState<Record<string, boolean>>({})

  // Multilingual Navigation Definitions
  const navData: Record<Locale, NavItem[]> = {
    en: [
      { id: 'home', label: 'Home', href: `/${locale}` },
      {
        id: 'about',
        label: 'About',
        href: `/${locale}/about`,
        children: [
          { title: 'About the Woreda', href: `/${locale}/about`, description: 'Overview, demographics, vision and mission' },
          { title: 'Administration & Cabinet', href: `/${locale}/about/leadership`, description: 'Executive leadership and office holders' },
          { title: 'Historical Background', href: `/${locale}/about/history`, description: 'Heritage and founding of Angolela Tera' },
          { title: 'Geography & Climate', href: `/${locale}/about/geography`, description: 'Topography, weather, agro-ecological zones' },
        ],
      },
      {
        id: 'government',
        label: 'Government',
        href: `/${locale}/kebeles`,
        children: [
          { title: 'Woreda Council', href: `/${locale}/government/council`, description: 'Legislative body and representative assemblies' },
          { title: 'Kebele Administrations', href: `/${locale}/kebeles`, description: 'Grassroots administrative divisions — all 19 kebeles' },
          { title: 'Organizational Structure', href: `/${locale}/government/structure`, description: 'Governance and accountability chart' },
        ],
      },
      {
        id: 'services',
        label: 'Services',
        href: `/${locale}/services`,
        children: [
          { title: 'Civil Registration', href: `/${locale}/services/civil-registration`, description: 'Birth, marriage, and death certificates' },
          { title: 'Land Administration & Holding', href: `/${locale}/services/land-certificate`, description: 'Cadastral certificates and land tenure' },
          { title: 'Agriculture Extension & Inputs', href: `/${locale}/services/agriculture`, description: 'Farmer training, seeds, fertilizers' },
          { title: 'Trade, Business & Tax', href: `/${locale}/services/business-license`, description: 'Trade licensing, inspections, tax services' },
          { title: 'Education & Health Services', href: `/${locale}/services/health-insurance`, description: 'Community health insurance and care network' },
        ],
      },
      {
        id: 'development',
        label: 'Development',
        href: `/${locale}/development`,
        children: [
          { title: 'Key Development Projects', href: `/${locale}/development`, description: 'Ongoing infrastructure and capital investments' },
          { title: 'Water & Irrigation Schemes', href: `/${locale}/development/water`, description: 'Clean drinking water and river diversions' },
          { title: 'Rural Road Access', href: `/${locale}/development/roads`, description: 'Universal rural road access program' },
        ],
      },
      {
        id: 'investment',
        label: 'Investment',
        href: `/${locale}/investment`,
        children: [
          { title: 'Investment Potential', href: `/${locale}/investment`, description: 'Agro-processing, manufacturing, renewable energy' },
          { title: 'Land Bank & Site Access', href: `/${locale}/investment/land-bank`, description: 'Available industrial and commercial parcels' },
          { title: 'Private Enterprises & Companies', href: `/${locale}/companies`, description: 'Directory of registered local commercial firms' },
          { title: 'Partner Organizations', href: `/${locale}/partners`, description: 'Development partners and academic allies' },
          { title: 'Incentives & One-Stop Desk', href: `/${locale}/investment/incentives`, description: 'Permits, duty-free exemptions, support' },
        ],
      },
      {
        id: 'tourism',
        label: 'Tourism',
        href: `/${locale}/tourism`,
        children: [
          { title: 'Historical & Religious Sites', href: `/${locale}/tourism/history`, description: 'Historic churches, ancient settlements' },
          { title: 'Scenic Landscapes & Trekking', href: `/${locale}/tourism/nature`, description: 'Highland vistas, waterfalls, ecotourism' },
          { title: 'Culture & Festivals', href: `/${locale}/tourism/culture`, description: 'Traditional craftsmanship and celebrations' },
        ],
      },
      {
        id: 'news',
        label: 'News & Media',
        href: `/${locale}/news`,
        children: [
          { title: 'Latest News', href: `/${locale}/news`, description: 'Official press releases and woreda updates' },
          { title: 'Official Announcements', href: `/${locale}/news/announcements`, description: 'Public tenders, notices, recruitment' },
          { title: 'Tenders & Procurement', href: `/${locale}/tenders`, description: 'Open bids, ITTs and procurement notices' },
          { title: 'Photo & Video Gallery', href: `/${locale}/news/gallery`, description: 'Documentary coverage of community events' },
        ],
      },
      {
        id: 'resources',
        label: 'Resources',
        href: `/${locale}/resources`,
        children: [
          { title: 'Directives & Regulations', href: `/${locale}/resources/regulations`, description: 'Regional and woreda legal enactments' },
          { title: 'Downloadable Forms', href: `/${locale}/resources/forms`, description: 'Application forms for citizen services' },
          { title: 'Annual Performance Reports', href: `/${locale}/resources/reports`, description: 'Public expenditure and audit summaries' },
        ],
      },
      { id: 'contact', label: 'Contact', href: `/${locale}/contact` },
    ],
    am: [
      { id: 'home', label: 'ዋና ገጽ', href: `/${locale}` },
      {
        id: 'about',
        label: 'ስለ ወረዳው',
        href: `/${locale}/about`,
        children: [
          { title: 'የወረዳው አጠቃላይ መረጃ', href: `/${locale}/about`, description: 'ራዕይ፣ ተልዕኮ እና የስነ-ህዝብ መረጃ' },
          { title: 'አመራርና ካቢኔ', href: `/${locale}/about/leadership`, description: 'የስራ አስፈጻሚ አካላት ዝርዝር' },
          { title: 'ታሪካዊ አመጣጥ', href: `/${locale}/about/history`, description: 'የአንጎሌላ ተራ ታሪክና ቅርስ' },
          { title: 'መልክአ ምድርና የአየር ንብረት', href: `/${locale}/about/geography`, description: 'የመሬት አቀማመጥና ስነ-ምህዳር' },
        ],
      },
      {
        id: 'government',
        label: 'መንግሥት',
        href: `/${locale}/kebeles`,
        children: [
          { title: 'የወረዳው ምክር ቤት', href: `/${locale}/government/council`, description: 'የህዝብ ተወካዮች ምክር ቤት' },
          { title: 'የቀበሌ አስተዳደሮች', href: `/${locale}/kebeles`, description: 'ሁሉም 19 ቀበሌዎች ና ከተሞች' },
        ],
      },
      {
        id: 'services',
        label: 'አገልግሎቶች',
        href: `/${locale}/services`,
        children: [
          { title: 'የወሳኝ ኩነት ምዝገባ', href: `/${locale}/services/civil-registration`, description: 'የልደት፣ ጋብቻና የሞት ምስክር ወረቀት' },
          { title: 'የመሬት አስተዳደር', href: `/${locale}/services/land-certificate`, description: 'የገጠርና የከተማ መሬት ይዞታ ማረጋገጫ' },
          { title: 'የግብርና ኤክስቴንሽን', href: `/${locale}/services/agriculture`, description: 'የአርሶ አደር ስልጠናና የግብአት አቅርቦት' },
          { title: 'ንግድና ገቢዎች', href: `/${locale}/services/business-license`, description: 'የንግድ ፈቃድና የግብር አገልግሎቶች' },
        ],
      },
      {
        id: 'development',
        label: 'ልማት',
        href: `/${locale}/development`,
        children: [
          { title: 'የልማት ፕሮጀክቶች', href: `/${locale}/development`, description: 'በሂደት ላይ ያሉ የመሰረተ ልማት ስራዎች' },
          { title: 'ውሃና መስኖ', href: `/${locale}/development/water`, description: 'የንጹህ መጠጥ ውሃና የመስኖ ልማት' },
          { title: 'ገጠር መንገዶች', href: `/${locale}/development/roads`, description: 'የገጠር ተደራሽነት የመንገድ ግንባታ' },
        ],
      },
      {
        id: 'investment',
        label: 'ኢንቨስትመንት',
        href: `/${locale}/investment`,
        children: [
          { title: 'የኢንቨስትመንት አማራጮች', href: `/${locale}/investment`, description: 'ግብርና፣ አግሮ ፕሮሰሲንግና ኢንዱስትሪ' },
          { title: 'የመሬት ባንክ', href: `/${locale}/investment/land-bank`, description: 'ለኢንቨስትመንት የተዘጋጁ ይዞታዎች' },
          { title: 'የግል ድርጅቶችና ፋብሪካዎች', href: `/${locale}/companies`, description: 'የተመዘገቡ የወረዳው ድርጅቶች ዝርዝር' },
          { title: 'አጋር ድርጅቶች', href: `/${locale}/partners`, description: 'ስትራቴጂካዊና የልማት አጋር ተቋማት' },
        ],
      },
      {
        id: 'tourism',
        label: 'ቱሪዝም',
        href: `/${locale}/tourism`,
        children: [
          { title: 'ታሪካዊና ሃይማኖታዊ ስፍራዎች', href: `/${locale}/tourism/history`, description: 'ጥንታዊ ገዳማትና የታሪክ ቅርሶች' },
          { title: 'የተፈጥሮ መስህቦች', href: `/${locale}/tourism/nature`, description: 'ተራሮች፣ ፏፏቴዎችና የተፈጥሮ ውበት' },
        ],
      },
      {
        id: 'news',
        label: 'ዜናና መረጃ',
        href: `/${locale}/news`,
        children: [
          { title: 'ወቅታዊ ዜናዎች', href: `/${locale}/news`, description: 'ይፋዊ መግለጫዎችና ዜናዎች' },
          { title: 'ማስታወቂያዎች', href: `/${locale}/news/announcements`, description: 'የጨረታና የስራ ቅጥር ማስታወቂያዎች' },
          { title: 'ጨረታዎችና ግዥ', href: `/${locale}/tenders`, description: 'ክፍት ጨረታዎች እና የግዥ ማስታወቂያዎች' },
        ],
      },
      {
        id: 'resources',
        label: 'ሰነዶች',
        href: `/${locale}/resources`,
        children: [
          { title: 'ህጎችና መመሪያዎች', href: `/${locale}/resources/regulations`, description: 'የወረዳው ደንቦችና አሰራሮች' },
          { title: 'የአገልግሎት ቅጾች', href: `/${locale}/resources/forms`, description: 'ለማውረድ የተዘጋጁ ማመልከቻዎች' },
        ],
      },
      { id: 'contact', label: 'ያግኙን', href: `/${locale}/contact` },
    ],
    om: [
      { id: 'home', label: 'Fuula Duraa', href: `/${locale}` },
      {
        id: 'about',
        label: 'Waa\'ee Aanaa',
        href: `/${locale}/about`,
        children: [
          { title: 'Waa\'ee Aanaa', href: `/${locale}/about`, description: 'Ilaalcha, ergama fi qabeenya' },
          { title: 'Hoggansa & Kaabinee', href: `/${locale}/about/leadership`, description: 'Hoggantoota aanaa' },
        ],
      },
      {
        id: 'government',
        label: 'Mootummaa',
        href: `/${locale}/kebeles`,
        children: [
          { title: 'Manni Maree Aanaa', href: `/${locale}/government/council`, description: 'Miseensota mana maree' },
          { title: 'Gandoolee Aanaa', href: `/${locale}/kebeles`, description: 'Gandoolee 19' },
        ],
      },
      {
        id: 'services',
        label: 'Tajaajiloota',
        href: `/${locale}/services`,
        children: [
          { title: 'Galmee Ragaalee Murtii', href: `/${locale}/services/civil-registration`, description: 'Dhaloota, gaa\'ela fi du\'a' },
          { title: 'Bulchiinsa Lafaa', href: `/${locale}/services/land-certificate`, description: 'Ragaa abbaa qabiyyummaa' },
          { title: 'Galtee Qonnaa', href: `/${locale}/services/agriculture`, description: 'Sanyii filatamaa fi xaa\'oo' },
          { title: 'Hayaama Daldalaa', href: `/${locale}/services/business-license`, description: 'Gibiraa fi daldala' },
        ],
      },
      { id: 'development', label: 'Misooma', href: `/${locale}/development` },
      { id: 'investment', label: 'Invastimantii', href: `/${locale}/investment` },
      { id: 'tourism', label: 'Tuuriizimii', href: `/${locale}/tourism` },
      {
        id: 'news',
        label: 'Oduu',
        href: `/${locale}/news`,
        children: [
          { title: 'Oduu Haaraa', href: `/${locale}/news`, description: 'Ibsa mootummaa fi oduu aanaa' },
          { title: 'Beeksisa Bittaa', href: `/${locale}/tenders`, description: 'Bittaa banaa fi beeksisa dhiyeessii' },
          { title: 'Kebele Hundeessaa', href: `/${locale}/kebeles`, description: 'Odeeffannoo kebele 19 fi magaalota' },
        ],
      },
      { id: 'resources', label: 'Qabeenya', href: `/${locale}/resources` },
      { id: 'contact', label: 'Qunnamtii', href: `/${locale}/contact` },
    ],
  }

  const items = navData[locale] || navData.en

  const toggleMobileSubmenu = (id: string) => {
    setMobileExpanded((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <>
      {/* Desktop Navigation Bar */}
      <nav className="hidden lg:block bg-[#1a4f8b] border-t border-b border-[#133a6b] shadow-md sticky top-[73px] z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center space-x-1 xl:space-x-2 text-sm font-medium">
            {items.map((item) => {
              const isActive = pathname === item.href || (item.id !== 'home' && pathname.startsWith(item.href))
              const hasDropdown = Boolean(item.children && item.children.length > 0)

              return (
                <li
                  key={item.id}
                  className="relative group"
                  onMouseEnter={() => hasDropdown && setActiveDropdown(item.id)}
                  onMouseLeave={() => hasDropdown && setActiveDropdown(null)}
                >
                  <Link
                    href={item.href}
                    className={`inline-flex items-center gap-1.5 px-3 py-3 text-white transition-colors duration-150 relative ${
                      isActive
                        ? 'font-bold bg-[#133a6b] text-[#FED100]'
                        : 'hover:bg-[#133a6b] hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <svg
                        className={`w-3.5 h-3.5 opacity-75 group-hover:opacity-100 transition-transform duration-200 ${
                          activeDropdown === item.id ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    {/* Active Bottom Highlight Bar */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-[#c8931a] rounded-t-sm" />
                    )}
                  </Link>

                  {/* Mega-menu / Dropdown */}
                  {hasDropdown && activeDropdown === item.id && (
                    <div className="absolute left-0 mt-0 w-72 bg-white rounded-b-lg shadow-xl border border-gray-200 py-2 z-50 animate-fadeIn">
                      <div className="py-1">
                        {item.children?.map((sub) => (
                          <Link
                            key={sub.href}
                            href={sub.href}
                            className="block px-4 py-2.5 hover:bg-blue-50 text-gray-800 transition-colors group/sub"
                          >
                            <div className="font-semibold text-xs text-[#0d2340] group-hover/sub:text-[#1a4f8b]">
                              {sub.title}
                            </div>
                            {sub.description && (
                              <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                {sub.description}
                              </p>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />

          {/* Drawer Sidebar */}
          <div className="relative ml-auto w-4/5 max-w-sm bg-[#0d2340] text-white h-full shadow-2xl overflow-y-auto flex flex-col p-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <span className="font-bold text-sm text-[#FED100]">Navigation Menu</span>
              <button
                onClick={onCloseMobile}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="mt-4 flex-1">
              <ul className="space-y-1">
                {items.map((item) => {
                  const hasChildren = Boolean(item.children && item.children.length > 0)
                  const isExpanded = mobileExpanded[item.id]

                  return (
                    <li key={item.id} className="border-b border-white/5 py-1">
                      <div className="flex items-center justify-between">
                        <Link
                          href={item.href}
                          onClick={onCloseMobile}
                          className="flex-1 py-2 text-sm font-medium hover:text-[#FED100] transition-colors"
                        >
                          {item.label}
                        </Link>
                        {hasChildren && (
                          <button
                            onClick={() => toggleMobileSubmenu(item.id)}
                            className="p-2 text-gray-400 hover:text-white"
                          >
                            <svg
                              className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        )}
                      </div>

                      {hasChildren && isExpanded && (
                        <div className="pl-4 py-1 space-y-1 bg-black/20 rounded-md my-1">
                          {item.children?.map((sub) => (
                            <Link
                              key={sub.href}
                              href={sub.href}
                              onClick={onCloseMobile}
                              className="block py-1.5 text-xs text-gray-300 hover:text-white transition-colors"
                            >
                              • {sub.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="pt-6 border-t border-white/10 mt-auto text-xs text-gray-400">
              <p className="font-semibold text-gray-200">Woreda Main Office</p>
              <p className="mt-0.5">Chacha Town, North Shewa Zone</p>
              <p className="mt-0.5">Tel: +251 (0) 58 661 xxxx</p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
