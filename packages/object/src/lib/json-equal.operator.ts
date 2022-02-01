import { of } from '@mondosha1/core'
import { isEqual, size } from 'lodash/fp'
import { toJSON } from './to-json.operator'

function compare(other: any): (value: any) => boolean {
  return value => of(toJSON(value)).pipe(isEqual(toJSON(other)))
}

export function jsonEqual(value: any, other: any): boolean
export function jsonEqual(other: any): (value: any) => boolean
export function jsonEqual(...args: any[]): boolean | ((value: any) => boolean) {
  return size(args) === 2 ? compare(args[1])(args[0]) : compare(args[0])
}
