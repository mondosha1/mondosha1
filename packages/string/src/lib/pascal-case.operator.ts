import { of } from '@mondosha1/core'
import { camelCase, upperFirst } from 'lodash/fp'

export function pascalCase(str: string): string {
  return of(str).pipe(camelCase, upperFirst)
}
