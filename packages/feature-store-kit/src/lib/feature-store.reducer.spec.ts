import { ValidationStatus } from '@elium/shared/util'
import { createAction } from '@elium/shared/util-angular'
import { of } from '@mondosha1/core'
import { defaultsDeep, extend, identity } from 'lodash/fp'
import * as featureStoreActions from './feature-store.actions'
import { featureStoreReducer } from './feature-store.reducer'
import { FeatureStoreState, FeatureStoreStatus, withFeatureStoreState } from './feature-store.state'

describe('Feature store reducer', () => {
  const CAR_FEATURE_STORE_KEY: string = 'car'
  let rootState: RootState
  let reducer
  let metaReducer

  beforeEach(() => {
    rootState = {
      car: withFeatureStoreState({
        brand: 'Peugeot',
        model: '208',
        manualTransmission: false,
        driver: {
          user: {
            firstName: 'Alexandre',
            lastName: 'Lacoche'
          },
          licence: '123-XXX-456',
          licences: ['123-XXX-456']
        }
      }),
      engine: withFeatureStoreState({
        name: '1.6 THP',
        power: 200,
        cylinders: 1598
      })
    }
    reducer = jest.fn(identity)
    metaReducer = featureStoreReducer(reducer)
  })

  describe('FeatureStoreKey', () => {
    it('should not mutate the given rootState if the action does not contain any feature store key', () => {
      const notAFeatureStoreAction = createAction('notAFeatureStoreAction')

      const action = notAFeatureStoreAction()

      expect(reducer).not.toHaveBeenCalled()
      metaReducer(rootState, action)
      expect(reducer).toHaveBeenCalledWith(rootState, action)
    })

    it('should not mutate the given rootState if no state contains the feature store key of the action', () => {
      const consoleError = jest.spyOn(global.console, 'error').mockImplementation()
      const action = featureStoreActions.updateStoreFromForm({
        featureStoreKey: 'notAnExistingFeatureStoreKey',
        values: { brand: 'Renault' }
      })

      expect(reducer).not.toHaveBeenCalled()
      metaReducer(rootState, action)

      expect(consoleError).toHaveBeenCalledWith(
        'No store could be found for the feature store key "notAnExistingFeatureStoreKey".'
      )
      expect(reducer).toHaveBeenCalledWith(rootState, action)
    })

    it('should not mutate the neighbor states if a state was updated thanks to its feature store key', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStoreFromForm({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: { brand: 'Renault' }
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(rootState)
        .toEqual(
          of({
            car: {
              brand: 'Renault'
            }
          }).pipe(defaultsDeep(rootState))
        )

      expect(newRootState.engine).toBe(rootState.engine)
    })
  })

  describe('AskForValidation', () => {
    it('should pass the AskForValidation to true in the form state of the feature store', () => {
      expect(reducer).not.toHaveBeenCalled()
      expect(rootState.car.$meta.formState.askForValidation).toBe(false)

      const action = featureStoreActions.askForValidation({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        askForValidation: true
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(rootState)
        .toEqual(
          of({
            car: {
              $meta: {
                formState: {
                  askForValidation: true
                }
              }
            }
          }).pipe(defaultsDeep(rootState))
        )
    })

    it('should pass the AskForValidation to false in the form state of the feature store', () => {
      expect(reducer).not.toHaveBeenCalled()

      const askedForValidationRootState: RootState = of({
        car: {
          $meta: {
            formState: {
              askForValidation: true
            }
          }
        }
      }).pipe(defaultsDeep(rootState))
      expect(askedForValidationRootState.car.$meta.formState.askForValidation).toBe(true)

      const action = featureStoreActions.askForValidation({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        askForValidation: false
      })
      const newRootState = metaReducer(askedForValidationRootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(askedForValidationRootState)
        .toEqual(
          of({
            car: {
              $meta: {
                formState: {
                  askForValidation: false
                }
              }
            }
          }).pipe(defaultsDeep(askedForValidationRootState))
        )
    })
  })

  describe('Reset', () => {
    it('should reset the feature store state', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.reset({ featureStoreKey: CAR_FEATURE_STORE_KEY })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(rootState)
        .toEqual(of({ car: undefined }).pipe(extend(rootState)))
    })
  })

  describe('SetFormState', () => {
    it('should update the whole form state in the feature store state', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.setFormState({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        formState: {
          status: ValidationStatus.Valid,
          askForValidation: true
        }
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(rootState)
        .toEqual(
          of({
            car: {
              $meta: {
                formState: {
                  status: ValidationStatus.Valid,
                  askForValidation: true
                }
              }
            }
          }).pipe(defaultsDeep(rootState))
        )
    })
  })

  describe('SetReadiness', () => {
    it('should set the feature store status to ready', () => {
      expect(reducer).not.toHaveBeenCalled()
      expect(rootState.car.$meta.status).toBe(FeatureStoreStatus.NotReady)

      const action = featureStoreActions.setStatus({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        status: FeatureStoreStatus.Ready
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(rootState)
        .toEqual(
          of({
            car: {
              $meta: {
                status: FeatureStoreStatus.Ready
              }
            }
          }).pipe(defaultsDeep(rootState))
        )
    })

    it('should set the feature store status to not-ready', () => {
      expect(reducer).not.toHaveBeenCalled()

      const readyRootState: RootState = of({
        car: {
          $meta: {
            status: FeatureStoreStatus.Ready
          }
        }
      }).pipe(defaultsDeep(rootState))
      expect(readyRootState.car.$meta.status).toBe(FeatureStoreStatus.Ready)

      const action = featureStoreActions.setStatus({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        status: FeatureStoreStatus.NotReady
      })
      const newRootState = metaReducer(readyRootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(readyRootState)
        .toEqual(
          of({
            car: {
              $meta: {
                status: FeatureStoreStatus.NotReady
              }
            }
          }).pipe(defaultsDeep(readyRootState))
        )
    })
  })

  describe('UpdateStoreFromForm', () => {
    it('should update a part of the feature store state', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStoreFromForm({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: {
          brand: 'Renault',
          manualTransmission: true
        }
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(rootState)
        .toEqual(
          of({
            car: {
              brand: 'Renault',
              model: '208',
              manualTransmission: true
            }
          }).pipe(defaultsDeep(rootState))
        )
    })

    it('should not allow to update the meta data of the feature store state', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStoreFromForm({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        $meta: { status: FeatureStoreStatus.Ready }
      } as any)
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState).not.toEqual(
        of({
          car: {
            meta: {
              status: FeatureStoreStatus.Ready
            }
          }
        }).pipe(defaultsDeep(rootState))
      )
    })

    it('should not return a different state if the update data equals the previous one', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStoreFromForm({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: { brand: 'Peugeot' }
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState).toBe(rootState)
    })
  })

  describe('UpdateStoreFromParams', () => {
    it('should update a part of the feature store state', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStoreFromParams({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: {
          brand: 'Renault',
          manualTransmission: true
        }
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState)
        .not.toBe(rootState)
        .toEqual(
          of({
            car: {
              brand: 'Renault',
              model: '208',
              manualTransmission: true
            }
          }).pipe(defaultsDeep(rootState))
        )
    })

    it('should not allow to update the meta data of the feature store state', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStoreFromParams({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        $meta: { status: FeatureStoreStatus.Ready }
      } as any)
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState).not.toEqual(
        of({
          car: {
            meta: {
              status: FeatureStoreStatus.Ready
            }
          }
        }).pipe(defaultsDeep(rootState))
      )
    })

    it('should not return a different state if the update data equals the previous one', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStoreFromParams({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: { brand: 'Peugeot' }
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState).toBe(rootState)
    })
  })

  describe('UpdateStore (in depth)', () => {
    it('should update with a string', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStore({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: {
          driver: {
            licence: '123-AAA-456'
          }
        }
      })
      const newRootState = metaReducer(rootState, action)

      expect(reducer).toHaveBeenCalled()
      expect(newRootState.car.driver.licence).toEqual('123-AAA-456')
    })

    it('should update with null', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStore({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: {
          driver: {
            licence: null
          }
        }
      })
      const newRootState = metaReducer(rootState, action)
      expect(reducer).toHaveBeenCalled()
      expect(newRootState.car.driver.licence).toEqual(null)
    })

    it('should update with en empty array', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStore({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: {
          driver: {
            licences: []
          }
        }
      })
      const newRootState = metaReducer(rootState, action)
      expect(reducer).toHaveBeenCalled()
      expect(newRootState.car.driver.licences).toEqual([])
    })

    it('should update with a new array', () => {
      expect(reducer).not.toHaveBeenCalled()

      const action = featureStoreActions.updateStore({
        featureStoreKey: CAR_FEATURE_STORE_KEY,
        values: {
          driver: {
            licences: ['123-BBB-456']
          }
        }
      })
      const newRootState = metaReducer(rootState, action)
      expect(reducer).toHaveBeenCalled()
      expect(newRootState.car.driver.licences).toEqual(['123-BBB-456'])
    })
  })
})

interface User {
  firstName: string
  lastName: string
}

interface DriverData {
  user: User
  licence: string
  licences: string[]
}

interface Engine {
  name: string
  cylinders: number
  power: number
}

interface Car {
  brand: string
  model: string
  manualTransmission: boolean
  driver: DriverData
}

interface RootState {
  car?: FeatureStoreState<Car>
  engine?: FeatureStoreState<Engine>
}
