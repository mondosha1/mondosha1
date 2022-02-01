import { of } from '@mondosha1/core'
import { zipAllWith } from './zip-all-with.operator'

describe('zipAllWith', () => {
  it('should zip several arrays of values into one object of values', () => {
    expect(
      of([1, 2]).pipe(zipAllWith((num, animal, car) => ({ num, animal, car }), ['dog', 'cat'], ['Peugeot', 'Renault']))
    ).toEqual([
      {
        num: 1,
        animal: 'dog',
        car: 'Peugeot'
      },
      {
        num: 2,
        animal: 'cat',
        car: 'Renault'
      }
    ])
  })

  it('should return "undefined" for missing elements in the source array', () => {
    expect(
      of([1]).pipe(zipAllWith((num, animal, car) => ({ num, animal, car }), ['dog', 'cat'], ['Peugeot', 'Renault']))
    ).toEqual([
      {
        num: 1,
        animal: 'dog',
        car: 'Peugeot'
      },
      {
        num: undefined,
        animal: 'cat',
        car: 'Renault'
      }
    ])
  })

  it('should return "undefined" for missing elements in the other arrays', () => {
    expect(
      of([1, 2]).pipe(zipAllWith((num, animal, car) => ({ num, animal, car }), ['dog'], ['Peugeot', 'Renault']))
    ).toEqual([
      {
        num: 1,
        animal: 'dog',
        car: 'Peugeot'
      },
      {
        num: 2,
        animal: undefined,
        car: 'Renault'
      }
    ])
  })
})
