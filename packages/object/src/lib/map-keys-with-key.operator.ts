// https://github.com/lodash/lodash/wiki/FP-Guide#convert
import { mapKeys } from 'lodash/fp'

export const mapKeysWithKey = (mapKeys as any).convert({ cap: false })
