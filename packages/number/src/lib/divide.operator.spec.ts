import { of } from '@mondosha1/core'
import { divide } from './divide.operator'

describe('divide', () => {
  it('should not divide with good precision', () => {
    expect(8.2 / 1000).not.toBe(0.0082)
    expect(8.2 / -1000).not.toBe(-0.0082)
  })

  it('should divide with good precision', () => {
    const result = of(8.2).pipe(divide(1000))
    expect(result).toBe(0.0082)
  })

  it('should divide with good precision even if negative operand given', () => {
    const result = of(8.2).pipe(divide(-1000))
    expect(result).toBe(-0.0082)
  })
})
