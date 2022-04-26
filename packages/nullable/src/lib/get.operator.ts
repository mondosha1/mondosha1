import { isNil } from 'lodash/fp'
import { Nullable } from './nullable.type'

// Equivalent Option.get in scala
export function get<T>(value: Nullable<T>): T | never {
  if (isNil(value)) {
    throw new Error(`No such element: Nullable.get`)
  }

  return value
}
