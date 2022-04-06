export type DictionaryKey = string | number | symbol

export interface IMap<T = any> {
  [id: string]: T
}

export type IMapK<K extends DictionaryKey, V> = { [id in K]?: V }
