import { of } from '@mondosha1/core'
import { fromPairs, isArray, isObject, mapValues, sortBy, toPairs } from 'lodash/fp'

export function sortObjectKeys(value) {
  return !isObject(value) || isArray(value) ? value : of(value).pipe(toPairs, sortBy<any>(0), fromPairs)
}

export function deepSortObjectKeys(value) {
  return !isObject(value) || isArray(value)
    ? value
    : of(value).pipe(toPairs, sortBy<any>(0), fromPairs, mapValues(deepSortObjectKeys))
}
