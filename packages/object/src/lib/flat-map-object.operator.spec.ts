import { flatMapObject } from './flat-map-object.operator'

describe('FlatMapObject', () => {
  it('should allow flatMapping through object properties giving value and key as parameter', () => {
    const pairs = flatMapObject((values: string[], key: string) => [key, ...values])({
      brands: ['Peugeot', 'Renault'],
      models: ['208', 'Clio']
    })
    expect(pairs).toEqual(['brands', 'Peugeot', 'Renault', 'models', '208', 'Clio'])
  })
})
