import { of } from '@mondosha1/core'
import { camelCase, isArray, isPlainObject, map, mapKeys, mapValues, snakeCase } from 'lodash/fp'

export function deepTransformKeysCase(caseTransformFn: (str: string) => string): (value: unknown) => unknown {
  return (value: unknown) =>
    isArray(value)
      ? of(value).pipe(map(deepTransformKeysCase(caseTransformFn)))
      : isPlainObject(value)
      ? of(value as {}).pipe(mapKeys(caseTransformFn), mapValues(deepTransformKeysCase(caseTransformFn)))
      : value
}

export function deepCamelCaseKeys(value: unknown): unknown {
  return of(value).pipe(deepTransformKeysCase(camelCase))
}

export function deepSnakeCaseKeys(value: unknown): unknown {
  return of(value).pipe(deepTransformKeysCase(snakeCase))
}
