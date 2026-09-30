import React from 'react'
import Link from 'next/link'
import { Emblem } from '@/components/ui/Emblem'
import type { Locale } from '@/i18n/config'

interface FooterProps {
  locale: Locale
}

export function Footer({ locale }: FooterProps) {
  const content = {
    en: {
      tagline: 'Serving our communities through transparent governance, accessible public services, and sustainable economic development.',
      addressTitle: 'Administration Headquarters',
      addressLine1: 'Angolela Tera Woreda Administrative Complex',
      addressLine2: 'Chacha Town, North Shewa Zone',
      addressLine3: 'Amhara National Regional State, Ethiopia',
      emergencyTitle: 'Emergency Hotlines',
      police: 'Woreda Police Division: +251 (0) 58 661 0111',
      health: 'Chacha Primary Hospital: +251 (0) 58 661 0222',
      fire: 'Disaster Prevention: +251 (0) 58 661 0333',
      quickLinks: 'Public Services',
      officesTitle: 'Key Sector Offices',
      workingHours: 'Working Hours',
      hoursDetail: 'Monday – Friday: 8:30 AM – 5:30 PM (Lunch break: 12:30 PM – 1:30 PM)',
      rights: 'All rights reserved. Official Portal of Angolela Tera Woreda.',
      portalNotice: 'Developed in compliance with Federal E-Government standards of Ethiopia.',
    },
    am: {
      tagline: 'ተደራሽ የህዝብ አገልግሎት፣ ግልጽነት እና ዘላቂ የኢኮኖሚ ልማት ለማህበረሰባችን።',
      addressTitle: 'የወረዳው ዋና መሥሪያ ቤት',
      addressLine1: 'የአንጎሌላ ተራ ወረዳ ጽህፈት ቤቶች ቅጥር ጊቢ',
      addressLine2: 'ጫቻ ከተማ፣ ሰሜን ሸዋ ዞን',
      addressLine3: 'የአማራ ብሔራዊ ክልላዊ መንግሥት፣ ኢትዮጵያ',
      emergencyTitle: 'የአደጋ ጊዜ ስልኮች',
      police: 'የወረዳው ፖሊስ መምሪያ፡ +251 (0) 58 661 0111',
      health: 'የጫቻ የመጀመሪያ ደረጃ ሆስፒታል፡ +251 (0) 58 661 0222',
      fire: 'የአደጋ መከላከልና ዝግጁነት፡ +251 (0) 58 661 0333',
      quickLinks: 'የህዝብ አገልግሎቶች',
      officesTitle: 'ዋና ዋና ሴክተር መስሪያ ቤቶች',
      workingHours: 'የስራ ሰዓት',
      hoursDetail: 'ከሰኞ – አርብ፡ ከጠዋቱ 2:30 – 11:30 (የምሳ እረፍት ከ 6:30 – 7:30)',
      rights: 'መብቱ በህግ የተጠበቀ ነው። የአንጎሌላ ተራ ወረዳ ይፋዊ ፖርታል።',
      portalNotice: 'በኢትዮጵያ የኤሌክትሮኒክስ መንግሥት (E-Government) መመዘኛዎች መሰረት የተዘጋጀ።',
    },
    om: {
      tagline: 'Tajaajila uummataa dhihoo, iftoomina fi misooma diinagdee itti fufiinsa qabuun hawaasa keenya ni tajaajilla.',
      addressTitle: 'Waajjira Ol\'aanaa Aanaa',
      addressLine1: 'Gamooma Waajjiroota Aanaa Angolallaa Xaraa',
      addressLine2: 'Magaalaa Caccetti, Godina Shawaa Kaabaa',
      addressLine3: 'Mootummaa Naannoo Amaaraa, Itoophiyaa',
      emergencyTitle: 'Bilbila Ariifachiisaa',
      police: 'Poolisii Aanaa: +251 (0) 58 661 0111',
      health: 'Hospitaala Sad. 1ffaa Caaccetti: +251 (0) 58 661 0222',
      fire: 'Ittisa Balaa: +251 (0) 58 661 0333',
      quickLinks: 'Tajaajiloota Uummataa',
      officesTitle: 'Waajjiroota Ijoo',
      workingHours: 'Sa\'aatii Hojii',
      hoursDetail: 'Wiixata – Jimmata: Ganama 2:30 – 11:30 (Boqonnaa Guyyaa 6:30 – 7:30)',
      rights: 'Mirgi qopheessaa seeraan eeggamaadha. Fuula Aanaa Angolallaa Xaraa.',
      portalNotice: 'Ulaagaalee Mootummaa Elektirooniksii Itoophiyaa hordofee kan qophaa\'e.',
    },
  }[locale]

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
          </div>

          {/* Column 2: Public Services */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-white/10 pb-2">
              {content.quickLinks}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/services/civil-registration`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> Civil Status & Vital Certificates
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/land`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> Rural Land Holding Registration
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/agriculture`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> Agricultural Input & Extension
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/services/business-permits`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> Trade Licensing & Tax Advisory
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/investment/land-bank`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> Investment Land Application
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/resources/forms`} className="hover:text-[#FED100] transition-colors flex items-center gap-1.5">
                  <span className="text-[#c8931a]">›</span> Citizen Service Request Forms
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Key Sector Offices */}
          <div className="space-y-3">
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider border-b border-white/10 pb-2">
              {content.officesTitle}
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href={`/${locale}/offices`} className="hover:text-[#FED100] transition-colors">
                  Office of the Chief Administrator
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/offices`} className="hover:text-[#FED100] transition-colors">
                  Agriculture & Rural Development Office
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/offices`} className="hover:text-[#FED100] transition-colors">
                  Trade, Industry & Market Development
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/offices`} className="hover:text-[#FED100] transition-colors">
                  Land Administration & Environmental Protection
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/offices`} className="hover:text-[#FED100] transition-colors">
                  Education & Vocational Bureau
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/offices`} className="hover:text-[#FED100] transition-colors">
                  Health & Disease Prevention Office
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
              <p className="text-xs text-gray-300 font-mono">{content.police}</p>
              <p className="text-xs text-gray-300 font-mono">{content.health}</p>
            </div>

            <div className="pt-2 text-[11px] text-gray-400 border-t border-white/5">
              <span className="font-semibold text-gray-300">{content.workingHours}: </span>
              {content.hoursDetail}
            </div>
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
              Amhara Regional State
            </a>
            <span>•</span>
            <Link href={`/${locale}/privacy`} className="hover:text-[#FED100] transition-colors">
              Privacy Policy
            </Link>
            <span>•</span>
            <Link href={`/${locale}/accessibility`} className="hover:text-[#FED100] transition-colors">
              Accessibility
            </Link>
            <span>•</span>
            <Link href="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors">
              Staff Portal (CMS)
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
