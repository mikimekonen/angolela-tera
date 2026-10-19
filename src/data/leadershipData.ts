export interface LeaderData {
  id: string
  name_en: string
  name_am: string
  name_om: string
  title_en: string
  title_am: string
  title_om: string
  category_en: string
  category_am: string
  category_om: string
  office_en: string
  office_am: string
  office_om: string
  bio_en: string
  bio_am: string
  bio_om: string
  photo: string
  phone?: string
  email?: string
  portfolios_en: string[]
  portfolios_am: string[]
  portfolios_om: string[]
  sourceUrl?: string
  sourceText?: string
}

export const OFFICIAL_LEADERS: LeaderData[] = [
  {
    id: 'leader-1',
    name_en: 'Ato Derese Dememe',
    name_am: 'አቶ ደረሰ ደመመ',
    name_om: 'Obbo Darrasaa Dammaqqaa',
    title_en: 'Chief Administrator',
    title_am: 'ዋና አስተዳዳሪ',
    title_om: "Bulchaa Ol'aanaa Aanaa",
    category_en: 'Executive Head of Government',
    category_am: 'የወረዳው ዋና አስፈጻሚ አካል',
    category_om: "Hooggana Ol'aanaa Mootummaa",
    office_en: 'Office of the Chief Administrator • Woreda Executive Council',
    office_am: 'የዋና አስተዳዳሪ ጽህፈት ቤት • የወረዳው ስራ አስፈጻሚ ምክር ቤት',
    office_om: "Waajjira Bulchaa Ol'aanaa • Mana Maree Raawwachiisaa Aanaa",
    bio_en:
      "The highest executive official of the Woreda's government body. He oversees the implementation of public policies, local security, budget management, and regional development programs across the district.",
    bio_am:
      'የወረዳው የመንግስት አስፈጻሚ አካል የበላይ መሪ ናቸው። በወረዳው ውስጥ የልማት ፕሮግራሞችን፣ የበጀት አስተዳደርን፣ የህዝብ ፖሊሲዎችን እና የሰላምና ጸጥታ ስራዎችን በበላይነት ይመራሉ።',
    bio_om:
      "Hoogganaa ol'aanaa qaama raawwachiisaa mootummaa aanaati. Hojiiwwan misoomaa, bulchiinsa baajataa, imaammata uummataa fi nageenya aanaa olaantummaan qindeessu.",
    photo: '/images/leadership/derese-dememe.jpg',
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
    portfolios_om: [
      "Raawwii Imaammataa fi To'annoo Dameelee",
      "Nageenya Aanaa fi Ol'aantummaa Seeraa",
      'Bulchiinsa Baajata Kaappitaalaa',
      'Qindeessa Sagantaalee Misooma Gandoolee',
    ],
    sourceUrl: 'https://www.facebook.com/angolelateracommu/posts/1570191888468276/',
    sourceText: 'Official Woreda Communication Desk',
  },
  {
    id: 'leader-2',
    name_en: 'Ato Negus Kasaye',
    name_am: 'አቶ ንጉስ ካሳዬ',
    name_om: 'Obbo Niguus Kaasaayee',
    title_en: 'Head of the Prosperity Party Office',
    title_am: 'የብልፅግና ፓርቲ ፅ/ቤት ሃላፊ',
    title_om: 'Hoogganaa Waajjira Paartii Badhaadhinaa',
    category_en: 'Ruling Party Secretariat Leadership',
    category_am: 'የገዥው ፓርቲ ጽህፈት ቤት የበላይ አመራር',
    category_om: 'Hoggansa Waajjira Paartii Biyya Bulchu',
    office_en: 'Woreda Prosperity Party Headquarters • Central Secretariat',
    office_am: 'የአንጎሌላ ተራ ወረዳ ብልፅግና ፓርቲ ጽህፈት ቤት • ዋና ሴክሬተሪያት',
    office_om: 'Waajjira Paartii Badhaadhinaa Aanaa • Waajjira Giddugaleessaa',
    bio_en:
      'The top ruling party leader in the Woreda. He guides political strategy, party institutional builds, ideological dissemination, and acts as the liaison coordinating party policies with district governance objectives.',
    bio_am:
      'በወረዳው የገዥው ፓርቲ የበላይ መሪ ናቸው። የፖለቲካ ስትራቴጂዎችን፣ የፓርቲ መዋቅር ግንባታዎችን እና ርዕዮተ-ዓለም ስርጭቶችን የሚመሩ ሲሆን የፓርቲውን ፖሊሲዎች ከመንግስት የልማት ግቦች ጋር ያቀናጃሉ።',
    bio_om:
      "Hoogganaa ol'aanaa paartii biyya bulchuuti. Tarsiimoo siyaasaa, ijaarsa dhaabbilee paartii qindeessuun imaammata paartichaa galmaalee misooma mootummaa waliin walsimsiisu.",
    photo: '/images/leadership/negus-kasaye.jpg',
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
    portfolios_om: [
      'Kallattii Tarsiimoo Siyaasaa fi Yaadaa',
      'Ijaarsa Dhaabbilee Paartii fi Hoggansa',
      'Walsimsiisa Imaammata Paartii fi Mootummaa',
      'Hawaasummaa fi Soochii Uummataa',
    ],
    sourceUrl: 'https://www.facebook.com/angolelateracommu/photos/1578451760975622/',
    sourceText: 'Official Party Secretariat Record',
  },
  {
    id: 'leader-3',
    name_en: 'Ato Gossay Mamo',
    name_am: 'አቶ ጎሳዬ ማሞ',
    name_om: 'Obbo Goossaayee Maammoo',
    title_en: 'Head of the Political Sector (Prosperity Party)',
    title_am: 'የፖለቲካ ዘርፍ ኃላፊ (ብልፅግና ፓርቲ)',
    title_om: 'Hoogganaa Damee Siyaasaa (Paartii Badhaadhinaa)',
    category_en: 'Political Affairs & Civic Mobilization',
    category_am: 'የፖለቲካ ዘርፍና የህዝባዊ መድረኮች አመራር',
    category_om: 'Damee Siyaasaa fi Waltajjii Uummataa',
    office_en: 'Prosperity Party Political Sector Directorate • Grassroots Org',
    office_am: 'የብልፅግና ፓርቲ የፖለቲካ ዘርፍ መምሪያ • የቀበሌዎች ማስተባበሪያ',
    office_om: 'Daayirektooreetii Damee Siyaasaa • Qindeessa Gandoolee',
    bio_en:
      "Operates under the Party Office, directly driving local political mobilization, community alignment forums, leadership capacity building, and structural public evaluation sessions within the woreda's kebeles.",
    bio_am:
      'በፓርቲው ጽህፈት ቤት ስር በመሆን በአካባቢው የፖለቲካ ንቅናቄዎችን፣ ህዝባዊ የውይይት መድረኮችን፣ የአመራር አቅም ግንባታዎችን እና የወረዳውን ቀበሌዎች መዋቅራዊ ግምገማዎችን በኃላፊነት ያከናውናሉ።',
    bio_om:
      'Waajjira paartii jalatti soochii siyaasaa naannoo, waltajjii marii uummataa, dandeettii hoggana ijaaruu fi gamaggama gandoolee aanaa qindeessuun hojjeta.',
    photo: '/images/leadership/gossay-mamo.jpg',
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
    portfolios_om: [
      'Soochii Siyaasaa Gandoolee (Gandoolee 19)',
      "Waltajjii Marii fi Walta'iinsa Uummataa",
      'Leenjii Dandeettii Hoggansa Naannoo',
      'Gamaggama Raawwii Caasaa Gandoolee',
    ],
    sourceUrl: 'https://www.facebook.com/angolelateracommu/posts/1532670228887109/',
    sourceText: 'Woreda Political Sector Report',
  },
  {
    id: 'leader-4',
    name_en: 'Ato Yordanos Tekeste',
    name_am: 'አቶ ዬርዳኖስ ተከስተ',
    name_om: 'Obbo Yordaanos Takastee',
    title_en: 'Deputy Administrator & Revenues Office Head',
    title_am: 'ምክትል አስተዳዳሪ እና የገቢዎች ጽ/ቤት ሃላፊ',
    title_om: 'Itti Aanaa Bulchaa fi Hoogganaa Waajjira Galiiwwanii',
    category_en: 'Deputy Executive & Fiscal Administration',
    category_am: 'የወረዳው ሁለተኛ አመራርና የገቢዎች አስተዳደር',
    category_om: 'Itti Aanaa Bulchaa fi Bulchiinsa Galii',
    office_en: 'Office of the Deputy Administrator • Bureau of Revenues & Finance',
    office_am: 'የምክትል አስተዳዳሪ ጽህፈት ቤት • የገቢዎችና ፋይናንስ መምሪያ',
    office_om: 'Waajjira Itti Aanaa Bulchaa • Waajjira Galiiwwanii fi Faayinaansii',
    bio_en:
      "Serves as the second-in-command for public administration while specifically directing the district's finance and revenue-collection frameworks to self-sustain local development budgets.",
    bio_am:
      'የወረዳው ሁለተኛ የመንግስት መሪ በመሆን የሚያገለግሉ ሲሆን በተለይም የአካባቢውን የልማት በጀት በራስ ለመደገፍ የገቢ አሰባሰብ እና የፋይናንስ መዋቅሮችን በበላይነት ይመራሉ::',
    bio_om:
      "Itti aanaa bulchaa aanaa ta'uun tajaajilu, keessumaa baajata misooma aanaa of danda'uuf sassaabbii galii fi maallaqaa olaantummaan hoogganu.",
    photo: '/images/leadership/yordanos-tekeste.jpg',
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
    portfolios_om: [
      'Hoggansa Lammaffaa Bulchiinsa Mootummaa',
      "Sassaabbii Galii Keessaa fi To'annoo Gibiraa",
      "Ijaarsa Baajata Misoomaa Of Danda'u",
      'Qindeessa Waajjirootaa fi Tajaajila Uummataa',
    ],
    sourceUrl: 'https://www.facebook.com/angolelateracommu/posts/1570191888468276/',
    sourceText: 'Cabinet Secretariat & Revenues Directorate',
  },
]
