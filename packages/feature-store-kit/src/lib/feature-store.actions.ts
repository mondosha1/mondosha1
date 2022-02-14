import { createAction, props } from '@elium/shared/util-angular'
import { FeatureStoreFormState, FeatureStoreStatus } from './feature-store.state'

export interface IFeatureStoreAction {
  featureStoreKey: string
}

export const askForValidation = createAction(
  '[FeatureStore] Ask for validation',
  props<{ askForValidation: boolean } & IFeatureStoreAction>()
)
export const initStore = createAction('[FeatureStore] Init store', props<{ values: any } & IFeatureStoreAction>())
export const initStoreFromParent = createAction(
  '[FeatureStore] Init store from parent',
  props<{ values: any } & IFeatureStoreAction>()
)
export const reset = createAction('[FeatureStore] Reset', props<IFeatureStoreAction>())
export const submit = createAction('[FeatureStore] Submit', props<IFeatureStoreAction>())
export const setFormState = createAction(
  '[FeatureStore] Set form state',
  props<{ formState: FeatureStoreFormState } & IFeatureStoreAction>()
)
export const setStatus = createAction(
  '[FeatureStore] Set status',
  props<{ status: FeatureStoreStatus } & IFeatureStoreAction>()
)
export const setReferenceState = createAction(
  '[FeatureStore] Set reference state',
  props<{ values: any } & IFeatureStoreAction>()
)
export const updateParamsFromForm = createAction(
  '[FeatureStore] Update params from form',
  props<{ values: any } & IFeatureStoreAction>()
)
export const updateStore = createAction('[FeatureStore] Update store', props<{ values: any } & IFeatureStoreAction>())
export const updateStoreFromForm = createAction(
  '[FeatureStore] Update store from form',
  props<{ values: any } & IFeatureStoreAction>()
)
export const updateStoreFromParams = createAction(
  '[FeatureStore] Update store from params',
  props<{ values: any } & IFeatureStoreAction>()
)
