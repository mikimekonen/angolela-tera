import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { getKebeles } from '@/lib/dataStore'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function KebelesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const kebeles = getKebeles()

  const t = {
    en: {
      tag: 'Demographic Jurisdictions & Municipal Centers',
      title: 'Kebeles & Towns of Angolela Tera',
      subtitle: 'Angolela Tera Woreda comprises 19 administrative divisions encompassing vital rural farming kebeles and vibrant urban trade centers including Chacha.',
      rural: 'Rural Kebele',
      urban: 'Urban Town Center',
      population: 'Verified Population',
      distance: 'Distance from Chacha',
      agroEcology: 'Agro-Ecology',
      admin: 'Kebele Administration',
      contact: 'Office Phone',
    },
    am: {
      tag: 'የአስተዳደር ወሰኖችና የከተማ ማዕከላት',
      title: 'የአንጎሌላ ተራ ቀበሌዎችና ከተሞች',
      subtitle: 'አንጎሌላ ተራ ወረዳ 19 የገጠርና የከተማ ቀበሌዎችን የሚያጠቃልል ሲሆን የጫቻ ከተማን ጨምሮ ሰፊ የግብርናና የንግድ እንቅስቃሴ የሚካሄድበት ቀጠና ነው።',
      rural: 'የገጠር ቀበሌ',
      urban: 'የከተማ ማዕከል',
      population: 'የተገልጋይ ህዝብ ቁጥር',
      distance: 'ከጫቻ ያለው ርቀት',
      agroEcology: 'የስነ-ምህዳር ቀጠና',
      admin: 'የቀበሌው አስተዳዳሪ',
      contact: 'የቢሮ ስልክ',
    },
    om: {
      tag: 'Gandoolee fi Magaalota',
      title: 'Gandoolee Aanaa Angolallaa Xaraa',
      subtitle: 'Aanaan Angolallaa Xaraa gandoolee baadiyyaa fi magaalota 19 of keessaa qaba.',
      rural: 'Ganda Baadiyyaa',
      urban: 'Magaalaa',
      population: 'Baay\'ina Uummataa',
      distance: 'Fageenya Caccetti irraa',
      agroEcology: 'Haala Qilleensaa',
      admin: 'Bulchaa Gandaa',
      contact: 'Bilbila',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] via-[#1a4f8b] to-[#0d2340] text-white rounded-2xl p-6 sm:p-10 mb-10 shadow-lg">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3 py-1 rounded-full">
              {t.tag}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight mt-4 leading-tight">
              {t.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-200 mt-3 leading-relaxed">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Kebeles Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kebeles.map((k) => {
            const name = locale === 'am' ? k.name_am || k.name_en : locale === 'om' ? k.name_om || k.name_en : k.name_en
            const eco = locale === 'am' ? k.economicActivities_am || k.economicActivities_en : k.economicActivities_en

            return (
              <div
                key={k.slug}
                className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs hover:border-[#1a4f8b] transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        k.type === 'URBAN_TOWN'
                          ? 'bg-blue-50 text-[#1a4f8b] border-blue-200'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {k.type === 'URBAN_TOWN' ? t.urban : t.rural}
                    </span>

                    <span className="text-xs font-mono text-gray-400">
                      {k.distanceFromCapitalKm !== undefined ? `${k.distanceFromCapitalKm} km` : '0 km'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors">
                    {name}
                  </h3>

                  <div className="my-3 py-2.5 border-y border-gray-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t.population}:</span>
                      <strong className="text-[#0d2340]">
                        {k.population ? `${k.population.toLocaleString()} citizens` : '—'}
                      </strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">{t.agroEcology}:</span>
                      <strong className="text-gray-700">{k.mainAgroEcology || 'Dega'}</strong>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-4 line-clamp-3">
                    {eco}
                  </p>

                  {k.administratorName && (
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded-lg border border-gray-100">
                      <span className="text-gray-400 block text-[10px] uppercase font-bold">{t.admin}:</span>
                      <strong className="text-gray-800">{k.administratorName}</strong>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-mono">
                  <span>{k.contactPhone || '+251 58 661 0100'}</span>
                  <Link
                    href={`/${locale}/contact`}
                    className="text-xs font-bold text-[#1a4f8b] hover:underline"
                  >
                    Contact Desk →
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
