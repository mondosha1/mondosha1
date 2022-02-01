import { mapKeysWithKey } from './map-keys-with-key.operator'

describe('mapKeysWithKey', () => {
  it('should allow mapping keys giving value and key as parameter', () => {
    const pairs = mapKeysWithKey((value, key) => `${key}-${value}`)({ image: 'jpg', application: 'zip' })
    expect(pairs).toEqual({ 'application-zip': 'zip', 'image-jpg': 'jpg' })
  })
})
