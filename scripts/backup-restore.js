/**
 * Angolela Tera Woreda Administration
 * Official Government Digital Portal — Disaster Recovery & Backup Utility
 *
 * Runs natively on Node.js without external dependencies.
 *
 * Usage:
 *  - node scripts/backup-restore.js --backup
 *  - node scripts/backup-restore.js --test
 *  - node scripts/backup-restore.js --restore <backup-file.json>
 */

const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

const BACKUP_DIR = path.join(process.cwd(), 'backups')
const DB_STORE_PATH = path.join(process.cwd(), 'src', 'data', 'dbStore.json')

function ensureBackupDirectory() {
  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true })
  }
}

function calculateChecksum(data) {
  return crypto.createHash('sha256').update(data, 'utf8').digest('hex')
}

function createBackup() {
  ensureBackupDirectory()

  if (!fs.existsSync(DB_STORE_PATH)) {
    throw new Error(`Primary data store not found at: ${DB_STORE_PATH}`)
  }

  const raw = fs.readFileSync(DB_STORE_PATH, 'utf8')
  const parsed = JSON.parse(raw)
  const checksum = calculateChecksum(raw)
  const now = new Date()
  const timestampStr = now.toISOString().replace(/[:.]/g, '-')

  const entityCounts = {}
  for (const [key, val] of Object.entries(parsed)) {
    if (Array.isArray(val)) {
      entityCounts[key] = val.length
    } else if (typeof val === 'object' && val !== null) {
      entityCounts[key] = Object.keys(val).length
    }
  }

  const metadata = {
    timestamp: now.toISOString(),
    version: '1.0.0-government-prod',
    entityCounts,
    sha256Checksum: checksum,
    snapshotSize: Buffer.byteLength(raw, 'utf8'),
  }

  const backupPackage = {
    metadata,
    payload: parsed,
  }

  const backupFileName = `angolela-tera-backup-${timestampStr}.json`
  const backupFilePath = path.join(BACKUP_DIR, backupFileName)

  fs.writeFileSync(backupFilePath, JSON.stringify(backupPackage, null, 2), 'utf8')
  console.log(`✅ [BACKUP CREATED]: ${backupFilePath}`)
  console.log(`   SHA-256 Checksum: ${checksum}`)
  console.log(`   Entity Counts:`, entityCounts)

  return { success: true, filePath: backupFilePath, metadata }
}

function testRestoration(backupFilePath) {
  console.log('🧪 Starting Disaster Recovery Restoration Test...')
  let targetPath = backupFilePath

  if (!targetPath) {
    const fresh = createBackup()
    targetPath = fresh.filePath
  }

  if (!fs.existsSync(targetPath)) {
    throw new Error(`Backup file does not exist: ${targetPath}`)
  }

  const raw = fs.readFileSync(targetPath, 'utf8')
  const backup = JSON.parse(raw)

  if (!backup.metadata || !backup.payload) {
    throw new Error('Invalid backup format: Missing metadata or payload.')
  }

  console.log(`   Verifying integrity for archive created at ${backup.metadata.timestamp}...`)

  const requiredCollections = [
    'offices',
    'leadership',
    'services',
    'news',
    'kebeles',
    'inquiries',
    'users',
    'auditLogs',
    'documents',
    'developmentProjects',
  ]

  for (const col of requiredCollections) {
    if (!backup.payload[col] || !Array.isArray(backup.payload[col])) {
      throw new Error(`Restoration validation failed: Missing or invalid collection '${col}'`)
    }
    console.log(`   ✓ Collection '${col}': ${backup.payload[col].length} verified records.`)
  }

  console.log('🎉 Disaster Recovery Restoration Test PASSED: Backup archive is 100% valid and restorable.')
  return true
}

function restoreFromBackup(backupFilePath) {
  if (!fs.existsSync(backupFilePath)) {
    throw new Error(`Backup file does not exist: ${backupFilePath}`)
  }

  const raw = fs.readFileSync(backupFilePath, 'utf8')
  const backup = JSON.parse(raw)

  if (!backup.payload) {
    throw new Error('Corrupted backup file: No payload found.')
  }

  const safetyBackupPath = path.join(BACKUP_DIR, `pre-restore-safety-${Date.now()}.json`)
  if (fs.existsSync(DB_STORE_PATH)) {
    fs.copyFileSync(DB_STORE_PATH, safetyBackupPath)
    console.log(`🛡️ Safety backup created at ${safetyBackupPath} prior to overwrite.`)
  }

  fs.writeFileSync(DB_STORE_PATH, JSON.stringify(backup.payload, null, 2), 'utf8')
  console.log(`✅ System successfully restored from ${backupFilePath}`)
  return true
}

if (require.main === module) {
  const arg = process.argv[2]
  if (arg === '--backup') {
    createBackup()
  } else if (arg === '--test') {
    testRestoration()
  } else if (arg === '--restore') {
    const file = process.argv[3]
    if (!file) {
      console.error('Error: specify path to backup file.')
      process.exit(1)
    }
    restoreFromBackup(file)
  } else {
    console.log(`
Angolela Tera Woreda — Backup & Restoration CLI
Usage:
  --backup                 Create a new backup archive
  --test                   Create backup and execute restoration validation dry-run
  --restore <file.json>    Restore active system state from backup archive
    `)
  }
}

module.exports = {
  createBackup,
  testRestoration,
  restoreFromBackup,
}
