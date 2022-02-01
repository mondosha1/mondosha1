import { Observable, Subject } from 'rxjs'
import { filterFrom } from './filter-from'

describe('Filter From', () => {
  describe('Single observable', () => {
    let front$: Subject<string>
    let message$: Subject<string>
    let obs$: Observable<string>
    beforeEach(() => {
      front$ = new Subject<string>()
      message$ = new Subject<string>()
      obs$ = message$.asObservable().pipe(filterFrom(front$, (front: string) => front === 'YGA'))
    })

    it('should notify subscriber filtered by the latest value', () => {
      const result = jest.fn()
      obs$.subscribe(result)
      front$.next('YGA')
      message$.next('Message for YGA')

      expect(result).toHaveBeenCalledTimes(1)
      expect(result).toHaveBeenCalledWith('Message for YGA')
    })

    it('should not notify subscriber if filtered value is not expected', () => {
      const result = jest.fn()
      obs$.subscribe(result)
      front$.next('JVI')
      message$.next('Message for YGA')
      expect(result).not.toHaveBeenCalled()
    })

    it('should notify subscriber filtered by the latest value (with 2 values emitted)', () => {
      const result = jest.fn()
      obs$.subscribe(result)
      front$.next('JVI')
      front$.next('YGA')
      message$.next('Message for YGA')

      expect(result).toHaveBeenCalledTimes(1)
      expect(result).toHaveBeenCalledWith('Message for YGA')
    })

    it('should not notify subscriber if filtered value is not expected (with 2 values emitted)', () => {
      const result = jest.fn()
      obs$.subscribe(result)
      front$.next('YGA')
      front$.next('JVI')
      message$.next('Message for YGA')
      expect(result).not.toHaveBeenCalled()
    })
  })

  describe('Several observable', () => {
    let front1$: Subject<string>
    let front2$: Subject<string>
    let front3$: Subject<string>
    let message$: Subject<string>
    let obs$: Observable<string>
    beforeEach(() => {
      front1$ = new Subject<string>()
      front2$ = new Subject<string>()
      front3$ = new Subject<string>()
      message$ = new Subject<string>()
      obs$ = message$
        .asObservable()
        .pipe(
          filterFrom(
            [front1$, front2$, front3$],
            ([front1, front2, front3]: [string, string, string]) =>
              front1 === 'YGA' && front2 === 'ALA' && front3 === 'JVI'
          )
        )
    })

    it('should notify subscriber filtered by the latest value', () => {
      const result = jest.fn()
      obs$.subscribe(result)
      front1$.next('YGA')
      front2$.next('ALA')
      front3$.next('JVI')
      message$.next('Message for YGA')

      expect(result).toHaveBeenCalledTimes(1)
      expect(result).toHaveBeenCalledWith('Message for YGA')
    })

    it('should not notify subscriber if filtered value is not expected', () => {
      const result = jest.fn()
      obs$.subscribe(result)
      front1$.next('ALA')
      front2$.next('YGA')
      front3$.next('JVI')
      message$.next('Message for YGA')
      expect(result).not.toHaveBeenCalled()
    })

    it('should notify subscriber filtered by the latest value (with 2 values emitted)', () => {
      const result = jest.fn()
      obs$.subscribe(result)
      front1$.next('ALA')
      front1$.next('YGA')
      front2$.next('YGA')
      front2$.next('JVI')
      front2$.next('ALA')
      front3$.next('JVI')
      message$.next('Message for YGA')

      expect(result).toHaveBeenCalledTimes(1)
      expect(result).toHaveBeenCalledWith('Message for YGA')
    })

    it('should not notify subscriber if missing emit from one of the observables', () => {
      const result = jest.fn()
      obs$.subscribe(result)
      front1$.next('YGA')
      front2$.next('ALA')
      message$.next('Message for YGA')
      expect(result).not.toHaveBeenCalled()
    })
  })
})
