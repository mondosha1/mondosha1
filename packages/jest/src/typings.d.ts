/* tslint:disable */
declare namespace jest {
  interface Matchers<R> {
    /**
     * If you know how to test something, `.not` lets you test its opposite.
     */
    not: any
    /**
     * Use resolves to unwrap the value of a fulfilled promise so any other
     * matcher can be chained. If the promise is rejected the assertion fails.
     */
    resolves: Matchers<Promise<R>>
    /**
     * Unwraps the reason of a rejected promise so any other matcher can be chained.
     * If the promise is fulfilled the assertion fails.
     */
    rejects: Matchers<Promise<R>>

    /**
     * Note: Currently unimplemented
     * Failing assertion
     *
     * @param {String} message
     */
    fail(message: string): any

    /**
     * Ensures the last call to a mock function was provided specific args.
     */
    lastCalledWith(...args: any[]): any

    /**
     * Ensure that the last call to a mock function has returned a specified value.
     */
    lastReturnedWith(value: any): any

    /**
     * Ensure that a mock function is called with specific arguments on an Nth call.
     */
    nthCalledWith(nthCall: number, ...params: any[]): any

    /**
     * Ensure that the nth call to a mock function has returned a specified value.
     */
    nthReturnedWith(n: number, value: any): any

    /**
     * Note: Currently unimplemented
     * Passing assertion
     *
     * @param {String} message
     */
    pass(message: string): any

    /**
     * Checks that a value is what you expect. It uses `===` to check strict equality.
     * Don't use `toBe` with floating-point numbers.
     */
    toBe(expected: any): any

    /**
     * Use `.toBeAfter` when checking if a date occurs after `date`.
     * @param {Date} date
     */
    toBeAfter(date: Date): any

    /**
     * Use `.toBeArray` when checking if a value is an `Array`.
     */
    toBeArray(): any

    /**
     * Use `.toBeArrayOfSize` when checking if a value is an `Array` of size x.
     * @param {Number} x
     */
    toBeArrayOfSize(x: number): any

    /**
     * Use `.toBeBefore` when checking if a date occurs before `date`.
     * @param {Date} date
     */
    toBeBefore(date: Date): any

    /**
     * Use `.toBeBoolean` when checking if a value is a `Boolean`.
     */
    toBeBoolean(): any

    /**
     * Ensures that a mock function is called.
     */
    toBeCalled(): any

    /**
     * Ensures that a mock function is called an exact number of times.
     */
    toBeCalledTimes(expected: number): any

    /**
     * Ensure that a mock function is called with specific arguments.
     */
    toBeCalledWith(...args: any[]): any

    /**
     * Using exact equality with floating point numbers is a bad idea.
     * Rounding means that intuitive things fail.
     * The default for numDigits is 2.
     */
    toBeCloseTo(expected: number, numDigits?: number): any

    /**
     * Use `.toBeDate` when checking if a value is a `Date`.
     */
    toBeDate(): any

    /**
     * Ensure that a variable is not undefined.
     */
    toBeDefined(): any

    /**
     * Use .toBeEmpty when checking if a String '', Array [], Object {} or Iterable (i.e. Map, Set) is empty.
     */
    toBeEmpty(): any

    /**
     * Use `.toBeEven` when checking if a value is an even `Number`.
     */
    toBeEven(): any

    /**
     * Use `.toBeExtensible` when checking if an object is extensible.
     */
    toBeExtensible(): any

    /**
     * Use `.toBeFalse` when checking a value is equal (===) to `false`.
     */
    toBeFalse(): any

    /**
     * When you don't care what a value is, you just want to
     * ensure a value is false in a boolean context.
     */
    toBeFalsy(): any

    /**
     * Use `.toBeFinite` when checking if a value is a `Number`, not `NaN` or `Infinity`.
     */
    toBeFinite(): any

    /**
     * Use `.toBeFrozen` when checking if an object is frozen.
     */
    toBeFrozen(): any

    /**
     * Use `.toBeFunction` when checking if a value is a `Function`.
     */
    toBeFunction(): any

    /**
     * For comparing floating point numbers.
     */
    toBeGreaterThan(expected: number): any

    /**
     * For comparing floating point numbers.
     */
    toBeGreaterThanOrEqual(expected: number): any

    /**
     * Use `.toBeHexadecimal` when checking if a value is a valid HTML hex color.
     *
     * @param {String} string
     */
    toBeHexadecimal(string: string): any

    /**
     * Ensure that an object is an instance of a class.
     * This matcher uses `instanceof` underneath.
     */
    toBeInstanceOf(expected: any): any

    /**
     * For comparing floating point numbers.
     */
    toBeLessThan(expected: number): any

    /**
     * For comparing floating point numbers.
     */
    toBeLessThanOrEqual(expected: number): any

    /**
     * Used to check that a variable is NaN.
     */
    toBeNaN(): any

    /**
     * Use `.toBeNaN` when checking a value is `NaN`.
     */
    toBeNaN(): any

    /**
     * Use `.toBeNegative` when checking if a value is a negative `Number`.
     */
    toBeNegative(): any

    /**
     * Use `.toBeNil` when checking a value is `null` or `undefined`.
     */
    toBeNil(): any

    /**
     * This is the same as `.toBe(null)` but the error messages are a bit nicer.
     * So use `.toBeNull()` when you want to check that something is null.
     */
    toBeNull(): any

    /**
     * Use `.toBeNumber` when checking if a value is a `Number`.
     */
    toBeNumber(): any

    /**
     * Use `.toBeObject` when checking if a value is an `Object`.
     */
    toBeObject(): any

    /**
     * Use `.toBeOdd` when checking if a value is an odd `Number`.
     */
    toBeOdd(): any

    /**
     * Use .toBeOneOf when checking if a value is a member of a given Array.
     * @param {Array.<*>} members
     */
    toBeOneOf(members: any[]): any

    /**
     * Use `.toBePositive` when checking if a value is a positive `Number`.
     */
    toBePositive(): any

    /**
     * Use `.toBeSealed` when checking if an object is sealed.
     */
    toBeSealed(): any

    /**
     * Use `.toBeString` when checking if a value is a `String`.
     */
    toBeString(): any

    /**
     * Use `.toBeTrue` when checking a value is equal (===) to `true`.
     */
    toBeTrue(): any

    /**
     * Use when you don't care what a value is, you just want to ensure a value
     * is true in a boolean context. In JavaScript, there are six falsy values:
     * `false`, `0`, `''`, `null`, `undefined`, and `NaN`. Everything else is truthy.
     */
    toBeTruthy(): any

    /**
     * Used to check that a variable is undefined.
     */
    toBeUndefined(): any

    /**
     * Use `.toBeValidDate` when checking if a value is a `valid Date`.
     */
    toBeValidDate(): any

    /**
     * Use `.toBeWithin` when checking if a number is in between the given bounds of: start (inclusive) and end (exclusive).
     *
     * @param {Number} start
     * @param {Number} end
     */
    toBeWithin(start: number, end: number): any

    /**
     * Used when you want to check that an item is in a list.
     * For testing the items in the list, this uses `===`, a strict equality check.
     */
    toContain(expected: any): any

    /**
     * Use `.toContainAllEntries` when checking if an object only contains all of the provided entries.
     *
     * @param {Array.<Array.<String, String>>} entries
     */
    toContainAllEntries(entries: [string, any][]): any

    /**
     * Use `.toContainAllKeys` when checking if an object only contains all of the provided keys.
     *
     * @param {Array.<String>} keys
     */
    toContainAllKeys(keys: string[]): any

    /**
     * Use `.toContainAllValues` when checking if an object only contains all of the provided values.
     *
     * @param {Array.<*>} values
     */
    toContainAllValues(values: any[]): any

    /**
     * Use `.toContainAnyEntries` when checking if an object contains at least one of the provided entries.
     *
     * @param {Array.<Array.<String, String>>} entries
     */
    toContainAnyEntries(entries: [string, any][]): any

    /**
     * Use `.toContainAnyKeys` when checking if an object contains at least one of the provided keys.
     *
     * @param {Array.<String>} keys
     */
    toContainAnyKeys(keys: string[]): any

    /**
     * Use `.toContainAnyValues` when checking if an object contains at least one of the provided values.
     *
     * @param {Array.<*>} values
     */
    toContainAnyValues(values: any[]): any

    /**
     * Use `.toContainEntries` when checking if an object contains all of the provided entries.
     *
     * @param {Array.<Array.<String, String>>} entries
     */
    toContainEntries(entries: [string, any][]): any

    /**
     * Use `.toContainEntry` when checking if an object contains the provided entry.
     *
     * @param {Array.<String, String>} entry
     */
    toContainEntry(entry: [string, any]): any

    /**
     * Used when you want to check that an item is in a list.
     * For testing the items in the list, this  matcher recursively checks the
     * equality of all fields, rather than checking for object identity.
     */
    toContainEqual(expected: any): any

    /**
     * Use `.toContainKey` when checking if an object contains the provided key.
     *
     * @param {String} key
     */
    toContainKey(key: string): any

    /**
     * Use `.toContainKeys` when checking if an object has all of the provided keys.
     *
     * @param {Array.<String>} keys
     */
    toContainKeys(keys: string[]): any

    /**
     * Use `.toContainValue` when checking if an object contains the provided value.
     *
     * @param {*} value
     */
    toContainValue(value: any): any

    /**
     * Use `.toContainValues` when checking if an object contains all of the provided values.
     *
     * @param {Array.<*>} values
     */
    toContainValues(values: any[]): any

    /**
     * Use `.toEndWith` when checking if a `String` ends with a given `String` suffix.
     *
     * @param {String} suffix
     */
    toEndWith(suffix: string): any

    /**
     * Used when you want to check that two objects have the same value.
     * This matcher recursively checks the equality of all fields, rather than checking for object identity.
     */
    toEqual(expected: any): any

    /**
     * Use `.toEqualCaseInsensitive` when checking if a string is equal (===) to another ignoring the casing of both strings.
     *
     * @param {String} string
     */
    toEqualCaseInsensitive(string: string): any

    /**
     * Ensures that a mock function is called.
     */
    toHaveBeenCalled(): any

    /**
     * Use `.toHaveBeenCalledAfter` when checking if a `Mock` was called after another `Mock`.
     *
     * Note: Required Jest version >=23
     *
     * @param {Mock} mock
     */
    toHaveBeenCalledAfter(mock: jest.Mock): any

    /**
     * Use `.toHaveBeenCalledBefore` when checking if a `Mock` was called before another `Mock`.
     *
     * Note: Required Jest version >=23
     *
     * @param {Mock} mock
     */
    toHaveBeenCalledBefore(mock: jest.Mock): any

    /**
     * Ensures that a mock function is called an exact number of times.
     */
    toHaveBeenCalledTimes(expected: number): any

    /**
     * Ensure that a mock function is called with specific arguments.
     */
    toHaveBeenCalledWith(...params: any[]): any

    /**
     * If you have a mock function, you can use `.toHaveBeenLastCalledWith`
     * to test what arguments it was last called with.
     */
    toHaveBeenLastCalledWith(...params: any[]): any

    /**
     * Ensure that a mock function is called with specific arguments on an Nth call.
     */
    toHaveBeenNthCalledWith(nthCall: number, ...params: any[]): any

    /**
     * Use to test the specific value that a mock function last returned.
     * If the last call to the mock function threw an error, then this matcher will fail
     * no matter what value you provided as the expected return value.
     */
    toHaveLastReturnedWith(expected: any): any

    /**
     * Used to check that an object has a `.length` property
     * and it is set to a certain numeric value.
     */
    toHaveLength(expected: number): any

    /**
     * Use to test the specific value that a mock function returned for the nth call.
     * If the nth call to the mock function threw an error, then this matcher will fail
     * no matter what value you provided as the expected return value.
     */
    toHaveNthReturnedWith(nthCall: number, expected: any): any

    /**
     * Use to check if property at provided reference keyPath exists for an object.
     * For checking deeply nested properties in an object you may use dot notation or an array containing
     * the keyPath for deep references.
     *
     * Optionally, you can provide a value to check if it's equal to the value present at keyPath
     * on the target object. This matcher uses 'deep equality' (like `toEqual()`) and recursively checks
     * the equality of all fields.
     *
     * @example
     *
     * expect(houseForSale).toHaveProperty('kitchen.area', 20);
     */
    toHaveProperty(propertyPath: string | any[], value?: any): any

    /**
     * Use to test that the mock function successfully returned (i.e., did not throw an error) at least one time
     */
    toHaveReturned(): any

    /**
     * Use to ensure that a mock function returned successfully (i.e., did not throw an error) an exact number of times.
     * Any calls to the mock function that throw an error are not counted toward the number of times the function returned.
     */
    toHaveReturnedTimes(expected: number): any

    /**
     * Use to ensure that a mock function returned a specific value.
     */
    toHaveReturnedWith(expected: any): any

    /**
     * Use `.toInclude` when checking if a `String` includes the given `String` substring.
     *
     * @param {String} substring
     */
    toInclude(substring: string): any

    /**
     * Use `.toIncludeAllMembers` when checking if an `Array` contains all of the same members of a given set.
     * @param {Array.<*>} members
     */
    toIncludeAllMembers(members: any[]): any

    /**
     * Use `.toIncludeAnyMembers` when checking if an `Array` contains any of the members of a given set.
     * @param {Array.<*>} members
     */
    toIncludeAnyMembers(members: any[]): any

    /**
     * Use `.toIncludeMultiple` when checking if a `String` includes all of the given substrings.
     *
     * @param {Array.<String>} substring
     */
    toIncludeMultiple(substring: string[]): any

    /**
     * Use `.toIncludeRepeated` when checking if a `String` includes the given `String` substring the correct number of times.
     *
     * @param {String} substring
     * @param {Number} times
     */
    toIncludeRepeated(substring: string, times: number): any

    /**
     * Use `.toIncludeSameMembers` when checking if two arrays contain equal values, in any order.
     * @param {Array.<*>} members
     */
    toIncludeSameMembers(members: any[]): any

    /**
     * Check that a string matches a regular expression.
     */
    toMatch(expected: string | RegExp): any

    /**
     * This ensures that a value matches the most recent snapshot with property matchers.
     * Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
     * Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.
     */
    toMatchInlineSnapshot<T extends { [P in keyof R]: Expect['any'] }>(
      propertyMatchers: Partial<T>,
      snapshot?: string
    ): any

    /**
     * This ensures that a value matches the most recent snapshot with property matchers.
     * Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
     * Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.
     */
    toMatchInlineSnapshot(snapshot?: string): any

    /**
     * Used to check that a JavaScript object matches a subset of the properties of an object
     */
    toMatchObject(expected: {} | any[]): any

    /**
     * This ensures that a value matches the most recent snapshot with property matchers.
     * Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.
     */
    toMatchSnapshot<T extends { [P in keyof R]: Expect['any'] }>(
      propertyMatchers: Partial<T>,
      snapshotName?: string
    ): any

    /**
     * This ensures that a value matches the most recent snapshot.
     * Check out [the Snapshot Testing guide](http://facebook.github.io/jest/docs/snapshot-testing.html) for more information.
     */
    toMatchSnapshot(snapshotName?: string): any

    /**
     * Use `.toReject` when checking if a promise rejects.
     */
    toReject(): any

    /**
     * Use `.toResolve` when checking if a promise resolves.
     */
    toResolve(): any

    /**
     * Ensure that a mock function has returned (as opposed to thrown) at least once.
     */
    toReturn(): any

    /**
     * Ensure that a mock function has returned (as opposed to thrown) a specified number of times.
     */
    toReturnTimes(count: number): any

    /**
     * Ensure that a mock function has returned a specified value at least once.
     */
    toReturnWith(value: any): any

    /**
     * Use `.toSatisfy` when you want to use a custom matcher by supplying a predicate function that returns a `Boolean`.
     * @param {Function} predicate
     */
    toSatisfy(predicate: (x: any) => boolean): any

    /**
     * Use `.toSatisfyAll` when you want to use a custom matcher by supplying a predicate function that returns a `Boolean` for all values in an array.
     * @param {Function} predicate
     */
    toSatisfyAll(predicate: (x: any) => boolean): any

    /**
     * Use `.toStartWith` when checking if a `String` starts with a given `String` prefix.
     *
     * @param {String} prefix
     */
    toStartWith(prefix: string): any

    /**
     * Use to test that objects have the same types as well as structure.
     */
    toStrictEqual(expected: {}): any

    /**
     * Used to test that a function throws when it is called.
     */
    toThrow(error?: string | Constructable | RegExp | Error): any

    /**
     * If you want to test that a specific error is thrown inside a function.
     */
    toThrowError(error?: string | Constructable | RegExp | Error): any

    /**
     * Used to test that a function throws a error matching the most recent snapshot when it is called.
     * Instead of writing the snapshot value to a .snap file, it will be written into the source code automatically.
     */
    toThrowErrorMatchingInlineSnapshot(snapshot?: string): any

    /**
     * Used to test that a function throws a error matching the most recent snapshot when it is called.
     */
    toThrowErrorMatchingSnapshot(): any

    /**
     * Use `.toThrowWithMessage` when checking if a callback function throws an error of a given type with a given error message.
     *
     * @param {Function} type
     * @param {String | RegExp} message
     */
    toThrowWithMessage(type: Function, message: string | RegExp): any
  }
}
