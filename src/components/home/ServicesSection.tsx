import React from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface ServicesSectionProps {
  locale: Locale
}

export function ServicesSection({ locale }: ServicesSectionProps) {
  const content = {
    en: {
      tag: 'Public Service Delivery',
      title: 'Citizen & Business Services',
      desc: 'Access essential administrative services, verify document requirements, and connect with frontline service desks across Angolela Tera Woreda.',
      viewAll: 'View All 18 Services',
      services: [
        {
          title: 'Civil & Vital Registration',
          desc: 'Official issuance of birth, marriage, divorce, and death certificates.',
          time: '1–2 Working Days',
          office: 'Vital Events Registration Desk',
          href: `/${locale}/services/civil-registration`,
          icon: '📋',
        },
        {
          title: 'Rural Land Holding & Cadastre',
          desc: 'Primary & secondary landholding certificates, boundary demarcation, and legal transfers.',
          time: '3–5 Working Days',
          office: 'Land Administration & Use Bureau',
          href: `/${locale}/services/land-certificate`,
          icon: '🗺️',
        },
        {
          title: 'Agricultural Extension & Input',
          desc: 'Distribution of certified highland wheat seeds, organic fertilizers, and livestock veterinary vaccines.',
          time: 'Immediate',
          office: 'Agriculture & Rural Development Office',
          href: `/${locale}/services/agriculture`,
          icon: '🌾',
        },
        {
          title: 'Trade Licensing & Commercial Registration',
          desc: 'New business license issuance, renewals, tax assessments, and commercial permits.',
          time: '1 Working Day',
          office: 'Trade & Industry Office',
          href: `/${locale}/services/business-license`,
          icon: '🏪',
        },
        {
          title: 'Construction & Building Permits',
          desc: 'Site plan approvals, building compliance inspections, and rural infrastructure clearances.',
          time: '5–7 Working Days',
          office: 'Urban Development & Construction Bureau',
          href: `/${locale}/services/building-permits`,
          icon: '🏗️',
        },
        {
          title: 'Social Protection & Citizen Redress',
          desc: 'Legal aid referrals, safety-net registry, elder care support, and grievance redressing.',
          time: 'Immediate / Case Review',
          office: 'Social Affairs & Grievance Division',
          href: `/${locale}/contact`,
          icon: '⚖️',
        },
      ],
    },
    am: {
      tag: 'የህዝብ አገልግሎት አሰጣጥ',
      title: 'የዜጎችና የንግድ አገልግሎቶች',
      desc: 'የአንጎሌላ ተራ ወረዳ የሚሰጣቸውን መሰረታዊ አገልግሎቶች፣ የሚፈለጉ ቅድመ ሁኔታዎችንና የቢሮዎችን መረጃ እዚህ ያግኙ።',
      viewAll: 'ሁሉንም 18 አገልግሎቶች ይመልከቱ',
      services: [
        {
          title: 'የወሳኝ ኩነት ምዝገባ',
          desc: 'የልደት፣ ጋብቻ፣ ፍቺ እና ሞት ምስክር ወረቀቶች ይፋዊ ምዝገባና አሰጣጥ።',
          time: '1–2 የስራ ቀናት',
          office: 'የወሳኝ ኩነት ምዝገባ ጽ/ቤት',
          href: `/${locale}/services/civil-registration`,
          icon: '📋',
        },
        {
          title: 'የገጠር መሬት ይዞታ ማረጋገጫ',
          desc: 'የአርሶ አደር ይዞታ ምስክር ወረቀት፣ የወሰን ማካለል እና የይዞታ ዝውውር አገልግሎቶች።',
          time: '3–5 የስራ ቀናት',
          office: 'የመሬት አስተዳደርና አጠቃቀም ጽ/ቤት',
          href: `/${locale}/services/land-certificate`,
          icon: '🗺️',
        },
        {
          title: 'የግብርና ኤክስቴንሽንና ግብአት',
          desc: 'የምርጥ ዘር፣ ማዳበሪያ እና የእንስሳት ህክምና አገልግሎት ስርጭት።',
          time: 'ቀጥታ / ወዲያውኑ',
          office: 'የግብርናና ገጠር ልማት ጽ/ቤት',
          href: `/${locale}/services/agriculture`,
          icon: '🌾',
        },
        {
          title: 'የንግድ ፈቃድና ምዝገባ',
          desc: 'አዳዲስ የንግድ ፈቃድ ማውጣት፣ ማደስ፣ የግብር ግምገማ እና የህጋዊነት ማረጋገጫ።',
          time: '1 የስራ ቀን',
          office: 'የንግድና ኢንዱስትሪ ጽ/ቤት',
          href: `/${locale}/services/business-license`,
          icon: '🏪',
        },
        {
          title: 'የግንባታ ፈቃድና ቁጥጥር',
          desc: 'የፕላን ማረጋገጥ፣ የግንባታ ፈቃድ አሰጣጥና የመሰረተ ልማት ፈቃዶች።',
          time: '5–7 የስራ ቀናት',
          office: 'የከተማ ልማትና ኮንስትራክሽን ጽ/ቤት',
          href: `/${locale}/services/building-permits`,
          icon: '🏗️',
        },
        {
          title: 'የህብረተሰብ ጥበቃና የቅሬታ ሰሚ',
          desc: 'የህግ ድጋፍ፣ ሴፍቲኔት ምዝገባ፣ የድጋፍ አገልግሎቶች እና የህዝብ ቅሬታ አፈታት።',
          time: 'እንደ ጉዳዩ ሁኔታ',
          office: 'የማህበራዊ ጉዳይና ቅሬታ ሰሚ ክፍል',
          href: `/${locale}/contact`,
          icon: '⚖️',
        },
      ],
    },
    om: {
      tag: 'Tajaajila Uummataa',
      title: 'Tajaajila Lammiilee fi Daldalaa',
      desc: 'Tajaajiloota aanaa keenyaa, ulaagaalee fi waajjiroota dhimmi ilaallatu argadhaa.',
      viewAll: 'Tajaajiloota Hundumaa Ilaali',
      services: [
        {
          title: 'Galmee Ragaalee Murtii',
          desc: 'Waraqaa ragaa dhalootaa, gaa\'elaa fi du\'aa.',
          time: 'Guyyoota Hojii 1–2',
          office: 'Kutaa Galmee Murtii',
          href: `/${locale}/services/civil-registration`,
          icon: '📋',
        },
        {
          title: 'Bulchiinsa Lafaa',
          desc: 'Ragaa qabiyyee lafaa fi kenniinsa waraqaa ragaa.',
          time: 'Guyyoota Hojii 3–5',
          office: 'Waajjira Bulchiinsa Lafaa',
          href: `/${locale}/services/land-certificate`,
          icon: '🗺️',
        },
        {
          title: 'Galtee Qonnaa',
          desc: 'Sanyii filatamaa, xaa\'oo fi tajaajila beeyladootaa.',
          time: 'Battalumatti',
          office: 'Waajjira Qonnaa fi Misooma Baadiyyaa',
          href: `/${locale}/services/agriculture`,
          icon: '🌾',
        },
        {
          title: 'Hayaama Daldalaa',
          desc: 'Hayaama daldalaa haaraa fi haaromsuu.',
          time: 'Guyyaa Hojii 1',
          office: 'Waajjira Daldalaa fi Industirii',
          href: `/${locale}/services/business-license`,
          icon: '🏪',
        },
        {
          title: 'Hayaama Ijaarsaa',
          desc: 'Karoora ijaarsaa mirkaneessuu fi to\'annoo.',
          time: 'Guyyoota Hojii 5–7',
          office: 'Waajjira Ijaarsaa',
          href: `/${locale}/services/building-permits`,
          icon: '🏗️',
        },
        {
          title: 'Tajaajila Hawaasummaa',
          desc: 'Dhimma hawaasummaa fi komii uummataa.',
          time: 'Battalumatti',
          office: 'Waajjira Dhimma Hawaasummaa',
          href: `/${locale}/contact`,
          icon: '⚖️',
        },
      ],
    },
  }[locale]

  return (
    <section className="py-16 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              {content.tag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h2>
            <p className="text-sm text-gray-600 mt-2 leading-relaxed">
              {content.desc}
            </p>
          </div>

          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors shrink-0"
          >
            <span>{content.viewAll}</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.services.map((item, idx) => (
            <div
              key={idx}
              className="border border-gray-200 rounded-xl p-6 hover:border-[#1a4f8b] hover:shadow-md transition-all duration-200 flex flex-col justify-between group bg-gradient-to-b from-white to-gray-50/50"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl p-2.5 bg-blue-50 rounded-xl group-hover:bg-[#1a4f8b]/10 transition-colors">
                    {item.icon}
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                    ⏱️ {item.time}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-medium truncate max-w-[180px]">
                  🏛️ {item.office}
                </span>

                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1a4f8b] group-hover:text-[#c8931a] transition-colors"
                >
                  <span>Apply / Guide</span>
                  <span>›</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
