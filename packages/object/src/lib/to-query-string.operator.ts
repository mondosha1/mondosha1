import { of } from '@mondosha1/core'
import { foldLeft } from '@mondosha1/nullable'
import { join } from 'lodash/fp'
import { get } from './get.operator'
import { mapObject } from './map-object.operator'
import { toUrlParams } from './to-url-params.operator'

export function toQueryString(options?: QueryStringOptions): (obj: {}) => string {
  const mainSeparator = of(options).pipe(get('mainSeparator'), foldLeft('&'))
  const secondarySeparator = of(options).pipe(get('secondarySeparator'), foldLeft('='))
  return (obj: {}) =>
    of(obj).pipe(
      toUrlParams,
      mapObject((value, key) => `${key}${secondarySeparator}${encodeURIComponent(value)}`),
      join(mainSeparator)
    )
}

export interface QueryStringOptions {
  mainSeparator?: string
  secondarySeparator?: string
}
