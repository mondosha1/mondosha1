import 'jest-extended'
import { chain } from './chain'
;(global as any).expect = chain((global as any).expect)
