import { pluralize } from './pluralize.operator'

describe('Pluralize', () => {
  describe('Default', () => {
    it('should add a trailing "s" to the word if greater than 1', () => {
      expect(pluralize(2, 'day')).toBe('2 days')
    })

    it('should add a trailing "s" to the word if zero and writing "No" instead of zero', () => {
      expect(pluralize(0, 'day')).toBe('no days')
    })

    it('should not add a trailing "s" to the word if equal to 1', () => {
      expect(pluralize(1, 'day')).toBe('1 day')
    })
  })

  describe('includeCount', () => {
    it('should return days with a "s" if greater than 1', () => {
      expect(pluralize(2, 'day', { includeCount: false })).toBe('days')
    })

    it('should return days with a "s" if zero', () => {
      expect(pluralize(0, 'day', { includeCount: false })).toBe('days')
    })

    it('should return days without a "s" if equal to 1', () => {
      expect(pluralize(1, 'day', { includeCount: false })).toBe('day')
    })
  })

  describe('useNoForZero', () => {
    it('should display zero as a number if equal to zero', () => {
      expect(pluralize(0, 'day', { useNoForZero: false })).toBe('0 days')
    })

    it('should keep the count as default for values greater than 0', () => {
      expect(pluralize(2, 'day', { useNoForZero: false })).toBe('2 days')
      expect(pluralize(1, 'day', { useNoForZero: false })).toBe('1 day')
    })
  })

  describe('hideForOne', () => {
    it('should hide count when one entry', () => {
      expect(pluralize(1, 'day', { hideForOne: true })).toBe('day')
    })

    it('should keep the count as default for zero and values greater than 1', () => {
      expect(pluralize(0, 'day', { hideForOne: true })).toBe('no days')
      expect(pluralize(2, 'day', { hideForOne: true })).toBe('2 days')
    })
  })

  describe('useWordForOne', () => {
    it('should display "one" as a word if count is equal to 1', () => {
      expect(pluralize(1, 'day', { useWordForOne: true })).toBe('one day')
    })

    it('should keep the count as default for zero and values greater than 1', () => {
      expect(pluralize(0, 'day', { useWordForOne: true })).toBe('no days')
      expect(pluralize(2, 'day', { useWordForOne: true })).toBe('2 days')
    })
  })

  describe('Pluralize words ending with "y"', () => {
    it('should transform the trailing "y" with "ies" at plural if the word ends with a consonant and a "y"', () => {
      expect(pluralize(0, 'body')).toBe('no bodies')
      expect(pluralize(1, 'body')).toBe('1 body')
      expect(pluralize(2, 'body')).toBe('2 bodies')
    })

    it('should not transform the trailing "y" with "ies" at plural if the word ends with a vowel and a "y"', () => {
      expect(pluralize(0, 'boy')).toBe('no boys')
      expect(pluralize(1, 'boy')).toBe('1 boy')
      expect(pluralize(2, 'boy')).toBe('2 boys')
    })
  })

  describe('invariable', () => {
    it('should not add a "s" if invariable option given', () => {
      expect(pluralize(0, 'active', { invariable: true })).toBe('no active')
      expect(pluralize(1, 'active', { invariable: true })).toBe('1 active')
      expect(pluralize(2, 'active', { invariable: true })).toBe('2 active')
    })
  })
})
