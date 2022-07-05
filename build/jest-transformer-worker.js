/* eslint-disable import/no-extraneous-dependencies */
const { statSync, readFileSync } = require('fs')

const cache = {}

function randomId() {
  return Math.ceil(Math.random() * 1e10).toString(36)
}

module.exports = {
  canInstrument: false,

  getCacheKey(fileData, filename) {
    const stat = statSync(filename)
    let cached = cache[filename]

    if (!cached) {
      cached = cache[filename] = {
        lastModified: stat.atimeMs,
        hash: randomId(),
      }
    }

    if (stat.atimeMs > cached.lastModified) {
      cache[filename] = {
        ...cached,
        lastModified: stat.atimeMs,
        hash: randomId(),
      }
    }

    return cached.hash
  },

  process() {
    return {
      code: 'module.exports = require("../../src/worker")',
    }
  },
}
