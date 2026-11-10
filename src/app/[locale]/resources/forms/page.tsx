'use client'

import React, { useState, use } from 'react'
import Link from 'next/link'
import type { Locale } from '@/i18n/config'
import DownloadButton from '@/components/resources/DownloadButton'

interface PageProps {
  params: Promise<{ locale: string }>
}

interface ServiceForm {
  id: string
  title_en: string
  title_am: string
  formCode: string
  department_en: string
  department_am: string
  category: 'LAND' | 'TRADE' | 'CIVIL' | 'AGRICULTURE' | 'GRIEVANCE'
  desc_en: string
  desc_am: string
  requirements_en: string[]
  requirements_am: string[]
  processingDays: string
  submissionDesk_en: string
  submissionDesk_am: string
}

export default function FormsPage({ params }: PageProps) {
  const { locale } = use(params) as { locale: Locale }
  const isAmharic = locale === 'am'

  const [search, setSearch] = useState('')
  const [selectedCat, setSelectedCat] = useState('ALL')

  const forms: ServiceForm[] = [
    {
      id: 'form-01',
      title_en: 'Rural Land Holding Registration & Certification Application',
      title_am: 'የገጠር መሬት ይዞታ ምዝገባና የደብተር መጠየቂያ ማመልከቻ',
      formCode: 'ATW-FORM-LND-01',
      department_en: 'Rural Land Administration and Use Office',
      department_am: 'የገጠር መሬት አስተዳደርና አጠቃቀም ጽ/ቤት',
      category: 'LAND',
      desc_en:
        'Official application to obtain or renew primary/secondary rural land holding certificates (green book), register inherited parcels, or record boundary demarcations.',
      desc_am:
        'የገጠር መሬት ይዞታ ማረጋገጫ ደብተር (አረንጓዴ ደብተር) ለማውጣት፣ የወረሱትን መሬት በስም ለማዘዋወር ወይም የወሰን ማረጋገጫ ለማግኘት የሚቀርብ ማመልከቻ።',
      requirements_en: [
        'Valid Kebele Resident Identity Card',
        'Signed adjacent landowner boundary attestation (4 neighboring witnesses)',
        'Kebele Land Administration Committee recommendation letter',
      ],
      requirements_am: [
        'የታደሰ የቀበሌ ነዋሪነት መታወቂያ',
        'የ4 አዋሳኝ የመሬት ባለይዞታዎች ምስክርነት ፊርማ',
        'የቀበሌው የመሬት አስተዳደር ኮሚቴ የድጋፍ ደብዳቤ',
      ],
      processingDays: '7 – 10 Business Days',
      submissionDesk_en: 'Room 04, Land Administration Directorate, Chacha Compound',
      submissionDesk_am: 'ቢሮ 04፣ የመሬት አስተዳደር ዳይሬክቶሬት፣ ጫጫ አስተዳደር ግቢ',
    },
    {
      id: 'form-02',
      title_en: 'Trade License & Commercial Operation Permit Application',
      title_am: 'አዲስ የንግድ ስራ ፈቃድ ማውጫ ማመልከቻ ቅጽ',
      formCode: 'ATW-FORM-TRD-02',
      department_en: 'Trade and Market Development Office',
      department_am: 'የንግድና ገበያ ልማት ጽ/ቤት',
      category: 'TRADE',
      desc_en:
        'Requisition form for new commercial trade licenses, business renewals, principal commercial registry entries, and commercial TIN assignment.',
      desc_am:
        'አዲስ የንግድ ስራ ፈቃድ ለማውጣት፣ የንግድ ምዝገባ ለማካሄድ እና የግብር ከፋይ መለያ ቁጥር (TIN) ለማግኘት የሚሞላ ማመልከቻ።',
      requirements_en: [
        'Authenticated premise lease contract or title deed',
        'Two recent passport-sized photographs',
        'Tax clearance certificate from Woreda Revenues Office (for renewals)',
      ],
      requirements_am: [
        'የተረጋገጠ የቤት/ቦታ ኪራይ ውል ወይም የባለቤትነት ማረጋገጫ',
        'ሁለት የቅርብ ጊዜ የፓስፖርት መጠን ፎቶግራፍ',
        'ከወረዳው ገቢዎች ጽ/ቤት የታክስ ክሊራንስ ሰነድ',
      ],
      processingDays: '2 Business Days',
      submissionDesk_en: 'Trade Licensing Hall, Municipal Services Center, Chacha',
      submissionDesk_am: 'የንግድ ፈቃድ መስኮት፣ የማዘጋጃ ቤት አገልግሎት ማዕከል፣ ጫጫ',
    },
    {
      id: 'form-03',
      title_en: 'Vital Event Registration: Birth, Marriage & Death Certificates',
      title_am: 'የወሳኝ ኩነት ምዝገባ ቅጽ (የልደት፣ ጋብቻ እና የሞት ምስክር ወረቀት)',
      formCode: 'ATW-FORM-CVL-03',
      department_en: 'Vital Events Registration Desk & Kebele Centers',
      department_am: 'የወሳኝ ኩነቶች ምዝገባ ዴስክና የቀበሌ ማዕከላት',
      category: 'CIVIL',
      desc_en:
        'Standard national statutory form for registering vital events, obtaining official civil status certificates, or requesting certified duplicate vital credentials.',
      desc_am:
        'ህጋዊ የልደት፣ የጋብቻ ወይም የሞት ምስክር ወረቀት ለማግኘት በወረዳው ወይም በቀበሌ አስተዳደር የሚሞላ ይፋዊ የምዝገባ ቅጽ።',
      requirements_en: [
        'Hospital or health clinic notification slip (for birth/death)',
        'Identity cards of parents or spouses',
        'Formal testimony of two adult witnesses (for marriages)',
      ],
      requirements_am: [
        'ከሆስፒታል ወይም ከጤና ጣቢያ የተሰጠ የልደት/ሞት ማረጋገጫ ወረቀት',
        'የወላጆች ወይም የጥንዶች መታወቂያ ካርድ',
        'የሁለት ምስክሮች ህጋዊ ፊርማ (ለጋብቻ)',
      ],
      processingDays: 'Same-Day Issuance (1 – 3 Hours)',
      submissionDesk_en: 'All 21 Kebele Administrative Offices & Chacha Central Registry',
      submissionDesk_am: 'በሁሉም 21 ቀበሌዎች ጽ/ቤት እና በጫጫ ማዕከላዊ መዝገብ ቤት',
    },
    {
      id: 'form-04',
      title_en: 'Agricultural Input & Certified Seed Allocation Voucher Requisition',
      title_am: 'የግብርና ግብዓትና ምርጥ ዘር ማከፋፈያ ቫውቸር መጠየቂያ ቅጽ',
      formCode: 'ATW-FORM-AGR-04',
      department_en: 'Agriculture & Natural Resource Development Office',
      department_am: 'የግብርናና የተፈጥሮ ሀብት ልማት ጽ/ቤት',
      category: 'AGRICULTURE',
      desc_en:
        'Application for smallholder farmers and agricultural cooperatives to obtain subsidized chemical/bio fertilizers, certified malt barley seeds, and extension vouchers.',
      desc_am:
        'አርሶ አደሮችና ማህበራት ድጎማ የተደረገበትን ማዳበሪያ፣ ምርጥ የገብስና የስንዴ ዘር ለማግኘት በልማት ጣቢያ ሰራተኞች በኩል የሚያቀርቡት ማመልከቻ።',
      requirements_en: [
        'Rural farmer cooperative membership passbook',
        'Development Agent (DA) farmland area verification endorsement',
        'Bank deposit slip from Amhara Bank or Commercial Bank of Ethiopia',
      ],
      requirements_am: [
        'የግብርና ህብረት ስራ ማህበር የአባልነት ደብተር',
        'የልማት ጣቢያ ሰራተኛ (DA) የእርሻ ማሳ ስፋት ማረጋገጫ',
        'የአማራ ባንክ ወይም የኢትዮጵያ ንግድ ባንክ የክፍያ ደረሰኝ',
      ],
      processingDays: '3 – 5 Days',
      submissionDesk_en: 'Kebele Agricultural Development Center / Union Depots',
      submissionDesk_am: 'የቀበሌው የግብርና ልማት ጣቢያ / የህብረት ስራ ዩኒየን መጋዘን',
    },
    {
      id: 'form-05',
      title_en: 'Official Citizen Grievance & Administrative Appeal Petition Form',
      title_am: 'የዜጎች ቅሬታና አስተዳደራዊ ይግባኝ ማቅረቢያ ይፋዊ ቅጽ',
      formCode: 'ATW-FORM-GRV-05',
      department_en: 'Woreda Grievance Hearing & Public Petitions Secretariat',
      department_am: 'የወረዳው አቤቱታ ሰሚና የህዝብ ቅሬታ ማስተናገጃ ሴክሬተሪያት',
      category: 'GRIEVANCE',
      desc_en:
        'Official citizen charter petition form to lodge formal complaints regarding service delays, land boundary disputes, municipal disagreements, or administrative misconduct.',
      desc_am:
        'በአገልግሎት መጓተት፣ በመሬት ወሰን አለመግባባት ወይም በቢሮክራሲያዊ አሰራር ላይ ህጋዊ አቤቱታን ለወረዳው ዋና አስተዳዳሪ ለማቅረብ የሚያስችል ቅጽ።',
      requirements_en: [
        'Copy of previous kebele decision or service rejection receipt',
        'Detailed narrative of grievance with relevant witness statements',
        'Valid citizen contact address and phone number for summons',
      ],
      requirements_am: [
        'የቀበሌው ውሳኔ ወይም የአገልግሎት መከልከል ማረጋገጫ',
        'የአቤቱታው ዝርዝር ማብራሪያና ማስረጃዎች',
        'ለጥሪ ምላሽ የሚሆን ትክክለኛ አድራሻና ስልክ ቁጥር',
      ],
      processingDays: 'Statutory 15 Days Review Period',
      submissionDesk_en: 'Office 02, Woreda Executive Administration Building, Chacha',
      submissionDesk_am: 'ቢሮ 02፣ የወረዳው ዋና አስተዳዳሪ ህንፃ፣ ጫጫ',
    },
  ]

  const categories = [
    { key: 'ALL', label_en: 'All Service Forms', label_am: 'ሁሉም የአገልግሎት ቅጾች' },
    { key: 'LAND', label_en: 'Land Administration', label_am: 'የመሬት አስተዳደር' },
    { key: 'TRADE', label_en: 'Trade & Business', label_am: 'ንግድና ገበያ' },
    { key: 'CIVIL', label_en: 'Civil Status', label_am: 'ወሳኝ ኩነት' },
    { key: 'AGRICULTURE', label_en: 'Agriculture & Inputs', label_am: 'ግብርናና ግብዓት' },
    { key: 'GRIEVANCE', label_en: 'Grievance Petitions', label_am: 'አቤቱታና ይግባኝ' },
  ]

  const filtered = forms.filter((f) => {
    const matchesCat = selectedCat === 'ALL' || f.category === selectedCat
    const q = search.toLowerCase()
    const matchesSearch =
      f.title_en.toLowerCase().includes(q) ||
      f.title_am.includes(q) ||
      f.formCode.toLowerCase().includes(q) ||
      f.desc_en.toLowerCase().includes(q) ||
      f.desc_am.includes(q)
    return matchesCat && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="bg-[#0d2340] text-white p-8 sm:p-10 rounded-2xl border-b-4 border-[#c8931a] shadow-xs">
          <div className="flex items-center gap-2 text-xs text-[#fed100] mb-3 uppercase tracking-wider font-semibold">
            <Link href={`/${locale}`} className="hover:underline">
              {isAmharic ? 'ዋና ገጽ' : 'Home'}
            </Link>
            <span>›</span>
            <Link href={`/${locale}/resources`} className="hover:underline">
              {isAmharic ? 'ሰነዶች' : 'Resources'}
            </Link>
            <span>›</span>
            <span>{isAmharic ? 'የአገልግሎት ቅጾች' : 'Downloadable Forms'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            {isAmharic
              ? 'የዜጎች አገልግሎት መጠየቂያ ይፋዊ ቅጾች'
              : 'Official Citizen Service Application Forms'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-gray-300 max-w-3xl leading-relaxed">
            {isAmharic
              ? 'ለመሬት ይዞታ፣ ለንግድ ፈቃድ፣ ለወሳኝ ኩነት ምዝገባና ለአቤቱታዎች የተዘጋጁ ሊወርዱ የሚችሉ ይፋዊ የመንግስት ማመልከቻ ቅጾች።'
              : 'Download official printable citizen service forms, review mandatory application prerequisites, and prepare your documentation before visiting woreda service halls.'}
          </p>
        </div>

        {/* Search & Categories */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs space-y-4">
          <div className="relative">
            <span className="absolute left-3.5 top-3 text-gray-400 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                isAmharic
                  ? 'በቅጹ ስም፣ በኮድ ወይም በአገልግሎት ዓይነት ይፈልጉ...'
                  : 'Search forms by name, document code, or required service...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#1a4f8b]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setSelectedCat(c.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === c.key
                    ? 'bg-[#0d2340] text-white shadow-xs'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isAmharic ? c.label_am : c.label_en}
              </button>
            ))}
          </div>
        </div>

        {/* Forms Cards */}
        <div className="space-y-6">
          {filtered.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center text-xs text-gray-500">
              {isAmharic ? 'ምንም ዓይነት ቅጽ አልተገኘም።' : 'No forms matched your query.'}
            </div>
          ) : (
            filtered.map((form) => (
              <div
                key={form.id}
                className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs hover:border-[#1a4f8b] transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-gray-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-[#1a4f8b] font-bold text-[10px] rounded-full border border-blue-200">
                        {form.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-gray-500">
                        #{form.formCode}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#0d2340] leading-snug">
                      {isAmharic ? form.title_am : form.title_en}
                    </h2>
                    <p className="text-xs text-[#c8931a] font-semibold mt-0.5">
                      🏛️ {isAmharic ? form.department_am : form.department_en}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-xl border border-emerald-200">
                      ⏱️ {form.processingDays}
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                  {isAmharic ? form.desc_am : form.desc_en}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider">
                      {isAmharic ? 'አስፈላጊ ሰነዶች (Checklist):' : 'Mandatory Attached Requirements:'}
                    </h3>
                    <ul className="space-y-1.5 text-xs text-gray-600">
                      {(isAmharic ? form.requirements_am : form.requirements_en).map((req, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">✓</span>
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-1">
                        {isAmharic ? 'የማስረከቢያ ቢሮ፡' : 'Submission Window:'}
                      </h3>
                      <p className="text-xs text-gray-700">
                        📍 {isAmharic ? form.submissionDesk_am : form.submissionDesk_en}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-gray-200">
                      <DownloadButton
                        title={isAmharic ? form.title_am : form.title_en}
                        label={isAmharic ? 'ቅጹን አውርድ (Download)' : 'Download Application Form'}
                        refNumber={form.formCode}
                        category={`Citizen Service Form (${form.category})`}
                        contentSnippet={`SERVICE NAME: ${form.title_en}
FORM CODE: ${form.formCode}
ISSUING OFFICE: ${form.department_en}
ESTIMATED PROCESSING TIMELINE: ${form.processingDays}
SUBMISSION COUNTER: ${form.submissionDesk_en}

REQUIRED SUPPORTING ATTACHMENTS:
${form.requirements_en.map((r, i) => `  [ ] ${i + 1}. ${r}`).join('\n')}

APPLICANT REGISTRATION:
Full Legal Name: __________________________________________________
Kebele of Residence: ___________________ Village/Gott: ______________
Telephone Number: _____________________ Email: ___________________

Applicant Declaration:
I declare that the information provided herein is truthful and supported 
by the legal attachments enclosed.

Signature: ____________________________ Date: ___________________`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
