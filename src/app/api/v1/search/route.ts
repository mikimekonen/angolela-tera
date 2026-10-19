import { NextRequest, NextResponse } from 'next/server'
import {
  getServices,
  getOffices,
  getNews,
  getLeadership,
  getInvestments,
  getTourism,
  getDevelopmentProjects,
  getKebeles,
  getDocuments,
  getCompanies,
  getPartners,
  getTenders,
} from '@/lib/dataStore'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = (searchParams.get('q') || '').trim().toLowerCase()
    const category = searchParams.get('category') || 'all'

    if (!q) {
      return NextResponse.json({ success: true, data: [], total: 0 })
    }

    const results: Array<{
      id: string
      type: string
      categoryLabel: string
      title: string
      title_am?: string
      description?: string
      url: string
      badge?: string
    }> = []

    // 1. Services
    if (category === 'all' || category === 'services') {
      const services = getServices()
      for (const s of services) {
        if (
          s.title_en?.toLowerCase().includes(q) ||
          s.title_am?.includes(q) ||
          s.description_en?.toLowerCase().includes(q) ||
          s.slug?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `service-${s.id}`,
            type: 'services',
            categoryLabel: 'Public Service',
            title: s.title_en,
            title_am: s.title_am,
            description: s.description_en || s.description_am,
            url: `/services/${s.slug || s.id}`,
            badge: s.category || 'Government Service',
          })
        }
      }
    }

    // 3. News & Announcements
    if (category === 'all' || category === 'news') {
      const news = getNews()
      for (const n of news) {
        if (
          n.title_en?.toLowerCase().includes(q) ||
          n.title_am?.includes(q) ||
          n.excerpt_en?.toLowerCase().includes(q) ||
          n.slug?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `news-${n.id}`,
            type: 'news',
            categoryLabel: 'News & Press',
            title: n.title_en,
            title_am: n.title_am,
            description: n.excerpt_en || n.excerpt_am,
            url: `/news/${n.slug || n.id}`,
            badge: n.category?.name_en || 'Official News',
          })
        }
      }
    }

    // 4. Tourism Destinations
    if (category === 'all' || category === 'tourism') {
      const tourism = getTourism()
      for (const t of tourism) {
        if (
          t.name_en?.toLowerCase().includes(q) ||
          t.name_am?.includes(q) ||
          t.description_en?.toLowerCase().includes(q) ||
          t.slug?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `tourism-${t.id}`,
            type: 'tourism',
            categoryLabel: 'Tourism Destination',
            title: t.name_en,
            title_am: t.name_am,
            description: t.description_en || t.description_am,
            url: `/tourism`,
            badge: t.category || 'Heritage Site',
          })
        }
      }
    }

    // 5. Development Projects
    if (category === 'all' || category === 'projects') {
      const projects = getDevelopmentProjects()
      for (const p of projects) {
        if (
          p.title_en?.toLowerCase().includes(q) ||
          p.title_am?.includes(q) ||
          p.description_en?.toLowerCase().includes(q) ||
          p.sector?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `project-${p.id}`,
            type: 'projects',
            categoryLabel: 'Development Project',
            title: p.title_en,
            title_am: p.title_am,
            description: p.description_en || p.description_am,
            url: `/development`,
            badge: `${p.sector} • ${p.progressPercent || 0}%`,
          })
        }
      }
    }

    // 6. Investments
    if (category === 'all' || category === 'investment') {
      const investments = getInvestments()
      for (const inv of investments) {
        if (
          inv.title_en?.toLowerCase().includes(q) ||
          inv.title_am?.includes(q) ||
          inv.summary_en?.toLowerCase().includes(q) ||
          inv.sector?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `inv-${inv.id}`,
            type: 'investment',
            categoryLabel: 'Investment Opportunity',
            title: inv.title_en,
            title_am: inv.title_am,
            description: inv.summary_en || inv.description_en,
            url: `/investment`,
            badge: inv.sector,
          })
        }
      }
    }

    // 7. Documents & Forms
    if (category === 'all' || category === 'documents') {
      const documents = getDocuments()
      for (const doc of documents) {
        if (
          doc.title_en?.toLowerCase().includes(q) ||
          doc.title_am?.includes(q) ||
          doc.description_en?.toLowerCase().includes(q) ||
          doc.category?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `doc-${doc.id}`,
            type: 'documents',
            categoryLabel: 'Public Document',
            title: doc.title_en,
            title_am: doc.title_am,
            description: doc.description_en || doc.description_am,
            url: `/resources`,
            badge: doc.category,
          })
        }
      }
    }

    // 8. Kebeles & Towns
    if (category === 'all' || category === 'kebeles') {
      const kebeles = getKebeles()
      for (const k of kebeles) {
        if (
          k.name_en?.toLowerCase().includes(q) ||
          k.name_am?.includes(q) ||
          k.mainAgroEcology?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `kebele-${k.id}`,
            type: 'kebeles',
            categoryLabel: 'Kebele / Town',
            title: k.name_en,
            title_am: k.name_am,
            description: `Population: ${k.population?.toLocaleString() || 'N/A'} • Distance: ${k.distanceFromCapitalKm || '—'} km from Chacha`,
            url: `/kebeles/${k.slug || k.id}`,
            badge: k.type === 'URBAN_TOWN' ? 'Urban Town' : 'Rural Kebele',
          })
        }
      }
    }

    // 9. Businesses / Companies
    if (category === 'all' || category === 'companies') {
      const companies = getCompanies()
      for (const c of companies) {
        if (
          c.name_en?.toLowerCase().includes(q) ||
          c.name_am?.includes(q) ||
          c.description_en?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `company-${c.id}`,
            type: 'companies',
            categoryLabel: 'Enterprise',
            title: c.name_en,
            title_am: c.name_am,
            description: c.description_en || c.description_am,
            url: `/companies/${c.id}`,
            badge: c.sector || 'Private Sector',
          })
        }
      }
    }

    // 10. Strategic Partners
    if (category === 'all' || category === 'partners') {
      const partners = getPartners()
      for (const pt of partners) {
        if (
          pt.name_en?.toLowerCase().includes(q) ||
          pt.name_am?.includes(q) ||
          pt.description_en?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `partner-${pt.id}`,
            type: 'partners',
            categoryLabel: 'Strategic Partner',
            title: pt.name_en,
            title_am: pt.name_am,
            description: pt.description_en || pt.description_am,
            url: `/partners`,
            badge: pt.partnerType || 'Partner Organization',
          })
        }
      }
    }

    // 11. Tenders
    if (category === 'all' || category === 'tenders') {
      const tenders = getTenders()
      for (const td of tenders) {
        if (
          td.title_en?.toLowerCase().includes(q) ||
          td.title_am?.includes(q) ||
          td.procuringEntity?.toLowerCase().includes(q) ||
          td.bidNumber?.toLowerCase().includes(q)
        ) {
          results.push({
            id: `tender-${td.id}`,
            type: 'tenders',
            categoryLabel: 'Public Tender',
            title: td.title_en,
            title_am: td.title_am,
            description: `Procuring Entity: ${td.procuringEntity} • Bid No: ${td.bidNumber}`,
            url: `/tenders`,
            badge: td.tenderStatus || 'Active Bid',
          })
        }
      }
    }

    return NextResponse.json({
      success: true,
      query: q,
      category,
      total: results.length,
      data: results,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
