import { ChangeDetectorRef, Directive, Host, Inject, Optional, SkipSelf } from '@angular/core'
import { ControlContainer, ControlValueAccessor, NgModel } from '@angular/forms'
import { IMap } from '@mondosha1/core'
import { Nullable } from '@mondosha1/nullable'
import { isNil, noop } from 'lodash/fp'
import { Subject } from 'rxjs'
import { FORM_FIELD_ERROR_MESSAGES, FormFieldWrapperDirective } from './form-field-wrapper.directive'

@Directive()
export class FormFieldDirective<Value = any> extends FormFieldWrapperDirective implements ControlValueAccessor {
  public onChangeCallback: (a: Value) => void = noop
  public onTouchedCallback: () => void = noop
  public value$: Subject<Value> = new Subject<Value>()
  // Can't be replaced by Nullable<Value> seems break some components
  protected innerValue: Value | null = null

  public constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    @Optional() @Host() @SkipSelf() protected controlContainer: ControlContainer,
    @Optional() @Inject(FORM_FIELD_ERROR_MESSAGES) protected errorMessages: Nullable<IMap<string>>
  ) {
    super(changeDetectorRef, controlContainer, errorMessages)
  }

  public get value(): Value {
    return this.innerValue
  }

  public set value(value: Value) {
    const nilableValue = isNil(value) ? null : value
    if (nilableValue !== this.innerValue) {
      this.value$.next(nilableValue)
      this.innerValue = nilableValue
      this.onChangeCallback(nilableValue)
    }
  }

  public onBlur(param: FocusEvent): void {
    this.onTouchedCallback()
  }

  public registerOnChange(fn: (a: Value) => void): void {
    this.onChangeCallback = fn
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouchedCallback = fn
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = Boolean(isDisabled)
    this.changeDetectorRef.markForCheck()
  }

  public writeValue(value: Value): void {
    this.innerValue = value
    this.value$.next(value)
    this.changeDetectorRef.markForCheck()
  }
}

export type NgModelOptions = NgModel['options']

export interface WithDebounce {
  debounce: number
}
