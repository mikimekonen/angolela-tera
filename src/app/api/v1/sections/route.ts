import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getHomepageSections, toggleHomepageSection, reorderHomepageSections } from '@/lib/dataStore'

export async function GET() {
  try {
    const sections = getHomepageSections()
    return NextResponse.json({ success: true, data: sections })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session || session.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ success: false, error: 'Forbidden: Super Admin only' }, { status: 403 })
    }

    const body = await req.json()

    // Handle toggle
    if (body.action === 'toggle' && body.sectionKey !== undefined && body.isEnabled !== undefined) {
      const updated = toggleHomepageSection(body.sectionKey, Boolean(body.isEnabled), session.name)
      return NextResponse.json({ success: true, data: updated })
    }

    // Handle reorder
    if (body.action === 'reorder' && Array.isArray(body.orderedKeys)) {
      const updatedList = reorderHomepageSections(body.orderedKeys, session.name)
      return NextResponse.json({ success: true, data: updatedList })
    }

    return NextResponse.json({ success: false, error: 'Invalid action or parameters' }, { status: 400 })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
