import {
  extendState,
  extendStateDeep,
  extendStateDeepIfDifferent,
  extendStateIfDifferent
} from './extend-state.operator'

describe('Extend state', () => {
  it('should extend the state with the given value at the given key', () => {
    const state: CarState = {
      brand: 'Peugeot'
    }

    expect(extendState(state, 'Renault', 'brand'))
      .toEqual({
        brand: 'Renault'
      })
      .not.toBe(state)

    expect(extendState(state, { brand: 'Renault' }))
      .toEqual({
        brand: 'Renault'
      })
      .not.toBe(state)
  })

  it('should extend the state with the given value at the given key even if value is not different', () => {
    const state: CarState = {
      brand: 'Peugeot'
    }

    expect(extendState(state, 'Peugeot', 'brand')).toEqual(state).not.toBe(state)

    expect(extendState(state, { brand: 'Peugeot' }))
      .toEqual(state)
      .not.toBe(state)
  })

  it('should extend the state with the given value at the given key if value is not different', () => {
    const state: CarState = {
      brand: 'Peugeot'
    }

    expect(extendStateIfDifferent(state, 'Peugeot', 'brand')).toBe(state)
    expect(extendStateIfDifferent(state, { brand: 'Peugeot' })).toBe(state)
  })

  it('should extend the state with the given object at the given key if the object is different', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200
      }
    }

    expect(
      extendStateIfDifferent(
        state,
        {
          name: '2.0 BlueHDI',
          power: 180
        },
        'engine'
      )
    )
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '2.0 BlueHDI',
          power: 180
        }
      })
      .not.toBe(state)
  })

  it('should not change the state with the given object at the given key if the object is not different', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200
      }
    }

    expect(
      extendStateIfDifferent(
        state,
        {
          name: '1.6 THP',
          power: 200
        },
        'engine'
      )
    ).toBe(state)
  })

  it('should extend the state with the given value at the given path with 1 level of depth', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200
      }
    }

    const expectedState = {
      brand: 'Renault',
      engine: {
        name: '1.6 THP',
        power: 200
      }
    }

    expect(extendStateDeep(state, 'Renault', 'brand')).toEqual(expectedState).not.toBe(state)

    expect(extendStateDeep(state, { brand: 'Renault' }))
      .toEqual(expectedState)
      .not.toBe(state)
  })

  it('should extend the state with the given value at the given path with 2 levels of depth', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200
      }
    }

    expect(extendStateDeep(state, { power: 180 }, 'engine'))
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          power: 180
        }
      })
      .not.toBe(state)

    expect(extendStateDeep(state, 180, 'engine.power'))
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          power: 180
        }
      })
      .not.toBe(state)
  })

  it('should extend the state with the given value at the given path with 3 levels of depth', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200,
        valves: {
          count: 8
        }
      }
    }

    expect(extendStateDeep(state, { count: 16 }, 'engine.valves'))
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          power: 200,
          valves: {
            count: 16
          }
        }
      })
      .not.toBe(state)
  })

  it('should not change the deep state with the given object at the given key if the object is not different', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200,
        valves: {
          count: 8
        }
      }
    }

    const newState = extendStateDeepIfDifferent(state, { count: 8 }, 'engine.valves')
    expect(newState)
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          power: 200,
          valves: {
            count: 8
          }
        }
      })
      .toBe(state)
    expect(newState.engine).toBe(state.engine)
    expect(newState.engine!.valves).toBe(state.engine!.valves)
  })

  it('should extend the state with the given value (object) at the given path with 3 levels of depth', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200,
        valves: {
          count: 10
        }
      }
    }

    const newState = extendStateDeepIfDifferent(state, { count: 8 }, 'engine.valves')
    expect(newState)
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          power: 200,
          valves: {
            count: 8
          }
        }
      })
      .not.toBe(state)
    expect(newState.engine).not.toBe(state.engine)
    expect(newState.engine!.valves).not.toBe(state.engine!.valves)
  })

  it('should extend the state with the given value (!object) at the given path with 3 levels of depth', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200,
        valves: {
          count: 10
        }
      }
    }

    const newState = extendStateDeepIfDifferent(state, 8, 'engine.valves.count')
    expect(newState)
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          power: 200,
          valves: {
            count: 8
          }
        }
      })
      .not.toBe(state)
    expect(newState.engine).not.toBe(state.engine)
    expect(newState.engine!.valves).not.toBe(state.engine!.valves)
  })

  it('should extend the state with the given value (array) at the given path', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200
      },
      wheels: []
    }

    const newState = extendStateDeepIfDifferent(
      state,
      [{ status: 'ok' }, { status: 'ok' }, { status: 'ok' }, { status: 'flat' }],
      'wheels'
    )
    expect(newState)
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          power: 200
        },
        wheels: [{ status: 'ok' }, { status: 'ok' }, { status: 'ok' }, { status: 'flat' }]
      })
      .not.toBe(state)
    expect(newState.engine).toBe(state.engine)
    expect(newState.wheels).not.toBe(state.wheels)
  })

  /* @todo: Following use case should be considered, today this doesn't work.
  it('should extend the state with the given value (\'string\') at the given path (this one is inside an array)', () => {
    const state: CarState = {
      brand: 'Peugeot',
      engine: {
        name: '1.6 THP',
        power: 200
      },
      wheels: [{status: 'ok'}, {status: 'ok'},{status: 'ok'}, {status: 'ok'}]
    }

    const newState = extendStateDeepIfDifferent(state, 'flat', ['wheels', 0, 'status'])

    expect(newState)
      .toEqual({
        brand: 'Peugeot',
        engine: {
          name: '1.6 THP',
          power: 200
        },
        wheels: [{status: 'flat'}, {status: 'ok'},{status: 'ok'}, {status: 'flat'}]
      })
      .not.toBe(state)
    expect(newState.engine).toBe(state.engine)
    expect(newState.wheels).not.toBe(state.wheels)
  })*/
})

interface Valves {
  count: number
}

interface Engine {
  name: string
  power: number
  valves?: Valves
}

interface Wheel {
  status: 'ok' | 'flat'
}

interface CarState {
  brand: string
  engine?: Engine
  wheels?: Wheel[]
}
