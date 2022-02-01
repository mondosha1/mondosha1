import { rejectObject } from './reject-object.operator'

describe('RejectObject', () => {
  it('should allow rejecting depending on array indexes', () => {
    const pairs = rejectObject((value, key) => key === 1)(['Peugeot', 'Renault', 'Citroen'])
    expect(pairs).toEqual(['Peugeot', 'Citroen'])
  })

  it('should allow rejecting depending on object keys', () => {
    const pairs = rejectObject((value, key) => key === 'brand')({ brand: 'Peugeot', model: '208' })
    expect(pairs).toEqual(['208'])
  })
})
