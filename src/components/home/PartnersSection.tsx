'use client'

import React from 'react'
import type { Locale } from '@/i18n/config'
import { MOCK_PARTNERS } from '@/data/entityData'

interface PartnersSectionProps {
  locale: Locale
}

export function PartnersSection({ locale }: PartnersSectionProps) {
  const t = {
    en: {
      badge: 'Strategic Collaboration & Development',
      title: 'Our Partner Organizations',
      subtitle:
        'Angolela Tera Woreda collaborates with international development agencies, universities, agricultural research centers, and federal institutions to drive sustainable local progress.',
      scope: 'Cooperation Scope',
      partnerSince: 'Partner Since',
      visitPartner: 'Official Website ↗',
    },
    am: {
      badge: 'ስትራቴጂካዊ ትብብርና ልማት',
      title: 'አጋር ድርጅቶቻችን',
      subtitle:
        'አንጎሌላ ተራ ወረዳ ከዓለም አቀፍ የልማት ድርጅቶች፣ ከከፍተኛ ትምህርት ተቋማት፣ ከግብርና ምርምር ማዕከላት እና ከመንግስት አካላት ጋር በጋራ ይሰራል፡',
      scope: 'የትብብር ዘርፍ',
      partnerSince: 'አጋር የሆነበት',
      visitPartner: 'ይፋዊ ድረ-ገጽ ↗',
    },
    om: {
      badge: 'Qindoomina Misoomaa',
      title: 'Dhaabbilee Hiriyyummaa Keenya',
      subtitle:
        'Aanaan Angolallaa Xaraa dhaabbilee misooma addunyaa, yunivarsitiiwwanii fi bu\'uuraalee qorannoo qonnaa waliin qindoominaan hojjeta.',
      scope: 'Balbalina Hojii',
      partnerSince: 'Bara Qindoominaa',
      visitPartner: 'Marsariitii ↗',
    },
  }[locale]

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
            🤝 {t.badge}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#0d2340] tracking-tight">
            {t.title}
          </h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_PARTNERS.map((partner) => {
            const name =
              locale === 'am' ? partner.name_am || partner.name_en :
              locale === 'om' ? partner.name_om || partner.name_en :
              partner.name_en

            const desc =
              locale === 'am' ? partner.description_am || partner.description_en :
              locale === 'om' ? partner.description_om || partner.description_en :
              partner.description_en

            const typeLabel =
              partner.partnerType === 'DEVELOPMENT_PARTNER' ? 'Development Partner' :
              partner.partnerType === 'ACADEMIC' ? 'Academic & Research' :
              partner.partnerType === 'INTERNATIONAL_ORG' ? 'International Org' :
              'Government Agency'

            return (
              <div
                key={partner.id}
                className="bg-gray-50 hover:bg-white border border-gray-200 hover:border-[#1a4f8b] rounded-2xl p-6 transition-all duration-300 shadow-xs hover:shadow-lg flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100/60 text-[#1a4f8b] px-2.5 py-0.5 rounded-full">
                      {typeLabel}
                    </span>
                    <span className="text-[11px] text-gray-400 font-medium">
                      {partner.country}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-white border border-gray-200 flex items-center justify-center text-2xl shadow-xs mb-3 group-hover:scale-105 transition-transform">
                    {partner.partnerType === 'ACADEMIC' ? '🎓' : partner.partnerType === 'DEVELOPMENT_PARTNER' ? '🌍' : partner.partnerType === 'INTERNATIONAL_ORG' ? '🌐' : '🏛️'}
                  </div>

                  <h3 className="text-sm font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-snug">
                    {name}
                  </h3>

                  <p className="text-xs text-gray-600 mt-2.5 line-clamp-4 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-gray-200/60 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-400">
                    {t.partnerSince} {partner.partnerSince}
                  </span>
                  {partner.website && (
                    <a
                      href={partner.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#1a4f8b] hover:underline text-[11px]"
                    >
                      {t.visitPartner}
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
