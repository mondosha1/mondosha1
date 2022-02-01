import { MultiDimensionalMap } from './multi-dimensional-map.class'

describe('Multi dimensional map', () => {
  it('should store entries with arrays as key', () => {
    const map = new MultiDimensionalMap([
      [['helloworld', 1, false], 'Value 1'],
      [['goodbyeworld', true], 'Value 2']
    ])
    expect(map.get(['helloworld', 1, false])).toBe('Value 1')
    expect(map.get(['goodbyeworld', true])).toBe('Value 2')
  })

  it('should store object instances in given key paths', () => {
    const objInstance = { foo: 'bar' }
    const arrInstance = ['bananas']
    const map = new MultiDimensionalMap([
      [['hello', objInstance], 'Value 1'],
      [['hello', arrInstance], 'Value 2']
    ])
    expect(map.get(['hello', objInstance])).toBe('Value 1')
    expect(map.get(['hello', arrInstance])).toBe('Value 2')
  })

  it('should not override previous path', () => {
    const map = new MultiDimensionalMap([
      [['hello'], 'Value 1'],
      [['hello', 'world'], 'Value 2']
    ])
    expect(map.get(['hello'])).toBe('Value 1')
    expect(map.get(['hello', 'world'])).toBe('Value 2')
    expect(map.get(['hello'])).toBe('Value 1')
  })

  it('should set a value at a given path', () => {
    const map = new MultiDimensionalMap([[['hello'], 'Value 1']])
    expect(map.get(['hello'])).toBe('Value 1')
    map.set(['hello', 'world'], 'Value 2')
    expect(map.get(['hello', 'world'])).toBe('Value 2')
    expect(map.get(['hello'])).toBe('Value 1')
  })
})
