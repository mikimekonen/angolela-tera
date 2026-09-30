import { getRequestConfig } from 'next-intl/server'
import { notFound } from 'next/navigation'

/**
 * Supported locales for Angolela Tera Woreda portal.
 *
 *  en  — English (default, fallback)
 *  am  — Amharic (አማርኛ) — written in Ethiopic script
 *  om  — Afaan Oromo — written in Latin script
 *
 * ADDING A NEW LOCALE:
 *  1. Add the locale code below to `locales`
 *  2. Create messages/<locale>.json with all translation keys
 *  3. Add the language entry to topStrip.languages in all message files
 *  4. Ensure the Ethiopic font stack is loaded if the language uses Ge'ez script
 */

export const locales = ['en', 'am', 'om'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Human-readable names for the language switcher */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  am: 'አማርኛ',
  om: 'Afaan Oromo',
}

/** Text direction (all currently LTR) */
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  am: 'ltr', // Ethiopic script is left-to-right
  om: 'ltr',
}

/**
 * Whether a locale uses the Ethiopic (Ge'ez) script.
 * Used to apply the --font-ethiopic CSS variable on <html>.
 */
export const usesEthiopicScript: Record<Locale, boolean> = {
  en: false,
  am: true,
  om: false, // Afaan Oromo uses Latin script
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale
  }

  const resolvedLocale = locale as Locale
  const messagesModule = (await import(`../../messages/${resolvedLocale}.json`)).default

  return {
    locale: resolvedLocale,
    messages: messagesModule[resolvedLocale],
  }
})
