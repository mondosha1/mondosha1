module.exports = {
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/jest',
  testEnvironment: 'node',
  passWithNoTests: true,
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'jest',
        output: 'report/unit/packages/jest.xml'
      }
    ]
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],

  displayName: 'jest'
}
