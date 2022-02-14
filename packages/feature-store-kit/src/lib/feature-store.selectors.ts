import { routerQuery, RouterRoute } from '@elium/shared/data-router'
import { tap, ValidationStatus } from '@elium/shared/util'
import { IMap, of } from '@mondosha1/core'
import { foldRight } from '@mondosha1/nullable'
import { get } from '@mondosha1/object'
import { createSelector } from '@ngrx/store'
import { defaultTo, includes, isEqual, isNil, omit } from 'lodash/fp'
import { FeatureStoreEffectHelper } from './feature-store-effects.helper'
import {
  FeatureStoreFormState,
  FeatureStoreMetaState,
  FeatureStoreState,
  FeatureStoreStatus
} from './feature-store.state'

const getRootState = <State extends {}>(state: IMap<FeatureStoreState<State>>): FeatureStoreState<State> | null =>
  of(state).pipe(defaultTo(null))

const getState = <State extends {}>() =>
  createSelector(
    getRootState,
    (
      rootState: IMap<FeatureStoreState<State>>,
      props: { featureStoreKey: keyof IMap<FeatureStoreState<State>> }
    ): FeatureStoreState<State> | null =>
      of(rootState).pipe(
        get(props.featureStoreKey),
        defaultTo(null),
        tap(store => {
          if (isNil(store)) {
            console.error(`No state selector could be found for the feature store key "${props.featureStoreKey}".`)
          }
        })
      )
  )

const getMeta = <State extends {}>() =>
  createSelector(getState<State>(), (state: FeatureStoreState<State> | null): FeatureStoreMetaState<State> | null =>
    isNil(state) ? null : of(state).pipe(get('$meta'))
  )

const getStateWithoutMetaData = <
  State extends {},
  WithMetaState extends FeatureStoreState<State> = FeatureStoreState<State>
>() =>
  createSelector(
    getState<State>(),
    (state: WithMetaState | null): State | null => of(state).pipe(omit('$meta'), defaultTo(null)) as State
  )

const getStatus = <State extends {}>() =>
  createSelector(getMeta(), (meta: FeatureStoreMetaState<State> | null): FeatureStoreStatus | null =>
    isNil(meta) ? null : meta.status
  )

const isBusy = () =>
  createSelector(getStatus(), (stateStatus: FeatureStoreStatus | null): boolean | null =>
    of(stateStatus).pipe(
      foldRight(status => of([FeatureStoreStatus.Initializing, FeatureStoreStatus.Submitting]).pipe(includes(status)))
    )
  )

const isReady = () =>
  createSelector(getStatus(), (status: FeatureStoreStatus | null): boolean | null =>
    isNil(status) ? null : status === FeatureStoreStatus.Ready
  )

const getFormState = <State extends {}>() =>
  createSelector(getMeta(), (meta: FeatureStoreMetaState<State> | null): FeatureStoreFormState | null =>
    isNil(meta) ? null : meta.formState
  )

const getAskForValidation = () =>
  createSelector(getFormState(), (formState: FeatureStoreFormState | null): boolean | null =>
    isNil(formState) ? null : formState.askForValidation
  )

const getValidationStatus = () =>
  createSelector(getFormState(), (formState: FeatureStoreFormState | null): ValidationStatus | null =>
    isNil(formState) ? null : formState.status
  )

const getReferenceState = <State extends {}>() =>
  createSelector(getMeta(), (meta: FeatureStoreMetaState<State> | null): State | null =>
    isNil(meta) ? null : meta.referenceState
  )

const isChanged = <State extends {}>() =>
  createSelector(
    getStateWithoutMetaData(),
    getReferenceState(),
    (state: State | null, referenceState: State | null): boolean => !isEqual(state, referenceState)
  )

const getRouteHash = () =>
  createSelector(
    routerQuery.getRoutesWithSegments,
    (segments: RouterRoute[], props: { featureStoreKey: string }): string =>
      FeatureStoreEffectHelper.generateRouteHash(props.featureStoreKey, segments)
  )

export const featureStoreQuery = {
  getAskForValidation,
  getFormState,
  getReferenceState,
  getRootState,
  getRouteHash,
  getState,
  getStateWithoutMetaData,
  getStatus,
  getValidationStatus,
  isBusy,
  isChanged,
  isReady
}
