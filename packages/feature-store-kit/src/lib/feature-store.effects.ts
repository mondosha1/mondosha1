import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { append } from '@mondosha1/array'
import { negate } from '@mondosha1/boolean'
import { IMapK, of as _of } from '@mondosha1/core'
import { foldLeftOn } from '@mondosha1/nullable'
import { filterFrom, firstValue, toLatestFrom, toLatestsFrom } from '@mondosha1/observable'
import { Actions, ofType } from '@ngrx/effects'
import { ROUTER_NAVIGATION } from '@ngrx/router-store'
import { Action, select, Store } from '@ngrx/store'
import {
  compact,
  defaultsDeep,
  forEach,
  fromPairs,
  identity,
  includes,
  isEmpty,
  isEqual,
  isError,
  isNil,
  map as _map,
  zip
} from 'lodash/fp'
import { MonoTypeOperatorFunction, Observable, of, race, timer } from 'rxjs'
import {
  catchError,
  distinctUntilChanged,
  filter,
  first,
  map,
  mapTo,
  mergeMap,
  pairwise,
  switchMap,
  tap,
  withLatestFrom
} from 'rxjs/operators'
import * as featureStore from './feature-store.actions'
import { FeatureStoreFacade, FeatureStoreFacadeFactory } from './feature-store.facade'
import { FeatureStoreFramework } from './feature-store.framework'
import { FeatureStoreRouter, FeatureStoreRouterStoreState, RouterRoute } from './feature-store.router'
import { featureStoreQuery } from './feature-store.selectors'
import {
  FeatureStoreModuleOptions,
  FeatureStoreState,
  FeatureStoreStatus,
  ValidationStatus
} from './feature-store.state'
import { FeatureStoreStructure } from './feature-store.structure'

export class FeatureStoreEffects<State extends {}> {
  private static readonly RESET_WAIT_FOR_READINESS_TIMEOUT: number = 5_000

  public constructor(
    private readonly actions$: Actions,
    private readonly featureStoreFacade: FeatureStoreFacade<State>,
    private readonly featureStoreOptions: FeatureStoreModuleOptions<State>,
    private readonly router: Router,
    private readonly store: Store<FeatureStoreState<State>>
  ) {}

  private get parentAndChildren(): readonly string[] {
    return _of(this.featureStoreOptions.featureStoreKey).pipe(
      append<string, readonly string[]>(this.featureStoreOptions.children)
    )
  }

  /**
   * Effect which initialize the store, it:
   * - Ensures the Params are not overridden with the given state
   * - Creates the initialState meta to allow later `isChanged` checks
   * - Updates the store
   */
  public initStore() {
    return this.actions$.pipe(
      ofType(featureStore.initStore),
      filter(({ featureStoreKey }) => featureStoreKey === this.featureStoreOptions.featureStoreKey),
      map(({ values }) => values),
      tap(values => this.featureStoreFacade.setReferenceState(values)),
      map(values => {
        const segments = FeatureStoreRouter.extractRoutesWithSegments(this.router.routerState.snapshot)
        const params = FeatureStoreRouter.getParametersByFeatureStoreKey(
          this.featureStoreOptions.featureStoreKey,
          segments
        )
        const parsedParams = FeatureStoreStructure.parseParams(params, this.featureStoreOptions.structure)
        const valuesWithParams = _of(parsedParams).pipe(defaultsDeep(values))
        return featureStore.updateStore({
          featureStoreKey: this.featureStoreOptions.featureStoreKey,
          values: valuesWithParams
        })
      })
    )
  }

  /**
   * Effect to trigger actions (or other side-effects) when store is initialized from a parent component
   * This effect should:
   * - be handled by the child component's effect
   *   Eg:
   *   public initStoreFromParent = createEffect(() => this.featureStoreEffects.initStoreFromParent(
   *     source$ => source$.pipe(switchMap(params => searchCampaign(params.campaignId))
   *   ))
   * - provide a complete stream in order to dispatch the SetReadiness action
   */
  public initStoreFromParent(stream$: (source$: Observable<State>) => Observable<any> = switchMap(() => of(null))) {
    return this.actions$.pipe(
      ofType(featureStore.initStoreFromParent),
      filter(({ featureStoreKey }) => featureStoreKey === this.featureStoreOptions.featureStoreKey),
      tap(() => this.featureStoreFacade.setStatus(FeatureStoreStatus.Initializing)),
      map(({ values }) => values),
      tap(values => {
        this.featureStoreFacade.setReferenceState(values)
        this.featureStoreFacade.updateStore(values)
      }),
      stream$,
      map(() =>
        featureStore.setStatus({
          featureStoreKey: this.featureStoreOptions.featureStoreKey,
          status: FeatureStoreStatus.Ready
        })
      )
    )
  }

  /**
   * Effect to trigger actions (or other side-effects) on navigation change
   * This effect should:
   * - be handled by the component's effect
   *   Eg:
   *   public navigateToStore = createEffect(() => this.featureStoreEffects.navigateToStore(
   *     source$ => source$.pipe(switchMap(params => searchCampaign(params.campaignId))
   *   ), { dispatch: false })
   * @param stream$ a complete stream in order to dispatch the SetReadiness action
   * @param config { dispatch: boolean } allow to dispatch action(s) by the FSK effect helper
   */
  public navigateToStore(stream$?: (source$: Observable<State>) => Observable<any>, config?: { dispatch: false })
  public navigateToStore(
    stream$?: (source$: Observable<State>) => Observable<Action | Action[]>,
    config?: { dispatch: true }
  )
  public navigateToStore(
    stream$: (source$: Observable<State>) => Observable<Action | Action[] | any> = switchMap(() => of(null)),
    { dispatch }: { dispatch: boolean } = { dispatch: false }
  ) {
    return this.actions$.pipe(
      ofType(featureStore.updateStoreFromParams),
      filter(({ featureStoreKey }) => featureStoreKey === this.featureStoreOptions.featureStoreKey),
      filterFrom(this.featureStoreFacade.isReady$, negate),
      tap(() => this.featureStoreFacade.setStatus(FeatureStoreStatus.Initializing)),
      map(({ values }) => values),
      stream$,
      mergeMap((actions: Action | Action[] | any) =>
        _of([
          featureStore.setStatus({
            featureStoreKey: this.featureStoreOptions.featureStoreKey,
            status: FeatureStoreStatus.Ready
          })
        ]).pipe(
          foldLeftOn(() => dispatch && !isEmpty(actions), append(actions)),
          compact
        )
      )
    )
  }

  /**
   * Effect to reset store when not anymore on a route related to the featureStoreKey
   * OR
   * When the hash route is different.
   * Eg: According the two following paths, which load a fsk module with check on 'creatives' segment
   * `<domain>/settings/brands/302/creatives` navigate to `<domain>/creatives` should reset the store !
   *
   * This effect should be:
   * - handled by the component's effect
   *   Eg:
   *   public resetStoreOnLeave = createEffect(() => this.featureStoreEffects.resetStoreOnLeave())
   */
  public resetStoreOnLeave() {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(({ payload: { routerState } }: { payload: { routerState: FeatureStoreRouterStoreState } }) =>
        FeatureStoreRouter.getRouteHash(this.featureStoreOptions.featureStoreKey, routerState)
      ),
      pairwise(),
      filter(
        ([prevRouteHash, currRouteHash]: [string, string]) => !isNil(prevRouteHash) && currRouteHash !== prevRouteHash
      ),
      this.waitForStoreReadiness(),
      map(() => featureStore.reset({ featureStoreKey: this.featureStoreOptions.featureStoreKey }))
    )
  }

  public resetStoreWithChildrenOnLeave() {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(({ payload: { routerState } }: { payload: { routerState: FeatureStoreRouterStoreState } }) =>
        FeatureStoreRouter.getRouteHash(this.featureStoreOptions.featureStoreKey, routerState)
      ),
      pairwise(),
      filter(
        ([prevRouteHash, currRouteHash]: [string, string]) => !isNil(prevRouteHash) && currRouteHash !== prevRouteHash
      ),
      this.waitForStoreReadiness(),
      mergeMap(() => _of(this.parentAndChildren).pipe(_map(featureStoreKey => featureStore.reset({ featureStoreKey }))))
    )
  }

  /**
   * Effect to trigger actions (or other side-effects) on succeeded asks for validation
   * This effect should:
   * - be handled by the component's effect
   *   Eg:
   *   public submitIfValid = createEffect(() =>
   *     this.featureStoreEffects.submitIfValid(
   *       source$ => source$.pipe(switchMap(state => saveCampaign(state.campaign))
   *     )
   *   , { dispatch: false })
   * @param stream$ a complete stream in order to dispatch the SetReadiness action
   * @param config { dispatch: boolean } allow to dispatch action(s) by the FSK effect helper
   */
  public submitIfValid(stream$?: (source$: Observable<State>) => Observable<any>, config?: { dispatch: false })
  public submitIfValid(
    stream$?: (source$: Observable<State>) => Observable<Action | Action[]>,
    config?: { dispatch: true }
  )
  public submitIfValid(
    stream$: (source$: Observable<State>) => Observable<Action | Action[] | any> = switchMap(() => of(null)),
    { dispatch }: { dispatch: boolean } = { dispatch: false }
  ) {
    return this.actions$.pipe(
      ofType(featureStore.submit),
      filter(({ featureStoreKey }) => featureStoreKey === this.featureStoreOptions.featureStoreKey),
      filterFrom(
        this.featureStoreFacade.validationStatus$,
        (validationStatus: ValidationStatus) =>
          validationStatus === ValidationStatus.Pristine || validationStatus === ValidationStatus.Valid
      ),
      tap(() => this.featureStoreFacade.setStatus(FeatureStoreStatus.Submitting)),
      toLatestFrom(this.featureStoreFacade.stateWithoutMetaData$),
      switchMap(state =>
        of(state).pipe(
          stream$,
          catchError(error => {
            // eslint-disable-next-line  no-console
            console.error(error)
            return of(null)
          })
        )
      ),
      mergeMap((actions: Action | Action[] | any) =>
        _of([
          featureStore.setStatus({
            featureStoreKey: this.featureStoreOptions.featureStoreKey,
            status: FeatureStoreStatus.Ready
          })
        ]).pipe(
          foldLeftOn(() => dispatch && !isEmpty(actions), append(actions)),
          compact
        )
      )
    )
  }

  /**
   * The same as submitIfValid except it expects the children injected in the FeatureStoreModule are also asked for validation.
   * The complete stream to provide now contains both the current state and the child states as a map indexed by feature store key.
   */
  public submitWithChildrenIfValid<Key extends string>(
    stream$: (source$: Observable<IMapK<Key, State>>) => Observable<any>
  ) {
    return this.actions$.pipe(
      ofType(featureStore.submit),
      filter(({ featureStoreKey }) => featureStoreKey === this.featureStoreOptions.featureStoreKey),
      filterFrom(
        _of(this.parentAndChildren).pipe(
          _map(featureStoreKey => this.store.pipe(select(featureStoreQuery.getValidationStatus(), { featureStoreKey })))
        ),
        validationStatuses => _of(validationStatuses).pipe(negate(includes(ValidationStatus.Error)))
      ),
      tap(() =>
        _of(this.parentAndChildren).pipe(
          // eslint-disable-next-line
          forEach((featureStoreKey: string) =>
            this.store.dispatch(featureStore.setStatus({ featureStoreKey, status: FeatureStoreStatus.Submitting }))
          )
        )
      ),
      toLatestsFrom(
        ..._of(this.parentAndChildren).pipe(
          _map(featureStoreKey =>
            this.store.pipe(select(featureStoreQuery.getStateWithoutMetaData(), { featureStoreKey }))
          )
        )
      ),
      map((states: any[]) => _of(states).pipe(zip(this.parentAndChildren), fromPairs)),
      stream$,
      map(() =>
        featureStore.setStatus({
          featureStoreKey: this.featureStoreOptions.featureStoreKey,
          status: FeatureStoreStatus.Ready
        })
      )
    )
  }

  /**
   * Optional effect to use if no form is used in the current feature store.
   *
   * As there may be feature store without forms, and today the form is in charge of validating and possibly submitting
   * data, an absence of form implies no submit at all.
   * This effect fixes this behavior and transforms directly the askForValidation into a submit action.
   */
  public submitWithoutValidation() {
    return this.actions$.pipe(
      ofType(featureStore.askForValidation),
      filter(action => action.featureStoreKey === this.featureStoreOptions.featureStoreKey),
      filter(action => action.askForValidation === true),
      map(() => featureStore.submit({ featureStoreKey: this.featureStoreOptions.featureStoreKey }))
    )
  }

  /**
   * Effect to update parameters.
   * This effect should be:
   * - handled by the component's effect
   *   Eg:
   *   public updateParams = createEffect(() => this.featureStoreEffects.updateParamsFromForm(), { dispatch: false })
   *
   * - triggered by the form when value changes
   *   Eg:
   *   formGroup.valueChanges.pipe(...)
   *   .subscribe(value => this.store.dispatch(updateParamsFromForm(value)))
   *
   * Only the last segment of each route can be update with parameters.
   *
   */
  public updateParamsFromForm() {
    return this.actions$.pipe(
      ofType(featureStore.updateParamsFromForm),
      filter(action => action.featureStoreKey === this.featureStoreOptions.featureStoreKey),
      map(action => action.values as Partial<State>),
      withLatestFrom(this.featureStoreFacade.stateWithoutMetaData$, this.featureStoreFacade.referenceState$),
      map(([newParams, currentState, referenceState]) => [
        newParams,
        currentState,
        referenceState,
        FeatureStoreRouter.extractRoutesWithSegments(this.router.routerState.snapshot)
      ]),
      filter(([, , , segments]: [Partial<State>, Partial<State>, Partial<State>, RouterRoute[]]) =>
        FeatureStoreRouter.matchesFeatureStoreKey(this.featureStoreOptions.featureStoreKey, segments)
      ),
      map(([newParams, currentState, referenceState, segments]) =>
        FeatureStoreRouter.createPath(this.featureStoreOptions, segments, currentState, referenceState, newParams)
      ),
      tap(path => {
        const queryParams = FeatureStoreRouter.extractQueryParams(this.router.routerState.snapshot)
        this.router.navigate(path, { queryParams, state: { ignoreLoadingBar: true } })
      })
    )
  }

  /**
   * Effect to update store from parameters
   * This effect should be:
   * - handled by the component's effect
   *   Eg:
   *   public updateStoreFromParams = createEffect(() => this.featureStoreEffects.updateStoreFromParams(defaultState))
   * - A formatter fn can be given to make simple transformations onto the state before it comes into the store
   */
  public updateStoreFromParams(formatter: (state: Partial<State>) => Partial<State> = identity) {
    return this.actions$.pipe(
      ofType(ROUTER_NAVIGATION),
      map(({ payload: { routerState } }: { payload: { routerState: FeatureStoreRouterStoreState } }) =>
        FeatureStoreRouter.extractRoutesWithSegments(routerState)
      ),
      map((segments: RouterRoute[]) => ({
        matchesFeatureStoreKey: FeatureStoreRouter.matchesFeatureStoreKey(
          this.featureStoreOptions.featureStoreKey,
          segments
        ),
        parametersByFeatureStoreKey: FeatureStoreRouter.getParametersByFeatureStoreKey(
          this.featureStoreOptions.featureStoreKey,
          segments
        )
      })),
      distinctUntilChanged(isEqual),
      filter(({ matchesFeatureStoreKey, parametersByFeatureStoreKey }) => matchesFeatureStoreKey),
      map(({ matchesFeatureStoreKey, parametersByFeatureStoreKey }) => parametersByFeatureStoreKey),
      map(params => FeatureStoreStructure.parseParams(params, this.featureStoreOptions.structure)),
      map(values =>
        featureStore.updateStoreFromParams({
          featureStoreKey: this.featureStoreOptions.featureStoreKey,
          values: formatter(values)
        })
      )
    )
  }

  private waitForStoreReadiness<T>(): MonoTypeOperatorFunction<T> {
    return (source$: Observable<T>) =>
      source$.pipe(
        switchMap((value: T) =>
          race(
            this.featureStoreFacade.isBusy$.pipe(filter(negate)),
            timer(FeatureStoreEffects.RESET_WAIT_FOR_READINESS_TIMEOUT).pipe(
              switchMap(
                async () =>
                  new Error(
                    `Store "${this.featureStoreOptions.featureStoreKey}" is locked in "${await firstValue(
                      this.featureStoreFacade.status$
                    )}" status and was reset by timeout. Please check the FSK submit flow.`
                  )
              )
            )
          ).pipe(
            first(),
            tap(error => {
              if (isError(error)) {
                console.error(error)
              }
            }),
            mapTo(value)
          )
        )
      )
  }
}

@Injectable()
export class FeatureStoreEffectsFactory {
  private readonly instanceCache = new Map()

  public constructor(
    private readonly actions$: Actions,
    private readonly featureStoreFacadeFactory: FeatureStoreFacadeFactory,
    private readonly featureStoreFramework: FeatureStoreFramework,
    private readonly router: Router,
    private readonly store: Store<any>
  ) {}

  public getEffects<State extends {}>(featureStoreKey: string): FeatureStoreEffects<State> {
    if (!this.instanceCache.has(featureStoreKey)) {
      const featureStoreOptions = this.featureStoreFramework.getFeatureStoreOptions<State>(featureStoreKey)
      this.instanceCache.set(
        featureStoreKey,
        new FeatureStoreEffects<State>(
          this.actions$,
          this.featureStoreFacadeFactory.getFacade(featureStoreKey),
          featureStoreOptions,
          this.router,
          this.store
        )
      )
    }

    return this.instanceCache.get(featureStoreKey)
  }
}
