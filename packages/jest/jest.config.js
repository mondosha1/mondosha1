module.exports = {
  name: 'jest',
  preset: '../../jest-preset.js',
  coverageDirectory: '../../coverage/packages/jest',
  testEnvironment: 'node',
  reporters: [
    'jest-silent-reporter',
    [
      'jest-junit',
      {
        suiteName: 'jest',
        output: 'report/unit/packages/jest.xml'
      }
    ]
  ]
}
