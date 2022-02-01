import { deepFreeze } from './deep-freeze.operator'

describe('deepFreeze', () => {
  it('should not allow to add properties to the root object', () => {
    const car = deepFreeze<any>({
      brand: 'Peugeot',
      model: '208'
    })
    expect(() => ((car as any).anything = 'anything')).toThrow(TypeError)
    expect(car).not.toHaveProperty('anything')
  })

  it('should not allow to add properties to the root object using square bracket notation', () => {
    const car = deepFreeze<any>({
      brand: 'Peugeot',
      model: '208'
    })
    expect(() => ((car as any)['anything'] = 'anything')).toThrow(TypeError) // eslint-disable-line @typescript-eslint/dot-notation
    expect(car).not.toHaveProperty('anything')
  })

  it('should not allow to remove properties from the root object', () => {
    const car = deepFreeze({
      brand: 'Peugeot',
      model: '208'
    })
    expect(() => delete (car as any).brand).toThrow(TypeError)
    expect(car).toHaveProperty('brand')
    expect(car.brand).toBe('Peugeot')
  })

  it('should not allow to update properties from the root object', () => {
    const car = deepFreeze({
      brand: 'Peugeot',
      model: '208'
    })
    expect(() => ((car as any).brand = 'Renault')).toThrow(TypeError)
    expect(car.brand).not.toBe('Renault').toBe('Peugeot')
  })

  it('should not allow to add properties to deep objects', () => {
    const car = deepFreeze<any>({
      brand: 'Peugeot',
      model: '208',
      engine: {
        name: '1.6 THP',
        power: 200,
        cylinders: 1598
      }
    })
    expect(() => (car.engine.anything = 'anything')).toThrow(TypeError)
    expect(car.engine).not.toHaveProperty('anything').toEqual({
      name: '1.6 THP',
      power: 200,
      cylinders: 1598
    })
  })

  it('should not allow to remove properties from deep objects', () => {
    const car = deepFreeze({
      brand: 'Peugeot',
      model: '208',
      engine: {
        name: '1.6 THP',
        power: 200,
        cylinders: 1598
      }
    })
    expect(() => delete (car.engine as any).power).toThrow(TypeError)
    expect(car.engine).toHaveProperty('power')
    expect(car.engine.power).toBe(200)
  })

  it('should not allow to update properties from deep objects', () => {
    const car = deepFreeze({
      brand: 'Peugeot',
      model: '208',
      engine: {
        name: '1.6 THP',
        power: 200,
        cylinders: 1598
      }
    })
    expect(() => (car.engine.power = 500)).toThrow(TypeError)
    expect(car.engine.power).not.toBe(500).toBe(200)
  })
})
