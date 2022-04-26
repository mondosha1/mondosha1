import { of } from '@mondosha1/core'
import { get } from './get.operator'
import { Nullable } from './nullable.type'

describe('get', () => {
  it('should return the inner value if not nil', () => {
    const notNilVar: Nullable<string> = 'notNil'

    expect(of(notNilVar).pipe(get)).toBe('notNil')
    expect(get(notNilVar)).toBe('notNil')
    expect(of(123).pipe(get)).toBe(123)
    expect(get(123)).toStrictEqual(123)
  })

  it('should throw error if the inner value is nil', () => {
    const nilVar: Nullable<string> = null
    expect(() => {
      of(nilVar).pipe(get)
    }).toThrow(new Error('No such element: Nullable.get'))
    expect(() => get(nilVar)).toThrow(new Error('No such element: Nullable.get'))
    expect(() => of(null).pipe(get)).toThrow()
    expect(() => get(undefined)).toThrow()
  })
})
