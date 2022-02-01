// Copied from https://github.com/Alorel/typescript-lazy-get-decorator
export function Lazy(setProto?: boolean, makeNonConfigurable?: boolean): MethodDecorator {
  return (target: any, key: PropertyKey, descriptor: PropertyDescriptor): void => {
    const originalMethod = descriptor.get

    if (!originalMethod) {
      throw new Error('@Lazy can only decorate getters')
    } else if (!descriptor.configurable) {
      throw new Error('@Lazy target must be configurable')
    } else {
      descriptor.get = function (...args) {
        // eslint-disable-next-line prefer-rest-params
        const value = originalMethod.apply(this, args)

        const newDescriptor: PropertyDescriptor = {
          configurable: !makeNonConfigurable,
          enumerable: descriptor.enumerable,
          value
        }

        const isStatic = Object.getPrototypeOf(target) === Function.prototype

        if (isStatic || setProto) {
          Object.defineProperty(target, key, newDescriptor)
        }

        if (!isStatic) {
          Object.defineProperty(this, key, newDescriptor)
        }

        return value
      }
    }
  }
}
