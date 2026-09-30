/**
 * Prisma seed script
 * Populates the database with:
 *  - 1 Super Admin user (change password immediately)
 *  - Site settings (all placeholder values)
 *  - Statistics (all [VERIFIED_NUMBER] — set isVerified=false)
 *  - 10 Government Offices (structural placeholders)
 *  - News categories
 *  - 1 placeholder Leadership entry (Woreda Administrator)
 */

import { PrismaClient, ContentStatus, UserRole } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database for Angolela Tera Woreda Administration Portal...')

  // ------------------------------------------------------------------
  // 1. SUPER ADMIN USER
  // ------------------------------------------------------------------
  const adminPasswordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD ?? 'Change-This-Immediately!1',
    12
  )
  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@angolela-tera.gov.et' },
    update: {},
    create: {
      email:        'admin@angolela-tera.gov.et',
      name:         'System Administrator',
      passwordHash: adminPasswordHash,
      role:         UserRole.SUPER_ADMIN,
      isActive:     true,
    },
  })
  console.log(`✅ Super admin created: ${superAdmin.email}`)

  // ------------------------------------------------------------------
  // 2. SITE SETTINGS
  // ------------------------------------------------------------------
  const settings = [
    { key: 'site_name_en',     value: 'Angolela Tera Woreda Administration',     label: 'Site Name (English)',      group: 'general' },
    { key: 'site_name_am',     value: 'አንጎሌላ ተራ ወረዳ አስተዳደር',                    label: 'Site Name (Amharic)',       group: 'general' },
    { key: 'site_name_om',     value: 'Bulchiinsa Aanaa Angolela Tera',           label: 'Site Name (Afaan Oromo)',   group: 'general' },
    { key: 'contact_phone',    value: '[OFFICIAL PHONE NUMBER]',                  label: 'Main Contact Phone',       group: 'contact' },
    { key: 'contact_email',    value: '[OFFICIAL EMAIL ADDRESS]',                 label: 'Main Contact Email',       group: 'contact' },
    { key: 'contact_fax',      value: '[FAX NUMBER]',                             label: 'Fax Number',               group: 'contact' },
    { key: 'contact_address_en', value: 'Angolela Tera, Amhara Region, Ethiopia', label: 'Address (English)',        group: 'contact' },
    { key: 'contact_address_am', value: '[አድራሻ - አማርኛ]',                           label: 'Address (Amharic)',        group: 'contact' },
    { key: 'office_hours_en',  value: 'Monday – Friday, 8:30 AM – 5:30 PM',      label: 'Office Hours (English)',   group: 'contact' },
    { key: 'social_facebook',  value: '',                                         label: 'Facebook URL',             group: 'social' },
    { key: 'social_telegram',  value: '',                                         label: 'Telegram Channel',         group: 'social' },
    { key: 'social_youtube',   value: '',                                         label: 'YouTube Channel',          group: 'social' },
    { key: 'social_twitter',   value: '',                                         label: 'Twitter/X',                group: 'social' },
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    })
  }
  console.log(`✅ ${settings.length} site settings seeded`)

  // ------------------------------------------------------------------
  // 3. STATISTICS (all unverified — set isVerified=true via admin panel)
  // ------------------------------------------------------------------
  const stats = [
    { key: 'population',        value: '[VERIFIED NUMBER]', label_en: 'Population',        label_am: 'ህዝብ ብዛት',        unit_en: 'residents',   icon: 'Users',      displayOrder: 1 },
    { key: 'area_sqkm',         value: '[VERIFIED NUMBER]', label_en: 'Total Area',         label_am: 'ጠቅላላ ስፋት',        unit_en: 'km²',         icon: 'Map',        displayOrder: 2 },
    { key: 'kebeles',           value: '[VERIFIED NUMBER]', label_en: 'Kebeles',            label_am: 'ቀበሌዎች',           unit_en: 'kebeles',     icon: 'Building2',  displayOrder: 3 },
    { key: 'urban_centers',     value: '[VERIFIED NUMBER]', label_en: 'Urban Centers',      label_am: 'ከተሞች',            unit_en: 'centers',     icon: 'Building',   displayOrder: 4 },
    { key: 'government_offices',value: '[VERIFIED NUMBER]', label_en: 'Government Offices', label_am: 'የመንግሥት ቢሮዎች',    unit_en: 'offices',     icon: 'Landmark',   displayOrder: 5 },
    { key: 'dev_projects',      value: '[VERIFIED NUMBER]', label_en: 'Development Projects',label_am: 'የልማት ፕሮጀክቶች',   unit_en: 'projects',    icon: 'Wrench',     displayOrder: 6 },
  ]

  for (const s of stats) {
    await prisma.statistic.upsert({
      where: { key: s.key },
      update: {},
      create: { ...s, isVerified: false },
    })
  }
  console.log(`✅ ${stats.length} statistics seeded (all unverified)`)

  // ------------------------------------------------------------------
  // 4. GOVERNMENT OFFICES
  //    Replace with the actual official organizational structure.
  //    Slugs must stay stable once published (they appear in URLs).
  // ------------------------------------------------------------------
  const offices = [
    { slug: 'agriculture',         name_en: 'Agriculture Office',               name_am: 'ግብርና ቢሮ',                displayOrder: 1  },
    { slug: 'education',           name_en: 'Education Office',                 name_am: 'ትምህርት ቢሮ',               displayOrder: 2  },
    { slug: 'health',              name_en: 'Health Office',                    name_am: 'ጤና ቢሮ',                  displayOrder: 3  },
    { slug: 'finance',             name_en: 'Finance Office',                   name_am: 'ፋይናንስ ቢሮ',              displayOrder: 4  },
    { slug: 'trade-investment',    name_en: 'Trade & Investment Office',        name_am: 'ንግድና ኢንቨስትሜንት ቢሮ',     displayOrder: 5  },
    { slug: 'land-administration', name_en: 'Land Administration Office',       name_am: 'መሬት አስተዳደር ቢሮ',         displayOrder: 6  },
    { slug: 'infrastructure',      name_en: 'Infrastructure Office',            name_am: 'መሰረተ ልማት ቢሮ',           displayOrder: 7  },
    { slug: 'women-social-affairs',name_en: 'Women & Social Affairs Office',    name_am: 'ሴቶችና ማኅበራዊ ጉዳዮች ቢሮ', displayOrder: 8  },
    { slug: 'youth-sport',         name_en: 'Youth & Sport Office',             name_am: 'ወጣትና ስፖርት ቢሮ',         displayOrder: 9  },
    { slug: 'ict',                 name_en: 'ICT Office',                       name_am: 'መረጃ ቴክኖሎጂ ቢሮ',         displayOrder: 10 },
  ]

  for (const o of offices) {
    await prisma.office.upsert({
      where: { slug: o.slug },
      update: {},
      create: {
        ...o,
        status: ContentStatus.DRAFT,
        about_en: `[About the ${o.name_en} — to be provided by the office head]`,
        vision_en: '[Vision statement — to be provided]',
        mission_en: '[Mission statement — to be provided]',
      },
    })
  }
  console.log(`✅ ${offices.length} government offices seeded`)

  // ------------------------------------------------------------------
  // 5. NEWS CATEGORIES
  // ------------------------------------------------------------------
  const categories = [
    { slug: 'general',     name_en: 'General',          name_am: 'አጠቃላይ',          color: '#1a4f8b' },
    { slug: 'agriculture', name_en: 'Agriculture',      name_am: 'ግብርና',            color: '#166534' },
    { slug: 'health',      name_en: 'Health',           name_am: 'ጤና',              color: '#991b1b' },
    { slug: 'education',   name_en: 'Education',        name_am: 'ትምህርት',           color: '#92400e' },
    { slug: 'development', name_en: 'Development',      name_am: 'ልማት',            color: '#1e40af' },
    { slug: 'announcement',name_en: 'Announcement',     name_am: 'ማስታወቂያ',         color: '#c8931a' },
  ]

  for (const c of categories) {
    await prisma.newsCategory.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
  }
  console.log(`✅ ${categories.length} news categories seeded`)

  // ------------------------------------------------------------------
  // 6. LEADERSHIP — WOREDA ADMINISTRATOR (placeholder)
  // ------------------------------------------------------------------
  await prisma.leadership.upsert({
    where: { id: 'seed-administrator' },
    update: {},
    create: {
      id:              'seed-administrator',
      name:            '[Administrator Name]',
      title_en:        'Woreda Administrator',
      title_am:        'ወረዳ አስተዳዳሪ',
      bio_en:          '[Official biography — to be provided]',
      message_en:      '[Official welcome message from the Woreda Administrator — to be provided by the Communication Office]',
      isAdministrator: true,
      displayOrder:    1,
      status:          ContentStatus.DRAFT,
    },
  })
  console.log('✅ Leadership placeholder seeded')

  // ------------------------------------------------------------------
  // 7. PLACEHOLDER HERO SLIDE
  // ------------------------------------------------------------------
  // Hero slides require a media record. We create a placeholder
  // that references an image that must be uploaded via the admin panel.
  console.log('ℹ️  Hero slides: upload official photography via admin panel → Hero Slides')

  console.log('\n✨ Seed complete. Next steps:')
  console.log('   1. Change the super admin password immediately via /admin/profile')
  console.log('   2. Verify and fill all statistics via /admin/statistics')
  console.log('   3. Upload official photography via /admin/media')
  console.log('   4. Fill in office details via /admin/offices')
  console.log('   5. Add leadership details and official portrait via /admin/leadership')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
