import { MemoizeMap, MultiDimensionalMap } from '@mondosha1/array'
import { of } from '@mondosha1/core'
import { fold, foldLeft } from '@mondosha1/nullable'
import { get } from '@mondosha1/object'
import { getOr, identity } from 'lodash/fp'

export function Memoize(options?: MemoizeOptions): MethodDecorator {
  const resolver = of(options).pipe(getOr(identity, 'resolver')) as (v: any[]) => any
  const Cache = of(options).pipe(
    get('Cache'),
    foldLeft(() => MultiDimensionalMap)
  ) as new (...args: any[]) => any
  return (target: {}, propertyKey: string | symbol) => {
    target[propertyKey] = of(options).pipe(
      get('customImplementation'),
      fold(
        () => memoize(target[propertyKey], resolver, Cache),
        customImplementation => (customImplementation as (...args: any[]) => any)(target[propertyKey])
      )
    )
    return target
  }
}

function memoize(
  func: (...args: any[]) => any,
  resolver: (v: any[]) => any,
  Cache: new (...args: any[]) => any
): (...args: any[]) => any {
  const cache = new Cache()
  return function (...args: any[]) {
    const key = resolver(args)
    if (cache.has(key)) {
      return cache.get(key)
    } else {
      // @ts-ignore
      const result = func.apply(this, args)
      cache.set(key, result)
      return result
    }
  }
}

export interface MemoizeOptions {
  Cache?: new <K, V>() => MemoizeMap<K, V>
  resolver?: (args: any[]) => any
  customImplementation?: (...args: any[]) => any
}
