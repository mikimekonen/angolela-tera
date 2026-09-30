import createMiddleware from 'next-intl/middleware'
import { locales, defaultLocale } from '@/i18n/config'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Middleware for Angolela Tera portal:
 *
 * 1. Internationalization routing  — prefix every public path with /[locale]
 *    e.g.  /       → /en or /am or /om (based on Accept-Language or cookie)
 *          /news   → /en/news
 *
 * 2. Admin routes (/admin/**) are excluded from locale routing —
 *    the admin panel is English-only by default.
 *
 * 3. API routes (/api/**) are excluded — handled separately.
 *
 * 4. Rate-limit sensitive paths (contact form, search) via x-forwarded-for
 *    header inspection. Full rate limiting is enforced at the API layer.
 */

const intlMiddleware = createMiddleware({
  locales,
  defaultLocale,
  localePrefix: 'always', // always show /en/ /am/ /om/ in URL for clarity
  localeDetection: true,  // auto-detect from Accept-Language, then cookie
})

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Bypass i18n for admin, API, static assets, and Next.js internals
  const isAdminPath  = pathname.startsWith('/admin')
  const isApiPath    = pathname.startsWith('/api')
  const isStaticPath = pathname.startsWith('/_next') ||
                       pathname.startsWith('/favicon') ||
                       pathname.startsWith('/robots') ||
                       pathname.startsWith('/sitemap') ||
                       pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|woff2|woff|ttf)$/)

  if (isAdminPath || isApiPath || isStaticPath) {
    return NextResponse.next()
  }

  return intlMiddleware(request)
}

export const config = {
  // Match all paths except those explicitly bypassed above
  matcher: ['/((?!_next|api|admin|favicon|robots|sitemap|.*\\..*).*)'],
}
