'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import { MOCK_BUSINESSES } from '@/data/entityData'
import { CompanySlider, type CompanyItem } from '@/components/companies/CompanySlider'

interface CompaniesSectionProps {
  locale: Locale
}

export function CompaniesSection({ locale }: CompaniesSectionProps) {
  const [businesses, setBusinesses] = useState<CompanyItem[]>(MOCK_BUSINESSES as CompanyItem[])

  useEffect(() => {
    fetch('/api/v1/companies')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setBusinesses(data.data)
        }
      })
      .catch(() => {})
  }, [])

  const t = {
    en: {
      investorNotice: 'Are you an investor? Explore available industrial land and lease incentives.',
      investBtn: 'Investment Corridor Guide →',
    },
    am: {
      investorNotice: 'ባለሀብት ነዎት? ለኢንቨስትመንት የተዘጋጁ የሊዝ መሬቶችና ማበረታቻዎችን ይመልከቱ።',
      investBtn: 'የኢንቨስትመንት መመሪያ →',
    },
    om: {
      investorNotice: 'Abbaa qabeenyaa? Carraawwan invastimantii qoradhaa.',
      investBtn: 'Qajeelfama Invastimantii →',
    },
  }[locale]

  return (
    <section className="py-16 bg-gradient-to-b from-white via-gray-50/50 to-gray-50/80 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Dynamic Interactive Slider */}
        <CompanySlider
          companies={businesses}
          locale={locale}
          showHeading={true}
          showViewToggle={true}
          initialViewMode="slider"
        />

        {/* Investment CTA Banner */}
        <div className="mt-12 bg-gradient-to-r from-[#0d2340] via-[#133560] to-[#1a4f8b] rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-white/10">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-lg font-bold text-white">
              {t.investorNotice}
            </h3>
            <p className="text-xs text-blue-100/90">
              One-stop permit processing, priority electrical connectivity, and direct highway frontage along the Chacha corridor.
            </p>
          </div>
          <Link
            href={`/${locale}/investment`}
            className="bg-[#c8931a] hover:bg-[#b07d12] text-white text-xs font-bold px-6 py-3 rounded-xl shadow-xs transition-colors shrink-0"
          >
            {t.investBtn}
          </Link>
        </div>
      </div>
    </section>
  )
}
