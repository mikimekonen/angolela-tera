import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getSiteSettings, updateSiteSettings } from '@/lib/dataStore'

export async function GET() {
  try {
    const settings = getSiteSettings()
    return NextResponse.json({ success: true, data: settings })
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
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ success: false, error: 'Invalid settings payload' }, { status: 400 })
    }

    const updated = updateSiteSettings(body, session.name)
    return NextResponse.json({ success: true, data: updated })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
