import { Observable, Subject } from 'rxjs'
import { map } from 'rxjs/operators'

import { allowLatecomers } from './allow-latecomers'

describe('Allow Latecomers', () => {
  let subject$: Subject<string>
  let obs$: Observable<string>

  beforeEach(() => {
    subject$ = new Subject<string>()
    obs$ = subject$.asObservable().pipe(allowLatecomers())
  })

  it('should notify the subscriber even if he subscribed before the emit', () => {
    const callback = jest.fn()
    obs$.subscribe(callback)
    subject$.next('helloworld')
    expect(callback).toHaveBeenCalledWith('helloworld')
  })

  it('should notify the subscriber even if he subscribed after the emit', () => {
    const callback = jest.fn()
    subject$.next('helloworld')
    obs$.subscribe(callback)
    expect(callback).toHaveBeenCalledWith('helloworld')
  })

  it('should notify the subscriber even if he subscribed after the completion', () => {
    const callback = jest.fn()
    subject$.next('helloworld')
    subject$.complete()

    obs$.subscribe(callback)
    expect(callback).toHaveBeenCalledWith('helloworld')
  })

  it('should share the same observable and call only once ancestor operators even if several subscriptions', () => {
    const callback = jest.fn()
    const upperCase = jest.fn((str: string) => str.toUpperCase())
    obs$ = subject$.asObservable().pipe(map(upperCase), allowLatecomers())

    subject$.next('helloworld')

    obs$.subscribe(callback)
    obs$.subscribe(callback)
    obs$.subscribe(callback)

    expect(callback).toHaveBeenCalledWith('HELLOWORLD')
    expect(callback).toHaveBeenCalledTimes(3)

    expect(upperCase).toHaveBeenCalledTimes(1)
  })
})
