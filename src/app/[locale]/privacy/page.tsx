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
    title: isAmharic ? 'የግላዊነት ፖሊሲ | የአንጎለላ ጠራ ወረዳ' : 'Privacy Policy | Angolela Tera Woreda Administration',
    description: isAmharic
      ? 'የአንጎለላ ጠራ ወረዳ አስተዳደር የዜጎች የግል መረጃ አያያዝና ጥበቃ ፖሊሲ።'
      : 'Official citizen data protection and privacy policy for Angolela Tera Woreda Administration digital portal.',
  }
}

export default async function PrivacyPolicyPage({
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
            <span>{isAmharic ? 'ፖሊሲና መመሪያዎች' : 'Institutional Policies'}</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            {isAmharic ? 'የግላዊነት እና የመረጃ ጥበቃ ፖሊሲ' : 'Official Portal Privacy & Data Protection Policy'}
          </h1>
          <p className="mt-2 text-sm text-gray-300">
            {isAmharic
              ? 'የመጨረሻ ማሻሻያ የተደረገበት ቀን፡ ጥቅምት 2017 ዓ.ም | የአንጎለላ ጠራ ወረዳ አስተዳደር'
              : 'Last Updated: November 2026 • Official Gazetted Policy • Angolela Tera Woreda'}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-8 sm:p-12 space-y-8 text-gray-700 text-sm leading-relaxed">
          {/* Institutional Advisory */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-md text-xs text-amber-900">
            <p className="font-bold">
              {isAmharic ? 'አስተዳደራዊ ማስታወቂያ፡' : 'Institutional Notice:'}
            </p>
            <p className="mt-1">
              {isAmharic
                ? 'ይህ የግላዊነት ፖሊሲ በኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ የኤሌክትሮኒክስ መንግሥት መመሪያዎች እና በአማራ ብሔራዊ ክልላዊ መንግሥት ህጋዊ ማዕቀፎች መሰረት የተዘጋጀ ሲሆን፣ የወረዳው ፍትህ ጽ/ቤት በየጊዜው ይገመግመዋል።'
                : 'This Privacy Policy is established in accordance with Federal E-Government standards of Ethiopia and the regional directives of Amhara National Regional State. It is subject to continuous review by the Woreda Justice Office.'}
            </p>
          </div>

          {/* Section 1: Overview */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '1. መግቢያና አጠቃላይ ዓላማ' : '1. Overview and Purpose'}
            </h2>
            <p>
              {isAmharic
                ? 'የአንጎለላ ጠራ ወረዳ አስተዳደር የዜጎችን፣ ባለሀብቶችን እና የድረ-ገጽ ጎብኚዎችን የግል መረጃ ደህንነትና ሚስጥራዊነት የማክበር ሙሉ ኃላፊነት አለበት። ይህ ፖሊሲ በፖርታላችን በኩል የሚሰበሰቡ መረጃዎችን፣ እንዴት ጥቅም ላይ እንደሚውሉ፣ እንዴት እንደሚጠበቁ እና የዜጎችን መብቶች በዝርዝር ያብራራል።'
                : 'Angolela Tera Woreda Administration is committed to safeguarding the privacy and confidentiality of citizens, investors, and public visitors using this official government portal. This policy outlines what personal information is collected, how it is processed and protected, and the legal rights available to users.'}
            </p>
          </section>

          {/* Section 2: Data Collection */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '2. በድረ-ገጹ በኩል የሚሰበሰቡ መረጃዎች' : '2. Information Collected Through the Portal'}
            </h2>
            <p>
              {isAmharic
                ? 'የሚከተሉት መረጃዎች የሚሰበሰቡት ዜጎች በፈቃደኝነት ቅጾችን ሲሞሉ ብቻ ነው፡'
                : 'The Administration only collects personal data when willingly submitted by citizens through online service forms:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                <strong>{isAmharic ? 'የማንነት መረጃ፡' : 'Identity Information:'}</strong>{' '}
                {isAmharic ? 'ሙሉ ስም፣ አድራሻ (ቀበሌ/መንደር) እና የማንነት መለያ ቁጥሮች።' : 'Full legal name, resident kebele/gott, and official national/kebele ID details.'}
              </li>
              <li>
                <strong>{isAmharic ? 'የመገናኛ አድራሻ፡' : 'Contact Details:'}</strong>{' '}
                {isAmharic ? 'ስልክ ቁጥር እና የኢሜይል አድራሻ (ለምላሽ እና ለመከታተያ መልእክት)።' : 'Mobile telephone number and validated email address for status updates.'}
              </li>
              <li>
                <strong>{isAmharic ? 'የአገልግሎት ጥያቄና አቤቱታ፡' : 'Petition & Application Details:'}</strong>{' '}
                {isAmharic ? 'የመሬት ይዞታ ማመልከቻ፣ የንግድ ፈቃድ ጥያቄ፣ የአቤቱታ ዝርዝር እና አባሪ ሰነዶች።' : 'Land bank applications, commercial inquiries, public petitions, and uploaded official supporting documents.'}
              </li>
              <li>
                <strong>{isAmharic ? 'ቴክኒካዊ መረጃዎች፡' : 'Technical Logs:'}</strong>{' '}
                {isAmharic ? 'የአይፒ አድራሻ (IP address)፣ የአሰሳ ሰዓት እና የደህንነት ኦዲት ሎግ (ለሳይበር ደህንነት ቁጥጥር)።' : 'Internet Protocol (IP) address, access timestamp, and system audit logs strictly used for cyber intrusion prevention.'}
              </li>
            </ul>
          </section>

          {/* Section 3: Use of Information */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '3. መረጃው ጥቅም ላይ የሚውልበት አግባብ' : '3. How Citizen Information is Used'}
            </h2>
            <p>
              {isAmharic
                ? 'የተሰበሰበው መረጃ የሚውለው ለሚከተሉት ህጋዊ መንግስታዊ ተግባራት ብቻ ነው፡'
                : 'All information provided is utilized strictly for lawful administrative and public service functions:'}
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>{isAmharic ? 'የቀረበውን አቤቱታ፣ ጥቆማ ወይም የአገልግሎት ጥያቄ መርምሮ ምላሽ ለመስጠት፤' : 'To investigate, process, and resolve submitted citizen petitions, grievances, or service inquiries.'}</li>
              <li>{isAmharic ? 'የመከታተያ ኮድ (Tracking Code) በመስጠት የጉዳዩን ሂደት ለዜጎች ግልጽ ለማድረግ፤' : 'To issue unique tracking identifiers allowing citizens to trace workflow status online.'}</li>
              <li>{isAmharic ? 'ለኢንቨስትመንት ማመልከቻዎችና ለመሬት ድልድል ፈቃድ ማረጋገጫ፤' : 'To evaluate investment eligibility and land allocation requirements.'}</li>
              <li>{isAmharic ? 'የወረዳውን የመንግስት አገልግሎት አሰጣጥ ጥራትና ግልጽነት ለማሻሻል።' : 'To assess public satisfaction and improve the efficiency of woreda sector bureaus.'}</li>
            </ul>
            <p className="font-semibold text-gray-900">
              {isAmharic
                ? 'የዜጎች መረጃ ለማንኛውም የንግድ ማስታወቂያ ወይም ላልተፈቀደለት ሶስተኛ ወገን በፍጹም አይሰጥም ወይም አይሸጥም።'
                : 'Citizen data is strictly confidential and is never sold, leased, or shared with commercial entities or unauthorized third parties.'}
            </p>
          </section>

          {/* Section 4: Data Protection */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '4. የመረጃ ደህንነትና ሚስጥራዊነት ጥበቃ' : '4. Data Protection and Confidentiality'}
            </h2>
            <p>
              {isAmharic
                ? 'የአንጎለላ ጠራ ወረዳ አስተዳደር የመረጃ ቋት (Database) በዘመናዊ የኢንክሪፕሽን (Encryption) ቴክኖሎጂ የተጠበቀ ነው። የመረጃ ተደራሽነት የተሰጣቸው በስራቸው ለጉዳዩ ኃላፊነት ያላቸው የወረዳው ባለስልጣናት ብቻ ናቸው። ሁሉም አስተዳደራዊ የስርዓት እንቅስቃሴዎች በኦዲት መዝገብ (Audit Log) ክትትል ይደረግባቸዋል።'
                : 'Our database and application servers enforce end-to-end transport layer security (TLS/HTTPS) and role-based access controls (RBAC). Only designated woreda officers bound by civil service confidentiality agreements are authorized to inspect application records. Every query and data access is recorded in cryptographic audit logs.'}
            </p>
          </section>

          {/* Section 5: Data Retention */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '5. የመረጃ ማቆያ ጊዜ (Data Retention)' : '5. Data Retention Periods'}
            </h2>
            <p>
              {isAmharic
                ? 'የዜጎች አቤቱታዎችና የአገልግሎት ጥያቄዎች በወረዳው የሰነዶች አያያዝ መመሪያ መሰረት ለህጋዊ ማጣቀሻ የሚቀመጡ ሲሆን፣ የተጠናቀቁ ተራ የኢንፎርሜሽን ጥያቄዎች በተገቢው ጊዜ ከመዝገብ ይሰረዛሉ።'
                : 'Official citizen petitions and land administration dossiers are archived in compliance with regional public archive guidelines. General contact inquiries and tracking tokens are retained for 24 months before automated lifecycle purge.'}
            </p>
          </section>

          {/* Section 6: Cookies */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '6. ኩኪዎችና የድረ-ገጽ ቴክኖሎጂ (Cookies)' : '6. Cookies and Local Storage'}
            </h2>
            <p>
              {isAmharic
                ? 'ይህ ፖርታል ለተጠቃሚ ምቾት ሲባል የቋንቋ ምርጫን (እንግሊዝኛ ወይም አማርኛ) ለማስታወስ ብቻ አስፈላጊ የሆኑ ቴክኒካዊ ኩኪዎችን ይጠቀማል። ለክትትል ወይም ለንግድ ማስታወቂያ የሚውሉ ኩኪዎች አይጠቀሙም።'
                : 'This portal uses strictly necessary session cookies solely to preserve user interface language preferences (English or Amharic) and secure CSRF tokens. We do not use third-party advertising cookies or cross-site tracking scripts.'}
            </p>
          </section>

          {/* Section 7: Citizen Rights & Contact */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0d2340] border-b pb-2">
              {isAmharic ? '7. የዜጎች መብት እና አቤቱታ ማቅረቢያ' : '7. Citizen Rights and Official Contact'}
            </h2>
            <p>
              {isAmharic
                ? 'ማንኛውም ዜጋ በፖርታሉ ስለተመዘገበው የግል መረጃ ማብራሪያ የመጠየቅ፣ የተሳሳተ መረጃ እንዲታረም ወይም እንዲሰረዝ የማመልከት መብት አለው። ለጥያቄዎችና አቤቱታዎች በሚከተለው አድራሻ ማግኘት ይቻላል፡'
                : 'Citizens retain the right to request disclosure of personal data stored in their name, request rectification of erroneous records, or appeal against administrative actions. For all privacy matters, contact:'}
            </p>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-1.5">
              <p><strong>{isAmharic ? 'ተቋም፡' : 'Institution:'}</strong> {isAmharic ? 'የአንጎለላ ጠራ ወረዳ ዋና አስተዳደር ጽህፈት ቤት' : 'Angolela Tera Woreda Administration'}</p>
              <p><strong>{isAmharic ? 'አድራሻ፡' : 'Location:'}</strong> {isAmharic ? 'ጫጫ ከተማ፣ ሰሜን ሸዋ ዞን፣ አማራ ክልል፣ ኢትዮጵያ' : 'Chacha Town, North Shewa Zone, Amhara Region, Ethiopia'}</p>
              <p><strong>{isAmharic ? 'ይፋዊ ኢሜይል፡' : 'Official Privacy Mailbox:'}</strong> <a href="mailto:angolelatera1@gmail.com" className="text-blue-700 underline font-semibold">angolelatera1@gmail.com</a></p>
              <p><strong>{isAmharic ? 'ዋና ስልክ፡' : 'Switchboard Hotline:'}</strong> +251 (0) 58 661 0100</p>
            </div>
          </section>
        </div>

        {/* Footer Navigation */}
        <div className="bg-gray-50 border-t border-gray-200 px-8 py-4 flex items-center justify-between text-xs text-gray-500">
          <Link href={`/${locale}`} className="text-[#1a4f8b] font-bold hover:underline">
            ← {isAmharic ? 'ወደ ዋና ገጽ ተመለስ' : 'Return to Portal Homepage'}
          </Link>
          <Link href={`/${locale}/accessibility`} className="text-gray-600 hover:text-gray-900">
            {isAmharic ? 'የተደራሽነት መግለጫ ›' : 'Accessibility Statement ›'}
          </Link>
        </div>
      </div>
    </div>
  )
}
