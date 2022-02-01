import { append } from '@mondosha1/array'
import { of } from '@mondosha1/core'
import { compact, defaults, initial, join, thru } from 'lodash/fp'
import { matches } from './matches.operator'

const defaultOptions: PluralizeOptions = {
  hideForOne: false,
  includeCount: true,
  invariable: false,
  useNoForZero: true,
  useWordForOne: false
}

function getCount(num: number, options?: PluralizeOptions): string {
  switch (num) {
    case 0:
      return options && options.useNoForZero ? 'no' : '0'
    case 1:
      return options && options.hideForOne ? '' : options && options.useWordForOne ? 'one' : '1'
    default:
      return String(num)
  }
}

export function pluralize(num: number, str: string, partialOptions?: PluralizeOptions): string {
  const options = of(partialOptions).pipe(defaults(defaultOptions))
  const pluralWord = num === 1 || options.invariable ? str : pluralizeWord(str)
  if (options.includeCount) {
    const count = getCount(num, options)
    return of([count, pluralWord]).pipe(compact, join(' '))
  } else {
    return pluralWord
  }
}

// In the future, use a more consistent library like https://github.com/blakeembrey/pluralize
export function pluralizeWord(str: string): string {
  return of(str).pipe(
    matches(/[^y]$|[a,e,i,o,u]y$/),
    thru(addTrailingS => (addTrailingS ? `${str}s` : of(str).pipe(initial, append(['i', 'e', 's']), join(''))))
  )
}

export interface PluralizeOptions {
  hideForOne?: boolean
  includeCount?: boolean
  invariable?: boolean
  useNoForZero?: boolean
  useWordForOne?: boolean
}
