import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { NEWS_ARTICLES } from '@/data/mockData'

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  for (const locale of locales) {
    for (const news of NEWS_ARTICLES) {
      params.push({ locale, slug: news.slug })
    }
  }
  return params
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const article = NEWS_ARTICLES.find((n) => n.slug === slug)
  if (!article) notFound()

  const related = NEWS_ARTICLES.filter((n) => n.slug !== slug).slice(0, 2)

  const title = article[`title_${locale as Locale}`] || article.title_en
  const category = article[`category_${locale as Locale}`] || article.category_en
  const date = article[`date_${locale as Locale}`] || article.date_en
  const author = article[`author_${locale as Locale}`] || article.author_en
  const contentParagraphs = article[`content_${locale as Locale}`] || article.content_en

  const content = {
    en: {
      breadcrumbHome: 'Home',
      breadcrumbNews: 'News & Announcements',
      authorPrefix: 'Issued by',
      relatedTitle: 'Recent Official Announcements',
      backToNews: 'Back to All News',
      shareLabel: 'Share Statement',
    },
    am: {
      breadcrumbHome: 'ዋና ገጽ',
      breadcrumbNews: 'ዜናና ማስታወቂያዎች',
      authorPrefix: 'አውጪው ጽ/ቤት',
      relatedTitle: 'ተዛማጅ ይፋዊ ማስታወቂያዎች',
      backToNews: 'ወደ ሁሉም ዜናዎች ተመለስ',
      shareLabel: 'መግለጫውን አጋራ',
    },
    om: {
      breadcrumbHome: 'Fuula Duraa',
      breadcrumbNews: 'Oduu',
      authorPrefix: 'Kan Baase',
      relatedTitle: 'Oduuwwan Dhihoo',
      backToNews: 'Gara Oduutti Deebi\'i',
      shareLabel: 'Qoodaa',
    },
  }[locale as Locale]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbHome}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/news`} className="hover:text-[#1a4f8b] transition-colors">
            {content.breadcrumbNews}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-semibold truncate max-w-[200px] sm:max-w-none">
            {title}
          </span>
        </nav>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Article (8 cols) */}
          <article className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 sm:p-10 shadow-xs">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#1a4f8b] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {category}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <time className="text-xs text-gray-500 font-medium">
                  {date}
                </time>
              </div>

              <span className="text-xs text-gray-500 font-medium">
                {content.authorPrefix}: <strong className="text-gray-800">{author}</strong>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0d2340] tracking-tight leading-tight mb-6">
              {title}
            </h1>

            {/* Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed">
              {contentParagraphs.map((para, idx) => (
                <p key={idx}>
                  {para}
                </p>
              ))}
            </div>

            {/* Official Footer Verification */}
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">
                Official Document Verification: AGT-PR-{slug.toUpperCase().slice(0, 8)}
              </span>
              <Link
                href={`/${locale}/news`}
                className="text-xs font-bold text-[#1a4f8b] hover:text-[#c8931a] transition-colors"
              >
                ← {content.backToNews}
              </Link>
            </div>
          </article>

          {/* Related Articles (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-[#0d2340] border-b border-gray-100 pb-3 mb-4">
                {content.relatedTitle}
              </h2>

              <div className="space-y-4">
                {related.map((item) => (
                  <div key={item.slug} className="group">
                    <span className="text-[10px] font-semibold text-[#1a4f8b] uppercase tracking-wider">
                      {item[`category_${locale as Locale}`] || item.category_en}
                    </span>
                    <h3 className="text-xs font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors mt-0.5 line-clamp-2">
                      <Link href={`/${locale}/news/${item.slug}`}>
                        {item[`title_${locale as Locale}`] || item.title_en}
                      </Link>
                    </h3>
                    <time className="text-[10px] text-gray-400 block mt-1">
                      {item[`date_${locale as Locale}`] || item.date_en}
                    </time>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
