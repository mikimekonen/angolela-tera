import type { Locale } from '@/i18n/config'

export interface OfficeDetail {
  slug: string
  name_en: string
  name_am: string
  name_om: string
  head_en: string
  head_am: string
  head_om: string
  headTitle_en: string
  headTitle_am: string
  headTitle_om: string
  phone: string
  email: string
  location_en: string
  location_am: string
  location_om: string
  about_en: string
  about_am: string
  about_om: string
  responsibilities_en: string[]
  responsibilities_am: string[]
  responsibilities_om: string[]
  servicesProvided_en: string[]
  servicesProvided_am: string[]
  servicesProvided_om: string[]
}

export interface ServiceDetail {
  slug: string
  title_en: string
  title_am: string
  title_om: string
  category_en: string
  category_am: string
  category_om: string
  officeSlug: string
  officeName_en: string
  officeName_am: string
  officeName_om: string
  processingTime_en: string
  processingTime_am: string
  processingTime_om: string
  cost_en: string
  cost_am: string
  cost_om: string
  description_en: string
  description_am: string
  description_om: string
  requirements_en: string[]
  requirements_am: string[]
  requirements_om: string[]
  steps_en: string[]
  steps_am: string[]
  steps_om: string[]
}

export interface NewsArticle {
  slug: string
  title_en: string
  title_am: string
  title_om: string
  category_en: string
  category_am: string
  category_om: string
  date_en: string
  date_am: string
  date_om: string
  author_en: string
  author_am: string
  author_om: string
  summary_en: string
  summary_am: string
  summary_om: string
  content_en: string[]
  content_am: string[]
  content_om: string[]
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
    name_om: 'Waajjira Qonnaa fi Misooma Baadiyyaa',
    head_en: 'Ato Tsegaye Belay',
    head_am: 'አቶ ፀጋዬ በላይ',
    head_om: 'Obbo Tsaggaayee Balaay',
    headTitle_en: 'Head of Agriculture Office',
    headTitle_am: 'የግብርና ጽ/ቤት ኃላፊ',
    headTitle_om: 'Itti Gaafatamaa Waajjira Qonnaa',
    phone: '+251 (0) 58 661 0201',
    email: 'agriculture@angolela-tera.gov.et',
    location_en: 'Main Administrative Compound, Block B, 1st Floor, Chacha',
    location_am: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ለ፣ 1ኛ ፎቅ፣ ጫቻ',
    location_om: 'Gamoo Bulchiinsa Guddaa, Kutaa B, Magaalaa Caccetti',
    about_en: 'The Agriculture and Rural Development Office spearheads food security, crop yield maximization, natural resource conservation, and modern livestock breeding across the 19 rural kebeles of Angolela Tera.',
    about_am: 'የአንጎሌላ ተራ ወረዳ ግብርናና ገጠር ልማት ጽ/ቤት በ19ኙም የገጠር ቀበሌዎች የምግብ ዋስትናን ለማረጋገጥ፣ የሰብል ምርታማነትን ለማሳደግ፣ የተፈጥሮ ሀብት ጥበቃና ዘመናዊ የእንስሳት እርባታን ለማስፋፋት በግንባር ቀደምትነት ይሰራል፡',
    about_om: 'Waajjirri kun gandoolee baadiyyaa 19 keessatti wabii nyaataa mirkaneessuu, oomishtummaa qamadii fi garbuu dabaluu fi qabeenya uumamaa kunuunsuuf hojjeta.',
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
    responsibilities_om: [
      'Sanyii filatamaa fi xaa\'oo yeroon qonnaan bultootaaf raabsuu',
      'Biyyee fi bishaan kunuunsuu fi misooma sululaa gaggeessuu',
      'Tajaajila yaala beeyladootaa fi talaallii kennuu',
      'Wiirtuulee leenjii qonnaan bultootaa (FTC) to\'achuu',
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
    servicesProvided_om: [
      'Galtee qonnaa fi raabsa waraqaa ragaa',
      'Talaallii beeyladootaa',
      'Biqiltuu dhaabuu fi eegumsa bosonaa',
      'Hayyama misooma jallisiif ragaa kennuu',
    ],
  },
  {
    slug: 'land-administration',
    name_en: 'Land Administration & Environmental Protection Office',
    name_am: 'የመሬት አስተዳደርና አካባቢ ጥበቃ ጽህፈት ቤት',
    name_om: 'Waajjira Bulchiinsa Lafaa fi Eegumsa Naannoo',
    head_en: 'Ato Daniel Bekele',
    head_am: 'አቶ ዳንኤል በቀለ',
    head_om: 'Obbo Daan\'eel Baqqalaa',
    headTitle_en: 'Head of Land Administration',
    headTitle_am: 'የመሬት አስተዳደር ጽ/ቤት ኃላፊ',
    headTitle_om: 'Itti Gaafatamaa Bulchiinsa Lafaa',
    phone: '+251 (0) 58 661 0202',
    email: 'land@angolela-tera.gov.et',
    location_en: 'Main Administrative Compound, Block A, Ground Floor, Chacha',
    location_am: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ሀ፣ ምድር ቤት፣ ጫቻ',
    location_om: 'Gamoo Bulchiinsa Guddaa, Kutaa A, Magaalaa Caccetti',
    about_en: 'Responsible for rural cadastral survey, primary and second-level landholding book issuance (Green Book), land use zoning, dispute demarcation, and environmental compliance monitoring.',
    about_am: 'የገጠር መሬት ይዞታ ምዝገባ፣ የሁለተኛ ደረጃ ደብተር (አረንጓዴ ደብተር) አሰጣጥ፣ የመሬት አጠቃቀም ፕላን፣ የይዞታ ወሰን ማካለልና የአካባቢ ተፅዕኖ ግምገማ ያከናውናል።',
    about_om: 'Waraqaa ragaa qabiyyee lafa baadiyyaa kennuu, karoora fayyadama lafaa fi eegumsa naannoo to\'achuuf itti gaafatamummaa qaba.',
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
    responsibilities_om: [
      'Waraqaa ragaa qabiyyee lafaa sadarkaa 2ffaa kennuu',
      'Wal-dhabdee daangaa lafaa seeraan furuu',
      'Ragaa lafaa teeknooloojii GIS tiin gurmeessuu',
      'Madaallii dhiibbaa naannoo pirojektootaaf gaggeessuu',
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
    servicesProvided_om: [
      'Galmee qabiyyee lafaa fi kenniinsa kitaabaa',
      'Dhaala fi daddabarsa lafaa mirkaneessuu',
      'Safartuu GPS fi mirkaneessa daangaa',
      'Lafa invastimantiif qophaa\'e mirkaneessuu',
    ],
  },
  {
    slug: 'trade-investment',
    name_en: 'Trade, Industry & Market Development Office',
    name_am: 'የንግድ፣ ኢንዱስትሪና ገበያ ልማት ጽህፈት ቤት',
    name_om: 'Waajjira Daldalaa, Industirii fi Gabaa',
    head_en: 'Ato Girma Kebede',
    head_am: 'አቶ ግርማ ከበደ',
    head_om: 'Obbo Girmaa Kabbadaa',
    headTitle_en: 'Head of Trade & Industry',
    headTitle_am: 'የንግድና ኢንዱስትሪ ጽ/ቤት ኃላፊ',
    headTitle_om: 'Itti Gaafatamaa Daldalaa fi Industirii',
    phone: '+251 (0) 58 661 0203',
    email: 'trade@angolela-tera.gov.et',
    location_en: 'Commerce Building, Main Highway Junction, Chacha',
    location_am: 'የንግድ ህንጻ፣ አውራ ጎዳና መገንጠያ፣ ጫቻ',
    location_om: 'Gamoo Daldalaa, Daandii Guddaa, Magaalaa Caccetti',
    about_en: 'Oversees domestic trade regulation, commercial licensing, consumer rights protection, cooperative union market linkages, and one-stop investor facilitation along the A2 highway corridor.',
    about_am: 'የንግድ ምዝገባና ፈቃድ አሰጣጥ፣ የገበያ መረጋጋት፣ የሸማቾች መብት ጥበቃ፣ የህብረት ስራ ማህበራት የገበያ ትስስር እና የኢንቨስትመንት ድጋፍ የሚሰጥ ጽህፈት ቤት ነው።',
    about_om: 'Hayaama daldalaa kennuu, gabaa tasgabeessuu, mirga maamiltootaa eeguu fi invastimantii daandii Finfinnee-Dabra Birhaan jiru deggeruuf hojjeta.',
    responsibilities_en: [
      'Commercial business registration and annual license renewals',
      'Market price stabilization and regular consumer weight & measure inspections',
      'Promoting market linkages for grain, sheep, and dairy cooperatives',
      'Managing the Chacha Agro-Processing Investor One-Stop Service Desk',
    ],
    responsibilities_am: [
      'የንግድ ምዝገባ፣ የንግድ ፈቃድ መስጠትና አመታዊ እድሳት ማካሄድ',
      'የገበያ ዋጋ ክትትልና የንግድ ሚዛን ትክክለኛነት ፍተሻ ማድረግ',
      'ለአርሶ አደር የህብረት ስራ ማህበራት የሰብልና የእንስሳት ገበያ ትስስር መፍጠር',
      'በጫቻ ከተማ ለሚገነቡ አግሮ-ፕሮሰሲንግ ፕሮጀክቶች የአንድ መስኮት ድጋፍ መስጠት',
    ],
    responsibilities_om: [
      'Galmee daldalaa fi haaromsa hayaamaa',
      'Madaallii gabaa fi safartuu to\'achuu',
      'Waldaalee qonnaatiif gabaa mijeessuu',
      'Tajaajila gamoo tokkoo invastimantiif kennuu',
    ],
    servicesProvided_en: [
      'New trade license issuance & amendment',
      'Commercial competency verification',
      'Investor intake & incentive guidance',
      'Grain export & transport permits',
    ],
    servicesProvided_am: [
      'አዲስ የንግድ ፈቃድ ማውጣትና ማሻሻል',
      'የንግድ ብቃት ማረጋገጫ ምስክር ወረቀት',
      'የኢንቨስትመንት ፈቃድ ማስተናገድና መመሪያ መስጠት',
      'የእህል ንግድና ትራንስፖርት ፍቃድ ማረጋገጥ',
    ],
    servicesProvided_om: [
      'Hayaama daldalaa haaraa fi jijjiirraa',
      'Mirkaneessa ga\'umsa daldalaa',
      'Qajeelfama invastimantii kennuu',
      'Hayyama geejjibaa midhaanii',
    ],
  },
  {
    slug: 'health',
    name_en: 'Health Office',
    name_am: 'የጤና ጥበቃ ጽህፈት ቤት',
    name_om: 'Waajjira Eegumsa Fayyaa',
    head_en: 'Dr. Selamawit Alemu',
    head_am: 'ዶ/ር ሰላማዊት አለሙ',
    head_om: 'Dkt. Salaamaawit Alamuu',
    headTitle_en: 'Head of Health Office',
    headTitle_am: 'የጤና ጽ/ቤት ኃላፊ',
    headTitle_om: 'Itti Gaafatamaa Eegumsa Fayyaa',
    phone: '+251 (0) 58 661 0204',
    email: 'health@angolela-tera.gov.et',
    location_en: 'Chacha Primary Hospital Compound, Health Administration Wing',
    location_am: 'የጫቻ የመጀመሪያ ደረጃ ሆስፒታል ቅጥር ጊቢ፣ የጤና አስተዳደር ህንጻ',
    location_om: 'Gamooma Hospitaala Sadarkaa 1ffaa Caaccetti',
    about_en: 'Directs the public healthcare delivery network across 1 Primary Hospital, 5 Health Centers, and 19 Kebele Health Posts. Administers Community-Based Health Insurance (CBHI) covering over 85% of woreda households.',
    about_am: 'በ1 የመጀመሪያ ደረጃ ሆስፒታል፣ በ5 ጤና ጣቢያዎችና በ19 የቀበሌ ጤና ኬላዎች የሚሰጠውን የህክምና አገልግሎት ይመራል፡ ከ85% በላይ የሚሆነውን ነዋሪ በማህበረሰብ አቀፍ ጤና መድህን (CBHI) አቅፏል።',
    about_om: 'Hospitaala 1, buufataalee fayyaa 5 fi keellaa fayyaa 19 to\'ata. Inshuraansii fayyaa hawaasaa (CBHI) abbootii warraa dhibbeentaa 85 ol fayyadamoo taasiseera.',
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
    responsibilities_om: [
      'Fayyaa haadholii fi daa\'immanii to\'achuu',
      'Ittisa dhibee fi talaallii daa\'immanii gaggeessuu',
      'Inshuraansii fayyaa hawaasaa (CBHI) bulchuu',
      'Dhiheessa qorichaa fi to\'annoo qulqullinaa',
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
    servicesProvided_om: [
      'Galmee fi haaromsa kaardii CBHI',
      'Waraqaa riiferaala yaalaa',
      'Talaallii daa\'immanii',
      'To\'annoo kilinika dhuunfaa fi faarmaasii',
    ],
  },
  {
    slug: 'education',
    name_en: 'Education Office',
    name_am: 'የትምህርት ጽህፈት ቤት',
    name_om: 'Waajjira Barnootaa',
    head_en: 'W/ro Almaz Tesfaye',
    head_am: 'ወ/ሮ አልማዝ ተስፋዬ',
    head_om: 'Adde Almaaz Tasfaayee',
    headTitle_en: 'Head of Education Office',
    headTitle_am: 'የትምህርት ጽ/ቤት ኃላፊ',
    headTitle_om: 'Itti Gaafatamaa Barnootaa',
    phone: '+251 (0) 58 661 0205',
    email: 'education@angolela-tera.gov.et',
    location_en: 'Education Bureau Building, High School Road, Chacha',
    location_am: 'የትምህርት መምሪያ ህንጻ፣ አጠቃላይ 2ኛ ደረጃ ት/ቤት መንገድ፣ ጫቻ',
    location_om: 'Gamoo Barnootaa, Daandii Mana Barumsaa Sad. 2ffaa, Caccetti',
    about_en: 'Administers 38 Primary Schools, 4 Secondary Schools, and 2 Vocational Training clusters across Angolela Tera, ensuring equitable access to quality education, teacher development, and digital learning.',
    about_am: 'በወረዳው የሚገኙ 38 የአንደኛ ደረጃ ት/ቤቶችን፣ 4 የሁለተኛ ደረጃ ት/ቤቶችንና የቴክኒክና ሙያ ማዕከላትን ይመራል፡ የትምህርት ጥራትና ፍትሃዊ ተደራሽነትን ያረጋግጣል።',
    about_om: 'Manneen barumsaa sadarkaa 1ffaa 38 fi sadarkaa 2ffaa 4 to\'ata. Qulqullina barnootaa fi dhiheenya barumsaa mirkaneessa.',
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
    responsibilities_om: [
      'Hojiirra oolmaa sirna barnootaa fi qormaata naannoo',
      'Ijaarsa manneen barumsaa fi mana yaalii (lab)',
      'Leenjii fi ramaddii barsiisotaa',
      'Dhiheessa sagantaa soorata barattootaa',
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
    servicesProvided_om: [
      'Ragaa barumsaa fi waraqaa ragaa mirkaneessuu',
      'Jijjiirraa barattootaa manneen barumsaa gidduutti',
      'Hayaama manneen barumsaa dhuunfaa',
      'Qaxarrii fi mirkaneessa barsiisotaa',
    ],
  },
  {
    slug: 'finance',
    name_en: 'Finance & Economic Development Office',
    name_am: 'የፋይናንስና ኢኮኖሚ ልማት ጽህፈት ቤት',
    name_om: 'Waajjira Faayinaansii fi Misooma Diinagdee',
    head_en: 'Ato Solomon Mekonnen',
    head_am: 'አቶ ሰለሞን መኮንን',
    head_om: 'Obbo Solomoon Makonnin',
    headTitle_en: 'Head of Finance Office',
    headTitle_am: 'የፋይናንስ ጽ/ቤት ኃላፊ',
    headTitle_om: 'Itti Gaafatamaa Faayinaansii',
    phone: '+251 (0) 58 661 0206',
    email: 'finance@angolela-tera.gov.et',
    location_en: 'Main Administrative Compound, Block A, 1st Floor, Chacha',
    location_am: 'ዋናው የአስተዳደር ቅጥር ጊቢ፣ ህንጻ ሀ፣ 1ኛ ፎቅ፣ ጫቻ',
    location_om: 'Gamoo Bulchiinsa Guddaa, Kutaa A, Magaalaa Caccetti',
    about_en: 'Prepares the annual woreda capital and recurrent budget, enforces public expenditure accountability, manages local revenue collection, and coordinates socio-economic planning.',
    about_am: 'የወረዳውን ዓመታዊ የካፒታልና የመደበኛ በጀት ያዘጋጃል፣ የፋይናንስ ህግጋትና ኦዲት አፈጻጸምን ይቆጣጠራል፣ የውስጥ ገቢ አሰባሰብንና የልማት እቅድን ይመራል።',
    about_om: 'Baajata aanaa qopheessuu, kaffaltii fi herrega qulqulleessuu fi galii aanaa sassaabuuf itti gaafatamummaa qaba.',
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
    responsibilities_om: [
      'Karoora baajata aanaa qopheessuu',
      'Hojii odiitii keessaa to\'achuu',
      'Gibira fi kaffaltii tajaajilaa sassaabuu',
      'Bittaa mootummaa iftoomina qabu gaggeessuu',
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
    servicesProvided_om: [
      'Waraqaa qulqullina gibiraa',
      'Galmee dhiheessitoota bittaa mootummaa',
      'Nagahee galii mirkaneessuu',
      'Gabaasa odiitii faayinaansii',
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
    title_om: 'Galmee Murtii (Dhaloota, Gaa\'ela, Du\'a)',
    category_en: 'Civil Status & Identification',
    category_am: 'የዜጎች ህጋዊ ማረጋገጫ',
    category_om: 'Eenyummaa Lammiilee',
    officeSlug: 'women-social-affairs',
    officeName_en: 'Vital Events Registration Desk',
    officeName_am: 'የወሳኝ ኩነት ምዝገባ ጽ/ቤት',
    officeName_om: 'Kutaa Galmee Murtii',
    processingTime_en: '1–2 Working Days',
    processingTime_am: '1–2 የስራ ቀናት',
    processingTime_om: 'Guyyoota Hojii 1–2',
    cost_en: '50 ETB (Government stamp fee; free within 90 days of birth)',
    cost_am: '50 ብር (የቴምብር ክፍያ፤ በ90 ቀናት ውስጥ ለተወለዱ ነጻ)',
    cost_om: 'Qarshii 50 (Guyyoota 90 keessatti bilisa)',
    description_en: 'Legal registration and issuance of official authenticated certificates for births, marriages, divorces, and deaths for residents of Angolela Tera Woreda, in accordance with federal vital event proclamation laws.',
    description_am: 'በአንጎሌላ ተራ ወረዳ ነዋሪ ለሆኑ ዜጎች በኢትዮጵያ የፌዴራል ወሳኝ ኩነት ምዝገባ ህግ መሰረት የልደት፣ ጋብቻ፣ ፍቺ እና የሞት ይፋዊ ህጋዊ የምስክር ወረቀት ምዝገባና አሰጣጥ።',
    description_om: 'Akkaataa seera galmee murtii Itoophiyaatti waraqaa ragaa dhalootaa, gaa\'elaa fi du\'aa lammiilee aanaatiif kennuu.',
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
    requirements_om: [
      'Waraqaa eenyummaa gandaa haarome',
      'Waraqaa buufata fayyaa dhalootaaf',
      'Ragaalee lama waraqaa eenyummaa qaban',
      'Ragaa yaalaa du\'aaf',
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
    steps_om: [
      'Tarkaanfii 1: Ganda irraa waraqaa deeggarsaa fiduu',
      'Tarkaanfii 2: Waajjira Caaccetti argamuutti iyyannoo galchuu',
      'Tarkaanfii 3: Ragaa sirna kompiitaraa irratti mirkaneessuu',
      'Tarkaanfii 4: Waraqaa ragaa asxaa mootummaa qabu fudhachuu',
    ],
  },
  {
    slug: 'land-certificate',
    title_en: 'Rural Land Holding Registration & Transfer',
    title_am: 'የገጠር መሬት ይዞታ ምዝገባ፣ ደብተርና ዝውውር',
    title_om: 'Galmee Qabiyyee Lafaa fi Daddabarsa',
    category_en: 'Land & Property Rights',
    category_am: 'የመሬትና ንብረት መብት',
    category_om: 'Mirga Qabeenya Lafaa',
    officeSlug: 'land-administration',
    officeName_en: 'Land Administration & Environmental Protection Office',
    officeName_am: 'የመሬት አስተዳደርና አካባቢ ጥበቃ ጽ/ቤት',
    officeName_om: 'Waajjira Bulchiinsa Lafaa',
    processingTime_en: '3–5 Working Days',
    processingTime_am: '3–5 የስራ ቀናት',
    processingTime_om: 'Guyyoota Hojii 3–5',
    cost_en: '100 ETB (Certificate book printing & cadastral map fee)',
    cost_am: '100 ብር (የደብተር ህትመትና የካርታ ክፍያ)',
    cost_om: 'Qarshii 100 (Kaffaltii maxxansa kitaabaa)',
    description_en: 'Issuance and official updating of the Second-Level Rural Landholding Certificate (Green Book) including plot boundary coordinates, family member rights, inheritance, and legal rental agreements.',
    description_am: 'የአርሶ አደር ይዞታን የሚያረጋግጥ የሁለተኛ ደረጃ የይዞታ ማረጋገጫ ደብተር (አረንጓዴ ደብተር) አሰጣጥ፣ የወሰን ቅየሳ፣ የውርስና የስሪት ዝውውር ምዝገባ።',
    description_om: 'Waraqaa ragaa qabiyyee lafaa sadarkaa 2ffaa (kitaaba magariisa) kennuu fi daddabarsa dhaalaa mirkaneessuu.',
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
    requirements_om: [
      'Kitaaba lafaa duraanii',
      'Murtii koree lafaa gandaa (KLAC)',
      'Mallattoo waliigaltee abbaa warraa fi haadha warraa',
      'Murtii mana murtii dhaalaaf',
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
    steps_om: [
      'Tarkaanfii 1: Koree lafaa gandaatti iyyannoo galchuu',
      'Tarkaanfii 2: Ogeessi GPS dhaan lafa safaruu',
      'Tarkaanfii 3: Beeksisa guyyoota 30 ganda irratti maxxansuu',
      'Tarkaanfii 4: Waajjira aanaatti kitaaba fudhachuu',
    ],
  },
  {
    slug: 'business-license',
    title_en: 'Commercial Business Registration & Trade Licensing',
    title_am: 'የንግድ ምዝገባ፣ የንግድ ፈቃድና አመታዊ እድሳት',
    title_om: 'Galmee Daldalaa fi Kenniinsa Hayaamaa',
    category_en: 'Trade & Commerce',
    category_am: 'ንግድና ኢንቨስትመንት',
    category_om: 'Daldala fi Industirii',
    officeSlug: 'trade-investment',
    officeName_en: 'Trade, Industry & Market Development Office',
    officeName_am: 'የንግድ፣ ኢንዱስትሪና ገበያ ልማት ጽ/ቤት',
    officeName_om: 'Waajjira Daldalaa fi Industirii',
    processingTime_en: '1 Working Day',
    processingTime_am: '1 የስራ ቀን',
    processingTime_om: 'Guyyaa Hojii 1',
    cost_en: 'Varies by sector (120 ETB – 500 ETB fixed statutory registration fee)',
    cost_am: 'እንደ ንግድ ዘርፉ ይለያያል (ከ120 ብር እስከ 500 ብር ህጋዊ ክፍያ)',
    cost_om: 'Akka gosa daldalaatti (Qarshii 120 - 500)',
    description_en: 'Full-service commercial licensing for sole proprietorships, partnerships, and private limited companies operating in retail, grain trade, transport, manufacturing, and hospitality within Angolela Tera.',
    description_am: 'በአንጎሌላ ተራ ወረዳ ለሚሰሩ የችርቻሮ፣ የእህል ንግድ፣ የአግሮ-ፕሮሰሲንግ፣ የትራንስፖርትና የእንግዳ ተቀባይነት ንግዶች ፈቃድ መስጠትና ማደስ።',
    description_om: 'Daldala dhuunfaa, waldaalee fi industiriif hayaama daldalaa haaraa kennuu fi haaromsuu.',
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
    requirements_om: [
      'Waraqaa lakkoofsa kaffalaa gibiraa (TIN)',
      'Suuraa lama',
      'Waliigaltee kireeffannaa bakka daldalaa',
      'Waraqaa ga\'umsa ogummaa',
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
    steps_om: [
      'Tarkaanfii 1: Maqaa daldalaa mirkaneeffachuu',
      'Tarkaanfii 2: Galmee iyyannoo dhiheessuu',
      'Tarkaanfii 3: Kaffaltii baankii daldalaa Itoophiyaatti kaffaluu',
      'Tarkaanfii 4: Waraqaa hayaama daldalaa fudhachuu',
    ],
  },
  {
    slug: 'health-insurance',
    title_en: 'Community-Based Health Insurance (CBHI) Registration',
    title_am: 'የማህበረሰብ አቀፍ ጤና መድህን (CBHI) ምዝገባና እድሳት',
    title_om: 'Galmee Inshuraansii Fayyaa Hawaasaa (CBHI)',
    category_en: 'Public Health & Social Safety',
    category_am: 'የህዝብ ጤናና ማህበራዊ ጥበቃ',
    category_om: 'Fayyaa fi Nageenya Hawaasaa',
    officeSlug: 'health',
    officeName_en: 'Woreda Health Office & Kebele Health Posts',
    officeName_am: 'የወረዳው ጤና ጥበቃ ጽ/ቤትና የቀበሌ ጤና ኬላዎች',
    officeName_om: 'Waajjira Eegumsa Fayyaa fi Keellaa Fayyaa',
    processingTime_en: 'Same Day / Immediate',
    processingTime_am: 'በዕለቱ / ወዲያውኑ',
    processingTime_om: 'Battalumatti',
    cost_en: '600 ETB / household / year (Indigent households 100% subsidized by woreda)',
    cost_am: '600 ብር ለአንድ አባወራ በዓመት (አቅመ ደካሞች በወረዳው በነጻ ይሸፈናሉ)',
    cost_om: 'Qarshii 600 waggaatti maatii tokkoof (Harka qalleeyyiif bilisa)',
    description_en: 'Enrollment in the regional solidarity health insurance fund ensuring family members receive free medical treatment, diagnostics, and essential pharmaceuticals across all government hospitals and health centers.',
    description_am: 'መላው የቤተሰብ አባላት በወረዳው ባሉ ጤና ጣቢያዎችና በጫቻ ሆስፒታል ነጻ የህክምና፣ የላቦራቶሪና የመድሃኒት አገልግሎት የሚያገኙበት የማህበረሰብ አቀፍ የጤና መድህን ምዝገባ።',
    description_om: 'Maatiin hundi buufata fayyaa fi hospitaala keessatti yaala bilisaa akka argatan galmee inshuraansii fayyaa hawaasaa gaggeessuu.',
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
    requirements_om: [
      'Waraqaa galmee maatii gandaa',
      'Suuraa abbaa warraa fi maqaa ijoollee',
      'Nagahee kaffaltii waggaa',
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
    steps_om: [
      'Tarkaanfii 1: Bakka bu\'aa CBHI gandaatti galmaa\'uu',
      'Tarkaanfii 2: Ragaa maatii mirkaneessuu',
      'Tarkaanfii 3: Kitaaba maatii fayyaa fudhachuu',
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
    title_am: 'የአንጎሌላ ተራ ወረዳ ምክር ቤት መደበኛ ጉባዔውን አጠናቀቀ፤ የዓመቱን የካፒታል በጀት አጸደቀ',
    title_om: 'Manni Maree Aanaa Angolallaa Xaraa Yaa\'ii Idilee Isaatiin Baajata Misoomaa Mirkaneesse',
    category_en: 'Council Resolution',
    category_am: 'የምክር ቤት ውሳኔ',
    category_om: 'Murtee Mana Maree',
    date_en: 'September 24, 2026',
    date_am: 'መስከረም 14/2019',
    date_om: 'Fulbaana 14, 2026',
    author_en: 'Communication Affairs Office',
    author_am: 'የመንግሥት ኮሙኒኬሽን ጉዳዮች ጽ/ቤት',
    author_om: 'Waajjira Kominikeeshinii Mootummaa',
    isFeatured: true,
    summary_en: 'The Woreda Council convened for its ordinary session in Chacha, formally ratifying the annual public expenditure plan prioritizing rural water schemes, primary road graveling, and agricultural cooperative subsidies.',
    summary_am: 'የአንጎሌላ ተራ ወረዳ ምክር ቤት በጫቻ ከተማ ባካሄደው መደበኛ ጉባዔ ለንጹህ መጠጥ ውሃ መስፋፋት፣ ለገጠር መንገዶች ጠጠር ማልበስ እና ለአርሶ አደር ማህበራት ድጋፍ ቅድሚያ የሰጠውን በጀት አጸደቀ።',
    summary_om: 'Manni maree aanaa baajata ijaarsa daandii, bishaan qulqulluu fi deeggarsa qonnaan bultootaaf oolu guutummaatti mirkaneessee jira.',
    content_en: [
      'The 6th Angolela Tera Woreda Council has concluded its high-level ordinary session following two days of constructive deliberations in the administrative hall at Chacha town.',
      'The approved budget prioritizes three major socioeconomic pillars: the expansion of deep water borehole schemes across 6 moisture-stressed kebeles, the upgrade of 45 kilometers of community feeder roads connecting farming villages to the main A2 highway, and modernization subsidies for local agricultural cooperatives.',
      'Chief Administrator of the Woreda, in his address to council members, underscored that fiscal transparency, timely project completion, and strict monitoring of public expenditure will remain the uncompromising standards of the executive cabinet.',
    ],
    content_am: [
      '6ኛው የአንጎሌላ ተራ ወረዳ ምክር ቤት በጫቻ ከተማ በሚገኘው የአስተዳደር አዳራሽ ለሁለት ቀናት ያካሄደውን መደበኛ ጉባዔ በተሳካ ሁኔታ አጠናቋል።',
      'የጸደቀው በጀት ለሶስት ዋና ዋና የልማት መስኮች ትኩረት የሰጠ ሲሆን፡ በ6 ደረቃማ አካባቢዎች የጥልቅ ውሃ ጉድጓድ ቁፋሮ፣ 45 ኪሎ ሜትር የገጠር መንገዶችን ጠጠር የማልበስ እና የአርሶ አደሩን የህብረት ስራ ማህበራት የማጠናከር ስራዎችን ያካትታል።',
      'የወረዳው ዋና አስተዳዳሪ ለምክር ቤቱ አባላት ባደረጉት ንግግር የፋይናንስ ግልጽነትን ማስፈን፣ የልማት ፕሮጀክቶችን በወቅቱ ማጠናቀቅ እና የህዝብ ሀብትን በቁጠባ መጠቀም የአስፈጻሚው አካል የማይታጠፍ አቋም መሆኑን አሳስበዋል።',
    ],
    content_om: [
      'Manni maree aanaa Angolallaa Xaraa yaa\'ii isaa magaalaa Caaccetti xumureera.',
      'Baajanni ragga\'e kun hojii bishaan qulqulluu, ijaarsa daandii fi deeggarsa qonnaatiif kan oolu ta\'a.',
      'Bulchaan aanaa hojiin misoomaa hundi qulqullinaa fi yeroo qabameen akka xumuramu ibsaniiru.',
    ],
  },
  {
    slug: 'wheat-distribution',
    title_en: 'Distribution of Highland Wheat Seeds and Inputs Commences Across 19 Kebeles',
    title_am: 'በ19ኙም የገጠር ቀበሌዎች የደጋ ስንዴ ምርጥ ዘርና ማዳበሪያ ስርጭት ተጀመረ',
    title_om: 'Sanyiin Qamadii Filatamaa Gandoolee 19tti Raabsamuu Jalqabe',
    category_en: 'Agriculture',
    category_am: 'ግብርና ልማት',
    category_om: 'Qonna',
    date_en: 'September 18, 2026',
    date_am: 'መስከረም 8/2019',
    date_om: 'Fulbaana 8, 2026',
    author_en: 'Agriculture & Rural Development Bureau',
    author_am: 'የግብርናና ገጠር ልማት ጽ/ቤት',
    author_om: 'Waajjira Qonnaa fi Misooma Baadiyyaa',
    isFeatured: false,
    summary_en: 'Over 14,000 quintals of certified rust-resistant wheat seed and balanced NPS-B fertilizer are being distributed to smallholder farmers ahead of the meher harvest season.',
    summary_am: 'ከ14 ሺህ ኩንታል በላይ በሽታን የሚቋቋም ምርጥ የስንዴ ዘር እና ኤን.ፒ.ኤስ-ቦሮን (NPS-B) ማዳበሪያ ለመኸር ወቅት ስራ ለአርሶ አደሮች በመሰራጨት ላይ ይገኛል።',
    summary_om: 'Qamadiin filatamaa kuintaalli 14,000 ol fi xaa\'oon qonnaan bultootaaf kennamaa jira.',
    content_en: [
      'The Angolela Tera Woreda Agriculture and Rural Development Office has officially launched the mass distribution of certified agricultural inputs across all kebele multipurpose union service stations.',
      'The input package focuses on the highly productive, stripe rust-resistant bread wheat varieties suitable for highland elevations above 2,600 meters, ensuring optimal grain yields even during fluctuating seasonal rain patterns.',
      'Field development agents (DAs) are actively providing localized technical demonstrations on cluster farming, balanced fertilizer application, and mechanized sowing techniques to ensure farmers achieve maximum productivity.',
    ],
    content_am: [
      'የአንጎሌላ ተራ ወረዳ ግብርናና ገጠር ልማት ጽ/ቤት በሁሉም የቀበሌ ሁለገብ የህብረት ስራ ማህበራት መጋዘኖች በኩል የግብርና ግብአቶችን ለአርሶ አደሮች የማሰራጨት ስራን ጀምሯል።',
      'ስርጭቱ ከ2,600 ሜትር በላይ ባሉ ደጋማ አካባቢዎች ከፍተኛ ምርት በሚሰጡና ቢጫ ዋግ የተባለውን የስንዴ በሽታ በሚቋቋሙ ዝርያዎች ላይ ያተኮረ ነው።',
      'በየቀበሌው ያሉ የግብርና ባለሙያዎች አርሶ አደሩ በመስመር እንዲዘራ፣ የተመጣጠነ ማዳበሪያ እንዲጠቀምና በኩታ-ገጠም አስተራረስ ምርቱን እንዲያሳድግ የተግባር ድጋፍ በመስጠት ላይ ይገኛሉ።',
    ],
    content_om: [
      'Waajjirri qonnaa aanaa galtee qonnaa gandoolee mara keessatti raabsaa jira.',
      'Sanyiin kun dhibee kan danda\'u fi oomishtummaa ol\'aanaa kan qabuudha.',
      'Ogeessonni qonnaa gandaa qonnaan bultootaaf leenjii hojiirraa kennaa jiru.',
    ],
  },
  {
    slug: 'chacha-industrial-park',
    title_en: 'Chacha Agro-Processing Corridor Invites Private Investment Proposals',
    title_am: 'የጫቻ አግሮ-ፕሮሰሲንግ ኮሪደር ለግል ባለሀብቶች የኢንቨስትመንት ጥሪ አቀረበ',
    title_om: 'Koriidariin Industirii Magaalaa Caaccetti Invastimantiif Waamicha Dhiheesse',
    category_en: 'Investment',
    category_am: 'ኢንቨስትመንት',
    category_om: 'Invastimantii',
    date_en: 'September 12, 2026',
    date_am: 'መስከረም 2/2019',
    date_om: 'Fulbaana 2, 2026',
    author_en: 'Trade & Investment Office',
    author_am: 'የንግድና ኢንቨስትመንት ጽ/ቤት',
    author_om: 'Waajjira Daldalaa fi Invastimantii',
    isFeatured: false,
    summary_en: 'The Woreda Administration has demarcated over 120 hectares of serviced industrial land adjacent to the Addis Ababa–Dessie expressway for investors in malt barley processing, dairy plants, and potato value-addition.',
    summary_am: 'የወረዳው አስተዳደር በአዲስ አበባ-ደሴ ዋና አውራ ጎዳና ዳርቻ 120 ሄክታር ምቹ የኢንቨስትመንት መሬት ለብቅል ገብስ ፋብሪካዎች፣ ለወተት ማቀነባበሪያና ለድንች እሴት ጭማሪ አልሚዎች አዘጋጅቷል።',
    summary_om: 'Lafni hektaara 120 ta\'u industirii qonnaatiif qophaa\'ee jira.',
    content_en: [
      'Angolela Tera Woreda is rapidly positioning itself as the premier agro-industrial processing destination in the North Shewa Zone of the Amhara Region.',
      'Benefiting from direct access to the paved A2 trunk road, proximity to Debre Birhan and Addis Ababa, abundant electricity from the national grid, and plentiful high-quality spring water, the Chacha corridor offers unmatched logistical advantages.',
      'Qualified investors will enjoy expedited one-stop clearances, competitive 70-year lease terms, local raw material supply guarantees, and dedicated administrative support.',
    ],
    content_am: [
      'የአንጎሌላ ተራ ወረዳ በሰሜን ሸዋ ዞን ዋነኛ የአግሮ-ኢንዱስትሪ ማዕከል ለመሆን ሰፊ ዝግጅት እያደረገ ይገኛል።',
      'በአዲስ አበባ-ደብረ ብርሃን አስፋልት መንገድ ላይ መገኘቱ፣ የተረጋጋ የኤሌክትሪክ ሀይል፣ አስተማማኝ የተፈጥሮ ምንጭ ውሃ እና በቂ የሰው ሀይል መኖሩ ለኢንቨስትመንት ተመራጭ አድርጎታል።',
      'ወረዳው በአንድ መስኮት አገልግሎት ፈቃድ ለመስጠት፣ የ70 ዓመት የሊዝ ይዞታ ዋስትና ለመስጠት እና ከአርሶ አደሮች ጋር የጥሬ እቃ ትስስር ለመፍጠር ቁርጠኛ ነው።',
    ],
    content_om: [
      'Aanaan Angolallaa Xaraa wiirtuu industirii qonnaa ta\'uuf qophaa\'eera.',
      'Daandii asfaaltii, humna elektiriikii fi bishaan gahaa qaba.',
      'Abbootiin qabeenyaa carraa kanatti akka fayyadaman waamichi ta\'eeraaf.',
    ],
  },
]

// Backward-compatible alias exports for administrative routes and APIs
export const mockOffices = SECTOR_OFFICES
export const mockServices = CITIZEN_SERVICES
export const mockNews = NEWS_ARTICLES
