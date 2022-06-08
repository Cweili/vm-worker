/* eslint-disable no-new-func, no-restricted-globals */

async function fetchScript(url) {
  const resp = await fetch(url, {
    cache: 'force-cache',
  })
  return resp.text()
}

const requireCache = new Map()

function require(path) {
  const module = {
    exports: {},
  }

  const filenameWithoutExt = path.replace(/^\.\//, '').replace(/\.js$/, '')
  const filename = `${filenameWithoutExt}.js`
  const dirname = '.'
  const fn = requireCache.get(filename) || requireCache.get(filenameWithoutExt)
  if (fn) {
    fn(module.exports, require, module, filename, dirname)
    return module.exports
  }
  throw new Error(`module "${path}" not found`)
}

const fns = {
  async require(files) {
    const scripts = (await Promise.all(files.map(async (file) => ({
      path: file.path,
      fn: new Function(
        'exports',
        'require',
        'module',
        '__filename',
        '__dirname',
        file.url ? await fetchScript(file.url) : file.src,
      ),
    }))))
    scripts.forEach((script) => {
      requireCache.set(script.path, script.fn)
    })
  },

  async exec(path, ...args) {
    // eslint-disable-next-line import/no-dynamic-require
    return require(path)(...args)
  },
}

self.addEventListener('message', (e) => {
  const {
    id,
    fn,
    args,
  } = e.data
  if (fns[fn]) {
    fns[fn](...args).then((result) => {
      self.postMessage({
        id,
        result,
      })
    }).catch((error) => {
      self.postMessage({
        id,
        error: {
          name: error.name,
          stack: error.stack,
        },
      })
    })
  }
}, false)
