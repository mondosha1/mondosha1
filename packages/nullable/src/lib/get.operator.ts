import { isNil } from 'lodash/fp'

// Equivalent Option.get in scala
export function get<T>(value: T | null | undefined): T | never {
  if (isNil(value)) {
    throw new Error(`No such element: Nullable.get`)
  }

  return value
}
