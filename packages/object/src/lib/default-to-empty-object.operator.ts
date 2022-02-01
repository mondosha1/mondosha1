import { Nullable } from '@mondosha1/nullable'
import { isEmpty, isNil, isPlainObject } from 'lodash/fp'
import { emptyObject } from './empty-object.operator'

export const defaultToEmptyObject = <T>(value: Nullable<T>): T =>
  isNil(value) || (isPlainObject(value) && isEmpty(value)) ? emptyObject<T>() : value
