import { range } from 'lodash/fp'
import { of } from '../../../util-core/src/lib'
import { toOrdinalNumber } from './to-ordinal-number.operator'

describe('toOrdinalNumber', () => {
  it('should convert a number to its ordinal notation for numbers less than 10', () => {
    expect(toOrdinalNumber(1)).toBe('1st')
    expect(toOrdinalNumber(2)).toBe('2nd')
    expect(toOrdinalNumber(3)).toBe('3rd')
    expect(toOrdinalNumber(4)).toBe('4th')
    expect(toOrdinalNumber(5)).toBe('5th')
    expect(toOrdinalNumber(6)).toBe('6th')
    expect(toOrdinalNumber(7)).toBe('7th')
    expect(toOrdinalNumber(8)).toBe('8th')
    expect(toOrdinalNumber(9)).toBe('9th')
    expect(toOrdinalNumber(10)).toBe('10th')
  })

  it('should convert a number to its ordinal notation for numbers between 10 and 20', () => {
    expect(of(21).pipe(range(11))).toSatisfyAll(num => toOrdinalNumber(num) === `${num}th`)
  })

  it('should convert a number to its ordinal notation for greater than 20', () => {
    expect(toOrdinalNumber(21)).toBe('21st')
    expect(toOrdinalNumber(22)).toBe('22nd')
    expect(toOrdinalNumber(23)).toBe('23rd')
    expect(toOrdinalNumber(24)).toBe('24th')
    expect(toOrdinalNumber(25)).toBe('25th')
    expect(toOrdinalNumber(26)).toBe('26th')
    expect(toOrdinalNumber(27)).toBe('27th')
    expect(toOrdinalNumber(28)).toBe('28th')
    expect(toOrdinalNumber(29)).toBe('29th')
    expect(toOrdinalNumber(30)).toBe('30th')
    expect(toOrdinalNumber(40)).toBe('40th')
    expect(toOrdinalNumber(50)).toBe('50th')
    expect(toOrdinalNumber(60)).toBe('60th')
    expect(toOrdinalNumber(70)).toBe('70th')
    expect(toOrdinalNumber(80)).toBe('80th')
    expect(toOrdinalNumber(90)).toBe('90th')
    expect(toOrdinalNumber(100)).toBe('100th')
    expect(toOrdinalNumber(1000)).toBe('1000th')
    expect(toOrdinalNumber(1000000)).toBe('1000000th')
  })
})
