/**
 * ethiopianCalendar.ts
 * ─────────────────────────────────────────────────────────
 * Converts Gregorian dates to Ethiopian Calendar (Ge'ez).
 * Ethiopian calendar has 13 months (12×30 + 1 Pagume 5/6 days).
 * Epoch: 29 August 8 CE (Julian) = 27 August 8 CE (Gregorian) = 1 Meskerem 1, 1 E.C.
 * JDN Ethiopic Epoch: 1724221
 * ─────────────────────────────────────────────────────────
 */

export const ET_MONTHS_AM = [
  'መስከረም', 'ጥቅምት', 'ህዳር', 'ታህሳስ', 'ጥር', 'የካቲት',
  'መጋቢት', 'ሚያዚያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ',
]

export const ET_MONTHS_EN = [
  'Meskerem', 'Tikimt', 'Hidar', 'Tahsas', 'Tir', 'Yekatit',
  'Megabit', 'Miazia', 'Ginbot', 'Sene', 'Hamle', 'Nehase', 'Pagume',
]

export const ET_DAYS_AM = ['ሰኞ', 'ማክሰኞ', 'ረቡዕ', 'ሐሙስ', 'አርብ', 'ቅዳሜ', 'እሑድ']
export const ET_DAYS_EN = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export interface EthiopianDate {
  day: number
  month: number     // 1-indexed (1=Meskerem ... 13=Pagume)
  year: number
  dayOfWeek: number // 0=Monday … 6=Sunday
  monthName_en: string
  monthName_am: string
  dayName_en: string
  dayName_am: string
}

/**
 * Julian Day Number (JDN) of Ethiopian Epoch: 1 Meskerem 1 E.C.
 * Corresponds to August 29, 8 CE (Julian) / August 27, 8 CE (Gregorian).
 */
export const ET_EPOCH_JDN = 1724221

/**
 * Check if a given Ethiopian year is a leap year (Year of Luke / ዘመነ ሉቃስ).
 * In the Ethiopian calendar, leap years occur every 4 years when year % 4 === 3,
 * where Pagume has 6 days instead of 5.
 */
export function isEthiopianLeapYear(year: number): boolean {
  return (year % 4 === 3) || (year % 4 === -1)
}

/**
 * Convert Gregorian year, month (1-12), and day to Julian Day Number (JDN).
 */
export function gregorianToJulianDay(year: number, month: number, day: number): number {
  const a = Math.floor((14 - month) / 12)
  const yr = year + 4800 - a
  const mo = month + 12 * a - 3
  return (
    day +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045
  )
}

/**
 * Converts a JavaScript Date to an Ethiopian date object.
 */
export function toEthiopian(date: Date): EthiopianDate {
  const gJdn = gregorianToJulianDay(date.getFullYear(), date.getMonth() + 1, date.getDate())
  const daysSinceEpoch = gJdn - ET_EPOCH_JDN

  // 4-year cycle = 1461 days:
  // Year 1: 365 days (days 0..364)
  // Year 2: 365 days (days 365..729)
  // Year 3: 366 days (days 730..1095, leap year: Pagume has 6 days)
  // Year 4: 365 days (days 1096..1460)
  const cycle = Math.floor(daysSinceEpoch / 1461)
  const remainder = ((daysSinceEpoch % 1461) + 1461) % 1461

  let yearInCycle: number
  let dayOfYear: number

  if (remainder < 365) {
    yearInCycle = 1
    dayOfYear = remainder
  } else if (remainder < 730) {
    yearInCycle = 2
    dayOfYear = remainder - 365
  } else if (remainder < 1096) {
    yearInCycle = 3
    dayOfYear = remainder - 730
  } else {
    yearInCycle = 4
    dayOfYear = remainder - 1096
  }

  const etYear = cycle * 4 + yearInCycle
  const etMonth = Math.floor(dayOfYear / 30) + 1
  const etDay = (dayOfYear % 30) + 1

  // Day of week (JS getDay: 0=Sun…6=Sat → remap to 0=Mon…6=Sun)
  const jsDow = date.getDay()
  const dow = jsDow === 0 ? 6 : jsDow - 1

  const monthIdx = Math.max(0, Math.min(12, etMonth - 1))

  return {
    day: etDay,
    month: etMonth,
    year: etYear,
    dayOfWeek: dow,
    monthName_en: ET_MONTHS_EN[monthIdx],
    monthName_am: ET_MONTHS_AM[monthIdx],
    dayName_en: ET_DAYS_EN[dow],
    dayName_am: ET_DAYS_AM[dow],
  }
}

/**
 * Format a short Ethiopian date string like:
 *   EN: "Tuesday, Hidar 8, 2019 E.C."
 *   AM: "ማክሰኞ፣ ህዳር 8 ቀን 2019 ዓ.ም"
 */
export function formatEthiopianDate(etd: EthiopianDate, locale: 'en' | 'am'): string {
  if (locale === 'am') {
    return `${etd.dayName_am}፣ ${etd.monthName_am} ${etd.day} ቀን ${etd.year} ዓ.ም`
  }
  return `${etd.dayName_en}, ${etd.monthName_en} ${etd.day}, ${etd.year} E.C.`
}
