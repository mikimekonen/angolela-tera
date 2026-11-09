import { getRequestConfig } from 'next-intl/server'

/**
 * Supported locales for Angolela Tera Woreda portal.
 *
 *  en  — English (default, fallback)
 *  am  — Amharic (አማርኛ) — written in Ethiopic script
 */

export const locales = ['en', 'am'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'en'

/** Human-readable names for the language switcher */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  am: 'አማርኛ',
}

/** Text direction (all currently LTR) */
export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  am: 'ltr', // Ethiopic script is left-to-right
}

/**
 * Whether a locale uses the Ethiopic (Ge'ez) script.
 * Used to apply the --font-ethiopic CSS variable on <html>.
 */
export const usesEthiopicScript: Record<Locale, boolean> = {
  en: false,
  am: true,
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
