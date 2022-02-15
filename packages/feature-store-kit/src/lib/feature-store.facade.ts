import { Injectable } from '@angular/core'
import { RouterState } from '@elium/shared/data-router'
import { Nullable } from '@mondosha1/nullable'
import { select, Store } from '@ngrx/store'
import { Observable } from 'rxjs'
import * as featureStore from './feature-store.actions'
import { featureStoreQuery } from './feature-store.selectors'
import { FeatureStoreFormState, FeatureStoreState, FeatureStoreStatus, ValidationStatus } from './feature-store.state'

export class FeatureStoreFacade<State extends {}, WithMetaState = FeatureStoreState<State>> {
  public readonly askForValidation$: Observable<Nullable<boolean>> = this.store.pipe(
    select(featureStoreQuery.getAskForValidation(), { featureStoreKey: this.featureStoreKey })
  )
  public readonly formState$: Observable<Nullable<FeatureStoreFormState>> = this.store.pipe(
    select(featureStoreQuery.getFormState(), { featureStoreKey: this.featureStoreKey })
  )
  public readonly isBusy$: Observable<Nullable<boolean>> = this.store.pipe(
    select(featureStoreQuery.isBusy(), { featureStoreKey: this.featureStoreKey })
  )
  public readonly isChanged$: Observable<boolean> = this.store.pipe(
    select(featureStoreQuery.isChanged(), { featureStoreKey: this.featureStoreKey })
  )
  public readonly isReady$: Observable<Nullable<boolean>> = this.store.pipe(
    select(featureStoreQuery.isReady(), { featureStoreKey: this.featureStoreKey })
  )
  public readonly referenceState$: Observable<Nullable<State>> = this.store.pipe(
    select(featureStoreQuery.getReferenceState(), { featureStoreKey: this.featureStoreKey })
  ) as Observable<Nullable<State>>
  public readonly routeHash$: Observable<Nullable<string>> = this.store.pipe(
    select(featureStoreQuery.getRouteHash(), { featureStoreKey: this.featureStoreKey })
  )
  public readonly stateWithoutMetaData$: Observable<Nullable<State>> = this.store.pipe(
    select(featureStoreQuery.getStateWithoutMetaData(), { featureStoreKey: this.featureStoreKey })
  ) as Observable<Nullable<State>>

  public readonly status$: Observable<Nullable<FeatureStoreStatus>> = this.store.pipe(
    select(featureStoreQuery.getStatus(), { featureStoreKey: this.featureStoreKey })
  )
  public readonly validationStatus$: Observable<Nullable<ValidationStatus>> = this.store.pipe(
    select(featureStoreQuery.getValidationStatus(), { featureStoreKey: this.featureStoreKey })
  )

  public constructor(
    private readonly featureStoreKey: string,
    private readonly store: Store<WithMetaState & RouterState>
  ) {}

  public askForValidation(askForValidation: boolean): void {
    this.store.dispatch(featureStore.askForValidation({ featureStoreKey: this.featureStoreKey, askForValidation }))
  }

  public initStore(values: Partial<State>): void {
    this.store.dispatch(featureStore.initStore({ featureStoreKey: this.featureStoreKey, values }))
  }

  public initStoreFromParent(values: Partial<State>): void {
    this.store.dispatch(featureStore.initStoreFromParent({ featureStoreKey: this.featureStoreKey, values }))
  }

  public reset(): void {
    this.store.dispatch(featureStore.reset({ featureStoreKey: this.featureStoreKey }))
  }

  public setFormState(formState: FeatureStoreFormState): void {
    this.store.dispatch(featureStore.setFormState({ featureStoreKey: this.featureStoreKey, formState }))
  }

  public setReferenceState(values: Partial<State>): void {
    this.store.dispatch(featureStore.setReferenceState({ featureStoreKey: this.featureStoreKey, values }))
  }

  public setStatus(status: FeatureStoreStatus): void {
    this.store.dispatch(featureStore.setStatus({ featureStoreKey: this.featureStoreKey, status }))
  }

  public submit(): void {
    this.store.dispatch(featureStore.submit({ featureStoreKey: this.featureStoreKey }))
  }

  public updateParamsFromForm(values: Partial<State>): void {
    this.store.dispatch(featureStore.updateParamsFromForm({ featureStoreKey: this.featureStoreKey, values }))
  }

  public updateStore(values: Partial<State>): void {
    this.store.dispatch(featureStore.updateStore({ featureStoreKey: this.featureStoreKey, values }))
  }

  public updateStoreFromForm(values: Partial<State>): void {
    this.store.dispatch(featureStore.updateStoreFromForm({ featureStoreKey: this.featureStoreKey, values }))
  }

  public updateStoreFromParams(values: Partial<State>): void {
    this.store.dispatch(featureStore.updateStoreFromParams({ featureStoreKey: this.featureStoreKey, values }))
  }
}

@Injectable()
export class FeatureStoreFacadeFactory {
  private instanceCache: Map<string, FeatureStoreFacade<any, any>> = new Map()

  public constructor(private store: Store<any>) {}

  public getFacade<State extends {}, WithMetaState = FeatureStoreState<State>>(
    featureStoreKey: string
  ): FeatureStoreFacade<State, WithMetaState> {
    if (!this.instanceCache.has(featureStoreKey)) {
      this.instanceCache.set(featureStoreKey, new FeatureStoreFacade(featureStoreKey, this.store))
    }
    return this.instanceCache.get(featureStoreKey)
  }
}
