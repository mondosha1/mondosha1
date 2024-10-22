// See https://github.com/Microsoft/TypeScript/issues/12290#issuecomment-456670318
type Head<U> = U extends [any, ...any[]]
  ? ((...args: U) => any) extends (head: infer H, ...args: any) => any
    ? H
    : never
  : never

type Tail<U> = U extends [any, any, ...any[]]
  ? ((...args: U) => any) extends (head: any, ...args: infer T) => any
    ? T
    : never
  : never

export type TraversePath<State, T extends any[]> = Head<T> extends keyof State
  ? {
      0: State[Head<T>]
      1: TraversePath<State[Head<T>], Tail<T>>
    }[Tail<T> extends never ? 0 : 1]
  : never
