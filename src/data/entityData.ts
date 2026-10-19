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
    name_en: 'Ato Derese Dememe',
    name_am: 'አቶ ደረሰ ደመመ',
    name_om: 'Obbo Darrasaa Dammaqqaa',
    title_en: 'Chief Administrator',
    title_am: 'ዋና አስተዳዳሪ',
    title_om: "Bulchaa Ol'aanaa Aanaa",
    bio_en:
      "The highest executive official of the Woreda's government body. He oversees the implementation of public policies, local security, budget management, and regional development programs across the district.",
    bio_am:
      'የወረዳው የመንግስት አስፈጻሚ አካል የበላይ መሪ ናቸው። በወረዳው ውስጥ የልማት ፕሮግራሞችን፣ የበጀት አስተዳደርን፣ የህዝብ ፖሊሲዎችን እና የሰላምና ጸጥታ ስራዎችን በበላይነት ይመራሉ።',
    bio_om:
      "Hoogganaa ol'aanaa qaama raawwachiisaa mootummaa aanaati. Hojiiwwan misoomaa, bulchiinsa baajataa, imaammata uummataa fi nageenya aanaa olaantummaan qindeessu.",
    phone: '+251 (0) 58 661 0100',
    email: 'chief.admin@angolela-tera.gov.et',
    photo: '/images/leadership/derese-dememe.jpg',
    displayOrder: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-2',
    name_en: 'Ato Negus Kasaye',
    name_am: 'አቶ ንጉስ ካሳዬ',
    name_om: 'Obbo Niguus Kaasaayee',
    title_en: 'Head of the Prosperity Party Office',
    title_am: 'የብልፅግና ፓርቲ ፅ/ቤት ሃላፊ',
    title_om: 'Hoogganaa Waajjira Paartii Badhaadhinaa',
    bio_en:
      'The top ruling party leader in the Woreda. He guides political strategy, party institutional builds, ideological dissemination, and acts as the liaison coordinating party policies with district governance objectives.',
    bio_am:
      'በወረዳው የገዥው ፓርቲ የበላይ መሪ ናቸው። የፖለቲካ ስትራቴጂዎችን፣ የፓርቲ መዋቅር ግንባታዎችን እና ርዕዮተ-ዓለም ስርጭቶችን የሚመሩ ሲሆን የፓርቲውን ፖሊሲዎች ከመንግስት የልማት ግቦች ጋር ያቀናጃሉ።',
    bio_om:
      'Hoogganaa ol\'aanaa paartii biyya bulchuuti. Tarsiimoo siyaasaa, ijaarsa dhaabbilee paartii qindeessuun imaammata paartichaa galmaalee misooma mootummaa waliin walsimsiisu.',
    phone: '+251 (0) 58 661 0150',
    email: 'party.head@angolela-tera.gov.et',
    photo: '/images/leadership/negus-kasaye.jpg',
    displayOrder: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-3',
    name_en: 'Ato Gossay Mamo',
    name_am: 'አቶ ጎሳዬ ማሞ',
    name_om: 'Obbo Goossaayee Maammoo',
    title_en: 'Head of the Political Sector (Prosperity Party)',
    title_am: 'የፖለቲካ ዘርፍ ኃላፊ (ብልፅግና ፓርቲ)',
    title_om: 'Hoogganaa Damee Siyaasaa (Paartii Badhaadhinaa)',
    bio_en:
      "Operates under the Party Office, directly driving local political mobilization, community alignment forums, leadership capacity building, and structural public evaluation sessions within the woreda's kebeles.",
    bio_am:
      'በፓርቲው ጽህፈት ቤት ስር በመሆን በአካባቢው የፖለቲካ ንቅናቄዎችን፣ ህዝባዊ የውይይት መድረኮችን፣ የአመራር አቅም ግንባታዎችን እና የወረዳውን ቀበሌዎች መዋቅራዊ ግምገማዎችን በኃላፊነት ያከናውናሉ።',
    bio_om:
      'Waajjira paartii jalatti soochii siyaasaa naannoo, waltajjii marii uummataa, dandeettii hoggana ijaaruu fi gamaggama gandoolee aanaa qindeessuun hojjeta.',
    phone: '+251 (0) 58 661 0152',
    email: 'political.sector@angolela-tera.gov.et',
    photo: '/images/leadership/gossay-mamo.jpg',
    displayOrder: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-4',
    name_en: 'Ato Yordanos Tekeste',
    name_am: 'አቶ ዬርዳኖስ ተከስተ',
    name_om: 'Obbo Yordaanos Takastee',
    title_en: 'Deputy Administrator & Revenues Office Head',
    title_am: 'ምክትል አስተዳዳሪ እና የገቢዎች ጽ/ቤት ሃላፊ',
    title_om: 'Itti Aanaa Bulchaa fi Hoogganaa Waajjira Galiiwwanii',
    bio_en:
      "Serves as the second-in-command for public administration while specifically directing the district's finance and revenue-collection frameworks to self-sustain local development budgets.",
    bio_am:
      'የወረዳው ሁለተኛ የመንግስት መሪ በመሆን የሚያገለግሉ ሲሆን በተለይም የአካባቢውን የልማት በጀት በራስ ለመደገፍ የገቢ አሰባሰብ እና የፋይናንስ መዋቅሮችን በበላይነት ይመራሉ::',
    bio_om:
      "Itti aanaa bulchaa aanaa ta'uun tajaajilu, keessumaa baajata misooma aanaa of danda'uuf sassaabbii galii fi maallaqaa olaantummaan hoogganu.",
    phone: '+251 (0) 58 661 0101',
    email: 'deputy.admin@angolela-tera.gov.et',
    photo: '/images/leadership/yordanos-tekeste.jpg',
    displayOrder: 4,
    status: 'PUBLISHED',
  },
]

// ============================================================
// PRIVATE BUSINESSES
// ============================================================

export const MOCK_BUSINESSES: BusinessItem[] = [
  {
    id: 'biz-jerr',
    name_en: 'JERR PLC (Integrated Food & Agro-Processing Complex)',
    name_am: 'ጄር ኃ.የተ.የ.ማ (የተቀናጀ የምግብና አግሮ-ኢንዱስትሪ ማዕከል)',
    name_om: 'JERR PLC (Wiirtuu Oomisha Nyaataa fi Qonnaa)',
    description_en:
      'A premier industrial conglomerate operating a multi-billion Birr integrated agro-industrial park in the Chacha corridor. Features high-capacity edible oil refining (fortified soya cooking oil), commercial animal feed processing, corn soy blend (CSB++) manufacturing for nutrition programs, and bulk agricultural commodity processing.',
    description_am:
      'በጫቻ ኢንዱስትሪ ኮሪደር ውስጥ የሚገኝ ግዙፍ የተቀናጀ የምግብ እና አግሮ-ፕሮሰሲንግ ማዕከል ያለው ድርጅት። ዘመናዊ የምግብ ዘይት ማጣሪያ ፋብሪካ፣ የተመጣጠነ የእንስሳት መኖ ማቀነባበሪያ፣ የCSB++ አልሚ ምግብ ምርት እና የጥራጥሬ ምርቶችን በከፍተኛ ደረጃ በማቀነባበር በመላው ሀገሪቱ ያሰራጫል።',
    description_om:
      'Dhaabbata guddaa warshaa qophii nyaataa fi qonnaa naannoo Caccetti qabu. Zayitii nyaataa, nyaata beeyladaa qulqulluu fi oomishaalee nyaata madaalawaa oomishuun beekama.',
    sector: 'AGRO_PROCESSING',
    address: 'Chacha Agro-Industrial Corridor, Angolela Tera Woreda',
    phone: '+251 (0) 11 667 4000',
    email: 'info@jerrplc.com',
    website: 'https://www.jerrplc.com',
    established: '2006',
    employeeCount: '350+',
    displayOrder: 1,
    status: 'PUBLISHED',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2026-10-16'),
  },
  {
    id: 'biz-komari',
    name_en: 'Komari Beverage PLC',
    name_am: 'ኮማሪ ቤቨሬጅ ኃ.የተ.የ.ማ',
    name_om: 'Dhaabbata Dhugaatii Komaarii PLC',
    description_en:
      'A state-of-the-art modern beverage manufacturing plant located in Cheki Kebele, Angolela Tera Woreda. Komari is the pioneer producer of "Arada", Ethiopia\'s first hard seltzer brand (ready-to-drink sparkling fruit and botanical flavored beverage), operating advanced European brewing and distillation lines.',
    description_am:
      'በአንጎሌላ ተራ ወረዳ በጨቂ ቀበሌ ውስጥ የተገነባ እጅግ ዘመናዊ የመጠጥ ማምረቻ ፋብሪካ። በኢትዮጵያ የመጀመሪያውን "አራዳ" (Arada) የተሰኘ ሃርድ ሴልትዘር (ቀለል ያለ የተፈጥሮ ፍራፍሬ ጣዕም ያለው የአልኮል መጠጥ) በዓለም አቀፍ ደረጃ በታገዘ ዘመናዊ ቴክኖሎጂ አምርቶ በማቅረብ ይታወቃል።',
    description_om:
      'Warshaa dhugaatii ammayyaa Ganda Ceqii, Aanaa Angolallaa Xaraatti argamu. Oomisha "Arada" jedhamu kan dhugaatii qabbanaawaa fi mi\'aawaa oomishuudhaan kan beekamuudha.',
    sector: 'MANUFACTURING',
    address: 'Cheki Kebele, Addis Ababa–Dessie Highway (Km 96), Angolela Tera Woreda',
    phone: '+251 (0) 11 667 8500',
    email: 'info@komaribeverage.com',
    website: 'https://www.komari.com',
    established: '2017',
    employeeCount: '250+',
    photo: {
      id: 'media-komari-logo',
      filename: 'komari-logo.png',
      storedName: 'komari-logo.png',
      mimeType: 'image/png',
      mediaType: 'IMAGE',
      sizeBytes: 26981,
      url: '/images/companies/komari-logo.png',
      createdAt: new Date('2024-02-15'),
    },
    displayOrder: 2,
    status: 'PUBLISHED',
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2026-10-16'),
  },
  {
    id: 'biz-mamokacha',
    name_en: 'Mamo Kacha PLC (Highland Dairy & Agro-Industry)',
    name_am: 'ማሞ ካቻ ኃ.የተ.የ.ማ (የደጋ ወተትና አግሮ-ኢንዱስትሪ)',
    name_om: 'Mamo Kaachaa PLC (Warshaa Aannanii fi Qonnaa)',
    description_en:
      'Honoring the legacy of visionary entrepreneur Mamo Yenberberu ("Mamo Kacha"), the enterprise operates large-scale highland dairy farming, modern cold-chain logistics, and automated processing facilities in the Chacha milk corridor. Produces premium pasteurized milk, provolone and gouda cheeses, and table butter while sourcing from hundreds of local smallholder cattle cooperatives.',
    description_am:
      'በታዋቂው ኢትዮጵያዊ የፈጠራ ሰው አቶ ማሞ ይንበርበሩ (ማሞ ካቻ) ስም የተሰየመ ድርጅት ሲሆን፣ በጫቻ የወተት ተፋሰስ ዘመናዊ የወተት ላም እርባታና ማቀነባበሪያ ፋብሪካ ያካሂዳል። ጥራት ያለው ፓስቸራይዝድ ወተት፣ አይብ፣ ቅቤ በማምረት ከአካባቢው አርሶ አደሮች ጋር በቅርበት ይሰራል::',
    description_om:
      'Dhaabbata abbaa qabeenyaa beekamaa Mamo Yamberberuu (Mamo Kaachaa) jedhamuun moggaafame. Warshaa qophii aannanii ammayyaa, itittuufi dhadhaa dhiyeessu ta\'ee, qonnaan bultoota naannoo aannaniin wajjin qindoominaan hojjeta.',
    sector: 'AGRO_PROCESSING',
    address: 'Chacha–Sheno Agricultural Corridor, Angolela Tera Woreda',
    phone: '+251 (0) 11 551 2233',
    email: 'info@mamokachaplc.com',
    website: 'https://www.mamokachaplc.com',
    established: '2012',
    employeeCount: '180+',
    photo: {
      id: 'media-mamokacha-logo',
      filename: 'mamokacha-logo.png',
      storedName: 'mamokacha-logo.png',
      mimeType: 'image/png',
      mediaType: 'IMAGE',
      sizeBytes: 285167,
      url: '/images/companies/mamokacha-logo.png',
      createdAt: new Date('2024-03-01'),
    },
    displayOrder: 3,
    status: 'PUBLISHED',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2026-10-16'),
  },
  {
    id: 'biz-viv',
    name_en: 'VIV Beverages Manufacturing S.C.',
    name_am: 'ቪአይቪ ቤቨሬጅስ ማኑፋክቸሪንግ አ.ማ',
    name_om: 'VIV Beverages Manufacturing S.C.',
    description_en:
      'An ISO-certified (ISO 9001/14001/22000) high-technology industrial distillery and beverage manufacturing share company located at Km 73 in Angolela Tera Woreda. Produces Extra Neutral Alcohol (ENA) and renowned spirit brands including Champion Dry Gin, Champion Vodka, Champion Coffee Liqueur, Cognac, Whisky, and KAT traditional grain spirit.',
    description_am:
      'በአንጎሌላ ተራ ወረዳ 73ኛ ኪ.ሜ ላይ የሚገኝ ከፍተኛ ቴክኖሎጂ የታጠቀ የአልኮል ዳይስቲለሪ እና መጠጥ ማምረቻ አክሲዮን ማህበር። በአይኤስኦ (ISO 9001/14001/22000) ደረጃ የተመሰከረለት ሲሆን፣ ኤክስትራ ኒውትራል አልኮል (ENA)፣ ሻምፒዮን ጂን፣ ቮድካ፣ ዊስኪ እና "ካት" የተሰኘውን የባህል ጥራት አልኮል ያመርታል።',
    description_om:
      'Warshaa dhugaatii alkoolii ammayyaa Aanaa Angolallaa Xaraa (Kiiloo 73) irratti argamu. Isiriipii adda addaa kanneen akka Champion Gin, Champion Vodka fi Kat jedhamaniif warshaa qulqullina ISO qabuudha.',
    sector: 'MANUFACTURING',
    address: 'Km 73 Trunk Highway, Angolela Tera Woreda',
    phone: '+251 (0) 11 668 7272',
    email: 'info@vivbeverageseth.com',
    website: 'https://www.vivbeverageseth.com',
    established: '2019',
    employeeCount: '220+',
    photo: {
      id: 'media-viv-logo',
      filename: 'viv-logo.png',
      storedName: 'viv-logo.png',
      mimeType: 'image/png',
      mediaType: 'IMAGE',
      sizeBytes: 126171,
      url: '/images/companies/viv-logo.png',
      createdAt: new Date('2024-03-20'),
    },
    displayOrder: 4,
    status: 'PUBLISHED',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2026-10-16'),
  },
  {
    id: 'biz-rorank',
    name_en: 'Rorank Business S.C. (Chacha Distillery & Bottling Plant)',
    name_am: 'ሮራንክ ቢዝነስ አ.ማ (የጫቻ ዳይስቲለሪ እና ቦትሊንግ ፋብሪካ)',
    name_om: 'Rorank Business S.C. (Warshaa Caccetti)',
    description_en:
      'One of Ethiopia\'s foremost industrial beverage manufacturers operating a multi-hectare distillery complex in the Chacha industrial sector. Renowned for market-leading brands including Super Eagle Dry Gin, Crystal Vodka, and Sofi aperitifs, generating substantial manufacturing employment and local raw material linkages.',
    description_am:
      'በጫቻ ከተማ ሰፊ ግቢ ያለውና በሀገሪቱ ቀዳሚ ከሚባሉት የአልኮል ማጣሪያና መጠጥ ማምረቻ ድርጅቶች አንዱ። እንደ ሱፐር ኢግል (Super Eagle)፣ ክሪስታል ቮድካ (Crystal) እና ሶፊ ያሉ ታዋቂ ምርቶችን በማምረት ለበርካታ የአካባቢ ወጣቶች ቋሚ የስራ እድል ፈጥሯል።',
    description_om:
      'Warshaa dhugaatii guddaa naannoo Caccetti argamu. Oomishaalee akka Super Eagle Gin fi Crystal Vodka dhiyeessuun beekama.',
    sector: 'MANUFACTURING',
    address: 'Chacha Industrial Zone, Angolela Tera Woreda',
    phone: '+251 (0) 11 663 8811',
    email: 'info@rorank.com',
    website: 'https://www.rorank.com',
    established: '2013',
    employeeCount: '300+',
    photo: {
      id: 'media-rorank-logo',
      filename: 'rorank-logo.png',
      storedName: 'rorank-logo.png',
      mimeType: 'image/png',
      mediaType: 'IMAGE',
      sizeBytes: 175704,
      url: '/images/companies/rorank-logo.png',
      createdAt: new Date('2024-04-05'),
    },
    displayOrder: 5,
    status: 'PUBLISHED',
    createdAt: new Date('2024-04-05'),
    updatedAt: new Date('2026-10-16'),
  },
  {
    id: 'biz-pharo',
    name_en: 'Pharo Integrated Agriculture & Manufacturing PLC (PIAM)',
    name_am: 'ፋሮ የተቀናጀ ግብርና እና ማኑፋክቸሪንግ ኃ.የተ.የ.ማ',
    name_om: 'Pharo Integrated Agriculture & Manufacturing PLC',
    description_en:
      'State-of-the-art commercial edible oil processing and refining facility located in the Kotu corridor of Angolela Tera Woreda. PIAM partners with regional smallholders to source locally cultivated niger seed (nug), sesame, and sunflower, driving import substitution with clean, unadulterated edible oils.',
    description_am:
      'በአንጎሌላ ተራ ወረዳ ኮቱ አካባቢ የሚገኝ ዘመናዊ የምግብ ዘይት ማምረቻ ፋብሪካ። ከአካባቢው አርሶ አደሮች ኑግ፣ ሰሊጥና የሱፍ ፍሬ በመረከብ ጥራት ያለው የምግብ ዘይት በማምረት የሀገር ውስጥ ገበያን ያሟላል።',
    description_om:
      'Warshaa zayitii nyaataa ammayyaa naannoo Ganda Kootuu, Aanaa Angolallaa Xaraatti argamu. Qonnaan bultoota naannootti fayyadamuun zayitii qulqulluu oomisha.',
    sector: 'AGRO_PROCESSING',
    address: 'Kotu Industrial Belt, Chacha, Angolela Tera Woreda',
    phone: '+251 (0) 11 662 4455',
    email: 'contact@pharo-iam.com',
    established: '2020',
    employeeCount: '140+',
    photo: {
      id: 'media-pharo-logo',
      filename: 'pharo-logo.png',
      storedName: 'pharo-logo.png',
      mimeType: 'image/png',
      mediaType: 'IMAGE',
      sizeBytes: 54138,
      url: '/images/companies/pharo-logo.png',
      createdAt: new Date('2024-04-18'),
    },
    displayOrder: 6,
    status: 'PUBLISHED',
    createdAt: new Date('2024-04-18'),
    updatedAt: new Date('2026-10-16'),
  },
  {
    id: 'biz-ruth-hirut',
    name_en: 'Rut & Hirut Dairy Production & Processing PLC',
    name_am: 'ሩት እና ሂሩት የወተት ላም እርባታና ማቀነባበሪያ ኃ.የተ.የ.ማ',
    name_om: 'Rut & Hirut Horsiisa Sa\'aa fi Warshaa Aannanii PLC',
    description_en:
      'A pioneer commercial dairy processing and cattle breeding enterprise in Chacha. Operates modern milk chilling centers, automated pasteurization, and packing lines supplying fresh milk, yogurt, and specialty highland cheeses across regional and Addis Ababa retail chains.',
    description_am:
      'በጫቻ ከተማ የተመሰረተ ቀዳሚ የወተት ላም እርባታና የወተት ምርቶች ማቀነባበሪያ ድርጅት። ዘመናዊ ማቀዝቀዣ፣ ፓስቸራይዜሽን እና ማሸጊያ ያለው ሲሆን ትኩስ ወተት፣ እርጎ እና የተለያዩ አይቦችን ለገበያ ያቀርባል።',
    description_om:
      'Dhaabbata qophii aannanii fi horsiisa sa\'a ammayyaa Caccetti argamu. Aannan qulqulluu, itittuufi ayibii gabaaf dhiyeessa.',
    sector: 'AGRO_PROCESSING',
    address: 'Chacha Town, Kebele 02, Angolela Tera Woreda',
    phone: '+251 (0) 58 661 0420',
    email: 'ruthirut.dairy@gmail.com',
    established: '2011',
    employeeCount: '95+',
    displayOrder: 7,
    status: 'PUBLISHED',
    createdAt: new Date('2024-05-02'),
    updatedAt: new Date('2026-10-16'),
  },
  {
    id: 'biz-nosa',
    name_en: 'NOSA Manufacturing PLC',
    name_am: 'ኖሳ ማኑፋክቸሪንግ ኃ.የተ.የ.ማ',
    name_om: 'NOSA Manufacturing PLC',
    description_en:
      'Specialized beverage distillation and industrial alcohol processing plant situated in Chacha, producing quality spirits including Double Dutch Vodka and food-grade industrial alcohol derivatives.',
    description_am:
      'በጫቻ ኢንዱስትሪ ዞን የሚገኝ የአልኮል ማጣሪያና መጠጥ ማምረቻ ድርጅት። ዳብል ደች ቮድካ (Double Dutch Vodka) እና ሌሎች ጥራት ያላቸው መጠጦችን በማምረት ይታወቃል።',
    description_om:
      'Warshaa dhugaatii alkoolii qulqulluu fi oomisha Double Dutch Vodka naannoo Caccetti oomishuudha.',
    sector: 'MANUFACTURING',
    address: 'Chacha Industrial Zone, Angolela Tera Woreda',
    phone: '+251 (0) 11 661 9922',
    email: 'info@nosa-manufacturing.com',
    established: '2018',
    employeeCount: '110+',
    photo: {
      id: 'media-nosa-logo',
      filename: 'nosa-logo.png',
      storedName: 'nosa-logo.png',
      mimeType: 'image/png',
      mediaType: 'IMAGE',
      sizeBytes: 23099,
      url: '/images/companies/nosa-logo.png',
      createdAt: new Date('2024-05-15'),
    },
    displayOrder: 8,
    status: 'PUBLISHED',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2026-10-16'),
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
    displayOrder: 9,
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
    id: 'partner-jerr',
    name_en: 'JERR PLC',
    name_am: 'ጄር ኃ.የተ.የ.ማ',
    name_om: 'JERR PLC',
    description_en:
      'A premier industrial conglomerate and key development partner operating an integrated agro-industrial park in the Chacha corridor. Partners with the Woreda on local farmer grain aggregation, fortified vegetable oil distribution, commercial animal feed processing, and large-scale youth employment generation.',
    description_am:
      'በጫቻ የኢንዱስትሪ ኮሪደር ውስጥ ግዙፍ የተቀናጀ የምግብና አግሮ-ኢንዱስትሪ ማዕከል ያለው ቁልፍ የልማት አጋር ድርጅት። ከወረዳው ጋር በአርሶ አደሮች የሰብል ገበያ ትስስር፣ በምግብ ዘይት አቅርቦት፣ በእንስሳት መኖና በስራ እድል ፈጠራ በስትራቴጂካዊ አጋርነት ይሰራል::',
    description_om:
      'Dhaabbata guddaa warshaa qophii nyaataa fi qonnaa naannoo Caccetti qabu. Aanaa waliin gabaa qonnaan bultootaa, dhiyeessii zayitii fi nyaata beeyladaa akkasumas carraa hojii uumuu irratti qindoominaan hojjeta.',
    partnerType: 'PRIVATE_SECTOR',
    country: 'Ethiopia',
    website: 'https://www.jerrplc.com',
    phone: '+251 (0) 11 667 4000',
    email: 'info@jerrplc.com',
    partnerSince: '2018',
    displayOrder: 1,
    status: 'PUBLISHED',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2026-10-16'),
  },
  {
    id: 'partner-komari',
    name_en: 'Komari Beverage PLC',
    name_am: 'ኮማሪ ቤቨሬጅ ኃ.የተ.የ.ማ',
    name_om: 'Dhaabbata Dhugaatii Komaarii PLC',
    description_en:
      'State-of-the-art beverage manufacturer in Cheki Kebele producing "Arada". Serves as a vital private sector development partner contributing to regional economic expansion, technical skills development for local youth, and community water and environmental stewardship programs in Angolela Tera.',
    description_am:
      'በጨቂ ቀበሌ ውስጥ ዘመናዊ "አራዳ" የተሰኘ የመጠጥ ማምረቻ ፋብሪካ ያለው ግንባር ቀደም አጋር ድርጅት። ለወረዳው የገቢ ማሳደግ፣ የወጣቶች የክህሎት ስልጠና፣ የአካባቢ ጥበቃና ማህበረሰባዊ የውሃ አቅርቦት ድጋፍ በማድረግ ቁልፍ የልማት አጋር በመሆን ይሰራል::',
    description_om:
      'Warshaa dhugaatii ammayyaa Ganda Ceqii keessatti argamu. Misooma aanaa keessatti leenjii dargaggootaa, eegumsa qabeenya bishaanii fi nageenya naannoo irratti aanaa waliin qindoominaan hojjeta.',
    partnerType: 'PRIVATE_SECTOR',
    country: 'Ethiopia',
    website: 'https://www.komari.com',
    phone: '+251 (0) 11 667 8500',
    email: 'info@komaribeverage.com',
    partnerSince: '2021',
    displayOrder: 2,
    status: 'PUBLISHED',
    logo: {
      id: 'media-komari-partner-logo',
      url: '/images/companies/komari-logo.png',
      filename: 'komari-logo.png',
      sizeBytes: 26981,
      mimeType: 'image/png',
      mediaType: 'IMAGE',
      storedName: 'komari-logo.png',
      createdAt: new Date('2024-02-15'),
    },
    createdAt: new Date('2024-02-15'),
    updatedAt: new Date('2026-10-16'),
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
