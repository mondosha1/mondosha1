/* tslint:disable */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeActionObservable(obs: any): any
    }
  }
}

import 'jest-chain'
import 'jest-extended'
