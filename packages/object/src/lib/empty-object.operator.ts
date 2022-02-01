export const EMPTY_OBJECT = Object.freeze({})
export const emptyObject = <T = any>() => EMPTY_OBJECT as unknown as T
