import { of } from '@mondosha1/core'
import { map, multiply, pipe, toUpper } from 'lodash/fp'
import { foldEmpty, foldEmptyLeft, foldEmptyRight } from './fold-empty.operator'

describe('foldEmpty', () => {
  describe('foldEmpty left & right', () => {
    it('should return the given value if not empty', () => {
      expect(of(['notEmpty']).pipe(foldEmpty(() => 'empty value'))).toEqual(['notEmpty'])
      expect(of([1, 2, 3]).pipe(foldEmpty(() => 'empty value'))).toEqual([1, 2, 3])
    })

    it('should return the left value if the given value is empty', () => {
      expect(of(null).pipe(foldEmpty(() => 'empty value'))).toBe('empty value')
      expect(of(undefined).pipe(foldEmpty(() => 'empty value'))).toBe('empty value')
      expect(of([]).pipe(foldEmpty(() => 'empty value'))).toBe('empty value')
    })

    it('should return the given value if not empty', () => {
      expect(of(['notEmpty']).pipe(foldEmpty(() => 'empty value', map(toUpper)))).toEqual(['NOTEMPTY'])

      expect(of([1, 2, 3]).pipe(foldEmpty(() => 0, map(multiply(2))))).toEqual([2, 4, 6])
    })

    it('should return the value if a constant is given as left callback', () => {
      expect(of(null).pipe(foldEmpty('empty value'))).toBe('empty value')
    })

    it('should return the same object instance if a constant is given as left callback', () => {
      const obj = { message: 'helloworld' }
      expect(of(null).pipe(foldEmpty(obj))).toBe(obj)
    })

    it('should return the value if a constant is given as right callback', () => {
      expect(of([1, 2, 3]).pipe(foldEmpty(() => 0, 456))).toBe(456)
    })
  })

  describe('foldEmptyLeft', () => {
    it('should return the given value if not empty', () => {
      expect(of(['notEmpty']).pipe(foldEmptyLeft(() => 'empty value'))).toEqual(['notEmpty'])
      expect(of([1, 2, 3]).pipe(foldEmptyLeft(() => 'empty value'))).toEqual([1, 2, 3])
    })

    it('should return the left value if the given value is empty', () => {
      expect(of(null).pipe(foldEmptyLeft(() => 'empty value'))).toBe('empty value')
      expect(of(undefined).pipe(foldEmptyLeft(() => 'empty value'))).toBe('empty value')
      expect(of([]).pipe(foldEmptyLeft(() => 'empty value'))).toBe('empty value')
    })
  })

  describe('foldEmptyRight', () => {
    it('should return the given value if not empty', () => {
      expect(of(['notEmpty']).pipe(foldEmptyRight(map(toUpper)))).toEqual(['NOTEMPTY'])
      expect(of([1, 2, 3]).pipe(foldEmptyRight(map(multiply(2))))).toEqual([2, 4, 6])
    })

    it('should return the left value if the given value is empty', () => {
      expect(of(null).pipe(foldEmptyRight(map(pipe(String, toUpper))))).toBe(null)
      expect(of(undefined).pipe(foldEmptyRight(map(pipe(String, toUpper))))).toBe(undefined)
      expect(of([]).pipe(foldEmptyRight(map(toUpper)))).toEqual([])
    })
  })
})
