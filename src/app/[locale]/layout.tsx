import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { PublicShell } from '@/components/layout/PublicShell'
import { getSiteSettings } from '@/lib/dataStore'

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
      title: 'የአንጎሌላ ተራ ወረዳ | ይፋዊ የመንግሥት ፖርታል',
      desc: 'የአንጎሌላ ተራ ወረዳ ይፋዊ ድረ-ገጽ፣ ሰሜን ሸዋ ዞን፣ አማራ ክልል፣ ኢትዮጵያ። የህዝብ አገልግሎቶች፣ ሴክተር መስሪያ ቤቶች፣ የልማትና ኢንቨስትመንት መረጃ።',
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
      'አንጎሌላ ተራ',
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

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PublicShell locale={locale as Locale} settings={settings}>
        {children}
      </PublicShell>
    </NextIntlClientProvider>
  )
}
