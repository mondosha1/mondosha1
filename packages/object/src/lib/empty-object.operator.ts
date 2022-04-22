export const EMPTY_OBJECT = Object.freeze({})
export const emptyObject = <T = any>(): T => EMPTY_OBJECT as unknown as T
