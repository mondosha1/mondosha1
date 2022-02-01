import { extendsDeep } from './extends-deep.operator'

describe('ExtendsDeep', () => {
  let car: Car
  let wheels: Wheel[]

  beforeEach(() => {
    wheels = [
      {
        width: 255,
        height: 40,
        diameter: 13
      },
      {
        width: 255,
        height: 40,
        diameter: 13
      },
      {
        width: 255,
        height: 40,
        diameter: 13
      },
      {
        width: 255,
        height: 40,
        diameter: 13
      }
    ]

    car = {
      brand: 'Peugeot',
      model: '208',
      wheels,
      engine: {
        name: '1.6 THP',
        power: 200,
        cylinders: 1598
      }
    }
  })

  it('should not change given object references', () => {
    const extendedCar: Car = extendsDeep(car)

    expect(extendedCar).toEqual(car)
    expect(extendedCar).not.toBe(car)

    expect(extendedCar.wheels).toEqual(car.wheels)
    expect(extendedCar.wheels).not.toBe(car.wheels)
    expect(extendedCar.wheels[0]).not.toBe(car.wheels[0])
    expect(extendedCar.wheels[1]).not.toBe(car.wheels[1])
    expect(extendedCar.wheels[2]).not.toBe(car.wheels[2])
    expect(extendedCar.wheels[3]).not.toBe(car.wheels[3])

    expect(extendedCar.engine).toEqual(car.engine)
    expect(extendedCar.engine).not.toBe(car.engine)
  })

  it('should extend objects with given values and keep existing ones', () => {
    const extendedCar: Car = extendsDeep(car, {
      model: '308',
      engine: {
        name: '2.0 BlueHDI',
        cylinders: 1997
      }
    })

    expect(extendedCar.brand).toBe('Peugeot')
    expect(extendedCar.model).toBe('308')
    expect(extendedCar.wheels).toEqual(car.wheels)
    expect(extendedCar.wheels).toBeInstanceOf(Array)
    expect(extendedCar.wheels).toHaveLength(4)
    expect(extendedCar.wheels).not.toBe(car.wheels)
    expect(extendedCar.wheels[0]).not.toBe(car.wheels[0])
    expect(extendedCar.wheels[1]).not.toBe(car.wheels[1])
    expect(extendedCar.wheels[2]).not.toBe(car.wheels[2])
    expect(extendedCar.wheels[3]).not.toBe(car.wheels[3])
    expect(extendedCar.engine.name).toBe('2.0 BlueHDI')
    expect(extendedCar.engine.power).toBe(200)
    expect(extendedCar.engine.cylinders).toBe(1997)
  })

  it('should extend objects with properties are undefined but not if they are null', () => {
    const extendedCar: Car = extendsDeep(car, {
      model: null,
      brand: undefined,
      wheels: [],
      engine: null
    })
    expect(extendedCar.model).toBe(null)
    expect(extendedCar.brand).toBe('Peugeot')
    expect(extendedCar.engine).toBe(null)
    expect(extendedCar.wheels).toBeInstanceOf(Array)
    expect(extendedCar.wheels).toHaveLength(0)
  })

  it('should override array properties instead of concatenating them', () => {
    const extendedCar: Car = extendsDeep(car, {
      model: '308',
      wheels: [
        {
          width: 185,
          height: 60,
          diameter: 13
        },
        {
          width: 185,
          height: 60,
          diameter: 13
        }
      ],
      engine: {
        name: '2.0 BlueHDI',
        cylinders: 1997
      }
    })

    expect(extendedCar.wheels).toBeInstanceOf(Array)
    expect(extendedCar.wheels).toHaveLength(2)
    expect(extendedCar.wheels).not.toBe(car.wheels)
    expect(extendedCar.wheels).not.toBe(car.wheels)
    expect(extendedCar.wheels[0]).not.toBe(car.wheels[0])
    expect(extendedCar.wheels[1]).not.toBe(car.wheels[1])
  })
})

interface Engine {
  name: string
  cylinders: number
  power: number
}

interface Wheel {
  width: number
  height: number
  diameter: number
}

interface Car {
  brand: string
  model: string
  engine: Engine
  wheels: Wheel[]
}
