import { all } from './all.pipeable'
import { fold } from './fold.operator'

describe('all', () => {
  it('should not return null if an empty array is given', () => {
    all([]).pipe(res => expect(res).toBeArray())
  })

  it('should return null if one of the given values is nil', () => {
    all(['notNil', null]).pipe(res => expect(res).toBeNil())
    all([undefined, 'notNil']).pipe(res => expect(res).toBeNil())
  })

  it('should return the array of values if none of the given values is nil', () => {
    all(['notNil', 'notNilEither']).pipe(res => expect(res).toEqual(['notNil', 'notNilEither']))
  })

  it('should fold on right if an empty array is given', () => {
    const foldLeft = jest.fn()
    const foldRight = jest.fn()
    expect(all([]).pipe(fold(foldLeft, foldRight)))
    expect(foldLeft).not.toHaveBeenCalled()
    expect(foldRight).toHaveBeenCalled()
  })

  it('should fold on left if one of the given values is nil', () => {
    const foldLeft = jest.fn()
    const foldRight = jest.fn()
    expect(all(['notNil', null]).pipe(fold(foldLeft, foldRight)))
    expect(foldLeft).toHaveBeenCalled()
    expect(foldRight).not.toHaveBeenCalled()
  })

  it('should fold on right if none of the given values is nil', () => {
    const foldLeft = jest.fn()
    const foldRight = jest.fn()
    expect(all(['notNil', 'notNilEither']).pipe(fold(foldLeft, foldRight)))
    expect(foldLeft).not.toHaveBeenCalled()
    expect(foldRight).toHaveBeenCalled()
  })
})
