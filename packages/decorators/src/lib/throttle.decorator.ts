import { isRight } from '@mondosha1/either'
import { isPlainObject } from 'lodash/fp'

export function Throttle(options: number | IThrottleOptions) {
  return function (target: any, propertyKey: string) {
    // eslint-disable-next-line
    let timeoutID: any = null
    const originalFn = target[propertyKey]
    const callback = (thisArg, argsArray) => {
      timeoutID = null
      originalFn.apply(thisArg, argsArray)
    }
    target[propertyKey] = function (...args) {
      if (!timeoutID) {
        const wait: number = isRight<number, IThrottleOptions>(options, isPlainObject) ? options.wait : options
        timeoutID = setTimeout(callback, wait, this, args)
      }
    }

    return target
  }
}

export interface IThrottleOptions {
  wait: number
}