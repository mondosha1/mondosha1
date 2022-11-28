import { constant, identity, isFunction, isNil } from 'lodash/fp'
import { Nil } from './nullable.type'

export function fold<RightInput, LeftOutput, RightOutput>(
  left: ((v: Nil) => LeftOutput) | LeftOutput,
  right: ((v: NonNullable<RightInput>) => RightOutput) | RightOutput = identity
): (value: NonNullable<RightInput> | Nil) => LeftOutput | RightOutput {
  return foldOn<Nil, NonNullable<RightInput>, LeftOutput, RightOutput>(isNil, left, right)
}

export function foldLeft<RightInput, LeftOutput>(
  left: ((v: Nil) => LeftOutput) | LeftOutput
): (value: RightInput | Nil) => LeftOutput | RightInput {
  return foldOn<Nil, RightInput, LeftOutput, RightInput>(isNil, left, identity)
}

export function foldRight<RightInput, RightOutput>(
  right: ((v: NonNullable<RightInput>) => RightOutput) | RightOutput
): (value: NonNullable<RightInput> | Nil) => RightOutput | Nil {
  return foldOn<Nil, NonNullable<RightInput>, Nil, RightOutput>(isNil, identity, right)
}

export function foldOn<LeftInput, RightInput = LeftInput, LeftOutput = LeftInput, RightOutput = RightInput>(
  condition: ((v: LeftInput | RightInput) => v is LeftInput) | ((v: LeftInput | RightInput) => boolean) | boolean,
  left: ((v: LeftInput) => LeftOutput) | LeftOutput,
  right: ((v: RightInput) => RightOutput) | RightOutput = identity
): (value: LeftInput | RightInput) => LeftOutput | RightOutput {
  const leftFn = isFunction(left) ? left : constant(left)
  const rightFn = isFunction(right) ? right : constant(right)
  return (value: LeftInput | RightInput) => {
    const condFn = isFunction(condition) ? condition(value) : condition
    return condFn ? leftFn(value as LeftInput) : rightFn(value as RightInput)
  }
}

export function foldLeftOn<LeftInput, RightInput = LeftInput, LeftOutput = LeftInput>(
  condition: ((v: LeftInput | RightInput) => v is LeftInput) | ((v: LeftInput | RightInput) => boolean) | boolean,
  left: ((v: LeftInput) => LeftOutput) | LeftOutput
): (value: LeftInput | RightInput) => LeftOutput | RightInput {
  return foldOn<LeftInput, RightInput, LeftOutput, RightInput>(condition, left)
}

export function foldRightOn<LeftInput, RightInput = LeftInput, RightOutput = RightInput>(
  condition: ((v: LeftInput | RightInput) => v is LeftInput) | ((v: LeftInput | RightInput) => boolean) | boolean,
  right: ((v: RightInput) => RightOutput) | RightOutput = identity
): (value: LeftInput | RightInput) => LeftInput | RightOutput {
  return foldOn<LeftInput, RightInput, LeftInput, RightOutput>(condition, identity, right)
}
