import { gt } from 'lodash/fp'

// reArg in order to be use in lodash chains
export const greaterThan = (gt as any).convert({ rearg: true })
