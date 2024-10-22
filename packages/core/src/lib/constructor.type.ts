export type Constructor<T = {}> = new (...args: any[]) => T

export function DefaultConstructor<T>(): T {
  return class {} as unknown as T
}
