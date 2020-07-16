import { isEqual } from 'lodash/fp'

function toJSON(obj: {}): {} {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    return null
  }
}

function jsonEqual(other: any, value: any): boolean {
  return isEqual(toJSON(value), toJSON(other))
}

export function toJsonEqual(received: any, expected: any) {
  return { pass: jsonEqual(expected, received), message: () => `Serialized values aren't equal` }
}
