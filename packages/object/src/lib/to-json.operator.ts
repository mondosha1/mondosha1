import { Nullable } from '@mondosha1/nullable'
import { FullJSON } from './json.type'

export function toJSON<T>(obj: Nullable<T>): Nullable<FullJSON<T>> {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    return null
  }
}
