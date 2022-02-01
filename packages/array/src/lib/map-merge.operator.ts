import { of } from '@mondosha1/core'
import { flatten, map, thru } from 'lodash/fp'
import { prepend } from './prepend.operator'

export const mapMerge =
  <K, V>(...maps: Map<K, V>[]) =>
  (source: Map<K, V>): Map<K, V> =>
    of(maps).pipe(
      prepend(source),
      map((m: Map<K, V>) => Array.from(m.entries())),
      flatten,
      thru((arrays: [K, V][]) => new Map<K, V>(arrays))
    )
