import { isArray, isEmpty, isNaN, isNil, isPlainObject, isString } from 'lodash/fp'
import { Nullable } from './nullable.type'

export const defaultToNull = <T extends any>(value: Nullable<T>): Nullable<T> =>
  isNil(value) || isNaN(value) || ((isPlainObject(value) || isArray(value) || isString(value)) && isEmpty(value))
    ? null
    : value
