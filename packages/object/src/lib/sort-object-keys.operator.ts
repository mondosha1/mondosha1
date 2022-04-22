import { of } from '@mondosha1/core'
import { fromPairs, isArray, isObject, mapValues, sortBy, toPairs } from 'lodash/fp'

export function sortObjectKeys<T>(value: T): T {
  return !isObject(value) || isArray(value) ? value : (of(value).pipe(toPairs, sortBy<any>(0), fromPairs) as T)
}

export function deepSortObjectKeys<T>(value: T): T {
  return !isObject(value) || isArray(value)
    ? value
    : (of(value).pipe(toPairs, sortBy<any>(0), fromPairs, mapValues(deepSortObjectKeys)) as T)
}
