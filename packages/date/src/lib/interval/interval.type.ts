import { ISO_DATE, ISO_DATETIME, ISO_TIME, MILLISECONDS_TIMESTAMP, SECONDS_TIMESTAMP } from '../date.type'

export interface Interval<
  T extends Date | SECONDS_TIMESTAMP | MILLISECONDS_TIMESTAMP | ISO_DATE | ISO_DATETIME | ISO_TIME
> {
  end: T
  start: T
}
