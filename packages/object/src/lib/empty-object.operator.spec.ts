import { emptyObject } from './empty-object.operator'

describe('emptyObject', () => {
  it('should not allow to add properties to the object', () => {
    expect(() => (emptyObject().anything = 'anything')).toThrow(TypeError)
  })

  it('should not allow to add properties to the object using square brackets notation', () => {
    expect(() => (emptyObject()['anything'] = 'anything')).toThrow(TypeError) // eslint-disable-line @typescript-eslint/dot-notation
  })
})
