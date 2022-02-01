import { Brand } from 'utility-types'

export type JSONDate = string // Formatted date string in ISO
export type JSONPrimitive = string | number | boolean | null | undefined
export type JSONValue<X extends JSONPrimitive = never> = JSONPrimitive | JSONArray<X> | X

export interface JSONArray<X extends JSONPrimitive = never> extends Array<JSONValue<X>> {}

export type FullJSON<T extends {}, X extends JSONPrimitive = never> = {
  [K in keyof T]: T[K] extends Date
    ? JSONDate
    : T[K] extends Brand<string | number, string>
    ? T[K]
    : T[K] extends {}
    ? FullJSON<T[K], X>
    : T[K] extends (...args: any[]) => any
    ? never
    : T[K] extends X
    ? T[K]
    : JSONValue<X>
}
export type PartialJSON<T extends {}, X extends JSONPrimitive = never> = {
  [K in keyof T]?: T[K] extends Date
    ? JSONDate
    : T[K] extends Brand<string | number, string>
    ? T[K]
    : T[K] extends {}
    ? PartialJSON<T[K], X>
    : T[K] extends (...args: any[]) => any
    ? never
    : T[K] extends X
    ? T[K]
    : JSONValue<X>
}
