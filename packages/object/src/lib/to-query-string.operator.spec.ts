import { of } from '../../../util-core/src/lib'
import { toQueryString } from './to-query-string.operator'

describe('toQueryString', () => {
  it('should create a query string from params', () => {
    expect(of({ hello: 'world', foo: 'bar' }).pipe(toQueryString())).toBe('hello=world&foo=bar')
  })

  it('should encode values', () => {
    expect(of({ secret: 'I love bananas' }).pipe(toQueryString())).toBe('secret=I%20love%20bananas')
  })

  it('should use custom separators if given', () => {
    expect(
      of({ hello: 'world', foo: 'bar' }).pipe(toQueryString({ mainSeparator: ',', secondarySeparator: ':' }))
    ).toBe('hello:world,foo:bar')

    expect(
      of({ apples: 'big', oranges: 'juicy' }).pipe(
        toQueryString({ mainSeparator: ' and ', secondarySeparator: ' are ' })
      )
    ).toBe('apples are big and oranges are juicy')
  })
})
