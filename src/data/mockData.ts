import type { Locale } from '@/i18n/config'

export interface OfficeDetail {
  slug: string
  name_en: string
  name_am: string
  head_en: string
  head_am: string
  headTitle_en: string
  headTitle_am: string
  phone: string
  email: string
  location_en: string
  location_am: string
  about_en: string
  about_am: string
  responsibilities_en: string[]
  responsibilities_am: string[]
  servicesProvided_en: string[]
  servicesProvided_am: string[]
}

export interface ServiceDetail {
  slug: string
  title_en: string
  title_am: string
  category_en: string
  category_am: string
  officeSlug: string
  officeName_en: string
  officeName_am: string
  processingTime_en: string
  processingTime_am: string
  cost_en: string
  cost_am: string
  description_en: string
  description_am: string
  requirements_en: string[]
  requirements_am: string[]
  steps_en: string[]
  steps_am: string[]
}

export interface NewsArticle {
  slug: string
  title_en: string
  title_am: string
  category_en: string
  category_am: string
  date_en: string
  date_am: string
  author_en: string
  author_am: string
  summary_en: string
  summary_am: string
  content_en: string[]
  content_am: string[]
  isFeatured?: boolean
}

// ============================================================================
// SECTOR OFFICES DIRECTORY (10 CORE OFFICES)
// ============================================================================
export const SECTOR_OFFICES: OfficeDetail[] = [
  {
    slug: 'agriculture',
    name_en: 'Agriculture & Rural Development Office',
    name_am: 'የግብርናና ገጠር ልማት ጽህፈት ቤት',
    head_en: 'Ato Amare Tizazu',
    head_am: 'አቶ አማረ ትዛዙ',
    headTitle_en: 'Head of Agriculture Office',
    headTitle_am: 'የግብርና ጽ/ቤት ኃላፊ',
    phone: '+251 (0) 58 661 0201',
    email: 'agriculture@angolela-tera.gov.et',
    location_en: 'Main Administrative Compound, Block B, 1st Floor, Chacha',
    location_am: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ለ፣ 1ኛ ፎቅ፣ ጫቻ',
    about_en: 'The Agriculture and Rural Development Office spearheads food security, crop yield maximization, natural resource conservation, and modern livestock breeding across the 19 rural kebeles of Angolela Tera.',
    about_am: 'የአንጎለላ ጠራ ወረዳ ግብርናና ገጠር ልማት ጽ/ቤት በ19ኙም የገጠር ቀበሌዎች የምግብ ዋስትናን ለማረጋገጥ፣ የሰብል ምርታማነትን ለማሳደግ፣ የተፈጥሮ ሀብት ጥበቃና ዘመናዊ የእንስሳት እርባታን ለማስፋፋት በግንባር ቀደምትነት ይሰራል፡',
    responsibilities_en: [
      'Facilitating seasonal distribution of certified rust-resistant wheat and barley seeds',
      'Implementing watershed development and soil erosion containment across highland slopes',
      'Providing veterinary diagnostic services, vaccine campaigns, and artificial insemination',
      'Overseeing kebele-level agricultural development agents (DAs) and farmer training centers (FTCs)',
    ],
    responsibilities_am: [
      'በሽታን የሚቋቋሙ ምርጥ የስንዴና ገብስ ዘሮችንና ማዳበሪያን በወቅቱ ለአርሶ አደሮች ማሰራጨት',
      'በደጋማ የተፋሰስ አካባቢዎች የአፈርና ውሃ ጥበቃ ስራዎችን ማስተባበርና የተራቆቱ መሬቶችን ማልማት',
      'የእንስሳት ጤና ክትትል፣ ክትባት እና የዝርያ ማሻሻያ (ሰው ሰራሽ ማዳቀል) አገልግሎት መስጠት',
      'በየቀበሌው ያሉትን የግብርና ባለሙያዎችና የገበሬ ማሰልጠኛ ማዕከላትን (FTC) በበላይነት መምራት',
    ],
    servicesProvided_en: [
      'Agricultural input allocation & voucher issuance',
      'Livestock vaccination & artificial insemination certificates',
      'Tree seedlings and agroforestry distribution',
      'Smallholder irrigation permit verification',
    ],
    servicesProvided_am: [
      'የግብርና ግብአት ድልድልና የቫውቸር አሰጣጥ',
      'የእንስሳት ክትባትና የዝርያ ማሻሻያ አገልግሎት',
      'የችግኝ ማፍላትና የደን ልማት ድጋፍ',
      'የአነስተኛ መስኖ ተጠቃሚዎች ፍቃድ ማረጋገጥ',
    ],
  },
  {
    slug: 'land-administration',
    name_en: 'Land Administration & Environmental Protection Office',
    name_am: 'የመሬት አስተዳደርና አካባቢ ጥበቃ ጽህፈት ቤት',
    head_en: 'Ato Gebreyesus H/Mariam',
    head_am: 'አቶ ገብረየሱስ ሀ/ማሪያም',
    headTitle_en: 'Head of Land Administration Office',
    headTitle_am: 'የመሬት ጽ/ቤት ኃላፊ',
    phone: '+251 (0) 58 661 0202',
    email: 'land@angolela-tera.gov.et',
    location_en: 'Main Administrative Compound, Block A, Ground Floor, Chacha',
    location_am: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ሀ፣ ምድር ቤት፣ ጫቻ',
    about_en: 'Responsible for rural cadastral survey, primary and second-level landholding book issuance (Green Book), land use zoning, dispute demarcation, and environmental compliance monitoring.',
    about_am: 'የገጠር መሬት ይዞታ ምዝገባ፣ የሁለተኛ ደረጃ ደብተር (አረንጓዴ ደብተር) አሰጣጥ፣ የመሬት አጠቃቀም ፕላን፣ የይዞታ ወሰን ማካለልና የአካባቢ ተፅዕኖ ግምገማ ያከናውናል።',
    responsibilities_en: [
      'Issuing Second-Level Landholding Certificates (SLLC)',
      'Resolving communal and boundary disputes across rural kebeles',
      'Maintaining the Woreda Cadastral Geographic Information System (GIS)',
      'Conducting Environmental Impact Assessments (EIA) for commercial investment projects',
    ],
    responsibilities_am: [
      'የሁለተኛ ደረጃ የመሬት ይዞታ ማረጋገጫ ደብተር (SLLC) ማዘጋጀትና መስጠት',
      'በቀበሌዎች መካከልና በግለሰብ ይዞታዎች የሚነሱ የወሰን አለመግባባቶችን በህግ ማስተካከል',
      'የወረዳውን የመሬት መረጃ ቋት (GIS) በዘመናዊ ቴክኖሎጂ ማደራጀትና ማዘመን',
      'ለኢንቨስትመንት ፕሮጀክቶች የአካባቢ ተፅዕኖ ግምገማ (EIA) ፍተሻ ማካሄድ',
    ],
    servicesProvided_en: [
      'Primary & secondary land book registration',
      'Landholding inheritance & transfer endorsement',
      'Boundary verification and GPS demarcation',
      'Investment plot certification',
    ],
    servicesProvided_am: [
      'የመሬት ይዞታ ምዝገባና የደብተር አሰጣጥ',
      'የይዞታ ስሪት ዝውውርና የውርስ ማረጋገጫ',
      'የወሰን ማረጋገጥና የጂፒኤስ ልኬት አገልግሎት',
      'ለኢንቨስትመንት የተዘጋጁ ይዞታዎች ማረጋገጫ',
    ],
  },
  {
    slug: 'trade-investment',
    name_en: 'Trade Office',
    name_am: 'የንግድ ጽህፈት ቤት',
    head_en: 'W/ro Fantu Kaba',
    head_am: 'ወ/ሮ ፋንቱ ካባ',
    headTitle_en: 'Head of Trade Office',
    headTitle_am: 'የንግድ ጽ/ቤት ኃላፊ',
    phone: '+251 (0) 58 661 0203',
    email: 'trade@angolela-tera.gov.et',
    location_en: 'Commerce Building, Main Highway Junction, Chacha',
    location_am: 'የንግድ ህንጻ፣ አውራ ጎዳና መገንጠያ፣ ጫቻ',
    about_en: 'Oversees domestic trade regulation, commercial licensing, consumer rights protection, cooperative union market linkages, and commodity price monitoring.',
    about_am: 'የንግድ ምዝገባና ፈቃድ አሰጣጥ፣ የገበያ መረጋጋት፣ የሸማቾች መብት ጥበቃ እና የህብረት ስራ ማህበራት የገበያ ትስስር የሚሰጥ ጽህፈት ቤት ነው።',
    responsibilities_en: [
      'Commercial business registration and annual license renewals',
      'Market price stabilization and regular consumer weight & measure inspections',
      'Promoting market linkages for grain, sheep, and dairy cooperatives',
      'Commercial licensing supervision along the Chacha trade corridor',
    ],
    responsibilities_am: [
      'የንግድ ምዝገባ፣ የንግድ ፈቃድ መስጠትና አመታዊ እድሳት ማካሄድ',
      'የገበያ ዋጋ ክትትልና የንግድ ሚዛን ትክክለኛነት ፍተሻ ማድረግ',
      'ለአርሶ አደር የህብረት ስራ ማህበራት የሰብልና የእንስሳት ገበያ ትስስር መፍጠር',
      'በጫቻ ንግድ ኮሪደር የንግድ ፈቃድ አሰጣጥና ቁጥጥር',
    ],
    servicesProvided_en: [
      'New trade license issuance & amendment',
      'Commercial competency verification',
      'Consumer complaint intake & dispute resolution',
      'Grain export & transport permits',
    ],
    servicesProvided_am: [
      'አዲስ የንግድ ፈቃድ ማውጣትና ማሻሻል',
      'የንግድ ብቃት ማረጋገጫ ምስክር ወረቀት',
      'የሸማቾች ቅሬታ ማስተናገድና እልባት መስጠት',
      'የእህል ንግድና ትራንስፖርት ፍቃድ ማረጋገጥ',
    ],
  },
  {
    slug: 'health',
    name_en: 'Health Office',
    name_am: 'የጤና ጥበቃ ጽህፈት ቤት',
    head_en: 'Ato Akeberegn Yemiru',
    head_am: 'አቶ አከበረኝ የምሩ',
    headTitle_en: 'Head of Health Office',
    headTitle_am: 'የጤና ጽ/ቤት ኃላፊ',
    phone: '+251 (0) 58 661 0204',
    email: 'health@angolela-tera.gov.et',
    location_en: 'Chacha Primary Hospital Compound, Health Administration Wing',
    location_am: 'የጫቻ የመጀመሪያ ደረጃ ሆስፒታል ቅጥር ጊቢ፣ የጤና አስተዳደር ህንጻ',
    about_en: 'Directs the public healthcare delivery network across 1 Primary Hospital, 5 Health Centers, and 19 Kebele Health Posts. Administers Community-Based Health Insurance (CBHI) covering over 85% of woreda households.',
    about_am: 'በ1 የመጀመሪያ ደረጃ ሆስፒታል፣ በ5 ጤና ጣቢያዎችና በ19 የቀበሌ ጤና ኬላዎች የሚሰጠውን የህክምና አገልግሎት ይመራል፡ ከ85% በላይ የሚሆነውን ነዋሪ በማህበረሰብ አቀፍ ጤና መድህን (CBHI) አቅፏል።',
    responsibilities_en: [
      'Overseeing primary and maternal-child health services across all health facilities',
      'Epidemic prevention, immunization campaigns, and clean water sanitation monitoring',
      'Administering the Community-Based Health Insurance (CBHI) program',
      'Ensuring pharmaceutical supply chain continuity and medical quality control',
    ],
    responsibilities_am: [
      'የእናቶችና ህጻናት ጤና ክብካቤን ጨምሮ መሰረታዊ የጤና አገልግሎቶችን ማስተባበር',
      'የወረርሽኝ መከላከል፣ የህጻናት ክትባት ዘመቻዎችን እና የአካባቢ ንጽህናን መከታተል',
      'የማህበረሰብ አቀፍ ጤና መድህን (CBHI) ምዝገባና ካርድ እድሳትን በበላይነት መምራት',
      'የመድሃኒትና የህክምና መገልገያዎች አቅርቦትን ማረጋገጥና የጥራት ቁጥጥር ማድረግ',
    ],
    servicesProvided_en: [
      'CBHI registration & renewal card issuance',
      'Outpatient & emergency medical referrals',
      'Child immunization & nutrition monitoring',
      'Private clinic & pharmacy regulatory inspection',
    ],
    servicesProvided_am: [
      'የጤና መድህን (CBHI) አባልነት ምዝገባና ካርድ እድሳት',
      'የሪፈራል ህክምና ድጋፍና ማስተባበር',
      'የህጻናት ክትባትና የስነ-ምግብ ክትትል',
      'የግል ህክምና ተቋማትና የመድሃኒት ቤቶች ፍተሻ',
    ],
  },
  {
    slug: 'education',
    name_en: 'Education Office',
    name_am: 'የትምህርት ጽህፈት ቤት',
    head_en: 'Ato Daniel Moges',
    head_am: 'አቶ ዳንኤል ሞገስ',
    headTitle_en: 'Head of Education Office',
    headTitle_am: 'የትምህርት ጽ/ቤት ኃላፊ',
    phone: '+251 (0) 58 661 0205',
    email: 'education@angolela-tera.gov.et',
    location_en: 'Education Bureau Building, High School Road, Chacha',
    location_am: 'የትምህርት መምሪያ ህንጻ፣ አጠቃላይ 2ኛ ደረጃ ት/ቤት መንገድ፣ ጫቻ',
    about_en: 'Administers 38 Primary Schools, 4 Secondary Schools, and 2 Vocational Training clusters across Angolela Tera, ensuring equitable access to quality education, teacher development, and digital learning.',
    about_am: 'በወረዳው የሚገኙ 38 የአንደኛ ደረጃ ት/ቤቶችን፣ 4 የሁለተኛ ደረጃ ት/ቤቶችንና የቴክኒክና ሙያ ማዕከላትን ይመራል፡ የትምህርት ጥራትና ፍትሃዊ ተደራሽነትን ያረጋግጣል።',
    responsibilities_en: [
      'School curriculum implementation, supervision, and annual regional exam coordination',
      'School infrastructure development, classroom construction, and digital computer lab rollouts',
      'Continuous teacher training, deployment, and performance assessment',
      'Student feeding initiatives and girl-child educational retention programs',
    ],
    responsibilities_am: [
      'የስርአተ-ትምህርት አፈጻጸም ክትትልና የክልል ፈተናዎች አስተዳደር',
      'የትምህርት ቤት መሰረተ ልማት ግንባታ፣ ተጨማሪ የመማሪያ ክፍሎችና የዲጂታል ላብ ማስፋፊያ',
      'የመምህራን ስልጠና፣ ምደባ እና የስራ አፈጻጸም ግምገማ',
      'የተማሪዎች ምገባ ድጋፍና የሴት ተማሪዎች ትምህርት ማበረታቻ ስራዎች',
    ],
    servicesProvided_en: [
      'Student transcript & educational credential authentication',
      'Inter-school student transfer clearances',
      'Private kindergarten & school licensing',
      'Teacher recruitment and certification',
    ],
    servicesProvided_am: [
      'የትምህርት ማስረጃዎችና ትራንስክሪፕት ትክክለኛነት ማረጋገጥ',
      'የተማሪዎች የትምህርት ቤት ዝውውር ፈቃድ',
      'የግል ቅድመ-መደበኛና የመጀመሪያ ደረጃ ት/ቤቶች ፈቃድ አሰጣጥ',
      'የመምህራን ቅጥርና የምስክር ወረቀት አሰጣጥ',
    ],
  },
  {
    slug: 'finance',
    name_en: 'Finance & Economic Development Office',
    name_am: 'የፋይናንስና ኢኮኖሚ ልማት ጽህፈት ቤት',
    head_en: 'Ato Anteneh Lemma',
    head_am: 'አቶ አንተነህ ለማ',
    headTitle_en: 'Head of Finance Office',
    headTitle_am: 'የገንዘብ ጽ/ቤት ኃላፊ',
    phone: '+251 (0) 58 661 0206',
    email: 'finance@angolela-tera.gov.et',
    location_en: 'Main Administrative Compound, Block A, 1st Floor, Chacha',
    location_am: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ሀ፣ 1ኛ ፎቅ፣ ጫቻ',
    about_en: 'Prepares the annual woreda capital and recurrent budget, enforces public expenditure accountability, manages local revenue collection, and coordinates socio-economic planning.',
    about_am: 'የወረዳውን ዓመታዊ የካፒታልና የመደበኛ በጀት ያዘጋጃል፣ የፋይናንስ ህግጋትና ኦዲት አፈጻጸምን ይቆጣጠራል፣ የውስጥ ገቢ አሰባሰብንና የልማት እቅድን ይመራል።',
    responsibilities_en: [
      'Comprehensive medium-term expenditure framework (MTEF) budget planning',
      'Internal audit oversight across all woreda sector offices and schools',
      'Tax revenue assessment, property tax collection, and business tax billing',
      'Public procurement management and public financial management (PFM) compliance',
    ],
    responsibilities_am: [
      'የወረዳውን መካከለኛ ዘመን የልማት በጀት ማቀድና ለምክር ቤት ማቅረብ',
      'በሁሉም የወረዳው መስሪያ ቤቶችና ት/ቤቶች ላይ የውስጥ ኦዲት ምርመራ ማካሄድ',
      'የገቢ ግብርና የአገልግሎት ክፍያዎችን በህጉ መሰረት መሰብሰብ',
      'የመንግስት ግዥና ንብረት አስተዳደር ግልጽነትን ማረጋገጥ',
    ],
    servicesProvided_en: [
      'Tax clearance certificates for businesses & contractors',
      'Government vendor procurement registration',
      'Revenue receipt reconciliation',
      'Annual financial audit summaries',
    ],
    servicesProvided_am: [
      'ከግብር ነጻ መሆንን የሚያረጋግጥ ማስረጃ (Tax Clearance)',
      'የመንግስት ግዥ አቅራቢዎች ምዝገባ',
      'የገቢ ደረሰኞች ትክክለኛነት ማረጋገጫ',
      'አመታዊ የፋይናንስ ኦዲት ሪፖርቶች',
    ],
  },
  {
    slug: 'water-energy',
    name_en: 'Water and Energy Office',
    name_am: 'የውሃና ኢነርጂ ጽህፈት ቤት',
    head_en: 'Ato Yabets Nigussie',
    head_am: 'አቶ ያቤፅ ንጉሴ',
    headTitle_en: 'Head of Water & Energy Office',
    headTitle_am: 'የውሃና ኢነርጂ ጽ/ቤት ኃላፊ',
    phone: '+251 (0) 58 661 0207',
    email: 'water@angolela-tera.gov.et',
    location_en: 'Main Administrative Compound, Block C, Ground Floor, Chacha',
    location_am: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ሐ፣ ምድር ቤት፣ ጫቻ',
    about_en: 'Expands potable clean drinking water networks, manages deep borehole installations, springs maintenance, and oversees rural electrification across the 19 kebeles.',
    about_am: 'በወረዳው ንጹህ የመጠጥ ውሃ ተደራሽነትን ማስፋፋት፣ የጥልቅ ጉድጓድና የምንጭ ማጎልበት ስራዎችን፣ የገጠር ኤሌክትሪክ ሃይል ተደራሽነትንና ታዳሽ ሃይል ቴክኖሎጂዎችን ይመራል።',
    responsibilities_en: [
      'Clean drinking water scheme construction and seasonal water quality laboratory testing',
      'Borehole rehabilitation and rural water committee governance',
      'Rural electrification coordination with Ethiopian Electric Utility (EEU)',
      'Renewable solar power deployment for remote schools and health posts',
    ],
    responsibilities_am: [
      'የንጹህ መጠጥ ውሃ ተቋማት ግንባታና ወቅታዊ የውሃ ጥራት ላቦራቶሪ ምርመራ',
      'የተበላሹ የውሃ ጉድጓዶች እድሳትና የቀበሌ የውሃ ኮሚቴዎች ድጋፍ',
      'ከኢትዮጵያ ኤሌክትሪክ አገልግሎት ጋር በመቀናጀት የገጠር መብራት ዝርጋታ',
      'ለገጠር ጤና ኬላዎችና ት/ቤቶች አማራጭ የሶላር ሃይል ማሟላት',
    ],
    servicesProvided_en: [
      'Water utility connection permits',
      'Community borehole repair requests',
      'Water potability certification',
      'Solar energy technical assistance',
    ],
    servicesProvided_am: [
      'የመጠጥ ውሃ መስመር ዝርጋታ ፈቃድ',
      'የማህበረሰብ የውሃ ተቋማት ጥገና ጥያቄ መቀበል',
      'የውሃ ንጽህና ማረጋገጫ ምስክር ወረቀት',
      'የሶላር ቴክኖሎጂ ቴክኒካል ድጋፍ',
    ],
  },
  {
    slug: 'peace-security',
    name_en: 'Peace and Security Office',
    name_am: 'የሰላምና ደህንነት ጽህፈት ቤት',
    head_en: 'Ato Adafre Mandefro',
    head_am: 'አቶ አዳፍሬ ማንደፍሮ',
    headTitle_en: 'Head of Peace & Security Office',
    headTitle_am: 'የሰላምና ደህንነት ጽ/ቤት ኃላፊ',
    phone: '+251 (0) 58 661 0208',
    email: 'security@angolela-tera.gov.et',
    location_en: 'Security Directorate Wing, Main Administrative Compound, Chacha',
    location_am: 'የሰላምና ደህንነት መምሪያ፣ ዋናው የአስተዳደር ቅጥር ጊቢ፣ ጫቻ',
    about_en: 'Ensures public tranquility, maintains law and order, coordinates kebele community policing, and secures economic corridors and public infrastructures.',
    about_am: 'የህዝብ ሰላምና ጸጥታን ማስከበር፣ የማህበረሰብ አቀፍ ፖሊስ ስራዎችን፣ የወሳኝ አውራ ጎዳናዎች ደህንነት፣ የቀበሌዎች ሰላምና የግጭት መከላከል ስራዎችን ይመራል።',
    responsibilities_en: [
      'Comprehensive district peace maintenance and crime prevention',
      'Community policing networks across all 19 rural kebeles',
      'A2 Addis-Dessie highway transit security protection',
      'Early conflict identification and community mediation councils',
    ],
    responsibilities_am: [
      'የወረዳው ሰላምና ህዝባዊ ጸጥታ ማስከበርና የወንጀል መከላከል',
      'የማህበረሰብ አቀፍ ፖሊስና የቀበሌዎች ሰላም ጥበቃ መረብ',
      'የአዲስ አበባ-ደሴ አውራ ጎዳና ኮሪደር ደህንነት መጠበቅ',
      'የቅድመ-ግጭት ማስጠንቀቂያና የባህላዊ የዕርቅ መድረኮች',
    ],
    servicesProvided_en: [
      'Police clearance certificates & incident reporting',
      'Kebele militia coordination & training',
      'Community safety forums & advisory',
      'Emergency response dispatch',
    ],
    servicesProvided_am: [
      'ከወንጀል ነጻ መሆን ማስረጃና የክስተት ሪፖርት',
      'የቀበሌ ሚሊሻ ስልጠናና ቅንጅት',
      'የማህበረሰብ ሰላም ውይይት መድረኮች',
      'የአደጋ ጊዜ ፈጣን ምላሽ ማስተባበር',
    ],
  },
]

// ============================================================================
// CITIZEN SERVICES CATALOG (8 CORE SERVICES)
// ============================================================================
export const CITIZEN_SERVICES: ServiceDetail[] = [
  {
    slug: 'civil-registration',
    title_en: 'Vital Events & Civil Status Registration',
    title_am: 'የወሳኝ ኩነት ምዝገባ (ልደት፣ ጋብቻ፣ ፍቺ፣ ሞት)',
    category_en: 'Civil Status & Identification',
    category_am: 'የዜጎች ህጋዊ ማረጋገጫ',
    officeSlug: 'women-social-affairs',
    officeName_en: 'Vital Events Registration Desk',
    officeName_am: 'የወሳኝ ኩነት ምዝገባ ጽ/ቤት',
    processingTime_en: '1–2 Working Days',
    processingTime_am: '1–2 የስራ ቀናት',
    cost_en: '50 ETB (Government stamp fee; free within 90 days of birth)',
    cost_am: '50 ብር (የቴምብር ክፍያ፤ በ90 ቀናት ውስጥ ለተወለዱ ነጻ)',
    description_en: 'Legal registration and issuance of official authenticated certificates for births, marriages, divorces, and deaths for residents of Angolela Tera Woreda, in accordance with federal vital event proclamation laws.',
    description_am: 'በአንጎለላ ጠራ ወረዳ ነዋሪ ለሆኑ ዜጎች በኢትዮጵያ የፌዴራል ወሳኝ ኩነት ምዝገባ ህግ መሰረት የልደት፣ ጋብቻ፣ ፍቺ እና የሞት ይፋዊ ህጋዊ የምስክር ወረቀት ምዝገባና አሰጣጥ።',
    requirements_en: [
      'Official Kebele Resident ID card of parents or applicant',
      'Hospital/Health Center Birth Notification (for births)',
      'Two witnesses with valid government IDs (for marriages/delayed registrations)',
      'Official Medical Death Certificate or Kebele Confirmation (for deaths)',
    ],
    requirements_am: [
      'የወላጆች ወይም የአመልካች የቀበሌ የታደሰ መታወቂያ ካርድ',
      'የህክምና ተቋም የልደት ማስታወቂያ ሰነድ (ለልደት ምዝገባ)',
      'ሁለት ህጋዊ መታወቂያ ያላቸው ምስክሮች (ለጋብቻና ለዘገዩ ምዝገባዎች)',
      'የህክምና ተቋም የሞት ማረጋገጫ ወይም የቀበሌ አስተዳደር ማረጋገጫ (ለሞት ምዝገባ)',
    ],
    steps_en: [
      'Step 1: Obtain a referral endorsement from your respective Kebele Administration',
      'Step 2: Submit the completed vital event form with supporting documents at the Central Desk in Chacha',
      'Step 3: Verification of records in the National Civil Registry Database',
      'Step 4: Receive laminated official certificate bearing official seal and QR security verification',
    ],
    steps_am: [
      'ደረጃ 1፡ በነዋሪነት ከሚገኙበት ቀበሌ አስተዳደር የማረጋገጫ ደብዳቤ መያዝ',
      'ደረጃ 2፡ የተሞላውን ማመልከቻ ሰነድ በጫቻ ማዕከላዊ የወሳኝ ኩነት መስኮት ማቅረብ',
      'ደረጃ 3፡ በብሔራዊ የወሳኝ ኩነት መረጃ ቋት ላይ ትክክለኛነቱ ሲረጋገጥ ማጽደቅ',
      'ደረጃ 4፡ ማህተም የተደረገበትንና የQR ኮድ ጥበቃ ያለውን ይፋዊ የምስክር ወረቀት መረከብ',
    ],
  },
  {
    slug: 'land-certificate',
    title_en: 'Rural Land Holding Registration & Transfer',
    title_am: 'የገጠር መሬት ይዞታ ምዝገባ፣ ደብተርና ዝውውር',
    category_en: 'Land & Property Rights',
    category_am: 'የመሬትና ንብረት መብት',
    officeSlug: 'land-administration',
    officeName_en: 'Land Administration & Environmental Protection Office',
    officeName_am: 'የመሬት አስተዳደርና አካባቢ ጥበቃ ጽ/ቤት',
    processingTime_en: '3–5 Working Days',
    processingTime_am: '3–5 የስራ ቀናት',
    cost_en: '100 ETB (Certificate book printing & cadastral map fee)',
    cost_am: '100 ብር (የደብተር ህትመትና የካርታ ክፍያ)',
    description_en: 'Issuance and official updating of the Second-Level Rural Landholding Certificate (Green Book) including plot boundary coordinates, family member rights, inheritance, and legal rental agreements.',
    description_am: 'የአርሶ አደር ይዞታን የሚያረጋግጥ የሁለተኛ ደረጃ የይዞታ ማረጋገጫ ደብተር (አረንጓዴ ደብተር) አሰጣጥ፣ የወሰን ቅየሳ፣ የውርስና የስሪት ዝውውር ምዝገባ።',
    requirements_en: [
      'Original primary land certificate or parcel demarcation map',
      'Kebele Land Administration Committee (KLAC) resolution minute',
      'Consent agreement signed by all legal spouses and registered household members',
      'Court decree or inheritance arbitration ruling (for estate divisions)',
    ],
    requirements_am: [
      'ዋናው የቀድሞ ይዞታ ደብተር ወይም የመሬት ልኬት ካርታ',
      'የቀበሌ የመሬት አስተዳደርና አጠቃቀም ኮሚቴ (KLAC) የውሳኔ ቃለ-ጉባዔ',
      'የባለቤቶች (የትዳር አጋሮች) እና የቤተሰብ አባላት የጋራ ስምምነት ፊርማ',
      'የፍርድ ቤት ውሳኔ ወይም የውርስ አጣሪ ሰነድ (ለውርስ ጉዳዮች)',
    ],
    steps_en: [
      'Step 1: Application submission to the Kebele Land Administration Committee',
      'Step 2: Field surveyor boundary verification using handheld GPS equipment',
      'Step 3: 30-day public notice for boundary objection clearance at the Kebele office',
      'Step 4: Formal issuance of laminated Green Certificate at the Woreda Land Bureau in Chacha',
    ],
    steps_am: [
      'ደረጃ 1፡ በቀበሌው የመሬት አስተዳደር ኮሚቴ ማመልከቻ ማቅረብ',
      'ደረጃ 2፡ የባለሙያ የመስክ ልኬት በጂፒኤስ (GPS) መከናወንና የወሰን ማረጋገጥ',
      'ደረጃ 3፡ የይገባኛል ጥያቄ አለመኖሩን ለማረጋገጥ ለ30 ቀናት የሚቆይ ይፋዊ ማስታወቂያ',
      'ደረጃ 4፡ በጫቻ የወረዳው መሬት አስተዳደር ጽ/ቤት አረንጓዴውን የይዞታ ደብተር መረከብ',
    ],
  },
  {
    slug: 'business-license',
    title_en: 'Commercial Business Registration & Trade Licensing',
    title_am: 'የንግድ ምዝገባ፣ የንግድ ፈቃድና አመታዊ እድሳት',
    category_en: 'Trade & Commerce',
    category_am: 'ንግድና ኢንቨስትመንት',
    officeSlug: 'trade-investment',
    officeName_en: 'Trade, Industry & Market Development Office',
    officeName_am: 'የንግድ፣ ኢንዱስትሪና ገበያ ልማት ጽ/ቤት',
    processingTime_en: '1 Working Day',
    processingTime_am: '1 የስራ ቀን',
    cost_en: 'Varies by sector (120 ETB – 500 ETB fixed statutory registration fee)',
    cost_am: 'እንደ ንግድ ዘርፉ ይለያያል (ከ120 ብር እስከ 500 ብር ህጋዊ ክፍያ)',
    description_en: 'Full-service commercial licensing for sole proprietorships, partnerships, and private limited companies operating in retail, grain trade, transport, manufacturing, and hospitality within Angolela Tera.',
    description_am: 'በአንጎለላ ጠራ ወረዳ ለሚሰሩ የችርቻሮ፣ የእህል ንግድ፣ የአግሮ-ፕሮሰሲንግ፣ የትራንስፖርትና የእንግዳ ተቀባይነት ንግዶች ፈቃድ መስጠትና ማደስ።',
    requirements_en: [
      'Valid Tax Identification Number (TIN) certificate',
      'Two passport-sized photographs of applicant / general manager',
      'Commercial lease agreement or proof of property ownership in Chacha/woreda',
      'Sectoral Competency Certificate (for pharmaceuticals, fuel stations, clinics)',
    ],
    requirements_am: [
      'የታክስ ከፋይ መለያ ቁጥር (TIN) ሰነድ',
      'የአመልካቹ ሁለት የቅርብ ጊዜ የፓስፖርት መጠን ፎቶግራፍ',
      'የንግድ ቦታ የኪራይ ውል ወይም የይዞታ ማረጋገጫ',
      'የሙያ ብቃት ማረጋገጫ ምስክር ወረቀት (እንደ ስራው ባህሪ)',
    ],
    steps_en: [
      'Step 1: Verify proposed trade name availability at the licensing counter',
      'Step 2: Submit application and sector compliance verification documentation',
      'Step 3: Complete payment at Commercial Bank of Ethiopia (CBE) government revenue account',
      'Step 4: Receive laminated Commercial Registration and Business License certificate',
    ],
    steps_am: [
      'ደረጃ 1፡ በንግድ ስም መዝገብ ላይ የስም ተይዞ አለመኖርን ማረጋገጥ',
      'ደረጃ 2፡ ማመልከቻውንና የብቃት ማረጋገጫ ሰነዶችን ለፈቃድ ኦፊሰሩ ማቅረብ',
      'ደረጃ 3፡ ህጋዊ የአገልግሎት ክፍያ በኢትዮጵያ ንግድ ባንክ የወረዳው ገቢ ሂሳብ መክፈል',
      'ደረጃ 4፡ የንግድ ምዝገባና የንግድ ፈቃድ ምስክር ወረቀቱን በዕለቱ መረከብ',
    ],
  },
  {
    slug: 'health-insurance',
    title_en: 'Community-Based Health Insurance (CBHI) Registration',
    title_am: 'የማህበረሰብ አቀፍ ጤና መድህን (CBHI) ምዝገባና እድሳት',
    category_en: 'Public Health & Social Safety',
    category_am: 'የህዝብ ጤናና ማህበራዊ ጥበቃ',
    officeSlug: 'health',
    officeName_en: 'Woreda Health Office & Kebele Health Posts',
    officeName_am: 'የወረዳው ጤና ጥበቃ ጽ/ቤትና የቀበሌ ጤና ኬላዎች',
    processingTime_en: 'Same Day / Immediate',
    processingTime_am: 'በዕለቱ / ወዲያውኑ',
    cost_en: '600 ETB / household / year (Indigent households 100% subsidized by woreda)',
    cost_am: '600 ብር ለአንድ አባወራ በዓመት (አቅመ ደካሞች በወረዳው በነጻ ይሸፈናሉ)',
    description_en: 'Enrollment in the regional solidarity health insurance fund ensuring family members receive free medical treatment, diagnostics, and essential pharmaceuticals across all government hospitals and health centers.',
    description_am: 'መላው የቤተሰብ አባላት በወረዳው ባሉ ጤና ጣቢያዎችና በጫቻ ሆስፒታል ነጻ የህክምና፣ የላቦራቶሪና የመድሃኒት አገልግሎት የሚያገኙበት የማህበረሰብ አቀፍ የጤና መድህን ምዝገባ።',
    requirements_en: [
      'Kebele Resident Family Roster booklet',
      'One photograph of household head and list of eligible dependents under 18',
      'Annual premium contribution receipt or Kebele indigent subsidy exemption slip',
    ],
    requirements_am: [
      'የቀበሌ የቤተሰብ አባላት መመዝገቢያ ሰነድ',
      'የአባወራው/እማወራዋ ፎቶግራፍና እድሜያቸው ከ18 ዓመት በታች የሆኑ ልጆች ዝርዝር',
      'አመታዊ የአባልነት ክፍያ ደረሰኝ ወይም የአቅመ-ደካማነት ማረጋገጫ ደብዳቤ',
    ],
    steps_en: [
      'Step 1: Register during annual renewal season with your Kebele CBHI representative',
      'Step 2: Verify registered family members and verify medical facility linkage',
      'Step 3: Receive stamped official CBHI family health booklet',
    ],
    steps_am: [
      'ደረጃ 1፡ በየቀበሌው በሚገኘው የጤና መድህን አስተባባሪ ዘንድ መመዝገብ',
      'ደረጃ 2፡ የቤተሰብ አባላትን መረጃና የአገልግሎት ማዕከል ሆስፒታልን መምረጥ',
      'ደረጃ 3፡ ማህተም የተደረገበትን የጤና መድህን ደብተር መረከብና አገልግሎት መጀመር',
    ],
  },
  {
    slug: 'agriculture',
    title_en: 'Agricultural Inputs, Certified Seed & Fertilizer Distribution',
    title_am: 'የግብርና ግብአቶች፣ ምርጥ ዘርና ማዳበሪያ አቅርቦት',
    category_en: 'Agriculture & Extension',
    category_am: 'ግብርናና ገጠር ልማት',
    officeSlug: 'agriculture',
    officeName_en: 'Agriculture & Rural Development Office & Kebele Cooperative Unions',
    officeName_am: 'የግብርናና ገጠር ልማት ጽ/ቤት እና የቀበሌ ገበሬዎች ሁለገብ ህብረት ስራ ማህበራት',
    processingTime_en: '1–2 Working Days',
    processingTime_am: '1–2 የስራ ቀናት',
    cost_en: 'Government subsidized cooperative tariff per quintal',
    cost_am: 'በመንግስት የድጎማ ተመን መሰረት በኩንታል',
    description_en: 'Official distribution of certified rust-resistant highland wheat seeds, malt barley, balanced NPS-B and Urea chemical fertilizers, agrochemicals, and improved poultry breeds across all 19 rural kebeles through primary multipurpose agricultural cooperative depots.',
    description_am: 'በአንጎለላ ጠራ ወረዳ በሁሉም 19ኙ የገጠር ቀበሌዎች ለሚገኙ አርሶ አደሮች በየቀበሌው ባሉ ሁለገብ የገበሬዎች ህብረት ስራ ማህበራት መጋዘኖች በኩል ምርጥ የስንዴና የገብስ ዘር፣ ኤን.ፒ.ኤስ-ቦሮን እና ዩሪያ ማዳበሪያ፣ የጸረ-ተባይ ኬሚካሎችና የተሻሻሉ የዶሮ ዝርያዎችን የማቅረብና የማሰራጨት ይፋዊ አገልግሎት።',
    requirements_en: [
      'Official Kebele Resident ID card',
      'Valid Rural Landholding Certificate (Green Book) confirming cultivated acreage',
      'Kebele Agriculture Development Agent (DA) input quota recommendation voucher',
      'Bank deposit receipt or union payment confirmation',
    ],
    requirements_am: [
      'የቀበሌ የታደሰ የነዋሪነት መታወቂያ ካርድ',
      'የአርሶ አደር ይዞታ ማረጋገጫ ደብተር (አረንጓዴ ደብተር)',
      'የቀበሌው የግብርና ልማት ጣቢያ ባለሙያ (DA) የግብአት ፍላጎት ማረጋገጫ ኩፖን',
      'የባንክ ወይም የህብረት ስራ ማህበሩ ህጋዊ የክፍያ ደረሰኝ',
    ],
    steps_en: [
      'Step 1: Register planned seasonal crop acreage and input requirements with your Kebele Development Agent (DA)',
      'Step 2: Verification and approval of subsidized quota based on registered farm size',
      'Step 3: Complete payment at Commercial Bank of Ethiopia (CBE) woreda revenue account or primary cooperative desk',
      'Step 4: Present bank voucher to collect certified seeds and fertilizer bags at your Kebele union depot',
    ],
    steps_am: [
      'ደረጃ 1፡ በቀበሌው የግብርና ኤክስቴንሽን ባለሙያ (DA) ዘንድ የሰብል ልማት ስፋትንና የግብአት ፍላጎትን ማስመዝገብ',
      'ደረጃ 2፡ እንደ መሬት ስፋቱ የተፈቀደውን የግብአት ኮታ ማረጋገጫ ወረቀት መውሰድ',
      'ደረጃ 3፡ በኢትዮጵያ ንግድ ባንክ ወይም በህብረት ስራ ማህበሩ መስኮት ህጋዊ ክፍያ መፈጸም',
      'ደረጃ 4፡ ደረሰኝ በማሳየት ምርጥ ዘርና ማዳበሪያውን በቀበሌው መጋዘን መረከብ',
    ],
  },
  {
    slug: 'building-permits',
    title_en: 'Construction Compliance & Building Permits',
    title_am: 'የኮንስትራክሽንና ግንባታ ፈቃድ አገልግሎት',
    category_en: 'Urban Development & Construction',
    category_am: 'ከተማ ልማትና ኮንስትራክሽን',
    officeSlug: 'urban-development',
    officeName_en: 'Urban Development & Construction Bureau',
    officeName_am: 'የከተማ ልማትና ኮንስትራክሽን ጽ/ቤት',
    processingTime_en: '5–7 Working Days',
    processingTime_am: '5–7 የስራ ቀናት',
    cost_en: 'Statutory architectural review and site inspection fee based on building category',
    cost_am: 'እንደ ህንጻው ደረጃ የሚወሰን ህጋዊ የፕላን ምርመራና የመስክ ቁጥጥር ክፍያ',
    description_en: 'Formal review, site inspection, and approval of architectural site plans, structural engineering drawings, and zoning clearances for residential, commercial, and industrial construction projects within Angolela Tera.',
    description_am: 'በአንጎለላ ጠራ ወረዳ ለሚከናወኑ የመኖሪያ፣ የንግድና የኢንዱስትሪ ግንባታዎች የሳይት ፕላን ምርመራ፣ መዋቅራዊ ኢንጂነሪንግ ማረጋገጫና ህጋዊ የግንባታ ፈቃድ አሰጣጥ።',
    requirements_en: [
      'Proof of legal land ownership or long-term lease contract',
      'Four copies of complete architectural and structural design plans signed by licensed engineers',
      'Site environmental clearance certificate (for commercial/industrial projects)',
      'Kebele construction clearance endorsement',
    ],
    requirements_am: [
      'ህጋዊ የመሬት ይዞታ ማረጋገጫ ካርታ ወይም የሊዝ ውል ሰነድ',
      'ፈቃድ ባላቸው መሃንዲሶች የተፈረመ 4 ቅጂ የስነ-ህንጻና የመዋቅር ዲዛይን ፕላን',
      'የአካባቢ ተጽእኖ ግምገማ ማረጋገጫ (ለንግድና ኢንዱስትሪ ፕሮጀክቶች)',
      'የቀበሌ አስተዳደር የግንባታ ፈቃድ ማረጋገጫ ደብዳቤ',
    ],
    steps_en: [
      'Step 1: Submit architectural design drawings and ownership documents at the municipal engineering counter',
      'Step 2: Technical review committee conducts site inspection and structural compliance check',
      'Step 3: Remit government permit fee at the revenue desk',
      'Step 4: Receive authorized construction permit certificate and approved stamped bluebook',
    ],
    steps_am: [
      'ደረጃ 1፡ የህንጻውን ዲዛይን ፕላንና የይዞታ ሰነድ ለማዘጋጃ ቤት ምህንድስና መስኮት ማቅረብ',
      'ደረጃ 2፡ የቴክኒክ ኮሚቴው የመስክ ቅኝትና የዲዛይን ተገቢነት ማረጋገጥ',
      'ደረጃ 3፡ ህጋዊ የአገልግሎት ክፍያ በገቢዎች ጽ/ቤት መፈጸም',
      'ደረጃ 4፡ ማህተም የተደረገበትን ይፋዊ የግንባታ ፈቃድ የምስክር ወረቀት መረከብ',
    ],
  },
]

// ============================================================================
// NEWS & ANNOUNCEMENTS (6 RICH ARTICLES)
// ============================================================================
export const NEWS_ARTICLES: NewsArticle[] = [
  {
    slug: 'budget-2026',
    title_en: 'Angolela Tera Woreda Council Concludes Ordinary Session; Approves Annual Capital Budget',
    title_am: 'የአንጎለላ ጠራ ወረዳ ምክር ቤት መደበኛ ጉባዔውን አጠናቀቀ፤ የዓመቱን የካፒታል በጀት አጸደቀ',
    category_en: 'Council Resolution',
    category_am: 'የምክር ቤት ውሳኔ',
    date_en: 'September 24, 2026',
    date_am: 'መስከረም 14/2019',
    author_en: 'Communication Affairs Office',
    author_am: 'የመንግሥት ኮሙኒኬሽን ጉዳዮች ጽ/ቤት',
    isFeatured: true,
    summary_en: 'The Woreda Council convened for its ordinary session in Chacha, formally ratifying the annual public expenditure plan prioritizing rural water schemes, primary road graveling, and agricultural cooperative subsidies.',
    summary_am: 'የአንጎለላ ጠራ ወረዳ ምክር ቤት በጫቻ ከተማ ባካሄደው መደበኛ ጉባዔ ለንጹህ መጠጥ ውሃ መስፋፋት፣ ለገጠር መንገዶች ጠጠር ማልበስ እና ለአርሶ አደር ማህበራት ድጋፍ ቅድሚያ የሰጠውን በጀት አጸደቀ።',
    content_en: [
      'The 6th Angolela Tera Woreda Council has concluded its high-level ordinary session following two days of constructive deliberations in the administrative hall at Chacha town.',
      'The approved budget prioritizes three major socioeconomic pillars: the expansion of deep water borehole schemes across 6 moisture-stressed kebeles, the upgrade of 45 kilometers of community feeder roads connecting farming villages to the main A2 highway, and modernization subsidies for local agricultural cooperatives.',
      'Chief Administrator of the Woreda, in his address to council members, underscored that fiscal transparency, timely project completion, and strict monitoring of public expenditure will remain the uncompromising standards of the executive cabinet.',
    ],
    content_am: [
      '6ኛው የአንጎለላ ጠራ ወረዳ ምክር ቤት በጫቻ ከተማ በሚገኘው የአስተዳደር አዳራሽ ለሁለት ቀናት ያካሄደውን መደበኛ ጉባዔ በተሳካ ሁኔታ አጠናቋል።',
      'የጸደቀው በጀት ለሶስት ዋና ዋና የልማት መስኮች ትኩረት የሰጠ ሲሆን፡ በ6 ደረቃማ አካባቢዎች የጥልቅ ውሃ ጉድጓድ ቁፋሮ፣ 45 ኪሎ ሜትር የገጠር መንገዶችን ጠጠር የማልበስ እና የአርሶ አደሩን የህብረት ስራ ማህበራት የማጠናከር ስራዎችን ያካትታል።',
      'የወረዳው ዋና አስተዳዳሪ ለምክር ቤቱ አባላት ባደረጉት ንግግር የፋይናንስ ግልጽነትን ማስፈን፣ የልማት ፕሮጀክቶችን በወቅቱ ማጠናቀቅ እና የህዝብ ሀብትን በቁጠባ መጠቀም የአስፈጻሚው አካል የማይታጠፍ አቋም መሆኑን አሳስበዋል።',
    ],
  },
  {
    slug: 'wheat-distribution',
    title_en: 'Distribution of Highland Wheat Seeds and Inputs Commences Across 19 Kebeles',
    title_am: 'በ19ኙም የገጠር ቀበሌዎች የደጋ ስንዴ ምርጥ ዘርና ማዳበሪያ ስርጭት ተጀመረ',
    category_en: 'Agriculture',
    category_am: 'ግብርና ልማት',
    date_en: 'September 18, 2026',
    date_am: 'መስከረም 8/2019',
    author_en: 'Agriculture & Rural Development Bureau',
    author_am: 'የግብርናና ገጠር ልማት ጽ/ቤት',
    isFeatured: false,
    summary_en: 'Over 14,000 quintals of certified rust-resistant wheat seed and balanced NPS-B fertilizer are being distributed to smallholder farmers ahead of the meher harvest season.',
    summary_am: 'ከ14 ሺህ ኩንታል በላይ በሽታን የሚቋቋም ምርጥ የስንዴ ዘር እና ኤን.ፒ.ኤስ-ቦሮን (NPS-B) ማዳበሪያ ለመኸር ወቅት ስራ ለአርሶ አደሮች በመሰራጨት ላይ ይገኛል።',
    content_en: [
      'The Angolela Tera Woreda Agriculture and Rural Development Office has officially launched the mass distribution of certified agricultural inputs across all kebele multipurpose union service stations.',
      'The input package focuses on the highly productive, stripe rust-resistant bread wheat varieties suitable for highland elevations above 2,600 meters, ensuring optimal grain yields even during fluctuating seasonal rain patterns.',
      'Field development agents (DAs) are actively providing localized technical demonstrations on cluster farming, balanced fertilizer application, and mechanized sowing techniques to ensure farmers achieve maximum productivity.',
    ],
    content_am: [
      'የአንጎለላ ጠራ ወረዳ ግብርናና ገጠር ልማት ጽ/ቤት በሁሉም የቀበሌ ሁለገብ የህብረት ስራ ማህበራት መጋዘኖች በኩል የግብርና ግብአቶችን ለአርሶ አደሮች የማሰራጨት ስራን ጀምሯል።',
      'ስርጭቱ ከ2,600 ሜትር በላይ ባሉ ደጋማ አካባቢዎች ከፍተኛ ምርት በሚሰጡና ቢጫ ዋግ የተባለውን የስንዴ በሽታ በሚቋቋሙ ዝርያዎች ላይ ያተኮረ ነው።',
      'በየቀበሌው ያሉ የግብርና ባለሙያዎች አርሶ አደሩ በመስመር እንዲዘራ፣ የተመጣጠነ ማዳበሪያ እንዲጠቀምና በኩታ-ገጠም አስተራረስ ምርቱን እንዲያሳድግ የተግባር ድጋፍ በመስጠት ላይ ይገኛሉ።',
    ],
  },
  {
    slug: 'chacha-industrial-park',
    title_en: 'Chacha Agro-Processing Corridor Invites Private Investment Proposals',
    title_am: 'የጫቻ አግሮ-ፕሮሰሲንግ ኮሪደር ለግል ባለሀብቶች የኢንቨስትመንት ጥሪ አቀረበ',
    category_en: 'Investment',
    category_am: 'ኢንቨስትመንት',
    date_en: 'September 12, 2026',
    date_am: 'መስከረም 2/2019',
    author_en: 'Trade & Investment Office',
    author_am: 'የንግድና ኢንቨስትመንት ጽ/ቤት',
    isFeatured: false,
    summary_en: 'The Woreda Administration has demarcated over 120 hectares of serviced industrial land adjacent to the Addis Ababa–Dessie expressway for investors in malt barley processing, dairy plants, and potato value-addition.',
    summary_am: 'የወረዳው አስተዳደር በአዲስ አበባ-ደሴ ዋና አውራ ጎዳና ዳርቻ 120 ሄክታር ምቹ የኢንቨስትመንት መሬት ለብቅል ገብስ ፋብሪካዎች፣ ለወተት ማቀነባበሪያና ለድንች እሴት ጭማሪ አልሚዎች አዘጋጅቷል።',
    content_en: [
      'Angolela Tera Woreda is rapidly positioning itself as the premier agro-industrial processing destination in the North Shewa Zone of the Amhara Region.',
      'Benefiting from direct access to the paved A2 trunk road, proximity to Debre Birhan and Addis Ababa, abundant electricity from the national grid, and plentiful high-quality spring water, the Chacha corridor offers unmatched logistical advantages.',
      'Qualified investors will enjoy expedited one-stop clearances, competitive 70-year lease terms, local raw material supply guarantees, and dedicated administrative support.',
    ],
    content_am: [
      'የአንጎለላ ጠራ ወረዳ በሰሜን ሸዋ ዞን ዋነኛ የአግሮ-ኢንዱስትሪ ማዕከል ለመሆን ሰፊ ዝግጅት እያደረገ ይገኛል።',
      'በአዲስ አበባ-ደብረ ብርሃን አስፋልት መንገድ ላይ መገኘቱ፣ የተረጋጋ የኤሌክትሪክ ሀይል፣ አስተማማኝ የተፈጥሮ ምንጭ ውሃ እና በቂ የሰው ሀይል መኖሩ ለኢንቨስትመንት ተመራጭ አድርጎታል።',
      'ወረዳው በአንድ መስኮት አገልግሎት ፈቃድ ለመስጠት፣ የ70 ዓመት የሊዝ ይዞታ ዋስትና ለመስጠት እና ከአርሶ አደሮች ጋር የጥሬ እቃ ትስስር ለመፍጠር ቁርጠኛ ነው።',
    ],
  },
]

// Backward-compatible alias exports for administrative routes and APIs
export const mockOffices = SECTOR_OFFICES
export const mockServices = CITIZEN_SERVICES
export const mockNews = NEWS_ARTICLES
