import React from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

interface NewsSectionProps {
  locale: Locale
  news?: any[]
}

export function NewsSection({ locale, news }: NewsSectionProps) {
  const contentDict = {
    en: {
      tag: 'Official Communication',
      title: 'Latest News & Announcements',
      desc: 'Stay informed with verified updates from Angolela Tera Woreda, cabinet decisions, and community developments.',
      viewAll: 'View All News & Notices',
      items: [
        {
          id: 'news-1',
          title: 'Woreda Council Approves Annual Development & Infrastructure Budget',
          category: 'Council Resolution',
          date: 'September 24, 2026',
          summary: 'The Angolela Tera Woreda Council convened for its ordinary session, passing the comprehensive capital expenditure budget prioritizing rural water expansion and primary road maintenance.',
          href: `/${locale}/news/budget-2026`,
          featured: true,
        },
        {
          id: 'news-2',
          title: 'Distribution of Highland Wheat Seeds and Inputs Commences Across 19 Kebeles',
          category: 'Agriculture',
          date: 'September 18, 2026',
          summary: 'The Office of Agriculture and Rural Development has distributed over 12,000 quintals of certified rust-resistant wheat seed to smallholder farming cooperatives.',
          href: `/${locale}/news/wheat-distribution`,
          featured: false,
        },
        {
          id: 'news-3',
          title: 'Public Notice: Expression of Interest for Chacha Agro-Processing Park Plots',
          category: 'Investment Notice',
          date: 'September 12, 2026',
          summary: 'Private investors and agricultural cooperatives are invited to submit investment project proposals for pre-zoned industrial plots along the Chacha highway.',
          href: `/${locale}/news/agro-park-tender`,
          featured: false,
        },
      ],
    },
    am: {
      tag: 'ይፋዊ መረጃና ኮሙኒኬሽን',
      title: 'ወቅታዊ ዜናዎችና ይፋዊ ማስታወቂያዎች',
      desc: 'የአንጎሌላ ተራ ወረዳ ካቢኔ ውሳኔዎችን፣ የልማት ዜናዎችንና ይፋዊ ማስታወቂያዎችን ይከታተሉ።',
      viewAll: 'ሁሉንም ዜናዎችና ማስታወቂያዎች ይመልከቱ',
      items: [
        {
          id: 'news-1',
          title: 'የወረዳው ምክር ቤት የ2019 በጀት ዓመት የልማትና የመሰረተ ልማት በጀትን አጸደቀ',
          category: 'የምክር ቤት ውሳኔ',
          date: 'መስከረም 14/2019',
          summary: 'የአንጎሌላ ተራ ወረዳ ምክር ቤት መደበኛ ጉባዔውን በማካሄድ ለንጹህ መጠጥ ውሃና ለገጠር መንገዶች ቅድሚያ የሚሰጠውን የካፒታል በጀት በሙሉ ድምጽ አጽድቋል።',
          href: `/${locale}/news/budget-2026`,
          featured: true,
        },
        {
          id: 'news-2',
          title: 'በ19ኙም የገጠር ቀበሌዎች የደጋ ስንዴ ምርጥ ዘርና ማዳበሪያ ስርጭት ተጀመረ',
          category: 'ግብርና ልማት',
          date: 'መስከረም 8/2019',
          summary: 'የወረዳው ግብርናና ገጠር ልማት ጽ/ቤት ከ12 ሺህ ኩንታል በላይ አሲድና በሽታን የሚቋቋም ምርጥ የስንዴ ዘር ለአርሶ አደሮች በማሰራጨት ላይ ይገኛል።',
          href: `/${locale}/news/wheat-distribution`,
          featured: false,
        },
        {
          id: 'news-3',
          title: 'የጨረታ ማስታወቂያ፡ በጫቻ ከተማ ለአግሮ-ፕሮሰሲንግ ኢንቨስትመንት የተዘጋጁ ቦታዎች',
          category: 'ኢንቨስትመንት',
          date: 'መስከረም 2/2019',
          summary: 'በጫቻ አውራ ጎዳና ዳርቻ ለተዘጋጁ የኢንዱስትሪና የአግሮ-ፕሮሰሲንግ ኢንቨስትመንት ቦታዎች ፍላጎት ያላቸው አልሚዎች የፕሮጀክት ሀሳብ እንዲያቀርቡ ጥሪ ቀርቧል።',
          href: `/${locale}/news/agro-park-tender`,
          featured: false,
        },
      ],
    },
    om: {
      tag: 'Odeeffannoo fi Kominikeeshinii Mootummaa',
      title: 'Oduuwwan Yeroo fi Beeksisoota Mootummaa',
      desc: 'Murteewwan kabineettii Aanaa Angoolaalaa Xaraa, oduuwwan misoomaa fi beeksisoota uummataa hordofaa.',
      viewAll: 'Oduuwwan fi Beeksisoota Hunda Ilaalaa',
      items: [
        {
          id: 'news-1',
          title: 'Manni Maree Aanaa Baajata Misoomaa fi Bu\'uuraalee Misoomaa Bara 2019 Raggaasise',
          category: 'Murtee Mana Maree',
          date: 'Fulbaana 14/2019',
          summary: 'Manni Maree Aanaa Angoolaalaa Xaraa yaa\'ii idilee geggeessuun baajata bishaan dhugaatii fi daandii baadiyyaatiif dursa kennu raggaasiseera.',
          href: `/${locale}/news/budget-2026`,
          featured: true,
        },
        {
          id: 'news-2',
          title: 'Gandoolee Baadiyyaa 19 Keessatti Sanyii Qamadii Baddaa fi Xaa\'oo Raabsuun Eegalame',
          category: 'Misooma Qonnaa',
          date: 'Fulbaana 8/2019',
          summary: 'Waajjirri Qonnaa fi Misooma Baadiyyaa Aanaa sanyii qamadii filatamaa kuntaala 12,000 ol qonnaan bultootaaf raabsaa jira.',
          href: `/${locale}/news/wheat-distribution`,
          featured: false,
        },
        {
          id: 'news-3',
          title: 'Beeksisa Caalbaasii: Magaalaa Caacaatti Iddoowwan Invastimantii Agroo-Piroosesiingiif Qophaa\'an',
          category: 'Invastimantii',
          date: 'Fulbaana 2/2019',
          summary: 'Iddoowwan indastirii fi agroo-piroosesiingii daandii guddaa Caacaa cinaatti qophaa\'aniif abbootiin qabeenyaa yaada pirojektii akka dhiyeessan waamichi dhiyaateera.',
          href: `/${locale}/news/agro-park-tender`,
          featured: false,
        },
      ],
    },
  }
  const content = (contentDict as any)[locale] || contentDict.en

  // Dynamic news mapped from CMS/Database with fallback to content.items
  const displayedNews =
    news && news.length > 0
      ? news
          .filter((n: any) => n.status === 'PUBLISHED' || !n.status)
          .slice(0, 3)
          .map((n: any) => ({
            id: n.id || n.slug,
            title: n[`title_${locale}`] || n.title_en || n.title,
            category: n[`category_${locale}`] || n.category_en || n.category || 'Official Press',
            date: n[`date_${locale}`] || n.date_en || (n.publishedAt ? new Date(n.publishedAt).toLocaleDateString() : 'Recent'),
            summary: n[`summary_${locale}`] || n.summary_en || n.summary || n[`excerpt_${locale}`] || '',
            href: `/${locale}/news/${n.slug}`,
            featured: Boolean(n.isFeatured),
            imageUrl: n.imageUrl || n.coverImage || null,
          }))
      : content.items

  return (
    <section className="py-16 bg-[#f0f4f8] border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="max-w-2xl">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-100/70 border border-blue-200 px-3 py-1 rounded-full">
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
            href={`/${locale}/news`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a4f8b] hover:text-[#133a6b] hover:underline shrink-0"
          >
            <span>{content.viewAll}</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {displayedNews.map((news: any) => (
            <article
              key={news.id}
              className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                {news.imageUrl && (
                  <div className="h-44 w-full overflow-hidden bg-gray-100 relative">
                    <img
                      src={news.imageUrl}
                      alt={news.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-semibold text-[#1a4f8b] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full">
                      {news.category}
                    </span>
                    <time className="text-[11px] text-gray-400 font-medium">
                      {news.date}
                    </time>
                  </div>

                  <h3 className="text-base font-bold text-[#0d2340] group-hover:text-[#1a4f8b] transition-colors leading-snug">
                    <Link href={news.href}>
                      {news.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-gray-600 mt-3 leading-relaxed line-clamp-3">
                    {news.summary}
                  </p>
                </div>
              </div>

              <div className="px-6 py-3.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                  Press Release
                </span>
                <Link
                  href={news.href}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#1a4f8b] group-hover:text-[#c8931a] transition-colors"
                >
                  <span>Full Article</span>
                  <span>›</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
