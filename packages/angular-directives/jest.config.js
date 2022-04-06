module.exports = {
  name: 'angular-directives',
  preset: '../../jest.preset.js',
  coverageDirectory: '../../coverage/packages/angular-directives',
  reporters: [
    'jest-progress-bar-reporter',
    [
      'jest-junit',
      {
        suiteName: 'angular-directives',
        output: 'report/unit/packages/angular-directives.xml'
      }
    ]
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        before: ['jest-preset-angular/build/InlineFilesTransformer', 'jest-preset-angular/build/StripStylesTransformer']
      }
    }
  }
}
