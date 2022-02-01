import { defaultToNull } from './default-to-null.operator'

describe('defaultToNull', () => {
  it('should return the null if undefined given', () => {
    expect(defaultToNull(undefined)).toBe(null)
  })

  it('should return the null if NaN given', () => {
    expect(defaultToNull(NaN)).toBe(null)
  })

  it('should return the null if null given', () => {
    expect(defaultToNull(null)).toBe(null)
  })

  it('should return the null if empty array given', () => {
    expect(defaultToNull([])).toBe(null)
  })

  it('should return the null if empty object given', () => {
    expect(defaultToNull({})).toBe(null)
  })

  it('should return the value if a non-empty object is given', () => {
    const car = new (class Car {})()
    expect(defaultToNull(car)).not.toBe(null).toBe(car)
  })

  it('should return the value if a non-empty array is given', () => {
    expect(defaultToNull(['helloworld']))
      .not.toBe(null)
      .toEqual(['helloworld'])
  })

  it('should return the value if no array is given', () => {
    expect(defaultToNull('helloworld')).not.toBe(null).toBe('helloworld')
    expect(defaultToNull(123)).not.toBe(null).toBe(123)
  })
})
