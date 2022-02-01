import { ConnectableObservable, Observable } from 'rxjs'
import { publishReplay } from 'rxjs/operators'

/* Two benefits:
- Allow lazy subscribers to receive notifications even if the observable already completed
- Share the logic made before: eg, code written in ascendant map operators will be executed only once even if there are several subscribers
 */
export function allowLatecomers<T>() {
  return (source$: Observable<T>): Observable<T> => {
    const connectable$ = source$.pipe(publishReplay(1)) as ConnectableObservable<T>
    connectable$.connect()
    return connectable$
  }
}
