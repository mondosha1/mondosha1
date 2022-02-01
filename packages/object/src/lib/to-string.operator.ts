import { sortObjectKeys } from './sort-object-keys.operator'

export function toString(obj: any): string {
  try {
    return JSON.stringify(obj, (key, value) => sortObjectKeys(value))
  } catch {
    return ''
  }
}
