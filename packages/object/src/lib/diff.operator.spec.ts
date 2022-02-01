import { of } from '../../../util-core/src/lib'
import { diff } from './diff.operator'

describe('Diff', () => {
  it('should return an object as the difference of first obj with the second obj', () => {
    const diff1 = of({
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP'
      }
    }).pipe(
      diff({
        brand: 'Peugeot',
        engine: {
          name: '1.2 DCI'
        }
      })
    )

    expect(diff1).toEqual({
      engine: {
        name: '1.6 THP'
      }
    })

    const diff2 = of({
      brand: 'Peugeot',
      engine: {
        name: '1.2 DCI'
      }
    }).pipe(
      diff({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP'
        }
      })
    )

    expect(diff2).toEqual({
      engine: {
        name: '1.2 DCI'
      }
    })
  })

  it('should return an empty object if objects are identical', () => {
    const diff1 = of({
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP'
      }
    }).pipe(
      diff({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP'
        }
      })
    )

    expect(diff1).toEqual({})
  })

  it('should return an object equivalent to the first obj if the second one is null or undefined', () => {
    let difference: Partial<{ engine: { name: string }; brand: string }>

    difference = of({
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP'
      }
    }).pipe(diff(null as unknown as {}))

    expect(difference).toEqual({
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP'
      }
    })

    difference = of({
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP'
      }
    }).pipe(diff(undefined as unknown as {}))

    expect(difference).toEqual({
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP'
      }
    })
  })

  it('should return an the difference if array values differ as well', () => {
    const difference = of({
      garage: ['Renault']
    }).pipe(
      diff({
        garage: ['Peugeot']
      })
    )

    expect(difference).toEqual({
      garage: ['Renault']
    })
  })

  it('should return an empty object if array values are identical', () => {
    const difference = of({
      garage: ['Renault']
    }).pipe(
      diff({
        garage: ['Renault']
      })
    )

    expect(difference).toEqual({})
  })
})
