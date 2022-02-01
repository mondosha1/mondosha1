import { of } from '@mondosha1/core'
import { prepend } from './prepend.operator'

describe('Prepend', () => {
  it('should return an array with the new item at the beginning', () => {
    expect(prepend(1)([2, 3])).toEqual([1, 2, 3])
    expect(of([2, 3]).pipe(prepend(1))).toEqual([1, 2, 3])
  })

  it('should return an array with the new items at the beginning if an array is given as argument', () => {
    expect(prepend([0, 1])([2, 3])).toEqual([0, 1, 2, 3])
    expect(of([2, 3]).pipe(prepend([0, 1]))).toEqual([0, 1, 2, 3])
  })
})
