module.exports = {
  // setupFiles: [
  //   'jsdom-worker',
  // ],
  transform: {
    '^.+\\.[jt]s$': 'babel-jest',
    '^.+\\.plugin\\.worker\\.txt$': 'jest-text-transformer',
  },
  transformIgnorePatterns: [
    'node_modules[\\\\/](?!(data-uri-to-buffer|formdata-polyfill|fetch-blob|node-fetch)[\\\\/])',
  ],
}
