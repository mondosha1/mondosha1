export function repeat<T>(toRepeat: number): (items: T) => T[] {
  return items => Array(toRepeat).fill(items)
}
