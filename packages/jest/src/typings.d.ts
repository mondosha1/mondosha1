/* eslint-disable */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeActionObservable(obs: any): any
      toJsonEqual(obs: any): any
    }
  }
}

import 'jest-chain'
import 'jest-extended'
