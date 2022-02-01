export function isLeft<T, U>(data: T | U, fn: (data: T | U) => boolean): data is T {
  return fn(data) === true
}
