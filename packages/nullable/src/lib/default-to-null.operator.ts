import { isArray, isEmpty, isNaN, isNil, isPlainObject, isString } from 'lodash/fp'
import { Nullable } from './nullable.type'

export const defaultToNull = <T>(value: Nullable<T>): Nullable<T> =>
  isNil(value) || isNaN(value) || ((isPlainObject(value) || isArray(value) || isString(value)) && isEmpty(value))
    ? null
    : value
