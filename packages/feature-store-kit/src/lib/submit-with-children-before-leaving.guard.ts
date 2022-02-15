import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router'
import { CustomRouterStateSerializer, RouterState } from '@elium/shared/data-router'
import { append } from '@mondosha1/array'
import { negate } from '@mondosha1/boolean'
import { of } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { firstValue, firstValues } from '@mondosha1/observable'
import { select, Store } from '@ngrx/store'
import { forEach, includes, isNil, map, thru } from 'lodash/fp'
import { Observable } from 'rxjs'
import { FeatureStoreEffectHelper } from './feature-store-effects.helper'
import * as featureStore from './feature-store.actions'
import { FeatureStoreFramework } from './feature-store.framework'
import { featureStoreQuery } from './feature-store.selectors'
import { FeatureStoreModuleOptions, FeatureStoreState, ValidationStatus } from './feature-store.state'

@Injectable()
export class SubmitWithChildrenBeforeLeavingGuard<Component> implements CanDeactivate<Component> {
  public constructor(
    protected readonly featureStoreFramework: FeatureStoreFramework,
    protected readonly store: Store<FeatureStoreState<Component> & RouterState>
  ) {}

  public async canDeactivate(
    component: Component,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Promise<boolean> {
    if (isNil(currentRoute.data.featureStoreKey)) {
      throw new Error('Feature store key is missing from route data')
    }

    const currentRouteHash = await firstValue(
      this.store.pipe(select(featureStoreQuery.getRouteHash(), { featureStoreKey: currentRoute.data.featureStoreKey }))
    )
    const nextRouteHash = this.getNextRouteHash(nextState, currentRoute)
    if (currentRouteHash === nextRouteHash) {
      return true
    }

    const featureStoreOptions = this.featureStoreFramework.getFeatureStoreOptions(currentRoute.data.featureStoreKey)
    const validationStatuses = await this.getValidationStatuses(featureStoreOptions)
    this.askForValidation(featureStoreOptions)
    return of(validationStatuses).pipe(negate(includes(ValidationStatus.Error)))
  }

  private askForValidation(featureStoreOptions: FeatureStoreModuleOptions<any>): void {
    of(featureStoreOptions.featureStoreKey).pipe(
      append<string>(featureStoreOptions.children),
      // eslint-disable-next-line
      forEach((featureStoreKey: string) =>
        this.store.dispatch(featureStore.askForValidation({ featureStoreKey, askForValidation: true }))
      )
    )
  }

  private getNextRouteHash(nextState: RouterStateSnapshot, currentRoute: ActivatedRouteSnapshot): Nullable<string> {
    const nextRouterStateUrl = CustomRouterStateSerializer.snapshotToRouterStateUrl(nextState)
    return FeatureStoreEffectHelper.generateRouteHash(
      currentRoute.data.featureStoreKey,
      nextRouterStateUrl.routesWithSegments
    )
  }

  private getValidationStatuses(
    featureStoreOptions: FeatureStoreModuleOptions<any>
  ): Promise<Nullable<ValidationStatus>[]> {
    return of(featureStoreOptions.featureStoreKey).pipe(
      append<string>(featureStoreOptions.children),
      map((featureStoreKey: string) =>
        this.store.pipe(select(featureStoreQuery.getValidationStatus(), { featureStoreKey }))
      ),
      thru((validationStatuses: Observable<Nullable<ValidationStatus>>[]) => firstValues(...validationStatuses))
    )
  }
}
