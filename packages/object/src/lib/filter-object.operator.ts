// https://github.com/lodash/lodash/issues/1781
import { filter } from 'lodash/fp'

export const filterObject = (filter as any).convert({ cap: false })
