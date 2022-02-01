import { of } from '@mondosha1/core'
import { defaultTo, map, max, range, size, thru } from 'lodash/fp'
import { append } from './append.operator'

export function zipAllWith(iteratee, ...arrays) {
  return source => {
    const arraysToZip = of([source]).pipe(append(arrays))
    return of(arraysToZip).pipe(
      map(size),
      max,
      defaultTo(0),
      range(0),
      map(index =>
        of(arraysToZip).pipe(
          map(index),
          thru(values => iteratee(...values))
        )
      )
    )
  }
}
