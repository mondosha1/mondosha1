import { constant, identity, isFunction, isNil } from 'lodash/fp'
import { Nil, Nullable } from './nullable.type'

export function fold<T, L, R>(left: ((v: Nullable<T>) => L) | L, right: ((v: NonNullable<T>) => R) | R = identity) {
  return foldOn<Nullable<T>, NonNullable<T>, L, R>(isNil, left, right)
}

export function foldLeft<T, L>(left: ((v: Nullable<T>) => L) | L) {
  return foldOn<Nullable<T>, NonNullable<T>, L, NonNullable<T>>(isNil, left, identity)
}

export function foldRight<T, R>(right: ((v: T) => R) | R) {
  return foldOn<Nullable<T>, NonNullable<T>, Nil, R>(isNil, identity, right)
}

export function foldOn<T, U extends T, L, R>(
  condition: ((v: T | U) => v is T) | ((v: T | U) => boolean) | boolean,
  left: ((v: T) => L) | L,
  right: ((v: U) => R) | R = identity
) {
  const leftFn = isFunction(left) ? left : constant(left)
  const rightFn = isFunction(right) ? right : constant(right)
  return (value: T) => {
    const condFn = isFunction(condition) ? condition(value) : condition
    return condFn ? leftFn(value) : rightFn(value as U)
  }
}

export function foldLeftOn<T, U extends T, L, R>(
  condition: ((v: T | U) => v is T) | ((v: T | U) => boolean) | boolean,
  left: ((v: T) => L) | L
) {
  return foldOn<T, U, L, R>(condition, left)
}

export function foldRightOn<T, U extends T, L, R>(
  condition: ((v: T | U) => v is T) | ((v: T | U) => boolean) | boolean,
  right: ((v: U) => R) | R
) {
  return foldOn<T, U, L, R>(condition, identity, right)
}
