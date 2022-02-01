import { difference as _difference } from 'lodash/fp'

export const difference =
  (b): any =>
  (a): any =>
    _difference(a, b)
