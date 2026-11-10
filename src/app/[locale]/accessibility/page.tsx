import React from 'react'
import type { Metadata } from 'next'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'am' }]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAmharic = locale === 'am'
  return {
    title: isAmharic ? 'የድረ-ገጽ ተደራሽነት መግለጫ (Accessibility) | የአንጎለላ ጠራ ወረዳ' : 'Web Accessibility Statement (WCAG 2.2 AA) | Angolela Tera Woreda',
    description: isAmharic
      ? 'የአንጎለላ ጠራ ወረዳ ዲጂታል ፖርታል ለሁሉም ዜጎች ተደራሽ እንዲሆን የተደረገበት የደረጃ መግለጫ።'
      : 'Institutional accessibility statement for Angolela Tera Woreda portal in accordance with W3C WCAG 2.2 Level AA standards.',
  }
}

export default async function AccessibilityPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = (await params) as { locale: Locale }
  const isAmharic = locale === 'am'

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xs border border-gray-200 overflow-hidden">
        {/* Header Banner */}
        <div className="bg-[#0d2340] text-white px-8 py-10 border-b-4 border-[#c8931a]">
          <div className="flex items-center gap-2 text-xs text-[#fed100] mb-2 uppercase tracking-widest font-semibold">
            <Link href={`/${locale}`} className="hover:underline">
              {isAmharic ? 'ዋና ገጽ' : 'Home'}
            </Link>
            <span>›</span>
            <span>{isAmharic ? 'ተደራሽነት' : 'Accessibility'}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isAmharic ? 'የዲጂታል አገልግሎት ተደራሽነት መግለጫ' : 'Official Digital Web Accessibility Statement'}
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            {isAmharic
              ? 'ደረጃ፡ W3C WCAG 2.2 Level AA | የአንጎለላ ጠራ ወረዳ አስተዳደር'
              : 'Target Benchmark: W3C WCAG 2.2 Level AA • Angolela Tera Woreda Administration'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 space-y-8 text-gray-700 text-sm leading-relaxed">
          {/* Institutional Commitment */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '1. የወረዳው አስተዳደር ቁርጠኝነት' : '1. Institutional Accessibility Commitment'}
            </h2>
            <p>
              {isAmharic
                ? 'የአንጎለላ ጠራ ወረዳ አስተዳደር የመንግስት መረጃዎችና ዲጂታል አገልግሎቶች የአካል ጉዳት ያለባቸውን ጨምሮ ለሁሉም ዜጎች ያለ አድልዎ ተደራሽ እንዲሆኑ ጥረት ያደርጋል። ይህ ይፋዊ ፖርታል በዓለም አቀፉ የድረ-ገጽ ተደራሽነት መመሪያ (W3C Web Content Accessibility Guidelines - WCAG 2.2 Level AA) መመዘኛዎች መሰረት የተገነባ ነው።'
                : 'Angolela Tera Woreda Administration believes that government public information and digital services must be accessible to all citizens, including individuals with visual, auditory, motor, or cognitive disabilities. This portal is engineered to conform with the Web Content Accessibility Guidelines (WCAG 2.2) Level AA benchmark.'}
            </p>
          </section>

          {/* Section 2: Features implemented */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '2. በፖርታሉ ላይ የተካተቱ የተደራሽነት ገጽታዎች' : '2. Key Accessibility Features Implemented'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                  <span className="text-emerald-600">⌨️</span> {isAmharic ? 'የኪቦርድ አሰሳ (Keyboard Navigation)' : 'Keyboard Navigation'}
                </h3>
                <p className="text-xs text-gray-600">
                  {isAmharic
                    ? 'ሁሉም ቁልፎች፣ ቅጾችና አገናኞች በ Tab እና Enter ቁልፎች ሙሉ በሙሉ የሚሰሩ ሲሆን የትኩረት ማሳያ (Visible Focus Indicator) ተካቷል።'
                    : 'All interactive elements, forms, and navigation menus are fully accessible using Tab, Shift+Tab, and Enter keys with clear visible focus rings.'}
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                  <span className="text-emerald-600">🔊</span> {isAmharic ? 'ስክሪን ሪደር ድጋፍ (Screen Readers)' : 'Screen Reader Compatibility'}
                </h3>
                <p className="text-xs text-gray-600">
                  {isAmharic
                    ? 'የገጹ አወቃቀር በትርጉማዊ HTML5 (Semantic HTML) እና ARIA መለያዎች የተዘጋጀ በመሆኑ NVDA፣ JAWS እና TalkBack ን በሚገባ ይደግፋል።'
                    : 'Structured with semantic HTML5 elements (nav, main, header, footer) and ARIA attributes for seamless synthesis by NVDA, JAWS, and VoiceOver.'}
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                  <span className="text-emerald-600">👁️</span> {isAmharic ? 'የቀለም ንፅፅርና ቅርጸ-ቁምፊ' : 'Color Contrast & Typography'}
                </h3>
                <p className="text-xs text-gray-600">
                  {isAmharic
                    ? 'የጽሁፍና የጀርባ የቀለም ንፅፅር ጥምርታ ቢያንስ 4.5:1 የጠበቀ ሲሆን የአማርኛና የእንግሊዝኛ ፊደላት በግልጽ እንዲነበቡ ተደርገዋል።'
                    : 'All text meets or exceeds the minimum 4.5:1 contrast ratio against backgrounds. Clear, scalable typography supports browser magnification up to 200%.'}
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 bg-gray-50/50">
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-1.5">
                  <span className="text-emerald-600">🖼️</span> {isAmharic ? 'የምስል ገላጭ ጽሑፍ (Alt Text)' : 'Image Text Alternatives'}
                </h3>
                <p className="text-xs text-gray-600">
                  {isAmharic
                    ? 'በፖርታሉ ላይ የሚጫኑ ይፋዊ ፎቶዎች፣ ሎጎዎችና ቻርቶች ትርጉም ሰጪ ገላጭ ጽሁፍ (Alt Text) አላቸው።'
                    : 'Meaningful images, leadership portraits, and maps include descriptive alternative text (alt attributes) so non-sighted visitors receive context.'}
                </p>
              </div>
            </div>
          </section>

          {/* Section 3: Forms and documents */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '3. የአገልግሎት ቅጾችና ሰነዶች ተደራሽነት' : '3. Accessible Service Forms and Documents'}
            </h2>
            <p>
              {isAmharic
                ? 'በድረ-ገጻችን ላይ የሚቀርቡ የዜጎች መጠየቂያ ቅጾች ግልጽ መመሪያዎች፣ የማብራሪያ መለያዎች (Labels) እና የስህተት ማሳወቂያዎች (Accessible Form Validation) ተካተውባቸዋል። የሚወርዱ ሰነዶችም ተደራሽ በሆነ ቅርጸት እንዲዘጋጁ ጥረት ይደረጋል።'
                : 'All digital citizen submission forms feature explicit label association, clear input instructions, and accessible error notifications. Downloadable resources are provided in standardized formats to aid assistive technologies.'}
            </p>
          </section>

          {/* Section 4: Reporting issues */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '4. የተደራሽነት ችግሮችን ሪፖርት ማድረጊያ' : '4. How to Report Accessibility Barriers'}
            </h2>
            <p>
              {isAmharic
                ? 'በድረ-ገጻችን አሰሳ ወቅት ማንኛውም የተደራሽነት እክል ካጋጠመዎት ወይም መረጃ በሌላ አማራጭ ቅርጸት እንዲቀርብልዎት ከፈለጉ፣ እባክዎን የወረዳውን የአይሲቲ እና ኮሙዩኒኬሽን ቡድን ያግኙ፡'
                : 'If you encounter any difficulty navigating or accessing content on this portal, or require government notices in an alternative format, please notify the Woreda ICT and Communications Team directly:'}
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-1.5">
              <p><strong>{isAmharic ? 'የስራ ክፍል፡' : 'Unit:'}</strong> {isAmharic ? 'የአንጎለላ ጠራ ወረዳ አይሲቲና ድህረ-ገጽ አስተዳደር ክፍል' : 'Angolela Tera ICT & Digital Portal Management Desk'}</p>
              <p><strong>{isAmharic ? 'የተደራሽነት ኢሜይል፡' : 'Accessibility Email:'}</strong> <a href="mailto:angolelatera1@gmail.com" className="text-blue-700 underline font-semibold">angolelatera1@gmail.com</a></p>
              <p><strong>{isAmharic ? 'ቀጥታ ስልክ፡' : 'Direct Helpline:'}</strong> +251 (0) 58 661 0100</p>
              <p><strong>{isAmharic ? 'የአድራሻ ዝርዝር፡' : 'Office Address:'}</strong> {isAmharic ? 'ጫጫ ከተማ፣ ወረዳ አስተዳደር ቅጥር ግቢ፣ ህንፃ 2፣ ቢሮ ቁጥር 14' : 'Administrative Compound, Building 2, Office 14, Chacha Town, Ethiopia'}</p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex items-center justify-between text-xs text-gray-500">
          <Link href={`/${locale}`} className="text-[#1a4f8b] font-bold hover:underline">
            ← {isAmharic ? 'ወደ ዋና ገጽ ተመለስ' : 'Return to Portal Homepage'}
          </Link>
          <Link href={`/${locale}/privacy`} className="text-gray-600 hover:text-gray-900">
            {isAmharic ? 'የግላዊነት ፖሊሲ ›' : 'Privacy Policy ›'}
          </Link>
        </div>
      </div>
    </div>
  )
}
