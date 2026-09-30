/**
 * ethiopianCalendar.ts
 * ─────────────────────────────────────────────────────────
 * Converts Gregorian dates to Ethiopian Calendar (Ge'ez).
 * Ethiopian calendar has 13 months (12×30 + 1 Pagume 5/6 days).
 * Epoch: 29 August 8 CE (Julian) = 1 Meskerem 1, 1 E.C.
 * ─────────────────────────────────────────────────────────
 */

export const ET_MONTHS_AM = [
  'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ',
]

export const ET_MONTHS_OM = [
  'Fulbaana', 'Onkoloolessa', 'Sadaasa', 'Muddee', 'Ammajjii', 'Guraandhala',
  'Bitootessa', 'Elba', 'Caamsaa', 'Waxabajjii', 'Adoolessa', 'Hagayya', 'Qaammee',
]

export const ET_MONTHS_EN = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume',
]

export const ET_DAYS_AM = ['ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ', 'እሑድ']
export const ET_DAYS_OM = ['Wiixata', 'Kibxata', 'Roobii', 'Kamisa', 'Jimaata', 'Sanbata', 'Dilbata']
export const ET_DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export interface EthiopianDate {
  day: number
  month: number     // 1-indexed (1=Meskerem)
  year: number
  dayOfWeek: number // 0=Monday … 6=Sunday
  monthName_en: string
  monthName_am: string
  monthName_om: string
  dayName_en: string
  dayName_am: string
  dayName_om: string
}

/**
 * Converts a JavaScript Date to an Ethiopian date object.
 */
export function toEthiopian(date: Date): EthiopianDate {
  // Julian Day Number helper
  function toJulianDay(y: number, m: number, d: number): number {
    const a = Math.floor((14 - m) / 12)
    const yr = y + 4800 - a
    const mo = m + 12 * a - 3
    return d + Math.floor((153 * mo + 2) / 5) + 365 * yr + Math.floor(yr / 4) - Math.floor(yr / 100) + Math.floor(yr / 400) - 32045
  }

  const gJdn = toJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate())

  // Ethiopian epoch JDN = 1723856 (29 August 8 CE Julian = 1 Meskerem 1 EC)
  const etEpoch = 1723856
  const daysSinceEpoch = gJdn - etEpoch

  const etYear4 = Math.floor(daysSinceEpoch / 1461)  // 4-year cycles (3×365 + 366)
  const remainder4 = daysSinceEpoch % 1461

  const etYear1 = Math.min(Math.floor(remainder4 / 365), 3)
  const remainderDays = remainder4 - etYear1 * 365

  const etYear = etYear4 * 4 + etYear1 + 1
  const etMonth = Math.floor(remainderDays / 30) + 1
  const etDay = remainderDays % 30 + 1

  // Day of week (JS getDay: 0=Sun…6=Sat → remap to 0=Mon…6=Sun)
  const jsDow = date.getDay()
  const dow = jsDow === 0 ? 6 : jsDow - 1 // 0=Mon, 6=Sun

  const monthIdx = Math.max(0, Math.min(12, etMonth - 1))

  return {
    day: etDay,
    month: etMonth,
    year: etYear,
    dayOfWeek: dow,
    monthName_en: ET_MONTHS_EN[monthIdx],
    monthName_am: ET_MONTHS_AM[monthIdx],
    monthName_om: ET_MONTHS_OM[monthIdx],
    dayName_en: ET_DAYS_EN[dow],
    dayName_am: ET_DAYS_AM[dow],
    dayName_om: ET_DAYS_OM[dow],
  }
}

/**
 * Format a short Ethiopian date string like:
 *   EN: "Meskerem 20, 2018 E.C."
 *   AM: "መስከረም 20 ቀን 2018 ዓ.ም"
 *   OM: "Fulbaana 20, 2018 M.N."
 */
export function formatEthiopianDate(etd: EthiopianDate, locale: 'en' | 'am' | 'om'): string {
  if (locale === 'am') {
    return `${etd.dayName_am}፣ ${etd.monthName_am} ${etd.day} ቀን ${etd.year} ዓ.ም`
  }
  if (locale === 'om') {
    return `${etd.dayName_om}, ${etd.monthName_om} ${etd.day}, ${etd.year} M.N.`
  }
  return `${etd.dayName_en}, ${etd.monthName_en} ${etd.day}, ${etd.year} E.C.`
}
