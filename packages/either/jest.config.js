module.exports = {
  name: 'either',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/either',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'either',
        output: 'report/unit/packages/either.xml'
      }
    ]
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$'
    }
  }
}
