module.exports = {
  extends: 'mondosha1/global',
  plugins: ['ban'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: [
          'lodash',
          '@progress/kendo-angular-dialog',
          {
            name: 'rxjs/operators',
            importNames: ['tap'],
            message: 'Prefer use tap from @mondosha1/shared/util'
          },
          {
            name: 'lodash/fp',
            importNames: ['tap', 'differenceBy']
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
    'no-empty': 'error'
  }
}
