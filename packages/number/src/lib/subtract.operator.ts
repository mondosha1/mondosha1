import { preciseOperation } from './precise-operation.operator'

export function subtract(b: number): (operand: number) => number {
  return (a: number) => preciseOperation(a, b, (fa, ia, fb, ib) => (ia * fb - ib * fa) / (fa * fb))
}