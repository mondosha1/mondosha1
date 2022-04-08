module.exports = {
  name: 'object',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/object',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'object',
        output: 'report/unit/packages/object.xml'
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
