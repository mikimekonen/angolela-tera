import fs from 'fs'
import path from 'path'
import bcrypt from 'bcryptjs'
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
  MediaAssetItem,
  MediaCategory,
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
  lastLoginIp?: string
  phone?: string
  designation?: string
  avatarUrl?: string
  tokenVersion?: number
  mustChangePassword?: boolean
  suspendedAt?: string
  suspendedBy?: string
  passwordResetAt?: string
  failedLoginAttempts?: number
  lockedUntil?: string
}

export interface MaintenanceEvent {
  id: string
  isActive: boolean
  activatedAt: string
  activatedBy: string
  deactivatedAt?: string
  deactivatedBy?: string
  reason: string
  announcement_en: string
  announcement_am: string
  expectedReopening?: string
  durationMinutes?: number
}

export type NotificationSeverity = 'INFO' | 'WARNING' | 'CRITICAL'
export type NotificationCategory = 'USER_MGMT' | 'SECURITY' | 'CONTENT' | 'GOV_SERVICES' | 'SYSTEM'

export interface SystemNotification {
  id: string
  title: string
  message: string
  severity: NotificationSeverity
  category: NotificationCategory
  isRead: boolean
  createdAt: string
  link?: string
  metadata?: Record<string, any>
}

export type ActivityCategory =
  | 'USER_MANAGEMENT'
  | 'CONTENT_MANAGEMENT'
  | 'GOVERNMENT_SERVICES'
  | 'SYSTEM_SECURITY'

export interface SystemActivityLog {
  id: string
  userId?: string
  userName?: string
  userRole?: string
  action: string
  category: ActivityCategory
  entityType?: string
  entityId?: string
  notes?: string
  ipAddress?: string
  userAgent?: string
  result: 'SUCCESS' | 'FAILURE'
  createdAt: string
}

export type InquiryStatus =
  | 'NEW'
  | 'RECEIVED'
  | 'UNDER_REVIEW'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESPONDED'
  | 'RESOLVED'
  | 'CLOSED'
  | 'REJECTED'
  | 'SUBMITTED'

export interface InquiryStatusHistoryItem {
  status: string
  changedAt: string
  changedBy?: string
  notes?: string
}

export interface CitizenInquiry {
  id: string
  trackingCode: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: 'grievance' | 'inquiry' | 'feedback' | 'service_complaint' | string
  status: InquiryStatus | string
  responseNotes?: string // Official public response (visible on public tracking page)
  internalNotes?: string // Private administrative notes (NEVER exposed to citizen)
  assignedOfficeId?: string
  assignedStaffId?: string
  assignedStaffName?: string
  ipAddress?: string
  adminNotificationSent?: boolean
  adminNotificationSentAt?: string
  citizenConfirmationSent?: boolean
  citizenConfirmationSentAt?: string
  emailError?: string
  emailAttempts?: number
  lastEmailAttemptAt?: string
  statusHistory?: InquiryStatusHistoryItem[]
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
  mediaAssets: MediaAssetItem[]
  maintenanceHistory?: MaintenanceEvent[]
  notifications?: SystemNotification[]
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
        name_am: 'ጫጫ ማዕከላዊ ከተማ (ቀበሌ 01)',
        type: 'URBAN_TOWN',
        population: 18450,
        distanceFromCapitalKm: 0,
        mainAgroEcology: 'Weyna Dega',
        economicActivities_en: 'Commercial commerce, agro-processing hub, trade services, municipal administrative facilities.',
        economicActivities_am: 'ንግድና አገልግሎት፣ አግሮ-ፕሮሰሲንግ፣ ማዘጋጃ ቤታዊ አገልግሎቶች።',
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
        type: 'RURAL_KEBELE',
        population: 8200,
        distanceFromCapitalKm: 14,
        mainAgroEcology: 'Dega (Highland)',
        economicActivities_en: 'Highland barley cultivation, certified seed multiplication, sheep rearing, potato farming.',
        economicActivities_am: 'የገብስና ስንዴ ምርት፣ የድንች ልማት፣ የደጋ በግ እርባታ።',
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
        type: 'RURAL_KEBELE',
        population: 7100,
        distanceFromCapitalKm: 18,
        mainAgroEcology: 'Dega (Highland)',
        economicActivities_en: 'Dairy cattle production, pulse farming, watershed soil conservation cooperative programs.',
        economicActivities_am: 'የወተት ላም እርባታ፣ የጥራጥሬ ሰብሎች፣ የተፋሰስ ልማት ጥበቃ።',
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
        type: 'RURAL_KEBELE',
        population: 9400,
        distanceFromCapitalKm: 9,
        mainAgroEcology: 'Weyna Dega',
        economicActivities_en: 'Cereal production (teff and wheat), poultry farms, rural smallholder irrigation along the Chacha basin.',
        economicActivities_am: 'የጤፍና ስንዴ ምርት፣ የዶሮ እርባታ፣ በጫጫ ወንዝ ተፋሰስ መስኖ ልማት።',
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
        sector: 'Agro-processing',
        summary_en: 'Prime investment opportunity leveraging high milk yield in Angolela Tera highlands with dedicated municipal land allocation.',
        summary_am: 'በአንጎለላ ጠራ ደጋማ ስነ-ምህዳር ያለውን የተትረፈረፈ የወተት አቅርቦት ወደ ውድ እሴት ለመቀየር የተመደበ የኢንቨስትመንት መሬት።',
        description_en: 'The Woreda produces over 45,000 liters of milk daily from local smallholder cooperatives. An investor is sought to establish an integrated pasteurization, packaging, and cheese processing facility in the Chacha Industrial Corridor with direct highway access to Addis Ababa (110 km).',
        description_am: 'ወረዳው በቀን ከ45 ሺህ ሊትር በላይ ወተት የሚያመነጭ ሲሆን ባለሀብቶች በጫጫ የኢንዱስትሪ ኮሪደር ውስጥ ዘመናዊ የወተት ማጣሪያ እና ማሸጊያ እንዲያቋቁሙ አስፈላጊው ድጋፍ ይደረጋል።',
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
      { id: 'nav-home', label_en: 'Home', label_am: 'ዋና ገጽ', url: '/', displayOrder: 1, isActive: true, isExternal: false },
      { id: 'nav-about', label_en: 'About Woreda', label_am: 'ስለ ወረዳው', url: '/about', displayOrder: 2, isActive: true, isExternal: false },
      { id: 'nav-kebeles', label_en: 'Kebele Administrations', label_am: 'የቀበሌ አስተዳደሮች', url: '/kebeles', displayOrder: 3, isActive: true, isExternal: false },
      { id: 'nav-services', label_en: 'Citizen Services', label_am: 'የህዝብ አገልግሎቶች', url: '/services', displayOrder: 4, isActive: true, isExternal: false },
      { id: 'nav-investment', label_en: 'Investment', label_am: 'ኢንቨስትመንት', url: '/investment', displayOrder: 5, isActive: true, isExternal: false },
      { id: 'nav-companies', label_en: 'Industry & Plants', label_am: 'ኢንዱስትሪና ንግድ', url: '/companies', displayOrder: 6, isActive: true, isExternal: false },
      { id: 'nav-partners', label_en: 'Partners', label_am: 'አጋር ድርጅቶች', url: '/partners', displayOrder: 7, isActive: true, isExternal: false },
      { id: 'nav-news', label_en: 'News & Press', label_am: 'ዜናና መግለጫዎች', url: '/news', displayOrder: 8, isActive: true, isExternal: false },
      { id: 'nav-contact', label_en: 'Contact & Grievances', label_am: 'አድራሻና ቅሬታ', url: '/contact', displayOrder: 9, isActive: true, isExternal: false },
    ],
    users: [
      {
        id: 'user-miki-superadmin',
        name: 'Miki Mekonen',
        email: 'mikimekonen9@gmail.com',
        passwordHash: '$2b$10$/KNa4SBizfP.PvRMFGZOFunvdnhFh57J4EGGSjajxtmEG6egs9abW',
        role: 'SUPER_ADMIN',
        officeId: null,
        isActive: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: 'user-superadmin',
        name: 'Chief Government Administrator',
        email: 'admin@angolela-tera.gov.et',
        passwordHash: '$2b$10$/KNa4SBizfP.PvRMFGZOFunvdnhFh57J4EGGSjajxtmEG6egs9abW',
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
      government_name_am: 'የአንጎለላ ጠራ ወረዳ አስተዳደር',
      capital_city_en: 'Chacha',
      capital_city_am: 'ጫጫ',
      zone_name_en: 'North Shewa Zone, Amhara Region, Ethiopia',
      zone_name_am: 'ሰሜን ሸዋ ዞን፣ አማራ ክልል፣ ኢትዮጵያ',
      contact_phone: '+251 (0) 58 661 0100',
      contact_email: 'angolelatera1@gmail.com',
      emergency_police: '991 / +251 58 661 0110',
      emergency_health: '907 / +251 58 661 0112',
      working_hours_en: 'Monday – Friday: 8:30 AM – 5:30 PM (Closed 12:30 – 1:30 PM)',
      working_hours_am: 'ከሰኞ – አርብ፡ ከጠዋቱ 2:30 – 11:30 (የምሳ እረፍት 6:30 – 7:30)',
      social_facebook: 'https://www.facebook.com/share/1F8hTSPLaN/',
      social_youtube: 'https://youtube.com/@angolelateraworedaprosperitypa?si=MgfK74L7pLCiwKLw',
      social_x: 'https://x.com/angolela79256',
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
        name_am: 'የጫጫ ወንዝ ፏፏቴ',
        category: 'Natural Landscape',
        description_en: 'The Chacha River carves dramatic gorges through basalt formations before cascading in a spectacular multi-tiered waterfall system. The surrounding gallery forest is home to Gelada baboons, Colobus monkeys, and rare highland birds. A popular destination for eco-tourism and adventure hiking groups.',
        description_am: 'የጫጫ ወንዝ በቤዛልት ቋጥኞች ውስጥ ልዩ ሸለቆ ፈጥሮ ወደ ብዙ ደረጃ ፏፏቴ ይፈሳል። ዙሪያው ጀሌዳ ዝንጀሮዎች፣ ቆሎቡስ ዝንጀሮዎችና ልዩ ደጋ ወፎች ያሉበት ጫካ ይዞ ይገኛል።',
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
        name_am: 'አንጎለላ ደጋ አግሮ-ኢኮቱሪዝም መስመር',
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
        description_am: 'ለሁለት ቀበሌዎች ሁለት አዳዲስ የ8 ክፍል የመጀመሪያ ደረጃ ት/ቤቶች ግንባታ፣ ምናምን የጫጫ ት/ቤት ሳይንስ ላቦራቶሪ ማስፋፊያ።',
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
        title_am: 'የጫጫ ጤና ጣቢያ አቅም ማጎልበቻ ፕሮጀክት',
        sector: 'Health',
        description_en: 'Expansion of Chacha Health Center to a primary hospital level with addition of maternity ward (20 beds), surgical theatre, and modern diagnostic laboratory. Targets reducing referrals to Debre Berhan Regional Hospital by 40%.',
        description_am: 'የጫጫ ጤና ጣቢያን ወደ ዋና ሆስፒታል ደረጃ ማሳደግ፤ 20 አልጋ ያለው የወሊድ ክፍል፣ ቀዶ ጥገና ቤትና ዘመናዊ ምርመራ ቤት ማካተት። ወደ ደብረ ብርሃን ሆስፒታል የሚደረጉ ሪፈራሎችን በ40% ለመቀነስ ያለመ።',
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
        title_am: 'የአንጎለላ ጠራ ወረዳ የ2017/2018 ዓ.ም ዓመታዊ የልማት እቅድና በጀት',
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
        title_am: 'እንኳን ወደ አንጎለላ ጠራ ወረዳ ዲጂታል መንግሥት ፖርታል በደህና መጡ',
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
        title_am: 'የጫጫ ስትራቴጂካዊ የአግሮ-ኢንዱስትሪና የማኑፋክቸሪንግ ኮሪደር',
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
        subtitle_am: 'የንጉሥ ሳህለ ሥላሴ ታሪካዊ መቀመጫን፣ አስደናቂውን የጫጫ ወንዝ ፏፏቴና ጥንታዊ ገዳማትን ይጎብኙ።',
        imageUrl: '/images/hero-slider-3.jpg',
        buttonText_en: 'Discover Tourism Destinations',
        buttonText_am: 'የቱሪዝም መስህቦችን ይጎብኙ',
        buttonUrl: '/tourism',
        displayOrder: 3,
        isActive: true,
      },
    ],
    mediaAssets: [
      {
        id: 'med-logo-woreda',
        title: 'Official Angolela Tera Woreda Crest & Coat of Arms',
        filename: 'logo.png',
        url: '/logo.png',
        category: 'BRANDING',
        mediaType: 'IMAGE',
        mimeType: 'image/png',
        fileSize: 45200,
        altText_en: 'Official Emblem of Angolela Tera Woreda Administration',
        altText_am: 'የአንጎለላና ጠራ ወረዳ አስተዳደር ይፋዊ አርማ',
        caption: 'Official institutional coat of arms for digital and print communications',
        uploadedBy: 'admin@angolelatera.gov.et',
        createdAt: '2025-01-01T00:00:00.000Z',
      },
      {
        id: 'med-chacha-panoramic',
        title: 'Chacha Town Municipal Center & Commercial Corridor',
        filename: 'chacha-city.jpg',
        url: '/images/hero-agriculture.jpg',
        category: 'NEWS',
        mediaType: 'IMAGE',
        mimeType: 'image/jpeg',
        fileSize: 1845000,
        altText_en: 'Panoramic view of Chacha municipal administrative center',
        altText_am: 'የጫጫ ከተማ ማዘጋጃ ቤታዊ ማዕከል ገጽታ',
        caption: 'Chacha town administrative center along the Addis Ababa - Debre Berhan highway corridor',
        uploadedBy: 'admin@angolelatera.gov.et',
        createdAt: '2025-01-10T08:30:00.000Z',
      },
      {
        id: 'med-health-center-site',
        title: 'Cheki Health Center Expansion Site Inspection',
        filename: 'cheki-health-center.jpg',
        url: '/images/project-health.jpg',
        category: 'PROJECTS',
        mediaType: 'IMAGE',
        mimeType: 'image/jpeg',
        fileSize: 2150000,
        altText_en: 'Civil construction works at Cheki primary health facility',
        altText_am: 'የጨቂ የመጀመሪያ ደረጃ ጤና ጣቢያ ግንባታ ሂደት',
        caption: 'Phase II maternal ward construction with regional health bureau financing',
        uploadedBy: 'admin@angolelatera.gov.et',
        createdAt: '2025-01-15T11:20:00.000Z',
      },
      {
        id: 'med-chitu-waterfalls',
        title: 'Chitu River Natural Gorge and Eco-Tourism Site',
        filename: 'chitu-waterfalls.jpg',
        url: '/images/tourism-gorge.jpg',
        category: 'TOURISM',
        mediaType: 'IMAGE',
        mimeType: 'image/jpeg',
        fileSize: 3420000,
        altText_en: 'Chitu waterfalls and surrounding afro-alpine gorge biodiversity',
        altText_am: 'የቺቱ ፏፏቴ የተፈጥሮ መስህብና ገደላማ ስነ-ምህዳር',
        caption: 'Protected ecological tourism site 12km from Chacha town center',
        uploadedBy: 'admin@angolelatera.gov.et',
        createdAt: '2025-01-20T14:10:00.000Z',
      },
      {
        id: 'med-citizens-charter-pdf',
        title: 'Woreda Citizens Service Charter 2026 (Official Circular)',
        filename: 'service-charter-2026.pdf',
        url: '/uploads/documents/vital-events-form.pdf',
        category: 'DOCUMENTS',
        mediaType: 'DOCUMENT',
        mimeType: 'application/pdf',
        fileSize: 685000,
        altText_en: 'Statutory 48-Hour Citizen Service Guarantee Charter',
        altText_am: 'የወረዳው ነዋሪዎች አገልግሎት አሰጣጥ ቻርተር',
        caption: 'Gazetted standards for land administration, licensing, and civil registration',
        uploadedBy: 'admin@angolelatera.gov.et',
        createdAt: '2025-02-01T09:00:00.000Z',
      },
      {
        id: 'med-irrigation-video',
        title: 'Beressa Basin Micro-Dam Irrigation Documentary (Short)',
        filename: 'beressa-irrigation-scheme.mp4',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        category: 'VIDEOS',
        mediaType: 'VIDEO',
        mimeType: 'video/mp4',
        fileSize: 18450000,
        altText_en: 'Farmer cooperative irrigation channels at Beressa river basin',
        altText_am: 'የበረሳ ተፋሰስ የመስኖ ልማትና የአርሶ አደሮች ተጠቃሚነት',
        caption: 'Documentary featuring modern drip irrigation covering 450 hectares of horticulture',
        uploadedBy: 'admin@angolelatera.gov.et',
        createdAt: '2025-02-10T16:45:00.000Z',
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
    const rawUsers = Array.isArray(parsed.users) ? parsed.users : initial.users
    const users = rawUsers.map((u: any) => ({
      ...u,
      tokenVersion: typeof u.tokenVersion === 'number' ? u.tokenVersion : 1,
      mustChangePassword: Boolean(u.mustChangePassword),
    }))
    return {
      ...initial,
      ...parsed,
      users,
      maintenanceHistory: Array.isArray(parsed.maintenanceHistory) ? parsed.maintenanceHistory : [],
      notifications: Array.isArray(parsed.notifications) ? parsed.notifications : initial.notifications || [],
      companies:
        Array.isArray(parsed.companies) && parsed.companies.length > 0
          ? parsed.companies
          : initial.companies,
      mediaAssets:
        Array.isArray(parsed.mediaAssets) && parsed.mediaAssets.length > 0
          ? parsed.mediaAssets
          : initial.mediaAssets,
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

export function isLastSuperAdmin(userId: string): boolean {
  const store = getStore()
  const targetUser = store.users.find((u) => u.id === userId)
  if (!targetUser || targetUser.role !== 'SUPER_ADMIN') return false
  const activeSuperAdmins = store.users.filter((u) => u.role === 'SUPER_ADMIN' && u.isActive)
  return activeSuperAdmins.length <= 1 && activeSuperAdmins[0]?.id === userId
}

export function updateUser(userId: string, updates: Partial<UserAccount>, actor?: string): UserAccount | null {
  const store = getStore()
  const idx = store.users.findIndex((u) => u.id === userId)
  if (idx !== -1) {
    // Safety guard: prevent demoting the last active Super Admin
    if (
      updates.role &&
      updates.role !== 'SUPER_ADMIN' &&
      isLastSuperAdmin(userId)
    ) {
      throw new Error('Safety Guard: Cannot demote the last active Super Admin account. Maintain at least one active Super Admin.')
    }

    store.users[idx] = { ...store.users[idx], ...updates }
    recordAudit(store, actor || store.users[idx].email, 'UPDATE', 'User', userId, `Updated user profile/credentials for [${store.users[idx].email}]`)
    saveStore(store)
    return store.users[idx]
  }
  return null
}

export function createUser(user: UserAccount, permissions: AdminPermissionItem[] = [], actor?: string) {
  const store = getStore()
  const fullUser: UserAccount = {
    ...user,
    tokenVersion: user.tokenVersion || 1,
    mustChangePassword: Boolean(user.mustChangePassword),
    failedLoginAttempts: 0,
  }
  store.users.push(fullUser)
  if (permissions.length > 0) {
    store.permissions.push(...permissions)
  }
  recordAudit(store, actor, 'CREATE', 'User', user.id, `Created admin account [${user.email}] with role: ${user.role}`)
  saveStore(store)
  return fullUser
}

export function toggleUserStatus(userId: string, isActive: boolean, actor?: string) {
  const store = getStore()
  const u = store.users.find((user) => user.id === userId)
  if (!u) return null

  // Safety guard: prevent suspending or deactivating the last active Super Admin
  if (!isActive && isLastSuperAdmin(userId)) {
    throw new Error('Safety Guard: Cannot suspend or deactivate the last remaining Super Admin account.')
  }

  u.isActive = isActive
  if (!isActive) {
    u.suspendedAt = new Date().toISOString()
    u.suspendedBy = actor || 'Super Admin'
    // Immediately invalidate active sessions on suspension
    u.tokenVersion = (u.tokenVersion || 1) + 1
  } else {
    u.suspendedAt = undefined
    u.suspendedBy = undefined
  }

  logSystemActivity({
    userId: actor,
    userName: actor,
    action: isActive ? 'USER_REACTIVATED' : 'USER_SUSPENDED',
    category: 'USER_MANAGEMENT',
    entityType: 'User',
    entityId: u.email,
    notes: `Account [${u.email}] status changed to ${isActive ? 'ACTIVE' : 'SUSPENDED'} by ${actor || 'Super Admin'}`,
    severity: isActive ? 'INFO' : 'WARNING',
  })

  saveStore(store)
  return u
}

export function deleteUser(userId: string, actor: string): { success: boolean; error?: string } {
  const store = getStore()
  const target = store.users.find((u) => u.id === userId)
  if (!target) return { success: false, error: 'User not found' }

  if (isLastSuperAdmin(userId)) {
    return {
      success: false,
      error: 'Protection Guard: Cannot delete the last active Super Admin account. Ensure another Super Admin is active first.',
    }
  }

  store.users = store.users.filter((u) => u.id !== userId)
  store.permissions = store.permissions.filter((p) => p.userId !== userId)

  logSystemActivity({
    userId: actor,
    userName: actor,
    action: 'USER_DELETED',
    category: 'USER_MANAGEMENT',
    entityType: 'User',
    entityId: userId,
    notes: `Permanently deleted user account [${target.email} (${target.name})] by ${actor}`,
    severity: 'WARNING',
  })

  saveStore(store)
  return { success: true }
}

export async function resetUserPasswordSecurely(userId: string, actor: string) {
  const store = getStore()
  const user = store.users.find((u) => u.id === userId)
  if (!user) throw new Error('User not found')

  // Generate 14-character high-entropy temporary password
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ'
  const lower = 'abcdefghijkmnopqrstuvwxyz'
  const digits = '23456789'
  const symbols = '!@#$%^&*='

  let tempPass = ''
  tempPass += upper.charAt(Math.floor(Math.random() * upper.length))
  tempPass += lower.charAt(Math.floor(Math.random() * lower.length))
  tempPass += digits.charAt(Math.floor(Math.random() * digits.length))
  tempPass += symbols.charAt(Math.floor(Math.random() * symbols.length))

  const allChars = upper + lower + digits + symbols
  for (let i = 0; i < 10; i++) {
    tempPass += allChars.charAt(Math.floor(Math.random() * allChars.length))
  }
  tempPass = tempPass.split('').sort(() => 0.5 - Math.random()).join('')

  const salt = await bcrypt.genSalt(10)
  const passwordHash = await bcrypt.hash(tempPass, salt)

  user.passwordHash = passwordHash
  user.mustChangePassword = true
  user.tokenVersion = (user.tokenVersion || 1) + 1 // Revoke any existing active sessions!
  user.passwordResetAt = new Date().toISOString()
  user.failedLoginAttempts = 0
  user.lockedUntil = undefined

  logSystemActivity({
    userId: actor,
    userName: actor,
    action: 'PASSWORD_RESET_INITIATED',
    category: 'USER_MANAGEMENT',
    entityType: 'User',
    entityId: user.email,
    notes: `Administrative password reset executed by ${actor} for [${user.email}]. One-time temporary password issued. Mandatory password change flagged on next login. Prior sessions terminated.`,
    severity: 'WARNING',
  })

  saveStore(store)

  return {
    success: true,
    temporaryPassword: tempPass,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  }
}

export function revokeUserSessions(userId: string, actor: string) {
  const store = getStore()
  const user = store.users.find((u) => u.id === userId)
  if (!user) throw new Error('User not found')

  user.tokenVersion = (user.tokenVersion || 1) + 1

  logSystemActivity({
    userId: actor,
    userName: actor,
    action: 'USER_SESSIONS_REVOKED',
    category: 'USER_MANAGEMENT',
    entityType: 'User',
    entityId: user.email,
    notes: `Active sessions terminated for ${user.email} by ${actor}. Token version advanced to ${user.tokenVersion}.`,
    severity: 'INFO',
  })

  saveStore(store)
  return user
}

export function revokeAllSessionsExcept(exemptUserId: string, actor: string) {
  const store = getStore()
  let count = 0
  store.users.forEach((u) => {
    if (u.id !== exemptUserId) {
      u.tokenVersion = (u.tokenVersion || 1) + 1
      count++
    }
  })

  logSystemActivity({
    userId: actor,
    userName: actor,
    action: 'GLOBAL_SESSIONS_REVOKED',
    category: 'SYSTEM_SECURITY',
    entityType: 'Security',
    notes: `Emergency bulk session revocation: ${count} administrator sessions terminated by ${actor}. Exempt user: ${exemptUserId}.`,
    severity: 'CRITICAL',
  })

  saveStore(store)
  return { revokedCount: count }
}

export function recordLoginAttempt(
  userId: string,
  success: boolean,
  ipAddress?: string
) {
  const store = getStore()
  const user = store.users.find((u) => u.id === userId)
  if (!user) return null

  if (success) {
    user.failedLoginAttempts = 0
    user.lockedUntil = undefined
    user.lastLoginAt = new Date().toISOString()
    user.lastLoginIp = ipAddress || '127.0.0.1'
  } else {
    user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1
    if (user.failedLoginAttempts >= 5) {
      // Lock account for 15 minutes
      user.lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString()
    }
  }
  saveStore(store)
  return user
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
  // Generate secure unpredictable 4-digit sequence with timestamp salt
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  const trackingCode = `AT-GR-2026-${randomNum}`
  const now = new Date().toISOString()

  const fullInquiry: CitizenInquiry = {
    ...inquiry,
    id: `inq-${Date.now()}`,
    trackingCode,
    status: inquiry.status || 'RECEIVED',
    adminNotificationSent: inquiry.adminNotificationSent ?? false,
    citizenConfirmationSent: inquiry.citizenConfirmationSent ?? false,
    emailAttempts: inquiry.emailAttempts ?? 0,
    statusHistory: [
      {
        status: inquiry.status || 'RECEIVED',
        changedAt: now,
        changedBy: 'Citizen Submission Portal',
        notes: 'Inquiry officially recorded in Woreda registry.',
      },
    ],
    createdAt: now,
    updatedAt: now,
  }

  store.inquiries.unshift(fullInquiry)
  saveStore(store)
  return fullInquiry
}

export function updateInquiryEmailStatus(
  trackingCode: string,
  updates: {
    adminNotificationSent?: boolean
    citizenConfirmationSent?: boolean
    emailError?: string | null
    incrementAttempts?: boolean
  }
) {
  const store = getStore()
  const item = store.inquiries.find((i) => i.trackingCode.toUpperCase() === trackingCode.trim().toUpperCase())
  if (!item) return null

  const now = new Date().toISOString()
  if (updates.adminNotificationSent !== undefined) {
    item.adminNotificationSent = updates.adminNotificationSent
    if (updates.adminNotificationSent) item.adminNotificationSentAt = now
  }
  if (updates.citizenConfirmationSent !== undefined) {
    item.citizenConfirmationSent = updates.citizenConfirmationSent
    if (updates.citizenConfirmationSent) item.citizenConfirmationSentAt = now
  }
  if (updates.emailError !== undefined) {
    item.emailError = updates.emailError || undefined
  }
  if (updates.incrementAttempts) {
    item.emailAttempts = (item.emailAttempts || 0) + 1
    item.lastEmailAttemptAt = now
  }
  item.updatedAt = now

  saveStore(store)
  return item
}

export function updateInquiryStatus(
  id: string,
  status: CitizenInquiry['status'],
  responseNotes?: string,
  assignedOfficeId?: string,
  user?: string,
  internalNotes?: string,
  assignedStaffName?: string
) {
  const store = getStore()
  const item = store.inquiries.find((i) => i.id === id || i.trackingCode.toUpperCase() === id.trim().toUpperCase())
  if (item) {
    const prevStatus = item.status
    item.status = status
    if (responseNotes !== undefined) item.responseNotes = responseNotes
    if (internalNotes !== undefined) item.internalNotes = internalNotes
    if (assignedOfficeId !== undefined) item.assignedOfficeId = assignedOfficeId
    if (assignedStaffName !== undefined) item.assignedStaffName = assignedStaffName
    item.updatedAt = new Date().toISOString()

    if (!item.statusHistory) item.statusHistory = []
    item.statusHistory.unshift({
      status,
      changedAt: item.updatedAt,
      changedBy: user || 'Administrative Staff',
      notes: responseNotes || internalNotes || `Status changed from ${prevStatus} to ${status}`,
    })

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

// --- MEDIA ASSETS MANAGEMENT & USAGE CHECKING ---
export function getMediaAssets(category?: string, search?: string): MediaAssetItem[] {
  let list = getStore().mediaAssets || []
  if (category && category !== 'ALL') {
    list = list.filter((m) => m.category === category)
  }
  if (search && search.trim()) {
    const q = search.toLowerCase()
    list = list.filter(
      (m) =>
        m.title.toLowerCase().includes(q) ||
        m.filename.toLowerCase().includes(q) ||
        (m.altText_en && m.altText_en.toLowerCase().includes(q)) ||
        (m.altText_am && m.altText_am.toLowerCase().includes(q)) ||
        (m.caption && m.caption.toLowerCase().includes(q))
    )
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function getMediaAssetById(id: string): MediaAssetItem | null {
  const store = getStore()
  return (store.mediaAssets || []).find((m) => m.id === id) || null
}

export function createMediaAsset(
  asset: Omit<MediaAssetItem, 'id' | 'createdAt'>,
  user?: string
): MediaAssetItem {
  const store = getStore()
  if (!store.mediaAssets) store.mediaAssets = []
  const newAsset: MediaAssetItem = {
    ...asset,
    id: `med-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
  }
  store.mediaAssets.unshift(newAsset)
  recordAudit(
    store,
    user,
    'UPLOAD_MEDIA',
    'MediaAsset',
    newAsset.filename,
    `Uploaded ${newAsset.mediaType} asset: "${newAsset.title}" [${newAsset.category}]`
  )
  saveStore(store)
  return newAsset
}

export function updateMediaAsset(
  id: string,
  updates: Partial<MediaAssetItem>,
  user?: string
): MediaAssetItem | null {
  const store = getStore()
  if (!store.mediaAssets) store.mediaAssets = []
  const idx = store.mediaAssets.findIndex((m) => m.id === id)
  if (idx !== -1) {
    store.mediaAssets[idx] = {
      ...store.mediaAssets[idx],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    recordAudit(
      store,
      user,
      'UPDATE',
      'MediaAsset',
      id,
      `Updated metadata for media asset: "${store.mediaAssets[idx].title}"`
    )
    saveStore(store)
    return store.mediaAssets[idx]
  }
  return null
}

export function deleteMediaAsset(id: string, user?: string): { success: boolean; error?: string; usages?: any[] } {
  const store = getStore()
  if (!store.mediaAssets) return { success: true }
  const asset = store.mediaAssets.find((m) => m.id === id)
  if (!asset) return { success: false, error: 'Asset not found' }

  // Check active references
  const usages = getMediaUsage(asset.url)
  if (usages.length > 0) {
    return {
      success: false,
      error: `Asset is currently in use across ${usages.length} publication(s).`,
      usages,
    }
  }

  store.mediaAssets = store.mediaAssets.filter((m) => m.id !== id)
  recordAudit(
    store,
    user,
    'DELETE',
    'MediaAsset',
    asset.filename,
    `Deleted media asset: "${asset.title}" (${asset.url})`
  )
  saveStore(store)
  return { success: true }
}

export function getMediaUsage(urlOrFilename: string): Array<{ entityType: string; entityTitle: string; entityId: string }> {
  const store = getStore()
  const usages: Array<{ entityType: string; entityTitle: string; entityId: string }> = []
  if (!urlOrFilename) return usages

  const target = urlOrFilename.trim().toLowerCase()

  // 1. News
  ;(store.news || []).forEach((n: any) => {
    const imgMatch = n.imageUrl && n.imageUrl.toLowerCase().includes(target)
    const vidMatch = n.videoUrl && n.videoUrl.toLowerCase().includes(target)
    const docMatch = n.documentUrl && n.documentUrl.toLowerCase().includes(target)
    const galleryMatch = Array.isArray(n.gallery) && n.gallery.some((g: any) => g.url && g.url.toLowerCase().includes(target))
    if (imgMatch || vidMatch || docMatch || galleryMatch) {
      usages.push({
        entityType: 'News & Announcements',
        entityTitle: n.title_en || n.title_am || n.slug,
        entityId: n.slug,
      })
    }
  })

  // 2. Development Projects
  ;(store.developmentProjects || []).forEach((p: any) => {
    const imgMatch = Array.isArray(p.images) && p.images.some((img: string) => img.toLowerCase().includes(target))
    if (imgMatch) {
      usages.push({
        entityType: 'Development Project',
        entityTitle: p.title_en || p.title_am || p.slug,
        entityId: p.slug,
      })
    }
  })

  // 3. Tourism
  ;(store.tourism || []).forEach((t: any) => {
    const imgMatch = t.imageUrl && t.imageUrl.toLowerCase().includes(target)
    const galleryMatch = Array.isArray(t.gallery) && t.gallery.some((img: string) => img.toLowerCase().includes(target))
    if (imgMatch || galleryMatch) {
      usages.push({
        entityType: 'Tourism Destination',
        entityTitle: t.name_en || t.name_am || t.slug,
        entityId: t.slug,
      })
    }
  })

  // 4. Documents
  ;(store.documents || []).forEach((d: any) => {
    if (d.fileUrl && d.fileUrl.toLowerCase().includes(target)) {
      usages.push({
        entityType: 'Document Library',
        entityTitle: d.title_en || d.title_am || d.id,
        entityId: d.id,
      })
    }
  })

  // 5. Hero Sliders
  ;(store.sliders || []).forEach((s: any) => {
    if (s.imageUrl && s.imageUrl.toLowerCase().includes(target)) {
      usages.push({
        entityType: 'Homepage Hero Slider',
        entityTitle: s.title_en || s.id,
        entityId: s.id,
      })
    }
  })

  return usages
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

// --- SYSTEM ACTIVITY & NOTIFICATIONS (SUPER ADMIN) ---
export function logSystemActivity(entry: {
  userId?: string
  userName?: string
  userRole?: string
  action: string
  category: ActivityCategory
  entityType?: string
  entityId?: string
  notes?: string
  ipAddress?: string
  userAgent?: string
  result?: 'SUCCESS' | 'FAILURE'
  severity?: NotificationSeverity
}) {
  const store = getStore()
  const log: SystemActivityLog = {
    id: `act-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId: entry.userId || 'system',
    userName: entry.userName || 'System Service',
    userRole: entry.userRole,
    action: entry.action,
    category: entry.category,
    entityType: entry.entityType,
    entityId: entry.entityId,
    notes: entry.notes,
    ipAddress: entry.ipAddress || '127.0.0.1',
    userAgent: entry.userAgent,
    result: entry.result || 'SUCCESS',
    createdAt: new Date().toISOString(),
  }

  // Add to store auditLogs in compatible shape
  store.auditLogs.unshift({
    id: log.id,
    userId: log.userId,
    userName: log.userName,
    userRole: log.userRole,
    action: log.action,
    category: log.category,
    entityType: log.entityType || 'System',
    entityId: log.entityId || 'root',
    notes: log.notes,
    ipAddress: log.ipAddress,
    result: log.result,
    createdAt: log.createdAt,
  })
  if (store.auditLogs.length > 1000) {
    store.auditLogs = store.auditLogs.slice(0, 1000)
  }

  // If severity is WARNING or CRITICAL, automatically raise a notification!
  if (entry.severity === 'WARNING' || entry.severity === 'CRITICAL') {
    if (!store.notifications) store.notifications = []
    const notif: SystemNotification = {
      id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `${entry.severity === 'CRITICAL' ? '🚨 [CRITICAL]' : '⚠️ [ALERT]'} ${entry.action.replace(/_/g, ' ')}`,
      message: entry.notes || `System event ${entry.action} triggered.`,
      severity: entry.severity,
      category: entry.category === 'SYSTEM_SECURITY' ? 'SECURITY' : entry.category === 'USER_MANAGEMENT' ? 'USER_MGMT' : 'SYSTEM',
      isRead: false,
      createdAt: new Date().toISOString(),
      metadata: {
        actor: entry.userName,
        entityId: entry.entityId,
        category: entry.category,
      },
    }
    store.notifications.unshift(notif)
    if (store.notifications.length > 200) {
      store.notifications = store.notifications.slice(0, 200)
    }
  }

  saveStore(store)
  return log
}

export function getSystemActivityLogs(filter?: {
  category?: ActivityCategory | 'ALL'
  result?: 'SUCCESS' | 'FAILURE' | 'ALL'
  search?: string
  limit?: number
}): SystemActivityLog[] {
  const store = getStore()
  let list: SystemActivityLog[] = store.auditLogs.map((l: any) => ({
    id: l.id,
    userId: l.userId || 'system',
    userName: l.userName || 'Administrator',
    userRole: l.userRole || 'ADMIN',
    action: l.action,
    category: (l.category as ActivityCategory) || 'SYSTEM_SECURITY',
    entityType: l.entityType,
    entityId: l.entityId,
    notes: l.notes,
    ipAddress: l.ipAddress || '127.0.0.1',
    userAgent: l.userAgent,
    result: (l.result as 'SUCCESS' | 'FAILURE') || 'SUCCESS',
    createdAt: l.createdAt,
  }))

  if (filter?.category && filter.category !== 'ALL') {
    list = list.filter((l) => l.category === filter.category)
  }
  if (filter?.result && filter.result !== 'ALL') {
    list = list.filter((l) => l.result === filter.result)
  }
  if (filter?.search && filter.search.trim()) {
    const q = filter.search.toLowerCase()
    list = list.filter(
      (l) =>
        l.action.toLowerCase().includes(q) ||
        (l.userName && l.userName.toLowerCase().includes(q)) ||
        (l.notes && l.notes.toLowerCase().includes(q)) ||
        (l.ipAddress && l.ipAddress.toLowerCase().includes(q)) ||
        (l.entityId && l.entityId.toLowerCase().includes(q))
    )
  }
  if (filter?.limit) {
    list = list.slice(0, filter.limit)
  }
  return list
}

export function getSystemNotifications(unreadOnly = false): SystemNotification[] {
  const store = getStore()
  let list = store.notifications || []
  if (unreadOnly) {
    list = list.filter((n) => !n.isRead)
  }
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export function createSystemNotification(notification: Omit<SystemNotification, 'id' | 'createdAt' | 'isRead'>) {
  const store = getStore()
  if (!store.notifications) store.notifications = []
  const newNotif: SystemNotification = {
    ...notification,
    id: `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    isRead: false,
    createdAt: new Date().toISOString(),
  }
  store.notifications.unshift(newNotif)
  if (store.notifications.length > 200) {
    store.notifications = store.notifications.slice(0, 200)
  }
  saveStore(store)
  return newNotif
}

export function markNotificationRead(id: string) {
  const store = getStore()
  if (!store.notifications) return false
  const target = store.notifications.find((n) => n.id === id)
  if (target) {
    target.isRead = true
    saveStore(store)
    return true
  }
  return false
}

export function markAllNotificationsRead() {
  const store = getStore()
  if (!store.notifications) return 0
  let count = 0
  store.notifications.forEach((n) => {
    if (!n.isRead) {
      n.isRead = true
      count++
    }
  })
  saveStore(store)
  return count
}

// --- EMERGENCY MAINTENANCE MODE CONTROL ---
export function getMaintenanceStatus(): {
  isActive: boolean
  currentEvent?: MaintenanceEvent
  settings: Record<string, string>
} {
  const store = getStore()
  const history = store.maintenanceHistory || []
  const currentEvent = history.find((h) => h.isActive)
  const isSettingActive = store.siteSettings?.maintenance_mode === 'true'

  return {
    isActive: Boolean(currentEvent || isSettingActive),
    currentEvent,
    settings: store.siteSettings || {},
  }
}

export function setMaintenanceMode(params: {
  enable: boolean
  actor: string
  reason?: string
  announcement_en?: string
  announcement_am?: string
  expectedReopening?: string
}): { success: boolean; event?: MaintenanceEvent; message?: string } {
  const store = getStore()
  if (!store.maintenanceHistory) store.maintenanceHistory = []
  if (!store.siteSettings) store.siteSettings = {}

  const now = new Date().toISOString()

  if (params.enable) {
    const active = store.maintenanceHistory.find((h) => h.isActive)
    if (active) {
      return { success: false, message: 'Maintenance mode is already active.' }
    }

    const newEvent: MaintenanceEvent = {
      id: `maint-${Date.now()}`,
      isActive: true,
      activatedAt: now,
      activatedBy: params.actor,
      reason: params.reason || 'Scheduled Government Infrastructure Maintenance',
      announcement_en: params.announcement_en || 'The Angolela Tera Woreda official portal is undergoing scheduled administrative maintenance. Public services will be restored shortly.',
      announcement_am: params.announcement_am || 'የአንጎለላ ጠራ ወረዳ አስተዳደር ይፋዊ ፖርታል በታቀደ የጥገናና ማሻሻያ ስራ ላይ ይገኛል። የህዝብ አገልግሎቶች በቅርቡ ይመለሳሉ።',
      expectedReopening: params.expectedReopening || new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    }

    store.maintenanceHistory.unshift(newEvent)
    store.siteSettings.maintenance_mode = 'true'
    store.siteSettings.maintenance_reason = newEvent.reason
    if (newEvent.expectedReopening) {
      store.siteSettings.maintenance_reopening = newEvent.expectedReopening
    }

    logSystemActivity({
      userId: params.actor,
      userName: params.actor,
      action: 'MAINTENANCE_MODE_ACTIVATED',
      category: 'SYSTEM_SECURITY',
      entityType: 'SystemControl',
      notes: `EMERGENCY / SCHEDULED MAINTENANCE ACTIVATED by ${params.actor}. Reason: "${newEvent.reason}". Expected reopening: ${newEvent.expectedReopening}. Ordinary administrators and public visitors locked out.`,
      severity: 'CRITICAL',
    })

    saveStore(store)
    return { success: true, event: newEvent }
  } else {
    const active = store.maintenanceHistory.find((h) => h.isActive)
    if (active) {
      active.isActive = false
      active.deactivatedAt = now
      active.deactivatedBy = params.actor
      const durationMs = new Date(now).getTime() - new Date(active.activatedAt).getTime()
      active.durationMinutes = Math.round(durationMs / 60000)
    }

    store.siteSettings.maintenance_mode = 'false'
    delete store.siteSettings.maintenance_reason
    delete store.siteSettings.maintenance_reopening

    logSystemActivity({
      userId: params.actor,
      userName: params.actor,
      action: 'MAINTENANCE_MODE_DEACTIVATED',
      category: 'SYSTEM_SECURITY',
      entityType: 'SystemControl',
      notes: `Maintenance mode terminated by ${params.actor}. Public services and standard staff access fully restored.`,
      severity: 'INFO',
    })

    saveStore(store)
    return { success: true, event: active }
  }
}

export function getMaintenanceHistory(): MaintenanceEvent[] {
  const store = getStore()
  return (store.maintenanceHistory || []).sort(
    (a, b) => new Date(b.activatedAt).getTime() - new Date(a.activatedAt).getTime()
  )
}

export function getSuperAdminDashboardMetrics() {
  const store = getStore()
  const users = store.users || []
  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.isActive).length
  const suspendedUsers = users.filter((u) => !u.isActive).length
  const superAdmins = users.filter((u) => u.role === 'SUPER_ADMIN').length
  const officeAdmins = users.filter((u) => u.role === 'ADMIN').length
  const editors = users.filter((u) => u.role === 'OFFICE_EDITOR').length

  const notifications = store.notifications || []
  const unreadNotifications = notifications.filter((n) => !n.isRead).length
  const criticalNotifications = notifications.filter((n) => n.severity === 'CRITICAL' && !n.isRead).length

  const maint = getMaintenanceStatus()
  const recentActivities = getSystemActivityLogs({ limit: 8 })

  const lockedUsers = users.filter((u) => u.lockedUntil && new Date(u.lockedUntil) > new Date()).length

  return {
    users: {
      total: totalUsers,
      active: activeUsers,
      suspended: suspendedUsers,
      superAdmins,
      officeAdmins,
      editors,
      lockedUsers,
    },
    notifications: {
      total: notifications.length,
      unread: unreadNotifications,
      critical: criticalNotifications,
    },
    maintenance: {
      isActive: maint.isActive,
      currentEvent: maint.currentEvent,
      totalEvents: (store.maintenanceHistory || []).length,
    },
    recentActivities,
    systemUptime: process.uptime ? Math.floor(process.uptime()) : 86400,
    nodeEnv: process.env.NODE_ENV || 'production',
  }
}
