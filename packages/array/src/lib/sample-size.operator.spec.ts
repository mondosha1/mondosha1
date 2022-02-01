import { of } from '@mondosha1/core'
import { sampleSize } from './sample-size.operator'

describe('SampleSize', () => {
  it('should get a random sample from the array', () => {
    const sample = of([1, 2, 3]).pipe(sampleSize(1, true))
    expect(sample).toBeArrayOfSize(1).toIncludeAnyMembers([1, 2, 3])
  })

  it('should get a specific sample from the array', () => {
    let sample = of([1, 2, 3]).pipe(sampleSize(1))
    expect(sample).toBeArrayOfSize(1).toEqual([1])

    sample = of([1, 2, 3, 4, 5, 6]).pipe(sampleSize(3))
    expect(sample).toBeArrayOfSize(3).toEqual([1, 3, 5])
  })
})
