/* eslint-disable rxjs/no-internal */
import { Scheduler } from 'jest-marbles'
import { equals, mapValues, omit } from 'lodash/fp'
import { Notification, Observable } from 'rxjs'
import { TestMessage } from 'rxjs/internal/testing/TestMessage'
import { TestScheduler } from 'rxjs/testing'

export function actionObservable<T>(expected$) {
  return received$ => {
    const results: TestMessage[] = []
    const scheduler = Scheduler.get()

    scheduler.schedule(() => {
      received$.subscribe(
        (value: any) =>
          results.push({ frame: scheduler.frame, notification: Notification.createNext(omit('uuid')(value)) }),
        (err: any) => results.push({ frame: scheduler.frame, notification: Notification.createError(err) }),
        () => results.push({ frame: scheduler.frame, notification: Notification.createComplete() })
      )
    })
    scheduler.flush()

    const valuesWithoutUuid = mapValues(omit('uuid'))(expected$.values)
    const expected = TestScheduler.parseMarbles(expected$.marbles, valuesWithoutUuid, expected$.error, true)

    // @todo:: add a way to display debug
    //         Warning : JSON.stringify can clean keys with values undefined !
    return equals(expected)(results)
  }
}

export function toBeActionObservable<R, E>(
  received$: Observable<R>,
  expected$: Observable<E>
): { pass: boolean; message: () => string } {
  return { pass: actionObservable(expected$)(received$), message: () => `Action and resultAction aren't equals` }
}
