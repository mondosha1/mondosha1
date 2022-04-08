module.exports = {
  name: 'core',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/core',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'core',
        output: 'report/unit/packages/core.xml'
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
