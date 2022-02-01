import { emptyArray } from './empty-array.const'

describe('emptyArray', () => {
  it('should not allow to add elements to the array', () => {
    expect(() => emptyArray().push('anything')).toThrow(TypeError)
    expect(() => emptyArray().unshift('anything')).toThrow(TypeError)
    expect(() => emptyArray().splice(0, 'anything' as unknown as number)).toThrow(TypeError)
  })

  it('should not allow to assign elements at specific indexes to the array', () => {
    expect(() => (emptyArray()[0] = 'anything')).toThrow(TypeError)
  })

  it('should allow to add elements using concat as it returns a new array instance', () => {
    expect(() => emptyArray().concat('anything')).not.toThrow(TypeError)

    const newArr = emptyArray().concat('anything')

    expect(newArr[0]).toBe('anything')
    expect(newArr).not.toBe(emptyArray())
    expect(emptyArray()).toEqual([])
  })
})
