import { of } from './of.pipeable'

describe('Of', () => {
  it('should provide a value-first pipeable method', () => {
    const fn1 = jest.fn(val => `${val}world`)
    const fn2 = jest.fn(() => 'goodbye')
    const fn3 = jest.fn()
    of('hello').pipe(fn1, fn2, fn3)
    expect(fn1).toHaveBeenCalledWith('hello')
    expect(fn2).toHaveBeenCalledWith('helloworld')
    expect(fn3).toHaveBeenCalledWith('goodbye')
  })
})
