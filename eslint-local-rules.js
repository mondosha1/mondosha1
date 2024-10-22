'use strict'

module.exports = {
  'no-use-root-eslintrc': {
    meta: {
      docs: {
        description:
          'Ensure all project define a minimal set of rule ("eslint-config-elium/global"). This rule must be disabled in all implementation except the root eslintrc',
        category: 'Possible Errors',
        recommended: false
      },
      schema: []
    },
    create: function (context) {
      return {
        Program: function (node) {
          context.report({
            node,
            message: 'Please implement at least our elium/global extends in a custom .eslintrc.json for your app/lib.'
          })
        }
      }
    }
  }
}
