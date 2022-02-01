// Source: https://angular.schule/blog/2018-02-rxjs-own-log-operator
import { Observable } from 'rxjs'
// eslint-disable-next-line no-restricted-imports
import { tap } from 'rxjs/operators'

export function log<T>(message?: string) {
  return (source$: Observable<T>): Observable<T> =>
    source$.pipe(
      tap(e => (message ? console.log(message, e) : console.log(e))) // eslint-disable-line no-console
    )
}
