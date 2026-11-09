import React from 'react'
import Link from 'next/link'
import { setRequestLocale } from 'next-intl/server'
import { locales, type Locale } from '@/i18n/config'
import { notFound } from 'next/navigation'
import {
  ShieldCheck,
  Code2,
  Network,
  Cpu,
  Mail,
  Phone,
  Server,
  Terminal,
  Laptop,
  CheckCircle2,
  Lock,
  Globe2,
} from 'lucide-react'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function ICTTeamPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!locales.includes(locale as Locale)) notFound()
  setRequestLocale(locale)

  const isAm = locale === 'am'

  const tDict = {
    en: {
      breadcrumbHome: 'Home',
      breadcrumbAbout: 'About',
      breadcrumbCurrent: 'ICT & Digital Team',
      badge: 'Information Communication Technology (ICT) • E-Government',
      title: 'ICT & Digital Transformation Team',
      subtitle:
        'The technical professionals responsible for systems administration, cybersecurity, local government network infrastructure, and digital portal development for Angolela Tera Woreda Administration.',
      mandateTitle: 'Core Technology Mandates & Responsibilities',
      mandates: [
        {
          icon: '🌐',
          title: 'Official Web Portal & E-Services',
          desc: 'Architecting, maintaining, and updating the Woreda digital administration portal to provide citizens, investors, and farmers with direct service access.',
        },
        {
          icon: '🛡️',
          title: 'Cybersecurity & Data Protection',
          desc: 'Safeguarding governmental administrative records, citizen vital registry data, and land databases against unauthorized access or loss.',
        },
        {
          icon: '🔌',
          title: 'Intranet & Network Infrastructure',
          desc: 'Managing wired and wireless local area networks (LAN/WAN) connecting sector offices, Kebele desks, and broadband communication lines.',
        },
        {
          icon: '💻',
          title: 'Hardware & Municipal IT Support',
          desc: 'Providing technical troubleshooting, computer hardware diagnostics, operating system maintenance, and digital capacity training.',
        },
      ],
      rosterTitle: 'ICT Team Members & Technical Staff',
      rosterSubtitle:
        'Direct contacts for the woreda digital administration team. For system inquiries, network diagnostics, or official ICT support, contact the designated specialists below.',
      skillsLabel: 'Specializations & Core Competencies',
      helpdeskTitle: 'Woreda IT Support & Helpdesk Office',
      locationLabel: 'Location: Main Administrative Compound, Chacha Town',
      hoursLabel: 'Working Hours: Monday – Friday: 8:30 AM – 5:30 PM',
      callBtn: 'Call Specialist',
      emailBtn: 'Send Email',
    },
    am: {
      breadcrumbHome: 'ዋና ገጽ',
      breadcrumbAbout: 'ስለ ወረዳው',
      breadcrumbCurrent: 'የአይሲቲ (ICT) ቡድን',
      badge: 'የኢንፎርሜሽን ኮሚዩኒኬሽን ቴክኖሎጂ (ICT) • ኢ-መንግሥት',
      title: 'የአይሲቲና ዲጂታል ትራንስፎርሜሽን ቡድን',
      subtitle:
        'የአንጎለላ ጠራ ወረዳ አስተዳደርን የሲስተም፣ የኔትወርክ፣ የሳይበር ደህንነት እና የድረ-ገጽ ፖርታል ስራዎችን በበላይነት የሚመሩና የሚያስተዳድሩ የቴክኖሎጂ ባለሙያዎች።',
      mandateTitle: 'ዋና ዋና የቴክኖሎጂ ተግባራትና ሃላፊነቶች',
      mandates: [
        {
          icon: '🌐',
          title: 'ይፋዊ ፖርታልና የዲጂታል አገልግሎቶች',
          desc: 'የወረዳውን ይፋዊ ፖርታል መገንባት፣ ማዘመንና የዜጎችን የመረጃና አገልግሎት ተደራሽነት ማረጋገጥ።',
        },
        {
          icon: '🛡️',
          title: 'የሳይበር ደህንነትና የመረጃ ጥበቃ',
          desc: 'የወረዳውን የመንግስት ሰነዶች፣ የወሳኝ ኩነት ምዝገባና የመሬት ዳታቤዞች ከጥቃትና ከብልሽት መጠበቅ።',
        },
        {
          icon: '🔌',
          title: 'የኔትወርክና የኢንተርኔት መሰረተ-ልማት',
          desc: 'የወረዳውን ሴክተር መስሪያ ቤቶችና የቀበሌ ጽህፈት ቤቶችን የሚያስተሳስር የኮምፒውተር ኔትወርክ ማስተዳደር።',
        },
        {
          icon: '💻',
          title: 'የሃርድዌር ጥገናና ቴክኒካል ድጋፍ',
          desc: 'ለመንግሥት ሰራተኞች የኮምፒውተር ጥገና፣ የሶፍትዌር ጭነትና የቴክኖሎጂ ስልጠናዎችን መስጠት።',
        },
      ],
      rosterTitle: 'የአይሲቲ ቡድን አባላትና የባለሙያዎች ዝርዝር',
      rosterSubtitle:
        'የወረዳው የቴክኖሎጂ ቡድን አባላት ቀጥተኛ አድራሻዎች። ለሲስተም፣ ለኔትወርክና ለቴክኒክ ድጋፍ ከታች የተዘረዘሩትን ባለሙያዎች ማነጋገር ይችላሉ።',
      skillsLabel: 'የሙያ መስኮችና ልዩ ችሎታዎች',
      helpdeskTitle: 'የወረዳው አይሲቲ ድጋፍና ሄልፕዴስክ ቢሮ',
      locationLabel: 'አድራሻ፡ ዋናው የአስተዳደር ቅጥር ጊቢ፣ ጫጫ ከተማ',
      hoursLabel: 'የስራ ሰዓት፡ ከሰኞ – አርብ፡ ከጠዋቱ 2:30 – 11:30',
      callBtn: 'ይደውሉ',
      emailBtn: 'ኢሜይል ይላኩ',
    },
  }
  const t = tDict[locale as 'en' | 'am'] || tDict.en

  const teamMembers = [
    {
      id: 'tirualem-tegenaw',
      name_en: 'Tirualem Tegenaw',
      name_am: 'ጥሩዓለም ተገናው',
      role_en: 'Team Leader of ICT Team',
      role_am: 'የአይሲቲ (ICT) ቡድን መሪ',
      icon: Terminal,
      phone: '+251945244555',
      displayPhone: '+251 945 244 555',
      email: 'tirualem2233@gmail.com',
      skills_en: [
        'ICT Team Leadership & Project Coordination',
        'Digital Governance & E-Government Strategies',
        'Procurement of Enterprise Technology & Devices',
        'Cross-Departmental Technology Alignment',
      ],
      skills_am: [
        'የአይሲቲ ቡድን አመራርና የፕሮጀክት አስተባባሪነት',
        'የዲጂታል አስተዳደርና የኢ-መንግሥት ስትራቴጂ',
        'የቴክኖሎጂ ግዥና የግብአት አቅርቦት ክትትል',
        'የሴክተር መስሪያ ቤቶች የቴክኖሎጂ ትስስር',
      ],
      badge_en: 'Head of ICT Team',
      badge_am: 'የቡድን መሪ',
    },
    {
      id: 'micheal-mekonen',
      name_en: 'Micheal Mekonen',
      name_am: 'ሚካኤል መኮንን',
      role_en: 'System Administrator',
      role_am: 'የሲስተም አስተዳዳሪ',
      icon: Code2,
      phone: '+251907253401',
      displayPhone: '+251 907 253 401',
      email: 'mikimekonen9@gmail.com',
      skills_en: [
        'Full Stack Website Developer',
        'Cybersecurity Specialist',
        'System Architecture & Server Administration',
        'Database Management & Cloud Deployments',
      ],
      skills_am: [
        'የሙሉ ስታክ ድረ-ገጽ አልሚ (Full Stack Website Developer)',
        'የሳይበር ደህንነት ስፔሻሊስት (Cybersecurity Specialist)',
        'የሲስተምና ሰርቨር አስተዳደር (Server Administration)',
        'የዳታቤዝ ደህንነትና የድረ-ገጽ ፖርታል ዝርጋታ',
      ],
      badge_en: 'System Administrator',
      badge_am: 'የሲስተም አስተዳዳሪ',
    },
    {
      id: 'tekilye-negash',
      name_en: 'Tekilye Negash',
      name_am: 'ተክለየ ነጋሽ',
      role_en: 'Network Administrator & Network Specialist',
      role_am: 'የኔትወርክ አስተዳዳሪና ኔትወርክ ስፔሻሊስት',
      icon: Network,
      phone: '+251921665740',
      displayPhone: '+251 921 665 740',
      email: 'Tekilyenegash@gmail.com',
      skills_en: [
        'Network Administration & Optimization',
        'Network Infrastructure (Routers, Switches & Firewall)',
        'LAN/WAN Configuration & Fiber Connectivity',
        'Network Security & Threat Monitoring',
      ],
      skills_am: [
        'የኔትወርክ አስተዳደርና ስፔሻላይዜሽን',
        'የመሰረተ-ልማት ዝርጋታ (Routers, Switches & Firewall)',
        'የአካባቢያዊና ሰፊ ኔትወርክ ውቅር (LAN/WAN Configuration)',
        'የኔትወርክ ደህንነትና የፍጥነት ቁጥጥር',
      ],
      badge_en: 'Network Specialist',
      badge_am: 'የኔትወርክ ስፔሻሊስት',
    },
    {
      id: 'chane-fiseha',
      name_en: 'Chane Fiseha',
      name_am: 'ጫኔ ፍስሐ',
      role_en: 'Information Communication Technologist — ICT Training Specialist',
      role_am: 'የኢንፎርሜሽን ኮሚዩኒኬሽን ቴክኖሎጂ ባለሙያ — የአይሲቲ ስልጠና ስፔሻሊስት',
      icon: Laptop,
      phone: '+251913857317',
      displayPhone: '+251 913 857 317',
      email: null, // As requested: do not add email for Chane Fiseha
      skills_en: [
        'ICT Training Environment Preparation & Setup',
        'ICT Skills Training for Government Workers',
        'Digital Literacy Training for the Community & Society',
        'Capacity Building & Awareness Programs on Information Technology',
      ],
      skills_am: [
        'የአይሲቲ ስልጠና ዝግጅትና የስልጠና ማዕከል ማደራጀት',
        'ለመንግሥት ሠራተኞች የአይሲቲ ክህሎት ስልጠና መስጠት',
        'ለማኅበረሰቡ የዲጂታል ዕውቀት ስልጠና (Digital Literacy)',
        'የመረጃ ቴክኖሎጂ አቅም ግንባታና የግንዛቤ ማስጨበጫ ፕሮግራሞች',
      ],
      badge_en: 'ICT Training Specialist',
      badge_am: 'የአይሲቲ ስልጠና ስፔሻሊስት',
    },
  ]

  return (
    <div className="bg-[#f0f4f8] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link href={`/${locale}`} className="hover:text-[#1a4f8b] transition-colors">
            {t.breadcrumbHome}
          </Link>
          <span>/</span>
          <Link href={`/${locale}/about`} className="hover:text-[#1a4f8b] transition-colors">
            {t.breadcrumbAbout}
          </Link>
          <span>/</span>
          <span className="text-[#0d2340] font-semibold">{t.breadcrumbCurrent}</span>
        </nav>

        {/* Hero Section Banner */}
        <div className="bg-gradient-to-r from-[#0d2340] via-[#1a4f8b] to-[#07172c] text-white rounded-3xl p-6 sm:p-12 mb-10 shadow-xl relative overflow-hidden">
          {/* Subtle Cyber Grid & Light Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#c8931a]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-10 w-80 h-80 bg-blue-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FED100] uppercase tracking-wider bg-white/10 border border-white/20 px-3.5 py-1.5 rounded-full mb-4">
              <Terminal className="w-3.5 h-3.5 text-[#FED100]" />
              <span>{t.badge}</span>
            </span>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.title}
            </h1>

            <p className="text-sm sm:text-base text-gray-200 mt-4 leading-relaxed font-normal">
              {t.subtitle}
            </p>
          </div>
        </div>

        {/* Core Technology Mandates Grid */}
        <section className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 mb-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 border border-blue-200 px-3 py-1 rounded-full inline-block mb-3">
              ⚡ Digital Infrastructure • የዲጂታል መሰረተ ልማት
            </span>
            <h2 className="text-xl sm:text-3xl font-black text-[#0d2340] tracking-tight">
              {t.mandateTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {(t.mandates || []).map((m: any, idx: number) => (
              <div
                key={idx}
                className="bg-gray-50/70 hover:bg-blue-50/20 border border-gray-200 rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <span className="text-3xl block mb-3">{m.icon}</span>
                  <h3 className="text-sm font-bold text-[#0d2340] leading-snug">
                    {m.title}
                  </h3>
                  <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ICT Team Roster Grid */}
        <section className="mb-12">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-bold text-[#009A44] uppercase tracking-wider bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full inline-block mb-3">
              👥 Technical Staff • የባለሙያዎች ዝርዝር
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0d2340] tracking-tight">
              {t.rosterTitle}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 leading-relaxed">
              {t.rosterSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {teamMembers.map((member, idx) => {
              const IconComponent = member.icon
              const name = isAm ? member.name_am : member.name_en
              const role = isAm ? member.role_am : member.role_en
              const badge = isAm ? member.badge_am : member.badge_en
              const skills = isAm ? member.skills_am : member.skills_en

              return (
                <div
                  key={member.id}
                  className="bg-white border border-gray-200 hover:border-[#1a4f8b]/50 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Subtle top indicator bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1a4f8b] via-[#c8931a] to-[#009A44]" />

                  <div>
                    {/* Header: Insignia Icon + Name + Role */}
                    <div className="flex items-start gap-4 mb-5">
                      {/* Tech Insignia Crest */}
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0d2340] to-[#1a4f8b] text-[#FED100] border-2 border-[#FED100]/50 flex items-center justify-center shrink-0 shadow-md group-hover:scale-105 transition-transform duration-200">
                        <IconComponent className="w-8 h-8" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#1a4f8b] px-2.5 py-0.5 rounded-full border border-blue-200/80">
                            {badge}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400">
                            #{idx + 1}
                          </span>
                        </div>

                        <h3 className="text-lg sm:text-xl font-black text-[#0d2340] tracking-tight">
                          {name}
                        </h3>

                        <p className="text-xs font-bold text-[#c8931a] mt-0.5">
                          {role}
                        </p>
                      </div>
                    </div>

                    {/* Specializations & Skills */}
                    <div className="mb-6">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                        {t.skillsLabel}
                      </span>
                      <ul className="space-y-1.5 text-xs text-gray-700">
                        {skills.map((skill, sIdx) => (
                          <li key={sIdx} className="flex items-start gap-2">
                            <span className="h-4 w-4 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                              ✓
                            </span>
                            <span className="font-medium">{skill}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Direct Contact Actions */}
                  <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    {/* Phone Button */}
                    <a
                      href={`tel:${member.phone}`}
                      className="inline-flex items-center gap-1.5 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-[#FED100]" />
                      <span>{member.displayPhone}</span>
                    </a>

                    {/* Email Button (Only shown if member has email) */}
                    {member.email && (
                      <a
                        href={`mailto:${member.email}`}
                        className="inline-flex items-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-[#0d2340] text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#1a4f8b]" />
                        <span>{member.email}</span>
                      </a>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* IT Helpdesk & Support Desk Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold text-[#1a4f8b] uppercase tracking-wider bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
                Woreda Administration Technology Desk
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#0d2340] mt-2">
                {t.helpdeskTitle}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mt-2">
                {t.locationLabel} • {t.hoursLabel}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={`/${locale}/contact`}
                className="inline-flex items-center gap-2 bg-[#1a4f8b] hover:bg-[#133a6b] text-white text-xs font-bold px-5 py-3 rounded-xl transition-all shadow-md"
              >
                <span>💬 Technical Helpdesk Inquiry</span>
              </Link>

              <Link
                href={`/${locale}/about`}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold px-5 py-3 rounded-xl transition-all"
              >
                <span>🏛️ About Woreda Administration</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
