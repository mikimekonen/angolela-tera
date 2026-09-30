/**
 * Type definitions for the Angolela Tera portal.
 *
 * These types mirror the Prisma schema and are used across
 * both the public site and admin panel.
 */

import type { Locale } from '@/i18n/config'

// ------------------------------------------------------------------
// SHARED
// ------------------------------------------------------------------

export type ContentStatus =
  | 'DRAFT'
  | 'REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'ARCHIVED'
  | 'REJECTED'

export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'OFFICE_EDITOR'
  | 'REVIEWER'
  | 'VIEWER'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: UserRole
  officeId?: string | null
  isActive: boolean
}

export interface SessionPayload {
  userId: string
  email: string
  name: string
  role: UserRole
  officeId?: string | null
}

export type MediaType =
  | 'IMAGE'
  | 'DOCUMENT_PDF'
  | 'DOCUMENT_WORD'
  | 'DOCUMENT_EXCEL'
  | 'VIDEO'
  | 'OTHER'

/** Helper to pick the correct locale field from a multilingual object */
export function getLocalizedField<T extends Record<string, unknown>>(
  obj: T,
  field: string,
  locale: Locale,
  fallback: Locale = 'en'
): string {
  const localized = obj[`${field}_${locale}`] as string | undefined
  const fallbackValue = obj[`${field}_${fallback}`] as string | undefined
  return localized || fallbackValue || ''
}

// ------------------------------------------------------------------
// MEDIA
// ------------------------------------------------------------------

export interface MediaItem {
  id: string
  filename: string
  storedName: string
  mimeType: string
  mediaType: MediaType
  sizeBytes: number
  width?: number
  height?: number
  altText_en?: string
  altText_am?: string
  altText_om?: string
  url: string
  createdAt: Date
}

// ------------------------------------------------------------------
// STATISTICS
// ------------------------------------------------------------------

export interface Statistic {
  id: string
  key: string
  value: string
  label_en: string
  label_am?: string
  label_om?: string
  unit_en?: string
  unit_am?: string
  unit_om?: string
  icon?: string
  displayOrder: number
  isVerified: boolean
}

// ------------------------------------------------------------------
// OFFICE
// ------------------------------------------------------------------

export interface OfficeListItem {
  id: string
  slug: string
  name_en: string
  name_am?: string
  name_om?: string
  displayOrder: number
  status: ContentStatus
}

export interface OfficeDetail extends OfficeListItem {
  about_en?: string
  about_am?: string
  about_om?: string
  vision_en?: string
  vision_am?: string
  vision_om?: string
  mission_en?: string
  mission_am?: string
  mission_om?: string
  phone?: string
  email?: string
  fax?: string
  address?: string
  featuredImage?: MediaItem
  leadership: LeadershipItem[]
  responsibilities: OfficeResponsibility[]
  services: ServiceListItem[]
  documents: DocumentItem[]
}

export interface OfficeResponsibility {
  id: string
  text_en: string
  text_am?: string
  text_om?: string
  order: number
}

// ------------------------------------------------------------------
// LEADERSHIP
// ------------------------------------------------------------------

export interface LeadershipItem {
  id: string
  name: string
  title_en: string
  title_am?: string
  title_om?: string
  bio_en?: string
  bio_am?: string
  bio_om?: string
  message_en?: string
  message_am?: string
  message_om?: string
  photo?: MediaItem
  isAdministrator: boolean
  displayOrder: number
  status: ContentStatus
}

// ------------------------------------------------------------------
// SERVICES
// ------------------------------------------------------------------

export interface ServiceListItem {
  id: string
  slug: string
  name_en: string
  name_am?: string
  name_om?: string
  description_en?: string
  description_am?: string
  description_om?: string
  icon?: string
  officeId?: string
  displayOrder: number
  status: ContentStatus
}

export interface ServiceDetail extends ServiceListItem {
  requirements_en?: string
  requirements_am?: string
  requirements_om?: string
  steps_en?: string
  steps_am?: string
  steps_om?: string
  externalUrl?: string
}

// ------------------------------------------------------------------
// NEWS
// ------------------------------------------------------------------

export interface NewsCategory {
  id: string
  slug: string
  name_en: string
  name_am?: string
  name_om?: string
  color?: string
}

export interface NewsListItem {
  id: string
  slug: string
  title_en: string
  title_am?: string
  title_om?: string
  excerpt_en?: string
  excerpt_am?: string
  excerpt_om?: string
  coverImage?: MediaItem
  category?: NewsCategory
  status: ContentStatus
  isFeatured: boolean
  publishedAt?: Date
  createdAt: Date
}

export interface NewsDetail extends NewsListItem {
  body_en?: string
  body_am?: string
  body_om?: string
  metaTitle_en?: string
  metaDesc_en?: string
}

// ------------------------------------------------------------------
// DOCUMENTS
// ------------------------------------------------------------------

export interface DocumentItem {
  id: string
  title_en: string
  title_am?: string
  title_om?: string
  description_en?: string
  file: MediaItem
  category: string
  status: ContentStatus
  publishedAt?: Date
}

// ------------------------------------------------------------------
// PROJECTS
// ------------------------------------------------------------------

export interface ProjectListItem {
  id: string
  slug: string
  name_en: string
  name_am?: string
  name_om?: string
  description_en?: string
  description_am?: string
  description_om?: string
  category: string
  completionPct?: number
  projectStatus: string
  image?: MediaItem
  status: ContentStatus
}

// ------------------------------------------------------------------
// TOURISM
// ------------------------------------------------------------------

export interface TourismSiteItem {
  id: string
  slug: string
  name_en: string
  name_am?: string
  name_om?: string
  description_en?: string
  description_am?: string
  description_om?: string
  category: string
  location?: string
  latitude?: number
  longitude?: number
  image?: MediaItem
  status: ContentStatus
}

// ------------------------------------------------------------------
// HERO
// ------------------------------------------------------------------

export interface HeroSlide {
  id: string
  image: MediaItem
  title_en?: string
  title_am?: string
  title_om?: string
  subtitle_en?: string
  subtitle_am?: string
  subtitle_om?: string
  ctaPrimary_en?: string
  ctaPrimaryUrl?: string
  ctaSecondary_en?: string
  ctaSecondaryUrl?: string
  displayOrder: number
  isActive: boolean
}

// ------------------------------------------------------------------
// SITE SETTINGS
// ------------------------------------------------------------------

export interface SiteSettings {
  [key: string]: string
}

// ------------------------------------------------------------------
// CONTACT
// ------------------------------------------------------------------

export interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// ------------------------------------------------------------------
// API RESPONSES
// ------------------------------------------------------------------

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ------------------------------------------------------------------
// ADMIN / AUDIT
// ------------------------------------------------------------------

export interface AuditLogEntry {
  id: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId?: string
  notes?: string
  ipAddress?: string
  createdAt: Date
}

export interface DashboardStats {
  news: number
  services: number
  documents: number
  offices: number
  projects: number
  businesses: number
  partners: number
  leadership: number
  recentActivity: AuditLogEntry[]
}

// ------------------------------------------------------------------
// PRIVATE BUSINESSES / COMPANIES
// ------------------------------------------------------------------

export type BusinessSector =
  | 'AGRICULTURE'
  | 'AGRO_PROCESSING'
  | 'CONSTRUCTION'
  | 'TRADE'
  | 'HOSPITALITY'
  | 'HEALTH'
  | 'EDUCATION'
  | 'MANUFACTURING'
  | 'TRANSPORT'
  | 'ICT'
  | 'FINANCE'
  | 'OTHER'

export interface BusinessItem {
  id: string
  name_en: string
  name_am?: string
  name_om?: string
  description_en?: string
  description_am?: string
  description_om?: string
  sector: BusinessSector
  address?: string
  phone?: string
  email?: string
  website?: string
  established?: string
  employeeCount?: string
  photo?: MediaItem
  displayOrder: number
  status: ContentStatus
  createdAt: Date
  updatedAt: Date
}

// ------------------------------------------------------------------
// PARTNER ORGANIZATIONS
// ------------------------------------------------------------------

export type PartnerType =
  | 'NGO'
  | 'GOVERNMENT_AGENCY'
  | 'INTERNATIONAL_ORG'
  | 'DEVELOPMENT_PARTNER'
  | 'ACADEMIC'
  | 'PRIVATE_SECTOR'
  | 'OTHER'

export interface PartnerItem {
  id: string
  name_en: string
  name_am?: string
  name_om?: string
  description_en?: string
  description_am?: string
  description_om?: string
  partnerType: PartnerType
  country?: string
  website?: string
  phone?: string
  email?: string
  logo?: MediaItem
  partnerSince?: string
  displayOrder: number
  status: ContentStatus
  createdAt: Date
  updatedAt: Date
}

// ------------------------------------------------------------------
// ANNOUNCEMENT BANNER
// ------------------------------------------------------------------

export type AnnouncementType = 'INFO' | 'WARNING' | 'SUCCESS' | 'URGENT'

export interface AnnouncementItem {
  id: string
  text_en: string
  text_am?: string
  text_om?: string
  type: AnnouncementType
  linkUrl?: string
  linkLabel_en?: string
  isActive: boolean
  expiresAt?: Date
  createdAt: Date
}
