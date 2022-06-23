module.exports = {
  setupFiles: [
    'jsdom-worker',
  ],
  transform: {
    '^.+\\.[jt]s$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules[\\\\/](?!(data-uri-to-buffer|formdata-polyfill|fetch-blob|node-fetch)[\\\\/])',
  ],
}
