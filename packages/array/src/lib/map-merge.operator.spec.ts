import { of } from '@mondosha1/core'
import { mapMerge } from './map-merge.operator'

describe('MapMerge', () => {
  it('should merge the entries of the 3 Maps', () => {
    const mergedMap = of(
      new Map<string, string>([
        ['Captain America', 'Steve Rogers'],
        ['Iron Man', 'Tony Stark']
      ])
    ).pipe(
      mapMerge(
        new Map<string, string>([
          ['Hawkeye', 'Clint Barton'],
          ['Black Widow', 'Natasha Romanoff']
        ]),
        new Map<string, string>([['Hulk', 'Bruce Banner']])
      )
    )
    expect(mergedMap)
      .toBeInstanceOf(Map)
      .toSatisfy(m => {
        expect(Array.from(m.entries())).toEqual([
          ['Captain America', 'Steve Rogers'],
          ['Iron Man', 'Tony Stark'],
          ['Hawkeye', 'Clint Barton'],
          ['Black Widow', 'Natasha Romanoff'],
          ['Hulk', 'Bruce Banner']
        ])
        return true
      })
  })
})
