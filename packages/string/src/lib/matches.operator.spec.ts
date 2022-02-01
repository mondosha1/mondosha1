import { of } from '../../../util-core/src/lib'
import { matches } from './matches.operator'

describe('matches', () => {
  it('should apply the match function on a string', () => {
    expect(of('helloworld').pipe(matches(/^hello/))).not.toBeNull()
    expect(of('helloworld').pipe(matches(/doesnotmatch/))).toBeNull()
  })

  it('should return null if the given parameter is not a string', () => {
    expect(of(null as unknown as string).pipe(matches(/^hello/))).toBeNull()
  })
})
