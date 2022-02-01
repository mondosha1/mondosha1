import { of } from '../../../util-core/src/lib'
import { extend } from './extend.operator'

describe('extend', () => {
  it('should revert order instead of extend from lodash', () => {
    expect(of({ id: 1 }).pipe(extend({ id: 2 }))).toEqual({ id: 2 })
  })
})
