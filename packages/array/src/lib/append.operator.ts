import { concat } from 'lodash/fp'

export function append<T, A extends readonly T[] = readonly T[]>(arr: T | A): (items: T | A) => A
export function append<T, A extends T[] = T[]>(arr: T | A): (items: T | A) => A {
  return items => concat(items)(arr) as A
}
