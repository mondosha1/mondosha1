import { of } from '@mondosha1/core'
import { pairwise } from './pairwise.operator'

describe('pairwise', () => {
  const sevenList = [1, 2, 3, 4, 5, 6, 7]
  const oneList = [1]

  it('should return an array of 2-tuples from an array', () => {
    expect(pairwise(sevenList)).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7]
    ])
    expect(of(sevenList).pipe(pairwise)).toEqual([
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 6],
      [6, 7]
    ])
  })

  it('should return an empty array from an one length array', () => {
    expect(pairwise(oneList)).toEqual([])
  })

  it('should return an empty array from an empty array', () => {
    expect(pairwise([])).toEqual([])
  })
})
