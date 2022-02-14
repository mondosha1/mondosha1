import { tap } from '@elium/shared/util'
import { IMapK, of } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { extendStateDeepIfDifferent, get, jsonEqual } from '@mondosha1/object'
import { createReducer, on } from '@ngrx/store'
import { defaults, defaultTo, isArray, isNil, isNull, mapValues, mergeWith, omit, thru } from 'lodash/fp'
import * as featureStore from './feature-store.actions'

export function emptyReducer<T>(state: T): T {
  return state
}

export function featureStoreReducer(reducer) {
  return function (state: {}, action) {
    const featureStoreKey: string = of(action).pipe(get('payload.featureStoreKey'))
    const store = isNil(featureStoreKey) ? null : getStoreFromFeatureStoreKey(featureStoreKey, state)
    if (isNil(store)) {
      return reducer(state, action)
    } else {
      const newStore = getNewState(store, action)
      if (newStore !== store) {
        return of(newStore).pipe(
          thru(ns => ({ [featureStoreKey]: ns })),
          defaults(state),
          mapValues(resetStore => (isNull(resetStore) ? undefined : resetStore)),
          thru(newState => reducer(newState, action))
        )
      } else {
        return reducer(state, action)
      }
    }
  }
}

const getNewState = createReducer(
  null,
  on(featureStore.askForValidation, (state, { payload: { askForValidation } }) =>
    extendStateDeepIfDifferent(state, askForValidation, '$meta.formState.askForValidation')
  ),
  on(featureStore.setFormState, (state, { payload: { formState } }) =>
    extendStateDeepIfDifferent(state, formState, '$meta.formState')
  ),
  on(featureStore.setStatus, (state, { payload: { status } }) =>
    extendStateDeepIfDifferent(state, status, '$meta.status')
  ),
  on(featureStore.setReferenceState, (state, { payload: { values } }) => {
    const updatedState = updateStateWithoutMetadata(values, state)
    const referenceState = of(updatedState).pipe(omit('$meta'))
    return extendStateDeepIfDifferent(updatedState, referenceState, '$meta.referenceState')
  }),
  on(
    featureStore.updateStore,
    featureStore.updateStoreFromForm,
    featureStore.updateStoreFromParams,
    (state, { payload: { values } }) => updateStateWithoutMetadata(values, state)
  ),
  on(featureStore.reset, () => null)
)

function updateStateWithoutMetadata(values, state) {
  return of(values).pipe(
    omit('$meta'),
    mergeWith((objValue, srcValue) => {
      if (isArray(objValue)) {
        return srcValue
      }
    }, state),
    thru(newStore => (jsonEqual(state, newStore) ? state : newStore))
  )
}

function getStoreFromFeatureStoreKey<FeatureStoreKey extends string, Store extends object>(
  featureStoreKey: FeatureStoreKey,
  state: IMapK<FeatureStoreKey, Store>
): Nullable<Store> {
  return of(state).pipe(
    get(featureStoreKey),
    defaultTo(null),
    tap(store => {
      if (isNil(store)) {
        console.error(`No store could be found for the feature store key "${featureStoreKey}".`)
      }
    })
  )
}
