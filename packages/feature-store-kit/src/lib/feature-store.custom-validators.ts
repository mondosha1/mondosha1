import { AbstractControl, ValidatorFn } from '@angular/forms'
import { isFinite, isInteger as _isInteger } from 'lodash/fp'

export const HTTP_URL_PATTERN =
  '^((http[s]?):\\/)\\/?([^:\\/\\s]+)((\\/\\w+)*)([\\w\\-\\.]+[^#?\\s]+)(.*)?(#[\\w\\-]+)?$'

export function isUrl(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const url = control.value
    const urlPattern = new RegExp(HTTP_URL_PATTERN)
    return urlPattern.test(url) ? null : { url: true }
  }
}

export function isInteger(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value
    return _isInteger(value) ? null : { isInteger: { value } }
  }
}

export function isNumber(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } => {
    const value = control.value
    return isFinite(value) ? null : { isNumber: { value } }
  }
}
