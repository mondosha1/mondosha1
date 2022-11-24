import { getErrorMessage } from './get-error-message.operator'

class FooException extends Error {
  constructor(bar: string) {
    super(`FooException: receive bar: ${bar}`)
  }
}

interface PayloadWithMessage {
  message: string
}

describe('getErrorMessage', () => {
  it('should return message from an error object', () => {
    const error = new Error('420 :)')
    const customError = new FooException('simple-bar')
    const payloadWithMessage: PayloadWithMessage = {
      message: 'I have a message for you!'
    }
    expect(getErrorMessage(error)).toEqual('420 :)')
    expect(getErrorMessage(customError)).toEqual('FooException: receive bar: simple-bar')
    expect(getErrorMessage(payloadWithMessage)).toEqual('I have a message for you!')
  })

  it('should return a message from any object', () => {
    const anyError = {
      error: 'Internal server error',
      details: ['App crashed, please see logs for details', 'Please contact dev team 😉.'],
      code: 500,
      isProd: true,
      context: {
        caller: 'getErrorMessage.ts',
        source: null
      }
    }

    expect(getErrorMessage(anyError)).toEqual(JSON.stringify(anyError))
    expect(getErrorMessage({})).toEqual('{}')
  })
  it('should return a message for a string', () => {
    const strError = 'Error occured!'
    expect(getErrorMessage(strError)).toEqual('"Error occured!"')
    expect(getErrorMessage('')).toEqual('""')
  })
  it('should return a message for an array', () => {
    const arrError = ['Error occured!', 'More details', 500, null]
    expect(getErrorMessage(arrError)).toEqual('["Error occured!","More details",500,null]')
    expect(getErrorMessage([])).toEqual('[]')
  })
  it('should return a message for a number', () => {
    expect(getErrorMessage(500)).toEqual('500')
    expect(getErrorMessage(0)).toEqual('0')
  })
  it('should return a message for a nullish value', () => {
    expect(getErrorMessage(null)).toEqual('null')
    expect(getErrorMessage(undefined)).toEqual('')
  })
})
