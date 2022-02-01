import { isNil } from 'lodash/fp'

export function preciseOperation(
  a: number,
  b: number,
  operation: (fa: number, ia: number, fb: number, ib: number) => number
): number {
  const fa = getFactor(a)
  const ia = toInt(a)
  const fb = getFactor(b)
  const ib = toInt(b)
  return operation(fa, ia, fb, ib)
}

function getFactor(num: number): number {
  try {
    const res = /[.](\d*)/.exec(String(num))
    return isNil(res) ? 1 : Math.pow(10, res[1].length)
  } catch {
    return 1
  }
}

function toInt(num: number): number {
  return Number(String(num).replace('.', ''))
}
