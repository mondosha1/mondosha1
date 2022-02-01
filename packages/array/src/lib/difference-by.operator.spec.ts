import { of } from '@mondosha1/core'
import { differenceBy } from './difference-by.operator'

describe('differenceBy', () => {
  it('should revert order instead of differenceBy from lodash', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const diff = [{ id: 2 }]
    expect(of(source).pipe(differenceBy(idObject => idObject.id, diff))).toEqual([{ id: 1 }, { id: 3 }])
  })
})
