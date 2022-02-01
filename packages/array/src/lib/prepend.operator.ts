import { concat } from 'lodash/fp'

export const prepend =
  <T>(arr: T | T[]) =>
  (items: T | T[]): T[] =>
    concat(arr)(items)
