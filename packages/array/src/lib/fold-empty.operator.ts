import { foldOn, Nil } from '@mondosha1/nullable'
import { identity, isEmpty } from 'lodash/fp'

export function foldEmpty<RightInput extends any[] | readonly any[], LeftOutput, RightOutput>(
  left: ((v: Nil | [] | readonly []) => LeftOutput) | LeftOutput,
  right: ((v: RightInput) => RightOutput) | RightOutput = identity
): (value: RightInput | Nil | [] | readonly []) => LeftOutput | RightOutput {
  return foldOn<Nil | [] | readonly [], RightInput, LeftOutput, RightOutput>(isEmpty, left, right)
}

export function foldEmptyLeft<RightInput extends any[] | readonly any[], LeftOutput>(
  left: ((v: Nil | [] | readonly []) => LeftOutput) | LeftOutput
): (value: RightInput | Nil | [] | readonly []) => LeftOutput | RightInput {
  return foldOn<Nil | [] | readonly [], RightInput, LeftOutput, RightInput>(isEmpty, left, identity)
}

export function foldEmptyRight<RightInput extends any[] | readonly any[], RightOutput>(
  right: ((v: RightInput) => RightOutput) | RightOutput
): (value: RightInput | Nil | [] | readonly []) => RightOutput | Nil | [] | readonly [] {
  return foldOn<Nil | [] | readonly [], RightInput, Nil | [] | readonly [], RightOutput>(isEmpty, identity, right)
}
