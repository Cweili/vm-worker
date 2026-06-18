import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  {
    ignores: ['dist/', 'node_modules/', 'coverage/', 'build/', 'docs/dist/', 'docs/node_modules/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['src/**/*.{js,jsx,ts,tsx}', 'tests/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'default-param-last': 'off',
      'no-console': 'off',
      'no-multi-assign': 'off',
      'no-new-func': 'off',
      'no-plusplus': 'off',
      'no-underscore-dangle': 'off',
      'prefer-destructuring': 'off',
      'prefer-object-spread': 'off',
      semi: ['error', 'never'],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-wrapper-object-types': 'off',
      '@typescript-eslint/no-unsafe-function-type': 'off',
    },
  },
]
