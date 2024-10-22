import { Injectable } from '@angular/core'
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormGroup } from '@angular/forms'
import { append, EMPTY_ARRAY, emptyArray, UnitOf, wrapIntoArray } from '@mondosha1/array'
import { negate } from '@mondosha1/boolean'
import { IMap, IMapK, of } from '@mondosha1/core'
import { Lazy } from '@mondosha1/decorators'
import { defaultToNull, fold, foldLeftOn, foldRight, Nullable } from '@mondosha1/nullable'
import { isNumeric } from '@mondosha1/number'
import {
  defaultToEmptyObject,
  diff,
  flatMapObject,
  get,
  mapObject,
  mapValuesWithKey,
  reduceObject
} from '@mondosha1/object'
import {
  compact,
  defaults,
  defaultTo,
  find,
  first as _first,
  flatten,
  forEach,
  forEachRight,
  getOr,
  has,
  identity,
  includes,
  isArray,
  isEmpty,
  isEqual,
  isNil,
  isNull,
  isString,
  join,
  keys,
  map as _map,
  pick,
  range,
  replace,
  size,
  some,
  split,
  tap as _tap,
  thru,
  uniq
} from 'lodash/fp'
import { Observable } from 'rxjs'
import {
  debounceTime,
  delay,
  distinctUntilChanged,
  filter,
  first,
  map,
  pairwise,
  startWith,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom
} from 'rxjs/operators'
import { F, O, S } from 'ts-toolbelt'
import { FeatureStoreFacade, FeatureStoreFacadeFactory } from './feature-store.facade'
import { EXPR_EVAL_EXPRESSION } from './feature-store.formula'
import { FeatureStoreFramework } from './feature-store.framework'
import { FeatureStoreModuleOptions, FeatureStoreState, ValidationStatus } from './feature-store.state'
import {
  FeatureStoreStructure,
  Field,
  FieldGroup,
  FieldType,
  SimpleFieldType,
  Structure
} from './feature-store.structure'
import { FeatureStoreValidators } from './feature-store.validators'

export enum FormUpdateStrategy {
  ToStore = 'ToStore',
  ToParams = 'ToParams'
}

export interface FeatureStoreFormConfig<State extends {}, RichState extends State> {
  debounce?: number
  richState$?: Observable<RichState>
  takeUntil$?: Observable<any>
  updateStrategy?: FormUpdateStrategy
}

export class FeatureStoreFormBuilder<State extends {}, RichState extends State = State> {
  public constructor(
    private readonly featureStoreOptions: FeatureStoreModuleOptions<State, RichState>,
    private readonly featureStoreFacade: FeatureStoreFacade<State, FeatureStoreState<State>>,
    private readonly fb: FormBuilder
  ) {}

  @Lazy()
  public static get indexKeys(): (`$index` | `$index_${number}`)[] {
    return of(11).pipe(
      range(0),
      _map(num => `$index${num > 0 ? `_${num}` : ''}`)
    ) as (`$index` | `$index_${number}`)[]
  }

  public static extendState<State extends {}>( // eslint-disable-line @typescript-eslint/no-shadow
    originalState: State,
    structure: Structure<FeatureStoreState<State>>
  ): (newState: Partial<State>) => State {
    return (newState: Partial<State>) =>
      of(structure).pipe(
        reduceObject((res: Partial<State>, structureAtPath: Structure<FeatureStoreState<State>>, path: keyof State) => {
          const inNewState = of(newState).pipe(has(path))
          const newValue = of(newState).pipe(get(path))
          const inOriginalValue = of(originalState).pipe(has(path))
          const originalValue = of(originalState).pipe(get(path))
          return !inNewState && !inOriginalValue
            ? res
            : of({
                [path]: FeatureStoreStructure.isFieldGroup(structureAtPath)
                  ? of(newValue).pipe(FeatureStoreFormBuilder.extendState<{}>(originalValue, structureAtPath))
                  : inNewState
                  ? newValue
                  : originalValue
              }).pipe(defaults(res))
        }, {})
      )
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  public static getStateDiff<State extends {}>(newState: State, oldState: State): Partial<State> {
    return of(newState).pipe(diff(oldState))
  }

  // eslint-disable-next-line @typescript-eslint/no-shadow
  public static isFieldUpdated<State extends {}>(stateDiff: Partial<State>, pathOrPaths: string | string[]): boolean {
    const paths = isArray(pathOrPaths) ? pathOrPaths : [pathOrPaths]
    return of(paths).pipe(some(path => of(stateDiff).pipe(has(path))))
  }

  public create(config?: FeatureStoreFormConfig<State, RichState>): FormGroup {
    const structureSubset = isEmpty(this.featureStoreOptions.structurePathsForForm)
      ? this.featureStoreOptions.structure
      : of(this.featureStoreOptions.structure).pipe(pick(this.featureStoreOptions.structurePathsForForm))
    const options = this.getOptions(config)
    const formGroup = this.createControl(structureSubset, null, options.richState$) as FormGroup
    this.bindToStore(formGroup, options, structureSubset, this.featureStoreOptions.formatter)
    return formGroup
  }

  public createArrayItem<Path extends string>(
    pathInInitialState: F.AutoPath<Required<State>, Path>,
    index: number = 0,
    richState$?: Observable<RichState>
  ): FormGroup | never {
    const structurePath = this.convertValuePathToStructurePath<Path>(pathInInitialState)
    const field = of(this.featureStoreOptions.structure).pipe(get<any, any>(structurePath))

    const type = of(field).pipe(get<any, any>('type'))
    if (type !== 'array') {
      throw new Error('Array item creation expects to give an array Field definition')
    }

    const items = of(field).pipe(get<any, any>('items'))
    if (FeatureStoreStructure.isSimpleFieldType(items)) {
      throw new Error('Array item creation expects to give a Field definition with field groups items')
    }

    const initialValue = this.getInitialValue<Path>(pathInInitialState)
    // Set an initial value only if there was a single initial value given to the initial state
    if (isArray(initialValue) && size(initialValue) === 1) {
      return this.createControl<any>(
        items,
        `${pathInInitialState}.0` as F.AutoPath<Required<State>, any>,
        of(richState$).pipe(foldRight(this.withIndex$(index)))
      ) as FormGroup
    } else {
      return this.createControl(items, null, of(richState$).pipe(foldRight(this.withIndex$(index)))) as FormGroup
    }
  }

  public createControl<Path extends string>(
    pieceOfStructure: Structure<FeatureStoreState<State>> | FieldGroup<State> | Field<State> | FieldType = this
      .featureStoreOptions.structure,
    pathInInitialState: Nullable<F.AutoPath<Required<State>, Path>> = null,
    richState$?: Observable<RichState>
  ): AbstractControl {
    if (FeatureStoreStructure.isSimpleFieldType(pieceOfStructure)) {
      const initialValue = this.getInitialValue<Path>(pathInInitialState)
      return this.fb.control(initialValue)
    } else if (FeatureStoreStructure.isField(pieceOfStructure)) {
      const type = of(pieceOfStructure).pipe(get('type'))
      const items = of(pieceOfStructure).pipe(get('items'))
      const asyncValidators = this.getAsyncValidators<Path>(pieceOfStructure, pathInInitialState, richState$)
      const initialValue = this.getInitialValue<Path>(pathInInitialState)
      if (type === 'array') {
        if (FeatureStoreStructure.isSimpleFieldType(items)) {
          return this.fb.control(initialValue, null, asyncValidators) // Array of primitive values
        } else {
          return of(initialValue).pipe(
            mapObject((item: any, index: number) =>
              this.createControl<any>(
                items,
                of<any>(pathInInitialState).pipe(fold(String(index), path => `${path}.${index}`)) as F.AutoPath<
                  Required<State>,
                  any
                >,
                of(richState$).pipe(foldRight(this.withIndex$(index)))
              )
            ),
            thru((controls: AbstractControl[]) => this.fb.array(controls, null, asyncValidators))
          )
        }
      } else {
        return this.fb.control(initialValue, null, asyncValidators) // Simple field
      }
    } else {
      return of(pieceOfStructure).pipe(
        mapValuesWithKey((groupOfFieldOrType, key: string) =>
          this.createControl<any>(
            groupOfFieldOrType,
            of<any>(pathInInitialState).pipe(fold(key, path => `${path}.${key}`)) as F.AutoPath<Required<State>, any>,
            richState$
          )
        ),
        thru((controls: IMap<AbstractControl>) => this.fb.group(controls))
      )
    }
  }

  public getFormArrayPaths<Path extends string>(
    pieceOfStructure: Structure<FeatureStoreState<State>> | FieldGroup<State> | Field<State> | FieldType,
    state: State,
    pathInDefaultState: Nullable<F.AutoPath<Required<State>, Path>> = null
  ): Path[] {
    if (FeatureStoreStructure.isField(pieceOfStructure)) {
      const type = of(pieceOfStructure).pipe(get('type'))
      const items = of(pieceOfStructure).pipe(get('items'))
      const valueAtPath = of(state).pipe(get<any, any>(pathInDefaultState))
      if (type === 'array' && !FeatureStoreStructure.isSimpleFieldType(items)) {
        const complexArrayPaths: Path[] = of(valueAtPath).pipe(
          flatMapObject((_, index) =>
            this.getFormArrayPaths<Path>(
              items,
              state,
              of<any>(pathInDefaultState).pipe(fold(index, path => `${path}.${index}`)) as F.AutoPath<
                Required<State>,
                Path
              >
            )
          )
        )
        return of(pathInDefaultState).pipe(fold(EMPTY_ARRAY, wrapIntoArray), append<unknown, Path[]>(complexArrayPaths))
      }
    } else if (FeatureStoreStructure.isFieldGroup(pieceOfStructure)) {
      return of(pieceOfStructure).pipe(
        flatMapObject((groupOfFieldOrType: FieldGroup<State> | Field<State> | SimpleFieldType, key: string) =>
          this.getFormArrayPaths<Path>(
            groupOfFieldOrType,
            state,
            of<any>(pathInDefaultState).pipe(fold(key, path => `${path}.${key}`)) as F.AutoPath<Required<State>, Path>
          )
        )
      )
    }
    return emptyArray<Path>()
  }

  public getInitialValue<P extends string>(
    path: Nullable<F.AutoPath<Required<State>, P>>
  ): State | Nullable<O.Path<Required<State>, S.Split<P, '.'>>> {
    if (isEmpty(path)) {
      return this.featureStoreOptions.initialState
    } else {
      return of(this.featureStoreOptions.initialState as State).pipe(get<any, any>(path), defaultTo(null))
    }
  }

  public withIndex$<S extends State | RichState>(
    index: number
  ): (state$: Observable<S>) => Observable<S & IMapK<UnitOf<typeof FeatureStoreFormBuilder.indexKeys>, number>> {
    return (state$: Observable<S>) =>
      state$.pipe(
        map(state => {
          const stateKeys = keys(state)
          const indexKey = of(FeatureStoreFormBuilder.indexKeys).pipe(
            find(key => of(stateKeys).pipe(negate(includes(key))))
          )
          if (isNil(indexKey)) {
            throw new Error(`Max depth of ${size(FeatureStoreFormBuilder.indexKeys)} form arrays permitted`)
          }
          return of(state).pipe(defaults({ [indexKey]: index }))
        })
      )
  }

  private arrayDisabler(
    formGroup: FormGroup,
    condition: Nullable<boolean | EXPR_EVAL_EXPRESSION>,
    state: State,
    path: string,
    previousIndex: number
  ): void {
    this.disable(formGroup, condition, state, path)
    if (previousIndex > 0) {
      this.arrayDisabler(
        formGroup,
        condition,
        state,
        of(path).pipe(replace(`${previousIndex}`, `${previousIndex - 1}`)),
        previousIndex - 1
      )
    }
  }

  private bindToStore(
    formGroup: FormGroup,
    { takeUntil$, debounce, updateStrategy, richState$ }: FeatureStoreFormConfig<State, RichState>,
    pieceOfStructure: Structure<FeatureStoreState<State>> | FieldGroup<State> | Field<State> | FieldType = this
      .featureStoreOptions.structure,
    formatter: (newState: Partial<State>, oldState: Partial<State>, richState: Partial<RichState>) => Partial<State>
  ): void {
    formGroup.valueChanges
      .pipe(
        debounceTime(debounce),
        map(() => formGroup.getRawValue()),
        switchMap(formValue =>
          this.featureStoreFacade.stateWithoutMetaData$.pipe(
            first(),
            map(state =>
              of(formValue).pipe(FeatureStoreFormBuilder.extendState(state, this.featureStoreOptions.structure))
            )
          )
        ),
        startWith(formGroup.getRawValue()),
        pairwise(),
        withLatestFrom(richState$),
        map(([[oldState, newState], richState]) => (formatter ? formatter(newState, oldState, richState) : newState)),
        distinctUntilChanged(isEqual),
        takeUntil(takeUntil$)
      )
      .subscribe((value: Partial<State>) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        updateStrategy === FormUpdateStrategy.ToParams
          ? this.featureStoreFacade.updateParamsFromForm(value)
          : this.featureStoreFacade.updateStoreFromForm(value)
        this.featureStoreFacade.setFormState({
          status: formGroup.valid || formGroup.disabled ? ValidationStatus.Valid : ValidationStatus.Error,
          askForValidation: false
        })
      })

    this.featureStoreFacade.askForValidation$
      .pipe(
        distinctUntilChanged(),
        filter((askForValidation: Nullable<boolean>) => askForValidation === true),
        tap(() => markFormAndDescendantsAsDirty(formGroup)),
        tap(() => this.featureStoreFacade.askForValidation(false)),
        delay(debounce),
        takeUntil(takeUntil$)
      )
      .subscribe(() => this.featureStoreFacade.submit())

    this.featureStoreFacade.stateWithoutMetaData$
      .pipe(
        filter((state: Nullable<State>) => !isNil(state)),
        map((state: State) =>
          of(this.featureStoreOptions.structurePathsForForm).pipe(
            fold(state, (structurePathsForForm: string[]) => of(state).pipe(pick(structurePathsForForm)))
          )
        ),
        distinctUntilChanged(isEqual),
        takeUntil(takeUntil$)
      )
      .subscribe((state: State) => {
        // This is important to make the patchValue call before updating form arrays because FormArray methods (push and
        // removeAt) inevitably emit events (cf https://github.com/angular/angular/pull/23393) and will override the store
        // with the previous values.
        formGroup.patchValue(state)
        this.updateFormArrays(formGroup, pieceOfStructure, state, richState$)
        this.updateDisabler(formGroup, pieceOfStructure, state)
      })
  }

  private convertValuePathToStructurePath<Path extends string>(
    valuePath: F.AutoPath<Required<State>, Path>
  ): F.AutoPath<Required<State>, Path> {
    // TODO: this version has a corner case: you cannot define fields in the structure with a simple number as a name.
    //  To avoid this behavior, remove only indexes from array fields using the structure instead of removing numeric paths.
    return of(valuePath).pipe(split('.'), _map(foldLeftOn(isNumeric, 'items')), join('.')) as F.AutoPath<
      Required<State>,
      Path
    >
  }

  private disable(
    formGroup: FormGroup,
    condition: Nullable<boolean | EXPR_EVAL_EXPRESSION>,
    state: State,
    path: string
  ): void {
    const isDisabled =
      condition === true || (isString(condition) && FeatureStoreValidators.evaluateExpression(condition, state as IMap))
    if (isDisabled) {
      if (formGroup.get(path).enabled) {
        formGroup.get(path).disable()
      }
    } else {
      if (formGroup.get(path).disabled) {
        formGroup.get(path).enable()
      }
    }
  }

  private getAsyncValidators<P extends string>(
    pieceOfStructure: Structure<FeatureStoreState<State>> | FieldGroup<State> | Field<State> | FieldType,
    pathInInitialState: F.AutoPath<Required<State>, P>,
    richState$: Observable<RichState>
  ): Nullable<AsyncValidatorFn> {
    return of(pieceOfStructure).pipe(
      get<Field<State>, 'validators'>('validators'),
      defaultToNull,
      thru(
        (
          validators // TODO use fold(null, …)
        ) =>
          isNull(validators)
            ? null
            : FeatureStoreValidators.featureStoreValidator<State>(
                validators,
                richState$ || this.featureStoreFacade.stateWithoutMetaData$, // TODO: replace with richState$ (as this is the default value in options)
                pathInInitialState
              )
      )
    )
  }

  private getDisablerPaths<Path extends string>(
    pieceOfStructure: Structure<FeatureStoreState<State>> | FieldGroup<State> | Field<State> | FieldType,
    previousPath: Nullable<Path> = null
  ): Path[] {
    const paths = []
    of(pieceOfStructure).pipe(
      mapObject((piece: Structure<FeatureStoreState<State>> | FieldGroup<State> | Field<State> | FieldType, key) => {
        const savedPath = previousPath ? `${previousPath}.${key}` : key
        if (FeatureStoreStructure.isField(pieceOfStructure[key])) {
          if (of(pieceOfStructure[key]).pipe(has('disabled'))) {
            paths.push(savedPath)
          }
          paths.push(this.getDisablerPaths(pieceOfStructure[key], key as Path))
        } else if (FeatureStoreStructure.isFieldGroup(pieceOfStructure[key])) {
          if (of(pieceOfStructure[key]).pipe(has('disabled'))) {
            paths.push(savedPath)
          }
          paths.push(this.getDisablerPaths(pieceOfStructure[key], savedPath))
        }
      })
    )
    return of(paths).pipe(flatten, uniq, compact)
  }

  private getOptions(config?: FeatureStoreFormConfig<State, RichState>): FeatureStoreFormConfig<State, RichState> {
    if (of(config).pipe(negate(has('takeUntil$')))) {
      throw new Error('The "takeUntil$" option is mandatory')
    }
    return of(config).pipe(
      defaults({
        debounce: 300,
        formatter: identity,
        updateStrategy: FormUpdateStrategy.ToStore,
        richState$: this.featureStoreFacade.stateWithoutMetaData$
      })
    )
  }

  private updateDisabler(
    formGroup: FormGroup,
    pieceOfStructure: Structure<FeatureStoreState<State>> | FieldGroup<State> | Field<State> | FieldType,
    state: State
  ): void {
    of(this.getDisablerPaths(pieceOfStructure)).pipe(
      _map((path: string) => {
        const piece = of(pieceOfStructure).pipe(getOr(null, path))
        const condition: Nullable<boolean | EXPR_EVAL_EXPRESSION> = of(piece).pipe(get('disabled'))
        if (of(path).pipe(includes('.items.'))) {
          const arrayPath: string = of(path).pipe(split('.items.'), _first)
          const formArray = formGroup.get(arrayPath) as FormArray
          if (formArray.length > 0) {
            this.arrayDisabler(
              formGroup,
              condition,
              state,
              of(path).pipe(replace('items', `${formArray.length - 1}`)),
              formArray.length - 1
            )
          }
        } else {
          this.disable(formGroup, condition, state, path)
        }
      })
    )
  }

  private updateFormArrays(
    formGroup: FormGroup,
    pieceOfStructure: Structure<FeatureStoreState<State>> | FieldGroup<State> | Field<State> | FieldType,
    state: State,
    richState$: Observable<RichState>
  ): void {
    const isFormGroupDisabled = formGroup.disabled
    const formArrayPaths = this.getFormArrayPaths(pieceOfStructure, state)
    of(formArrayPaths).pipe(
      // eslint-disable-next-line
      forEach(<Path extends string>(path: F.AutoPath<Required<State>, Path>) => {
        const formArray = formGroup.get(path) as FormArray
        const values = of(state).pipe(get<any, any>(path)) as any[]
        const numberOfValues = size(values)
        const numberOfControlsInFormArray = size(formArray)
        if (numberOfValues > numberOfControlsInFormArray) {
          of(numberOfValues).pipe(
            range(numberOfControlsInFormArray),
            _map((index: number) => [index, of(values).pipe(get(index), defaultToEmptyObject)] as [number, IMap]),
            _map(([index, value]: [number, IMap]) => {
              const itemControl = this.createArrayItem<Path>(path, index, richState$)
              itemControl.patchValue(value, { emitEvent: false })
              return itemControl
            }),
            // eslint-disable-next-line
            forEach((itemControl: FormGroup) => formArray.push(itemControl))
          )
        } else if (numberOfValues < numberOfControlsInFormArray) {
          of(numberOfControlsInFormArray).pipe(
            range(numberOfValues),
            // eslint-disable-next-line
            forEachRight((index: number) => formArray.removeAt(index))
          )
        }
      }),
      _tap(() => {
        if (isFormGroupDisabled) {
          formGroup.disable({ emitEvent: false })
        }
      })
    )
  }
}

@Injectable()
export class FeatureStoreFormFactory {
  private readonly instanceCache = new Map()

  public constructor(
    private readonly featureStoreFramework: FeatureStoreFramework,
    private readonly featureStoreFacadeFactory: FeatureStoreFacadeFactory,
    private readonly fb: FormBuilder
  ) {}

  public getFormBuilder<State extends {}>(featureStoreKey: string): FeatureStoreFormBuilder<State> {
    if (!this.instanceCache.has(featureStoreKey)) {
      const featureStoreOptions = this.featureStoreFramework.getFeatureStoreOptions<State>(featureStoreKey)
      const featureStoreFacade = this.featureStoreFacadeFactory.getFacade<State>(featureStoreKey)
      this.instanceCache.set(
        featureStoreKey,
        new FeatureStoreFormBuilder<State>(featureStoreOptions, featureStoreFacade, this.fb)
      )
    }
    return this.instanceCache.get(featureStoreKey)
  }
}

export function markFormAndDescendantsAsDirty(control: AbstractControl | FormGroup): void {
  if (control instanceof FormGroup || control instanceof FormArray) {
    // eslint-disable-next-line  ban/ban
    of(control.controls).pipe(forEach((c: AbstractControl) => markFormAndDescendantsAsDirty(c)))
  }
  control.markAsDirty()
  control.updateValueAndValidity()
}
