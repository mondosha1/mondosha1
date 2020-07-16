/* tslint:disable:ordered-imports */
import 'jest-chain'
import 'jest-extended'
import { toBeActionObservable } from './action-observable.matcher'
import { toJsonEqual } from './json-equal.matcher'

expect.extend({ toBeActionObservable, toJsonEqual })
