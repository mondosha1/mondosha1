import { IMap, of } from '@mondosha1/core'
import { foldRight } from '@mondosha1/nullable'
import { get } from '@mondosha1/object'
import { createSelector, DefaultProjectorFn, MemoizedSelectorWithProps } from '@ngrx/store'
import { defaultTo, includes, isEqual, isNil, omit, tap } from 'lodash/fp'
import {
  FeatureStoreFormState,
  FeatureStoreMetaState,
  FeatureStoreState,
  FeatureStoreStatus,
  ValidationStatus
} from './feature-store.state'

const getRootState = <State extends {}>(state: IMap<FeatureStoreState<State>>): FeatureStoreState<State> | null =>
  of(state).pipe(defaultTo(null))

const getState = <State extends {}>(): ParameterizedSelectorWithProps<State, FeatureStoreState<State> | null> =>
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

const getMeta = <State extends {}>(): ParameterizedSelectorWithProps<State, FeatureStoreMetaState<State> | null> =>
  createSelector(getState<State>(), (state: FeatureStoreState<State> | null): FeatureStoreMetaState<State> | null =>
    isNil(state) ? null : of(state).pipe(get('$meta'))
  )

const getStateWithoutMetaData = <
  State extends {},
  WithMetaState extends FeatureStoreState<State> = FeatureStoreState<State>
>(): ParameterizedSelectorWithProps<State, State | null> =>
  createSelector(
    getState<State>(),
    (state: WithMetaState | null): State | null => of(state).pipe(omit('$meta'), defaultTo(null)) as State
  )

const getStatus = <State extends {}>(): ParameterizedSelectorWithProps<State, FeatureStoreStatus | null> =>
  createSelector(getMeta(), (meta: FeatureStoreMetaState<State> | null): FeatureStoreStatus | null =>
    isNil(meta) ? null : meta.status
  )

const isInitializing = <State extends {}>(): ParameterizedSelectorWithProps<State, boolean | null> =>
  createSelector(getStatus(), (status: FeatureStoreStatus | null): boolean | null =>
    isNil(status) ? null : status === FeatureStoreStatus.Initializing
  )

const isBusy = <State extends {}>(): ParameterizedSelectorWithProps<State, boolean | null> =>
  createSelector(getStatus(), (stateStatus: FeatureStoreStatus | null): boolean | null =>
    of(stateStatus).pipe(
      foldRight(status => of([FeatureStoreStatus.Initializing, FeatureStoreStatus.Submitting]).pipe(includes(status)))
    )
  )

const isReady = <State extends {}>(): ParameterizedSelectorWithProps<State, boolean | null> =>
  createSelector(getStatus(), (status: FeatureStoreStatus | null): boolean | null =>
    isNil(status) ? null : status === FeatureStoreStatus.Ready
  )

const getFormState = <State extends {}>(): ParameterizedSelectorWithProps<State, FeatureStoreFormState | null> =>
  createSelector(getMeta(), (meta: FeatureStoreMetaState<State> | null): FeatureStoreFormState | null =>
    isNil(meta) ? null : meta.formState
  )

const getAskForValidation = <State extends {}>(): ParameterizedSelectorWithProps<State, boolean | null> =>
  createSelector(getFormState(), (formState: FeatureStoreFormState | null): boolean | null =>
    isNil(formState) ? null : formState.askForValidation
  )

const getValidationStatus = <State extends {}>(): ParameterizedSelectorWithProps<State, ValidationStatus | null> =>
  createSelector(getFormState(), (formState: FeatureStoreFormState | null): ValidationStatus | null =>
    isNil(formState) ? null : formState.status
  )

const getReferenceState = <State extends {}>(): ParameterizedSelectorWithProps<State, State | null> =>
  createSelector(getMeta(), (meta: FeatureStoreMetaState<State> | null): State | null =>
    isNil(meta) ? null : meta.referenceState
  )

const isChanged = <State extends {}>(): ParameterizedSelectorWithProps<State, boolean> =>
  createSelector(
    getStateWithoutMetaData(),
    getReferenceState(),
    (state: State | null, referenceState: State | null): boolean => !isEqual(state, referenceState)
  )

export const featureStoreQuery = {
  getAskForValidation,
  getFormState,
  getReferenceState,
  getRootState,
  getState,
  getStateWithoutMetaData,
  getStatus,
  getValidationStatus,
  isInitializing,
  isBusy,
  isChanged,
  isReady
}

type ParameterizedSelectorWithProps<State extends {}, Return> = MemoizedSelectorWithProps<
  State,
  { featureStoreKey: keyof IMap<FeatureStoreState<State>> },
  Return,
  DefaultProjectorFn<Return>
>
