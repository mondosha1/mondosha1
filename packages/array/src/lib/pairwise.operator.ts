import { of } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { dropRight, tail, zip } from 'lodash/fp'

export const pairwise = <T>(ts: T[]): [Nullable<T>, Nullable<T>][] => of(ts).pipe(tail, zip(of(ts).pipe(dropRight(1))))
