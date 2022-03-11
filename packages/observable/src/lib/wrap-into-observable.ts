// Source https://github.com/angular/angular/blob/3a8f74e3923c5789bb2eda494e146e41ddd2511a/packages/router/src/utils/collection.ts#L95-L108
import { isFunction, isNil } from 'lodash/fp'
import { from, isObservable, Observable, of } from 'rxjs'

export function isPromise(obj: any | Promise<any>): obj is Promise<any> {
  return !isNil(obj) && isFunction(obj.then)
}

export function wrapIntoObservable<T>(value: Wrapped<T>): Observable<T> {
  return isObservable(value) ? value : isPromise(value) ? from(Promise.resolve(value)) : of(value)
}

export type Wrapped<T> = T | Promise<T> | Observable<T>
