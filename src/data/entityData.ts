/**
 * entityData.ts
 * ─────────────────────────────────────────────────────────
 * In-memory data store for:
 *  - Private Businesses / Companies
 *  - Partner Organizations
 *  - Leadership Profiles (Woreda leadership)
 *  - Live Announcement Banners
 * ─────────────────────────────────────────────────────────
 */

import type {
  BusinessItem,
  PartnerItem,
  AnnouncementItem,
} from '@/types'

// ============================================================
// LEADERSHIP (Woreda Head & Key Personnel)
// ============================================================

export interface LeaderProfile {
  id: string
  name_en: string
  name_am: string
  name_om: string
  title_en: string
  title_am: string
  title_om: string
  bio_en: string
  bio_am: string
  bio_om: string
  phone?: string
  email?: string
  photo?: string          // URL or path
  displayOrder: number
  status: 'PUBLISHED' | 'DRAFT'
}

export const MOCK_LEADERSHIP: LeaderProfile[] = [
  {
    id: 'leader-1',
    name_en: 'Ato Alemu Bekele Demissie',
    name_am: 'አቶ አለሙ በቀለ ደምሰው',
    name_om: 'Obbo Aleemuu Baqalee Damiissee',
    title_en: 'Woreda Administrator',
    title_am: 'የወረዳ አስተዳዳሪ',
    title_om: 'Bulchaa Aanaa',
    bio_en:
      'Ato Alemu Bekele leads the Angolela Tera Woreda with a vision of inclusive growth, food security, and digital governance. With over 15 years of public service, he has championed agricultural transformation, infrastructure expansion, and citizen participation programs across all 19 kebeles.',
    bio_am:
      'አቶ አለሙ በቀለ ሁሉን ያካተተ ዕድገት፣ የምግብ ዋስትና እና ዲጂታል አስተዳደር ራዕይ ሰንቀው አንጎሌላ ተራ ወረዳን ይመራሉ። ከ15 ዓመት በላይ የህዝብ አገልግሎት ልምድ ባለቤት ሆነው፣ በ19ቱ ቀበሌዎች የግብርና ሽግግር፣ የመሠረተ ልማት ማስፋፋት እና የዜጎችን ተሳትፎ ፕሮግራሞች ፈር ቀዳጅ ሆነዋል።',
    bio_om:
      'Obbo Aleemuu Baqalee aanjaan Angolallaa Xaraa keessatti misooma hunda hammate, wabii nyaataa fi mootummaa dijitaalaa irratti xiyyeeffatee hojjeta. Waggaa 15 oliif tajaajilaagartummaa hawaasaa keessatti muuxannoo horate.',
    phone: '+251 (0) 58 661 0100',
    email: 'administrator@angolela-tera.gov.et',
    photo: undefined,
    displayOrder: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-2',
    name_en: 'W/ro Yeshi Hailu Girma',
    name_am: 'ወ/ሮ የሺ ሀይሉ ግርማ',
    name_om: 'Adde Yeeshii Haayla Girmaa',
    title_en: 'Deputy Woreda Administrator',
    title_am: 'ምክትል ወረዳ አስተዳዳሪ',
    title_om: 'Itti Aanaa Bulchaa Aanaa',
    bio_en:
      "W/ro Yeshi Hailu oversees day-to-day internal operations, citizen engagement, and women's empowerment programs. She coordinates multi-sectoral development plans and leads the Woreda's gender mainstreaming initiatives.",
    bio_am:
      'ወ/ሮ የሺ ሀይሉ የዕለት ተዕለት የውስጥ ክዋኔ፣ የዜጎችን ተሳትፎ እና የሴቶች ማብቃት ፕሮግራሞችን ይቆጣጠራሉ። ባለ-ዘርፍ የልማት ዕቅዶችን ያስተባብራሉ።',
    bio_om:
      'Adde Yeeshiin hojii guyyaa guyyaa, hirmaannaa lammiiwwanii fi sagantaa hoggansaa dhiiraa fi dhalaa hoggantu.',
    phone: '+251 (0) 58 661 0101',
    email: 'deputy@angolela-tera.gov.et',
    photo: undefined,
    displayOrder: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-3',
    name_en: 'Ato Dereje Mengistu Woldaye',
    name_am: 'አቶ ደረጀ መንግስቱ ወልደዬ',
    name_om: 'Obbo Dareejjee Mangistuu Waldaayyee',
    title_en: 'Cabinet Secretary & Chief of Staff',
    title_am: 'የካቢኔ ፀሀፊ እና ዋና ሃላፊ',
    title_om: 'Barreessaa Kaabinee fi Hogganaa Olaanaa',
    bio_en:
      "Ato Dereje manages the Woreda Cabinet secretariat, strategic planning, and cross-sector policy coordination. He leads the implementation of the Woreda's five-year growth plan and liaises with the North Shewa Zone administration.",
    bio_am:
      'አቶ ደረጀ የወረዳ ካቢኔ ፀሀፊነቱን፣ ስትራቴጂካዊ ዕቅድ ማዘጋጀቱን እና ሰፊ ዘርፎችን የሚያቋርጥ ፖሊሲ ቅንጅት ይመራሉ።',
    bio_om:
      'Obbo Dareejjeen Kaabinee Aanaasaa fi qindoomina karoora ijaarsaa hogganuu keessatti ga\'ee olaanaa qaba.',
    phone: '+251 (0) 58 661 0102',
    email: 'cabinet@angolela-tera.gov.et',
    photo: undefined,
    displayOrder: 3,
    status: 'PUBLISHED',
  },
]

// ============================================================
// PRIVATE BUSINESSES
// ============================================================

export const MOCK_BUSINESSES: BusinessItem[] = [
  {
    id: 'biz-1',
    name_en: 'Chacha Agro-Processing PLC',
    name_am: 'ጫቻ አግሮ-ፕሮሰሲንግ ኃ.የተ.የ.ማ',
    name_om: 'Caccetti Agro-Processining PLC',
    description_en:
      'A leading grain and oilseed processing company based in Chacha town, supplying markets in Addis Ababa, Debre Birhan, and beyond. The company operates a modern 500-ton flour mill and a cold storage facility, employing over 120 local workers.',
    description_am:
      'በጫቻ ከተማ የሚገኝ ቀዳሚ የሰብልና ዘይት ዘር ማቀነባበሪያ ድርጅት። ዘመናዊ 500 ቶን አቅም ያለው ዱቄት ፋብሪካ እና ቀዝቃዛ ማከማቻ ያለው ሲሆን ከ120 በላይ የአካባቢ ሰዎችን ቀጥሯል።',
    description_om:
      'Dhaabbati kun biyyoo fi sanyii zayitii hojjee magaalota gara Finfinnee fi Dabra Birhan dhiheessa. Hojjettoota naannoo 120 ol qaqqabsiisa.',
    sector: 'AGRO_PROCESSING',
    address: 'Chacha Industrial Zone, Angolela Tera Woreda',
    phone: '+251 (0) 91 120 0001',
    email: 'info@chachaagro.et',
    established: '2018',
    employeeCount: '120+',
    displayOrder: 1,
    status: 'PUBLISHED',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2025-03-20'),
  },
  {
    id: 'biz-2',
    name_en: 'Angolela Tera Seed & Input Supply Co.',
    name_am: 'አንጎሌላ ተራ ዘር እና ግብዓት አቅርቦት ኩባንያ',
    name_om: 'Dhaabbata Dhiyeessaa Sanyii fi Meeshaalee Angolallaa Xaraa',
    description_en:
      'A cooperative enterprise distributing certified rust-resistant wheat, barley, and teff seeds alongside fertilizers across 19 kebeles. The company works directly with the Agriculture Directorate to ensure timely planting-season supply chains.',
    description_am:
      'የተረጋገጡ ዘሮችን፣ ማዳበሪያዎችን እና ሌሎች የግብርና ግብዓቶችን ለ19 ቀበሌዎች በወቅቱ ለማቅረብ ከግብርና ጽ/ቤት ጋር ቀጥተኛ ትብብር ያደርጋል።',
    description_om:
      'Qonnaan bultoota gandoota 19-f sanyii, xaa\'oo fi meeshaalee qonnaa dhiyeessa.',
    sector: 'AGRICULTURE',
    address: 'Market District, Chacha Town',
    phone: '+251 (0) 92 230 0012',
    email: 'seeds@angolela-tera.et',
    established: '2015',
    employeeCount: '45',
    displayOrder: 2,
    status: 'PUBLISHED',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2025-04-01'),
  },
  {
    id: 'biz-3',
    name_en: 'Tera Highland Construction & Engineering',
    name_am: 'ተራ ሃይላንድ ግንባታ እና ምህንድስና',
    name_om: 'Ijaarsa fi Injineeriingii Tera Highland',
    description_en:
      'A Grade-3 certified contractor specializing in rural road construction, school building, irrigation canal rehabilitation, and small-scale infrastructure across Angolela Tera and neighboring woredas. The firm has completed 14 major public projects since 2019.',
    description_am:
      'ደረጃ 3 ተቋራጭ ሆኖ ሲሰራ የቆሰ ድርጅት። ከ2019 ጀምሮ 14 ዋና ዋና የህዝብ ፕሮጀክቶችን ጨርሷል።',
    description_om:
      'Dhaabbatichi ijaarsa daandii, mana barumsaa fi qooqa bishaan keessatti wantoota 14 xumure.',
    sector: 'CONSTRUCTION',
    address: 'Chacha Town, Main Road',
    phone: '+251 (0) 93 340 0023',
    established: '2014',
    employeeCount: '80',
    displayOrder: 3,
    status: 'PUBLISHED',
    createdAt: new Date('2024-03-05'),
    updatedAt: new Date('2025-05-10'),
  },
  {
    id: 'biz-4',
    name_en: 'Chacha Honey & Bee Products Enterprise',
    name_am: 'ጫቻ ማር እና የንብ ምርቶች ድርጅት',
    name_om: 'Dhaabbata Damma fi Bu\'aa Haroo Caccetti',
    description_en:
      'A traditional and organic honey producer tapping into the rich highland flora of Angolela Tera. The enterprise exports bulk and packaged Ethiopian highland honey to Addis Ababa and has recently entered international market channels.',
    description_am:
      'ወደ አዲስ አበባ ጅምላ እና ፓኬጅ ያደረገ ኢትዮጵያዊ ደጋ ማር ይልካል። ወደ ዓለም አቀፍ ገበያ ለመግባት ዝግጅቱን አጠናቋል።',
    description_om:
      'Dammaa uumamaa Angolallaa Xaraa Finfinnee fi gabaa biyyolessaa dhiheessa.',
    sector: 'AGRO_PROCESSING',
    address: 'Kebele 04, Angolela Tera Woreda',
    phone: '+251 (0) 94 450 0034',
    email: 'honey@chacha-et.com',
    established: '2016',
    employeeCount: '30',
    displayOrder: 4,
    status: 'PUBLISHED',
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2025-05-30'),
  },
]

// ============================================================
// PARTNER ORGANIZATIONS
// ============================================================

export const MOCK_PARTNERS: PartnerItem[] = [
  {
    id: 'partner-1',
    name_en: 'USAID — Feed the Future Ethiopia',
    name_am: 'ዩኤስኤይድ — የወደፊቱን ምግብ ኢትዮጵያ',
    name_om: 'USAID — Feed the Future Itoophiyaa',
    description_en:
      'USAID Feed the Future supports smallholder farmers in Angolela Tera through the provision of improved seeds, extension training, nutrition programs, and market linkages under the Amhara Agricultural Growth Program (AAGP).',
    description_am:
      'ዩኤስኤይድ ፊድ ዘ ፊውቸር በሸዋ ዞን ምርጥ ዘር፣ የቴክኖሎጂ ሽግግር፣ የምግብ አሰጣጥ ፕሮግራምና የገበያ ትስስርን ለጥቃቅን አርሶ አደሮች ያቀርባል።',
    description_om:
      'USAID qonnaan bultootaa xiqqaa Angolallaa Xaraa keessatti sanyii fooyyaa\'aa, leenjii fi gabaa dhiyeessa.',
    partnerType: 'DEVELOPMENT_PARTNER',
    country: 'USA',
    website: 'https://www.usaid.gov',
    partnerSince: '2018',
    displayOrder: 1,
    status: 'PUBLISHED',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2025-03-01'),
  },
  {
    id: 'partner-2',
    name_en: 'Debre Birhan University — Research Partnership',
    name_am: 'ደብረ ብርሃን ዩኒቨርሲቲ — የምርምር አጋርነት',
    name_om: 'Yuniversiitii Dabra Birhan — Makmaaksa Qorannoo',
    description_en:
      'The university partners with the Woreda on agricultural research (including highland teff and barley genetics), healthcare outreach (through the Pharmacy and Medical Science colleges), and community adult literacy programs.',
    description_am:
      'ዩኒቨርሲቲው ደብረ ብርሃን ከወረዳው ጋር በደጋ ስንዴ/ጤፍ ምርምር፣ በጤና አገልግሎት ቅጥያ እና ለጎልማሶች ማንበብና መፃፍ ፕሮግራም ያጋብዛሉ።',
    description_om:
      'Yuniversiitin Dabra Birhan qorannoo qonnaa, tajaajila fayyaa fi barnootaa wajjin hojjeta.',
    partnerType: 'ACADEMIC',
    country: 'Ethiopia',
    website: 'https://www.dbu.edu.et',
    partnerSince: '2019',
    displayOrder: 2,
    status: 'PUBLISHED',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2025-04-05'),
  },
  {
    id: 'partner-3',
    name_en: 'ILRI — International Livestock Research Institute',
    name_am: 'አይኤልአርአይ — ዓለምአቀፍ የእንስሳት ምርምር ኢንስቲትዩት',
    name_om: 'ILRI — Dhaabbata Qorannoo Beeyladaa Addunyaa',
    description_en:
      "ILRI partners with Angolela Tera's Livestock & Fisheries Office on breed improvement programs, dairy cattle technical training, feed demonstration plots, and animal health surveillance under the Highland Livestock Systems project.",
    description_am:
      'አይ.ኤል.አር.አይ. ከወረዳ ከብት እና አሳ ሃብት ጽ/ቤት ጋር የዝርያ ማሻሻያ፣ ወተት ላም ሞያዊ ሥልጠና፣ የምግብ ማሳያ ቦታዎችና የእንስሳት ጤና ክትትል ፕሮጀክቶችን ያሳካሉ።',
    description_om:
      'ILRI waajjira qurxummii fi beeyladaa Angolallaa Xaraa waliin fooyyina jiidii fi tajaajila fayyaa beeyladaa keessatti hojjeta.',
    partnerType: 'INTERNATIONAL_ORG',
    country: 'Kenya / Ethiopia',
    website: 'https://www.ilri.org',
    partnerSince: '2020',
    displayOrder: 3,
    status: 'PUBLISHED',
    createdAt: new Date('2024-03-10'),
    updatedAt: new Date('2025-05-20'),
  },
  {
    id: 'partner-4',
    name_en: 'North Shewa Zone Administration',
    name_am: 'ሰሜን ሸዋ ዞን አስተዳደር',
    name_om: 'Bulchiinsa Godina Kaabaa Shawaa',
    description_en:
      'The Zonal government coordinates budget transfers, policy oversight, infrastructure project approvals (roads, irrigation), and inter-woreda resource sharing for Angolela Tera within the Amhara Regional framework.',
    description_am:
      'የሰሜን ሸዋ ዞን አስተዳደር ለወረዳው በጀት ሽግግር፣ ፖሊሲ ክትትል፣ የፕሮጀክት ፈቃድ እና ምቹ ሁኔታ ያቀርባል።',
    description_om:
      'Bulchiinsa Godinaa wantoota bajataa, hordoffii imaammata fi sagantaa misooma guddaa waliin hojjeta.',
    partnerType: 'GOVERNMENT_AGENCY',
    country: 'Ethiopia',
    partnerSince: '2000',
    displayOrder: 4,
    status: 'PUBLISHED',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2025-06-01'),
  },
]

// ============================================================
// LIVE ANNOUNCEMENT BANNERS
// ============================================================

export const MOCK_ANNOUNCEMENTS: AnnouncementItem[] = [
  {
    id: 'ann-1',
    text_en:
      '📢 Public meeting: Woreda 2026/27 Budget Review — All kebele leaders invited. Saturday, Hamle 20, 2018 E.C. at Chacha Cultural Hall.',
    text_am:
      '📢 የህዝብ ስብሰባ: ወረዳ 2018 ዓ.ም. በጀት ገምጋሚ ስብሰባ — ሐምሌ 20 ቀን 2018 ዓ.ም. ጫቻ ባሕላዊ አዳራሽ። ሁሉም የቀበሌ አመራሮች ተጋብዘዋል።',
    text_om:
      '📢 Walgahii hawaasaa: Ilaalcha bajata aanaa 2026/27 — Hoggantoota ganda hundaa. Roobii, Waxabajjii 20, 2018 M.N. Gumii Aadaa Caccetti.',
    type: 'INFO',
    isActive: true,
    linkUrl: '/news',
    linkLabel_en: 'View Details',
    createdAt: new Date(),
  },
]
