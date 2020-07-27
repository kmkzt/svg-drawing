// TODO: Add eslint-import-plugin
// TODO: Separate TypeScript config
// TODO: Separate test config
module.exports = {
  env: {
    node: true,
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
    'prettier/babel',
    'prettier/react',

    // TypeScript
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',

    // Test
    'plugin:jest/recommended',
  ],
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    strict: 'error',
    'one-var': ['error', 'never'],
    'check-constructor': 'off',
    'no-comma-dangle': 'off',
    'no-empty-interface': 'off',
    'no-unused-vars': 'off',

    // React
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-deprecated': 'error',
    'react/display-name': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off', // For Next.js

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'jsx-a11y/anchor-is-valid': 'off', // For Next.js

    // TypeScript
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',

    // Test
    'jest/no-test-callback': 'warn',
  },
}
