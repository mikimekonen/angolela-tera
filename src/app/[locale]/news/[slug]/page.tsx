import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { getNews } from '@/lib/dataStore'
import { NEWS_ARTICLES } from '@/data/mockData'

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = []
  const newsList = getNews()
  for (const locale of locales) {
    for (const news of newsList) {
      params.push({ locale, slug: news.slug })
    }
  }
  return params
}

function getEmbedVideoUrl(url: string): string | null {
  if (!url) return null
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/)
  if (ytMatch) return `https://www.youtube-nocookie.com/embed/${ytMatch[1]}`
  const vmMatch = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)/)
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`
  return null
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const allNews = getNews()
  const article: any = allNews.find((n: any) => n.slug === slug) || NEWS_ARTICLES.find((n: any) => n.slug === slug)
  if (!article) notFound()

  const related = allNews.filter((n: any) => n.slug !== slug).slice(0, 3)

  const title = article[`title_${locale as Locale}`] || article.title_en
  const category = article[`category_${locale as Locale}`] || article.category_en
  const date = article[`date_${locale as Locale}`] || article.date_en || 'Recent'
  const author = article[`author_${locale as Locale}`] || article.author_en || 'Woreda Communication Directorate'
  const rawContent = article[`content_${locale as Locale}`] || article.content_en || []
  const contentParagraphs = Array.isArray(rawContent) ? rawContent : [rawContent]

  const coverImage = article.imageUrl || article.coverImage || null
  const coverCaption = article[`imageCaption_${locale as Locale}`] || article.imageCaption_en || null
  const videoUrl = article.videoUrl || null
  const videoEmbedUrl = videoUrl ? getEmbedVideoUrl(videoUrl) : null
  const gallery = Array.isArray(article.gallery) ? article.gallery : []
  const documentUrl = article.documentUrl || null
  const documentTitle = article.documentTitle || null
  const refNumber = article.referenceNumber || null

  const contentDict = {
    en: {
      breadcrumbHome: 'Home',
      breadcrumbNews: 'News & Announcements',
      authorPrefix: 'Issued by',
      relatedTitle: 'Recent Official Announcements',
      backToNews: 'Back to All News',
      shareLabel: 'Share Statement',
      officialVerification: 'Official Government Record',
      videoLabel: 'Official Video Communiqué',
      galleryLabel: 'Inspection & Event Photo Gallery',
      docDownloadLabel: 'Download Official Signed Communiqué',
      docSubLabel: 'Verified Government PDF Document',
      downloadBtn: 'Download Document',
    },
    am: {
      breadcrumbHome: 'ዋና ገጽ',
      breadcrumbNews: 'ዜናና ማስታወቂያዎች',
      authorPrefix: 'አውጪው ጽ/ቤት',
      relatedTitle: 'ተዛማጅ ይፋዊ ማስታወቂያዎች',
      backToNews: 'ወደ ሁሉም ዜናዎች ተመለስ',
      shareLabel: 'መግለጫውን አጋራ',
      officialVerification: 'ይፋዊ የመንግሥት ሰነድ ማረጋገጫ',
      videoLabel: 'ይፋዊ የቪዲዮ መግለጫ',
      galleryLabel: 'የክንውንና የመስክ ምልከታ ፎቶዎች',
      docDownloadLabel: 'ይፋዊ የተፈረመ መግለጫ አውርድ',
      docSubLabel: 'የተረጋገጠ ይፋዊ የፒዲኤፍ ሰነድ',
      downloadBtn: 'ሰነዱን አውርድ',
    },
    om: {
      breadcrumbHome: 'Fuula Duraa',
      breadcrumbNews: 'Oduu fi Beeksisoota',
      authorPrefix: 'Waajjira Baase',
      relatedTitle: 'Beeksisoota Mootummaa Dhihoo',
      backToNews: 'Gara Oduu Hundaatti Deebi\'aa',
      shareLabel: 'Ibsa Qoodaa',
      officialVerification: 'Galmee Mootummaa Mirkanaa\'aa',
      videoLabel: 'Ibsa Viidiyoo Mootummaa',
      galleryLabel: 'Suuraalee Daawwannaafi Sagantaa',
      docDownloadLabel: 'Ibsa Mallatteeffame Buufadhaa',
      docSubLabel: 'Waraqaa Ragaa PDF Mirkanaa\'aa',
      downloadBtn: 'Waraqaa Buufadhaa',
    },
  }
  const content = (contentDict as any)[locale] || contentDict.en

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
          <article className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6">
            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#1a4f8b] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                  {category}
                </span>
                {refNumber && (
                  <span className="text-xs font-mono font-bold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-md border border-gray-200">
                    {refNumber}
                  </span>
                )}
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
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0d2340] tracking-tight leading-tight">
              {title}
            </h1>

            {/* Featured Cover Image */}
            {coverImage && (
              <figure className="space-y-2">
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-xs bg-gray-100 max-h-[460px]">
                  <img
                    src={coverImage}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {coverCaption && (
                  <figcaption className="text-xs text-gray-500 italic text-center px-4">
                    {coverCaption}
                  </figcaption>
                )}
              </figure>
            )}

            {/* Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-gray-700 leading-relaxed pt-2">
              {contentParagraphs.map((para: string, idx: number) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            {/* Video Broadcast Section */}
            {videoUrl && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🎥</span>
                  <h3 className="text-sm font-bold text-[#0d2340]">{content.videoLabel}</h3>
                </div>

                {videoEmbedUrl ? (
                  <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-black">
                    <iframe
                      src={videoEmbedUrl}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  </div>
                ) : (
                  <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-black">
                    <video
                      src={videoUrl}
                      controls
                      playsInline
                      className="w-full max-h-[420px] mx-auto"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Event Photo Gallery */}
            {gallery.length > 0 && (
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">📸</span>
                  <h3 className="text-sm font-bold text-[#0d2340]">{content.galleryLabel}</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {gallery.map((img: any, idx: number) => (
                    <figure key={idx} className="space-y-1">
                      <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-32 sm:h-36">
                        <img
                          src={img.url}
                          alt={img.caption_en || `Photo ${idx + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {img.caption_en && (
                        <figcaption className="text-[10px] text-gray-500 truncate px-1">
                          {img[`caption_${locale as Locale}`] || img.caption_en}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              </div>
            )}

            {/* Downloadable Official Signed Document Card */}
            {documentUrl && (
              <div className="pt-4 border-t border-gray-100">
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-xl bg-white border border-blue-200 flex items-center justify-center text-2xl shadow-xs shrink-0">
                      📄
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-[#0d2340]">
                        {documentTitle || content.docDownloadLabel}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {content.docSubLabel} {refNumber ? `• Dispatch: ${refNumber}` : ''}
                      </p>
                    </div>
                  </div>
                  <a
                    href={documentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>⬇️</span>
                    <span>{content.downloadBtn}</span>
                  </a>
                </div>
              </div>
            )}

            {/* Official Footer Verification */}
            <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <span>🏛️</span>
                <span>{content.officialVerification}: {refNumber || `AGT-PR-${slug.toUpperCase().slice(0, 8)}`}</span>
              </span>
              <Link
                href={`/${locale}/news`}
                className="text-xs font-bold text-[#1a4f8b] hover:text-[#c8931a] transition-colors"
              >
                ← {content.backToNews}
              </Link>
            </div>
          </article>

          {/* Related Articles Sidebar (4 cols) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs">
              <h2 className="text-base font-bold text-[#0d2340] border-b border-gray-100 pb-3 mb-4">
                {content.relatedTitle}
              </h2>

              <div className="space-y-4">
                {related.map((item: any) => (
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
                      {item[`date_${locale as Locale}`] || item.date_en || 'Recent'}
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
