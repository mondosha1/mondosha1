import { Observable, Subject } from 'rxjs'
import { toLatestFrom } from './to-latest-from'

describe('To latest From', () => {
  let junkFood$: Subject<string>
  let vegetables$: Subject<string>
  let diet$: Observable<string>

  beforeEach(() => {
    junkFood$ = new Subject<string>()
    vegetables$ = new Subject<string>()
    diet$ = junkFood$.asObservable().pipe(toLatestFrom(vegetables$))
  })

  it('should notify subscriber with the latest value from the other observable', () => {
    const whatIAte = jest.fn()
    diet$.subscribe(whatIAte)
    vegetables$.next('🍆')
    junkFood$.next('🍔')

    expect(whatIAte).toHaveBeenCalledTimes(1)
    expect(whatIAte).toHaveBeenCalledWith('🍆')
  })
})
