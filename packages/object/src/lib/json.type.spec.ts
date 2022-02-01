import { FullJSON, PartialJSON } from './json.type'

describe('JSON types', () => {
  describe('JSON', () => {
    it('should allow plain objects instead of instances of class', () => {
      const engine: FullJSON<Engine> = {
        name: '1.6 THP',
        power: 200
      }
      expect(engine).not.toBeNull()
    })

    it('should allow deep object types', () => {
      const car: FullJSON<Car> = {
        brand: 'Peugeot',
        model: '308',
        engine: {
          name: '1.6 THP',
          power: 200
        },
        wheels: [
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
      }
      expect(car).not.toBeNull()
    })
  })

  describe('PartialJSON', () => {
    it('should allow partial plain objects instead of instances of class', () => {
      const car: PartialJSON<Car> = {
        brand: 'Peugeot',
        engine: {
          power: 200
        }
      }
      expect(car).not.toBeNull()
    })

    it('should allow partial deep object types', () => {
      const car: PartialJSON<Car> = {
        brand: 'Peugeot',
        model: '308',
        wheels: [
          {
            height: 40,
            diameter: 13
          },
          {
            width: 255,
            height: 40
          },
          {
            width: 255,
            height: 40,
            diameter: 13
          }
        ]
      }
      expect(car).not.toBeNull()
    })
  })
})

class Engine {
  public constructor(public name: string, public power: number) {}
}

class Wheel {
  public constructor(public width: number, public height: number, public diameter: number) {}
}

class Car {
  public constructor(public brand: string, public model: string, public engine: Engine, public wheels: Wheel[]) {}
}
