module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
    'prettier/babel',
    'prettier/react',
    'prettier/@typescript-eslint'
  ],
  parser: '@typescript-eslint/parser',
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    strict: 'error',
    'check-constructor': 'off',
    'no-comma-dangle': 'off',
    'no-empty-interface': 'off',
    'no-unused-vars': 'off',

    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-deprecated': 'error',
    'react/display-name': 'off',
    'react/prop-types': 'off',

    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',

    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-use-before-define': 'off'
  }
}
