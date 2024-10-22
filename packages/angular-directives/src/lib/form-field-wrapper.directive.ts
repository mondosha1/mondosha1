import {
  ChangeDetectorRef,
  ContentChild,
  Directive,
  DoCheck,
  ElementRef,
  forwardRef,
  Host,
  Inject,
  InjectionToken,
  Input,
  OnChanges,
  Optional,
  SkipSelf
} from '@angular/core'
import {
  AbstractControl,
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms'
import { Changeable, Destroyable } from '@elium/shared/util-angular'
import { IMap, of as _of } from '@mondosha1/core'
import { Lazy } from '@mondosha1/decorators'
import { foldLeftOn, Nullable } from '@mondosha1/nullable'
import { EMPTY_OBJECT, get, mapObject } from '@mondosha1/object'
import { allowLatecomers } from '@mondosha1/observable'
import { first, isEmpty, isEqual, isFunction, isNil, isUndefined, map as _map, pickBy, some, template } from 'lodash/fp'
import { BehaviorSubject, combineLatest, merge, Observable, of, Subject } from 'rxjs'
import { distinctUntilChanged, filter, map, mapTo, startWith, switchMap, takeUntil, tap } from 'rxjs/operators'

export const FORM_FIELD_ERROR_MESSAGES = new InjectionToken<'FORM_FIELD_ERROR_MESSAGES'>('FORM_FIELD_ERROR_MESSAGES')

export function formFieldAccessor(component) {
  return {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => component),
    deps: [],
    multi: true
  }
}

@Directive({
  selector: '[btHelperTextTemplate]'
})
export class HelperTextTemplateDirective {}

@Directive()
export class FormFieldWrapperDirective
  extends Destroyable(Changeable())
  implements DoCheck, FormField, OnChanges, ControlValueAccessor
{
  // Allow more dynamic content than simple helperText. Can't be used if helperText is present.
  public readonly helperTextContent$: BehaviorSubject<Nullable<ElementRef>> = new BehaviorSubject(null)
  @Input() public disabled: boolean = false
  @Input() public errorMessage: string = ''
  @Input('required') public forceRequired: boolean
  @Input() public formControl: AbstractControl
  @Input() public formControlName: string
  @Input() public helperText: string = null
  @Input() public label: string
  @Input() public labelAlign: 'left' | 'right' = 'left'
  protected doCheck$: Subject<void> = new Subject<void>()
  private controlRequired: boolean

  public constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer,
    @Optional() @Inject(FORM_FIELD_ERROR_MESSAGES) protected errorMessages: Nullable<IMap<string>>
  ) {
    super()

    this.required$.pipe(takeUntil(this.destroy$)).subscribe(isRequired => (this.controlRequired = isRequired))
  }

  @Lazy()
  public get errorMessage$(): Observable<string> {
    return combineLatest(
      this.changeByName$('errorMessage').pipe(
        map(({ errorMessage }) => errorMessage),
        startWith(this.errorMessage)
      ),
      this.errors$.pipe(map(errors => this.getErrorMessage(errors)))
    ).pipe(map(([customError, formError]: [string, string]) => _of(customError).pipe(foldLeftOn(isEmpty, formError))))
  }

  @ContentChild(HelperTextTemplateDirective, { read: ElementRef, static: false }) public set helperTextContent(
    content: ElementRef
  ) {
    this.helperTextContent$.next(content)
  }

  @Lazy()
  public get pristine$(): Observable<boolean> {
    return this.controlChanged$.pipe(
      map(control => control.pristine),
      distinctUntilChanged(null, v => Boolean(v)),
      startWith(true)
    )
  }

  public get required(): boolean {
    return isUndefined(this.forceRequired) ? this.controlRequired : this.forceRequired !== false
  }

  @Lazy()
  public get showErrorMessage$(): Observable<boolean> {
    return combineLatest([
      this.changeByName$('errorMessage').pipe(
        map(({ errorMessage }) => errorMessage),
        startWith(this.errorMessage)
      ),
      this.errors$,
      this.pristine$
    ]).pipe(
      map(
        ([customMessage, errors, pristine]: [string, ValidationErrors, boolean]) =>
          !isEmpty(customMessage) || (errors && !pristine)
      ),
      distinctUntilChanged(),
      tap(() => this.changeDetectorRef.markForCheck()),
      startWith(false)
    )
  }

  @Lazy()
  public get showHelperText$(): Observable<boolean> {
    return combineLatest([
      this.showErrorMessage$.pipe(startWith(false)),
      this.changeByName$('helperText').pipe(startWith('')),
      this.helperTextContent$
    ]).pipe(
      map(
        ([showErrorMessage, changes, helperTextRef]: [boolean, IMap, ElementRef]) =>
          !showErrorMessage && (!isEmpty(changes.helperText) || !isEmpty(helperTextRef))
      )
    )
  }

  @Lazy()
  private get control$(): Observable<FormControl> {
    return this.doCheck$.pipe(
      map(() => this.getControl()),
      filter(control => !isNil(control)),
      distinctUntilChanged(),
      allowLatecomers()
    )
  }

  @Lazy()
  private get controlChanged$(): Observable<FormControl> {
    return this.control$.pipe(
      switchMap((control: FormControl) =>
        merge(
          control.valueChanges.pipe(distinctUntilChanged()),
          control.statusChanges.pipe(distinctUntilChanged()),
          control.statusChanges.pipe(
            map(() => control.pristine),
            distinctUntilChanged()
          )
        ).pipe(startWith(control), mapTo(control))
      ),
      allowLatecomers()
    )
  }

  @Lazy()
  private get errors$(): Observable<ValidationErrors> {
    return this.controlChanged$.pipe(
      map(control => control.errors),
      distinctUntilChanged(isEqual),
      startWith(EMPTY_OBJECT)
    )
  }

  @Lazy()
  private get required$(): Observable<boolean> {
    return this.controlChanged$.pipe(
      switchMap(control => {
        const dummyValue = { value: null } as AbstractControl
        const syncErrors$ = isFunction(control.validator) ? of(control.validator(dummyValue)) : of({})
        const asyncErrors$ = isFunction(control.asyncValidator) ? control.asyncValidator(dummyValue) : of({})
        return combineLatest([syncErrors$, asyncErrors$])
      }),
      map((allErrors: ValidationErrors[]) =>
        _of(allErrors).pipe(some(errors => _of(errors).pipe(get('required')) === true))
      ),
      distinctUntilChanged()
    )
  }

  public ngOnChanges(changes): void {
    super.ngOnChanges(changes)
  }

  public ngDoCheck(): void {
    this.doCheck$.next()
  }

  public registerOnChange(fn: () => void): void {}

  public registerOnTouched(fn: () => void): void {}

  public writeValue(value: any): void {}

  private getControl(): FormControl {
    return this.formControl
      ? (this.formControl as FormControl)
      : this.controlContainer && this.formControlName
      ? (this.controlContainer.control.get(this.formControlName) as FormControl)
      : null
  }

  private getErrorMessage(errors: ValidationErrors): string {
    return _of(errors).pipe(
      pickBy(detail => detail !== false),
      mapObject((detail: any, key: string) => ({ detail, key })),
      _map(({ detail, key }) =>
        !this.errorMessages ? key : _of(detail).pipe(template(this.errorMessages[key] || key))
      ),
      first
    ) // Display only the first error under the field for the moment
  }
}

export interface FormField {
  disabled: boolean
  helperText: string
  label: string
  required: boolean
}

export interface WithPlaceholder {
  placeholder: string
}

export interface WithId {
  id: string
}
