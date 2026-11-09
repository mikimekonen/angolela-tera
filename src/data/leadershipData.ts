export interface LeaderData {
  id: string
  name_en: string
  name_am: string
  gender: 'M' | 'F'
  title_en: string
  title_am: string
  sector_key: string
  category_en: string
  category_am: string
  office_en: string
  office_am: string
  bio_en: string
  bio_am: string
  photo: string
  icon: string
  phone?: string
  email?: string
  portfolios_en: string[]
  portfolios_am: string[]
  displayOrder: number
  isCabinet: boolean
  sourceUrl?: string
  sourceText?: string
}

export const OFFICIAL_LEADERS: LeaderData[] = [
  // 1. Chief Administrator
  {
    id: 'leader-1',
    name_en: 'Ato Derese Dememe',
    name_am: 'አቶ ደረሰ ደመመ',
    gender: 'M',
    title_en: 'Chief Administrator',
    title_am: 'ዋና አስተዳዳሪ',
    sector_key: 'chief_admin',
    category_en: 'Executive Administration',
    category_am: 'የወረዳው ዋና አስፈጻሚ',
    office_en: 'Office of the Chief Administrator • Woreda Executive Council',
    office_am: 'የዋና አስተዳዳሪ ጽህፈት ቤት • የወረዳው ስራ አስፈጻሚ ምክር ቤት',
    bio_en:
      "The highest executive official of the Woreda's government body. He oversees the implementation of public policies, local security, budget management, and regional development programs across the district.",
    bio_am:
      'የወረዳው የመንግስት አስፈጻሚ አካል የበላይ መሪ ናቸው። በወረዳው ውስጥ የልማት ፕሮግራሞችን፣ የበጀት አስተዳደርን፣ የህዝብ ፖሊሲዎችን እና የሰላምና ጸጥታ ስራዎችን በበላይነት ይመራሉ።',
    photo: '/images/leadership/derese-dememe.jpg',
    icon: '🏛️',
    displayOrder: 1,
    isCabinet: true,
    portfolios_en: [
      'Woreda Policy Execution & Sector Oversight',
      'District Security, Peace & Rule of Law',
      'Capital Budget & Fiscal Discipline',
      'Inter-Kebele Regional Development Programs',
    ],
    portfolios_am: [
      'የህዝብ ፖሊሲዎች አፈጻጸምና የሴክተሮች ቁጥጥር',
      'የወረዳው ሰላም፣ ጸጥታና የህግ የበላይነት',
      'የካፒታል በጀትና የሀብት አስተዳደር',
      'ቀበሌ አቀፍ የልማት ፕሮግራሞች ቅንጅት',
    ],
    sourceUrl: 'https://www.facebook.com/angolelateracommu/posts/1570191888468276/',
    sourceText: 'Official Woreda Communication Desk',
  },

  // 2. Deputy Administrator & Revenues Office Head
  {
    id: 'leader-2',
    name_en: 'Ato Yordanos Tekeste',
    name_am: 'አቶ ዮርዳኖስ ተከስተ',
    gender: 'M',
    title_en: 'Deputy Administrator & Revenues Office Head',
    title_am: 'ምክትል አስተዳዳሪ እና የገቢዎች ጽ/ቤት ኃላፊ',
    sector_key: 'deputy_admin_revenues',
    category_en: 'Executive Administration & Revenues',
    category_am: 'ምክትል አስተዳደርና ገቢዎች',
    office_en: 'Office of the Deputy Administrator • Bureau of Revenues & Finance',
    office_am: 'የምክትል አስተዳዳሪ ጽህፈት ቤት • የገቢዎችና ፋይናንስ መምሪያ',
    bio_en:
      "Serves as the second-in-command for public administration while specifically directing the district's finance and revenue-collection frameworks to self-sustain local development budgets.",
    bio_am:
      'የወረዳው ሁለተኛ የመንግስት መሪ በመሆን የሚያገለግሉ ሲሆን በተለይም የአካባቢውን የልማት በጀት በራስ ለመደገፍ የገቢ አሰባሰብ እና የፋይናንስ መዋቅሮችን በበላይነት ይመራሉ::',
    photo: '/images/leadership/yordanos-tekeste.jpg',
    icon: '📊',
    displayOrder: 2,
    isCabinet: true,
    portfolios_en: [
      'Second-in-Command District Public Governance',
      'Domestic Revenue Collection & Tax Enforcement',
      'Self-Sustaining Development Budget Framework',
      'Inter-Bureau Coordination & Public Services',
    ],
    portfolios_am: [
      'የወረዳው ሁለተኛ የመንግስት አስተዳደር አመራር',
      'የውስጥ ገቢ አሰባሰብና የግብር ስርአት ማዘመን',
      'በራስ አቅም የሚደገፍ የልማት በጀት መዋቅር',
      'የቢሮዎች ቅንጅትና የአገልግሎት አሰጣጥ ቁጥጥር',
    ],
    sourceUrl: 'https://www.facebook.com/angolelateracommu/posts/1570191888468276/',
    sourceText: 'Cabinet Secretariat & Revenues Directorate',
  },

  // 3. Health Office Head
  {
    id: 'leader-3',
    name_en: 'Ato Akeberegn Yemiru',
    name_am: 'አቶ አከበረኝ የምሩ',
    gender: 'M',
    title_en: 'Head of Health Office',
    title_am: 'የጤና ጽ/ቤት ኃላፊ',
    sector_key: 'health',
    category_en: 'Social Services & Health',
    category_am: 'ማህበራዊ አገልግሎትና ጤና',
    office_en: 'Woreda Health Office',
    office_am: 'የወረዳው ጤና ጥበቃ ጽህፈት ቤት',
    bio_en:
      'Directs the healthcare network across Chacha Primary Hospital, health centers, and kebele health posts, expanding Community-Based Health Insurance (CBHI) coverage and primary healthcare access.',
    bio_am:
      'በጫቻ የመጀመሪያ ደረጃ ሆስፒታል፣ በጤና ጣቢያዎችና በ19ኙም የቀበሌ ጤና ኬላዎች የሚሰጡትን የህክምና አገልግሎቶች፣ የወረርሽኝ መከላከልና የማህበረሰብ አቀፍ ጤና መድህን (CBHI) ሽፋን በበላይነት ይመራሉ።',
    photo: '',
    icon: '🏥',
    displayOrder: 3,
    isCabinet: true,
    portfolios_en: [
      'Primary Healthcare & Maternal-Child Health Delivery',
      'Community-Based Health Insurance (CBHI) Administration',
      'Epidemic Prevention, Disease Surveillance & Hygiene',
      'Medical Supply Chain & Healthcare Quality Control',
    ],
    portfolios_am: [
      'የመጀመሪያ ደረጃ የጤና አገልግሎትና የእናቶችና ህጻናት ጤና',
      'የማህበረሰብ አቀፍ ጤና መድህን (CBHI) ምዝገባና ማስፋፋት',
      'የወረርሽኝ መከላከል፣ የበሽታዎች ቁጥጥርና የአካባቢ ጽዳት',
      'የመድሃኒትና የህክምና መገልገያዎች አቅርቦትና የጥራት ቁጥጥር',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 4. Labor and Skills Office Head
  {
    id: 'leader-4',
    name_en: 'Ato Daniel Mekonnen',
    name_am: 'አቶ ዳንኤል መኮንን',
    gender: 'M',
    title_en: 'Head of Labor and Skills Office',
    title_am: 'የስራና ክህሎት ጽ/ቤት ኃላፊ',
    sector_key: 'labor_skills',
    category_en: 'Economic Empowerment & Skills',
    category_am: 'የስራ እድል ፈጠራና ክህሎት',
    office_en: 'Woreda Labor and Skills Office',
    office_am: 'የወረዳው ስራና ክህሎት ጽህፈት ቤት',
    bio_en:
      'Directs youth and women employment creation, technical and vocational skills training, micro-enterprise incubation, and workforce linkage to manufacturing hubs along the Chacha economic corridor.',
    bio_am:
      'የወጣቶችና የሴቶች የስራ እድል ፈጠራን፣ የቴክኒክና ሙያ ክህሎት ስልጠናዎችን፣ የጥቃቅንና አነስተኛ ኢንተርፕራይዞች ምስረታንና በጫቻ የኢንዱስትሪ ኮሪደር የስራ ትስስርን ይመራሉ።',
    photo: '',
    icon: '💼',
    displayOrder: 4,
    isCabinet: true,
    portfolios_en: [
      'Youth & Women Job Creation Programs',
      'Technical & Vocational Skills Training (TVET)',
      'Micro & Small Enterprise (MSE) Incubation & Financing',
      'Industrial Corridor Workforce Linkage & Placement',
    ],
    portfolios_am: [
      'የወጣቶችና ሴቶች የስራ እድል ፈጠራ ፕሮግራሞች',
      'የቴክኒክና ሙያ ክህሎት ስልጠናዎችን ማስተባበር',
      'የጥቃቅንና አነስተኛ ኢንተርፕራይዞች ማደራጀትና ፋይናንስ ማመቻቸት',
      'የኢንዱስትሪ ኮሪደር የስራ ሃይል ትስስርና ምደባ',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 5. Civil Service Office Head
  {
    id: 'leader-5',
    name_en: 'Ato Tamiru Girma',
    name_am: 'አቶ ታምሩ ግርማ',
    gender: 'M',
    title_en: 'Head of Civil Service Office',
    title_am: 'የሲቪል ሰርቪስ ጽ/ቤት ኃላፊ',
    sector_key: 'civil_service',
    category_en: 'Public Service & Governance',
    category_am: 'የሲቪል ሰርቪስና መልካም አስተዳደር',
    office_en: 'Woreda Civil Service Office',
    office_am: 'የወረዳው ሲቪል ሰርቪስ ጽህፈት ቤት',
    bio_en:
      'Oversees civil service human resource management, public service reforms, institutional ethics, merit-based staffing, and administrative capacity building across all woreda offices.',
    bio_am:
      'የመንግስት ሰራተኞች የሰው ሀብት አስተዳደርን፣ የሲቪል ሰርቪስ ሪፎርሞችን፣ የስነ-ምግባርና ሙያዊ ብቃትን፣ እንዲሁም በሁሉም የወረዳው ሴክተሮች ቀልጣፋ የአገልግሎት አሰጣጥ ስርአትን ይመራሉ።',
    photo: '',
    icon: '👔',
    displayOrder: 5,
    isCabinet: true,
    portfolios_en: [
      'Civil Service Reform & Institutional Performance',
      'Merit-Based Human Resource Management & Placement',
      'Public Ethics, Anti-Corruption & Accountability',
      'Capacity Building for Kebele-Level Public Servants',
    ],
    portfolios_am: [
      'የሲቪል ሰርቪስ ሪፎርም እና የተቋማት የስራ አፈጻጸም',
      'በብቃት ላይ የተመሰረተ የሰው ሀብት አስተዳደርና ምደባ',
      'የስራ ስነ-ምግባር፣ የሙስና መከላከልና ተጠያቂነት',
      'የቀበሌ ደረጃ የመንግስት ሰራተኞች አቅም ግንባታ',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 6. Trade Office Head
  {
    id: 'leader-6',
    name_en: 'W/ro Fantu Kaba',
    name_am: 'ወ/ሮ ፋንቱ ካባ',
    gender: 'F',
    title_en: 'Head of Trade Office',
    title_am: 'የንግድ ጽ/ቤት ኃላፊ',
    sector_key: 'trade',
    category_en: 'Trade & Commercial Affairs',
    category_am: 'ንግድና ገበያ ልማት',
    office_en: 'Woreda Trade Office',
    office_am: 'የወረዳው ንግድ ጽህፈት ቤት',
    bio_en:
      'Spearheads commercial business registration, trade licensing, local market price stabilization, consumer rights protection, and trade inspections across rural and municipal commercial centers.',
    bio_am:
      'የንግድ ምዝገባና ፈቃድ አሰጣጥን፣ ህጋዊ የንግድ ስርአትን፣ የገበያ ዋጋ መረጋጋትን፣ የሸማቾች መብት ጥበቃንና የንግድ ሚዛን ፍተሻ ስራዎችን በበላይነት ይመራሉ።',
    photo: '',
    icon: '🛍️',
    displayOrder: 6,
    isCabinet: true,
    portfolios_en: [
      'Commercial Licensing & Annual Business Verification',
      'Market Price Monitoring & Anti-Hoarding Measures',
      'Consumer Rights Protection & Fair Competition',
      'Grain & Commodity Trade Route Inspection Desk',
    ],
    portfolios_am: [
      'የንግድ ምዝገባ፣ የፈቃድ አሰጣጥና አመታዊ እድሳት',
      'የገበያ ዋጋ ክትትልና ህገ-ወጥ የዋጋ ጭማሪ መከላከል',
      'የሸማቾች መብት ጥበቃና ፍትሃዊ ውድድር ማረጋገጥ',
      'የእህልና ምርቶች ንግድ መስመር ፍተሻና ቁጥጥር',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 7. Agriculture Office Head
  {
    id: 'leader-7',
    name_en: 'Ato Amare Tizazu',
    name_am: 'አቶ አማረ ትዛዙ',
    gender: 'M',
    title_en: 'Head of Agriculture Office',
    title_am: 'የግብርና ጽ/ቤት ኃላፊ',
    sector_key: 'agriculture',
    category_en: 'Agriculture & Rural Transformation',
    category_am: 'ግብርናና ገጠር ልማት',
    office_en: 'Woreda Agriculture Office',
    office_am: 'የወረዳው ግብርናና ገጠር ልማት ጽህፈት ቤት',
    bio_en:
      'Leads agricultural transformation across all 19 rural kebeles, promoting certified wheat and malt barley cluster production, watershed soil and water conservation, and agricultural extension services.',
    bio_am:
      'በ19ኙም የገጠር ቀበሌዎች የግብርና ምርታማነትን ማሳደግ፣ የስንዴና የገብስ ክላስተር እርሻን ማስፋፋት፣ የተፋሰስ የአፈርና ውሃ ሀብት ጥበቃንና የአርሶ አደር ማሰልጠኛ ማዕከላትን (FTC) በበላይነት ይመራሉ።',
    photo: '',
    icon: '🌾',
    displayOrder: 7,
    isCabinet: true,
    portfolios_en: [
      'Highland Crop Productivity & Certified Seed Distribution',
      'Wheat & Malt Barley Commercial Cluster Farming',
      'Watershed Soil Conservation & Terracing Programs',
      'Farmer Training Centers (FTCs) & Extension Agents',
    ],
    portfolios_am: [
      'የደጋ ሰብሎች ምርታማነትና የምርጥ ዘር አቅርቦት',
      'የስንዴና የገብስ ክላስተር እርሻ ልማት ማስፋፋት',
      'የተፋሰስ፣ የአፈርና ውሃ ሀብት ጥበቃ ስራዎች',
      'የገበሬ ማሰልጠኛ ማዕከላት (FTC) እና የልማት ጣቢያ ባለሙያዎች',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 8. Investment Office Head
  {
    id: 'leader-8',
    name_en: 'Ato Mulugeta Fikre',
    name_am: 'አቶ ሙሉጌታ ፍቅሬ',
    gender: 'M',
    title_en: 'Head of Investment Office',
    title_am: 'የኢንቨስትመንት ጽ/ቤት ኃላፊ',
    sector_key: 'investment',
    category_en: 'Investment & Economic Growth',
    category_am: 'ኢንቨስትመንትና ኢኮኖሚ ልማት',
    office_en: 'Woreda Investment Office',
    office_am: 'የወረዳው ኢንቨስትመንት ጽህፈት ቤት',
    bio_en:
      'Champions industrial and agro-processing investments along the Addis Ababa–Dessie economic artery, facilitating industrial land, incentive packaging, and one-stop investor support.',
    bio_am:
      'በአዲስ አበባ-ደሴ ኮሪደር የኢንቨስትመንት መስህቦችን ማስተዋወቅ፣ የአግሮ-ኢንዱስትሪና ማኑፋክቸሪንግ ፕሮጀክቶችን መደገፍ፣ የኢንቨስትመንት መሬት ማመቻቸትና የአንድ መስኮት አገልግሎትን ይመራሉ።',
    photo: '',
    icon: '🏗️',
    displayOrder: 8,
    isCabinet: true,
    portfolios_en: [
      'Agro-Processing & Food Manufacturing Investment Promotion',
      'Industrial Plot Allocation & Land Infrastructure Readiness',
      'One-Stop Investor Permitting & Regulatory Support',
      'Public-Private Partnerships (PPP) & Local Job Multipliers',
    ],
    portfolios_am: [
      'የአግሮ-ፕሮሰሲንግና ማኑፋክቸሪንግ ኢንቨስትመንት ማስተዋወቅ',
      'የኢንቨስትመንት መሬት ዝግጅትና የመሰረተ ልማት ማመቻቸት',
      'የአንድ መስኮት ፈጣን የፈቃድ አሰጣጥና የድጋፍ አገልግሎት',
      'የመንግስትና የግል አጋርነት እና የአካባቢ የስራ እድል ማስፋፋት',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 9. Peace and Security Office Head
  {
    id: 'leader-9',
    name_en: 'Ato Adafre Mandefro',
    name_am: 'አቶ አዳፍሬ ማንደፍሮ',
    gender: 'M',
    title_en: 'Head of Peace and Security Office',
    title_am: 'የሰላምና ደህንነት ጽ/ቤት ኃላፊ',
    sector_key: 'peace_security',
    category_en: 'Peace, Security & Rule of Law',
    category_am: 'ሰላም፣ ጸጥታና ደህንነት',
    office_en: 'Woreda Peace and Security Office',
    office_am: 'የወረዳው ሰላምና ደህንነት ጽህፈት ቤት',
    bio_en:
      'Directs district peace, crime prevention, highway security along the A2 corridor, community policing apparatus, and dispute reconciliation across all 19 kebeles.',
    bio_am:
      'የወረዳውን አስተማማኝ ሰላምና ጸጥታ ማስከበር፣ የማህበረሰብ አቀፍ ፖሊስ ስራዎችን፣ የወሳኝ ኮሪደሮች ደህንነት፣ የቀበሌዎች ሰላምና የግጭት መከላከል ስራዎችን በበላይነት ይመራሉ።',
    photo: '',
    icon: '🛡️',
    displayOrder: 9,
    isCabinet: true,
    portfolios_en: [
      'District Peace Enforcement & Crime Prevention',
      'Community Policing Networks Across 19 Kebeles',
      'Highway Corridor & Critical Infrastructure Protection',
      'Early Warning Systems & Peaceful Dispute Resolution',
    ],
    portfolios_am: [
      'የወረዳው ሰላምና ህዝባዊ ጸጥታ ማስከበር',
      'የማህበረሰብ አቀፍ ፖሊስና የቀበሌዎች ሰላም ጥበቃ መረብ',
      'የአውራ ጎዳና ኮሪደርና ስትራቴጂክ ተቋማት ደህንነት',
      'የቅድመ-ማስጠንቀቂያ ስርአትና የሰላማዊ ግጭት አፈታት',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 10. Land Administration Office Head
  {
    id: 'leader-10',
    name_en: 'Ato Gebreyesus H/Mariam',
    name_am: 'አቶ ገብረየሱስ ሀ/ማሪያም',
    gender: 'M',
    title_en: 'Head of Land Administration Office',
    title_am: 'የመሬት ጽ/ቤት ኃላፊ',
    sector_key: 'land',
    category_en: 'Land Administration & Resources',
    category_am: 'የመሬት አስተዳደርና ሀብት',
    office_en: 'Woreda Land Administration Office',
    office_am: 'የወረዳው መሬት አስተዳደርና አካባቢ ጥበቃ ጽህፈት ቤት',
    bio_en:
      'Directs rural cadastral surveys, issuance of Second-Level Landholding Certificates (Green Book), boundary dispute adjudication, land use zoning, and environmental compliance.',
    bio_am:
      'የገጠር መሬት ይዞታ ምዝገባን፣ የሁለተኛ ደረጃ ይዞታ ደብተር (አረንጓዴ ደብተር) አሰጣጥን፣ የመሬት አጠቃቀም ፕላን፣ የይዞታ ወሰን ውዝግቦች እልባትና የአካባቢ ተፅዕኖ ግምገማን ይመራሉ።',
    photo: '',
    icon: '🗺️',
    displayOrder: 10,
    isCabinet: true,
    portfolios_en: [
      'Second-Level Landholding Certificates (SLLC Green Book)',
      'Rural Cadastral GIS Mapping & GPS Boundary Survey',
      'Landholding Inheritance & Transfer Legal Clearances',
      'Environmental Impact Compliance & Agro-Zoning Controls',
    ],
    portfolios_am: [
      'የሁለተኛ ደረጃ የመሬት ይዞታ ማረጋገጫ (አረንጓዴ ደብተር) አሰጣጥ',
      'የገጠር ካዳስተር የጂአይኤስ (GIS) ካርታና የይዞታ ወሰን ማካለል',
      'የመሬት ውርስና ህጋዊ የይዞታ ዝውውር ማረጋገጥ',
      'የአካባቢ ተፅዕኖ ግምገማና የመሬት አጠቃቀም ዞኒንግ ቁጥጥር',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 11. Education Office Head
  {
    id: 'leader-11',
    name_en: 'Ato Daniel Moges',
    name_am: 'አቶ ዳንኤል ሞገስ',
    gender: 'M',
    title_en: 'Head of Education Office',
    title_am: 'የትምህርት ጽ/ቤት ኃላፊ',
    sector_key: 'education',
    category_en: 'Social Services & Education',
    category_am: 'ማህበራዊ አገልግሎትና ትምህርት',
    office_en: 'Woreda Education Office',
    office_am: 'የወረዳው ትምህርት ጽህፈት ቤት',
    bio_en:
      'Administers 38 primary schools and 4 secondary schools, teacher professional development, school expansion projects, digital learning initiatives, and regional exam administration.',
    bio_am:
      'በወረዳው የሚገኙ 38 የአንደኛ ደረጃ እና 4 የሁለተኛ ደረጃ ት/ቤቶችን፣ የመምህራን ስልጠናና ምደባን፣ የትምህርት ጥራት ማሻሻልን፣ የት/ቤት መሰረተ ልማትና የፈተናዎች አስተዳደርን በበላይነት ይመራሉ።',
    photo: '',
    icon: '🎓',
    displayOrder: 11,
    isCabinet: true,
    portfolios_en: [
      'Primary & Secondary School Educational Quality Monitoring',
      'Continuous Teacher Professional Development & Deployment',
      'School Infrastructure Construction & Digital Lab Rollouts',
      'Regional Examination Standards & Student Retention Programs',
    ],
    portfolios_am: [
      'የአንደኛና ሁለተኛ ደረጃ ት/ቤቶች የትምህርት ጥራት ቁጥጥር',
      'የመምህራን ተከታታይ ሙያዊ ማሻሻያ ስልጠናና ምደባ',
      'የትምህርት ቤት መሰረተ ልማት ግንባታና የዲጂታል ላብ ማስፋፊያ',
      'የክልል ፈተናዎች አስተዳደርና የተማሪዎች ትምህርት ማጠናቀቅ ድጋፍ',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 12. Planning and Development Office Head
  {
    id: 'leader-12',
    name_en: 'W/ro Aynalem Demisse',
    name_am: 'ወ/ሮ አይናለም ደምሴ',
    gender: 'F',
    title_en: 'Head of Planning and Development Office',
    title_am: 'የፕላን ልማት ጽ/ቤት ኃላፊ',
    sector_key: 'planning',
    category_en: 'Strategic Planning & Development',
    category_am: 'ፕላን፣ ስትራቴጂና ልማት',
    office_en: 'Woreda Planning and Development Office',
    office_am: 'የወረዳው ፕላንና ልማት ጽህፈት ቤት',
    bio_en:
      'Guides multi-year socio-economic development planning, statistical registries, monitoring and evaluation of capital public works, and alignment with regional development goals.',
    bio_am:
      'የወረዳውን ሁለንተናዊ የልማት እቅድ፣ የማህበራዊና ኢኮኖሚያዊ ስታቲስቲክስ መረጃዎች ምዝገባን፣ የመንግስት ፕሮጀክቶች ክትትልና ግምገማን እንዲሁም ስትራቴጂክ የልማት ግቦችን ይመራሉ።',
    photo: '',
    icon: '📈',
    displayOrder: 12,
    isCabinet: true,
    portfolios_en: [
      'Comprehensive Multi-Year Woreda Development Plans',
      'Capital Project Monitoring, Evaluation & Performance Auditing',
      'District Demographic & Socio-Economic Statistical Database',
      'Sustainable Development Goals (SDG) Target Localization',
    ],
    portfolios_am: [
      'የወረዳው ሁለንተናዊ የብዙ አመታት የልማት እቅድ ዝግጅት',
      'የካፒታል ፕሮጀክቶች ክትትል፣ ግምገማና የስራ አፈጻጸም ኦዲት',
      'የወረዳው ስነ-ህዝብና ማህበራዊ-ኢኮኖሚያዊ ስታቲስቲክስ መረጃ ቋት',
      'የዘላቂ ልማት ግቦች (SDG) አካባቢያዊ አፈጻጸም ክትትል',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 13. Water and Energy Office Head
  {
    id: 'leader-13',
    name_en: 'Ato Yabets Nigussie',
    name_am: 'አቶ ያቤፅ ንጉሴ',
    gender: 'M',
    title_en: 'Head of Water and Energy Office',
    title_am: 'የውሃና ኢነርጂ ጽ/ቤት ኃላፊ',
    sector_key: 'water_energy',
    category_en: 'Infrastructure & Utilities',
    category_am: 'መሰረተ ልማት፣ ውሃና ኢነርጂ',
    office_en: 'Woreda Water and Energy Office',
    office_am: 'የወረዳው ውሃና ኢነርጂ ጽህፈት ቤት',
    bio_en:
      'Drives potable drinking water coverage, deep borehole drilling, gravity spring schemes, rural power grid expansion, and renewable energy adoption across rural communities.',
    bio_am:
      'የንጹህ መጠጥ ውሃ ተደራሽነትን ማስፋፋት፣ የጥልቅ ጉድጓድና የምንጭ ማጎልበት ስራዎችን፣ የገጠር ኤሌክትሪክ ሃይል ተደራሽነትንና ታዳሽ ሃይል ቴክኖሎጂዎችን በበላይነት ይመራሉ።',
    photo: '',
    icon: '💧',
    displayOrder: 13,
    isCabinet: true,
    portfolios_en: [
      'Rural & Peri-Urban Clean Drinking Water Access Expansion',
      'Water Supply Scheme Maintenance & Safe Quality Testing',
      'Rural Electrification & Clean Power Grid Interconnection',
      'Off-Grid Renewable Solar Systems for Kebeles and Schools',
    ],
    portfolios_am: [
      'የገጠርና ከተማ አቀፍ የንጹህ መጠጥ ውሃ ተደራሽነት ማስፋፋት',
      'የውሃ ተቋማት ቀጣይነት ያለው እድሳትና የጥራት ፍተሻ',
      'የገጠር ኤሌክትሪክ መስመር ዝርጋታና የሃይል አቅርቦት',
      'አማራጭ ታዳሽ የሶላር ሃይል ለቀበሌዎችና ትምህርት ቤቶች',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 14. Woreda Administration Office Head
  {
    id: 'leader-14',
    name_en: 'Ato Atlabachew Feleke',
    name_am: 'አቶ አጥላባቸው ፈለቀ',
    gender: 'M',
    title_en: 'Head of Woreda Administration Office',
    title_am: 'የአስተዳደር ጽ/ቤት ኃላፊ',
    sector_key: 'administration',
    category_en: 'Executive Secretariat & Governance',
    category_am: 'የወረዳው አስተዳደር ጽህፈት ቤት',
    office_en: 'Office of Woreda Administration',
    office_am: 'የወረዳው አስተዳደር ጽህፈት ቤት',
    bio_en:
      'Coordinates cabinet executive meetings, inter-office bureaucratic workflow, administrative protocol, citizen petitions desk, and institutional logistical operations.',
    bio_am:
      'የወረዳውን ካቢኔ ሴክሬተሪያት ስራዎች፣ የቢሮዎች አስተዳደራዊ ቅንጅት፣ ይፋዊ ፕሮቶኮል፣ የህዝብ አቤቱታዎች አፈታትና የአስተዳደር ስራዎችን በኃላፊነት ያስተባብራሉ።',
    photo: '',
    icon: '🏛️',
    displayOrder: 14,
    isCabinet: true,
    portfolios_en: [
      'Cabinet Secretariat Operations & Executive Meetings Logistics',
      'Cross-Bureau Administrative Coordination & Official Registry',
      'Citizen Grievances & Administrative Petitions Facilitation',
      'Public Ceremony Protocol & Institutional Liaison',
    ],
    portfolios_am: [
      'የካቢኔ ሴክሬተሪያት ስራዎችና የስራ አስፈጻሚ ጉባኤዎች ቅንጅት',
      'የሴክተር ቢሮዎች አስተዳደራዊ ስራዎች ማስተባበርና ሰነዶች ቁጥጥር',
      'የህዝብ ቅሬታዎችና አስተዳደራዊ አቤቱታዎች ማስተናገጃ መስኮት',
      'የአስተዳደሩ ይፋዊ ፕሮቶኮልና ተቋማዊ ግንኙነቶች ማስተባበር',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 15. Government Communication Affairs Office Head
  {
    id: 'leader-15',
    name_en: 'Ato Fisseha Getawork',
    name_am: 'አቶ ፍስሐ ጌታወርቅ',
    gender: 'M',
    title_en: 'Head of Government Communication Affairs Office',
    title_am: 'የኮሙኒኬሽን ጽ/ቤት ኃላፊ',
    sector_key: 'communication',
    category_en: 'Information, Media & Public Relations',
    category_am: 'መረጃ፣ ሚዲያና ኮሙኒኬሽን',
    office_en: 'Woreda Government Communication Affairs Office',
    office_am: 'የወረዳው የመንግስት ኮሙኒኬሽን ጉዳዮች ጽህፈት ቤት',
    bio_en:
      'Directs public information dissemination, press releases, digital portals, civic awareness campaigns, and government transparency channels to bridge administration and residents.',
    bio_am:
      'የወረዳውን ይፋዊ የመንግስት መረጃዎችና ዜናዎች ስርጭት፣ የማህበራዊ ሚዲያና ዲጂታል ፖርታል ስራዎችን፣ የህዝብ ግንዛቤ ፈጠራ ዘመቻዎችንና የመንግስት ግልጽነትን ይመራሉ።',
    photo: '',
    icon: '📢',
    displayOrder: 15,
    isCabinet: true,
    portfolios_en: [
      'Official Woreda Press Releases & Public Declarations',
      'Digital Portal & Citizen Multilingual Information Dissemination',
      'Development Achievements Media Coverage & Broadcasts',
      'Public Access to Information & Civic Feedback Dialogues',
    ],
    portfolios_am: [
      'ይፋዊ የወረዳው መግለጫዎች፣ ዜናዎችና ጋዜጣዊ መግለጫዎች',
      'የዲጂታል ፖርታልና የብዙ ቋንቋ ህዝባዊ መረጃ ስርጭት',
      'የልማት ስኬቶች ሰነዳና የሚዲያ ሽፋን ማስተባበር',
      'የህዝብ መረጃ የማግኘት መብትና ማህበረሰባዊ የውይይት መድረኮች',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 16. Livestock Resource Development Office Head
  {
    id: 'leader-16',
    name_en: 'Ato Wendifer Tesfaye',
    name_am: 'አቶ ወንዲፈር ተስፋዬ',
    gender: 'M',
    title_en: 'Head of Livestock Resource Development Office',
    title_am: 'የእንስሳት ጽ/ቤት ኃላፊ',
    sector_key: 'livestock',
    category_en: 'Livestock & Veterinary Development',
    category_am: 'የእንስሳት ሀብትና ጤና ልማት',
    office_en: 'Woreda Livestock Resource Development Office',
    office_am: 'የወረዳው እንስሳት ሀብት ልማት ጽህፈት ቤት',
    bio_en:
      'Spearheads dairy genetics upgrading, sheep breed improvements, veterinary clinical campaigns, nutritious fodder production, and poultry enterprise development.',
    bio_am:
      'የእንስሳት ዝርያ ማሻሻልን (ሰው ሰራሽ ማዳቀል)፣ የወተትና የበግ እርባታን፣ የእንስሳት ክትባት ዘመቻዎችን፣ የመኖ ልማትንና የእንስሳት ህክምና ክሊኒኮችን በበላይነት ይመራሉ።',
    photo: '',
    icon: '🐄',
    displayOrder: 16,
    isCabinet: true,
    portfolios_en: [
      'Highland Dairy & Menz Sheep Genetic Enhancement',
      'Woreda-Wide Animal Vaccination Campaigns & Disease Containment',
      'Veterinary Clinics & Artificial Insemination (AI) Services',
      'Nutritious Fodder Cultivation & Commercial Forage Fields',
    ],
    portfolios_am: [
      'የወተት ላሞችና የደጋ በጎች ዝርያ ማሻሻያ ስራዎች',
      'የወረዳ አቀፍ የእንስሳት ክትባት ዘመቻዎችና የበሽታ መከላከል',
      'የእንስሳት ጤና ክሊኒኮችና የሰው ሰራሽ ማዳቀል (AI) አገልግሎት',
      'ዘመናዊ አልሚ የእንስሳት መኖ ልማትና የግጦሽ ማሻሻል',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 17. Culture, Tourism and Sports Office Head
  {
    id: 'leader-17',
    name_en: 'Ato Shewangizaw Metaferia',
    name_am: 'አቶ ሸዋንግዛው መታፈሪያ',
    gender: 'M',
    title_en: 'Head of Culture, Tourism and Sports Office',
    title_am: 'የባህል ቱሪዝምና ስፖርት ጽ/ቤት ኃላፊ',
    sector_key: 'culture_tourism_sports',
    category_en: 'Culture, Tourism & Sports',
    category_am: 'ባህል፣ ቱሪዝምና ስፖርት',
    office_en: 'Woreda Culture, Tourism and Sports Office',
    office_am: 'የወረዳው ባህል፣ ቱሪዝምና ስፖርት ጽህፈት ቤት',
    bio_en:
      'Protects historical heritage sites (such as King Sahle Selassie historical trails), promotes highland ecotourism, fosters cultural values, and leads athletics and youth sports tournaments.',
    bio_am:
      'የወረዳውን ታሪካዊ ቅርሶች መጠበቅ፣ የስነ-ምህዳር ቱሪዝምን ማስፋፋት፣ የባህላዊ እሴቶች ጥበቃን፣ የማህበረሰብ አትሌቲክስና የወጣቶች ስፖርታዊ ውድድሮችን በበላይነት ይመራሉ።',
    photo: '',
    icon: '🏆',
    displayOrder: 17,
    isCabinet: true,
    portfolios_en: [
      'Historical Cultural Heritage Conservation & Tourism Promotion',
      'Great Rift Escarpment Ecotourism & Scenic Trail Management',
      'Woreda Youth Athletics & Community Sports Tournaments',
      'Traditional Cultural Arts, Folklore & Values Preservation',
    ],
    portfolios_am: [
      'የታሪካዊና ባህላዊ ቅርሶች ጥበቃና የቱሪዝም መስህቦች ልማት',
      'የደጋማ አካባቢዎች ኢኮ-ቱሪዝምና የተፈጥሮ መስህብ መንገዶች',
      'የወረዳው የወጣቶች ስፖርታዊ ውድድሮችና የአትሌቲክስ ልማት',
      'የአካባቢው ባህላዊ እሴቶች፣ ኪነ-ጥበብና ወጎች ክብካቤ',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 18. Finance Office Head
  {
    id: 'leader-18',
    name_en: 'Ato Anteneh Lemma',
    name_am: 'አቶ አንተነህ ለማ',
    gender: 'M',
    title_en: 'Head of Finance Office',
    title_am: 'የገንዘብ ጽ/ቤት ኃላፊ',
    sector_key: 'finance',
    category_en: 'Public Finance & Budget Administration',
    category_am: 'የፋይናንስና በጀት አስተዳደር',
    office_en: 'Woreda Finance Office',
    office_am: 'የወረዳው ገንዘብ ጽህፈት ቤት',
    bio_en:
      'Directs the preparation and administration of annual recurrent and capital budgets, public procurement integrity, expenditure auditing compliance, and strict fiscal discipline.',
    bio_am:
      'የወረዳውን አመታዊ የካፒታልና የመደበኛ በጀት ዝግጅት፣ የመንግስት ግዥና ንብረት አስተዳደር ግልጽነትን፣ የፋይናንስ ኦዲት ቁጥጥርንና ጥብቅ የበጀት ዲሲፕሊንን ይመራሉ።',
    photo: '',
    icon: '💰',
    displayOrder: 18,
    isCabinet: true,
    portfolios_en: [
      'Comprehensive Annual Budget Formulation & Council Defense',
      'Public Procurement Oversight & Government Asset Accounting',
      'Financial Auditing, Expenditure Controls & Fiscal Compliance',
      'Budgetary Efficiency & Prudent Public Fund Management',
    ],
    portfolios_am: [
      'የወረዳው አመታዊ በጀት ዝግጅትና በምክር ቤት ማጽደቅ',
      'የመንግስት ግዥ ግልጽነትና የንብረት ሂሳብ አያያዝ ቁጥጥር',
      'የወጪ ኦዲት ምርመራና የፋይናንስ ህግጋት ተገዢነት',
      'የበጀት አጠቃቀም ቅልጥፍናና የህዝብ ሀብት ቁጥጥር',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 19. Urban & Infrastructure Development Office Head
  {
    id: 'leader-19',
    name_en: 'W/ro Zewdinesh Moges',
    name_am: 'ወ/ሮ ዘውድነሽ ሞገስ',
    gender: 'F',
    title_en: 'Head of Urban & Infrastructure Development Office',
    title_am: 'የከተማና መሰረተ ልማት ጽ/ቤት ኃላፊ',
    sector_key: 'urban_infrastructure',
    category_en: 'Urban Planning & Civil Infrastructure',
    category_am: 'የከተማና መሰረተ ልማት',
    office_en: 'Woreda Urban and Infrastructure Development Office',
    office_am: 'የወረዳው ከተማና መሰረተ ልማት ጽህፈት ቤት',
    bio_en:
      'Directs master plan execution for Chacha municipality, cobblestone and all-weather road infrastructure, municipal utility services, building permitting, and urban sanitation systems.',
    bio_am:
      'የጫቻ ከተማ ማስተር ፕላን አፈጻጸምን፣ የከተማ የኮብልስቶንና የአስፋልት መንገዶች ግንባታን፣ የማዘጋጃ ቤት አገልግሎቶችንና የመሰረተ ልማት ማስፋፊያ ስራዎችን በበላይነት ይመራሉ።',
    photo: '',
    icon: '🛣️',
    displayOrder: 19,
    isCabinet: true,
    portfolios_en: [
      'Chacha Municipal Structural Master Plan Compliance',
      'Urban Cobblestone Road Network & Drainage Construction',
      'Municipal Public Services & Urban Beautification Programs',
      'Solid Waste Management & Environmental Urban Sanitation',
    ],
    portfolios_am: [
      'የጫቻ ከተማ መዋቅራዊ ፕላን ተገዢነትና የዞኒንግ ቁጥጥር',
      'የከተማ ኮብልስቶን መንገዶችና የፍሳሽ ማስወገጃ ግንባታ',
      'የማዘጋጃ ቤት የህዝብ አገልግሎቶችና የከተማ ጽዳትና ውበት',
      'የደረቅ ቆሻሻ አወጋገድና የከተማ ንጽህና መሰረተ ልማት',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 20. Justice Office Head
  {
    id: 'leader-20',
    name_en: 'Ato Waltengus Kifelew',
    name_am: 'አቶ ዋልተንጉስ ክፈለው',
    gender: 'M',
    title_en: 'Head of Justice Office',
    title_am: 'የፍትሕ ጽ/ቤት ኃላፊ',
    sector_key: 'justice',
    category_en: 'Rule of Law & Justice Administration',
    category_am: 'የህግ የበላይነትና ፍትሕ',
    office_en: 'Woreda Justice Office',
    office_am: 'የወረዳው ፍትሕ ጽህፈት ቤት',
    bio_en:
      'Upholds constitutional rule of law, government legal advocacy, public prosecution, legal literacy campaigns for citizens, and inter-agency coordination with police and the judiciary.',
    bio_am:
      'የህገ-መንግስቱንና የህግ የበላይነትን ማስከበር፣ የመንግስት የህግ ድጋፍና ክስ ማቅረብ፣ የዜጎች የህግ ግንዛቤ ማሳደግና ከፖሊስና ፍርድ ቤቶች ጋር የተቀናጀ የፍትሕ ስራን በበላይነት ይመራሉ።',
    photo: '',
    icon: '⚖️',
    displayOrder: 20,
    isCabinet: true,
    portfolios_en: [
      'Constitutional Rule of Law & Public Prosecution',
      'Citizen Legal Rights Protection & Vulnerable Group Legal Aid',
      'Community Legal Literacy Campaigns Across Kebeles',
      'Justice Sector Integration with Local Courts & Police',
    ],
    portfolios_am: [
      'የህገ-መንግስታዊ የህግ የበላይነትና የህዝብ አቃቤ ህግ ስራዎች',
      'የዜጎች ህጋዊ መብቶች ጥበቃና ለተጋላጭ ወገኖች ነጻ የህግ ድጋፍ',
      'የማህበረሰብ የህግ ግንዛቤ ማጎልበቻ ዘመቻዎች በቀበሌዎች',
      'ከአካባቢ ፍርድ ቤቶችና ከፖሊስ ጋር የተቀናጀ የፍትሕ ስራ',
    ],
    sourceText: 'Woreda Cabinet Sector Appointments',
  },

  // 21. Prosperity Party Office Head (Party Secretariat)
  {
    id: 'party-1',
    name_en: 'Ato Negus Kasaye',
    name_am: 'አቶ ንጉስ ካሳዬ',
    gender: 'M',
    title_en: 'Head of the Prosperity Party Office',
    title_am: 'የብልፅግና ፓርቲ ጽ/ቤት ኃላፊ',
    sector_key: 'party_office',
    category_en: 'Ruling Party Secretariat Leadership',
    category_am: 'የገዥው ፓርቲ ጽህፈት ቤት የበላይ አመራር',
    office_en: 'Woreda Prosperity Party Headquarters • Central Secretariat',
    office_am: 'የአንጎለላ ጠራ ወረዳ ብልፅግና ፓርቲ ጽህፈት ቤት • ዋና ሴክሬተሪያት',
    bio_en:
      'The top ruling party leader in the Woreda. He guides political strategy, party institutional builds, ideological dissemination, and acts as the liaison coordinating party policies with district governance objectives.',
    bio_am:
      'በወረዳው የገዥው ፓርቲ የበላይ መሪ ናቸው። የፖለቲካ ስትራቴጂዎችን፣ የፓርቲ መዋቅር ግንባታዎችን እና ርዕዮተ-ዓለም ስርጭቶችን የሚመሩ ሲሆን የፓርቲውን ፖሊሲዎች ከመንግስት የልማት ግቦች ጋር ያቀናጃሉ።',
    photo: '/images/leadership/negus-kasaye.jpg',
    icon: '🏛️',
    displayOrder: 21,
    isCabinet: false,
    portfolios_en: [
      'Strategic Political Direction & Ideology',
      'Party Institutional Capacity & Cadres',
      'Government Development Policy Alignment',
      'Civic Mobilization & Public Coalition Building',
    ],
    portfolios_am: [
      'የፖለቲካ ስትራቴጂና ርዕዮተ-ዓለም አመራር',
      'የፓርቲ ተቋማዊ መዋቅርና የአመራር ግንባታ',
      'የፓርቲ ፖሊሲዎችን ከመንግስት ግቦች ጋር ማቀናጀት',
      'ህዝባዊ ቅንጅትና ማህበረሰባዊ ንቅናቄ',
    ],
    sourceUrl: 'https://www.facebook.com/angolelateracommu/photos/1578451760975622/',
    sourceText: 'Official Party Secretariat Record',
  },

  // 22. Head of the Political Sector (Party Secretariat)
  {
    id: 'party-2',
    name_en: 'Ato Gossay Mamo',
    name_am: 'አቶ ጎሳዬ ማሞ',
    gender: 'M',
    title_en: 'Head of the Political Sector (Prosperity Party)',
    title_am: 'የፖለቲካ ዘርፍ ኃላፊ (ብልፅግና ፓርቲ)',
    sector_key: 'party_political',
    category_en: 'Political Affairs & Civic Mobilization',
    category_am: 'የፖለቲካ ዘርፍና የህዝባዊ መድረኮች አመራር',
    office_en: 'Prosperity Party Political Sector Directorate • Grassroots Org',
    office_am: 'የብልፅግና ፓርቲ የፖለቲካ ዘርፍ መምሪያ • የቀበሌዎች ማስተባበሪያ',
    bio_en:
      "Operates under the Party Office, directly driving local political mobilization, community alignment forums, leadership capacity building, and structural public evaluation sessions within the woreda's kebeles.",
    bio_am:
      'በፓርቲው ጽህፈት ቤት ስር በመሆን በአካባቢው የፖለቲካ ንቅናቄዎችን፣ ህዝባዊ የውይይት መድረኮችን፣ የአመራር አቅም ግንባታዎችን እና የወረዳውን ቀበሌዎች መዋቅራዊ ግምገማዎችን በኃላፊነት ያከናውናሉ።',
    photo: '/images/leadership/gossay-mamo.jpg',
    icon: '👥',
    displayOrder: 22,
    isCabinet: false,
    portfolios_en: [
      'Grassroots Political Mobilization (19 Kebeles)',
      'Community Alignment & Town-Hall Forums',
      'Local Leadership Capacity Workshops',
      'Structural Kebele Public Evaluation Sessions',
    ],
    portfolios_am: [
      'የቀበሌዎች ህዝባዊና ፖለቲካዊ ንቅናቄ (19 ቀበሌዎች)',
      'የህዝብ ውይይትና የጋራ ስምምነት መድረኮች',
      'የአመራር አቅም ማጎልበቻ ስልጠናዎች',
      'የቀበሌዎች መዋቅራዊ አፈጻጸም ግምገማዎች',
    ],
    sourceUrl: 'https://www.facebook.com/angolelateracommu/posts/1532670228887109/',
    sourceText: 'Woreda Political Sector Report',
  },
]
