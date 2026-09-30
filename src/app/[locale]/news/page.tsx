import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import { NEWS_ARTICLES } from '@/data/mockData'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Official Press & Media Desk',
      title: 'News & Official Announcements',
      subtitle: 'Verified communications, public tender announcements, agricultural advisories, and council resolutions from Angolela Tera Woreda.',
      readMore: 'Read Full Press Release',
      authorLabel: 'Issued by',
      featuredTag: 'Featured Official Statement',
    },
    am: {
      tag: 'ይፋዊ መረጃና ፕሬስ ዴስክ',
      title: 'ዜናዎችና ይፋዊ ማስታወቂያዎች',
      subtitle: 'የአንጎሌላ ተራ ወረዳ ወቅታዊ ዜናዎች፣ የጨረታ ማስታወቂያዎች፣ የግብርና መመሪያዎችና የምክር ቤት ውሳኔዎች።',
      readMore: 'ሙሉውን መግለጫ ያንብቡ',
      authorLabel: 'አውጪው አካል',
      featuredTag: 'ዋና ይፋዊ መግለጫ',
    },
    om: {
      tag: 'Oduu fi Kominikeeshinii',
      title: 'Oduuwwan fi Beeksisoota Haaraa',
      subtitle: 'Oduuwwan aanaa, beeksisa caalbaasii fi murteewwan mana maree.',
      readMore: 'Oduu Guutuu Dubbisi',
      authorLabel: 'Kan Baase',
      featuredTag: 'Ibsa Ijoo',
    },
  }[locale as Locale]

  const featured = NEWS_ARTICLES.find((n) => n.isFeatured) || NEWS_ARTICLES[0]
  const otherNews = NEWS_ARTICLES.filter((n) => n.slug !== featured.slug)

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 mb-8 shadow-xs">
          <div className="max-w-3xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full">
              {content.tag}
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-[#0d2340] tracking-tight mt-3">
              {content.title}
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 leading-relaxed">
              {content.subtitle}
            </p>
          </div>
        </div>

        {/* Featured Story */}
        {featured && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs mb-10 hover:border-[#1a4f8b] transition-all">
            <div className="p-6 sm:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="text-xs font-bold text-[#FED100] bg-[#0d2340] px-3 py-1 rounded-full uppercase tracking-wider">
                  ★ {content.featuredTag}
                </span>
                <span className="text-xs font-semibold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                  {featured[`category_${locale as Locale}`] || featured.category_en}
                </span>
                <time className="text-xs text-gray-400 font-medium">
                  {featured[`date_${locale as Locale}`] || featured.date_en}
                </time>
              </div>

              <h2 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#0d2340] hover:text-[#1a4f8b] transition-colors leading-tight">
                <Link href={`/${locale}/news/${featured.slug}`}>
                  {featured[`title_${locale as Locale}`] || featured.title_en}
                </Link>
              </h2>

              <p className="text-xs sm:text-sm text-gray-600 mt-3 max-w-4xl leading-relaxed">
                {featured[`summary_${locale as Locale}`] || featured.summary_en}
              </p>

              <div className="mt-6 pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-gray-500 font-medium">
                  {content.authorLabel}: <strong className="text-gray-800">{featured[`author_${locale as Locale}`] || featured.author_en}</strong>
                </span>

                <Link
                  href={`/${locale}/news/${featured.slug}`}
                  className="inline-flex items-center gap-1.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                >
                  <span>{content.readMore}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Other News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {otherNews.map((news) => {
            const title = news[`title_${locale as Locale}`] || news.title_en
            const category = news[`category_${locale as Locale}`] || news.category_en
            const date = news[`date_${locale as Locale}`] || news.date_en
            const summary = news[`summary_${locale as Locale}`] || news.summary_en
            const author = news[`author_${locale as Locale}`] || news.author_en

            return (
              <article
                key={news.slug}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-xs hover:shadow-md hover:border-[#1a4f8b] transition-all flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                      {category}
                    </span>
                    <time className="text-[11px] text-gray-400 font-medium">
                      {date}
                    </time>
                  </div>

                  <h3 className="text-base font-bold text-[#0d2340] hover:text-[#1a4f8b] transition-colors leading-snug">
                    <Link href={`/${locale}/news/${news.slug}`}>
                      {title}
                    </Link>
                  </h3>

                  <p className="text-xs text-gray-600 mt-2.5 leading-relaxed line-clamp-3">
                    {summary}
                  </p>
                </div>

                <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-gray-500 font-medium truncate max-w-[200px]">
                    {author}
                  </span>
                  <Link
                    href={`/${locale}/news/${news.slug}`}
                    className="inline-flex items-center gap-1 font-bold text-[#1a4f8b] hover:text-[#c8931a] transition-colors"
                  >
                    <span>{content.readMore}</span>
                    <span>›</span>
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
