import { of } from '@mondosha1/core'
import { tapLeft, tapRight } from './tap.operator'
import { Nullable } from './nullable.type'

describe('tap', () => {
  describe('tapRight', () => {
    it('should execute side effect when value is present', () => {
      const nullableIncrementForA: Nullable<number> = 4
      let a = 1
      expect(of(nullableIncrementForA).pipe(tapRight(b => (a += b)))).toBe(4)
      expect(a).toBe(5)
    })

    it('should not execute code if the inner value is nil', () => {
      const nilIncrement: Nullable<number> = null
      let b = 1
      expect(of(nilIncrement).pipe(tapRight(x => (b += x)))).toBe(null)
      expect(b).toBe(1)
    })
  })

  describe('tapLeft', () => {
    it('should not execute code if the inner value is present', () => {
      const nullableIncrementForA: Nullable<number> = 4
      let a = 1
      expect(of(nullableIncrementForA).pipe(tapLeft(_ => (a += 10)))).toBe(4)
      expect(a).toBe(1)
    })

    it('should execute side effect when value is nil', () => {
      let a = 1
      expect(of(null).pipe(tapLeft(_ => (a += 5)))).toBe(null)
      expect(a).toBe(6)
    })

    it('should allow to throw when value is nil', () => {
      expect(() =>
        of(null).pipe(
          tapLeft(_ => {
            throw new Error('Value is null')
          })
        )
      ).toThrow()
    })
  })
})
