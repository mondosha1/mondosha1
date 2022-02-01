import { of } from '@mondosha1/core'
import { difference } from './difference.operator'

describe('difference', () => {
  it('should revert order instead of from lodash', () => {
    const source = [1, 2]
    const diff = [3]
    expect(of(source).pipe(difference(diff))).toEqual([1, 2])
  })

  it('should filter the first array with elements of the second one', () => {
    const source = [1, 2]
    const diff = [2]
    expect(of(source).pipe(difference(diff))).toEqual([1])
  })

  it('should not filter the first array with elements of the second one', () => {
    const source = [1]
    const diff = [2, 3]
    expect(of(source).pipe(difference(diff))).toEqual([1])
  })
})
