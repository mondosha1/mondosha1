import { roundWithPrecision } from './round-with-precision.operator'

export function scale(num: number, ratio: number, precision: number = 2): number {
  return roundWithPrecision(num * ratio, precision)
}
