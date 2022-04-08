module.exports = {
  name: 'decorators',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/decorators',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'decorators',
        output: 'report/unit/packages/decorators.xml'
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
