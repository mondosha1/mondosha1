import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Nullable } from '@mondosha1/nullable'
import { firstValue } from '@mondosha1/observable'
import { isNil } from 'lodash/fp'
import { FeatureStoreFacadeFactory } from './feature-store.facade'
import { FeatureStoreRouter } from './feature-store.router'
import { ValidationStatus } from './feature-store.state'

@Injectable()
export class SubmitBeforeLeavingGuard<Component> implements CanDeactivate<Component> {
  public constructor(protected readonly featureStoreFacadeFactory: FeatureStoreFacadeFactory) {}

  public async canDeactivate(
    component: Component,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    if (isNil(currentRoute.data.featureStoreKey)) {
      throw new Error('Feature store key is missing from route data')
    }

    const featureStoreFacade = this.featureStoreFacadeFactory.getFacade(currentRoute.data.featureStoreKey)
    const currentRouteHash = FeatureStoreRouter.getRouteHash(currentRoute.data.featureStoreKey, currentState)
    const nextRouteHash = FeatureStoreRouter.getRouteHash(currentRoute.data.featureStoreKey, nextState)
    if (currentRouteHash === nextRouteHash) {
      return true
    }

    const validationStatus: Nullable<ValidationStatus> = await firstValue(featureStoreFacade.validationStatus$)
    featureStoreFacade.askForValidation(true)
    return validationStatus !== ValidationStatus.Error
  }
}
