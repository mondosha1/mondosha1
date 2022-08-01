module.exports = {
  extends: 'mondosha1/global',
  plugins: ['ban'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          '.',
          '..',
          '../..',
          '../../..',
          '../../../..',
          './',
          '../',
          '../../',
          '../../../',
          '../../../../',
          './index',
          '../index',
          '../../index',
          '../../../index',
          '../../../../index',
          'lodash',
          '@progress/kendo-angular-dialog',
          {
            name: 'lodash/fp',
            importNames: ['differenceBy', 'get']
          },
          {
            name: '@ngrx/store',
            importNames: ['props']
          }
        ]
      }
    ],
    'ban/ban': [
      'error',
      {
        name: 'eval',
        message: "Don't use it."
      },
      {
        name: ['*', 'forEach'],
        message: 'Use an expression instead.'
      },
      {
        name: ['*', 'forEachRight'],
        message: 'Use an expression instead.'
      },
      {
        name: 'forEach',
        message: 'Use an expression instead.'
      },
      {
        name: 'forEachRight',
        message: 'Use an expression instead.'
      },
      {
        name: 'forEachObject',
        message: 'Use an expression instead.'
      },
      {
        name: ['*', 'toString'],
        message: "Use 'String()' instead."
      }
    ],
    'arrow-body-style': ['error', 'as-needed'],
    'prefer-template': 'error',
    'no-empty': 'error',
    '@typescript-eslint/no-empty-function': [
      'error',
      {
        allow: ['protected-constructors', 'private-constructors']
      }
    ],
    '@typescript-eslint/explicit-function-return-type': [
      'error',
      {
        allowExpressions: true
      }
    ],
    '@typescript-eslint/explicit-member-accessibility': ['error', { accessibility: 'explicit' }],
    '@typescript-eslint/no-type-alias': [
      'error',
      {
        allowAliases: 'always',
        allowCallbacks: 'always',
        allowConditionalTypes: 'always',
        allowConstructors: 'always',
        allowGenerics: 'always',
        allowLiterals: 'in-unions-and-intersections',
        allowMappedTypes: 'always',
        allowTupleTypes: 'always'
      }
    ]
  }
}
