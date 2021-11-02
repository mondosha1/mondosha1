const nxPreset = require('@nrwl/jest/preset')
module.exports = {
  ...nxPreset,
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: {
        before: ['jest-preset-angular/build/InlineFilesTransformer', 'jest-preset-angular/build/StripStylesTransformer']
      },
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  runInBand: true,
  detectOpenHandles: true,
  testMatch: ['**/+(*.)+(spec).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html|svg)$': 'ts-jest'
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html', 'svg', 'json'],
  testPathIgnorePatterns: ['node_modules'],
  transformIgnorePatterns: ['node_modules'],
  reporters: ['jest-progress-bar-reporter', 'jest-junit'],
  collectCoverage: true,
  coverageReporters: ['cobertura'],
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ]
}
