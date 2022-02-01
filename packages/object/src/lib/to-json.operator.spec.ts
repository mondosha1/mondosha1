import { Nullable } from '@mondosha1/nullable'
import { defaults, isNil } from 'lodash/fp'
import { FullJSON } from './json.type'
import { Serializable } from './serializable.type'
import { toJSON } from './to-json.operator'

describe('toJSON', () => {
  it('should serialize nil values', () => {
    expect(toJSON(null)).toBe(null)
    expect(toJSON(undefined)).toBe(null)
  })

  it('should serialize primitive values', () => {
    expect(toJSON(123)).toBe(123)
    expect(toJSON('helloworld')).toBe('helloworld')
    expect(toJSON(true)).toBe(true)
  })

  it('should serialize plain objects', () => {
    expect(
      toJSON({
        brand: 'Peugeot',
        model: '208'
      })
    ).toEqual({ brand: 'Peugeot', model: '208' })
  })

  it('should serialize plain objects', () => {
    expect(
      toJSON({
        brand: 'Peugeot',
        model: '208'
      })
    ).toEqual({ brand: 'Peugeot', model: '208' })
  })

  it('should deeply serialize plain objects', () => {
    expect(
      toJSON({
        brand: 'Peugeot',
        model: '208',
        engine: {
          name: '1.6 THP',
          power: 200,
          cylinders: 1598
        }
      })
    ).toEqual({
      brand: 'Peugeot',
      model: '208',
      engine: {
        name: '1.6 THP',
        power: 200,
        cylinders: 1598
      }
    })
  })

  it('should serialize instances', () => {
    expect(toJSON(new Car('Peugeot', '208'))).toEqual({ brand: 'Peugeot', model: '208' })
  })

  it('should keep properties if set, even if null', () => {
    expect(toJSON(new Car('Peugeot', '208', null))).toEqual({ brand: 'Peugeot', model: '208', engine: null })
  })

  it('should deeply serialize instances', () => {
    expect(toJSON(new Car('Peugeot', '208', new Engine('1.6 THP', 200, 1598)))).toEqual({
      brand: 'Peugeot',
      model: '208',
      engine: {
        name: '1.6 THP',
        power: 200,
        cylinders: 1598
      }
    })
  })

  it('should use custom toJSON methods from instances if defined', () => {
    expect(toJSON(new CustomSerializeCar('Peugeot', '208', null))).toEqual({ brand: 'Peugeot', model: '208' })
  })

  it('should deeply use toJSON methods when serializing instances', () => {
    expect(toJSON(new CustomSerializeCar('Peugeot', '208', new CustomSerializeEngine('1.6 THP', 200, 1598)))).toEqual({
      brand: 'Peugeot',
      model: '208',
      engine: {
        customProperty: "I'm a property set by the custom toJSON method",
        name: '1.6 THP',
        power: 500,
        cylinders: 1598
      }
    })
  })

  it('should return null if try to serialize an invalid value', () => {
    const car = {
      brand: 'Peugeot',
      model: '208'
    }
    ;(car as any).itself = car
    expect(() => toJSON(car)).not.toThrow(Error)
    expect(toJSON(car)).toBe(null)
  })
})

class Engine {
  constructor(public name: string, public power: number, public cylinders: number) {}
}

class Car {
  constructor(public brand: string, public model: string, public engine?: Nullable<Engine>) {}
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

class CustomSerializeCar extends Car implements Serializable {
  public toJSON(): FullJSON<Car> {
    return defaults(
      { brand: this.brand, model: this.model },
      isNil(this.engine) ? null : { engine: toJSON(this.engine) }
    ) as FullJSON<Car>
  }
}
