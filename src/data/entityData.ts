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
  title_en: string
  title_am: string
  bio_en: string
  bio_am: string
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
    title_en: 'Chief Administrator',
    title_am: 'ዋና አስተዳዳሪ',
    bio_en:
      "The highest executive official of the Woreda's government body. He oversees the implementation of public policies, local security, budget management, and regional development programs across the district.",
    bio_am:
      'የወረዳው የመንግስት አስፈጻሚ አካል የበላይ መሪ ናቸው። በወረዳው ውስጥ የልማት ፕሮግራሞችን፣ የበጀት አስተዳደርን፣ የህዝብ ፖሊሲዎችን እና የሰላምና ጸጥታ ስራዎችን በበላይነት ይመራሉ።',
    photo: '/images/leadership/derese-dememe.jpg',
    displayOrder: 1,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-2',
    name_en: 'Ato Yordanos Tekeste',
    name_am: 'አቶ ዮርዳኖስ ተከስተ',
    title_en: 'Deputy Administrator & Revenues Office Head',
    title_am: 'ምክትል አስተዳዳሪ እና የገቢዎች ጽ/ቤት ኃላፊ',
    bio_en:
      "Serves as the second-in-command for public administration while specifically directing the district's finance and revenue-collection frameworks to self-sustain local development budgets.",
    bio_am:
      'የወረዳው ሁለተኛ የመንግስት መሪ በመሆን የሚያገለግሉ ሲሆን በተለይም የአካባቢውን የልማት በጀት በራስ ለመደገፍ የገቢ አሰባሰብ እና የፋይናንስ መዋቅሮችን በበላይነት ይመራሉ::',
    photo: '/images/leadership/yordanos-tekeste.jpg',
    displayOrder: 2,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-3',
    name_en: 'Ato Akeberegn Yemiru',
    name_am: 'አቶ አከበረኝ የምሩ',
    title_en: 'Head of Health Office',
    title_am: 'የጤና ጽ/ቤት ኃላፊ',
    bio_en:
      'Directs the healthcare network across Chacha Primary Hospital, health centers, and kebele health posts, expanding Community-Based Health Insurance (CBHI) coverage.',
    bio_am:
      'በጫቻ የመጀመሪያ ደረጃ ሆስፒታል፣ በጤና ጣቢያዎችና በ19ኙም የቀበሌ ጤና ኬላዎች የሚሰጡትን የህክምና አገልግሎቶችና የማህበረሰብ አቀፍ ጤና መድህን (CBHI) በበላይነት ይመራሉ።',
    displayOrder: 3,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-4',
    name_en: 'Ato Daniel Mekonnen',
    name_am: 'አቶ ዳንኤል መኮንን',
    title_en: 'Head of Labor and Skills Office',
    title_am: 'የስራና ክህሎት ጽ/ቤት ኃላፊ',
    bio_en:
      'Directs youth and women employment creation, vocational skills training, enterprise incubation, and workforce placement along the Chacha economic corridor.',
    bio_am:
      'የወጣቶችና የሴቶች የስራ እድል ፈጠራን፣ የቴክኒክና ሙያ ክህሎት ስልጠናዎችን፣ የጥቃቅንና አነስተኛ ኢንተርፕራይዞች ምስረታንና በጫቻ የኢንዱስትሪ ኮሪደር የስራ ትስስርን ይመራሉ።',
    displayOrder: 4,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-5',
    name_en: 'Ato Tamiru Girma',
    name_am: 'አቶ ታምሩ ግርማ',
    title_en: 'Head of Civil Service Office',
    title_am: 'የሲቪል ሰርቪስ ጽ/ቤት ኃላፊ',
    bio_en:
      'Oversees public sector human resource management, civil service reforms, institutional ethics, and merit-based staffing across all woreda sector offices.',
    bio_am:
      'የመንግስት ሰራተኞች የሰው ሀብት አስተዳደርን፣ የሲቪል ሰርቪስ ሪፎርሞችን፣ የስነ-ምግባርና ሙያዊ ብቃትን፣ እንዲሁም በሁሉም የወረዳው ሴክተሮች ቀልጣፋ የአገልግሎት አሰጣጥ ስርአትን ይመራሉ።',
    displayOrder: 5,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-6',
    name_en: 'W/ro Fantu Kaba',
    name_am: 'ወ/ሮ ፋንቱ ካባ',
    title_en: 'Head of Trade Office',
    title_am: 'የንግድ ጽ/ቤት ኃላፊ',
    bio_en:
      'Spearheads commercial business registration, trade licensing, market price stabilization, and consumer protection across commercial centers.',
    bio_am:
      'የንግድ ምዝገባና ፈቃድ አሰጣጥን፣ ህጋዊ የንግድ ስርአትን፣ የገበያ ዋጋ መረጋጋትን፣ የሸማቾች መብት ጥበቃንና የንግድ ሚዛን ፍተሻ ስራዎችን በበላይነት ይመራሉ።',
    displayOrder: 6,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-7',
    name_en: 'Ato Amare Tizazu',
    name_am: 'አቶ አማረ ትዛዙ',
    title_en: 'Head of Agriculture Office',
    title_am: 'የግብርና ጽ/ቤት ኃላፊ',
    bio_en:
      'Leads agricultural transformation across all 19 rural kebeles, promoting certified wheat and malt barley cluster production and watershed conservation.',
    bio_am:
      'በ19ኙም የገጠር ቀበሌዎች የግብርና ምርታማነትን ማሳደግ፣ የስንዴና የገብስ ክላስተር እርሻን ማስፋፋት፣ የተፋሰስ የአፈርና ውሃ ሀብት ጥበቃንና የአርሶ አደር ማሰልጠኛ ማዕከላትን ይመራሉ።',
    displayOrder: 7,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-8',
    name_en: 'Ato Mulugeta Fikre',
    name_am: 'አቶ ሙሉጌታ ፍቅሬ',
    title_en: 'Head of Investment Office',
    title_am: 'የኢንቨስትመንት ጽ/ቤት ኃላፊ',
    bio_en:
      'Champions industrial and agro-processing investments along the Addis Ababa–Dessie economic artery, facilitating industrial land and one-stop support.',
    bio_am:
      'በአዲስ አበባ-ደሴ ኮሪደር የኢንቨስትመንት መስህቦችን ማስተዋወቅ፣ የአግሮ-ኢንዱስትሪና ማኑፋክቸሪንግ ፕሮጀክቶችን መደገፍ፣ የኢንቨስትመንት መሬት ማመቻቸትና የአንድ መስኮት አገልግሎትን ይመራሉ።',
    displayOrder: 8,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-9',
    name_en: 'Ato Adafre Mandefro',
    name_am: 'አቶ አዳፍሬ ማንደፍሮ',
    title_en: 'Head of Peace and Security Office',
    title_am: 'የሰላምና ደህንነት ጽ/ቤት ኃላፊ',
    bio_en:
      'Directs district peace, crime prevention, highway security along the A2 corridor, community policing apparatus, and dispute reconciliation.',
    bio_am:
      'የወረዳውን አስተማማኝ ሰላምና ጸጥታ ማስከበር፣ የማህበረሰብ አቀፍ ፖሊስ ስራዎችን፣ የወሳኝ ኮሪደሮች ደህንነት፣ የቀበሌዎች ሰላምና የግጭት መከላከል ስራዎችን ይመራሉ።',
    displayOrder: 9,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-10',
    name_en: 'Ato Gebreyesus H/Mariam',
    name_am: 'አቶ ገብረየሱስ ሀ/ማሪያም',
    title_en: 'Head of Land Administration Office',
    title_am: 'የመሬት ጽ/ቤት ኃላፊ',
    bio_en:
      'Directs rural cadastral surveys, issuance of Second-Level Landholding Certificates (Green Book), boundary dispute adjudication, and land use zoning.',
    bio_am:
      'የገጠር መሬት ይዞታ ምዝገባን፣ የሁለተኛ ደረጃ ይዞታ ደብተር (አረንጓዴ ደብተር) አሰጣጥን፣ የመሬት አጠቃቀም ፕላን፣ የይዞታ ወሰን ውዝግቦች እልባትና የአካባቢ ተፅዕኖ ግምገማን ይመራሉ።',
    displayOrder: 10,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-11',
    name_en: 'Ato Daniel Moges',
    name_am: 'አቶ ዳንኤል ሞገስ',
    title_en: 'Head of Education Office',
    title_am: 'የትምህርት ጽ/ቤት ኃላፊ',
    bio_en:
      'Administers 38 primary schools and 4 secondary schools, teacher professional development, school expansion projects, and regional exam administration.',
    bio_am:
      'በወረዳው የሚገኙ 38 የአንደኛ ደረጃ እና 4 የሁለተኛ ደረጃ ት/ቤቶችን፣ የመምህራን ስልጠናና ምደባን፣ የትምህርት ጥራት ማሻሻልንና የፈተናዎች አስተዳደርን ይመራሉ።',
    displayOrder: 11,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-12',
    name_en: 'W/ro Aynalem Demisse',
    name_am: 'ወ/ሮ አይናለም ደምሴ',
    title_en: 'Head of Planning and Development Office',
    title_am: 'የፕላን ልማት ጽ/ቤት ኃላፊ',
    bio_en:
      'Guides multi-year socio-economic development planning, statistical registries, and monitoring and evaluation of capital public works.',
    bio_am:
      'የወረዳውን ሁለንተናዊ የልማት እቅድ፣ የማህበራዊና ኢኮኖሚያዊ ስታቲስቲክስ መረጃዎች ምዝገባን፣ የመንግስት ፕሮጀክቶች ክትትልና ግምገማን ይመራሉ።',
    displayOrder: 12,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-13',
    name_en: 'Ato Yabets Nigussie',
    name_am: 'አቶ ያቤፅ ንጉሴ',
    title_en: 'Head of Water and Energy Office',
    title_am: 'የውሃና ኢነርጂ ጽ/ቤት ኃላፊ',
    bio_en:
      'Drives potable drinking water coverage, deep borehole drilling, gravity spring schemes, rural power grid expansion, and renewable energy adoption.',
    bio_am:
      'የንጹህ መጠጥ ውሃ ተደራሽነትን ማስፋፋት፣ የጥልቅ ጉድጓድና የምንጭ ማጎልበት ስራዎችን፣ የገጠር ኤሌክትሪክ ሃይል ተደራሽነትንና ታዳሽ ሃይል ቴክኖሎጂዎችን ይመራሉ።',
    displayOrder: 13,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-14',
    name_en: 'Ato Atlabachew Feleke',
    name_am: 'አቶ አጥላባቸው ፈለቀ',
    title_en: 'Head of Woreda Administration Office',
    title_am: 'የአስተዳደር ጽ/ቤት ኃላፊ',
    bio_en:
      'Coordinates cabinet executive meetings, inter-office bureaucratic workflow, administrative protocol, citizen petitions desk, and institutional logistics.',
    bio_am:
      'የወረዳውን ካቢኔ ሴክሬተሪያት ስራዎች፣ የቢሮዎች አስተዳደራዊ ቅንጅት፣ ይፋዊ ፕሮቶኮል፣ የህዝብ አቤቱታዎች አፈታትና የአስተዳደር ስራዎችን በኃላፊነት ያስተባብራሉ።',
    displayOrder: 14,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-15',
    name_en: 'Ato Fisseha Getawork',
    name_am: 'አቶ ፍስሐ ጌታወርቅ',
    title_en: 'Head of Government Communication Affairs Office',
    title_am: 'የኮሙኒኬሽን ጽ/ቤት ኃላፊ',
    bio_en:
      'Directs public information dissemination, press releases, digital portals, civic awareness campaigns, and government transparency channels.',
    bio_am:
      'የወረዳውን ይፋዊ የመንግስት መረጃዎችና ዜናዎች ስርጭት፣ የማህበራዊ ሚዲያና ዲጂታል ፖርታል ስራዎችን፣ የህዝብ ግንዛቤ ፈጠራ ዘመቻዎችንና የመንግስት ግልጽነትን ይመራሉ።',
    displayOrder: 15,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-16',
    name_en: 'Ato Wendifer Tesfaye',
    name_am: 'አቶ ወንዲፈር ተስፋዬ',
    title_en: 'Head of Livestock Resource Development Office',
    title_am: 'የእንስሳት ጽ/ቤት ኃላፊ',
    bio_en:
      'Spearheads dairy genetics upgrading, sheep breed improvements, veterinary clinical campaigns, nutritious fodder production, and poultry enterprise development.',
    bio_am:
      'የእንስሳት ዝርያ ማሻሻልን (ሰው ሰራሽ ማዳቀል)፣ የወተትና የበግ እርባታን፣ የእንስሳት ክትባት ዘመቻዎችን፣ የመኖ ልማትንና የእንስሳት ህክምና ክሊኒኮችን በበላይነት ይመራሉ።',
    displayOrder: 16,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-17',
    name_en: 'Ato Shewangizaw Metaferia',
    name_am: 'አቶ ሸዋንግዛው መታፈሪያ',
    title_en: 'Head of Culture, Tourism and Sports Office',
    title_am: 'የባህል ቱሪዝምና ስፖርት ጽ/ቤት ኃላፊ',
    bio_en:
      'Protects historical heritage sites, promotes highland ecotourism, fosters cultural values, and leads athletics and youth sports tournaments.',
    bio_am:
      'የወረዳውን ታሪካዊ ቅርሶች መጠበቅ፣ የስነ-ምህዳር ቱሪዝምን ማስፋፋት፣ የባህላዊ እሴቶች ጥበቃን፣ የማህበረሰብ አትሌቲክስና የወጣቶች ስፖርታዊ ውድድሮችን ይመራሉ።',
    displayOrder: 17,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-18',
    name_en: 'Ato Anteneh Lemma',
    name_am: 'አቶ አንተነህ ለማ',
    title_en: 'Head of Finance Office',
    title_am: 'የገንዘብ ጽ/ቤት ኃላፊ',
    bio_en:
      'Directs the preparation and administration of annual recurrent and capital budgets, public procurement integrity, and expenditure auditing compliance.',
    bio_am:
      'የወረዳውን አመታዊ የካፒታልና የመደበኛ በጀት ዝግጅት፣ የመንግስት ግዥና ንብረት አስተዳደር ግልጽነትን፣ የፋይናንስ ኦዲት ቁጥጥርንና ጥብቅ የበጀት ዲሲፕሊንን ይመራሉ።',
    displayOrder: 18,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-19',
    name_en: 'W/ro Zewdinesh Moges',
    name_am: 'ወ/ሮ ዘውድነሽ ሞገስ',
    title_en: 'Head of Urban & Infrastructure Development Office',
    title_am: 'የከተማና መሰረተ ልማት ጽ/ቤት ኃላፊ',
    bio_en:
      'Directs master plan execution for Chacha municipality, cobblestone and all-weather road infrastructure, municipal utility services, and urban sanitation.',
    bio_am:
      'የጫቻ ከተማ ማስተር ፕላን አፈጻጸምን፣ የከተማ የኮብልስቶንና የአስፋልት መንገዶች ግንባታን፣ የማዘጋጃ ቤት አገልግሎቶችንና የመሰረተ ልማት ማስፋፊያ ስራዎችን ይመራሉ።',
    displayOrder: 19,
    status: 'PUBLISHED',
  },
  {
    id: 'leader-20',
    name_en: 'Ato Waltengus Kifelew',
    name_am: 'አቶ ዋልተንጉስ ክፈለው',
    title_en: 'Head of Justice Office',
    title_am: 'የፍትሕ ጽ/ቤት ኃላፊ',
    bio_en:
      'Upholds constitutional rule of law, government legal advocacy, public prosecution, legal literacy campaigns for citizens, and inter-agency coordination.',
    bio_am:
      'የህገ-መንግስቱንና የህግ የበላይነትን ማስከበር፣ የመንግስት የህግ ድጋፍና ክስ ማቅረብ፣ የዜጎች የህግ ግንዛቤ ማሳደግና ከፖሊስና ፍርድ ቤቶች ጋር የተቀናጀ የፍትሕ ስራን ይመራሉ።',
    displayOrder: 20,
    status: 'PUBLISHED',
  },
  {
    id: 'party-1',
    name_en: 'Ato Negus Kasaye',
    name_am: 'አቶ ንጉስ ካሳዬ',
    title_en: 'Head of the Prosperity Party Office',
    title_am: 'የብልፅግና ፓርቲ ጽ/ቤት ኃላፊ',
    bio_en:
      'The top ruling party leader in the Woreda. He guides political strategy, party institutional builds, and coordinates party policies with district governance objectives.',
    bio_am:
      'በወረዳው የገዥው ፓርቲ የበላይ መሪ ናቸው። የፖለቲካ ስትራቴጂዎችን፣ የፓርቲ መዋቅር ግንባታዎችን እና ርዕዮተ-ዓለም ስርጭቶችን የሚመሩ ሲሆን የፓርቲውን ፖሊሲዎች ከመንግስት የልማት ግቦች ጋር ያቀናጃሉ።',
    photo: '/images/leadership/negus-kasaye.jpg',
    displayOrder: 21,
    status: 'PUBLISHED',
  },
  {
    id: 'party-2',
    name_en: 'Ato Gossay Mamo',
    name_am: 'አቶ ጎሳዬ ማሞ',
    title_en: 'Head of the Political Sector (Prosperity Party)',
    title_am: 'የፖለቲካ ዘርፍ ኃላፊ (ብልፅግና ፓርቲ)',
    bio_en:
      "Operates under the Party Office, directly driving local political mobilization, community alignment forums, and structural public evaluation sessions.",
    bio_am:
      'በፓርቲው ጽህፈት ቤት ስር በመሆን በአካባቢው የፖለቲካ ንቅናቄዎችን፣ ህዝባዊ የውይይት መድረኮችን፣ የአመራር አቅም ግንባታዎችን እና የወረዳውን ቀበሌዎች መዋቅራዊ ግምገማዎችን በኃላፊነት ያከናውናሉ።',
    photo: '/images/leadership/gossay-mamo.jpg',
    displayOrder: 22,
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
    description_en:
      'A premier industrial conglomerate operating a multi-billion Birr integrated agro-industrial park in the Chacha corridor. Features high-capacity edible oil refining (fortified soya cooking oil), commercial animal feed processing, corn soy blend (CSB++) manufacturing for nutrition programs, and bulk agricultural commodity processing.',
    description_am:
      'በጫቻ ኢንዱስትሪ ኮሪደር ውስጥ የሚገኝ ግዙፍ የተቀናጀ የምግብ እና አግሮ-ፕሮሰሲንግ ማዕከል ያለው ድርጅት። ዘመናዊ የምግብ ዘይት ማጣሪያ ፋብሪካ፣ የተመጣጠነ የእንስሳት መኖ ማቀነባበሪያ፣ የCSB++ አልሚ ምግብ ምርት እና የጥራጥሬ ምርቶችን በከፍተኛ ደረጃ በማቀነባበር በመላው ሀገሪቱ ያሰራጫል።',
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
    description_en:
      'A state-of-the-art modern beverage manufacturing plant located in Cheki Kebele, Angolela Tera Woreda. Komari is the pioneer producer of "Arada", Ethiopia\'s first hard seltzer brand (ready-to-drink sparkling fruit and botanical flavored beverage), operating advanced European brewing and distillation lines.',
    description_am:
      'በአንጎለላ ጠራ ወረዳ በጨቂ ቀበሌ ውስጥ የተገነባ እጅግ ዘመናዊ የመጠጥ ማምረቻ ፋብሪካ። በኢትዮጵያ የመጀመሪያውን "አራዳ" (Arada) የተሰኘ ሃርድ ሴልትዘር (ቀለል ያለ የተፈጥሮ ፍራፍሬ ጣዕም ያለው የአልኮል መጠጥ) በዓለም አቀፍ ደረጃ በታገዘ ዘመናዊ ቴክኖሎጂ አምርቶ በማቅረብ ይታወቃል።',
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
    description_en:
      'Honoring the legacy of visionary entrepreneur Mamo Yenberberu ("Mamo Kacha"), the enterprise operates large-scale highland dairy farming, modern cold-chain logistics, and automated processing facilities in the Chacha milk corridor. Produces premium pasteurized milk, provolone and gouda cheeses, and table butter while sourcing from hundreds of local smallholder cattle cooperatives.',
    description_am:
      'በታዋቂው ኢትዮጵያዊ የፈጠራ ሰው አቶ ማሞ ይንበርበሩ (ማሞ ካቻ) ስም የተሰየመ ድርጅት ሲሆን፣ በጫቻ የወተት ተፋሰስ ዘመናዊ የወተት ላም እርባታና ማቀነባበሪያ ፋብሪካ ያካሂዳል። ጥራት ያለው ፓስቸራይዝድ ወተት፣ አይብ፣ ቅቤ በማምረት ከአካባቢው አርሶ አደሮች ጋር በቅርበት ይሰራል::',
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
    description_en:
      'An ISO-certified (ISO 9001/14001/22000) high-technology industrial distillery and beverage manufacturing share company located at Km 73 in Angolela Tera Woreda. Produces Extra Neutral Alcohol (ENA) and renowned spirit brands including Champion Dry Gin, Champion Vodka, Champion Coffee Liqueur, Cognac, Whisky, and KAT traditional grain spirit.',
    description_am:
      'በአንጎለላ ጠራ ወረዳ 73ኛ ኪ.ሜ ላይ የሚገኝ ከፍተኛ ቴክኖሎጂ የታጠቀ የአልኮል ዳይስቲለሪ እና መጠጥ ማምረቻ አክሲዮን ማህበር። በአይኤስኦ (ISO 9001/14001/22000) ደረጃ የተመሰከረለት ሲሆን፣ ኤክስትራ ኒውትራል አልኮል (ENA)፣ ሻምፒዮን ጂን፣ ቮድካ፣ ዊስኪ እና "ካት" የተሰኘውን የባህል ጥራት አልኮል ያመርታል።',
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
    description_en:
      'One of Ethiopia\'s foremost industrial beverage manufacturers operating a multi-hectare distillery complex in the Chacha industrial sector. Renowned for market-leading brands including Super Eagle Dry Gin, Crystal Vodka, and Sofi aperitifs, generating substantial manufacturing employment and local raw material linkages.',
    description_am:
      'በጫቻ ከተማ ሰፊ ግቢ ያለውና በሀገሪቱ ቀዳሚ ከሚባሉት የአልኮል ማጣሪያና መጠጥ ማምረቻ ድርጅቶች አንዱ። እንደ ሱፐር ኢግል (Super Eagle)፣ ክሪስታል ቮድካ (Crystal) እና ሶፊ ያሉ ታዋቂ ምርቶችን በማምረት ለበርካታ የአካባቢ ወጣቶች ቋሚ የስራ እድል ፈጥሯል።',
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
    description_en:
      'State-of-the-art commercial edible oil processing and refining facility located in the Kotu corridor of Angolela Tera Woreda. PIAM partners with regional smallholders to source locally cultivated niger seed (nug), sesame, and sunflower, driving import substitution with clean, unadulterated edible oils.',
    description_am:
      'በአንጎለላ ጠራ ወረዳ ኮቱ አካባቢ የሚገኝ ዘመናዊ የምግብ ዘይት ማምረቻ ፋብሪካ። ከአካባቢው አርሶ አደሮች ኑግ፣ ሰሊጥና የሱፍ ፍሬ በመረከብ ጥራት ያለው የምግብ ዘይት በማምረት የሀገር ውስጥ ገበያን ያሟላል።',
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
    description_en:
      'A pioneer commercial dairy processing and cattle breeding enterprise in Chacha. Operates modern milk chilling centers, automated pasteurization, and packing lines supplying fresh milk, yogurt, and specialty highland cheeses across regional and Addis Ababa retail chains.',
    description_am:
      'በጫቻ ከተማ የተመሰረተ ቀዳሚ የወተት ላም እርባታና የወተት ምርቶች ማቀነባበሪያ ድርጅት። ዘመናዊ ማቀዝቀዣ፣ ፓስቸራይዜሽን እና ማሸጊያ ያለው ሲሆን ትኩስ ወተት፣ እርጎ እና የተለያዩ አይቦችን ለገበያ ያቀርባል።',
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
    description_en:
      'Specialized beverage distillation and industrial alcohol processing plant situated in Chacha, producing quality spirits including Double Dutch Vodka and food-grade industrial alcohol derivatives.',
    description_am:
      'በጫቻ ኢንዱስትሪ ዞን የሚገኝ የአልኮል ማጣሪያና መጠጥ ማምረቻ ድርጅት። ዳብል ደች ቮድካ (Double Dutch Vodka) እና ሌሎች ጥራት ያላቸው መጠጦችን በማምረት ይታወቃል።',
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
    description_en:
      'A traditional and organic honey producer tapping into the rich highland flora of Angolela Tera. The enterprise exports bulk and packaged Ethiopian highland honey to Addis Ababa and has recently entered international market channels.',
    description_am:
      'ወደ አዲስ አበባ ጅምላ እና ፓኬጅ ያደረገ ኢትዮጵያዊ ደጋ ማር ይልካል። ወደ ዓለም አቀፍ ገበያ ለመግባት ዝግጅቱን አጠናቋል።',
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
    description_en:
      'A premier industrial conglomerate and key development partner operating an integrated agro-industrial park in the Chacha corridor. Partners with the Woreda on local farmer grain aggregation, fortified vegetable oil distribution, commercial animal feed processing, and large-scale youth employment generation.',
    description_am:
      'በጫቻ የኢንዱስትሪ ኮሪደር ውስጥ ግዙፍ የተቀናጀ የምግብና አግሮ-ኢንዱስትሪ ማዕከል ያለው ቁልፍ የልማት አጋር ድርጅት። ከወረዳው ጋር በአርሶ አደሮች የሰብል ገበያ ትስስር፣ በምግብ ዘይት አቅርቦት፣ በእንስሳት መኖና በስራ እድል ፈጠራ በስትራቴጂካዊ አጋርነት ይሰራል::',
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
    description_en:
      'State-of-the-art beverage manufacturer in Cheki Kebele producing "Arada". Serves as a vital private sector development partner contributing to regional economic expansion, technical skills development for local youth, and community water and environmental stewardship programs in Angolela Tera.',
    description_am:
      'በጨቂ ቀበሌ ውስጥ ዘመናዊ "አራዳ" የተሰኘ የመጠጥ ማምረቻ ፋብሪካ ያለው ግንባር ቀደም አጋር ድርጅት። ለወረዳው የገቢ ማሳደግ፣ የወጣቶች የክህሎት ስልጠና፣ የአካባቢ ጥበቃና ማህበረሰባዊ የውሃ አቅርቦት ድጋፍ በማድረግ ቁልፍ የልማት አጋር በመሆን ይሰራል::',
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
    type: 'INFO',
    isActive: true,
    linkUrl: '/news',
    linkLabel_en: 'View Details',
    createdAt: new Date(),
  },
]
