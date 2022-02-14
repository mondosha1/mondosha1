import { RouterRoute, RouterSegment } from '@elium/shared/data-router'
import { append, prepend } from '@mondosha1/array'
import { negate } from '@mondosha1/boolean'
import { IMap, of } from '@mondosha1/core'
import { defaultToNull, fold, foldOn, Nullable } from '@mondosha1/nullable'
import { get, jsonEqual } from '@mondosha1/object'
import {
  assignInWith,
  compact,
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
  pickBy,
  reduce,
  thru,
  toPath
} from 'lodash/fp'
import { FeatureStoreModuleOptions, FeatureStoreState } from './feature-store.state'
import { FeatureStoreStructure, Structure } from './feature-store.structure'

export abstract class FeatureStoreEffectHelper {
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
          const segmentParams = FeatureStoreEffectHelper.getAllParameters(seg.url)
          const existingParams = FeatureStoreStructure.parseParams<State>(segmentParams, featureStoreOptions.structure)
          const foreignParams = of(segmentParams).pipe(
            pickBy((value, key) =>
              isNil(FeatureStoreStructure.extractType<State>(featureStoreOptions.structure, toPath(key)))
            )
          )
          const newParams = FeatureStoreEffectHelper.formatParams(
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
        FeatureStoreEffectHelper.createOutletsPath(featureStoreOptions, segs, currentState, referenceState, newParams)
      ),
      thru(outlets => [{ outlets }])
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
        this.differsFromCurrentOrReferenceValue(referenceState, currentState, key, value)
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
    const matchFeatureStoreKey = FeatureStoreEffectHelper.matchesFeatureStoreKey(featureStoreKey, segments)
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

  public static matchesFeatureStoreKey(featureStoreKey: string, segments: RouterRoute[]): boolean {
    return of(segments).pipe(map('data.featureStoreKey'), includes(featureStoreKey))
  }

  private static differsFromCurrentOrReferenceValue<State extends {}, WithMetaState = FeatureStoreState<State>>(
    referenceState: Partial<State>,
    currentState: Partial<State>,
    key: keyof State,
    value: any
  ) {
    return (
      of(currentState).pipe(get(key), jsonEqual(value), negate) ||
      of(referenceState).pipe(get(key), jsonEqual(value), negate)
    )
  }
}
