import { of } from '@mondosha1/core'
import { ISO_DATETIME, PG_INTERVAL } from '../date.type'
import { mapISO } from '../map-iso.operator'
import { subtractInterval } from './subtract-interval.operator'

describe('subtractInterval', () => {
  it('should subtract the given interval if single day given', () => {
    const date = of('2022-06-27T08:34:33' as ISO_DATETIME).pipe(mapISO(subtractInterval('1 day' as PG_INTERVAL)))
    expect(date).toBe('2022-06-26T08:34:33')
  })

  it('should subtract the given interval if several days given', () => {
    const date = of('2022-06-27T08:34:33' as ISO_DATETIME).pipe(mapISO(subtractInterval('3 days' as PG_INTERVAL)))
    expect(date).toBe('2022-06-24T08:34:33')
  })

  it('should subtract the given interval if several time given', () => {
    const date = of('2022-06-27T08:34:33' as ISO_DATETIME).pipe(mapISO(subtractInterval('05:10:00' as PG_INTERVAL)))
    expect(date).toBe('2022-06-27T03:24:33')
  })
})
