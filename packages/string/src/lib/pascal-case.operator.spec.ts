import { pascalCase } from './pascal-case.operator'

describe('pascalCase', () => {
  it('should convert a string to pascal case', () => {
    expect(pascalCase('Foo Bar')).toBe('FooBar')
    expect(pascalCase('fooBar')).toBe('FooBar')
    expect(pascalCase('__FOO_BAR__')).toBe('FooBar')
    expect(pascalCase('foo-bar')).toBe('FooBar')
  })
})
