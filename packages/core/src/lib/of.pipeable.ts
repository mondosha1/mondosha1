import { Pipeable } from './pipeable.class'

export function of<T>(val: T): Pipeable<T> {
  return new Pipeable<T>(val)
}
