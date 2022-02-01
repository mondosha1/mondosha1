import { toBoolean } from './to-boolean.operator'

describe('toBoolean', () => {
  it('should convert a falsy value to false', () => {
    expect(toBoolean(undefined)).toBe(false)
    expect(toBoolean(null)).toBe(false)
    expect(toBoolean(false)).toBe(false)
    expect(toBoolean('')).toBe(false)
    expect(toBoolean(0)).toBe(false)
    expect(toBoolean(NaN)).toBe(false)
  })

  it('should convert a truthy value to true', () => {
    expect(toBoolean(true)).toBe(true)
    expect(toBoolean('helloworld')).toBe(true)
    expect(toBoolean(1)).toBe(true)
    expect(toBoolean({})).toBe(true)
    expect(toBoolean([])).toBe(true)
  })
})
