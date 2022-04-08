module.exports = {
  name: 'image',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/image',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'image',
        output: 'report/unit/packages/image.xml'
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
