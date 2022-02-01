// Inspired from https://github.com/substack/deep-freeze
import { of } from '@mondosha1/core'
/* eslint-disable no-restricted-imports */
import { filter, forEach, isFunction, isNull, isObject, map, tap, thru } from 'lodash/fp'
/* eslint-enable no-restricted-imports */
import { get } from './get.operator'

export function deepFreeze<T extends {}>(obj: T): Readonly<T> {
  return of(obj).pipe(
    tap(Object.freeze),
    thru(Object.getOwnPropertyNames), // Different from _.keys as it also considers non-enumerable properties
    map(property => of(obj).pipe(get(property as keyof T))),
    filter(value => !isNull(value) && (isObject(value) || isFunction(value)) && !Object.isFrozen(value)),
    // eslint-disable-next-line ban/ban
    forEach<{}>(value => deepFreeze(value)),
    thru(() => obj)
  )
}
