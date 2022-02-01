// eslint-disable-next-line
import { differenceBy as _differenceBy } from 'lodash/fp'

// reArg in order to be use in of/pipe lodash operator
export const differenceBy =
  (c, b): any =>
  (a): any =>
    _differenceBy(c, a, b)
