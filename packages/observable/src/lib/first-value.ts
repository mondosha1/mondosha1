import { combineLatest, Observable } from 'rxjs'
import { first } from 'rxjs/operators'

export function firstValue<T>(source$: Observable<T>): Promise<T> {
  return source$.pipe(first()).toPromise()
}

export function firstValues<T, U extends Observable<T>[]>(...sources$: U): Promise<T[]> {
  return combineLatest(...sources$)
    .pipe(first())
    .toPromise() as Promise<T[]>
}
