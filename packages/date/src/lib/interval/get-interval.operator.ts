import { max, min } from 'date-fns'
import { Interval } from './interval.type'
/**
 * Takes an array of dates and return an interval (min and max dates)
 */
export function getInterval(dates: (Date | number)[]): Interval<Date> {
  const lowerBound = min(dates)
  const upperBound = max(dates)
  return { start: lowerBound, end: upperBound }
}
