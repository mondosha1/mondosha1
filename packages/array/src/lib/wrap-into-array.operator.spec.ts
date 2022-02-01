import { wrapIntoArray } from './wrap-into-array.operator'

describe('WrapIntoArray', () => {
  it('should return the first parameter if an array given', () => {
    const arr = []
    expect(wrapIntoArray(arr)).toBe(arr)
  })

  it('should return nil the first parameter if is nil', () => {
    expect(wrapIntoArray(null)).toEqual(null)
    expect(wrapIntoArray(undefined)).toEqual(undefined)
  })

  it('should wrap the first parameter into an array if not an array given', () => {
    expect(wrapIntoArray('hey')).toEqual(['hey'])
    expect(wrapIntoArray(1)).toEqual([1])
    expect(wrapIntoArray({})).toEqual([{}])
  })
})
