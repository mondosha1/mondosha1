import { mapObject } from './map-object.operator'

describe('MapObject', () => {
  it('should allow mapping through object properties giving value and key as parameter', () => {
    const pairs = mapObject((value, key) => [value, key])({ brand: 'Peugeot', model: '208' })
    expect(pairs).toEqual([
      ['Peugeot', 'brand'],
      ['208', 'model']
    ])
  })
})
