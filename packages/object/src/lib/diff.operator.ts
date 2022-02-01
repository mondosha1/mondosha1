import { of } from '@mondosha1/core'
import { defaults, isEqual, isPlainObject, thru } from 'lodash/fp'
import { get } from './get.operator'
import { reduceObject } from './reduce-object.operator'

export function diff<T extends {}, U extends {}>(base: U): (object: T) => Partial<T> {
  return (object: T) =>
    of(object).pipe(
      reduceObject((result: Partial<T>, value: any, key: keyof U) => {
        const baseValue = of(base).pipe(get(key))
        return isEqual(value, baseValue)
          ? result
          : of(value).pipe(
              thru(val => ({
                [key]: isPlainObject(val) && isPlainObject(baseValue) ? of(val).pipe(diff(baseValue as {})) : val
              })),
              defaults(result)
            )
      }, {} as Partial<T>)
    )
}
