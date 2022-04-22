import { of } from '@mondosha1/core'
import { every, isEqual, some } from 'lodash/fp'

export const subset = <T, U>(firstList: T[], secondList: U[]): boolean =>
  of(firstList).pipe(
    every((firstListItem: T) =>
      of(secondList).pipe(some((secondListItem: U) => of(firstListItem).pipe(isEqual(secondListItem))))
    )
  )
