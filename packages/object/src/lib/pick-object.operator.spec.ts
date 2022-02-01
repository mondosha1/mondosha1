import { pickObject } from './pick-object.operator'

describe('PickObject', () => {
  it('should allow picking through object properties giving value and key as parameter', () => {
    const pairs = pickObject((value, key) => key === 'brand')({ brand: 'Peugeot', model: '208' })
    expect(pairs).toEqual({ brand: 'Peugeot' })
  })
})
