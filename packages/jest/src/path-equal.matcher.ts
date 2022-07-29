import * as path from 'path'
import { isEqual } from 'lodash/fp'
import { MatcherResult } from './matcher-result'

export function pathEqual(expected: any): (received: any) => boolean {
  return (received: any) => isEqual(path.normalize(expected), path.normalize(received))
}

export function toMatchPath(received: any, expected: any): MatcherResult {
  return {
    pass: pathEqual(expected)(received),
    message: () => `Path did not match`
  }
}
