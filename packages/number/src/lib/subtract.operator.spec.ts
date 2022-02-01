import { of } from '../../../util-core/src/lib'
import { subtract } from './subtract.operator'

describe('subtract', () => {
  it('should not subtract with good precision', () => {
    expect(0.1234 - 0.1235).not.toBe(-0.0001)
    expect(0.1235 - 0.1234).not.toBe(0.0001)
    expect(-0.1235 - 0.1233).not.toBe(-0.2468)
  })

  it('should subtract with good precision', () => {
    let result: number

    result = of(0.1234).pipe(subtract(0.1235))
    expect(result).toBe(-0.0001)

    result = of(0.1235).pipe(subtract(0.1234))
    expect(result).toBe(0.0001)
  })

  it('should subtract with good precision even if negative operand given', () => {
    const result = of(-0.1235).pipe(subtract(0.1233))
    expect(result).toBe(-0.2468)
  })
})
