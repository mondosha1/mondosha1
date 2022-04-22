import { IMapK, of } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { extendStateDeepIfDifferent, get, jsonEqual } from '@mondosha1/object'
import { createReducer, on } from '@ngrx/store'
import { TypedAction } from '@ngrx/store/src/models'
import { defaults, defaultTo, isArray, isNil, isNull, mapValues, mergeWith, omit, tap, thru } from 'lodash/fp'
import * as featureStore from './feature-store.actions'
import { IFeatureStoreAction } from './feature-store.actions'
import { FeatureStoreState } from './feature-store.state'

export function emptyReducer<T>(state: T): T {
  return state
}

export function featureStoreReducer(reducer) {
  return function <FeatureStoreKey extends string, Store extends FeatureStoreState<{}>, Type extends string>(
    state: IMapK<FeatureStoreKey, Store>,
    action: IFeatureStoreAction & TypedAction<Type>
  ) {
    const featureStoreKey = of(action).pipe(get('featureStoreKey'))
    const store = isNil(featureStoreKey) ? null : getStoreFromFeatureStoreKey(featureStoreKey, state)
    if (isNil(store)) {
      return reducer(state, action)
    } else {
      const newStore: Store = getNewState(store, action)
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
  on(featureStore.askForValidation, (state, { askForValidation }) =>
    extendStateDeepIfDifferent(state, askForValidation, '$meta.formState.askForValidation')
  ),
  on(featureStore.setFormState, (state, { formState }) =>
    extendStateDeepIfDifferent(state, formState, '$meta.formState')
  ),
  on(featureStore.setStatus, (state, { status }) => extendStateDeepIfDifferent(state, status, '$meta.status')),
  on(featureStore.setReferenceState, (state, { values }) => {
    const updatedState = updateStateWithoutMetadata(values, state)
    const referenceState = of(updatedState).pipe(omit('$meta'))
    return extendStateDeepIfDifferent(updatedState, referenceState, '$meta.referenceState')
  }),
  on(
    featureStore.updateStore,
    featureStore.updateStoreFromForm,
    featureStore.updateStoreFromParams,
    (state, { values }) => updateStateWithoutMetadata(values, state)
  ),
  on(featureStore.reset, () => null)
)

function updateStateWithoutMetadata<Store extends FeatureStoreState<{}>>(values: Partial<Store>, state: Store): Store {
  return of(values).pipe(
    omit('$meta'),
    mergeWith((objValue, srcValue) => {
      if (isArray(objValue)) {
        return srcValue
      }
    }, state),
    thru(newStore => (jsonEqual(state, newStore) ? state : newStore) as Store)
  )
}

function getStoreFromFeatureStoreKey<FeatureStoreKey extends string, Store extends FeatureStoreState<{}>>(
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
