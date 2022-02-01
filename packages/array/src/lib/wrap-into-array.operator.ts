import { Nullable } from '@mondosha1/nullable'
import { isArray, isNil } from 'lodash/fp'

export function wrapIntoArray<T>(arr: Nullable<T> | T[]): Nullable<T[]> {
  return isNil(arr) || isArray(arr) ? arr : [arr]
}
