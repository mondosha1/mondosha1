import { Parser } from 'expr-eval'
import { Brand } from 'utility-types'

// See https://github.com/silentmatt/expr-eval
export type EXPR_EVAL_EXPRESSION = Brand<string, 'EXPR_EVAL_EXPRESSION'>

export function formula(strings: TemplateStringsArray): EXPR_EVAL_EXPRESSION | never {
  const expression = String(strings)
  try {
    Parser.parse(expression)
  } catch (error) {
    throw new Error(`Invalid validator formula "${expression}". ${error}`)
  }
  return expression as EXPR_EVAL_EXPRESSION
}
