import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/config.ts')

const nextConfig: NextConfig = {

  // ------------------------------------------------------------------
  // Image domains — add official image hosting domains here
  // ------------------------------------------------------------------
  images: {
    remotePatterns: [
      // For local development (uploads served from /public/uploads)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
      // Add S3 / CDN domain here for production
      // { protocol: 'https', hostname: 'assets.angolela-tera.gov.et', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1440],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  // ------------------------------------------------------------------
  // Headers — security headers for government site
  // ------------------------------------------------------------------
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options',    value: 'nosniff' },
          { key: 'Referrer-Policy',           value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection',          value: '1; mode=block' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self), interest-cohort=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: http://localhost:3000",
              "connect-src 'self'",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
      // Cache static uploads
      {
        source: '/uploads/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  // ------------------------------------------------------------------
  // Redirects — legacy URL support
  // ------------------------------------------------------------------
  async redirects() {
    return [
      // Redirect bare domain to /en (handled by middleware, but belt+suspenders)
      // { source: '/', destination: '/en', permanent: false },
    ]
  },

  // ------------------------------------------------------------------
  // Webpack customization
  // ------------------------------------------------------------------
  webpack(config) {
    // Support importing PDF/font files
    config.module.rules.push({
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    })
    return config
  },
}

export default withNextIntl(nextConfig)
