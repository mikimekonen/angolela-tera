import React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { PublicShell } from '@/components/layout/PublicShell'

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
    om: {
      title: 'Aanaa Angolallaa Xaraa | Fuula Mootummaa',
      desc: 'Fuula mootummaa Aanaa Angolallaa Xaraa, Godina Shawaa Kaabaa, Naannoo Amaaraa, Itoophiyaa. Tajaajiloota uummataa, waajjiroota fi invastimantii.',
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
      'ጫቻ',
      'North Shewa',
      'Amhara Region',
      'Ethiopia Woreda',
      'Public Services',
      'Investment Ethiopia',
    ],
    metadataBase: new URL('http://localhost:3000'),
    openGraph: {
      title: meta.title,
      description: meta.desc,
      locale: locale,
      type: 'website',
      siteName: 'Angolela Tera Woreda',
    },
    icons: {
      icon: [
        { url: '/logo.png', sizes: 'any' },
        { url: '/icon.png', type: 'image/png' },
      ],
      apple: '/logo.png',
      shortcut: '/logo.png',
    },
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

  // Enable static rendering
  setRequestLocale(locale)

  // Fetch messages for next-intl
  const messages = await getMessages()

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <PublicShell locale={locale as Locale}>
        {children}
      </PublicShell>
    </NextIntlClientProvider>
  )
}
