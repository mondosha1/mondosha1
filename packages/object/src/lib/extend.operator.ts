import { extend as _extend } from 'lodash/fp'

// reArg in order to be use in of/pipe lodash operator
export const extend =
  <T, U = T>(b: U) =>
  (a: T): T & U =>
    _extend(a, b)
