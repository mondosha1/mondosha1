module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'prettier/@typescript-eslint'],
  plugins: ['unicorn', 'rxjs', 'functional', 'import', '@nrwl/nx', 'eslint-plugin-local-rules'],
  rules: {
    'arrow-parens': ['off', 'always'],
    'brace-style': ['off', 'off'],
    'eol-last': 'off',
    eqeqeq: ['error', 'always'],
    'new-parens': 'off',
    'no-param-reassign': 'error',
    'no-console': ['error', { allow: ['error'] }],
    'no-constant-condition': 'error',
    'no-unused-expressions': 'off',
    'no-control-regex': 'error',
    'no-extra-semi': 'off',
    'no-invalid-regexp': 'error',
    'no-regex-spaces': 'error',
    'no-return-await': 'error',
    'no-duplicate-case': 'error',
    'no-empty-character-class': 'error',
    'no-ex-assign': 'error',
    'no-extra-boolean-cast': 'error',
    'no-inner-declarations': 'error',
    'no-shadow': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': 'off',
    'no-mixed-spaces-and-tabs': 'error',
    'no-sparse-arrays': 'error',
    'no-var': 'error',
    'no-restricted-imports': [
      'error',
      {
        paths: [
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
    'id-denylist': [
      'error',
      'any',
      'Number',
      'number',
      'String',
      'string',
      'Boolean',
      'boolean',
      'Undefined',
      'undefined'
    ],
    'prefer-arrow/prefer-arrow-functions': 'off',
    'quote-props': 'off',
    'max-len': 'off',
    'space-before-function-paren': 'off',
    'space-in-parens': ['off', 'never'],
    'valid-typeof': 'error',
    'functional/no-let': 'error',
    'functional/no-loop-statement': 'error',
    'functional/no-method-signature': 'error',
    'import/no-default-export': 'error',
    'import/order': ['error', { alphabetize: { order: 'asc', caseInsensitive: true } }],
    'jsdoc/check-alignment': 'off',
    'jsdoc/newline-after-description': 'off',
    'jsdoc/no-types': 'off',
    'local-rules/no-use-root-eslintrc': 'off',
    'rxjs/no-internal': 'error',
    'unicorn/filename-case': 'error',
    '@nrwl/nx/enforce-module-boundaries': [
      'error',
      {
        allow: ['@angular/core/testing', '@mondosha1/shared/data-core/mocks', '@mondosha1/shared/util/testing'],
        depConstraints: [
          {
            sourceTag: 'platform:desktop',
            onlyDependOnLibsWithTags: ['platform:desktop']
          },
          {
            sourceTag: 'platform:server',
            onlyDependOnLibsWithTags: ['platform:server']
          },
          {
            sourceTag: 'scope:accounts',
            onlyDependOnLibsWithTags: ['scope:accounts', 'scope:shared']
          },
          {
            sourceTag: 'scope:ads-manager',
            onlyDependOnLibsWithTags: ['scope:ads-manager', 'scope:accounts', 'scope:shared']
          },
          {
            sourceTag: 'scope:api',
            onlyDependOnLibsWithTags: ['scope:api', 'scope:shared']
          },
          {
            sourceTag: 'scope:benten-doc',
            onlyDependOnLibsWithTags: ['scope:benten-doc', 'scope:shared']
          },
          {
            sourceTag: 'scope:creative-store',
            onlyDependOnLibsWithTags: ['scope:creative-store', 'scope:shared']
          },
          {
            sourceTag: 'scope:director',
            onlyDependOnLibsWithTags: ['scope:director', 'scope:shared']
          },
          {
            sourceTag: 'scope:eliauth',
            onlyDependOnLibsWithTags: ['scope:eliauth', 'scope:shared']
          },
          {
            sourceTag: 'scope:extension',
            onlyDependOnLibsWithTags: ['scope:extension', 'scope:shared']
          },
          {
            sourceTag: 'scope:demo',
            onlyDependOnLibsWithTags: ['scope:demo', 'scope:creative-store', 'scope:shared']
          },
          {
            sourceTag: 'scope:hasura',
            onlyDependOnLibsWithTags: ['scope:hasura', 'scope:shared']
          },
          {
            sourceTag: 'scope:shared',
            onlyDependOnLibsWithTags: ['scope:shared']
          },
          {
            sourceTag: 'scope:site-mondosha1',
            onlyDependOnLibsWithTags: ['scope:site-mondosha1', 'scope:website', 'scope:shared']
          },
          {
            sourceTag: 'scope:site-emoteev',
            onlyDependOnLibsWithTags: ['scope:site-emoteev', 'scope:website', 'scope:shared']
          },
          {
            sourceTag: 'scope:tera',
            onlyDependOnLibsWithTags: ['scope:tera', 'scope:shared']
          },
          {
            sourceTag: 'scope:ugonacho',
            onlyDependOnLibsWithTags: ['scope:ugonacho', 'scope:shared']
          },
          {
            sourceTag: 'scope:website',
            onlyDependOnLibsWithTags: ['scope:website', 'scope:shared']
          },
          {
            sourceTag: 'scope:whatsnew',
            onlyDependOnLibsWithTags: ['scope:whatsnew', 'scope:shared']
          },
          {
            sourceTag: 'type:app',
            onlyDependOnLibsWithTags: [
              'type:feature',
              'type:framework',
              'type:data',
              'type:env',
              'type:ui',
              'type:util'
            ]
          },
          {
            sourceTag: 'type:data',
            onlyDependOnLibsWithTags: ['type:data', 'type:env', 'type:util', 'type:framework']
          },
          {
            sourceTag: 'type:env',
            onlyDependOnLibsWithTags: ['type:env', 'type:util']
          },
          {
            sourceTag: 'type:e2e',
            onlyDependOnLibsWithTags: ['type:e2e']
          },
          {
            sourceTag: 'type:feature',
            onlyDependOnLibsWithTags: [
              'type:feature',
              'type:framework',
              'type:data',
              'type:env',
              'type:ui',
              'type:util'
            ]
          },
          {
            sourceTag: 'type:framework',
            onlyDependOnLibsWithTags: ['type:framework', 'type:data', 'type:util', 'type:ui']
          },
          {
            sourceTag: 'type:it',
            onlyDependOnLibsWithTags: ['type:it', 'type:app', 'type:data', 'type:util']
          },
          {
            sourceTag: 'type:ui',
            onlyDependOnLibsWithTags: ['type:ui', 'type:framework', 'type:util', 'type:data']
          },
          {
            sourceTag: 'type:util',
            onlyDependOnLibsWithTags: ['type:util', 'type:data']
          }
        ],
        enforceBuildableLibDependency: true
      }
    ],
    '@typescript-eslint/array-type': [
      'error',
      {
        default: 'array'
      }
    ],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/ban-types': [
      'error',
      {
        types: {
          Object: 'Avoid using the `Object` type. Did you mean `object`?',
          Function: 'Avoid using the `Function` type. Prefer a specific function type, like `() => void`.',
          Boolean: 'Avoid using the `Boolean` type. Did you mean `boolean`?',
          Number: 'Avoid using the `Number` type. Did you mean `number`?',
          String: 'Avoid using the `String` type. Did you mean `string`?',
          Symbol: 'Avoid using the `Symbol` type. Did you mean `symbol`?'
        },
        extendDefaults: false
      }
    ],
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/member-delimiter-style': [
      'off',
      {
        multiline: {
          delimiter: 'none',
          requireLast: true
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/member-ordering': [
      'off',
      {
        default: [
          'public-static-field',
          'protected-static-field',
          'private-static-field',
          'public-instance-field',
          'protected-instance-field',
          'private-instance-field',
          'public-constructor',
          'protected-constructor',
          'private-constructor',
          'public-static-method',
          'protected-static-method',
          'private-static-method',
          'public-instance-method',
          'protected-instance-method',
          'private-instance-method'
        ]
      }
    ],
    '@typescript-eslint/naming-convention': [
      'error',
      { selector: 'variable', format: ['camelCase', 'PascalCase', 'UPPER_CASE'], leadingUnderscore: 'allow' }
    ],
    '@typescript-eslint/no-inferrable-types': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/no-shadow': ['error'],
    '@typescript-eslint/no-unused-expressions': ['error'],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/no-dynamic-delete': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/semi': ['off', null],
    '@typescript-eslint/type-annotation-spacing': 'off'
  }
}
