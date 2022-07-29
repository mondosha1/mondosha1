/* eslint-disable import/order */
import 'jest-chain'
import 'jest-extended'
import { toBeActionObservable } from './action-observable.matcher'
import { toJsonEqual } from './json-equal.matcher'
import { toMatchPath } from './path-equal.matcher'

expect.extend({ toBeActionObservable, toJsonEqual, toMatchPath })

export { actionObservable } from './action-observable.matcher'
export { jsonEqual } from './json-equal.matcher'
export { pathEqual } from './path-equal.matcher'
