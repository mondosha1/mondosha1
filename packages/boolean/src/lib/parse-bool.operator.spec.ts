import { parseBool } from './parse-bool.operator'

describe('parseBool', () => {
  it('should return true if the given value is true, "true", 1 or "1"', () => {
    expect(parseBool(true)).toBe(true)
    expect(parseBool('true')).toBe(true)
    expect(parseBool(1)).toBe(true)
    expect(parseBool('1')).toBe(true)
  })

  it('should return false if the given value is false, "false", 0 or "0"', () => {
    expect(parseBool(false)).toBe(false)
    expect(parseBool('false')).toBe(false)
    expect(parseBool(0)).toBe(false)
    expect(parseBool('0')).toBe(false)
  })

  it('should return undefined if the given value could not be parsed', () => {
    expect(parseBool('anything' as any)).toBeUndefined()
    expect(parseBool(undefined as any)).toBeUndefined()
    expect(parseBool(null as any)).toBeUndefined()
    expect(parseBool(12345 as any)).toBeUndefined()
  })
})
