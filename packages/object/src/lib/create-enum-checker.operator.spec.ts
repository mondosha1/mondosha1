import { createEnumChecker } from './create-enum-checker.operator'
describe('createEnumChecker', () => {
  enum PrimaryColor {
    RED = 'red',
    GREEN = 'green',
    BLUE = 'blue'
  }

  const primaryColorEnumChecker = createEnumChecker(PrimaryColor)

  it('should assert that value is member of enum', () => {
    const isPrimaryColor = 'red'
    expect(primaryColorEnumChecker(isPrimaryColor)).toBeTrue()
  })

  it('should assert that value is not member of enum', () => {
    const isNotPrimaryColor = 'yellow'
    expect(primaryColorEnumChecker(isNotPrimaryColor)).toBeFalse()
  })
})
