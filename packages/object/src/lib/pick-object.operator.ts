import { pickBy } from 'lodash/fp'

export const pickObject = (pickBy as any).convert({ cap: false })
