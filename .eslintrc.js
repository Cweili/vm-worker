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
  rules: {
    'default-param-last': ['off'],
    'no-multi-assign': ['off'],
    'no-underscore-dangle': ['off'],
    semi: ['error', 'never'],
  },
}
