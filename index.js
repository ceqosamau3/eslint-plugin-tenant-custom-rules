// project-root/eslint-plugin-tenant-custom-rules/index.js

const { ESLintUtils } = require('@typescript-eslint/experimental-utils')

const createRule = ESLintUtils.RuleCreator((name) => name)


const noStaticTenantRule = createRule({
  name: 'no-static-tenant',
  meta: {
    type: 'problem',
    docs: {
      description: 'Avoid the use of static tenant names',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      Program(node) {
        const sourceCode = context.getSourceCode()
        const lines = sourceCode.getLines()
        const allowedTenants = context.options[0] || []
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].toLowerCase()

          const foundTenant = allowedTenants.find((tenant) => line.includes(tenant))

          if (foundTenant) {
            context.report({
              loc: {
                start: { line: i + 1, column: 0 },
                end: { line: i + 1, column: lines[i].length },
              },
              message: `Found static tenant "${foundTenant}" in the file. Avoid using static tenant names. Consider using an environment variable for the tenant.`,
            })
          }
        }
      },
    }
  },
})

module.exports = {
  rules: {
    'no-static-tenant': noStaticTenantRule,
  },
}
