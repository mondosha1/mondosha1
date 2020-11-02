const nxPreset = require('@nrwl/jest/preset')
module.exports = {
  ...nxPreset,
  globals: {
    'ts-jest': {
      packageJson: process.env.TS_JEST_PACKAGE_JSON || 'package.json',
      tsConfig: './tsconfig.spec.json',
      stringifyContentPathRegex: '\\.(html|svg)$',
      astTransformers: [
        'jest-preset-angular/build/InlineFilesTransformer',
        'jest-preset-angular/build/StripStylesTransformer'
      ]
    }
  },
  testMatch: ['**/+(*.)+(spec).+(ts|js)?(x)'],
  transform: {
    '^.+\\.(ts|js|html|svg)$': 'ts-jest'
  },
  resolver: '@nrwl/jest/plugins/resolver',
  moduleFileExtensions: ['ts', 'js', 'html', 'svg', 'json'],
  testPathIgnorePatterns: ['node_modules'],
  transformIgnorePatterns: ['node_modules'],
  reporters: ['jest-silent-reporter', 'jest-junit'],
  collectCoverage: true,
  coverageReporters: ['cobertura'],
  snapshotSerializers: [
    'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
    'jest-preset-angular/build/AngularSnapshotSerializer',
    'jest-preset-angular/build/HTMLCommentSerializer'
  ]
}
