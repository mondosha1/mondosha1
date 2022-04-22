import { isEqual } from 'lodash/fp'

function toJSON(obj: {}): {} | null {
  try {
    return JSON.parse(JSON.stringify(obj))
  } catch {
    return null
  }
}

export function jsonEqual(expected: any): (received: any) => boolean {
  return (received: any) => isEqual(toJSON(expected), toJSON(received))
}

export function toJsonEqual(received: any, expected: any): { pass: boolean; message: () => string } {
  return { pass: jsonEqual(expected)(received), message: () => `Serialized values aren't equal` }
}
