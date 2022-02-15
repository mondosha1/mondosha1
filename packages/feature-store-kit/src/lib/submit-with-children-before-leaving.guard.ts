import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot } from '@angular/router'
import { append } from '@mondosha1/array'
import { negate } from '@mondosha1/boolean'
import { of } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { firstValues } from '@mondosha1/observable'
import { select, Store } from '@ngrx/store'
import { forEach, includes, isNil, map, thru } from 'lodash/fp'
import { Observable } from 'rxjs'
import * as featureStore from './feature-store.actions'
import { FeatureStoreFramework } from './feature-store.framework'
import { FeatureStoreRouter } from './feature-store.router'
import { featureStoreQuery } from './feature-store.selectors'
import { FeatureStoreModuleOptions, FeatureStoreState, ValidationStatus } from './feature-store.state'

@Injectable()
export class SubmitWithChildrenBeforeLeavingGuard<Component> implements CanDeactivate<Component> {
  public constructor(
    protected readonly featureStoreFramework: FeatureStoreFramework,
    protected readonly store: Store<FeatureStoreState<Component>>
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

    const currentRouteHash = FeatureStoreRouter.getRouteHash(currentRoute.data.featureStoreKey, currentState)
    const nextRouteHash = FeatureStoreRouter.getRouteHash(currentRoute.data.featureStoreKey, nextState)
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
