export function isRight<T, U>(data: T | U, fn: (data: T | U) => boolean): data is U {
  return fn(data) === true
}
