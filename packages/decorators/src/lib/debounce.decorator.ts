import { isLeft } from '@mondosha1/either'
import { isPlainObject } from 'lodash/fp'

export function Debounce(options: number | IDebounceOptions) {
  return (target: any, propertyKey: string) => {
    // eslint-disable-next-line
    let timeoutID: any = null
    const originalFn = target[propertyKey]
    const callback: (thisArg: any, ...args: any[]) => void = (thisArg, argsArray) => {
      timeoutID = null
      originalFn.apply(thisArg, argsArray)
    }
    target[propertyKey] = function (...args) {
      if (timeoutID) {
        clearTimeout(timeoutID)
        timeoutID = null
      }

      const wait: number = isLeft<number, IDebounceOptions>(options, isPlainObject) ? options : options.wait
      timeoutID = setTimeout(callback, wait, this, args)
    }

    return target
  }
}

export interface IDebounceOptions {
  wait: number
}
