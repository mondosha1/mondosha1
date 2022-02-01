import { pick } from 'lodash/fp'
import { of } from '../../../util-core/src/lib'
import { PartialDeep } from './partial-deep.type'

describe('PartialDeep', () => {
  it('should allow partial of partials objects', () => {
    const car: Car = {
      brand: 'Peugeot',
      model: '208',
      engine: {
        name: '1.6 THP',
        power: 200,
        cylinders: 1598
      }
    }

    const partialCar: Partial<Car> = {
      brand: 'Peugeot',
      model: '208'
    }

    const partialDeepCar: PartialDeep<Car> = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP'
      }
    }

    expect(of(car).pipe(pick(['brand', 'model']))).toEqual(partialCar)
    expect(of(car).pipe(pick(['brand', 'engine.name']))).toEqual(partialDeepCar)
  })
})

interface Engine {
  name: string
  cylinders: number
  power: number
}

interface Car {
  brand: string
  model: string
  engine: Engine
}
