import { of } from '@mondosha1/core'
import { Parser } from 'expr-eval'
import { flatten, join, zip } from 'lodash/fp'
import { Brand } from 'utility-types'

// See https://github.com/silentmatt/expr-eval
export type EXPR_EVAL_EXPRESSION = Brand<string, 'EXPR_EVAL_EXPRESSION'>

export function formula(strings: TemplateStringsArray, ...params: any[]): EXPR_EVAL_EXPRESSION | never {
  const expression = of(params).pipe(zip(strings), flatten, join(''))
  try {
    Parser.parse(expression)
  } catch (error) {
    throw new Error(`Invalid validator formula "${expression}". ${error}`)
  }
  return expression as EXPR_EVAL_EXPRESSION
}
