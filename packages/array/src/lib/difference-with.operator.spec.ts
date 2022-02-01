import { of } from '@mondosha1/core'
import { differenceWith } from './difference-with.operator'

describe('differenceWith', () => {
  it('should revert order instead of differenceWith from lodash', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const diff = [{ id: 2 }]
    expect(of(source).pipe(differenceWith((obj1, obj2) => obj1.id === obj2.id, diff))).toEqual([{ id: 1 }, { id: 3 }])
  })
})
