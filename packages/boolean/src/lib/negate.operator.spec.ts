import { of } from '@mondosha1/core'
import { includes, size } from 'lodash/fp'
import { negate } from './negate.operator'

describe('negate', () => {
  it('should return the negated result', () => {
    expect(negate(true)).toBe(false)
    expect(negate(false)).toBe(true)

    expect(negate(() => true)('helloworld')).toBe(false)
    expect(negate(() => false)('helloworld')).toBe(true)

    expect(of(true).pipe(negate)).toBe(false)
    expect(of(false).pipe(negate)).toBe(true)

    expect(of('helloworld').pipe(negate(() => true))).toBe(false)
    expect(of('helloworld').pipe(negate(() => false))).toBe(true)

    expect(of(null).pipe(negate)).toBe(true)
    expect(of(undefined).pipe(negate)).toBe(true)
    expect(of('helloworld').pipe(negate)).toBe(false)

    expect(of('helloworld').pipe(negate(() => null))).toBe(true)
    expect(of('helloworld').pipe(negate(() => undefined))).toBe(true)
    expect(of('helloworld').pipe(str => size(str), negate)).toBe(false)

    expect(of([1, 2, 3]).pipe(includes(1))).toBe(true)
    expect(of([1, 2, 3]).pipe(includes(1), negate)).toBe(false)
    expect(of([1, 2, 3]).pipe(negate(includes(1)))).toBe(false)
  })
})
