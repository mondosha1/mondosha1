import { unionBy as _unionBy } from 'lodash/fp'

// reArg in order to be use in of/pipe lodash operator
export const unionBy =
  (c, b): any =>
  (a): any =>
    _unionBy(c, a, b)
