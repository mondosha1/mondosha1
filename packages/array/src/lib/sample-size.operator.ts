import { MonoOperatorFunction, of } from '@mondosha1/core'
import { reduceObject } from '@mondosha1/object'
import { ceil, sampleSize as _sampleSize, size } from 'lodash/fp'

// Enhance the Lodash sampleSize function by allowing to get a sample of data without the random behavior
export function sampleSize<T>(num: number, random: boolean = false): (collection: T[]) => T[] {
  return (collection: T[]): T[] => {
    if (random === true) {
      return of(collection).pipe(_sampleSize(num) as MonoOperatorFunction<T[]>)
    } else {
      const mod = ceil(size(collection) / num)
      return of(collection).pipe(
        reduceObject((res, curr, index) => (index % mod === 0 ? [...res, curr] : res), [])
      ) as T[]
    }
  }
}
