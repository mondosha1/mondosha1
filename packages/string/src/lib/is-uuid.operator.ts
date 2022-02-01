import { isString } from 'lodash/fp'

const uuidExpr = '[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}'
const uuidRegExp = new RegExp(uuidExpr)

export const isUuid = (value: any): value is string => isString(value) && uuidRegExp.test(value)
