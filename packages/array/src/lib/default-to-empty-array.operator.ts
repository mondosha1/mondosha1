import { Nullable } from '@mondosha1/nullable'
import { isArray, isEmpty, isNil } from 'lodash/fp'
import { emptyArray } from './empty-array.const'

export const defaultToEmptyArray = <T>(value: Nullable<T[]>): T[] =>
  isNil(value) || (isArray(value) && isEmpty(value)) ? emptyArray<T>() : (value as T[])
