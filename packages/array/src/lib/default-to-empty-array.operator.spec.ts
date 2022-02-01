import { defaultToEmptyArray } from './default-to-empty-array.operator'
import { emptyArray } from './empty-array.const'

describe('defaultToEmptyArray', () => {
  const EMPTY = emptyArray()

  it('should return the EMPTY array if undefined given', () => {
    expect(defaultToEmptyArray(undefined)).toBe(EMPTY)
  })

  it('should return the EMPTY array if null given', () => {
    expect(defaultToEmptyArray(null)).toBe(EMPTY)
  })

  it('should return the EMPTY array if empty array given', () => {
    expect(defaultToEmptyArray([])).toBe(EMPTY)
  })

  it('should return the value if a non-empty array is given', () => {
    expect(defaultToEmptyArray(['helloworld']))
      .not.toBe(EMPTY)
      .toEqual(['helloworld'])
  })

  it('should return the value if no array is given', () => {
    expect(defaultToEmptyArray('helloworld' as unknown as any[]))
      .not.toBe(EMPTY)
      .toBe('helloworld')
    expect(defaultToEmptyArray(123 as unknown as any[]))
      .not.toBe(EMPTY)
      .toBe(123)
  })
})
