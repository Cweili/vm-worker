module.exports = {
  // setupFiles: [
  //   'jsdom-worker',
  // ],
  transform: {
    '^.+\\.[jt]s$': 'babel-jest',
    '^.+\\.plugin\\.txt$': './build/jest-transformer-text.js',
  },
  transformIgnorePatterns: [
    'node_modules[\\\\/](?!(data-uri-to-buffer|formdata-polyfill|fetch-blob|node-fetch)[\\\\/])',
  ],
}
