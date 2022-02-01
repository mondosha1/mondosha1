// https://github.com/lodash/lodash/wiki/FP-Guide#convert
import { mapValues } from 'lodash/fp'

export const mapValuesWithKey = (mapValues as any).convert({ cap: false })
