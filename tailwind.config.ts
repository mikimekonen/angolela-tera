import type { Config } from 'tailwindcss'

/**
 * Tailwind CSS Configuration — Angolela Tera Government Portal
 *
 * IMPORTANT: Colors reference CSS variables from tokens.css.
 * This allows the design tokens to drive everything — Tailwind
 * classes like `bg-primary`, `text-navy`, `border-surface` will
 * resolve to the correct government palette.
 *
 * Do NOT add arbitrary color values here. Update tokens.css instead.
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ------------------------------------------------------------------
      // Colors — all reference CSS variables from tokens.css
      // ------------------------------------------------------------------
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          dark:    'var(--color-primary-dark)',
          light:   'var(--color-primary-light)',
          100:     'var(--color-primary-100)',
          200:     'var(--color-primary-200)',
        },
        navy: {
          DEFAULT: 'var(--color-navy)',
          soft:    'var(--color-navy-soft)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          border:  'var(--color-surface-border)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          dark:    'var(--color-accent-dark)',
          light:   'var(--color-accent-light)',
        },
        text: {
          primary:   'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted:     'var(--color-text-muted)',
          inverse:   'var(--color-text-inverse)',
          link:      'var(--color-text-link)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          strong:  'var(--color-border-strong)',
        },
        divider:   'var(--color-divider)',
        success:   'var(--color-success)',
        warning:   'var(--color-warning)',
        error:     'var(--color-error)',
        info:      'var(--color-info)',
      },

      // ------------------------------------------------------------------
      // Typography
      // ------------------------------------------------------------------
      fontFamily: {
        latin:    ['var(--font-latin)'],
        ethiopic: ['var(--font-ethiopic)'],
        mono:     ['var(--font-mono)'],
        sans:     ['var(--font-latin)'],  // default sans = Latin stack
      },

      fontSize: {
        'xs':   ['var(--text-xs)',   { lineHeight: 'var(--leading-normal)' }],
        'sm':   ['var(--text-sm)',   { lineHeight: 'var(--leading-normal)' }],
        'base': ['var(--text-base)', { lineHeight: 'var(--leading-normal)' }],
        'lg':   ['var(--text-lg)',   { lineHeight: 'var(--leading-snug)' }],
        'xl':   ['var(--text-xl)',   { lineHeight: 'var(--leading-snug)' }],
        '2xl':  ['var(--text-2xl)',  { lineHeight: 'var(--leading-tight)' }],
        '3xl':  ['var(--text-3xl)',  { lineHeight: 'var(--leading-tight)' }],
        '4xl':  ['var(--text-4xl)',  { lineHeight: 'var(--leading-tight)' }],
        '5xl':  ['var(--text-5xl)',  { lineHeight: '1' }],
        '6xl':  ['var(--text-6xl)',  { lineHeight: '1' }],
      },

      // ------------------------------------------------------------------
      // Spacing — references tokens where possible
      // ------------------------------------------------------------------
      spacing: {
        'strip':  'var(--strip-height)',
        'header': 'var(--header-height)',
        'nav':    'var(--nav-height)',
      },

      // ------------------------------------------------------------------
      // Max Width
      // ------------------------------------------------------------------
      maxWidth: {
        'portal': 'var(--container-max)',
        'xl':     'var(--container-xl)',
        '2xl':    'var(--container-2xl)',
      },

      // ------------------------------------------------------------------
      // Border Radius — governmental scale (modest)
      // ------------------------------------------------------------------
      borderRadius: {
        'none': 'var(--radius-none)',
        'sm':   'var(--radius-sm)',
        DEFAULT:'var(--radius-base)',
        'md':   'var(--radius-md)',
        'lg':   'var(--radius-lg)',
        'xl':   'var(--radius-xl)',
        'full': 'var(--radius-full)',
      },

      // ------------------------------------------------------------------
      // Box Shadows
      // ------------------------------------------------------------------
      boxShadow: {
        'xs':  'var(--shadow-xs)',
        'sm':  'var(--shadow-sm)',
        DEFAULT:'var(--shadow-md)',
        'lg':  'var(--shadow-lg)',
        'xl':  'var(--shadow-xl)',
      },

      // ------------------------------------------------------------------
      // Transitions
      // ------------------------------------------------------------------
      transitionDuration: {
        'fast':   '150',
        DEFAULT:  '200',
        'slow':   '300',
        'slower': '500',
      },

      // ------------------------------------------------------------------
      // Z-Index
      // ------------------------------------------------------------------
      zIndex: {
        'dropdown': '100',
        'sticky':   '200',
        'overlay':  '300',
        'modal':    '400',
        'toast':    '500',
      },

      // ------------------------------------------------------------------
      // Custom animations (subtle, government-appropriate)
      // ------------------------------------------------------------------
      keyframes: {
        'fade-in': {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-down': {
          '0%':   { opacity: '0', transform: 'translateY(-8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'counter': {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-in':    'fade-in 300ms ease-out forwards',
        'slide-down': 'slide-down 200ms ease-out forwards',
      },
    },
  },
  plugins: [],
}

export default config
