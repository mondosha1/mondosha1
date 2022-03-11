import { ActivatedRouteSnapshot, Params } from '@angular/router'
import { append, prepend } from '@mondosha1/array'
import { negate } from '@mondosha1/boolean'
import { IMap, of } from '@mondosha1/core'
import { defaultToNull, fold, foldLeft, foldOn, foldRightOn, Nullable } from '@mondosha1/nullable'
import { get } from '@mondosha1/object'
import { BaseRouterStoreState } from '@ngrx/router-store/src/serializers/base'
import {
  assignInWith,
  compact,
  concat,
  constant,
  defaults,
  defaultsDeep,
  dropRightWhile,
  eq,
  extend,
  filter,
  find,
  flatMap,
  flatten,
  getOr,
  groupBy,
  identity,
  includes,
  isEmpty,
  isNil,
  join,
  map,
  mapValues,
  merge,
  pickBy,
  reduce,
  reduceRight,
  take,
  thru,
  toPath
} from 'lodash/fp'
import { FeatureStoreModuleOptions, FeatureStoreState } from './feature-store.state'
import { FeatureStoreStructure, Structure } from './feature-store.structure'

export interface FeatureStoreActivatedRouteSnapshot {
  data: ActivatedRouteSnapshot['data']
  outlet: ActivatedRouteSnapshot['outlet']
  params: ActivatedRouteSnapshot['params']
  queryParams: ActivatedRouteSnapshot['queryParams']
  url: ActivatedRouteSnapshot['url']
  children: FeatureStoreActivatedRouteSnapshot[]
  firstChild?: FeatureStoreActivatedRouteSnapshot
}

export interface FeatureStoreRouterStoreState extends BaseRouterStoreState {
  root: FeatureStoreActivatedRouteSnapshot
  url: string
}

export interface RouterRoute {
  data: IMap<any>
  outlet: string
  params: IMap<any>
  url: RouterSegment[]
}

export interface RouterSegment {
  parameters: IMap<string>
  path: string
}

export class FeatureStoreRouter {
  public static createOutletsPath<State extends {}>(
    featureStoreOptions: FeatureStoreModuleOptions<State>,
    segments: RouterRoute[],
    currentState: Partial<State>,
    referenceState: Partial<State>,
    params: Partial<State>
  ): (string | IMap<string>)[] {
    return of(segments).pipe(
      map((seg: RouterRoute) => {
        if (seg.data.featureStoreKey === featureStoreOptions.featureStoreKey) {
          const segmentParams = FeatureStoreRouter.getAllParameters(seg.url)
          const existingParams = FeatureStoreStructure.parseParams<State>(segmentParams, featureStoreOptions.structure)
          const foreignParams = of(segmentParams).pipe(
            pickBy((value, key) =>
              isNil(FeatureStoreStructure.extractType<State>(featureStoreOptions.structure, toPath(key)))
            )
          )
          const newParams = FeatureStoreRouter.formatParams(
            referenceState,
            featureStoreOptions.structure,
            featureStoreOptions.structurePathsForParams,
            params,
            currentState,
            existingParams
          )
          const newWithForeignParams = of(newParams).pipe(defaultsDeep(foreignParams))
          return of(seg.url).pipe(map('path'), append(newWithForeignParams), compact)
        } else {
          return of(seg.url).pipe(
            flatMap((u: RouterSegment) => (isEmpty(u.parameters) ? [u.path] : [u.path, u.parameters]))
          )
        }
      }),
      flatten
    ) as (string | IMap<string>)[]
  }

  public static createPath<State extends {}, WithMetaState = FeatureStoreState<State>>(
    featureStoreOptions: FeatureStoreModuleOptions<State>,
    segments: RouterRoute[],
    currentState: Partial<State>,
    referenceState: Partial<State>,
    newParams: Partial<State>
  ): any[] {
    return of(segments).pipe(
      groupBy<RouterRoute>('outlet'),
      mapValues((segs: RouterRoute[]) =>
        FeatureStoreRouter.createOutletsPath(featureStoreOptions, segs, currentState, referenceState, newParams)
      ),
      thru(outlets => [{ outlets }])
    )
  }

  public static extractData<RouterStoreState extends FeatureStoreRouterStoreState>(
    routerState: RouterStoreState,
    routes?: RouterStoreState['root'][]
  ): IMap<any> {
    return of(routes).pipe(
      foldLeft(() => FeatureStoreRouter.extractRoutes(routerState)),
      FeatureStoreRouter.extractPathFromRoot(routerState),
      map('data'),
      reduce((res, data) => of({}).pipe(merge(res), merge(data)), {})
    )
  }

  public static extractParams<RouterStoreState extends FeatureStoreRouterStoreState>(
    routerState: RouterStoreState,
    routes?: RouterStoreState['root'][]
  ): Params {
    return of(routes).pipe(
      foldLeft(() => FeatureStoreRouter.extractRoutes(routerState)),
      FeatureStoreRouter.extractPathFromRoot(routerState),
      map('params'),
      reduce((res, data) => of({}).pipe(merge(res), merge(data)), {})
    )
  }

  public static extractPath<RouterStoreState extends FeatureStoreRouterStoreState>(
    routerState: RouterStoreState,
    routes?: RouterStoreState['root'][]
  ): string {
    return of(routes).pipe(
      foldLeft(() => FeatureStoreRouter.extractRoutes(routerState)),
      take(1),
      FeatureStoreRouter.extractPathFromRoot(routerState),
      flatMap('url'),
      map('path'),
      compact,
      join('/')
    )
  }

  public static extractPathFromRoot<RouterStoreState extends FeatureStoreRouterStoreState>(
    routerState: RouterStoreState
  ): (routes: RouterStoreState['root'][]) => RouterStoreState['root'][] {
    return (routes: RouterStoreState['root'][]) =>
      of(routes).pipe(flatMap(route => FeatureStoreRouter.findPath(route, routerState.root)))
  }

  public static extractQueryParams<RouterStoreState extends FeatureStoreRouterStoreState>(
    routerState: RouterStoreState
  ): Params {
    return of(routerState).pipe(get<RouterStoreState, any>('root.queryParams'))
  }

  public static extractRoutes<RouterStoreState extends FeatureStoreRouterStoreState>(
    routerState: RouterStoreState,
    filterOutlet?: string
  ): RouterStoreState['root'][] {
    return of(routerState.root.children).pipe(
      map((route: RouterStoreState['root']) => FeatureStoreRouter.getFirstChild(route)),
      filter((route: RouterStoreState['root']) => isNil(filterOutlet) || route.outlet === filterOutlet)
    )
  }

  public static extractRoutesWithSegments<RouterStoreState extends FeatureStoreRouterStoreState>(
    routerState: RouterStoreState,
    routes?: RouterStoreState['root'][]
  ): RouterRoute[] {
    return of(routes).pipe(
      foldLeft(() => FeatureStoreRouter.extractRoutes(routerState)),
      FeatureStoreRouter.extractPathFromRoot(routerState),
      map(
        ({ data, outlet, params: segmentParams, url: urlSegments }): RouterRoute => ({
          data,
          outlet,
          params: segmentParams,
          url: of(urlSegments).pipe(map(({ path, parameters }) => ({ path, parameters })))
        })
      ),
      reduceRight(
        (a: RouterRoute, acc) => {
          if (isEmpty(a.url)) {
            return of({ data: of(acc.data).pipe(defaults(a.data)) }).pipe(defaults(acc))
          } else {
            return of(a).pipe(
              defaultsDeep({ data: acc.data }),
              thru(v => ({ result: of(acc.result).pipe(concat(v)), data: null }))
            )
          }
        },
        { result: [], data: null }
      ),
      get('result')
    )
  }

  public static formatParams<State extends {}>(
    referenceState: Partial<State>,
    structure: Structure<FeatureStoreState<State>>,
    structurePathsForParams: readonly string[],
    newParams: Partial<State>,
    currentState: Partial<State>,
    existingParams: Partial<State>
  ): IMap<any> {
    return of(newParams).pipe(
      defaults(existingParams),
      defaults(currentState),
      pickBy((value, key) => isEmpty(structurePathsForParams) || of(structurePathsForParams).pipe(includes(key))),
      pickBy((value, key: keyof State) =>
        FeatureStoreStructure.differsFromCurrentOrReferenceValue(referenceState, currentState, key, value)
      ),
      assignInWith(
        (currentParams, params, key: string) =>
          !isEmpty(structurePathsForParams) &&
          of(structurePathsForParams).pipe(includes(key), negate) &&
          of(params).pipe(includes(key), negate)
            ? currentParams
            : params,
        existingParams
      ),
      thru(params => FeatureStoreStructure.formatParams<State>(params, structure)),
      defaultToNull
    )
  }

  public static generateRouteHash(featureStoreKey: string, segments: RouterRoute[]): Nullable<string> {
    const matchFeatureStoreKey = FeatureStoreRouter.matchesFeatureStoreKey(featureStoreKey, segments)
    return !matchFeatureStoreKey
      ? null
      : of(segments).pipe(
          find({ data: { featureStoreKey } }),
          fold(constant({ outlet: '' })),
          thru((routerElementWithFeatureStoreKey: Partial<RouterRoute>) =>
            of(segments).pipe(
              filter<RouterRoute>({ outlet: routerElementWithFeatureStoreKey.outlet }),
              dropRightWhile(segment => of(segment).pipe(get('data.featureStoreKey'), negate(eq(featureStoreKey)))),
              foldOn(isEmpty, identity, filteredSegments =>
                of(filteredSegments).pipe(prepend({ url: [{ path: routerElementWithFeatureStoreKey.outlet }] }))
              )
            )
          ),
          map(routerElement => of(routerElement).pipe(get('url'), map('path'))),
          join('/')
        )
  }

  public static getAllParameters(urlSegments: RouterSegment[]): IMap<string> {
    return of(urlSegments).pipe(
      map('parameters'),
      reduce((p, acc) => of(p).pipe(extend(acc)), {})
    )
  }

  public static getParametersByFeatureStoreKey(featureStoreKey: string, segments: RouterRoute[]): IMap<string> {
    const featureStoreSegment = of(segments).pipe(find<RouterRoute>(['data.featureStoreKey', featureStoreKey]))
    const segmentAndAncestorsParams = of(segments).pipe(
      dropRightWhile(negate(eq(featureStoreSegment))),
      filter({ outlet: of(featureStoreSegment).pipe(get('outlet')) }),
      map('params'),
      reduce((res, curr) => of(curr).pipe(defaults(res)), {})
    )
    return of(featureStoreSegment).pipe(
      getOr([], 'url'),
      map('parameters'),
      reduce((params, acc) => of(params).pipe(extend(acc)), segmentAndAncestorsParams)
    )
  }

  public static getRouteHash<RouterStoreState extends FeatureStoreRouterStoreState>(
    featureStoreKey: string,
    state: RouterStoreState
  ): Nullable<string> {
    const routesWithSegments = FeatureStoreRouter.extractRoutesWithSegments(state)
    return FeatureStoreRouter.generateRouteHash(featureStoreKey, routesWithSegments)
  }

  public static matchesFeatureStoreKey(featureStoreKey: string, segments: RouterRoute[]): boolean {
    return of(segments).pipe(map('data.featureStoreKey'), includes(featureStoreKey))
  }

  private static findPath<RouterStoreState extends FeatureStoreRouterStoreState>(
    search: RouterStoreState['root'],
    current: RouterStoreState['root']
  ): RouterStoreState['root'][] {
    return search === current
      ? [current]
      : of(current.children).pipe(
          flatMap(child => FeatureStoreRouter.findPath(search, child)),
          foldRightOn(isEmpty, prepend(current))
        )
  }

  private static getFirstChild<RouterStoreState extends FeatureStoreRouterStoreState>(
    route: RouterStoreState['root'],
    maxCount: number = 50
  ): RouterStoreState['root'] {
    return route.firstChild && maxCount > 0 ? FeatureStoreRouter.getFirstChild(route.firstChild, maxCount - 1) : route
  }
}
