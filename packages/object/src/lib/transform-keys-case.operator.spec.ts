import { deepCamelCaseKeys, deepSnakeCaseKeys } from './transform-keys-case.operator'

describe('Transform keys case', () => {
  describe('deepCamelCaseKeys', () => {
    it('should transform object keys to camel case in arrays', () => {
      expect(deepCamelCaseKeys([{ foo_bar: 1 }])).toEqual([{ fooBar: 1 }])
    })

    it('should deeply transform object keys to camel case', () => {
      expect(deepCamelCaseKeys({ hello_world: { foo_bar: 1 } })).toEqual({ helloWorld: { fooBar: 1 } })
    })

    it('should let primitive values intact', () => {
      expect(deepCamelCaseKeys(1)).toEqual(1)
      expect(deepCamelCaseKeys('hello_world')).toEqual('hello_world')
    })
  })

  describe('deepSnakeCaseKeys', () => {
    it('should transform object keys to camel case in arrays', () => {
      expect(deepSnakeCaseKeys([{ fooBar: 1 }])).toEqual([{ foo_bar: 1 }])
    })

    it('should deeply transform object keys to camel case', () => {
      expect(deepSnakeCaseKeys({ helloWorld: { fooBar: 1 } })).toEqual({ hello_world: { foo_bar: 1 } })
    })

    it('should let primitive values intact', () => {
      expect(deepSnakeCaseKeys(1)).toEqual(1)
      expect(deepSnakeCaseKeys('helloWorld')).toEqual('helloWorld')
    })
  })
})
