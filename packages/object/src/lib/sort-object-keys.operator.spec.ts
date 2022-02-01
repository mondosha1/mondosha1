import { curry } from 'lodash/fp'
import { jsonEqual } from './json-equal.operator'
import { sortObjectKeys } from './sort-object-keys.operator'

const toJsonEqual = curry(jsonEqual)
const toStringEqual = a => b => a === JSON.stringify(b)

describe('sortObjectKeys', () => {
  it('should return the same object with its keys sorted', () => {
    const engine = {
      power: 200,
      name: '1.6 THP',
      cylinders: 1598
    }
    expect(engine).toSatisfy(toStringEqual('{"power":200,"name":"1.6 THP","cylinders":1598}'))

    expect(sortObjectKeys(engine))
      .toEqual({
        power: 200,
        name: '1.6 THP',
        cylinders: 1598
      })
      .toSatisfy(toJsonEqual(engine))
      .toSatisfy(toStringEqual('{"cylinders":1598,"name":"1.6 THP","power":200}'))
  })
})
