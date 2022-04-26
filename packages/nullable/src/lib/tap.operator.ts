import { isNil, noop } from 'lodash/fp'
import { Nil, Nullable } from './nullable.type'

export function tapLeft<T>(fn: (value: Nil) => void): (nullable: Nullable<T>) => Nullable<T> {
  return tap(fn, noop)
}

export function tapRight<T>(fn: (value: T) => void): (nullable: Nullable<T>) => Nullable<T> {
  return tap(noop, fn)
}

export function tap<T>(left: (value: Nil) => void, right: (value: T) => void): (nullable: Nullable<T>) => Nullable<T> {
  return nullable => {
    if (isNil(nullable)) {
      left(nullable)
    } else {
      right(nullable)
    }
    return nullable
  }
}
