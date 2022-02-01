import { preciseOperation } from './precise-operation.operator'

export function multiply(b: number): (operand: number) => number {
  return (a: number) => preciseOperation(a, b, (fa, ia, fb, ib) => (ia * ib) / (fa * fb))
}
