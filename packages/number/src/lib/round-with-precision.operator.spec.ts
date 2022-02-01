import { roundWithPrecision } from './round-with-precision.operator'

describe('roundWithPrecision', () => {
  it('should computes number rounded without precision', () => {
    expect(roundWithPrecision(5)).toEqual(5)
    expect(roundWithPrecision(5.3)).toEqual(5)
    expect(roundWithPrecision(5.6)).toEqual(6)
  })

  it('should computes number rounded with precision', () => {
    expect(roundWithPrecision(5.4321, 4)).toEqual(5.4321)
    expect(roundWithPrecision(5.4321, 2)).toEqual(5.43)
    expect(roundWithPrecision(5.43, 4)).toEqual(5.43)

    expect(roundWithPrecision(5.6789, 4)).toEqual(5.6789)
    expect(roundWithPrecision(5.6789, 2)).toEqual(5.68)
    expect(roundWithPrecision(5.67, 4)).toEqual(5.67)
  })
})
