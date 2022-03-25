import { isFunction } from 'lodash/fp'

export function isLeft<T, U>(data: T | U, fnOrBool: boolean | ((data: T | U) => boolean)): data is T {
  return (isFunction(fnOrBool) ? fnOrBool(data) : fnOrBool) === true
}
