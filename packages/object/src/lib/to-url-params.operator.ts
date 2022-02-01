import { IMap, of } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { concat, extend, isArray, isNil, isObject, isPlainObject, join, map, reject, thru } from 'lodash/fp'
import { reduceObject } from './reduce-object.operator'
import { toJSON } from './to-json.operator'
import { toString } from './to-string.operator'

export function toUrlParams(
  obj: Nullable<{}>,
  deepObjectParse: boolean = false,
  parentPath?: string
): IMap<string | number | boolean> {
  return of(obj).pipe(
    reduceObject((res, curr, key) => {
      const path = of(key).pipe(concat(parentPath), reject(isNil), join('.'))
      const param = isPlainObject(curr)
        ? toUrlParams(curr, deepObjectParse, path)
        : isObject(curr) && deepObjectParse
        ? toUrlParams(toJSON(curr), deepObjectParse, path)
        : isArray(curr)
        ? of(curr).pipe(
            map(item => (isObject(item) ? toString(toUrlParams(item)) : item)),
            thru(items => ({ [path]: of(items).pipe(join(',')) }))
          )
        : isObject(curr)
        ? { [path]: toString(curr) }
        : { [path]: curr }
      return of(param).pipe(extend(res))
    }, {})
  )
}
