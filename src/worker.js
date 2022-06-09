/* eslint-disable no-new-func, no-restricted-globals */
import resolvePath from 'resolve-pathname'

const requireCache = new Map()

async function fetchScript(url) {
  const resp = await fetch(url, {
    cache: 'force-cache',
  })
  return resp.text()
}

function getAbsolutePath(path) {
  return `${path[0] === '/' ? '' : '/'}${path}`
}

function getRequire(baseDir = '/') {
  return (path) => {
    const module = {
      exports: {},
    }

    const filenameWithoutExt = path.replace(/\.js$/, '').replace(/^\S*?([^/]+)$/, '$1')
    const filename = `${filenameWithoutExt}.js`
    const dirname = resolvePath(path.replace(/^(\S*?)[^/]+$/, '$1'), baseDir).replace(/\/$/, '')
    const dirnameWithSlash = `${dirname}/`
    const isRoot = !dirname.length
    const fn = requireCache.get(dirnameWithSlash + filename)
      || requireCache.get(dirnameWithSlash + filenameWithoutExt)
      || requireCache.get(`${dirnameWithSlash}${filenameWithoutExt}/index.js`)
    if (fn) {
      fn(
        module.exports,
        getRequire(dirnameWithSlash),
        module,
        filename,
        isRoot ? '/' : dirname,
      )
      return module.exports
    }
    throw new Error(`module "${path}" not found`)
  }
}

const requireFn = getRequire()

const fns = {
  async require(files) {
    const scripts = (await Promise.all(files.map(async (file) => ({
      path: getAbsolutePath(file.path),
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
    return requireFn(path)(...args)
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
