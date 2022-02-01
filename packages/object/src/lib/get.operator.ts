import { Nullable } from '@mondosha1/nullable'
// eslint-disable-next-line no-restricted-imports
import { get as _get } from 'lodash/fp'
import { F, O, S } from 'ts-toolbelt'
import { RequiredDeep } from 'ts-toolbelt/out/Object/Required'

export function get<Obj extends {}, Path extends keyof NonNullable<Obj>>(
  path: Path
): (obj: Obj) => Nullable<NonNullable<Obj>[Path]>
export function get<Obj extends Nullable<{}>, Path extends string>(
  path: F.AutoPath<RequiredDeep<Obj>, Path>
): (obj: Obj) => Nullable<O.Path<RequiredDeep<Obj>, S.Split<Path, '.'>>>
export function get(path) {
  return _get(path)
}
