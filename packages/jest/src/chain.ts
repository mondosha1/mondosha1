// Inspired from https://github.com/mattphillips/jest-chain
const chainMatchers = (matchers, originalMatchers = matchers) => {
  const mappedMatchers = Object.keys(matchers).map(name => {
    const matcher = matchers[name]
    if (typeof matcher === 'function') {
      return {
        [name]: (...args) => {
          matcher(...args) // run matcher
          return chainMatchers(originalMatchers) // chain the original matchers again
        }
      }
    }
    return {
      [name]: chainMatchers(matcher, originalMatchers) // recurse on .not/.resolves/.rejects
    }
  })
  return Object.assign({}, ...mappedMatchers)
}

export const chain = expect => {
  // proxy the expect function
  // tslint:disable-next-line:no-let
  let expectProxy = Object.assign(
    (...args) => chainMatchers(expect(...args)), // partially apply expect to get all matchers and chain them
    expect // clone additional properties on expect
  )

  expectProxy.extend = o => {
    expect.extend(o) // add new matchers to expect
    expectProxy = Object.assign(expectProxy, expect) // clone new asymmetric matchers
  }

  return expectProxy
}
