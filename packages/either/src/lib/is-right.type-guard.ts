import { isFunction } from 'lodash/fp'

export function isRight<T, U>(data: T | U, fnOrBool: boolean | ((data: T | U) => boolean)): data is U {
  return (isFunction(fnOrBool) ? fnOrBool(data) : fnOrBool) === true
}
