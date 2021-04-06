'use strict'

module.exports = {
  'no-use-root-eslintrc': {
    meta: {
      docs: {
        description:
          'Ensure all project define a minimal set of rule ("@elium/eslint-config/global"). This rule must be disabled in all implementation except the root eslintrc',
        category: 'Possible Errors',
        recommended: false
      },
      schema: []
    },
    create: function(context) {
      return {
        Program: function(node) {
          context.report({
            node,
            message:
              'Please implement at least our @elium/eslint-config/global extends in a custom .eslintrc.json for your app/lib.'
          })
        }
      }
    }
  }
}
