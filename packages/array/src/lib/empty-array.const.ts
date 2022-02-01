export const EMPTY_ARRAY: [] = Object.freeze([]) as []
export const emptyArray = <T = any>() => EMPTY_ARRAY as unknown[] as T[]

export type UnitOf<T> = T extends (infer U)[] ? U : never
