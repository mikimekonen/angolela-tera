import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getStore, getMaintenanceStatus } from '@/lib/dataStore'

export const dynamic = 'force-dynamic'

export async function GET() {
  const startTime = Date.now()
  const checks: Record<string, { status: 'UP' | 'DOWN'; latencyMs?: number; details?: any }> = {}
  let isSystemHealthy = true

  // 1. Data Store Storage Integrity Check
  try {
    const storeStart = Date.now()
    const store = getStore()
    const storePath = path.join(process.cwd(), 'src', 'data', 'dbStore.json')
    const exists = fs.existsSync(storePath)
    const stats = exists ? fs.statSync(storePath) : null

    checks.storage = {
      status: exists ? 'UP' : 'DOWN',
      latencyMs: Date.now() - storeStart,
      details: {
        engine: 'Atomic File DataStore',
        userCount: store.users?.length || 0,
        inquiryCount: store.inquiries?.length || 0,
        activityLogCount: store.auditLogs?.length || 0,
        fileSizeBytes: stats ? stats.size : 0,
        lastModified: stats ? stats.mtime.toISOString() : null,
      },
    }

    if (!exists) isSystemHealthy = false
  } catch (err: any) {
    isSystemHealthy = false
    checks.storage = {
      status: 'DOWN',
      details: { error: err?.message || 'Storage verification failed' },
    }
  }

  // 2. Maintenance Mode Status
  let maintenanceMode = false
  try {
    const maint = getMaintenanceStatus()
    maintenanceMode = Boolean(maint?.isActive)
  } catch {
    maintenanceMode = false
  }

  // 3. Memory & Runtime Diagnostics
  const memory = process.memoryUsage()
  const runtime = {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptimeSeconds: Math.floor(process.uptime()),
    memoryMb: {
      rss: Math.round(memory.rss / 1024 / 1024),
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024),
      external: Math.round(memory.external / 1024 / 1024),
    },
    environment: process.env.NODE_ENV || 'development',
  }

  const overallLatency = Date.now() - startTime

  return NextResponse.json(
    {
      status: isSystemHealthy ? (maintenanceMode ? 'MAINTENANCE' : 'HEALTHY') : 'DEGRADED',
      timestamp: new Date().toISOString(),
      latencyMs: overallLatency,
      checks,
      runtime,
      maintenanceMode,
      version: '1.0.0-prod-ready',
      woreda: 'Angolela Tera Woreda Government Digital Service Platform',
    },
    {
      status: isSystemHealthy ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  )
}
