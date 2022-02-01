import { mapValuesWithKey } from './map-values-with-key.operator'

describe('MapValuesWithKey', () => {
  it('should allow mapping  values giving value and key as parameter', () => {
    const pairs = mapValuesWithKey((value, key) => `${key}/${value}`)({ image: 'jpg', application: 'zip' })
    expect(pairs).toEqual({ application: 'application/zip', image: 'image/jpg' })
  })
})
