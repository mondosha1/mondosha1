const nxPreset = require('@nrwl/jest/preset')
module.exports = {
  ...nxPreset,
  globals: {
    'ts-jest': {
      stringifyContentPathRegex: '\\.(html|svg)$',
      tsconfig: '<rootDir>/tsconfig.spec.json'
    }
  },
  runInBand: true,
  transform: {
    '^.+\\.(ts|mjs|js|html|svg)$': 'jest-preset-angular'
  },
  snapshotSerializers: [
    'jest-preset-angular/build/serializers/no-ng-attributes',
    'jest-preset-angular/build/serializers/ng-snapshot',
    'jest-preset-angular/build/serializers/html-comment'
  ],
  transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
  reporters: ['jest-progress-bar-reporter']
}
