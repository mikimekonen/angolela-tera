import { describe, it, expect } from 'vitest'
import {
  toEthiopian,
  formatEthiopianDate,
  isEthiopianLeapYear,
  gregorianToJulianDay,
} from '@/lib/ethiopianCalendar'

describe('Ethiopian Calendar Utilities - Comprehensive Suite', () => {
  describe('Current Reference Date: November 17, 2026 G.C.', () => {
    it('should convert November 17, 2026 to Hidar 8, 2019 E.C.', () => {
      const dt = new Date(2026, 10, 17) // Nov 17, 2026
      const etd = toEthiopian(dt)

      expect(etd.year).toBe(2019)
      expect(etd.month).toBe(3) // Hidar
      expect(etd.day).toBe(8)
      expect(etd.monthName_en).toBe('Hidar')
      expect(etd.monthName_am).toBe('ህዳር')
      expect(etd.dayName_en).toBe('Tuesday')
      expect(etd.dayName_am).toBe('ማክሰኞ')

      expect(formatEthiopianDate(etd, 'en')).toBe('Tuesday, Hidar 8, 2019 E.C.')
      expect(formatEthiopianDate(etd, 'am')).toBe('ማክሰኞ፣ ህዳር 8 ቀን 2019 ዓ.ም')
    })
  })

  describe('Ethiopian New Year (Enkutatash) Transitions', () => {
    it('should transition from 2018 E.C. to 2019 E.C. on September 11, 2026', () => {
      const pagume5 = toEthiopian(new Date(2026, 8, 10)) // Sep 10, 2026
      expect(pagume5.year).toBe(2018)
      expect(pagume5.month).toBe(13) // Pagume
      expect(pagume5.day).toBe(5)

      const meskerem1 = toEthiopian(new Date(2026, 8, 11)) // Sep 11, 2026
      expect(meskerem1.year).toBe(2019)
      expect(meskerem1.month).toBe(1) // Meskerem
      expect(meskerem1.day).toBe(1)
    })

    it('should correctly handle New Year in 2025 (Meskerem 1, 2018)', () => {
      const meskerem1_2018 = toEthiopian(new Date(2025, 8, 11)) // Sep 11, 2025
      expect(meskerem1_2018.year).toBe(2018)
      expect(meskerem1_2018.month).toBe(1)
      expect(meskerem1_2018.day).toBe(1)
    })

    it('should correctly handle New Year in 2024 (Meskerem 1, 2017)', () => {
      const meskerem1_2017 = toEthiopian(new Date(2024, 8, 11)) // Sep 11, 2024
      expect(meskerem1_2017.year).toBe(2017)
      expect(meskerem1_2017.month).toBe(1)
      expect(meskerem1_2017.day).toBe(1)
    })
  })

  describe('Leap Year (Year of Luke / ዘመነ ሉቃስ) Calculations', () => {
    it('should identify 2011, 2015, 2019, 2023 as Ethiopian leap years', () => {
      expect(isEthiopianLeapYear(2011)).toBe(true)
      expect(isEthiopianLeapYear(2015)).toBe(true)
      expect(isEthiopianLeapYear(2019)).toBe(true)
      expect(isEthiopianLeapYear(2023)).toBe(true)

      expect(isEthiopianLeapYear(2016)).toBe(false)
      expect(isEthiopianLeapYear(2017)).toBe(false)
      expect(isEthiopianLeapYear(2018)).toBe(false)
      expect(isEthiopianLeapYear(2020)).toBe(false)
    })

    it('should account for Pagume 6 in 2015 E.C. (Sep 11, 2023) and shift New Year to Sep 12', () => {
      const pagume5 = toEthiopian(new Date(2023, 8, 10)) // Sep 10, 2023
      expect(pagume5.year).toBe(2015)
      expect(pagume5.month).toBe(13)
      expect(pagume5.day).toBe(5)

      const pagume6 = toEthiopian(new Date(2023, 8, 11)) // Sep 11, 2023 (Leap Day!)
      expect(pagume6.year).toBe(2015)
      expect(pagume6.month).toBe(13)
      expect(pagume6.day).toBe(6)

      const meskerem1_2016 = toEthiopian(new Date(2023, 8, 12)) // Sep 12, 2023
      expect(meskerem1_2016.year).toBe(2016)
      expect(meskerem1_2016.month).toBe(1)
      expect(meskerem1_2016.day).toBe(1)
    })

    it('should account for Pagume 6 in 2011 E.C. (Sep 11, 2019)', () => {
      const pagume6 = toEthiopian(new Date(2019, 8, 11)) // Sep 11, 2019
      expect(pagume6.year).toBe(2011)
      expect(pagume6.month).toBe(13)
      expect(pagume6.day).toBe(6)

      const meskerem1_2012 = toEthiopian(new Date(2019, 8, 12)) // Sep 12, 2019
      expect(meskerem1_2012.year).toBe(2012)
      expect(meskerem1_2012.month).toBe(1)
      expect(meskerem1_2012.day).toBe(1)
    })

    it('should correctly predict future leap year 2019 E.C. (Pagume 6 on Sep 11, 2027)', () => {
      const pagume6_2019 = toEthiopian(new Date(2027, 8, 11)) // Sep 11, 2027
      expect(pagume6_2019.year).toBe(2019)
      expect(pagume6_2019.month).toBe(13)
      expect(pagume6_2019.day).toBe(6)

      const meskerem1_2020 = toEthiopian(new Date(2027, 8, 12)) // Sep 12, 2027
      expect(meskerem1_2020.year).toBe(2020)
      expect(meskerem1_2020.month).toBe(1)
      expect(meskerem1_2020.day).toBe(1)
    })
  })

  describe('Historical Milestone Consistency', () => {
    it('should convert Ethiopian Millennium (Sep 12, 2007) to Meskerem 1, 2000 E.C.', () => {
      const millennium = toEthiopian(new Date(2007, 8, 12))
      expect(millennium.year).toBe(2000)
      expect(millennium.month).toBe(1)
      expect(millennium.day).toBe(1)
    })

    it('should convert Battle of Adwa victory (March 1, 1896) to Yekatit 23, 1888 E.C.', () => {
      const adwa = toEthiopian(new Date(1896, 2, 1))
      expect(adwa.year).toBe(1888)
      expect(adwa.month).toBe(6) // Yekatit
      expect(adwa.day).toBe(23)
    })
  })

  describe('Julian Day Number Calculation', () => {
    it('should compute exact JDN for known Gregorian anchor dates', () => {
      // JDN of Jan 1, 2000 (standard astronomical anchor)
      expect(gregorianToJulianDay(2000, 1, 1)).toBe(2451545)
      // JDN of Ethiopian epoch anchor (Aug 27, 8 CE Gregorian = Aug 29, 8 CE Julian)
      expect(gregorianToJulianDay(8, 8, 27)).toBe(1724221)
    })
  })
})
