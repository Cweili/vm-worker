module.exports = {
  extends: ['airbnb-base'],
  env: {
    browser: true,
    amd: false,
    es6: true,
    node: true,
    mocha: true,
    jest: true,
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  rules: {
    'default-param-last': ['off'],
    'no-console': ['off'],
    'no-multi-assign': ['off'],
    'no-new-func': ['off'],
    'no-plusplus': ['off'],
    'no-underscore-dangle': ['off'],
    'prefer-destructuring': ['off'],
    'prefer-object-spread': ['off'],
    semi: ['error', 'never'],
  },
}
