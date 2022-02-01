import { of } from '@mondosha1/core'
import { drop, take } from 'lodash/fp'
import { append } from './append.operator'
import { prepend } from './prepend.operator'

export function pushAt<T>(element: T, index: number): (collection: T[]) => T[] {
  return (collection: T[]) => {
    const start = of(collection).pipe(take(index))
    const end = of(collection).pipe(drop(index))
    return of(element).pipe(prepend<T>(start), append<T>(end)) as T[]
  }
}
