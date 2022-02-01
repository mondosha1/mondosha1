import { of } from '@mondosha1/core'
import { add } from './add.operator'

describe('add', () => {
  it('should not add with good precision', () => {
    expect(0.1 + 0.2).not.toBe(0.3)
    expect(-0.1 + 0.4).not.toBe(0.3)
  })

  it('should add with good precision', () => {
    const result = of(0.1).pipe(add(0.2))
    expect(result).toBe(0.3)
  })

  it('should add with good precision even if negative operand given', () => {
    const result = of(0.4).pipe(add(-0.1))
    expect(result).toBe(0.3)
  })
})
