/* tslint:disable:ordered-imports */
import 'jest-chain'
import 'jest-extended'
import { toBeActionObservable } from './action-observable.matcher'

expect.extend({ toBeActionObservable })
