/**
 * Prisma Client singleton.
 *
 * In development, Next.js hot-reloads modules frequently.
 * This pattern caches the client on the global object in development.
 * In production, a single module instance is created at startup.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PrismaClientConstructor: any

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const prismaPkg = require('@prisma/client')
  PrismaClientConstructor = prismaPkg.PrismaClient || class MockPrismaClient {}
} catch {
  PrismaClientConstructor = class MockPrismaClient {}
}

const globalForPrisma = globalThis as unknown as {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  prisma: any
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClientConstructor({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
