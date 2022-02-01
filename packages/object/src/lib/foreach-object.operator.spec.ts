import { forEachObject, forEachRightObject } from './foreach-object.operator'

describe('ForeachObject', () => {
  it('should allow loop through object properties giving value and key as parameter', () => {
    const spyFn = jest.fn()
    forEachObject((value, key) => spyFn([value, key]))({ brand: 'Peugeot', model: '208' })
    expect(spyFn).toHaveBeenCalledWith(['208', 'model']).toHaveBeenCalledWith(['Peugeot', 'brand'])
  })

  it('should allow loop right through object properties giving value and key as parameter', () => {
    const spyFn = jest.fn()
    forEachRightObject((value, key) => spyFn([value, key]))({ brand: 'Peugeot', model: '208' })
    expect(spyFn).toHaveBeenCalledWith(['Peugeot', 'brand']).toHaveBeenCalledWith(['208', 'model'])
  })
})
