import { of } from '@mondosha1/core'
import { unionBy } from './union-by.operator'

describe('unionBy', () => {
  it('should revert order instead of unionBy from lodash', () => {
    const source = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const diff = [{ id: 2 }, { id: 4 }]
    expect(of(source).pipe(unionBy(idObject => idObject.id, diff))).toEqual([
      { id: 1 },
      { id: 2 },
      { id: 3 },
      { id: 4 }
    ])
  })
})
