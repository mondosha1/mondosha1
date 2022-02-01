import { reject } from 'lodash/fp'

export const rejectObject = (reject as any).convert({ cap: false })
