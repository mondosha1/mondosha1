import { Observable, ObservableInput, ObservedValueOf, OperatorFunction } from 'rxjs'
import { map, withLatestFrom } from 'rxjs/operators'

export function toLatestFrom<T, O>(stream$: Observable<O>) {
  return (source$: Observable<T>): Observable<O> =>
    source$.pipe(
      withLatestFrom(stream$),
      map(([_, latest]: [T, O]) => latest as O)
    )
}

export function toLatestsFrom<T>(): OperatorFunction<T, []>
export function toLatestsFrom<T, O1 extends ObservableInput<any>>(
  stream$: O1
): OperatorFunction<T, [ObservedValueOf<O1>]>
export function toLatestsFrom<T, O1 extends ObservableInput<any>, O2 extends ObservableInput<any>>(
  stream1$: O1,
  stream2$: O2
): OperatorFunction<T, [ObservedValueOf<O1>, ObservedValueOf<O2>]>
export function toLatestsFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>
>(
  stream1$: O1,
  stream2$: O2,
  stream3$: O3
): OperatorFunction<T, [ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>]>
export function toLatestsFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>
>(
  stream1$: O1,
  stream2$: O2,
  stream3$: O3,
  stream4$: O4
): OperatorFunction<T, [ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>]>
export function toLatestsFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>
>(
  stream1$: O1,
  stream2$: O2,
  stream3$: O3,
  stream4$: O4,
  stream5$: O5
): OperatorFunction<
  T,
  [ObservedValueOf<O1>, ObservedValueOf<O2>, ObservedValueOf<O3>, ObservedValueOf<O4>, ObservedValueOf<O5>]
>
export function toLatestsFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>,
  O6 extends ObservableInput<any>
>(
  stream1$: O1,
  stream2$: O2,
  stream3$: O3,
  stream4$: O4,
  stream5$: O5,
  stream6$: O6
): OperatorFunction<
  T,
  [
    ObservedValueOf<O1>,
    ObservedValueOf<O2>,
    ObservedValueOf<O3>,
    ObservedValueOf<O4>,
    ObservedValueOf<O5>,
    ObservedValueOf<O6>
  ]
>
export function toLatestsFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>,
  O6 extends ObservableInput<any>,
  O7 extends ObservableInput<any>
>(
  stream1$: O1,
  stream2$: O2,
  stream3$: O3,
  stream4$: O4,
  stream5$: O5,
  stream6$: O6,
  stream7$: O7
): OperatorFunction<
  T,
  [
    ObservedValueOf<O1>,
    ObservedValueOf<O2>,
    ObservedValueOf<O3>,
    ObservedValueOf<O4>,
    ObservedValueOf<O5>,
    ObservedValueOf<O6>,
    ObservedValueOf<O7>
  ]
>
export function toLatestsFrom<
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
  stream1$: O1,
  stream2$: O2,
  stream3$: O3,
  stream4$: O4,
  stream5$: O5,
  stream6$: O6,
  stream7$: O7,
  stream8$: O8
): OperatorFunction<
  T,
  [
    ObservedValueOf<O1>,
    ObservedValueOf<O2>,
    ObservedValueOf<O3>,
    ObservedValueOf<O4>,
    ObservedValueOf<O5>,
    ObservedValueOf<O6>,
    ObservedValueOf<O7>,
    ObservedValueOf<O8>
  ]
>
export function toLatestsFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>,
  O6 extends ObservableInput<any>,
  O7 extends ObservableInput<any>,
  O8 extends ObservableInput<any>,
  O9 extends ObservableInput<any>
>(
  stream1$: O1,
  stream2$: O2,
  stream3$: O3,
  stream4$: O4,
  stream5$: O5,
  stream6$: O6,
  stream7$: O7,
  stream8$: O8,
  stream9$: O9
): OperatorFunction<
  T,
  [
    ObservedValueOf<O1>,
    ObservedValueOf<O2>,
    ObservedValueOf<O3>,
    ObservedValueOf<O4>,
    ObservedValueOf<O5>,
    ObservedValueOf<O6>,
    ObservedValueOf<O7>,
    ObservedValueOf<O8>,
    ObservedValueOf<O9>
  ]
>
export function toLatestsFrom<
  T,
  O1 extends ObservableInput<any>,
  O2 extends ObservableInput<any>,
  O3 extends ObservableInput<any>,
  O4 extends ObservableInput<any>,
  O5 extends ObservableInput<any>,
  O6 extends ObservableInput<any>,
  O7 extends ObservableInput<any>,
  O8 extends ObservableInput<any>,
  O9 extends ObservableInput<any>,
  O10 extends ObservableInput<any>
>(
  stream1$: O1,
  stream2$: O2,
  stream3$: O3,
  stream4$: O4,
  stream5$: O5,
  stream6$: O6,
  stream7$: O7,
  stream8$: O8,
  stream9$: O9,
  stream10$: O10
): OperatorFunction<
  T,
  [
    ObservedValueOf<O1>,
    ObservedValueOf<O2>,
    ObservedValueOf<O3>,
    ObservedValueOf<O4>,
    ObservedValueOf<O5>,
    ObservedValueOf<O6>,
    ObservedValueOf<O7>,
    ObservedValueOf<O8>,
    ObservedValueOf<O9>,
    ObservedValueOf<O10>
  ]
>
export function toLatestsFrom<T, R>(...streams$: ObservableInput<any>[]): OperatorFunction<T, R>
export function toLatestsFrom<T>(...streams$: ObservableInput<any>[]): OperatorFunction<T, any[]> {
  return ((source$: Observable<T>) =>
    source$.pipe(
      withLatestFrom<any, any>(...streams$),
      map(([, ...latests]: [T, any[]]) => latests)
    ) as Observable<any[]>) as OperatorFunction<T, any[]>
}
