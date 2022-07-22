import { of } from '@mondosha1/core'
import { add } from 'date-fns/fp'
import * as parseInterval from 'postgres-interval'
import { PG_INTERVAL } from '../date.type'

export function addInterval(interval: PG_INTERVAL): (date: Date) => Date {
  return (date: Date) => of(interval).pipe(_ => of(date).pipe(add(parseInterval(_))))
}
