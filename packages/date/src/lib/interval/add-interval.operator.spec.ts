import { of } from '@mondosha1/core'
import { ISO_DATETIME, PG_INTERVAL } from '../date.type'
import { mapISO } from '../map-iso.operator'
import { addInterval } from './add-interval.operator'

describe('addInterval', () => {
  it('should add the given interval if single day given', () => {
    const date = of('2022-06-27T08:34:33' as ISO_DATETIME).pipe(mapISO(addInterval('1 day' as PG_INTERVAL)))
    expect(date).toBe('2022-06-28T08:34:33')
  })

  it('should add the given interval if several days given', () => {
    const date = of('2022-06-27T08:34:33' as ISO_DATETIME).pipe(mapISO(addInterval('3 days' as PG_INTERVAL)))
    expect(date).toBe('2022-06-30T08:34:33')
  })

  it('should add the given interval if several time given', () => {
    const date = of('2022-06-27T08:34:33' as ISO_DATETIME).pipe(mapISO(addInterval('05:10:00' as PG_INTERVAL)))
    expect(date).toBe('2022-06-27T13:44:33')
  })
})
