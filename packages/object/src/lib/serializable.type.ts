import { FullJSON } from './json.type'

export interface Serializable<T = any> {
  readonly toJSON: () => FullJSON<T>
}
