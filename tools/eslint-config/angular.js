module.exports = {
  rules: {
    '@angular-eslint/component-selector': [
      'error',
      {
        type: 'element',
        prefix: 'el',
        style: 'kebab-case'
      }
    ],
    '@angular-eslint/directive-selector': [
      'error',
      {
        type: 'attribute',
        prefix: 'el',
        style: 'camelCase'
      }
    ],
    '@angular-eslint/no-attribute-decorator': 'error',
    '@angular-eslint/no-input-rename': 'off',
    '@angular-eslint/no-output-on-prefix': 'off',
    '@angular-eslint/no-output-rename': 'off',
    '@angular-eslint/no-pipe-impure': 'error',
    '@angular-eslint/no-conflicting-lifecycle': 'off'
  }
}
