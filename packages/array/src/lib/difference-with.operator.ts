import { differenceWith as _differenceWith } from 'lodash/fp'

// reArg in order to be use in of/pipe lodash operator
export const differenceWith =
  (c, b): any =>
  (a): any =>
    _differenceWith(c, a, b)
