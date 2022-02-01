import { fromString } from './from-string.operator'

describe('fromString', () => {
  it('should parse a valid JSON string', () => {
    const car = fromString('{"brand": "Peugeot","model": "208"}')
    expect(car).toEqual({ brand: 'Peugeot', model: '208' })
  })

  it('should return null on invalid JSON string', () => {
    const result = fromString("{'why': 'because I use simple quote !'}")
    expect(result).toBeNull()
  })

  it('should return a blank object on empty string', () => {
    const result = fromString('')
    expect(result).toBeNull()
  })
})
