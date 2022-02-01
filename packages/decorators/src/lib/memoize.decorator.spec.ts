import { memoize } from 'lodash/fp'
import { Memoize } from './memoize.decorator'

describe('Memoize decorator', () => {
  describe('Default usage', () => {
    it('should return the result without computing it again on memoized instance methods', () => {
      const spy = jest.fn()
      class MathHelper {
        @Memoize()
        public multiply(num1: number, num2: number): number {
          spy()
          return num1 * num2
        }
      }
      const mathHelper = new MathHelper()
      expect(mathHelper.multiply(2, 3)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(1)

      expect(mathHelper.multiply(2, 3)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(1)

      expect(mathHelper.multiply(4, 5)).toBe(20)
      expect(spy).toHaveBeenCalledTimes(2)

      expect(mathHelper.multiply(2, 3)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(2)
    })

    it('should return the result without computing it again on memoized static methods', () => {
      const spy = jest.fn()
      class MathHelper {
        @Memoize()
        public static multiply(num1: number, num2: number): number {
          spy()
          return num1 * num2
        }
      }

      expect(MathHelper.multiply(2, 3)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(1)

      expect(MathHelper.multiply(2, 3)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(1)

      expect(MathHelper.multiply(4, 5)).toBe(20)
      expect(spy).toHaveBeenCalledTimes(2)

      expect(MathHelper.multiply(2, 3)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(2)
    })

    it('should compute the result if one of the argument changed', () => {
      const spy = jest.fn()
      class MathHelper {
        @Memoize()
        public static multiply(num1: number, num2: number, num3: number): number {
          spy()
          return num1 * num2 * num3
        }
      }

      expect(MathHelper.multiply(2, 3, 4)).toBe(24)
      expect(spy).toHaveBeenCalledTimes(1)

      expect(MathHelper.multiply(2, 3, 6)).toBe(36)
      expect(spy).toHaveBeenCalledTimes(2)

      expect(MathHelper.multiply(2, 5, 6)).toBe(60)
      expect(spy).toHaveBeenCalledTimes(3)

      expect(MathHelper.multiply(2, 5, 7)).toBe(70)
      expect(spy).toHaveBeenCalledTimes(4)

      expect(MathHelper.multiply(2, 5, 7)).toBe(70)
      expect(spy).toHaveBeenCalledTimes(4)
    })

    it('should compute the result again if object instances changed', () => {
      const spy = jest.fn()
      class MathHelper {
        @Memoize()
        public static multiply([num1, num2]: [number, number]): number {
          spy()
          return num1 * num2
        }
      }

      expect(MathHelper.multiply([2, 3])).toBe(6)
      expect(spy).toHaveBeenCalledTimes(1)

      expect(MathHelper.multiply([2, 3])).toBe(6)
      expect(spy).toHaveBeenCalledTimes(2)

      expect(MathHelper.multiply([4, 5])).toBe(20)
      expect(spy).toHaveBeenCalledTimes(3)

      const nums = [2, 3] as [number, number]
      expect(MathHelper.multiply(nums)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(4)
      expect(MathHelper.multiply(nums)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(4)
    })
  })
  describe('With customImplementation', () => {
    it('should use it when passed as argument', () => {
      const spy = jest.fn()
      const spyForMemoize = jest.fn()
      const spyMemoize = args => {
        spyForMemoize()
        return memoize(args)
      }
      class MathHelper {
        @Memoize({ customImplementation: spyMemoize })
        public static multiply(num1: number, num2: number): number {
          spy()
          return num1 * num2
        }
      }

      expect(MathHelper.multiply(2, 3)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spyForMemoize).toHaveBeenCalledTimes(1)

      expect(MathHelper.multiply(2, 3)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(1)
      expect(spyForMemoize).toHaveBeenCalledTimes(1)

      expect(MathHelper.multiply(4, 5)).toBe(20)
      expect(spy).toHaveBeenCalledTimes(2)
      expect(spyForMemoize).toHaveBeenCalledTimes(1)

      // Because of lodash memoize implementation this call should use the cache.
      // Lodash cache key is only the first argument.
      expect(MathHelper.multiply(2, 1)).toBe(6)
      expect(spy).toHaveBeenCalledTimes(2)
      expect(spyForMemoize).toHaveBeenCalledTimes(1)
    })
  })
})
