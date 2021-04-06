module.exports = {
  extends: '@elium/eslint-config/angular',
  rules: {
    '@angular-eslint/prefer-on-push-component-change-detection': 'error',
    '@angular-eslint/no-input-rename': 'error',
    '@angular-eslint/no-output-on-prefix': 'error',
    '@angular-eslint/no-output-rename': 'error',
    '@angular-eslint/use-component-view-encapsulation': 'error'
  }
}
