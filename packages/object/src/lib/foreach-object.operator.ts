import { forEach, forEachRight } from 'lodash/fp'

export const forEachObject = (forEach as any).convert({ cap: false })
export const forEachRightObject = (forEachRight as any).convert({ cap: false })
