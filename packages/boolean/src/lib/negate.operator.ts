import { isBoolean, isFunction, negate as _negate } from 'lodash/fp'

export const negate = <T>(predicate: T): T extends (...args: any[]) => any ? (...args: any[]) => boolean : boolean =>
  // Cast return as any because of https://github.com/microsoft/TypeScript/issues/33912
  (isFunction(predicate) ? _negate(predicate) : isBoolean(predicate) ? !predicate : !Boolean(predicate)) as any // eslint-disable-line no-extra-boolean-cast
