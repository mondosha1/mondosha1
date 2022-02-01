import { Nullable } from '@mondosha1/nullable'
import { FullJSON } from './json.type'

export function fromString<T>(str: string): Nullable<FullJSON<T>> {
  try {
    return JSON.parse(str)
  } catch {
    return null
  }
}
