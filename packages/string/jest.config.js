module.exports = {
  name: 'string',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/string',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'string',
        output: 'report/unit/packages/string.xml'
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
