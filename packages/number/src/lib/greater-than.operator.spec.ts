import { of } from '@mondosha1/core'
import { greaterThan } from './greater-than.operator'

describe('greaterThan', () => {
  it('should revert order instead of gt', () => {
    expect(of(3).pipe(greaterThan(4))).toBe(false)
  })
})
