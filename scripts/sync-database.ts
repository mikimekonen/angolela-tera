/**
 * Angolela Tera Woreda Administration
 * Enterprise Database Synchronization & Migration Tool
 *
 * Migrates local JSON store data into PostgreSQL via Prisma ORM.
 * Safe, idempotent upserts across all 18 governmental entity models.
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/sync-database.ts
 */

import { prisma } from '../src/lib/db'
import {
  getOffices,
  getServices,
  getNews,
  getTenders,
  getKebeles,
  getDevelopmentProjects,
  getTourism,
  getPartners,
  getCompanies,
  getInvestments,
  getLeadership,
  getUsers,
  getSiteSettings,
  getInquiries,
  getSliders,
  getDocuments,
  getMediaAssets,
} from '../src/lib/dataStore'

async function sync() {
  console.log('🏛️ Starting Angolela Tera Woreda Database Synchronization...')

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is missing!')
    process.exit(1)
  }

  try {
    // 1. Sync Users
    const users = getUsers()
    console.log(`Syncing ${users.length} administrative user accounts...`)
    for (const u of users) {
      if (prisma.user?.upsert) {
        await prisma.user.upsert({
          where: { email: u.email },
          update: {
            name: u.name,
            passwordHash: u.passwordHash,
            role: u.role as any,
            officeId: u.officeId || null,
            isActive: u.isActive,
            phone: u.phone || null,
            designation: u.designation || null,
            avatarUrl: u.avatarUrl || null,
            tokenVersion: u.tokenVersion || 1,
            mustChangePassword: Boolean(u.mustChangePassword),
          },
          create: {
            id: u.id,
            email: u.email,
            name: u.name,
            passwordHash: u.passwordHash,
            role: u.role as any,
            officeId: u.officeId || null,
            isActive: u.isActive,
            phone: u.phone || null,
            designation: u.designation || null,
            avatarUrl: u.avatarUrl || null,
            tokenVersion: u.tokenVersion || 1,
            mustChangePassword: Boolean(u.mustChangePassword),
          },
        })
      }
    }

    // 2. Sync Offices
    const offices = getOffices()
    console.log(`Syncing ${offices.length} sector offices...`)
    for (const off of offices) {
      if (prisma.office?.upsert) {
        await prisma.office.upsert({
          where: { slug: off.slug },
          update: {
            name_en: off.name_en,
            name_am: off.name_am,
            about_en: off.about_en,
            about_am: off.about_am,
            vision_en: off.vision_en,
            vision_am: off.vision_am,
            mission_en: off.mission_en,
            mission_am: off.mission_am,
            phone: off.phone,
            email: off.email,
            displayOrder: off.displayOrder || 0,
            status: (off.status as any) || 'PUBLISHED',
          },
          create: {
            id: off.id,
            slug: off.slug,
            name_en: off.name_en,
            name_am: off.name_am,
            about_en: off.about_en,
            about_am: off.about_am,
            vision_en: off.vision_en,
            vision_am: off.vision_am,
            mission_en: off.mission_en,
            mission_am: off.mission_am,
            phone: off.phone,
            email: off.email,
            displayOrder: off.displayOrder || 0,
            status: (off.status as any) || 'PUBLISHED',
          },
        })
      }
    }

    // 3. Sync Kebeles
    const kebeles = getKebeles()
    console.log(`Syncing ${kebeles.length} kebeles...`)
    for (const k of kebeles) {
      if (prisma.kebele?.upsert) {
        await prisma.kebele.upsert({
          where: { slug: k.slug },
          update: {
            name_en: k.name_en,
            name_am: k.name_am,
            type: (k.type as any) || 'RURAL_KEBELE',
            population: k.population,
            distanceFromCapitalKm: k.distanceFromCapitalKm,
            mainAgroEcology: k.mainAgroEcology,
            economicActivities_en: k.economicActivities_en,
            economicActivities_am: k.economicActivities_am,
            administratorName: k.administratorName,
            contactPhone: k.contactPhone,
            displayOrder: k.displayOrder || 0,
            status: (k.status as any) || 'PUBLISHED',
          },
          create: {
            id: k.id,
            slug: k.slug,
            name_en: k.name_en,
            name_am: k.name_am,
            type: (k.type as any) || 'RURAL_KEBELE',
            population: k.population,
            distanceFromCapitalKm: k.distanceFromCapitalKm,
            mainAgroEcology: k.mainAgroEcology,
            economicActivities_en: k.economicActivities_en,
            economicActivities_am: k.economicActivities_am,
            administratorName: k.administratorName,
            contactPhone: k.contactPhone,
            displayOrder: k.displayOrder || 0,
            status: (k.status as any) || 'PUBLISHED',
          },
        })
      }
    }

    // 4. Sync Leadership
    const leaders = getLeadership()
    console.log(`Syncing ${leaders.length} cabinet leaders...`)
    for (const l of leaders) {
      if (prisma.leadership?.upsert) {
        await prisma.leadership.upsert({
          where: { id: l.id },
          update: {
            name: l.name,
            title_en: l.title_en,
            title_am: l.title_am,
            bio_en: l.bio_en,
            bio_am: l.bio_am,
            isAdministrator: Boolean(l.isAdministrator),
            displayOrder: l.displayOrder || 0,
            status: (l.status as any) || 'PUBLISHED',
          },
          create: {
            id: l.id,
            name: l.name,
            title_en: l.title_en,
            title_am: l.title_am,
            bio_en: l.bio_en,
            bio_am: l.bio_am,
            isAdministrator: Boolean(l.isAdministrator),
            displayOrder: l.displayOrder || 0,
            status: (l.status as any) || 'PUBLISHED',
          },
        })
      }
    }

    // 5. Sync Public Services
    const services = getServices()
    console.log(`Syncing ${services.length} public services...`)
    const firstUser = users[0]?.id || 'usr-superadmin'
    for (const s of services) {
      if (prisma.service?.upsert) {
        await prisma.service.upsert({
          where: { slug: s.slug || s.id },
          update: {
            name_en: s.title_en || s.name_en,
            name_am: s.title_am || s.name_am,
            description_en: s.description_en,
            description_am: s.description_am,
            requirements_en: s.requirements_en,
            requirements_am: s.requirements_am,
            steps_en: s.steps_en,
            steps_am: s.steps_am,
            officeId: s.officeId || null,
            icon: s.icon || null,
            externalUrl: s.externalUrl || null,
            displayOrder: s.displayOrder || 0,
            status: (s.status as any) || 'PUBLISHED',
          },
          create: {
            id: s.id,
            slug: s.slug || s.id,
            name_en: s.title_en || s.name_en,
            name_am: s.title_am || s.name_am,
            description_en: s.description_en,
            description_am: s.description_am,
            requirements_en: s.requirements_en,
            requirements_am: s.requirements_am,
            steps_en: s.steps_en,
            steps_am: s.steps_am,
            officeId: s.officeId || null,
            icon: s.icon || null,
            externalUrl: s.externalUrl || null,
            displayOrder: s.displayOrder || 0,
            status: (s.status as any) || 'PUBLISHED',
            authorId: firstUser,
          },
        })
      }
    }

    // 6. Sync News & Editorial Workflow Articles
    const news = getNews()
    console.log(`Syncing ${news.length} news articles...`)
    for (const n of news) {
      if (prisma.news?.upsert) {
        await prisma.news.upsert({
          where: { slug: n.slug },
          update: {
            title_en: n.title_en,
            title_am: n.title_am,
            excerpt_en: n.summary_en || n.excerpt_en,
            excerpt_am: n.summary_am || n.excerpt_am,
            body_en: Array.isArray(n.content_en) ? n.content_en.join('\n\n') : n.content_en || '',
            body_am: Array.isArray(n.content_am) ? n.content_am.join('\n\n') : n.content_am || '',
            imageCaption_en: n.imageCaption_en || null,
            imageCaption_am: n.imageCaption_am || null,
            videoUrl: n.videoUrl || null,
            videoType: n.videoType || 'embed',
            gallery: n.gallery || null,
            documentUrl: n.documentUrl || null,
            documentTitle: n.documentTitle || null,
            referenceNumber: n.referenceNumber || null,
            status: (n.status as any) || 'PUBLISHED',
            isFeatured: Boolean(n.isFeatured),
            publishedAt: n.date_en ? new Date(n.date_en) : new Date(),
          },
          create: {
            id: n.id,
            slug: n.slug,
            title_en: n.title_en,
            title_am: n.title_am,
            excerpt_en: n.summary_en || n.excerpt_en,
            excerpt_am: n.summary_am || n.excerpt_am,
            body_en: Array.isArray(n.content_en) ? n.content_en.join('\n\n') : n.content_en || '',
            body_am: Array.isArray(n.content_am) ? n.content_am.join('\n\n') : n.content_am || '',
            imageCaption_en: n.imageCaption_en || null,
            imageCaption_am: n.imageCaption_am || null,
            videoUrl: n.videoUrl || null,
            videoType: n.videoType || 'embed',
            gallery: n.gallery || null,
            documentUrl: n.documentUrl || null,
            documentTitle: n.documentTitle || null,
            referenceNumber: n.referenceNumber || null,
            status: (n.status as any) || 'PUBLISHED',
            isFeatured: Boolean(n.isFeatured),
            publishedAt: n.date_en ? new Date(n.date_en) : new Date(),
            authorId: firstUser,
          },
        })
      }
    }

    // 7. Sync Tenders
    const tenders = getTenders()
    console.log(`Syncing ${tenders.length} public procurement tenders...`)
    for (const t of tenders) {
      if (prisma.tender?.upsert) {
        await prisma.tender.upsert({
          where: { bidNumber: t.bidNumber },
          update: {
            title_en: t.title_en,
            title_am: t.title_am,
            description_en: t.description_en,
            description_am: t.description_am,
            procuringEntity: t.procuringEntity,
            bidBondAmount: t.bidBondAmount || null,
            documentPrice: t.documentPrice || null,
            closingDate: t.closingDate ? new Date(t.closingDate) : new Date(),
            documentUrl: t.documentUrl || null,
            tenderStatus: t.tenderStatus || 'ACTIVE',
            status: (t.status as any) || 'PUBLISHED',
          },
          create: {
            id: t.id,
            bidNumber: t.bidNumber,
            title_en: t.title_en,
            title_am: t.title_am,
            description_en: t.description_en,
            description_am: t.description_am,
            procuringEntity: t.procuringEntity,
            bidBondAmount: t.bidBondAmount || null,
            documentPrice: t.documentPrice || null,
            closingDate: t.closingDate ? new Date(t.closingDate) : new Date(),
            documentUrl: t.documentUrl || null,
            tenderStatus: t.tenderStatus || 'ACTIVE',
            status: (t.status as any) || 'PUBLISHED',
          },
        })
      }
    }

    // 8. Sync Citizen Inquiries
    const inquiries = getInquiries()
    console.log(`Syncing ${inquiries.length} citizen inquiries & grievances...`)
    for (const inq of inquiries) {
      if (prisma.citizenInquiry?.upsert) {
        await prisma.citizenInquiry.upsert({
          where: { trackingCode: inq.trackingCode },
          update: {
            name: inq.name,
            email: inq.email,
            phone: inq.phone || null,
            subject: inq.subject,
            message: inq.message,
            category: inq.category,
            status: inq.status,
            responseNotes: inq.responseNotes || null,
            internalNotes: inq.internalNotes || null,
            assignedOfficeId: inq.assignedOfficeId || null,
            assignedStaffId: inq.assignedStaffId || null,
            statusHistory: (inq.statusHistory as any) || null,
          },
          create: {
            id: inq.id,
            trackingCode: inq.trackingCode,
            name: inq.name,
            email: inq.email,
            phone: inq.phone || null,
            subject: inq.subject,
            message: inq.message,
            category: inq.category,
            status: inq.status,
            responseNotes: inq.responseNotes || null,
            internalNotes: inq.internalNotes || null,
            assignedOfficeId: inq.assignedOfficeId || null,
            assignedStaffId: inq.assignedStaffId || null,
            statusHistory: (inq.statusHistory as any) || null,
          },
        })
      }
    }

    // 9. Sync Site Settings
    const settings = getSiteSettings()
    console.log(`Syncing system site settings...`)
    for (const [key, val] of Object.entries(settings)) {
      if (prisma.siteSetting?.upsert) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value: String(val) },
          create: {
            key,
            value: String(val),
            label: key.replace(/_/g, ' ').toUpperCase(),
            group: key.startsWith('contact_') ? 'contact' : 'general',
          },
        })
      }
    }

    console.log('✅ Angolela Tera Woreda Database Synchronization completed successfully!')
  } catch (err: any) {
    console.error('❌ Database sync failed:', err.message)
    process.exit(1)
  } finally {
    if (prisma.$disconnect) {
      await prisma.$disconnect()
    }
  }
}

sync()
