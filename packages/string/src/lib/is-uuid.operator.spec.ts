import { isUuid } from './is-uuid.operator'

describe('isUuid', () => {
  it('should return true if the value is a uuid', () => {
    expect(isUuid('f59d2fbc-d6bc-47c4-b510-f3efe61b58ca')).toBe(true)
  })

  it('should return false if the value does not look like a uuid', () => {
    expect(isUuid(false)).toBe(false)
    expect(isUuid(true)).toBe(false)
    expect(isUuid(undefined)).toBe(false)
    expect(isUuid(null)).toBe(false)
    expect(isUuid(NaN)).toBe(false)
    expect(isUuid('notANumber')).toBe(false)
    expect(isUuid({})).toBe(false)
    expect(isUuid([])).toBe(false)
    expect(isUuid('d6bc-f59d2fbc-47c4-b510-f3efe61b58cz')).toBe(false)
  })
})
