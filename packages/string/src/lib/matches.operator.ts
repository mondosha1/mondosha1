import { Nullable } from '@mondosha1/nullable'
import { isString } from 'lodash/fp'

export const matches =
  (regex: string | RegExp) =>
  (str: string): Nullable<RegExpMatchArray> =>
    !isString(str) ? null : str.match(regex)
