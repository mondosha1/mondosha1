import { of } from '@mondosha1/core'
import { foldLeft } from '@mondosha1/nullable'
import { fromPairs, map, split } from 'lodash/fp'
import { get } from './get.operator'
import { QueryStringOptions } from './to-query-string.operator'

export function fromQueryString<Result extends {}>(options?: QueryStringOptions): (str: string) => Result {
  const mainSeparator = of(options).pipe(get('mainSeparator'), foldLeft('&'))
  const secondarySeparator = of(options).pipe(get('secondarySeparator'), foldLeft('='))
  return (str: string) => of(str).pipe(split(mainSeparator), map(split(secondarySeparator)), fromPairs) as Result
}
