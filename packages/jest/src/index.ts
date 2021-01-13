/* eslint-disable import/order */
import 'jest-chain'
import 'jest-extended'
import { toBeActionObservable } from './action-observable.matcher'
import { toJsonEqual } from './json-equal.matcher'

expect.extend({ toBeActionObservable, toJsonEqual })
