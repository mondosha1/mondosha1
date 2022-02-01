import { of } from '@mondosha1/core'
import { append } from './append.operator'

describe('Append', () => {
  it('should return an array with the new item at the end', () => {
    expect(append(3)([1, 2])).toEqual([1, 2, 3])
    expect(of([1, 2]).pipe(append(3))).toEqual([1, 2, 3])
  })

  it('should return an array with the new items at the end if an array is given as argument', () => {
    expect(append([2, 3])([0, 1])).toEqual([0, 1, 2, 3])
    expect(of([0, 1]).pipe(append([2, 3]))).toEqual([0, 1, 2, 3])
  })
})
