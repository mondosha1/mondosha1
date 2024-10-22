module.exports = {
  extends: ['plugin:@typescript-eslint/recommended', 'prettier', 'plugin:prettier/recommended'],
  plugins: ['unicorn', 'rxjs', 'functional', 'import', '@nrwl/nx', 'eslint-plugin-local-rules'],
  rules: {
    'arrow-parens': ['off', 'always'],
    'brace-style': ['off', 'off'],
    curly: 'error',
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
    'no-implicit-coercion': 'error',
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
          '@progress/kendo-angular-dialog',
          {
            name: 'lodash/fp',
            importNames: ['differenceBy']
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
        allow: ['@angular/core/testing', '@mondosha1/shared/util/testing'],
        depConstraints: [
          {
            sourceTag: 'platform:desktop',
            onlyDependOnLibsWithTags: ['platform:desktop']
          },
          {
            sourceTag: 'platform:server',
            onlyDependOnLibsWithTags: ['platform:server', 'platform:temporal']
          },
          {
            sourceTag: 'platform:temporal',
            onlyDependOnLibsWithTags: ['platform:temporal', 'platform:server']
          },
          {
            sourceTag: 'platform:infra',
            onlyDependOnLibsWithTags: ['platform:infra']
          },
          {
            sourceTag: 'scope:accounts',
            onlyDependOnLibsWithTags: [
              'scope:accounts',
              'scope:internal',
              'scope:hasura',
              'scope:shared',
              'scope:benten'
            ]
          },
          {
            sourceTag: 'scope:accounts-chart',
            onlyDependOnLibsWithTags: ['scope:accounts-chart', 'scope:shared']
          },
          {
            sourceTag: 'scope:api',
            onlyDependOnLibsWithTags: [
              'scope:api',
              'scope:dv360',
              'scope:hasura',
              'scope:ikenga',
              'scope:looker',
              'scope:maestro',
              'scope:temporal',
              'scope:third-party',
              'scope:shared'
            ]
          },
          {
            sourceTag: 'scope:benten-doc',
            onlyDependOnLibsWithTags: ['scope:benten-doc', 'scope:shared', 'scope:benten']
          },
          {
            sourceTag: 'scope:creative-store',
            onlyDependOnLibsWithTags: ['scope:creative-store', 'scope:hasura', 'scope:shared', 'scope:benten']
          },
          {
            sourceTag: 'scope:dashboard',
            onlyDependOnLibsWithTags: ['scope:dashboard', 'scope:shared']
          },
          {
            sourceTag: 'scope:dashboard-chart',
            onlyDependOnLibsWithTags: ['scope:dashboard-chart', 'scope:shared']
          },
          {
            sourceTag: 'scope:director',
            onlyDependOnLibsWithTags: ['scope:director', 'scope:shared']
          },
          {
            sourceTag: 'scope:demo',
            onlyDependOnLibsWithTags: [
              'scope:demo',
              'scope:hasura',
              'scope:creative-store',
              'scope:shared',
              'scope:benten'
            ]
          },
          {
            sourceTag: 'scope:hasura',
            onlyDependOnLibsWithTags: ['scope:hasura', 'scope:shared']
          },
          {
            sourceTag: 'scope:ikenga',
            onlyDependOnLibsWithTags: ['scope:ikenga', 'scope:hasura', 'scope:shared', 'scope:temporal']
          },
          {
            sourceTag: 'scope:insight',
            onlyDependOnLibsWithTags: [
              'scope:insight',
              'scope:client',
              'scope:looker',
              'scope:hasura',
              'scope:benten',
              'scope:shared'
            ]
          },
          {
            sourceTag: 'scope:looker',
            onlyDependOnLibsWithTags: ['scope:looker', 'scope:hasura', 'scope:shared']
          },
          {
            sourceTag: 'scope:shared',
            onlyDependOnLibsWithTags: ['scope:shared', 'scope:benten']
          },
          {
            sourceTag: 'scope:ugonacho',
            onlyDependOnLibsWithTags: ['scope:ugonacho', 'scope:shared']
          },
          {
            sourceTag: 'scope:whatsnew',
            onlyDependOnLibsWithTags: ['scope:whatsnew', 'scope:hasura', 'scope:shared', 'scope:benten']
          },
          {
            sourceTag: 'scope:temporal-worker',
            onlyDependOnLibsWithTags: [
              'scope:temporal',
              'scope:temporal-worker',
              'scope:hasura',
              'scope:dv360',
              'scope:ikenga',
              'scope:maestro',
              'scope:tam',
              'scope:third-party',
              'scope:shared'
            ]
          },
          {
            sourceTag: 'scope:temporal',
            onlyDependOnLibsWithTags: ['scope:temporal', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-argocd',
            onlyDependOnLibsWithTags: ['scope:infra-argocd', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-temporal-server',
            onlyDependOnLibsWithTags: ['scope:infra-temporal-server', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-cert-manager',
            onlyDependOnLibsWithTags: ['scope:infra-cert-manager', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-elasticsearch',
            onlyDependOnLibsWithTags: ['scope:infra-elasticsearch', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-external-dns',
            onlyDependOnLibsWithTags: ['scope:infra-external-dns', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-ingress-nginx',
            onlyDependOnLibsWithTags: ['scope:infra-ingress-nginx', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-n8n',
            onlyDependOnLibsWithTags: ['scope:infra-n8n', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-prometheus-stack',
            onlyDependOnLibsWithTags: ['scope:infra-prometheus-stack', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-redash',
            onlyDependOnLibsWithTags: ['scope:infra-redash', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-oauth2-proxy',
            onlyDependOnLibsWithTags: ['scope:infra-oauth2-proxy', 'scope:shared']
          },
          {
            sourceTag: 'scope:infra-s3-proxy',
            onlyDependOnLibsWithTags: ['scope:infra-s3-proxy', 'scope:shared']
          },
          {
            sourceTag: 'scope:heroiks-live',
            onlyDependOnLibsWithTags: [
              'scope:accounts',
              'scope:client',
              'scope:internal',
              'scope:hasura',
              'scope:heroiks-live',
              'scope:insight',
              'scope:looker',
              'scope:plan',
              'scope:shared'
            ]
          },
          {
            sourceTag: 'scope:plan',
            onlyDependOnLibsWithTags: [
              'scope:plan',
              'scope:client',
              'scope:hasura',
              'scope:heroiks-live',
              'scope:benten',
              'scope:shared'
            ]
          },
          {
            sourceTag: 'scope:heroiks-live-chart',
            onlyDependOnLibsWithTags: ['scope:heroiks-live-chart', 'scope:shared']
          },
          {
            sourceTag: 'scope:search-foresight',
            onlyDependOnLibsWithTags: ['scope:search-foresight', 'scope:hasura', 'scope:shared', 'scope:benten']
          },
          {
            sourceTag: 'scope:semantic-booster',
            onlyDependOnLibsWithTags: [
              'scope:semantic-booster',
              'scope:search-foresight',
              'scope:hasura',
              'scope:shared'
            ]
          },
          {
            sourceTag: 'scope:semantic-booster-chart',
            onlyDependOnLibsWithTags: ['scope:semantic-booster-chart', 'scope:shared']
          },
          {
            sourceTag: 'scope:dv360',
            onlyDependOnLibsWithTags: ['scope:dv360', 'scope:temporal', 'scope:shared']
          },
          {
            sourceTag: 'type:activity',
            onlyDependOnLibsWithTags: ['type:data', 'type:util', 'type:framework']
          },
          {
            sourceTag: 'type:app',
            onlyDependOnLibsWithTags: [
              'type:activity',
              'type:feature',
              'type:framework',
              'type:data',
              'type:env',
              'type:ui',
              'type:util',
              'type:workflow'
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
            onlyDependOnLibsWithTags: ['type:e2e', 'type:util', 'type:data']
          },
          {
            sourceTag: 'type:feature',
            onlyDependOnLibsWithTags: [
              'type:activity',
              'type:feature',
              'type:framework',
              'type:data',
              'type:env',
              'type:ui',
              'type:util',
              'type:workflow'
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
          },
          {
            sourceTag: 'type:helm-chart',
            onlyDependOnLibsWithTags: ['type:helm-chart', 'type:util']
          },
          {
            sourceTag: 'type:workflow',
            onlyDependOnLibsWithTags: ['type:data', 'type:util', 'type:workflow', 'type:activity']
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
      'error',
      {
        multiline: {
          delimiter: 'none'
        },
        singleline: {
          delimiter: 'semi',
          requireLast: false
        }
      }
    ],
    '@typescript-eslint/member-ordering': [
      'error',
      {
        default: ['field', 'constructor', 'method']
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
