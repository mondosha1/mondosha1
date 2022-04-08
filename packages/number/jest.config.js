module.exports = {
  name: 'number',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/number',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'number',
        output: 'report/unit/packages/number.xml'
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
