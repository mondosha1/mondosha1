import { of } from '@mondosha1/core'
import { inRange } from 'lodash/fp'

export function toOrdinalNumber(num: number): string {
  if (of(num).pipe(inRange(11, 14))) {
    return `${num}th`
  } else {
    switch (num % 10) {
      case 1:
        return `${num}st`
      case 2:
        return `${num}nd`
      case 3:
        return `${num}rd`
      default:
        return `${num}th`
    }
  }
}
