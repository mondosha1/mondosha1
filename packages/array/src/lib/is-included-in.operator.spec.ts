import { of } from '@mondosha1/core'
import { isIncludedIn } from './is-included-in.operator'

describe('isIncludedIn', () => {
  it('should return true if the value is included in the given array', () => {
    expect(of(2).pipe(isIncludedIn([1, 2, 3]))).toBe(true)
  })

  it('should return false if the value is included in the given array', () => {
    expect(of(4).pipe(isIncludedIn([1, 2, 3]))).toBe(false)
  })
})
