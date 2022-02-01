import { defaultToEmptyObject } from './default-to-empty-object.operator'
import { emptyObject } from './empty-object.operator'

describe('defaultToEmptyObject', () => {
  const EMPTY = emptyObject()

  it('should return the EMPTY object if undefined given', () => {
    expect(defaultToEmptyObject(undefined)).toBe(EMPTY)
  })

  it('should return the EMPTY object if null given', () => {
    expect(defaultToEmptyObject(null)).toBe(EMPTY)
  })

  it('should return the EMPTY object if empty object given', () => {
    expect(defaultToEmptyObject({})).toBe(EMPTY)
  })

  it('should return the value if a non-empty object is given', () => {
    expect(defaultToEmptyObject({ hello: 'world' }))
      .not.toBe(EMPTY)
      .toEqual({ hello: 'world' })
  })

  it('should return the exact value if a non-empty object is given', () => {
    const obj = { hello: 'world' }
    expect(defaultToEmptyObject(obj)).not.toBe(EMPTY).toBe(obj)
  })

  it('should return the value if no object is given', () => {
    expect(defaultToEmptyObject('helloworld')).not.toBe(EMPTY).toBe('helloworld')
    expect(defaultToEmptyObject(123)).not.toBe(EMPTY).toBe(123)
  })
})
