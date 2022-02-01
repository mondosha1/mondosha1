import { of } from '@mondosha1/core'
import { fold, foldRight, Nullable } from '@mondosha1/nullable'
import { forEach, reduce } from 'lodash/fp'

export interface MemoizeMap<K, V> {
  readonly get: (key: K) => Nullable<V>
  readonly has: (key: K) => boolean
  readonly set: (key: K, value: V) => this
}

export class MultiDimensionalMap<K extends any[], V> implements MemoizeMap<K, V> {
  private static readonly valueKey = Symbol('valueKey')
  private readonly map = new Map<any, any>()

  public constructor(entries: Nullable<readonly (readonly [any[], any])[]>) {
    // eslint-disable-next-line ban/ban
    of(entries).pipe(forEach(([key, value]) => this.set(key, value)))
  }

  public get(keys: K): Nullable<V> {
    return of(keys).pipe(
      reduce((res, curr) => (res && res.has(curr) ? res.get(curr) : null), this.map),
      foldRight(map => map.get(MultiDimensionalMap.valueKey))
    )
  }

  public has(keys: K): boolean {
    return of(keys).pipe(
      reduce((res, curr) => (res && res.has(curr) ? res.get(curr) : null), this.map),
      fold(
        () => false,
        leafMap => leafMap.has(MultiDimensionalMap.valueKey)
      )
    )
  }

  public set(keys: K, value: V): this {
    const leafMap = of(keys).pipe(
      reduce((res, curr) => {
        if (res.has(curr)) {
          return res.get(curr)
        } else {
          const map = new Map()
          res.set(curr, map)
          return map
        }
      }, this.map)
    )
    leafMap.set(MultiDimensionalMap.valueKey, value)
    return this
  }
}
