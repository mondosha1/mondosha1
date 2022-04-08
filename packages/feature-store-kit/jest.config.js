module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/feature-store-kit',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'feature-store-kit',
        output: 'report/unit/packages/feature-store-kit.xml'
      }
    ]
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$'
    }
  },
  displayName: 'feature-store-kit'
}
