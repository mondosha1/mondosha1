import { of } from '@mondosha1/core'
import { multiply } from './multiply.operator'

describe('multiply', () => {
  it('should not multiply with good precision', () => {
    expect(0.1 * 0.2).not.toBe(0.02)
    expect(77.1 * 850).not.toBe(65535)
    expect(850 * 77.1).not.toBe(65535)
    expect(0.1 * -0.2).not.toBe(-0.02)
  })

  it('should multiply with good precision', () => {
    let result: number

    result = of(0.1).pipe(multiply(0.2))
    expect(result).toBe(0.02)

    result = of(0.07).pipe(multiply(100))
    expect(result).toBe(7)

    result = of(0.00917).pipe(multiply(1000))
    expect(result).toBe(9.17)

    result = of(77.1).pipe(multiply(850))
    expect(result).toBe(65535)

    result = of(850).pipe(multiply(77.1))
    expect(result).toBe(65535)
  })

  it('should multiply with good precision even if negative operand given', () => {
    const result = of(0.1).pipe(multiply(-0.2))
    expect(result).toBe(-0.02)
  })
})
