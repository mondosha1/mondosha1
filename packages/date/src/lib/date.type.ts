import { Brand } from 'utility-types'

export type SECONDS_TIMESTAMP = Brand<number, 'SECONDS_TIMESTAMP'> // eg: 1592555963
export type MILLISECONDS_TIMESTAMP = Brand<number, 'MILLISECONDS_TIMESTAMP'> // eg: 1592555963999

export type YEAR = Brand<number | string, 'YEAR'> // YYYY, eg: 2000
export type YEAR_AND_MONTH = Brand<string, 'YEAR_AND_MONTH'> // YYYY-MM, eg: 2000-03
export type ISO_DATE = Brand<string, 'ISO_DATE'> // YYYY-MM-DD, eg: 2000-03-15
export type ISO_TIME = Brand<string, 'ISO_TIME'> // HH:mm:ss, eg: 05:20:10
export type ISO_DATETIME = Brand<string, 'ISO_DATETIME'> // YYYY-MM-DDT:HH:mm:ss.SSSZ eg: 2000-03-15T05:20:10.123Z
