/**
 * Angolela Tera Woreda Administration
 * Database Synchronization & Migration Tool
 *
 * Migrates local JSON store data into PostgreSQL via Prisma ORM.
 * Run with: npx ts-node scripts/sync-database.ts
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
} from '../src/lib/dataStore'

async function sync() {
  console.log('🏛️ Starting Angolela Tera Woreda Database Synchronization...')

  if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable is missing!')
    process.exit(1)
  }

  try {
    // 1. Sync Offices
    const offices = getOffices()
    console.log(`Syncing ${offices.length} sector offices...`)
    for (const off of offices) {
      if (prisma.office?.upsert) {
        await prisma.office.upsert({
          where: { slug: off.slug },
          update: {
            name_en: off.name_en,
            name_am: off.name_am,
            phone: off.phone,
            email: off.email,
          },
          create: {
            id: off.id,
            slug: off.slug,
            name_en: off.name_en,
            name_am: off.name_am,
            phone: off.phone,
            email: off.email,
          },
        })
      }
    }

    // 2. Sync Kebeles
    const kebeles = getKebeles()
    console.log(`Syncing ${kebeles.length} kebeles...`)
    for (const k of kebeles) {
      if (prisma.kebele?.upsert) {
        await prisma.kebele.upsert({
          where: { slug: k.slug },
          update: {
            name_en: k.name_en,
            name_am: k.name_am,
            population: k.population,
            distanceFromCapitalKm: k.distanceFromCapitalKm,
          },
          create: {
            id: k.id,
            slug: k.slug,
            name_en: k.name_en,
            name_am: k.name_am,
            population: k.population,
            distanceFromCapitalKm: k.distanceFromCapitalKm,
          },
        })
      }
    }

    // 3. Sync Leadership
    const leaders = getLeadership()
    console.log(`Syncing ${leaders.length} cabinet leaders...`)
    for (const l of leaders) {
      if (prisma.leadership?.upsert) {
        await prisma.leadership.upsert({
          where: { id: l.id },
          update: {
            name_en: l.name_en,
            name_am: l.name_am,
            title_en: l.title_en,
            title_am: l.title_am,
            bio_en: l.bio_en,
            bio_am: l.bio_am,
            photo: l.photo,
          },
          create: {
            id: l.id,
            name_en: l.name_en,
            name_am: l.name_am,
            title_en: l.title_en,
            title_am: l.title_am,
            bio_en: l.bio_en,
            bio_am: l.bio_am,
            photo: l.photo,
            displayOrder: l.displayOrder || 1,
            status: l.status || 'ACTIVE',
          },
        })
      }
    }

    console.log('✅ Synchronization completed successfully!')
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
