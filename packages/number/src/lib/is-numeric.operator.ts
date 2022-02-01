// Source https://github.com/ReactiveX/rxjs/blob/master/src/internal/util/isNumeric.ts
import { isArray } from 'lodash/fp'

export function isNumeric(value: any): boolean {
  return !isArray(value) && value - parseFloat(value) + 1 >= 0
}
