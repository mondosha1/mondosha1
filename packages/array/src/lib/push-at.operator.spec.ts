import { of } from '@mondosha1/core'
import { pushAt } from './push-at.operator'

describe('PushAt', () => {
  it('should return an array with new item inserted at the given index', () => {
    expect(of([1, 2, 4, 5]).pipe(pushAt(3, 2))).toEqual([1, 2, 3, 4, 5])
    expect(of([1, 2, 3, 4]).pipe(pushAt(5, 4))).toEqual([1, 2, 3, 4, 5])
  })

  it('should put at the end if index greater than length', () => {
    expect(of([1, 2, 3, 4]).pipe(pushAt(5, 10))).toEqual([1, 2, 3, 4, 5])
  })

  it('should put at the beginning if index less than length', () => {
    expect(of([2, 3, 4, 5]).pipe(pushAt(1, -10))).toEqual([1, 2, 3, 4, 5])
  })
})
