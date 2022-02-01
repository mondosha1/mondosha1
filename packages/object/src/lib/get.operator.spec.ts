import { of } from '../../../util-core/src/lib'
import { get } from './get.operator'

describe('get', () => {
  const peugeot: Car = {
    brand: 'Peugeot',
    model: '208',
    manualTransmission: true,
    engine: {
      name: '1.6 THP',
      power: 200,
      cylinders: 1598
    }
  }

  it('should return the value at the given path', () => {
    const result = of(peugeot).pipe(get('brand'))
    expect(result).toBe('Peugeot')
  })

  it('should return the value at the given depth path', () => {
    const result = of(peugeot).pipe(get('engine.power'))
    expect(result).toBe(200)
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
  manualTransmission: boolean
  engine: Engine
}
