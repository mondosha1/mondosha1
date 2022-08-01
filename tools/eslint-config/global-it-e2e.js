module.exports = {
  extends: ['mondosha1/global', 'mondosha1/global-next'],
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'functional/no-method-signature': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'unicorn/filename-case': ['error', { case: 'kebabCase', ignore: ['^\\d{12}_.*\\.ts$'] }]
      }
    }
  ]
}
