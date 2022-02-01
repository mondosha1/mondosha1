// source https://angular.schule/blog/2018-02-rxjs-own-log-operator
import { Subject } from 'rxjs'

import { log } from './log.operator'

const konsole = console

describe('Log operator', () => {
  let subject$: Subject<string>

  beforeEach(() => {
    jest.spyOn(konsole, 'log')
    subject$ = new Subject<string>()
  })

  it('should call console.log with custom message for each emitted value', () => {
    subject$.pipe(log('message')).subscribe()

    subject$.next('a')
    expect(konsole.log).toHaveBeenCalledWith('message', 'a')

    subject$.next('b')
    subject$.next('c')

    expect(konsole.log).toHaveBeenCalledTimes(3)
  })

  it('should leave message blank if none given', () => {
    subject$.pipe(log()).subscribe()

    subject$.next('a')
    expect(konsole.log).toHaveBeenCalledWith('a')
  })

  it('should leave emitted values unchanged', () => {
    let result
    subject$.pipe(log()).subscribe(e => (result = e))

    subject$.next('a')
    expect(result).toEqual('a')

    subject$.next('b')
    expect(result).toEqual('b')
  })
})
