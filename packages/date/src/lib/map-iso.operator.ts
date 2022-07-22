import { MonoOperatorFunction, OperatorFunction } from '@mondosha1/core'
import { format, parseISO } from 'date-fns/fp'
import { pipe } from 'lodash/fp'
import { ISO_DATETIME_FORMAT } from './date.const'
import { ISO_DATETIME } from './date.type'

export function mapISO(fn: (date: Date) => Date): MonoOperatorFunction<ISO_DATETIME> {
  return pipe(parseISO, fn, format(ISO_DATETIME_FORMAT) as OperatorFunction<Date, ISO_DATETIME>)
}
