import { of } from '@mondosha1/core'
import { defaults, isArray, isNil, isObject, join, split, take, thru } from 'lodash/fp'
import { F, O, S } from 'ts-toolbelt'
import { get } from './get.operator'
import { jsonEqual } from './json-equal.operator'
import { PartialDeep } from './partial-deep.type'
import { reduceRightObject } from './reduce-object.operator'

export function extendState<State>(state: State, payload: Partial<State>): State
export function extendState<State, Key extends keyof State>(state: State, payload: Partial<State[Key]>, key: Key): State
export function extendState<State, Key extends keyof State>(
  state: State,
  payload: Partial<State[Key]>,
  key?: Key
): State {
  return isNil(key) ? of(payload).pipe(defaults(state)) : of({ [key]: payload }).pipe(defaults(state))
}

export function extendStateDeep<State extends {}>(state: State, payload: Partial<State>): State
export function extendStateDeep<State extends {}, Path extends string>(
  state: State,
  payload: Partial<O.Path<State, S.Split<Path, '.'>>>,
  path: F.AutoPath<State, Path>
): State
export function extendStateDeep<State extends {}, Path extends string>(
  state: State,
  payload: Partial<O.Path<State, S.Split<Path, '.'>>>,
  path?: F.AutoPath<State, Path>
): State {
  return isNil(path)
    ? extendState<any>(state, payload)
    : of(path).pipe(
        split('.'),
        reduceRightObject((res: any, currentPath: keyof State, index: number) => {
          const subState = of(path).pipe(
            split('.'),
            take(index),
            join('.'),
            thru(subPath => of(state).pipe(get<any, any>(subPath)))
          )
          if (!isObject(res) || isArray(res)) {
            return of({ [currentPath]: res }).pipe(defaults(subState))
          } else {
            const resExtended = of(res).pipe(defaults(of(state).pipe(get(currentPath))))
            return of({ [currentPath]: resExtended }).pipe(defaults(subState))
          }
        }, payload),
        defaults(state)
      )
}

export function extendStateIfDifferent<State, Key extends keyof State>(state: State, payload: any, key?: Key): State {
  if (isNil(key)) {
    return payload === state || jsonEqual(payload, state) ? state : extendState(state, payload)
  } else {
    return payload === state[key] || jsonEqual(payload, state[key]) ? state : extendState(state, payload, key)
  }
}

export function extendStateDeepIfDifferent<State extends {}, Path extends string>(
  state: State,
  payload: PartialDeep<O.Path<State, S.Split<Path, '.'>>>,
  path: F.AutoPath<Required<State>, Path>
): State {
  const newValue = of(state).pipe(get<any, any>(path))
  return payload === newValue || jsonEqual(payload, newValue) ? state : extendStateDeep<any, any>(state, payload, path)
}
