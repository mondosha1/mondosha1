import { Omit } from './omit.type'

export type Merge<M, N> = Omit<M, Extract<keyof M, keyof N>> & N
