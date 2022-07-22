export const EMPTY_ARRAY: [] = Object.freeze([]) as []
export const emptyArray = <T = any>(): T[] => EMPTY_ARRAY as unknown[] as T[]
export const EMPTY_ARRAYP = Promise.resolve(EMPTY_ARRAY)

export type UnitOf<T> = T extends (infer U)[] ? U : never
