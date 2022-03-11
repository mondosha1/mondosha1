import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn, Validators } from '@angular/forms'
import { Many } from '@mondosha1/array'
import { IMap, of } from '@mondosha1/core'
import { Lazy } from '@mondosha1/decorators'
import { isLeft } from '@mondosha1/either'
import { defaultToNull } from '@mondosha1/nullable'
import { get, toString } from '@mondosha1/object'
import { wrapIntoObservable } from '@mondosha1/observable'
import { format, startOfDay } from 'date-fns/fp'
import { Parser } from 'expr-eval'
import {
  constant,
  defaults,
  every,
  includes,
  isArray,
  isBoolean,
  isEmpty,
  isFunction,
  isInteger as _isInteger,
  isNil,
  isNull,
  isNumber as _isNumber,
  isString,
  lte,
  map as _map,
  max as _max,
  min,
  negate,
  reduce,
  size,
  template,
  thru
} from 'lodash/fp'
import { forkJoin, Observable } from 'rxjs'
import { first, map } from 'rxjs/operators'
import { HTTP_URL_PATTERN, isInteger, isNumber, isUrl } from './feature-store.custom-validators'
import {
  CustomValidator,
  DefaultValidator,
  FeatureStoreStructure,
  ValidatorName,
  ValidatorNameWithParams
} from './feature-store.structure'

/**
 * Feature store validators are serializeable and can be a string (a string enum in fact) or a formula.
 * - String validators:
 *   • Are mapped to standard Angular ValidatorFns like "required", "minLength" or "isUrl"
 *   • Can contain additional parameters for some of validators
 * - Formula validators:
 *   • Contain an expr-eval compliant expression which must evaluate to a boolean value
 *   • Are given the feature store state variables of the expression
 *   • Are allowed some additional helpers in the expression (eg: ISEMPTY, REGEX, NOT, etc.)
 *   • Contain an error message (allowing state as interpolation variables) to display if the formula is evaluated to true
 *
 * Formulas examples:
 *   1. 'periodicity == "DayOfMonth" && ISEMPTY(dayOfMonth)'
 *   2. 'AND(periodicity == "DayOfMonth", ISEMPTY(dayOfMonth))' // equivalent to the previous one
 *   3. 'creativeType != "File" && (ISEMPTY(sourceUrl) || LENGTH(sourceUrl) > 2083)'
 *   4. AND(
 *        NOT(creativeType == "File"),
 *        OR(
 *          ISEMPTY(sourceUrl),
 *          LENGTH(sourceUrl) > 2083
 *        )
 *      ) // equivalent to the previous one
 */
export class FeatureStoreValidators {
  private static readonly customFunctions = {
    ISEMPTY: value => (_isNumber(value) ? value === 0 : isEmpty(value)),
    ISINTEGER: _isInteger,
    ISNUMBER: isFinite,
    ISURL: value => new RegExp(HTTP_URL_PATTERN).test(value),
    EVERY: (arr, ...fns) => of(arr).pipe(every(value => of(fns).pipe(every(fn => fn(value))))),
    GET: key => value => of(value).pipe(get(key)),
    LTE: max => value => of(max).pipe(lte(value)),
    INARRAY: array => value => of(array).pipe(includes(value)),
    MAP: (value, fn) => of(value).pipe(_map(fn)),
    REGEX: (value, pattern) => new RegExp(pattern).test(value),
    // Contants
    TODAY: constant(of(new Date()).pipe(startOfDay, format('T'))),
    NOW: constant(of(new Date()).pipe(format('T'))),
    // Helpers
    LENGTH: size,
    MAX: (...values) => _max(values),
    MIN: (...values) => min(values),
    // Logical function (to write only Formulas if the user want it)
    NOT: value => (isFunction(value) ? negate(value) : !value),
    OR: (...vals) => of(vals).pipe(reduce((res, val) => res || val, false)),
    AND: (...vals) => of(vals).pipe(reduce((res, val) => res && val, true)),
    IF: (cond, then, other) => (cond ? then : other)
  }

  @Lazy()
  private static get parser(): Parser {
    const parser = new Parser({ operators: { logical: true } })
    Object.assign((parser as any).functions, FeatureStoreValidators.customFunctions)
    return parser
  }

  public static featureStoreValidator<State extends {}>(
    validatorOrValidators: Many<DefaultValidator<ValidatorName> | CustomValidator>,
    state$: Observable<State | null>,
    pathInDefaultState: string
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const stateWithUpdatedValue$ = state$.pipe(
        map((state: State) =>
          of(pathInDefaultState).pipe(
            thru(path => ({ [path]: control.value })),
            defaults(state)
          )
        )
      )
      const validatedValues: Observable<ValidationErrors | null>[] = of(validatorOrValidators).pipe(
        thru(validators => (isArray(validators) ? validators : [validators])),
        _map(<V extends ValidatorName>(validator: DefaultValidator<V> | CustomValidator) =>
          this.getAngularValidator<State, V>(validator, stateWithUpdatedValue$)
        ),
        _map((validator: ValidatorFn | AsyncValidatorFn) => validator(control)),
        _map(wrapIntoObservable)
      )
      return forkJoin(...validatedValues).pipe(
        map(values =>
          of(values).pipe(
            reduce(
              (res: ValidationErrors | null, validatedValue: ValidationErrors | null) =>
                of(res).pipe(defaults(validatedValue)),
              {}
            ),
            thru(res => (isEmpty(res) ? null : res))
          )
        )
      )
    }
  }

  public static fieldFormulaValidator<State extends {}>(
    validator: CustomValidator,
    state$: Observable<State | null>
  ): AsyncValidatorFn {
    return (): Observable<ValidationErrors | null> =>
      state$.pipe(
        first(),
        map((state: State | null) => {
          const hasError = this.evaluateExpression(validator.formula, state as IMap<any>)
          if (hasError) {
            const errorMessage = template(validator.message)(state)
            return { featureStoreFormula: { errorMessage } }
          } else {
            return null
          }
        })
      )
  }

  private static checkValidatorParam(params: IMap<any> | null, path: string): any | never {
    const param = of(params).pipe(get(path), defaultToNull)

    if (isNull(param)) {
      throw new Error(`Missing mandatory validator param "${path}"`)
    }

    return param
  }

  private static defaultToAngularValidator<State extends {}, V extends ValidatorName>(
    validator: V | ValidatorNameWithParams<V>,
    state$: Observable<State | null>
  ): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> =>
      state$.pipe(
        first(),
        map((state: State | null) => {
          const {
            name,
            params = null,
            condition = null
          } = isLeft<V, ValidatorNameWithParams<V>>(validator, isString)
            ? { name: validator }
            : (validator as ValidatorNameWithParams<V>)

          const evaluateValidator = isNil(condition) || this.evaluateExpression(condition, state as IMap<any>)
          if (!evaluateValidator) {
            return constant(null)
          }

          const validatorFn = this.getAngularValidatorByName(name, params)
          return validatorFn(control)
        })
      )
  }

  public static evaluateExpression(expr: string, state: IMap<any>): boolean | never {
    const expression = this.parser.parse(expr)
    const hasError = expression.evaluate(state as IMap<any>) as any
    if (!isBoolean(hasError)) {
      throw new Error('Feature store expressions should return a boolean value')
    }
    return hasError
  }

  private static getAngularValidator<State extends {}, V extends ValidatorName>(
    validator: DefaultValidator<V> | CustomValidator,
    state$: Observable<State>
  ): ValidatorFn | AsyncValidatorFn | never {
    if (FeatureStoreStructure.isDefaultValidator<V>(validator)) {
      return this.defaultToAngularValidator(validator, state$)
    } else if (FeatureStoreStructure.isCustomValidator<V>(validator)) {
      return this.fieldFormulaValidator(validator, state$)
    } else {
      throw new Error(`Invalid feature store validation definition for ${toString(validator)}`)
    }
  }

  private static getAngularValidatorByName<V extends ValidatorName>(
    name: V,
    params: ValidatorNameWithParams<V>['params']
  ): ValidatorFn | never {
    switch (name) {
      case ValidatorName.Email:
        return Validators.email
      case ValidatorName.Integer:
        return isInteger()
      case ValidatorName.Max:
        return Validators.max(this.checkValidatorParam(params, 'max'))
      case ValidatorName.MaxLength:
        return Validators.maxLength(this.checkValidatorParam(params, 'maxLength'))
      case ValidatorName.Min:
        return Validators.min(this.checkValidatorParam(params, 'min'))
      case ValidatorName.MinLength:
        return Validators.minLength(this.checkValidatorParam(params, 'minLength'))
      case ValidatorName.Number:
        return isNumber()
      case ValidatorName.Required:
        return Validators.required
      case ValidatorName.Url:
        return isUrl()
      default:
        throw new Error(`Unknown default validator "${name}"`)
    }
  }
}
