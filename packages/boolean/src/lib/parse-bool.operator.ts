import { Nullable } from '@mondosha1/nullable'

export function parseBool(value: boolean | BooleanNumber | BooleanAsString | BooleanNumberAsString): Nullable<boolean> {
  if (value === true || value === 1 || value === 'true' || value === '1') {
    return true
  } else if (value === false || value === 0 || value === 'false' || value === '0') {
    return false
  }
}

export type BooleanAsString = 'true' | 'false'
export type BooleanNumber = 1 | 0
export type BooleanNumberAsString = '1' | '0'
