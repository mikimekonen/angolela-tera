import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { PublicShell } from '@/components/layout/PublicShell'
import { getSiteSettings, getMaintenanceStatus } from '@/lib/dataStore'
import { getSession } from '@/lib/auth'
import { MaintenanceScreen } from '@/components/maintenance/MaintenanceScreen'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) {
    return {}
  }

  const titles: Record<Locale, { title: string; desc: string }> = {
    en: {
      title: 'Angolela Tera Woreda | Official Government Portal',
      desc: 'Official portal of Angolela Tera Woreda, North Shewa Zone, Amhara Region, Ethiopia. Public services, sector offices, economic development, and investment opportunities.',
    },
    am: {
      title: 'የአንጎለላ ጠራ ወረዳ | ይፋዊ የመንግሥት ፖርታል',
      desc: 'የአንጎለላ ጠራ ወረዳ ይፋዊ ድረ-ገጽ፣ ሰሜን ሸዋ ዞን፣ አማራ ክልል፣ ኢትዮጵያ። የህዝብ አገልግሎቶች፣ ሴክተር መስሪያ ቤቶች፣ የልማትና ኢንቨስትመንት መረጃ።',
    },
  }

  const meta = titles[locale as Locale] || titles.en

  return {
    title: {
      default: meta.title,
      template: `%s | Angolela Tera Woreda`,
    },
    description: meta.desc,
    keywords: [
      'Angolela Tera',
      'አንጎለላ ጠራ',
      'Chacha',
      'North Shewa',
      'Amhara',
      'Ethiopia',
      'Woreda Administration',
    ],
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()
  const settings = getSiteSettings()
  const maint = getMaintenanceStatus()
  const session = await getSession()

  // If maintenance mode is active, block public visitors unless authorized as Super Admin
  if (maint.isActive && session?.role !== 'SUPER_ADMIN') {
    return (
      <MaintenanceScreen
        locale={locale}
        maintenanceEvent={maint.currentEvent}
        settings={settings}
      />
    )
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {maint.isActive && session?.role === 'SUPER_ADMIN' && (
        <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2 text-xs flex items-center justify-between sticky top-0 z-[100] shadow-md">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
            <span>⚠️ EMERGENCY MAINTENANCE MODE ACTIVE: Public traffic is currently blocked. You are viewing in Super Admin bypass mode.</span>
          </div>
          <Link
            href="/admin/super-admin"
            className="bg-slate-950 text-white px-2.5 py-1 rounded text-xs hover:bg-slate-800 transition"
          >
            System Control Center →
          </Link>
        </div>
      )}
      <PublicShell locale={locale as Locale} settings={settings}>
        {children}
      </PublicShell>
    </NextIntlClientProvider>
  )
}
