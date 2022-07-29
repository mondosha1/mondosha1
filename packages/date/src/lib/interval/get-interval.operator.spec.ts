import { getInterval } from './get-interval.operator'

describe('getInterval', () => {
  const firstJanuaryMidnight = new Date(2022, 1, 1, 0, 0, 0)
  const firstSeptemberMidnight = new Date(2022, 9, 1, 0, 0, 0)
  const tenthDecemberNoon = new Date(2022, 12, 10, 12, 0, 0)

  it('should return interval for multiples dates', () => {
    const dates = [firstJanuaryMidnight, firstSeptemberMidnight, tenthDecemberNoon]
    const intervalDate = getInterval(dates)
    expect(intervalDate).toEqual({
      start: firstJanuaryMidnight,
      end: tenthDecemberNoon
    })
  })

  it('should return interval for one date', () => {
    const dates = [firstSeptemberMidnight]
    expect(getInterval(dates)).toEqual({
      start: firstSeptemberMidnight,
      end: firstSeptemberMidnight
    })
  })

  it('should return interval for multiple same date', () => {
    const dates = [
      tenthDecemberNoon.getTime(),
      firstSeptemberMidnight,
      tenthDecemberNoon,
      firstJanuaryMidnight,
      firstJanuaryMidnight.getTime(),
      tenthDecemberNoon
    ]
    expect(getInterval(dates)).toEqual({
      start: firstJanuaryMidnight,
      end: tenthDecemberNoon
    })
  })
})
