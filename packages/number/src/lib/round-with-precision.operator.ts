import { round } from 'lodash/fp'

export const roundWithPrecision = (round as any).convert({ fixed: false })
