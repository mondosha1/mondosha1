import { toString } from './to-string.operator'

describe('toString', () => {
  it('should not stringify undefined values', () => {
    expect(toString(undefined)).toBe(undefined)
  })

  it('should stringify null values', () => {
    expect(toString(null)).toBe('null')
  })

  it('should stringify primitive values', () => {
    expect(toString(123)).toBe('123')
    expect(toString('helloworld')).toBe('"helloworld"')
    expect(toString(true)).toBe('true')
  })

  it('should stringify plain objects with their keys sorted', () => {
    const engine = {
      power: 200,
      name: '1.6 THP',
      cylinders: 1598
    }
    expect(toString(engine)).toBe('{"cylinders":1598,"name":"1.6 THP","power":200}')
  })
})
