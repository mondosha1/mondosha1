// credits to: https://github.com/microsoft/TypeScript/issues/30611#issuecomment-570773496
export function createEnumChecker<T extends string, TEnumValue extends string>(enumVariable: {
  [key in T]: TEnumValue
}): (value: string) => value is TEnumValue {
  const enumValues = Object.values(enumVariable)
  return (value: string): value is TEnumValue => enumValues.includes(value)
}
