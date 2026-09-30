import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import DownloadButton from '@/components/resources/DownloadButton'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const content = {
    en: {
      tag: 'Public Documents & Legal Repository',
      title: 'Resources, Forms & Legal Directives',
      subtitle: 'Official archive of printable application forms, local council proclamations, annual financial audit summaries, and operational guidelines for citizens and businesses.',
      downloadBtn: 'Download Document',
      documents: [
        {
          title: 'Citizen Vital Events Application Form (Birth, Marriage, Death)',
          category: 'Application Forms',
          size: '420 KB',
          format: 'PDF',
          office: 'Vital Events Registration Desk',
          desc: 'Official bilingual template required to initiate civil status registration and credential verification.',
        },
        {
          title: 'Rural Land Holding Transfer & Inheritance Declaration Form',
          category: 'Application Forms',
          size: '560 KB',
          format: 'PDF',
          office: 'Land Administration & Use Bureau',
          desc: 'Mandatory standard documentation for parcel division, family inheritance transfer, and boundary verification.',
        },
        {
          title: 'Angolela Tera Woreda Annual Development Plan & Budget (2025/2026)',
          category: 'Annual Reports',
          size: '1.8 MB',
          format: 'PDF',
          office: 'Finance & Economic Development Office',
          desc: 'Approved fiscal budget breakdown detailing capital allocations, kebele expenditure frameworks, and revenue projections.',
        },
        {
          title: 'Directive on Commercial Business Licensing & Market Regulation',
          category: 'Legal Directives',
          size: '780 KB',
          format: 'PDF',
          office: 'Trade & Investment Office',
          desc: 'Statutory regulatory provisions governing trade competence, commercial premises standards, and consumer protection.',
        },
        {
          title: 'Agricultural Input Subsidy & Farmer Cooperative Guidelines',
          category: 'Operational Guidelines',
          size: '640 KB',
          format: 'PDF',
          office: 'Agriculture & Rural Development Office',
          desc: 'Operational framework for highland seed allocation, cooperative voucher redemption, and fertilizer storage safety.',
        },
        {
          title: 'Chacha Agro-Industrial Corridor Land Bank Lease Terms & Conditions',
          category: 'Investment Guides',
          size: '1.2 MB',
          format: 'PDF',
          office: 'Trade & Investment Office',
          desc: 'Comprehensive investor guidebook specifying parcel zoning maps, tariff structures, and one-stop desk requirements.',
        },
      ],
    },
    am: {
      tag: 'ይፋዊ ሰነዶችና የህግ ማዕቀፍ',
      title: 'ሰነዶች፣ ቅጾችና መመሪያዎች',
      subtitle: 'የአንጎሌላ ተራ ወረዳ የአገልግሎት ማመልከቻ ቅጾች፣ ህጎችና ደንቦች፣ አመታዊ የኦዲት ሪፖርቶችና የኢንቨስትመንት መመሪያዎች ማውጫ።',
      downloadBtn: 'ሰነዱን ያውርዱ',
      documents: [
        {
          title: 'የወሳኝ ኩነት ምዝገባ ማመልከቻ ቅጽ (ልደት፣ ጋብቻ፣ ሞት)',
          category: 'የአገልግሎት ቅጾች',
          size: '420 KB',
          format: 'PDF',
          office: 'የወሳኝ ኩነት ምዝገባ ጽ/ቤት',
          desc: 'የልደት፣ ጋብቻ ወይም የሞት ምስክር ወረቀት ለማውጣት የሚሞላ ይፋዊ ባለሁለት ቋንቋ ቅጽ።',
        },
        {
          title: 'የገጠር መሬት ይዞታ ዝውውርና የውርስ ማረጋገጫ ማመልከቻ',
          category: 'የአገልግሎት ቅጾች',
          size: '560 KB',
          format: 'PDF',
          office: 'የመሬት አስተዳደርና አጠቃቀም ጽ/ቤት',
          desc: 'የይዞታ ክፍፍል፣ የቤተሰብ ውርስ እና የወሰን ማካለል ስራን ለማስፈጸም የሚቀርብ ህጋዊ ቅጽ።',
        },
        {
          title: 'የአንጎሌላ ተራ ወረዳ የ2018/2019 ዓመታዊ የልማትና በጀት እቅድ',
          category: 'ዓመታዊ ሪፖርቶች',
          size: '1.8 MB',
          format: 'PDF',
          office: 'የፋይናንስና ኢኮኖሚ ልማት ጽ/ቤት',
          desc: 'የምክር ቤቱ የጸደቀ የበጀት ድልድል፣ የቀበሌዎች የልማት ካፒታልና የገቢ ግምገማ ሰነድ።',
        },
        {
          title: 'የንግድ ፈቃድና ገበያ ቁጥጥር አሰራር መመሪያ',
          category: 'ደንቦችና መመሪያዎች',
          size: '780 KB',
          format: 'PDF',
          office: 'የንግድና ኢንቨስትመንት ጽ/ቤት',
          desc: 'የንግድ ብቃት ማረጋገጫ፣ የንግድ ቦታ መስፈርቶችና የሸማቾች ጥበቃ ህጋዊ ደንብ።',
        },
        {
          title: 'የግብርና ግብአት ድጋፍና የህብረት ስራ ማህበራት አሰራር',
          category: 'የአሰራር መመሪያዎች',
          size: '640 KB',
          format: 'PDF',
          office: 'የግብርናና ገጠር ልማት ጽ/ቤት',
          desc: 'የምርጥ ዘርና ማዳበሪያ ስርጭት፣ የቫውቸር አጠቃቀምና የማከማቻ ደህንነት መመሪያ።',
        },
        {
          title: 'የጫቻ አግሮ-ኢንዱስትሪ ኮሪደር የመሬት ባንክና የሊዝ ሁኔታዎች',
          category: 'የኢንቨስትመንት መመሪያ',
          size: '1.2 MB',
          format: 'PDF',
          office: 'የንግድና ኢንቨስትመንት ጽ/ቤት',
          desc: 'የኢንዱስትሪ ቦታዎች ካርታ፣ የሊዝ ዋጋና የአንድ መስኮት አገልግሎት ቅድመ ሁኔታዎች።',
        },
      ],
    },
    om: {
      tag: 'Sanadoota Mootummaa',
      title: 'Qabeenya, Foormiiwwan fi Qajeelfamoota',
      subtitle: 'Foormiiwwan tajaajilaa, qajeelfamoota seeraa fi gabaasaalee aanaa keenyaa.',
      downloadBtn: 'Sanada Buufadhaa',
      documents: [
        {
          title: 'Foormii Galmee Murtii (Dhaloota, Gaa\'ela, Du\'a)',
          category: 'Foormiiwwan Tajaajilaa',
          size: '420 KB',
          format: 'PDF',
          office: 'Kutaa Galmee Murtii',
          desc: 'Waraqaa ragaa dhalootaa fi gaa\'elaa argachuuf kan guutamu.',
        },
        {
          title: 'Waliigaltee Daddabarsa Qabiyyee Lafaa fi Dhaalaa',
          category: 'Foormiiwwan Tajaajilaa',
          size: '560 KB',
          format: 'PDF',
          office: 'Waajjira Bulchiinsa Lafaa',
          desc: 'Dhaala fi daddabarsa lafa baadiyyaatiif kan oolu.',
        },
        {
          title: 'Karoora Misoomaa fi Baajata Aanaa (2025/2026)',
          category: 'Gabaasa Waggaa',
          size: '1.8 MB',
          format: 'PDF',
          office: 'Waajjira Faayinaansii',
          desc: 'Baajata aanaa ragga\'ee fi gabaasa herregaa.',
        },
        {
          title: 'Qajeelfama Eeyyama Daldalaa fi To\'annoo Gabaa',
          category: 'Qajeelfamoota Seeraa',
          size: '780 KB',
          format: 'PDF',
          office: 'Waajjira Daldalaa fi Invastimantii',
          desc: 'Ulaagaalee eeyyama daldalaa fi mirga fayyadamtootaa eegsisuuf bahe.',
        },
        {
          title: 'Qajeelfama Deeggarsa Qonnaa fi Waldaalee Hojii Gamtaa',
          category: 'Qajeelfama Hojii',
          size: '640 KB',
          format: 'PDF',
          office: 'Waajjira Qonnaa fi Misooma Baadiyyaa',
          desc: 'Raabsa xaa\'oo, sanyii filatamaa fi nagaummaa kuusaa.',
        },
        {
          title: 'Haala Liizii fi Baankii Lafaa Kooridara Agiroo-Indaastirii Caaccetti',
          category: 'Qajeelfama Invastimantii',
          size: '1.2 MB',
          format: 'PDF',
          office: 'Waajjira Daldalaa fi Invastimantii',
          desc: 'Kaartaa lafa indaastirii fi gatii liizii qophaa\'e.',
        },
      ],
    },
  }[locale as Locale]

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

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {content.documents.map((doc, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-200 rounded-xl p-6 shadow-xs hover:border-[#1a4f8b] hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-semibold text-[#1a4f8b] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    {doc.category}
                  </span>
                  <span className="text-[11px] font-mono text-gray-500 font-semibold bg-gray-100 px-2 py-0.5 rounded">
                    {doc.format} • {doc.size}
                  </span>
                </div>

                <h2 className="text-base font-bold text-[#0d2340] leading-snug">
                  {doc.title}
                </h2>

                <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                  {doc.desc}
                </p>

                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 font-medium">
                  🏛️ {doc.office}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <DownloadButton title={doc.title} label={content.downloadBtn} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
