// https://github.com/lodash/lodash/issues/1781
import { map } from 'lodash/fp'

export const mapObject = (map as any).convert({ cap: false })
