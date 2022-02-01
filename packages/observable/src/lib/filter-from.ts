import { first, isArray } from 'lodash/fp'
import { MonoTypeOperatorFunction, Observable, ObservableInput, ObservedValueOf } from 'rxjs'
import { filter, map, withLatestFrom } from 'rxjs/operators'

export function filterFrom<T, O extends ObservableInput<any>>(
  withLatestFrom$: O,
  predicate: (value: ObservedValueOf<O>, index: number) => boolean,
  thisArg?: any
)
export function filterFrom<T, O extends ObservableInput<any>>(
  withLatestFrom$: [O],
  predicate: (value: [ObservedValueOf<O>], index: number) => boolean,
  thisArg?: any
)
export function filterFrom<T, O1 extends ObservableInput<any>, O2 extends ObservableInput<any>>(
  withLatestFrom$: [O1, O2],
  predicate: (value: [ObservedValueOf<O1>, ObservedValueOf<O2>], index: number) => boolean,
  thisArg?: any
)
export function filterFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>
>(
  withLatestFrom$: [O1, O2, O3],
  predicate: (value: [ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>], index: number) => boolean,
  thisArg?: any
)
export function filterFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>
>(
  withLatestFrom$: [O1, O2, O3, O4],
  predicate: (
    value: [ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>],
    index: number
  ) => boolean,
  thisArg?: any
)
export function filterFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>
>(
  withLatestFrom$: [O1, O2, O3, O4, O5],
  predicate: (
    value: [ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>],
    index: number
  ) => boolean,
  thisArg?: any
)
export function filterFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>,
  O6 extends ObservableInput<any>
>(
  withLatestFrom$: [O1, O2, O3, O4, O5, O6],
  predicate: (
    value: [
      ObservedValueOf<O1>,
      ObservedValueOf<O2>,
      ObservedValueOf<O3>,
      ObservedValueOf<O4>,
      ObservedValueOf<O5>,
      ObservedValueOf<O6>
    ],
    index: number
  ) => boolean,
  thisArg?: any
)
export function filterFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>,
  O6 extends ObservableInput<any>,
  O7 extends ObservableInput<any>
>(
  withLatestFrom$: [O1, O2, O3, O4, O5, O6, O7],
  predicate: (
    value: [
      ObservedValueOf<O1>,
      ObservedValueOf<O2>,
      ObservedValueOf<O3>,
      ObservedValueOf<O4>,
      ObservedValueOf<O5>,
      ObservedValueOf<O6>,
      ObservedValueOf<O7>
    ],
    index: number
  ) => boolean,
  thisArg?: any
)
export function filterFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>,
  O6 extends ObservableInput<any>,
  O7 extends ObservableInput<any>,
  O8 extends ObservableInput<any>
>(
  withLatestFrom$: [O1, O2, O3, O4, O5, O6, O7, O8],
  predicate: (
    value: [
      ObservedValueOf<O1>,
      ObservedValueOf<O2>,
      ObservedValueOf<O3>,
      ObservedValueOf<O4>,
      ObservedValueOf<O5>,
      ObservedValueOf<O6>,
      ObservedValueOf<O7>,
      ObservedValueOf<O8>
    ],
    index: number
  ) => boolean,
  thisArg?: any
)
export function filterFrom<T>(
  withLatestFrom$: ObservableInput<any> | ObservableInput<any>[],
  predicate: (value: any | any[], index: number) => boolean,
  thisArg?: any
): MonoTypeOperatorFunction<T> {
  return (source$: Observable<T>): Observable<T> => {
    const withLatestFromArray = isArray(withLatestFrom$) ? withLatestFrom$ : [withLatestFrom$]
    return source$.pipe(
      withLatestFrom<T, any[]>(...withLatestFromArray),
      filter(
        ([, ...fromValues], index) => predicate(isArray(withLatestFrom$) ? fromValues : first(fromValues), index),
        thisArg
      ),
      map(value => first(value) as T)
    )
  }
}
