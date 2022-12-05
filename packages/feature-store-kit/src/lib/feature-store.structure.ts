import { defaultToEmptyArray, difference, emptyArray, Many, prepend } from '@mondosha1/array'
import { negate, parseBool } from '@mondosha1/boolean'
import { IMap, of } from '@mondosha1/core'
import { defaultToNull, foldOn, foldRightOn } from '@mondosha1/nullable'
import { isNumeric } from '@mondosha1/number'
import {
  emptyObject,
  fromString,
  get,
  jsonEqual,
  mapValuesWithKey,
  reduceObject,
  toJSON,
  toString
} from '@mondosha1/object'
import {
  compact,
  every,
  extend,
  first,
  getOr,
  includes,
  isBoolean,
  isEmpty,
  isFinite,
  isNil,
  isObject,
  isPlainObject,
  isString,
  join,
  keys,
  map,
  mapValues,
  omitBy,
  reduce,
  reject,
  replace,
  size,
  split,
  thru,
  toPairs,
  toPath,
  unzip,
  zipObjectDeep
} from 'lodash/fp'
import { EXPR_EVAL_EXPRESSION } from './feature-store.formula'
import { FeatureStoreState } from './feature-store.state'

export type Structure<State extends {}> = {
  [name in keyof State]?: FieldGroup<State> | Field<State> | SimpleFieldType
}

export interface FieldGroup<T> {
  [name: string]: FieldGroup<T> | Field<T> | SimpleFieldType
}

export enum ValidatorName {
  Email = 'Email',
  Integer = 'Integer',
  Max = 'Max',
  MaxLength = 'MaxLength',
  Min = 'Min',
  MinLength = 'MinLength',
  Number = 'Number', // eslint-disable-line id-blacklist,id-denylist
  Required = 'Required',
  Url = 'Url'
}

export interface ValidatorParams {
  [ValidatorName.Max]: { max: number }
  [ValidatorName.MaxLength]: { maxLength: number }
  [ValidatorName.Min]: { min: number }
  [ValidatorName.MinLength]: { minLength: number }
}

export interface ValidatorNameWithParams<V extends ValidatorName> {
  condition?: EXPR_EVAL_EXPRESSION
  name: V
  params?: V extends keyof ValidatorParams ? ValidatorParams[V] : never
}

export type DefaultValidator<V extends ValidatorName> = V | ValidatorNameWithParams<V>

export interface CustomValidator {
  formula: EXPR_EVAL_EXPRESSION
  message: string
}

export interface Field<T> {
  disabled?: boolean | EXPR_EVAL_EXPRESSION
  items?: FieldGroup<T> | SimpleFieldType
  type: SimpleFieldTypeOrArray
  validators?: Many<DefaultValidator<ValidatorName> | CustomValidator>
}

export type SimpleFieldType = 'string' | 'number' | 'boolean' | 'object' | 'date'
export type SimpleFieldTypeOrArray = SimpleFieldType | 'array'
export type ArrayFieldType = 'string[]' | 'number[]' | 'boolean[]' | 'object[]'
export type FieldType = SimpleFieldType | ArrayFieldType
export type ArrayField<T> = Field<T> & { type: 'array' }
export type ComplexArrayField<T> = ArrayField<T> & { items: FieldGroup<T> }
const defaultFieldType: FieldType = 'string'

export class FeatureStoreStructure {
  public static differsFromCurrentOrReferenceValue<State extends {}, WithMetaState = FeatureStoreState<State>>(
    referenceState: Partial<State>,
    currentState: Partial<State>,
    key: keyof State,
    value: any
  ): boolean {
    return (
      of(currentState).pipe(get(key), jsonEqual(value), negate) ||
      of(referenceState).pipe(get(key), jsonEqual(value), negate)
    )
  }

  public static extractType<State extends {}, WithMetaState = FeatureStoreState<State>>(
    structure: Structure<WithMetaState>,
    path: (string | number)[]
  ): FieldType {
    const pieceOfStructure = this.getAtStatePath(structure, path) as Field<State> | FieldType
    return this.isField(pieceOfStructure) ? this.extractTypeFromField(pieceOfStructure) : pieceOfStructure
  }

  public static formatParamValue(value: any, type: FieldType): string {
    switch (type) {
      case 'date':
      case 'string':
        return of(value).pipe(foldRightOn(isString, ''))
      case 'number':
        return of(value).pipe(foldOn(isFinite, String, ''))
      case 'boolean':
        return of(value).pipe(foldOn(isBoolean, String, ''))
      case 'object':
        return of(value).pipe(foldOn(isObject, toString, ''))
      case 'string[]':
      case 'number[]':
      case 'boolean[]':
      case 'object[]':
        const valueType = this.getItemType(type)
        return of(value).pipe(
          map(pieceOfValue => this.formatParamValue(pieceOfValue, valueType)),
          compact,
          join(',')
        )
    }
  }

  public static formatParams<State extends {}, WithMetaState = FeatureStoreState<State>>(
    params: Partial<State>,
    structure: Structure<WithMetaState>,
    parentPath?: (string | number)[]
  ): IMap<string> {
    return of(params).pipe(
      reduceObject((res, curr, key) => {
        const path = of(key).pipe(prepend(parentPath), reject(isNil))
        const stringPath = of(path).pipe(join('.'))
        const type = this.extractType(structure, path)
        return this.isFieldType(type)
          ? of(this.formatParamValue(curr, type)).pipe(
              thru(paramValue => ({ [stringPath]: paramValue })),
              extend(res)
            )
          : of(this.formatParams(curr, structure, path)).pipe(extend(res))
      }, {})
    )
  }

  public static getAtStatePath<State extends {}, WithMetaState = FeatureStoreState<State>>(
    structure: Structure<WithMetaState>,
    path: (string | number)[]
  ): Structure<WithMetaState> | FieldGroup<State> | Field<State> | FieldType {
    return of(path).pipe(
      reduce(
        ({ struct, isArray }, currentPath: string | number) => {
          // Omit the current path if it corresponds to a complex array index
          if (isArray) {
            return { struct, isArray: false }
          }

          const fieldGroupOrFieldOrFieldType: FieldGroup<State> | Field<State> | FieldType = of(struct).pipe(
            get(currentPath as keyof Structure<WithMetaState>)
          )
          if (this.isComplexArrayField(fieldGroupOrFieldOrFieldType)) {
            return { struct: of(fieldGroupOrFieldOrFieldType).pipe(get('items')), isArray: true }
          } else {
            return { struct: fieldGroupOrFieldOrFieldType, isArray: false }
          }
        },
        { struct: structure, isArray: false }
      ),
      thru(({ struct }) => struct)
    )
  }

  public static isArrayFieldType(fieldType: ArrayFieldType | any): fieldType is ArrayFieldType {
    return of(['string[]', 'number[]', 'boolean[]', 'object[]']).pipe(includes(fieldType))
  }

  public static isComplexArrayField<State extends {}>(field: Field<State> | any): field is ComplexArrayField<State> {
    if (this.isField(field)) {
      const type = of(field).pipe(getOr(defaultFieldType, 'type'))
      const items = of(field).pipe(get('items'))
      return type === 'array' && !this.isSimpleFieldType(items)
    } else {
      return false
    }
  }

  public static isCustomValidator<V extends ValidatorName>(
    validator: DefaultValidator<V> | CustomValidator
  ): validator is CustomValidator {
    return isPlainObject(validator) && of(validator).pipe(keys, difference(['formula', 'message']), isEmpty)
  }

  public static isDefaultValidator<V extends ValidatorName>(
    validator: DefaultValidator<V> | CustomValidator
  ): validator is DefaultValidator<V> {
    return (
      isString(validator) ||
      (isPlainObject(validator) && of(validator).pipe(keys, difference(['name', 'params', 'condition']), isEmpty))
    )
  }

  public static isField<State extends {}>(field: Field<State> | any): field is Field<State> {
    if (isPlainObject(field)) {
      const structKeys = keys(field)
      const possibleKeys: (keyof Field<State>)[] = ['type', 'items', 'validators', 'disabled']
      const structLength = size(structKeys)

      if (structLength > 0) {
        if (structLength === 1) {
          return first(structKeys) === 'type'
        } else {
          return of(structKeys).pipe(includes('type')) && of(structKeys).pipe(difference(possibleKeys), isEmpty)
        }
      } else {
        return false
      }
    } else {
      return false
    }
  }

  public static isFieldGroup<State extends {}>(fieldGroup: FieldGroup<State> | any): fieldGroup is FieldGroup<State> {
    return (
      isPlainObject(fieldGroup) &&
      !isEmpty(fieldGroup) &&
      !this.isField(fieldGroup) &&
      of(fieldGroup).pipe(every(value => this.isFieldType(value) || this.isField(value) || this.isFieldGroup(value)))
    )
  }

  public static isFieldType(fieldType: FieldType | any): fieldType is FieldType {
    return this.isSimpleFieldType(fieldType) || this.isArrayFieldType(fieldType)
  }

  public static isSimpleFieldType(fieldType: SimpleFieldType | any): fieldType is SimpleFieldType {
    return of(['string', 'number', 'boolean', 'object', 'date']).pipe(includes(fieldType))
  }

  public static isStructure<State extends {}, WithMetaState = FeatureStoreState<State>>(
    structure: Structure<WithMetaState> | any
  ): structure is Structure<WithMetaState> {
    return (
      isPlainObject(structure) &&
      !isEmpty(structure) &&
      of(structure).pipe(every(value => this.isFieldGroup(value) || this.isFieldType(value) || this.isField(value)))
    )
  }

  public static parseParams<State extends {}, WithMetaState = FeatureStoreState<State>>(
    params: IMap<string>,
    structure: Structure<WithMetaState>
  ): Partial<State> {
    return of(params).pipe(
      mapValuesWithKey((value, key) => ({ value, type: this.extractType(structure, toPath(key)) })),
      omitBy(({ type }) => isNil(type)),
      mapValues(({ value, type }) => {
        if (value === 'null') {
          return null
        } else if (value === 'undefined') {
          return undefined
        } else {
          switch (type) {
            case 'string':
              return value
            case 'number':
              return of(value).pipe(parseFloat, defaultToNull)
            case 'boolean':
              return of(value).pipe(parseBool, defaultToNull)
            case 'date':
              return isNumeric(value) ? parseFloat(value) : value
            case 'object':
              return fromString(value)
            case 'string[]':
              return this.parseArrayParam(value)
            case 'number[]':
              return this.parseArrayParam(value, parseFloat)
            case 'boolean[]':
              return this.parseArrayParam(value, parseBool)
            case 'object[]':
              return this.parseArrayParam(value, toJSON)
          }
        }
      }),
      toPairs,
      unzip,
      thru((pairs: [string[], any[]]) => (isEmpty(pairs) ? emptyObject() : zipObjectDeep(...pairs)))
    )
  }

  private static extractTypeFromField<State extends {}>(field: Field<State>): FieldType {
    const type = of(field).pipe(getOr(defaultFieldType, 'type'))
    if (type === 'array') {
      const items = of(field).pipe(get('items'))
      return `${items}[]` as ArrayFieldType
    } else {
      return type
    }
  }

  private static getItemType(arrType: ArrayFieldType): SimpleFieldType {
    return of(arrType).pipe(replace(/\[\]+$/, '')) as SimpleFieldType
  }

  private static parseArrayParam<V, R>(value: V[], predicate?: (val: any) => R): (R | string)[] {
    return isEmpty(value)
      ? emptyArray<R>()
      : of(value).pipe(
          String,
          split(','),
          map(pieceOfValue => (predicate ? predicate(pieceOfValue) : pieceOfValue)),
          defaultToEmptyArray
        )
  }
}
