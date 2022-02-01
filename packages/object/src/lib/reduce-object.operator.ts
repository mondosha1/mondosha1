// https://github.com/lodash/lodash/issues/1781
import { reduce, reduceRight } from 'lodash/fp'

export const reduceObject = (reduce as any).convert({ cap: false })
export const reduceRightObject = (reduceRight as any).convert({ cap: false })
