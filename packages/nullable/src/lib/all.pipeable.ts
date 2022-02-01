import { of, Pipeable } from '@mondosha1/core'
import { isNil, some } from 'lodash/fp'
import { Nullable } from './nullable.type'

export function all(nullableValues: []): Pipeable<[]>
export function all<A>(nullableValues: [Nullable<A>]): Pipeable<[A]>
export function all<A, B>(nullableValues: [Nullable<A>, Nullable<B>]): Pipeable<[A, B]>
export function all<A, B, C>(nullableValues: [Nullable<A>, Nullable<B>, Nullable<C>]): Pipeable<[A, B, C]>
export function all<A, B, C, D>(
  nullableValues: [Nullable<A>, Nullable<B>, Nullable<C>, Nullable<D>]
): Pipeable<[A, B, C, D]>
export function all<A, B, C, D, E>(
  nullableValues: [Nullable<A>, Nullable<B>, Nullable<C>, Nullable<D>, Nullable<E>]
): Pipeable<[A, B, C, D, E]>
export function all<A, B, C, D, E, F>(
  nullableValues: [Nullable<A>, Nullable<B>, Nullable<C>, Nullable<D>, Nullable<E>, Nullable<F>]
): Pipeable<[A, B, C, D, E, F]>
export function all<A, B, C, D, E, F, G>(
  nullableValues: [Nullable<A>, Nullable<B>, Nullable<C>, Nullable<D>, Nullable<E>, Nullable<F>, Nullable<G>]
): Pipeable<[A, B, C, D, E, F, G]>
export function all<A, B, C, D, E, F, G, H>(
  nullableValues: [
    Nullable<A>,
    Nullable<B>,
    Nullable<C>,
    Nullable<D>,
    Nullable<E>,
    Nullable<F>,
    Nullable<G>,
    Nullable<H>
  ]
): Pipeable<[A, B, C, D, E, F, G, H]>
export function all<A, B, C, D, E, F, G, H, I>(
  nullableValues: [
    Nullable<A>,
    Nullable<B>,
    Nullable<C>,
    Nullable<D>,
    Nullable<E>,
    Nullable<F>,
    Nullable<G>,
    Nullable<H>,
    Nullable<I>
  ]
): Pipeable<[A, B, C, D, E, F, G, H, I]>
export function all<A, B, C, D, E, F, G, H, I, J>(
  nullableValues: [
    Nullable<A>,
    Nullable<B>,
    Nullable<C>,
    Nullable<D>,
    Nullable<E>,
    Nullable<F>,
    Nullable<G>,
    Nullable<H>,
    Nullable<I>,
    Nullable<J>
  ]
): Pipeable<[A, B, C, D, E, F, G, H, I, J]>
export function all(nullableValues: Nullable<any>[]): Pipeable<Nullable<any[]>> {
  return of(nullableValues).pipe(some(isNil)) ? of(null) : of(nullableValues as any[])
}
