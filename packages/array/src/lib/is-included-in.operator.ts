import { includes } from 'lodash/fp'

export const isIncludedIn = a => b => includes(b)(a)
