import { InjectionToken } from '@angular/core'
import { extendsDeep } from '@mondosha1/object'
import * as deepFreeze from 'deep-freeze'
import { Structure } from './feature-store.structure'

export enum ValidationStatus {
  Pristine = 'pristine',
  Valid = 'valid',
  Warning = 'warning',
  Error = 'error'
}

export interface FeatureStoreFormState {
  status: ValidationStatus
  askForValidation: boolean
}

export enum FeatureStoreStatus {
  Initializing = 'initializing',
  NotReady = 'not-ready',
  Ready = 'ready',
  Submitting = 'submitting'
}

export interface FeatureStoreMetaState<State extends {}> {
  status: FeatureStoreStatus
  formState: FeatureStoreFormState
  // Can't be replaced by Nullable<Value> seems break some components
  referenceState: Readonly<State> | null
}

export type FeatureStoreState<State> = State & { $meta: FeatureStoreMetaState<State> }

const initialFeatureStoreState: FeatureStoreState<{}> = deepFreeze({
  $meta: {
    status: FeatureStoreStatus.NotReady,
    formState: {
      askForValidation: false,
      status: ValidationStatus.Pristine
    },
    referenceState: null
  }
})

export function withFeatureStoreState<State extends {}>(referenceState: State): Readonly<FeatureStoreState<State>> {
  return deepFreeze<FeatureStoreState<State>>(
    extendsDeep<FeatureStoreState<State>>(referenceState, initialFeatureStoreState, {
      $meta: { referenceState }
    })
  )
}
export const FEATURE_STORE_OPTIONS = new InjectionToken<FeatureStoreModuleOptions<{}>>('FEATURE_STORE_OPTIONS')
export const FEATURE_STORE_FORROOT_GUARD = new InjectionToken<'guarded'>('FEATURE_STORE_FORROOT_GUARD')

export interface FeatureStoreModuleOptions<State extends {}, RichState extends State = State> {
  featureStoreKey: string
  initialState: FeatureStoreState<State>
  structure: Structure<FeatureStoreState<State>>
  children?: readonly string[]
  structurePathsForForm?: readonly string[]
  structurePathsForParams?: readonly string[]
  formatter?: (newState: Partial<State>, oldState: Partial<State>, richState: Partial<RichState>) => Partial<State>
}
