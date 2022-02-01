import { append } from '@mondosha1/array'
import { of } from '@mondosha1/core'
import { defaults, initial, join, last, map } from 'lodash/fp'

/** @deprecated */
export function sentence(
  arr: any[],
  iteratee: string | ((val: any) => any) = String,
  mainSeparator: string = ', ',
  secondarySeparator: string = ' and '
): string {
  const values: any[] = of(arr).pipe(map(iteratee as any))
  return values.length < 3
    ? values.join(secondarySeparator)
    : of(values).pipe(initial, join(mainSeparator), append(last(values)), join(secondarySeparator))
}

const defaultOptions: SentenceOptions = {
  iteratee: String,
  mainSeparator: ', ',
  secondarySeparator: ' and '
}

export function sentenceFp(partialOptions?: Partial<SentenceOptions>): (arr: any[]) => string {
  const options = of(partialOptions).pipe(defaults(defaultOptions))
  return (arr: any[]) => {
    const values: any[] = of(arr).pipe(map(options.iteratee as any))
    return values.length < 3
      ? values.join(options.secondarySeparator)
      : of(values).pipe(initial, join(options.mainSeparator), append(last(values)), join(options.secondarySeparator))
  }
}

export interface SentenceOptions {
  iteratee: string | ((val: any) => any)
  mainSeparator: string
  secondarySeparator: string
}
