import { Serializable } from './serializable.type'
import { toUrlParams } from './to-url-params.operator'

describe('toUrlParams', () => {
  it('should create an object with serialized properties', () => {
    expect(
      toUrlParams({
        brand: 'Peugeot'
      })
    ).toEqual({ brand: 'Peugeot' })
  })

  it('should create a one-level object with dot-separated keys', () => {
    expect(
      toUrlParams({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP'
        }
      })
    ).toEqual({
      brand: 'Peugeot',
      'engine.name': '1.6 THP'
    })
  })

  it('should serialize complex objects using the toJSON method', () => {
    expect(
      toUrlParams({
        engine: new CustomSerializeEngine('1.6 THP', 200, 1598)
      })
    ).toEqual({
      engine:
        '{"customProperty":"I\'m a property set by the custom toJSON method","cylinders":1598,"name":"1.6 THP","power":500}'
    })
  })

  it('should create an object with arrays serialized as a coma-separated param', () => {
    expect(
      toUrlParams({
        brands: ['Peugeot', 'Renault']
      })
    ).toEqual({
      brands: 'Peugeot,Renault'
    })
  })

  it('should create an object with arrays serialized as separated params by array entry', () => {
    expect(
      toUrlParams(
        {
          brands: ['Peugeot', 'Renault']
        },
        true
      )
    ).toEqual({
      'brands.0': 'Peugeot',
      'brands.1': 'Renault'
    })
  })

  it('should return an empty object if null or undefined given', () => {
    expect(toUrlParams(null)).toEqual({})
    expect(toUrlParams(undefined)).toEqual({})
  })
})

class Engine {
  constructor(public name: string, public power: number, public cylinders: number) {}
}

class CustomSerializeEngine extends Engine implements Serializable {
  public toJSON() {
    return {
      customProperty: "I'm a property set by the custom toJSON method",
      name: this.name,
      power: this.power * 2.5,
      cylinders: this.cylinders
    }
  }
}
