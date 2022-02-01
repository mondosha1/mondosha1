// https://github.com/lodash/lodash/issues/1781
import { OperatorFunction } from '@mondosha1/core'
import { flatMap } from 'lodash/fp'

export const flatMapObject: <K extends string | number, V, T extends { [key in K]: V }, R>(
  fn: (data: V, key: K) => R[]
) => OperatorFunction<T, R[]> = (flatMap as any).convert({
  cap: false
})
