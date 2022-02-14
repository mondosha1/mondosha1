import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router'
import { CustomRouterStateSerializer } from '@elium/shared/data-router'
import { ValidationStatus } from '@elium/shared/util'
import { Nullable } from '@mondosha1/nullable'
import { firstValue } from '@mondosha1/observable'
import { isNil } from 'lodash/fp'
import { FeatureStoreEffectHelper } from './feature-store-effects.helper'
import { FeatureStoreFacadeFactory } from './feature-store.facade'

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
    const currentRouteHash = await firstValue(featureStoreFacade.routeHash$)
    const nextRouteHash = this.getNextRouteHash(nextState, currentRoute)
    if (currentRouteHash === nextRouteHash) {
      return true
    }

    const validationStatus: Nullable<ValidationStatus> = await firstValue(featureStoreFacade.validationStatus$)
    featureStoreFacade.askForValidation(true)
    return validationStatus !== ValidationStatus.Error
  }

  private getNextRouteHash(nextState: RouterStateSnapshot, currentRoute: ActivatedRouteSnapshot): Nullable<string> {
    const nextRouterStateUrl = CustomRouterStateSerializer.snapshotToRouterStateUrl(nextState)
    return FeatureStoreEffectHelper.generateRouteHash(
      currentRoute.data.featureStoreKey,
      nextRouterStateUrl.routesWithSegments
    )
  }
}
