import { cloneDeep, isArray, mergeAllWith } from 'lodash/fp'

export function extendsDeep<T>(...sources): T {
  return mergeAllWith((src, dest): any => {
    if (isArray(dest)) {
      return cloneDeep(dest)
    }
  }, sources)
}
