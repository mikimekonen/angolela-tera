import fs from 'fs'
import path from 'path'
import { mockOffices, mockServices, mockNews } from '@/data/mockData'
import { MOCK_BUSINESSES, MOCK_PARTNERS, MOCK_LEADERSHIP } from '@/data/entityData'
import type {
  UserRole,
  ContentStatus,
  KebeleItem,
  InvestmentOpportunityItem,
  HomepageSectionConfigItem,
  NavigationMenuItem,
  AdminPermissionItem,
  TenderItem,
  AdminResource,
} from '@/types'

const STORE_PATH = path.join(process.cwd(), 'src', 'data', 'dbStore.json')

export interface UserAccount {
  id: string
  name: string
  email: string
  passwordHash: string
  role: UserRole
  officeId?: string | null
  isActive: boolean
  createdAt: string
  lastLoginAt?: string
}

export interface CitizenInquiry {
  id: string
  trackingCode: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: 'grievance' | 'inquiry' | 'feedback' | 'service_complaint'
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'RESOLVED' | 'REJECTED'
  responseNotes?: string
  assignedOfficeId?: string
  ipAddress?: string
  createdAt: string
  updatedAt: string
}

export interface StoreData {
  offices: any[]
  leadership: any[]
  services: any[]
  news: any[]
  kebeles: KebeleItem[]
  companies: any[]
  partners: any[]
  investments: InvestmentOpportunityItem[]
  homepageSections: HomepageSectionConfigItem[]
  navigation: NavigationMenuItem[]
  users: UserAccount[]
  permissions: AdminPermissionItem[]
  tenders: TenderItem[]
  inquiries: CitizenInquiry[]
  siteSettings: Record<string, string>
  auditLogs: any[]
  tourism: any[]
  developmentProjects: any[]
  documents: any[]
  sliders: any[]
}

// Generate default store structure
function getInitialStore(): StoreData {
  return {
    offices: [...mockOffices],
    leadership: [...MOCK_LEADERSHIP],
    services: [...mockServices],
    news: [...mockNews],
    kebeles: [
      {
        id: 'keb-chacha',
        slug: 'chacha-town-01',
        name_en: 'Chacha Central Town (Kebele 01)',
        name_am: 'ጫቻ ማዕከላዊ ከተማ (ቀበሌ 01)',
        name_om: 'Magaalaa Caccetti Giddugaleessaa (Ganda 01)',
        type: 'URBAN_TOWN',
        population: 18450,
        distanceFromCapitalKm: 0,
        mainAgroEcology: 'Weyna Dega',
        economicActivities_en: 'Commercial commerce, agro-processing hub, trade services, municipal administrative facilities.',
        economicActivities_am: 'ንግድና አገልግሎት፣ አግሮ-ፕሮሰሲንግ፣ ማዘጋጃ ቤታዊ አገልግሎቶች።',
        economicActivities_om: 'Daldala, qophii oomisha qonnaa, tajaajiloota bulchiinsaa.',
        administratorName: 'Ato Solomon Gizaw',
        contactPhone: '+251 58 661 0210',
        displayOrder: 1,
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: 'keb-cheki',
        slug: 'cheki-rural-kebele',
        name_en: 'Cheki Kebele',
        name_am: 'ጨቂ ቀበሌ',
        name_om: 'Ganda Cakkii',
        type: 'RURAL_KEBELE',
        population: 8200,
        distanceFromCapitalKm: 14,
        mainAgroEcology: 'Dega (Highland)',
        economicActivities_en: 'Highland barley cultivation, certified seed multiplication, sheep rearing, potato farming.',
        economicActivities_am: 'የገብስና ስንዴ ምርት፣ የድንች ልማት፣ የደጋ በግ እርባታ።',
        economicActivities_om: 'Oomisha garbuu fi qamadii, oomisha dhangalaasoo, horsiisa hoolaa.',
        administratorName: 'W/ro Genet Abebe',
        contactPhone: '+251 58 661 0214',
        displayOrder: 2,
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: 'keb-geyet',
        slug: 'geyet-kebele',
        name_en: 'Geyet Kebele',
        name_am: 'ገየት ቀበሌ',
        name_om: 'Ganda Gayat',
        type: 'RURAL_KEBELE',
        population: 7100,
        distanceFromCapitalKm: 18,
        mainAgroEcology: 'Dega (Highland)',
        economicActivities_en: 'Dairy cattle production, pulse farming, watershed soil conservation cooperative programs.',
        economicActivities_am: 'የወተት ላም እርባታ፣ የጥራጥሬ ሰብሎች፣ የተፋሰስ ልማት ጥበቃ።',
        economicActivities_om: 'Horsiisa aannanii, oomisha midhaanii, eegumsa biyyoofi bishaanii.',
        administratorName: 'Ato Tadesse Worku',
        contactPhone: '+251 58 661 0218',
        displayOrder: 3,
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
      {
        id: 'keb-kotu',
        slug: 'kotu-kebele',
        name_en: 'Kotu Kebele',
        name_am: 'ኮቱ ቀበሌ',
        name_om: 'Ganda Kootuu',
        type: 'RURAL_KEBELE',
        population: 9400,
        distanceFromCapitalKm: 9,
        mainAgroEcology: 'Weyna Dega',
        economicActivities_en: 'Cereal production (teff and wheat), poultry farms, rural smallholder irrigation along the Chacha basin.',
        economicActivities_am: 'የጤፍና ስንዴ ምርት፣ የዶሮ እርባታ፣ በጫቻ ወንዝ ተፋሰስ መስኖ ልማት።',
        economicActivities_om: 'Oomisha xaafii fi qamadii, horsiisa lukkuu, misooma jallisii.',
        administratorName: 'Ato Melaku Kebede',
        contactPhone: '+251 58 661 0222',
        displayOrder: 4,
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2025-01-01'),
      },
    ],
    companies: [...MOCK_BUSINESSES],
    partners: [...MOCK_PARTNERS],
    investments: [
      {
        id: 'inv-dairy-plant',
        slug: 'modern-commercial-dairy-processing',
        title_en: 'Highland Commercial Dairy & Cheese Processing Facility',
        title_am: 'ዘመናዊ የደጋ ወተት እና አይብ ማቀነባበሪያ ፋብሪካ',
        title_om: 'Warshaa Qophii Aannanii fi Dhadhaa Gaaraa',
        sector: 'Agro-processing',
        summary_en: 'Prime investment opportunity leveraging high milk yield in Angolela Tera highlands with dedicated municipal land allocation.',
        summary_am: 'በአንጎሌላ ተራ ደጋማ ስነ-ምህዳር ያለውን የተትረፈረፈ የወተት አቅርቦት ወደ ውድ እሴት ለመቀየር የተመደበ የኢንቨስትመንት መሬት።',
        summary_om: 'Carraa invastimantii aannanii qophii aannanii fi bu\'aawwan aannanii irratti xiyyeeffate.',
        description_en: 'The Woreda produces over 45,000 liters of milk daily from local smallholder cooperatives. An investor is sought to establish an integrated pasteurization, packaging, and cheese processing facility in the Chacha Industrial Corridor with direct highway access to Addis Ababa (110 km).',
        description_am: 'ወረዳው በቀን ከ45 ሺህ ሊትር በላይ ወተት የሚያመነጭ ሲሆን ባለሀብቶች በጫቻ የኢንዱስትሪ ኮሪደር ውስጥ ዘመናዊ የወተት ማጣሪያ እና ማሸጊያ እንዲያቋቁሙ አስፈላጊው ድጋፍ ይደረጋል።',
        availableLandHa: 4.5,
        incentives_en: '5-year income tax exemption, duty-free machinery import, pre-serviced water connection, 20-day expedited land lease certificate.',
        incentives_am: 'የ5 ዓመት የገቢ ግብር ነፃ መብት፣ ከቀረጥ ነፃ የፋብሪካ ማሽነሪ ማስገባት፣ የውሃ መስመር ዝርጋታ ድጋፍ።',
        procedures_en: '1. Submit formal project proposal to Woreda Investment Desk\n2. Feasibility verification within 5 working days\n3. Land lease execution and environmental license issuance.',
        procedures_am: '1. የፕሮጀክት ሀሳብ ለወረዳው ኢንቨስትመንት ጽ/ቤት ማቅረብ\n2. በ5 የሥራ ቀናት ውስጥ የአዋጭነት ማረጋገጫ\n3. የመሬት ይዞታ ውል መፈረምና የፈቃድ አሰጣጥ።',
        contactPerson: 'Director of Trade & Investment Office',
        contactPhone: '+251 58 661 0180',
        contactEmail: '',
        displayOrder: 1,
        status: 'PUBLISHED',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2025-02-15'),
      },
      {
        id: 'inv-grain-storage',
        slug: 'chilled-grain-silos-agro-logistics',
        title_en: 'Modern Grain Silos & Cold Storage Logistics Park',
        title_am: 'ዘመናዊ የእህል ማከማቻ ጎተራዎች እና የቀዝቃዛ ሎጂስቲክስ ፓርክ',
        title_om: 'Kuusaa Midhaanii fi Paarkii Loojistiksii',
        sector: 'Agro-processing & Logistics',
        summary_en: 'Strategic storage complex along the Addis Ababa - Dessie national economic corridor to reduce post-harvest grain losses.',
        summary_am: 'ከአዲስ አበባ ደሴ በሚወስደው ዋና አውራ ጎዳና ዳር የእህል ብክነትን ለመቀነስ የሚገነባ የጎተራና ሎጂስቲክስ ፓርክ።',
        availableLandHa: 8.0,
        incentives_en: 'Subsidized land rental rate, power grid substation access, regional tax investment credits.',
        incentives_am: 'የተመቻቸ የመሬት ኪራይ ተመን፣ የኤሌክትሪክ መስመር ዝርጋታ ድጋፍ፣ የክልል የታክስ ማበረታቻዎች።',
        procedures_en: 'Application handled through One-Stop Woreda Investment Service Center in Chacha.',
        contactPerson: 'Head of Economic Affairs Cabinet',
        contactPhone: '+251 58 661 0182',
        contactEmail: 'economy@angolela-tera.gov.et',
        displayOrder: 2,
        status: 'PUBLISHED',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2025-02-15'),
      },
    ],
    homepageSections: [
      { id: 'sec-hero', sectionKey: 'hero', title_en: 'Hero Slider', isEnabled: true, displayOrder: 1, updatedAt: new Date() },
      { id: 'sec-finder', sectionKey: 'action_finder', title_en: 'Citizen Action Finder', isEnabled: true, displayOrder: 2, updatedAt: new Date() },
      { id: 'sec-stats', sectionKey: 'at_a_glance', title_en: 'Key Profile & Stats', isEnabled: true, displayOrder: 3, updatedAt: new Date() },
      { id: 'sec-services', sectionKey: 'services', title_en: 'Public Services', isEnabled: true, displayOrder: 4, updatedAt: new Date() },
      { id: 'sec-companies', sectionKey: 'companies', title_en: 'Private Enterprises', isEnabled: true, displayOrder: 5, updatedAt: new Date() },
      { id: 'sec-partners', sectionKey: 'partners', title_en: 'Strategic Partners', isEnabled: true, displayOrder: 6, updatedAt: new Date() },
      { id: 'sec-leadership', sectionKey: 'leadership', title_en: 'Executive Leadership', isEnabled: true, displayOrder: 7, updatedAt: new Date() },
      { id: 'sec-investment', sectionKey: 'investment', title_en: 'Investment Corridor', isEnabled: true, displayOrder: 8, updatedAt: new Date() },
      { id: 'sec-news', sectionKey: 'news', title_en: 'News & Announcements', isEnabled: true, displayOrder: 9, updatedAt: new Date() },
    ],
    navigation: [
      { id: 'nav-home', label_en: 'Home', label_am: 'ዋና ገጽ', label_om: 'Fuula Dura', url: '/', displayOrder: 1, isActive: true, isExternal: false },
      { id: 'nav-about', label_en: 'About Woreda', label_am: 'ስለ ወረዳው', label_om: 'Waa\'ee Aanaa', url: '/about', displayOrder: 2, isActive: true, isExternal: false },
      { id: 'nav-kebeles', label_en: 'Kebele Administrations', label_am: 'የቀበሌ አስተዳደሮች', label_om: 'Bulchiinsa Gandoolee', url: '/kebeles', displayOrder: 3, isActive: true, isExternal: false },
      { id: 'nav-services', label_en: 'Citizen Services', label_am: 'የህዝብ አገልግሎቶች', label_om: 'Tajaajila Uummataa', url: '/services', displayOrder: 4, isActive: true, isExternal: false },
      { id: 'nav-investment', label_en: 'Investment', label_am: 'ኢንቨስትመንት', label_om: 'Invastimantii', url: '/investment', displayOrder: 5, isActive: true, isExternal: false },
      { id: 'nav-companies', label_en: 'Industry & Plants', label_am: 'ኢንዱስትሪና ንግድ', label_om: 'Indaastirii', url: '/companies', displayOrder: 6, isActive: true, isExternal: false },
      { id: 'nav-partners', label_en: 'Partners', label_am: 'አጋር ድርጅቶች', label_om: 'Michuuwwan', url: '/partners', displayOrder: 7, isActive: true, isExternal: false },
      { id: 'nav-news', label_en: 'News & Press', label_am: 'ዜናና መግለጫዎች', label_om: 'Oduu fi Ibsa', url: '/news', displayOrder: 8, isActive: true, isExternal: false },
      { id: 'nav-contact', label_en: 'Contact & Grievances', label_am: 'አድራሻና ቅሬታ', label_om: 'Quunnamtii', url: '/contact', displayOrder: 9, isActive: true, isExternal: false },
    ],
    users: [
      {
        id: 'user-superadmin',
        name: 'Chief Government Administrator',
        email: 'admin@angolela-tera.gov.et',
        passwordHash: '$2b$10$w0B7q/4VnfejU7JgE48p5uqQn871Qp83xW7G/n2WjN1qTz1hO7Bqy', // bcrypt for 'admin123'
        role: 'SUPER_ADMIN',
        officeId: null,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-education-editor',
        name: 'Ato Daniel Kebede (Education Bureau)',
        email: 'education.editor@angolela-tera.gov.et',
        passwordHash: '$2b$10$w0B7q/4VnfejU7JgE48p5uqQn871Qp83xW7G/n2WjN1qTz1hO7Bqy',
        role: 'OFFICE_EDITOR',
        officeId: 'education-office',
        isActive: true,
        createdAt: new Date().toISOString(),
      },
    ],
    permissions: [
      { id: 'p-1', userId: 'user-education-editor', resource: 'NEWS', canView: true, canCreate: true, canEdit: true, canDelete: false, canPublish: false, officeScopeId: 'education-office' },
      { id: 'p-2', userId: 'user-education-editor', resource: 'SERVICES', canView: true, canCreate: true, canEdit: true, canDelete: false, canPublish: false, officeScopeId: 'education-office' },
      { id: 'p-3', userId: 'user-education-editor', resource: 'DOCUMENTS', canView: true, canCreate: true, canEdit: true, canDelete: false, canPublish: false, officeScopeId: 'education-office' },
    ],
    tenders: [
      {
        id: 'tnd-01',
        bidNumber: 'ATW/OF/01/2018',
        title_en: 'Construction of Grade-1 Rural Health Post in Cheki Kebele',
        title_am: 'በጨቂ ቀበሌ ደረጃ-1 የጤና ኬላ ግንባታ ግልጽ ጨረታ',
        title_om: 'Ijaarsa Buufata Fayyaa Ganda Cakkii',
        procuringEntity: 'Woreda Office of Health',
        bidBondAmount: '50,000 ETB (CPO)',
        documentPrice: '200 ETB Non-refundable',
        publishedAt: new Date('2025-02-01'),
        closingDate: new Date('2025-04-15T10:00:00Z'),
        openingDate: new Date('2025-04-15T10:30:00Z'),
        documentUrl: '/uploads/tenders/tender-01-specifications.pdf',
        tenderStatus: 'ACTIVE',
        status: 'PUBLISHED',
        createdAt: new Date('2025-02-01'),
        updatedAt: new Date('2025-02-01'),
      },
      {
        id: 'tnd-02',
        bidNumber: 'ATW/OF/02/2018',
        title_en: 'Supply of High-Yield Certified Wheat & Barley Seeds for Belg Season',
        title_am: 'ለበልግ አዝመራ የሚውሉ የተመረጡ የስንዴ እና የገብስ ዘሮች ግዥ ጨረታ',
        title_om: 'Bittaa Sanyii Qamadii fi Garbuu Filatamaa',
        procuringEntity: 'Woreda Office of Agriculture & Natural Resources',
        bidBondAmount: '80,000 ETB (CPO)',
        documentPrice: '300 ETB Non-refundable',
        publishedAt: new Date('2025-02-10'),
        closingDate: new Date('2025-04-20T14:00:00Z'),
        openingDate: new Date('2025-04-20T14:30:00Z'),
        tenderStatus: 'ACTIVE',
        status: 'PUBLISHED',
        createdAt: new Date('2025-02-10'),
        updatedAt: new Date('2025-02-10'),
      },
    ],
    inquiries: [
      {
        id: 'inq-1',
        trackingCode: 'AT-GR-2026-0042',
        name: 'Ato Girma Wolde',
        email: 'girma.w@example.com',
        phone: '+251 91 123 4567',
        subject: 'Delay in Rural Land Holding Certificate Issuance',
        message: 'I applied for land certificate subdivision 3 weeks ago in Kotu Kebele, but processing has exceeded the citizen charter 7-day limit.',
        category: 'grievance',
        status: 'UNDER_REVIEW',
        responseNotes: 'Forwarded to Rural Land Administration Desk for immediate verification and fast-track inspection.',
        assignedOfficeId: 'land-administration-office',
        createdAt: new Date('2025-03-01').toISOString(),
        updatedAt: new Date('2025-03-02').toISOString(),
      },
    ],
    siteSettings: {
      government_name_en: 'Angolela Tera Woreda Administration',
      government_name_am: 'የአንጎሌላ ተራ ወረዳ አስተዳደር',
      government_name_om: 'Bulchiinsa Aanaa Angolallaa Xaraa',
      capital_city_en: 'Chacha',
      capital_city_am: 'ጫቻ',
      zone_name_en: 'North Shewa Zone, Amhara Region, Ethiopia',
      zone_name_am: 'ሰሜን ሸዋ ዞን፣ አማራ ክልል፣ ኢትዮጵያ',
      contact_phone: '+251 (0) 58 661 0100',
      contact_email: 'info@angolela-tera.gov.et',
      emergency_police: '991 / +251 58 661 0110',
      emergency_health: '907 / +251 58 661 0112',
      working_hours_en: 'Monday – Friday: 8:30 AM – 5:30 PM (Closed 12:30 – 1:30 PM)',
      working_hours_am: 'ከሰኞ – አርብ፡ ከጠዋቱ 2:30 – 11:30 (የምሳ እረፍት 6:30 – 7:30)',
    },
    auditLogs: [
      {
        id: 'log-seed',
        userId: 'user-superadmin',
        userName: 'Chief Government Administrator',
        action: 'SYSTEM_INITIALIZATION',
        entityType: 'System',
        entityId: 'root',
        notes: 'Angolela Tera Government Digital Portal initialized successfully.',
        ipAddress: '127.0.0.1',
        createdAt: new Date().toISOString(),
      },
    ],
    tourism: [
      {
        id: 'tour-debre-sina',
        slug: 'debre-sina-monastery',
        name_en: 'Debre Sina Monastery & Church Complex',
        name_am: 'ደብረ ሲና ገዳምና ቤተ ክርስቲያን ሕንፃ',
        name_om: 'Waldaa Kiristaanaa Dabree Siinaafi Gumbii',
        category: 'Religious Heritage',
        description_en: 'One of the oldest Orthodox Tewahedo monasteries in North Shewa, dating to the early Aksumite era. The complex features remarkable medieval ecclesiastical art, illuminated manuscripts, and sacred artefacts. Perched atop a highland ridge at 2,900m elevation, the monastery commands breathtaking views of the surrounding valleys.',
        description_am: 'በሰሜን ሸዋ ከሚገኙ ጥንታዊ የኦርቶዶክስ ተዋህዶ ቤተ ክርስቲያናት አንዱ ሲሆን ልዩ የሆኑ ጥንታዊ ቤተ ክርስቲያናዊ ሥዕሎችና ሐራ ቅርሶችን ያቀፈ ነው። ደብሩ ከ2,900 ሜ ተራራ ላይ ሆኖ ተፈጥሮ መልክዓ ምድሩን ያጌጠ ነው።',
        location_en: 'Northern highlands of Angolela Tera, accessible via Chacha–Ankober road.',
        mapCoordinates: '9.7412° N, 39.7339° E',
        activities_en: ['Pilgrimage and religious tourism', 'Photography of ecclesiastical art', 'Highland trekking', 'Manuscript viewing (by appointment)'],
        nearbyFacilities_en: ['Chacha town (32 km)', 'Basic guesthouse available', 'Local guide services'],
        culturalSignificance_en: 'Important site for Ethiopian Orthodox Christians; hosts major celebrations on Lideta Maryam and Timkat festivals attracting pilgrims from across North Shewa Zone.',
        bestVisitMonths: 'October–January, April–June',
        coverImage: '/images/tourism-placeholder.jpg',
        displayOrder: 1,
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'tour-chacha-falls',
        slug: 'chacha-river-waterfalls',
        name_en: 'Chacha River Gorge & Waterfalls',
        name_am: 'የጫቻ ወንዝ ፏፏቴ',
        name_om: 'Buufata Laga Caccetti',
        category: 'Natural Landscape',
        description_en: 'The Chacha River carves dramatic gorges through basalt formations before cascading in a spectacular multi-tiered waterfall system. The surrounding gallery forest is home to Gelada baboons, Colobus monkeys, and rare highland birds. A popular destination for eco-tourism and adventure hiking groups.',
        description_am: 'የጫቻ ወንዝ በቤዛልት ቋጥኞች ውስጥ ልዩ ሸለቆ ፈጥሮ ወደ ብዙ ደረጃ ፏፏቴ ይፈሳል። ዙሪያው ጀሌዳ ዝንጀሮዎች፣ ቆሎቡስ ዝንጀሮዎችና ልዩ ደጋ ወፎች ያሉበት ጫካ ይዞ ይገኛል።',
        location_en: '14 km west of Chacha town along the lower Chacha basin.',
        mapCoordinates: '9.6890° N, 39.6721° E',
        activities_en: ['Waterfall photography', 'Bird watching (250+ species)', 'Eco-trekking', 'Gelada baboon observation'],
        nearbyFacilities_en: ['Chacha town (14 km)', 'Picnic area with basic amenities', 'Guided tours available'],
        culturalSignificance_en: 'Sacred site in local Amhara tradition; local communities hold annual clean-up and conservation days.',
        bestVisitMonths: 'October–February (dry season for clear views)',
        coverImage: '/images/tourism-placeholder.jpg',
        displayOrder: 2,
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'tour-highland-agro',
        slug: 'highland-agro-ecotourism-route',
        name_en: 'Angolela Highland Agro-Ecotourism Route',
        name_am: 'አንጎሌላ ደጋ አግሮ-ኢኮቱሪዝም መስመር',
        name_om: 'Karaa Eko-Tuuriizimii Qonnaa Golee Gaaraa Angolallaa',
        category: 'Agro-Tourism',
        description_en: 'A curated rural tourism circuit connecting traditional highland farming communities. Visitors observe highland barley harvesting, certified seed multiplication plots, traditional geba architecture, artisanal cheese production, and participate in community coffee ceremonies. An immersive experience of highland Ethiopian rural life at 2,600–3,100m altitude.',
        description_am: 'ባህላዊ የደጋ ግብርና ማህበረሰቦችን የሚያስጎበኝ የገጠር ቱሪዝም ዙር። ጎብኚዎች የገብስ ምርት፣ ባህላዊ ቤቶች፣ አይብ ምርትና ባህላዊ ቡና ስነ-ሥርዓትን ያዩና ይሳተፋሉ።',
        location_en: 'Circuits operating from Chacha town through Cheki, Geyet, and Kotu kebeles.',
        mapCoordinates: '9.7000° N, 39.7000° E',
        activities_en: ['Farm visits and harvest participation', 'Traditional architecture documentation', 'Artisanal dairy and food production tours', 'Community coffee ceremony', 'Highland bird watching'],
        nearbyFacilities_en: ['Community guesthouses in Chacha', 'Local guide cooperative available', 'Traditional meals provided by host families'],
        culturalSignificance_en: 'Supports income diversification for highland farming communities while preserving traditional knowledge of cereal cultivation.',
        bestVisitMonths: 'September–November (harvest season), April–May (planting ceremonies)',
        coverImage: '/images/tourism-placeholder.jpg',
        displayOrder: 3,
        status: 'PUBLISHED',
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2025-01-01').toISOString(),
      },
    ],
    developmentProjects: [
      {
        id: 'proj-road-1',
        slug: 'chacha-kebele-road-access',
        title_en: 'All-Weather Rural Road Connectivity Program',
        title_am: 'ዓመቱን ሙሉ የሚሠራ የገጠር መንገድ ፕሮጀክት',
        sector: 'Infrastructure',
        description_en: 'Construction of 47 km of all-weather gravel roads connecting 14 kebeles to the main Addis Ababa–Dessie highway, eliminating seasonal road closure that previously cut off farming communities during the rainy season.',
        description_am: 'ከ14 ቀበሌዎች ወደ ዋናው አዲስ አበባ–ደሴ ሀይዌይ የሚወስዱ 47 ኪ.ሜ ዓመቱን ሙሉ የሚሠሩ የጠጠር መንገዶችን ግንባታ።',
        location_en: 'Various kebeles across Angolela Tera Woreda',
        budget_etb: 45000000,
        fundingSource: 'Amhara Regional Road Authority + URRAP Fund',
        contractor: 'Amhara Road Construction Enterprise',
        startDate: '2024-03-01',
        expectedCompletion: '2026-09-30',
        status: 'IN_PROGRESS',
        progressPercent: 64,
        beneficiaries: '28,000 rural residents across 14 kebeles',
        images: [],
        displayOrder: 1,
        createdAt: new Date('2024-01-01').toISOString(),
        updatedAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'proj-water-1',
        slug: 'clean-water-scheme-rural',
        title_en: 'Multi-Village Piped Water Supply Scheme',
        title_am: 'ባለ ብዙ ቀበሌ የቧንቧ ውሃ አቅርቦት ፕሮጀክት',
        sector: 'Water & Sanitation',
        description_en: 'Gravity-fed piped water supply system drawing from highland spring sources to serve 8 rural kebeles currently relying on unprotected surface water sources. Includes construction of 24 community standpipes and household connection infrastructure.',
        description_am: 'ከደጋ ምንጮች ውሃ ሳቦ ለ8 ቀበሌዎች ንጹህ ቧንቧ ውሃ ለማቅረብ የሚያስችል ፕሮጀክት። 24 የጋራ ቧንቧዎችና የቤት ግንኙነት ሥርዓት ያካትታል።',
        location_en: 'Northern and Eastern kebeles of Angolela Tera',
        budget_etb: 28000000,
        fundingSource: 'Federal Ministry of Water + WASH program',
        contractor: 'Amhara Water Wells Construction Enterprise',
        startDate: '2023-10-01',
        expectedCompletion: '2025-12-31',
        status: 'IN_PROGRESS',
        progressPercent: 82,
        beneficiaries: '19,400 residents (8 kebeles)',
        images: [],
        displayOrder: 2,
        createdAt: new Date('2023-10-01').toISOString(),
        updatedAt: new Date('2025-01-01').toISOString(),
      },
      {
        id: 'proj-school-1',
        slug: 'primary-school-construction-2025',
        title_en: '2-Primary School Construction & Expansion',
        title_am: 'ሁለት የመጀመሪያ ደረጃ ት/ቤቶች ግንባታ',
        sector: 'Education',
        description_en: 'Construction of two new 8-classroom primary school buildings in underserved kebeles, plus expansion of existing Chacha Primary School with a modern science laboratory and library facility.',
        description_am: 'ለሁለት ቀበሌዎች ሁለት አዳዲስ የ8 ክፍል የመጀመሪያ ደረጃ ት/ቤቶች ግንባታ፣ ምናምን የጫቻ ት/ቤት ሳይንስ ላቦራቶሪ ማስፋፊያ።',
        location_en: 'Geyet Kebele, Kotu Kebele, and Chacha Town',
        budget_etb: 18500000,
        fundingSource: 'Amhara Education Bureau + Community Contribution',
        contractor: 'Woreda Engineering Team',
        startDate: '2025-01-15',
        expectedCompletion: '2025-10-30',
        status: 'COMPLETED',
        progressPercent: 100,
        beneficiaries: '3,200 school-age children',
        images: [],
        displayOrder: 3,
        createdAt: new Date('2025-01-15').toISOString(),
        updatedAt: new Date('2025-10-30').toISOString(),
      },
      {
        id: 'proj-health-1',
        slug: 'chacha-health-center-upgrade',
        title_en: 'Chacha Health Center Capacity Expansion',
        title_am: 'የጫቻ ጤና ጣቢያ አቅም ማጎልበቻ ፕሮጀክት',
        sector: 'Health',
        description_en: 'Expansion of Chacha Health Center to a primary hospital level with addition of maternity ward (20 beds), surgical theatre, and modern diagnostic laboratory. Targets reducing referrals to Debre Berhan Regional Hospital by 40%.',
        description_am: 'የጫቻ ጤና ጣቢያን ወደ ዋና ሆስፒታል ደረጃ ማሳደግ፤ 20 አልጋ ያለው የወሊድ ክፍል፣ ቀዶ ጥገና ቤትና ዘመናዊ ምርመራ ቤት ማካተት። ወደ ደብረ ብርሃን ሆስፒታል የሚደረጉ ሪፈራሎችን በ40% ለመቀነስ ያለመ።',
        location_en: 'Chacha Town, Angolela Tera Woreda',
        budget_etb: 62000000,
        fundingSource: 'Federal Ministry of Health + PEPFAR',
        contractor: 'Amhara Health Facilities Construction Agency',
        startDate: '2025-06-01',
        expectedCompletion: '2027-03-31',
        status: 'IN_PROGRESS',
        progressPercent: 18,
        beneficiaries: '140,000 residents (entire Woreda)',
        images: [],
        displayOrder: 4,
        createdAt: new Date('2025-06-01').toISOString(),
        updatedAt: new Date('2025-06-01').toISOString(),
      },
    ],
    documents: [
      {
        id: 'doc-vital-events',
        title_en: 'Citizen Vital Events Application Form (Birth, Marriage, Death)',
        title_am: 'የነዋሪዎች ወሳኝ ኩነት ምዝገባ ማመልከቻ ቅጽ (ልደት፣ ጋብቻ፣ ሞት)',
        category: 'Application Forms',
        fileUrl: '/uploads/documents/vital-events-form.pdf',
        fileSize: '420 KB',
        fileType: 'PDF',
        officeName: 'Vital Events Registration Desk',
        description_en: 'Official bilingual template required to initiate civil status registration and credential verification.',
        description_am: 'የሲቪል ምዝገባና ማረጋገጫ ለመጀመር የሚያገለግል ይፋዊ የሁለት ቋንቋ ቅጽ።',
        status: 'PUBLISHED',
        publishedAt: '2025-01-10',
        displayOrder: 1,
      },
      {
        id: 'doc-land-holding',
        title_en: 'Rural Land Holding Transfer & Inheritance Declaration Form',
        title_am: 'የገጠር መሬት ይዞታ ማስተላለፊያ እና የውርስ ማስታወቂያ ቅጽ',
        category: 'Application Forms',
        fileUrl: '/uploads/documents/land-transfer-form.pdf',
        fileSize: '560 KB',
        fileType: 'PDF',
        officeName: 'Land Administration & Use Bureau',
        description_en: 'Mandatory standard documentation for parcel division, family inheritance transfer, and boundary verification.',
        description_am: 'የይዞታ ክፍፍል፣ የቤተሰብ ውርስ ዝውውርና የድንበር ማረጋገጫ መስፈርቶችን የያዘ ይፋዊ ሰነድ።',
        status: 'PUBLISHED',
        publishedAt: '2025-01-15',
        displayOrder: 2,
      },
      {
        id: 'doc-annual-budget',
        title_en: 'Angolela Tera Woreda Annual Development Plan & Budget (2025/2026)',
        title_am: 'የአንጎሌላ ተራ ወረዳ የ2017/2018 ዓ.ም ዓመታዊ የልማት እቅድና በጀት',
        category: 'Annual Reports',
        fileUrl: '/uploads/documents/annual-budget-2025-26.pdf',
        fileSize: '1.8 MB',
        fileType: 'PDF',
        officeName: 'Finance & Economic Development Office',
        description_en: 'Approved fiscal budget breakdown detailing capital allocations, kebele expenditure frameworks, and revenue projections.',
        description_am: 'የካፒታል መድቦችን፣ የቀበሌ ወጪዎችንና የገቢ ግምቶችን የያዘ የጸደቀ የበጀት ሰነድ።',
        status: 'PUBLISHED',
        publishedAt: '2025-02-01',
        displayOrder: 3,
      },
      {
        id: 'doc-licensing-directive',
        title_en: 'Directive on Commercial Business Licensing & Market Regulation',
        title_am: 'የንግድ ስራ ፈቃድ አሰጣጥና የገበያ ቁጥጥር መመሪያ',
        category: 'Legal Directives',
        fileUrl: '/uploads/documents/commercial-licensing-directive.pdf',
        fileSize: '780 KB',
        fileType: 'PDF',
        officeName: 'Trade & Investment Office',
        description_en: 'Statutory regulatory provisions governing trade competence, commercial premises standards, and consumer protection.',
        description_am: 'የንግድ ብቃት፣ የንግድ ቦታ መስፈርቶችና የሸማቾች ጥበቃን የሚቆጣጠር ህጋዊ ድንጋጌ።',
        status: 'PUBLISHED',
        publishedAt: '2025-02-15',
        displayOrder: 4,
      },
    ],
    sliders: [
      {
        id: 'slider-1',
        title_en: 'Welcome to Angolela Tera Woreda Digital Government Portal',
        title_am: 'እንኳን ወደ አንጎሌላ ተራ ወረዳ ዲጂታል መንግሥት ፖርታል በደህና መጡ',
        subtitle_en: 'North Shewa Zone, Amhara Region • Driving Agricultural Modernization, Strategic Industrial Investment, and Accessible Public Services.',
        subtitle_am: 'ሰሜን ሸዋ ዞን፣ አማራ ክልል • የግብርና ዘመናዊነትን፣ ስትራቴጂካዊ የኢንዱስትሪ ኢንቨስትመንትንና ቀልጣፋ የህዝብ አገልግሎትን ማረጋገጥ።',
        imageUrl: '/images/hero-slider-1.jpg',
        buttonText_en: 'Explore Government Services',
        buttonText_am: 'የመንግሥት አገልግሎቶችን ይመልከቱ',
        buttonUrl: '/services',
        displayOrder: 1,
        isActive: true,
      },
      {
        id: 'slider-2',
        title_en: 'Chacha Strategic Agro-Industrial & Manufacturing Corridor',
        title_am: 'የጫቻ ስትራቴጂካዊ የአግሮ-ኢንዱስትሪና የማኑፋክቸሪንግ ኮሪደር',
        subtitle_en: '110 km from Addis Ababa on the main trunk highway, offering serviced industrial land, reliable spring water, and dedicated investor facilitation.',
        subtitle_am: 'ከአዲስ አበባ 110 ኪ.ሜ ብቻ ርቀት ላይ የሚገኝ፣ የተሟላ መሰረተ ልማትና ለባለሀብቶች ምቹ ድጋፍ የሚሰጥበት የኢንቨስትመንት ቀጠና።',
        imageUrl: '/images/hero-slider-2.jpg',
        buttonText_en: 'Investment Guide & Incentives',
        buttonText_am: 'የኢንቨስትመንት መመሪያና ማበረታቻዎች',
        buttonUrl: '/investment',
        displayOrder: 2,
        isActive: true,
      },
      {
        id: 'slider-3',
        title_en: 'Historic Royal Shewa Heritage & Highland Ecotourism',
        title_am: 'የቀዳማዊ ሸዋ ታሪካዊ ቅርስና የደጋ የተፈጥሮ ቱሪዝም',
        subtitle_en: 'Discover King Sahle Selassie historic palace grounds, scenic Chacha river waterfalls, and ancient highland monasteries.',
        subtitle_am: 'የንጉሥ ሳህለ ሥላሴ ታሪካዊ መቀመጫን፣ አስደናቂውን የጫቻ ወንዝ ፏፏቴና ጥንታዊ ገዳማትን ይጎብኙ።',
        imageUrl: '/images/hero-slider-3.jpg',
        buttonText_en: 'Discover Tourism Destinations',
        buttonText_am: 'የቱሪዝም መስህቦችን ይጎብኙ',
        buttonUrl: '/tourism',
        displayOrder: 3,
        isActive: true,
      },
    ],
  }
}

// Read store safely
export function getStore(): StoreData {
  try {
    if (!fs.existsSync(STORE_PATH)) {
      const initial = getInitialStore()
      fs.writeFileSync(STORE_PATH, JSON.stringify(initial, null, 2), 'utf8')
      return initial
    }
    const raw = fs.readFileSync(STORE_PATH, 'utf8')
    const parsed = JSON.parse(raw)
    const initial = getInitialStore()
    return {
      ...initial,
      ...parsed,
      companies:
        Array.isArray(parsed.companies) && parsed.companies.length > 0
          ? parsed.companies
          : initial.companies,
    }
  } catch (err) {
    console.error('Error reading data store, using fallback:', err)
    return getInitialStore()
  }
}

// Write store safely (atomic write pattern)
export function saveStore(data: StoreData): void {
  try {
    const tempPath = `${STORE_PATH}.tmp`
    fs.writeFileSync(tempPath, JSON.stringify(data, null, 2), 'utf8')
    fs.renameSync(tempPath, STORE_PATH)
  } catch (err) {
    console.error('Error writing data store:', err)
  }
}

// ============================================================
// DATA ACCESS & MUTATION FUNCTIONS
// ============================================================

// --- OFFICES ---
export function getOffices() {
  return getStore().offices
}
export function getOfficeBySlug(slug: string) {
  return getStore().offices.find((o) => o.slug === slug)
}
export function createOffice(item: any, user?: string) {
  const store = getStore()
  store.offices.push(item)
  recordAudit(store, user, 'CREATE', 'Office', item.slug, `Created sector office: ${item.name_en}`)
  saveStore(store)
  return item
}
export function updateOffice(slug: string, updates: any, user?: string) {
  const store = getStore()
  const idx = store.offices.findIndex((o) => o.slug === slug)
  if (idx !== -1) {
    store.offices[idx] = { ...store.offices[idx], ...updates }
    recordAudit(store, user, 'UPDATE', 'Office', slug, `Updated sector office: ${slug}`)
    saveStore(store)
    return store.offices[idx]
  }
  return null
}
export function deleteOffice(slug: string, user?: string) {
  const store = getStore()
  store.offices = store.offices.filter((o) => o.slug !== slug)
  recordAudit(store, user, 'DELETE', 'Office', slug, `Deleted sector office: ${slug}`)
  saveStore(store)
  return true
}

// --- LEADERSHIP ---
export function getLeadership() {
  return getStore().leadership.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
}
export function createLeader(item: any, user?: string) {
  const store = getStore()
  store.leadership.push(item)
  recordAudit(store, user, 'CREATE', 'Leadership', item.id, `Added leader: ${item.name_en}`)
  saveStore(store)
  return item
}
export function updateLeader(id: string, updates: any, user?: string) {
  const store = getStore()
  const idx = store.leadership.findIndex((l) => l.id === id)
  if (idx !== -1) {
    store.leadership[idx] = { ...store.leadership[idx], ...updates }
    recordAudit(store, user, 'UPDATE', 'Leadership', id, `Updated leader profile: ${id}`)
    saveStore(store)
    return store.leadership[idx]
  }
  return null
}
export function deleteLeader(id: string, user?: string) {
  const store = getStore()
  store.leadership = store.leadership.filter((l) => l.id !== id)
  recordAudit(store, user, 'DELETE', 'Leadership', id, `Removed leader profile: ${id}`)
  saveStore(store)
  return true
}

// --- SERVICES ---
export function getServices() {
  return getStore().services
}
export function getServiceBySlug(slug: string) {
  return getStore().services.find((s) => s.slug === slug)
}
export function createService(item: any, user?: string) {
  const store = getStore()
  store.services.push(item)
  recordAudit(store, user, 'CREATE', 'Service', item.slug, `Created public service: ${item.title_en}`)
  saveStore(store)
  return item
}
export function updateService(slug: string, updates: any, user?: string) {
  const store = getStore()
  const idx = store.services.findIndex((s) => s.slug === slug)
  if (idx !== -1) {
    store.services[idx] = { ...store.services[idx], ...updates }
    recordAudit(store, user, 'UPDATE', 'Service', slug, `Updated public service: ${slug}`)
    saveStore(store)
    return store.services[idx]
  }
  return null
}
export function deleteService(slug: string, user?: string) {
  const store = getStore()
  store.services = store.services.filter((s) => s.slug !== slug)
  recordAudit(store, user, 'DELETE', 'Service', slug, `Deleted public service: ${slug}`)
  saveStore(store)
  return true
}

// --- NEWS ---
export function getNews() {
  return getStore().news
}
export function getNewsBySlug(slug: string) {
  return getStore().news.find((n) => n.slug === slug)
}
export function createNews(item: any, user?: string) {
  const store = getStore()
  store.news.unshift(item)
  recordAudit(store, user, 'CREATE', 'News', item.slug, `Published official news: ${item.title_en}`)
  saveStore(store)
  return item
}
export function updateNews(slug: string, updates: any, user?: string) {
  const store = getStore()
  const idx = store.news.findIndex((n) => n.slug === slug)
  if (idx !== -1) {
    store.news[idx] = { ...store.news[idx], ...updates }
    recordAudit(store, user, 'UPDATE', 'News', slug, `Updated news article: ${slug}`)
    saveStore(store)
    return store.news[idx]
  }
  return null
}
export function deleteNews(slug: string, user?: string) {
  const store = getStore()
  store.news = store.news.filter((n) => n.slug !== slug)
  recordAudit(store, user, 'DELETE', 'News', slug, `Deleted news article: ${slug}`)
  saveStore(store)
  return true
}

// --- KEBELES ---
export function getKebeles(): KebeleItem[] {
  return getStore().kebeles.sort((a, b) => a.displayOrder - b.displayOrder)
}
export function getKebeleBySlug(slug: string): KebeleItem | undefined {
  return getStore().kebeles.find((k) => k.slug === slug)
}
export function createKebele(item: KebeleItem, user?: string) {
  const store = getStore()
  store.kebeles.push(item)
  recordAudit(store, user, 'CREATE', 'Kebele', item.slug, `Created kebele profile: ${item.name_en}`)
  saveStore(store)
  return item
}
export function updateKebele(slug: string, updates: Partial<KebeleItem>, user?: string) {
  const store = getStore()
  const idx = store.kebeles.findIndex((k) => k.slug === slug)
  if (idx !== -1) {
    store.kebeles[idx] = { ...store.kebeles[idx], ...updates, updatedAt: new Date() }
    recordAudit(store, user, 'UPDATE', 'Kebele', slug, `Updated kebele profile: ${slug}`)
    saveStore(store)
    return store.kebeles[idx]
  }
  return null
}
export function deleteKebele(slug: string, user?: string) {
  const store = getStore()
  store.kebeles = store.kebeles.filter((k) => k.slug !== slug)
  recordAudit(store, user, 'DELETE', 'Kebele', slug, `Deleted kebele profile: ${slug}`)
  saveStore(store)
  return true
}

// --- COMPANIES ---
export function getCompanies() {
  return getStore().companies.sort((a, b) => a.displayOrder - b.displayOrder)
}
export function getCompanyById(id: string) {
  return getStore().companies.find((c) => c.id === id)
}
export function createCompany(item: any, user?: string) {
  const store = getStore()
  store.companies.push(item)
  recordAudit(store, user, 'CREATE', 'Company', item.id, `Added private enterprise: ${item.name_en}`)
  saveStore(store)
  return item
}
export function updateCompany(id: string, updates: any, user?: string) {
  const store = getStore()
  const idx = store.companies.findIndex((c) => c.id === id)
  if (idx !== -1) {
    store.companies[idx] = { ...store.companies[idx], ...updates, updatedAt: new Date() }
    recordAudit(store, user, 'UPDATE', 'Company', id, `Updated private enterprise: ${id}`)
    saveStore(store)
    return store.companies[idx]
  }
  return null
}
export function deleteCompany(id: string, user?: string) {
  const store = getStore()
  store.companies = store.companies.filter((c) => c.id !== id)
  recordAudit(store, user, 'DELETE', 'Company', id, `Removed private enterprise: ${id}`)
  saveStore(store)
  return true
}

// --- PARTNERS ---
export function getPartners() {
  return getStore().partners.sort((a, b) => a.displayOrder - b.displayOrder)
}
export function createPartner(item: any, user?: string) {
  const store = getStore()
  store.partners.push(item)
  recordAudit(store, user, 'CREATE', 'Partner', item.id, `Registered partner organization: ${item.name_en}`)
  saveStore(store)
  return item
}
export function updatePartner(id: string, updates: any, user?: string) {
  const store = getStore()
  const idx = store.partners.findIndex((p) => p.id === id)
  if (idx !== -1) {
    store.partners[idx] = { ...store.partners[idx], ...updates, updatedAt: new Date() }
    recordAudit(store, user, 'UPDATE', 'Partner', id, `Updated partner profile: ${id}`)
    saveStore(store)
    return store.partners[idx]
  }
  return null
}
export function deletePartner(id: string, user?: string) {
  const store = getStore()
  store.partners = store.partners.filter((p) => p.id !== id)
  recordAudit(store, user, 'DELETE', 'Partner', id, `Removed partner profile: ${id}`)
  saveStore(store)
  return true
}

// --- INVESTMENTS ---
export function getInvestments(): InvestmentOpportunityItem[] {
  return getStore().investments.sort((a, b) => a.displayOrder - b.displayOrder)
}
export function getInvestmentBySlug(slug: string): InvestmentOpportunityItem | undefined {
  return getStore().investments.find((i) => i.slug === slug)
}
export function createInvestment(item: InvestmentOpportunityItem, user?: string) {
  const store = getStore()
  store.investments.push(item)
  recordAudit(store, user, 'CREATE', 'Investment', item.slug, `Posted investment opportunity: ${item.title_en}`)
  saveStore(store)
  return item
}
export function updateInvestment(slug: string, updates: Partial<InvestmentOpportunityItem>, user?: string) {
  const store = getStore()
  const idx = store.investments.findIndex((i) => i.slug === slug)
  if (idx !== -1) {
    store.investments[idx] = { ...store.investments[idx], ...updates, updatedAt: new Date() }
    recordAudit(store, user, 'UPDATE', 'Investment', slug, `Updated investment opportunity: ${slug}`)
    saveStore(store)
    return store.investments[idx]
  }
  return null
}
export function deleteInvestment(slug: string, user?: string) {
  const store = getStore()
  store.investments = store.investments.filter((i) => i.slug !== slug)
  recordAudit(store, user, 'DELETE', 'Investment', slug, `Removed investment opportunity: ${slug}`)
  saveStore(store)
  return true
}

// --- HOMEPAGE SECTION CONFIGURATION ---
export function getHomepageSections(): HomepageSectionConfigItem[] {
  return getStore().homepageSections.sort((a, b) => a.displayOrder - b.displayOrder)
}
export function toggleHomepageSection(sectionKey: string, isEnabled: boolean, user?: string) {
  const store = getStore()
  const sec = store.homepageSections.find((s) => s.sectionKey === sectionKey)
  if (sec) {
    sec.isEnabled = isEnabled
    sec.updatedAt = new Date()
    recordAudit(store, user, 'UPDATE', 'HomepageSection', sectionKey, `Toggled homepage section [${sectionKey}] to ${isEnabled ? 'ON' : 'OFF'}`)
    saveStore(store)
    return sec
  }
  return null
}
export function reorderHomepageSections(orderedKeys: string[], user?: string) {
  const store = getStore()
  orderedKeys.forEach((key, index) => {
    const sec = store.homepageSections.find((s) => s.sectionKey === key)
    if (sec) {
      sec.displayOrder = index + 1
      sec.updatedAt = new Date()
    }
  })
  recordAudit(store, user, 'UPDATE', 'HomepageSection', 'reorder', 'Reordered homepage sections sequence')
  saveStore(store)
  return getHomepageSections()
}

// --- NAVIGATION MENU MANAGEMENT ---
export function getNavigation(): NavigationMenuItem[] {
  return getStore().navigation.filter((n) => n.isActive).sort((a, b) => a.displayOrder - b.displayOrder)
}
export function getAllNavigation(): NavigationMenuItem[] {
  return getStore().navigation.sort((a, b) => a.displayOrder - b.displayOrder)
}
export function createNavigationItem(item: NavigationMenuItem, user?: string) {
  const store = getStore()
  store.navigation.push(item)
  recordAudit(store, user, 'CREATE', 'Navigation', item.id, `Created menu link: ${item.label_en}`)
  saveStore(store)
  return item
}
export function updateNavigationItem(id: string, updates: Partial<NavigationMenuItem>, user?: string) {
  const store = getStore()
  const idx = store.navigation.findIndex((n) => n.id === id)
  if (idx !== -1) {
    store.navigation[idx] = { ...store.navigation[idx], ...updates }
    recordAudit(store, user, 'UPDATE', 'Navigation', id, `Updated menu link: ${id}`)
    saveStore(store)
    return store.navigation[idx]
  }
  return null
}
export function deleteNavigationItem(id: string, user?: string) {
  const store = getStore()
  store.navigation = store.navigation.filter((n) => n.id !== id)
  recordAudit(store, user, 'DELETE', 'Navigation', id, `Deleted menu link: ${id}`)
  saveStore(store)
  return true
}

// --- USERS & GRANULAR PERMISSIONS ---
export function getUsers(): UserAccount[] {
  return getStore().users
}
export function getUserById(id: string): UserAccount | undefined {
  return getStore().users.find((u) => u.id === id)
}
export function createUser(user: UserAccount, permissions: AdminPermissionItem[] = [], actor?: string) {
  const store = getStore()
  store.users.push(user)
  if (permissions.length > 0) {
    store.permissions.push(...permissions)
  }
  recordAudit(store, actor, 'CREATE', 'User', user.id, `Created admin account [${user.email}] with role: ${user.role}`)
  saveStore(store)
  return user
}
export function toggleUserStatus(userId: string, isActive: boolean, actor?: string) {
  const store = getStore()
  const u = store.users.find((user) => user.id === userId)
  if (u) {
    u.isActive = isActive
    recordAudit(store, actor, 'UPDATE', 'User', userId, `Changed account active status to: ${isActive}`)
    saveStore(store)
    return u
  }
  return null
}
export function getUserPermissions(userId: string): AdminPermissionItem[] {
  return getStore().permissions.filter((p) => p.userId === userId)
}
export function setUserPermission(perm: AdminPermissionItem, actor?: string) {
  const store = getStore()
  const idx = store.permissions.findIndex((p) => p.userId === perm.userId && p.resource === perm.resource)
  if (idx !== -1) {
    store.permissions[idx] = perm
  } else {
    store.permissions.push(perm)
  }
  recordAudit(store, actor, 'UPDATE', 'Permission', `${perm.userId}:${perm.resource}`, `Updated permissions for resource ${perm.resource}`)
  saveStore(store)
  return perm
}
export function checkPermission(
  userId: string,
  role: UserRole,
  resource: AdminResource,
  action: 'view' | 'create' | 'edit' | 'delete' | 'publish',
  officeId?: string | null
): boolean {
  if (role === 'SUPER_ADMIN') return true
  if (role === 'VIEWER' && action === 'view') return true
  if (role === 'VIEWER') return false

  const perms = getUserPermissions(userId)
  const perm = perms.find((p) => p.resource === resource)
  if (!perm) return false

  if (perm.officeScopeId && officeId && perm.officeScopeId !== officeId) {
    return false
  }

  switch (action) {
    case 'view': return perm.canView
    case 'create': return perm.canCreate
    case 'edit': return perm.canEdit
    case 'delete': return perm.canDelete
    case 'publish': return perm.canPublish
    default: return false
  }
}

// --- TENDERS ---
export function getTenders(): TenderItem[] {
  return getStore().tenders.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
}
export function createTender(item: TenderItem, user?: string) {
  const store = getStore()
  store.tenders.unshift(item)
  recordAudit(store, user, 'CREATE', 'Tender', item.bidNumber, `Published tender announcement: ${item.bidNumber}`)
  saveStore(store)
  return item
}
export function updateTender(id: string, updates: Partial<TenderItem>, user?: string) {
  const store = getStore()
  const idx = store.tenders.findIndex((t) => t.id === id)
  if (idx !== -1) {
    store.tenders[idx] = { ...store.tenders[idx], ...updates, updatedAt: new Date() }
    recordAudit(store, user, 'UPDATE', 'Tender', id, `Updated tender: ${id}`)
    saveStore(store)
    return store.tenders[idx]
  }
  return null
}
export function deleteTender(id: string, user?: string) {
  const store = getStore()
  store.tenders = store.tenders.filter((t) => t.id !== id)
  recordAudit(store, user, 'DELETE', 'Tender', id, `Removed tender: ${id}`)
  saveStore(store)
  return true
}

// --- CITIZEN GRIEVANCES & TRACKING ---
export function getInquiries(): CitizenInquiry[] {
  return getStore().inquiries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}
export function getInquiryByTrackingCode(trackingCode: string): CitizenInquiry | undefined {
  return getStore().inquiries.find((i) => i.trackingCode.toUpperCase() === trackingCode.trim().toUpperCase())
}
export function createInquiry(inquiry: Omit<CitizenInquiry, 'id' | 'trackingCode' | 'createdAt' | 'updatedAt'>) {
  const store = getStore()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const trackingCode = `AT-GR-2026-${randomNum}`
  const now = new Date().toISOString()
  const fullInquiry: CitizenInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    trackingCode,
    status: 'SUBMITTED',
    createdAt: now,
    updatedAt: now,
  }
  store.inquiries.unshift(fullInquiry)
  saveStore(store)
  return fullInquiry
}
export function updateInquiryStatus(
  id: string,
  status: CitizenInquiry['status'],
  responseNotes?: string,
  assignedOfficeId?: string,
  user?: string
) {
  const store = getStore()
  const item = store.inquiries.find((i) => i.id === id)
  if (item) {
    item.status = status
    if (responseNotes !== undefined) item.responseNotes = responseNotes
    if (assignedOfficeId !== undefined) item.assignedOfficeId = assignedOfficeId
    item.updatedAt = new Date().toISOString()
    recordAudit(store, user, 'UPDATE', 'Inquiry', item.trackingCode, `Updated grievance ticket status to ${status}`)
    saveStore(store)
    return item
  }
  return null
}

// --- SITE SETTINGS ---
export function getSiteSettings(): Record<string, string> {
  return getStore().siteSettings
}
export function updateSiteSettings(updates: Record<string, string>, user?: string) {
  const store = getStore()
  store.siteSettings = { ...store.siteSettings, ...updates }
  recordAudit(store, user, 'UPDATE', 'SiteSettings', 'global', 'Updated official site settings and contacts')
  saveStore(store)
  return store.siteSettings
}

// --- TOURISM ---
export function getTourism(): any[] {
  const store = getStore()
  return (store.tourism || []).sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99))
}
export function createTourismItem(item: any, user?: string) {
  const store = getStore()
  if (!store.tourism) store.tourism = []
  store.tourism.unshift(item)
  recordAudit(store, user, 'CREATE', 'Tourism', item.slug, `Added tourism destination: ${item.name_en}`)
  saveStore(store)
  return item
}
export function updateTourismItem(id: string, updates: any, user?: string) {
  const store = getStore()
  if (!store.tourism) store.tourism = []
  const idx = store.tourism.findIndex((t: any) => t.id === id)
  if (idx !== -1) {
    store.tourism[idx] = { ...store.tourism[idx], ...updates, updatedAt: new Date().toISOString() }
    recordAudit(store, user, 'UPDATE', 'Tourism', id, `Updated tourism destination: ${id}`)
    saveStore(store)
    return store.tourism[idx]
  }
  return null
}
export function deleteTourismItem(id: string, user?: string) {
  const store = getStore()
  if (!store.tourism) return true
  store.tourism = store.tourism.filter((t: any) => t.id !== id)
  recordAudit(store, user, 'DELETE', 'Tourism', id, `Removed tourism destination: ${id}`)
  saveStore(store)
  return true
}

// --- DEVELOPMENT PROJECTS ---
export function getDevelopmentProjects(): any[] {
  const store = getStore()
  return (store.developmentProjects || []).sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99))
}
export function createDevelopmentProject(item: any, user?: string) {
  const store = getStore()
  if (!store.developmentProjects) store.developmentProjects = []
  store.developmentProjects.unshift(item)
  recordAudit(store, user, 'CREATE', 'DevelopmentProject', item.slug, `Added development project: ${item.title_en}`)
  saveStore(store)
  return item
}
export function updateDevelopmentProject(id: string, updates: any, user?: string) {
  const store = getStore()
  if (!store.developmentProjects) store.developmentProjects = []
  const idx = store.developmentProjects.findIndex((p: any) => p.id === id)
  if (idx !== -1) {
    store.developmentProjects[idx] = { ...store.developmentProjects[idx], ...updates, updatedAt: new Date().toISOString() }
    recordAudit(store, user, 'UPDATE', 'DevelopmentProject', id, `Updated project: ${id}`)
    saveStore(store)
    return store.developmentProjects[idx]
  }
  return null
}
export function deleteDevelopmentProject(id: string, user?: string) {
  const store = getStore()
  if (!store.developmentProjects) return true
  store.developmentProjects = store.developmentProjects.filter((p: any) => p.id !== id)
  recordAudit(store, user, 'DELETE', 'DevelopmentProject', id, `Removed development project: ${id}`)
  saveStore(store)
  return true
}

// --- DOCUMENTS ---
export function getDocuments(): any[] {
  const store = getStore()
  return (store.documents || []).sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99))
}
export function createDocument(doc: any, user?: string) {
  const store = getStore()
  if (!store.documents) store.documents = []
  store.documents.unshift(doc)
  recordAudit(store, user, 'CREATE', 'Document', doc.id, `Uploaded document: ${doc.title_en}`)
  saveStore(store)
  return doc
}
export function updateDocument(id: string, updates: any, user?: string) {
  const store = getStore()
  if (!store.documents) store.documents = []
  const idx = store.documents.findIndex((d: any) => d.id === id)
  if (idx !== -1) {
    store.documents[idx] = { ...store.documents[idx], ...updates, updatedAt: new Date().toISOString() }
    recordAudit(store, user, 'UPDATE', 'Document', id, `Updated document: ${id}`)
    saveStore(store)
    return store.documents[idx]
  }
  return null
}
export function deleteDocument(id: string, user?: string) {
  const store = getStore()
  if (!store.documents) return true
  store.documents = store.documents.filter((d: any) => d.id !== id)
  recordAudit(store, user, 'DELETE', 'Document', id, `Deleted document: ${id}`)
  saveStore(store)
  return true
}

// --- HOMEPAGE SLIDERS ---
export function getSliders(): any[] {
  const store = getStore()
  return (store.sliders || []).sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99))
}
export function createSlider(slider: any, user?: string) {
  const store = getStore()
  if (!store.sliders) store.sliders = []
  store.sliders.unshift(slider)
  recordAudit(store, user, 'CREATE', 'Slider', slider.id, `Created homepage slider: ${slider.title_en}`)
  saveStore(store)
  return slider
}
export function updateSlider(id: string, updates: any, user?: string) {
  const store = getStore()
  if (!store.sliders) store.sliders = []
  const idx = store.sliders.findIndex((s: any) => s.id === id)
  if (idx !== -1) {
    store.sliders[idx] = { ...store.sliders[idx], ...updates, updatedAt: new Date().toISOString() }
    recordAudit(store, user, 'UPDATE', 'Slider', id, `Updated homepage slider: ${id}`)
    saveStore(store)
    return store.sliders[idx]
  }
  return null
}
export function deleteSlider(id: string, user?: string) {
  const store = getStore()
  if (!store.sliders) return true
  store.sliders = store.sliders.filter((s: any) => s.id !== id)
  recordAudit(store, user, 'DELETE', 'Slider', id, `Deleted homepage slider: ${id}`)
  saveStore(store)
  return true
}

// --- AUDIT LOG (addAuditLog public method for media upload) ---
export function addAuditLog(entry: { userId: string; userName: string; action: string; resource: string; resourceId: string; details: string }) {
  const store = getStore()
  const newLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: entry.userId,
    userName: entry.userName,
    action: entry.action,
    entityType: entry.resource,
    entityId: entry.resourceId,
    notes: entry.details,
    createdAt: new Date().toISOString(),
  }
  store.auditLogs.unshift(newLog)
  if (store.auditLogs.length > 500) store.auditLogs = store.auditLogs.slice(0, 500)
  saveStore(store)
}

// --- AUDIT LOGS QUERY ---
export function getAuditLogs() {
  return getStore().auditLogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

function recordAudit(store: StoreData, user: string | undefined, action: string, entityType: string, entityId: string, notes: string) {
  const newLog = {
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: user || 'system-admin',
    userName: user || 'Woreda Administrator',
    action,
    entityType,
    entityId,
    notes,
    createdAt: new Date().toISOString(),
  }
  store.auditLogs.unshift(newLog)
  if (store.auditLogs.length > 500) {
    store.auditLogs = store.auditLogs.slice(0, 500)
  }
}
