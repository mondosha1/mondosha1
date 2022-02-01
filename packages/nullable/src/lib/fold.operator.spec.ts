import { of } from '@mondosha1/core'
import { isEmpty, isNil, isNumber, isString, toUpper } from 'lodash/fp'
import { fold, foldLeft, foldLeftOn, foldOn, foldRight, foldRightOn } from './fold.operator'

describe('fold', () => {
  describe('fold left & right', () => {
    it('should return the given value if not nil', () => {
      expect(of('notNil').pipe(fold(() => 'nil value'))).toBe('notNil')
      expect(of(123).pipe(fold(() => 'nil value'))).toBe(123)
    })

    it('should return the left value if the given value is nil', () => {
      expect(of(null).pipe(fold(() => 'nil value'))).toBe('nil value')
      expect(of(undefined).pipe(fold(() => 'nil value'))).toBe('nil value')
    })

    it('should return the given value if not nil', () => {
      expect(
        of('notNil').pipe(
          fold(
            () => 'nil value',
            value => toUpper(value)
          )
        )
      ).toBe('NOTNIL')
      expect(
        of(123).pipe(
          fold(
            () => 0,
            value => value * 2
          )
        )
      ).toBe(246)
    })

    it('should return the value if a constant is given as left callback', () => {
      expect(of(null).pipe(fold('nil value'))).toBe('nil value')
    })

    it('should return the same object instance if a constant is given as left callback', () => {
      const obj = { message: 'helloworld' }
      expect(of(null).pipe(fold(obj))).toBe(obj)
    })

    it('should return the value if a constant is given as right callback', () => {
      expect(of(123).pipe(fold(() => 0, 456))).toBe(456)
    })
  })

  describe('foldLeft', () => {
    it('should return the given value if not nil', () => {
      expect(of('notNil').pipe(foldLeft(() => 'nil value'))).toBe('notNil')
      expect(of(123).pipe(foldLeft(() => 'nil value'))).toBe(123)
    })

    it('should return the left value if the given value is nil', () => {
      expect(of(null).pipe(foldLeft(() => 'nil value'))).toBe('nil value')
      expect(of(undefined).pipe(foldLeft(() => 'nil value'))).toBe('nil value')
    })
  })

  describe('foldRight', () => {
    it('should return the given value if not nil', () => {
      expect(of('notNil').pipe(foldRight(value => toUpper(value)))).toBe('NOTNIL')
      expect(of(123).pipe(foldRight(value => value * 2))).toBe(246)
    })

    it('should return the left value if the given value is nil', () => {
      expect(of(null).pipe(foldRight(value => toUpper(String(value))))).toBe(null)
      expect(of(undefined).pipe(foldRight(value => toUpper(String(value))))).toBe(undefined)
    })
  })

  describe('fold on left & right with custom condition', () => {
    it('should return the given value if the condition is not satisfied', () => {
      expect(of('notNil').pipe(foldOn(isEmpty, () => 'nil value'))).toBe('notNil')
      expect(of(123 as unknown as string).pipe(foldOn(isString, () => 'nil value'))).toBe(123)
    })

    it('should return the left value if the condition is satisfied', () => {
      expect(of(null).pipe(foldOn(isNil, () => 'nil value'))).toBe('nil value')
      expect(of('123456789').pipe(foldOn(isString, () => 123456789))).toBe(123456789)
    })

    it('should return the given value', () => {
      expect(
        of(123).pipe(
          foldOn(
            isNumber,
            v => `Number: ${v}`,
            v => `NaN: ${v}`
          )
        )
      ).toBe('Number: 123')
      expect(
        of(123 as unknown as string).pipe(
          foldOn(
            isString,
            v => `Number: ${v}`,
            v => `NaN: ${v}`
          )
        )
      ).toBe('NaN: 123')
    })

    it('should return the corresponding value if a static condition is given', () => {
      expect(of(123).pipe(foldOn(true, val => val * 2))).toBe(246)
      expect(of(123).pipe(foldOn(false, val => val * 2))).toBe(123)
      expect(
        of(123).pipe(
          foldOn(
            false,
            val => val * 2,
            val => val + 2
          )
        )
      ).toBe(125)
    })
  })

  describe('foldLeftOn', () => {
    it('should return the given value if the condition is not satisfied', () => {
      expect(of('notNil').pipe(foldLeftOn(isEmpty, () => 'nil value'))).toBe('notNil')
      expect(of(123 as unknown as string).pipe(foldLeftOn(isString, () => 'nil value'))).toBe(123)
    })

    it('should return the left value if the condition is satisfied', () => {
      expect(of(null).pipe(foldLeftOn(isNil, () => 'nil value'))).toBe('nil value')
      expect(of('123456789').pipe(foldLeftOn(isString, () => 123456789))).toBe(123456789)
    })

    it('should return the corresponding value if a static condition is given', () => {
      expect(of(123).pipe(foldLeftOn(true, val => val * 2))).toBe(246)
      expect(of(123).pipe(foldLeftOn(false, val => val * 2))).toBe(123)
    })
  })

  describe('foldRightOn', () => {
    it('should return the given value', () => {
      expect(of(123 as unknown as string).pipe(foldRightOn(isString, v => `NaN: ${v}`))).toBe('NaN: 123')
    })

    it('should return the corresponding value if a static condition is given', () => {
      expect(of(123).pipe(foldRightOn(false, val => val + 2))).toBe(125)
      expect(of(123).pipe(foldRightOn(true, val => val + 2))).toBe(123)
    })
  })
})
