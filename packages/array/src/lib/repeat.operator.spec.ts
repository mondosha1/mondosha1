import { of } from '@mondosha1/core'
import { repeat } from '@mondosha1/array'

describe('Repeat', () => {
  it('should return an array with new item inserted at the given index', () => {
    expect(of(1).pipe(repeat(5))).toEqual([1, 1, 1, 1, 1])
  })
})
