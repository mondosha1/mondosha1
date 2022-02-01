import { isNumeric } from './is-numeric.operator'

describe('isNumeric', () => {
  it('should return true if the value is a number', () => {
    expect(isNumeric(0)).toBe(true)
    expect(isNumeric(1)).toBe(true)
    expect(isNumeric(2.3)).toBe(true)
  })

  it('should return true if the value is a number as a string', () => {
    expect(isNumeric('0')).toBe(true)
    expect(isNumeric('1')).toBe(true)
    expect(isNumeric('2.3')).toBe(true)
  })

  it('should return false if the value does not look like a number', () => {
    expect(isNumeric(false)).toBe(false)
    expect(isNumeric(true)).toBe(false)
    expect(isNumeric(undefined)).toBe(false)
    expect(isNumeric(null)).toBe(false)
    expect(isNumeric(NaN)).toBe(false)
    expect(isNumeric('notANumber')).toBe(false)
    expect(isNumeric({})).toBe(false)
    expect(isNumeric([])).toBe(false)
  })
})
