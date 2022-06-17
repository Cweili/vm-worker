/* eslint-disable no-new-func, no-restricted-globals */
import resolvePath from 'resolve-pathname'

const srcCache = new Map()
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
    const exports = requireCache.get(path)
    if (exports) {
      return exports
    }

    const module = {
      exports: {},
    }

    const filenameWithoutExt = path.replace(/\.js$/, '').replace(/^\S*?([^/]+)$/, '$1')
    const filename = `${filenameWithoutExt}.js`
    const dirname = resolvePath(path.replace(/^(\S*?)[^/]+$/, '$1'), baseDir).replace(/\/$/, '')
    const dirnameWithSlash = `${dirname}/`
    const isRoot = !dirname.length
    const alternative = [
      dirnameWithSlash + filename,
      dirnameWithSlash + filenameWithoutExt,
      `${dirnameWithSlash}${filenameWithoutExt}/index.js`,
    ]
    let filePath
    let fn
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < alternative.length; i++) {
      fn = srcCache.get(alternative[i])
      if (fn) {
        filePath = alternative[i]
        break
      }
    }
    if (fn) {
      fn(
        module.exports,
        getRequire(dirnameWithSlash),
        module,
        filename,
        isRoot ? '/' : dirname,
      )
      requireCache.set(filePath, module.exports)
      return module.exports
    }
    throw new Error(`module "${path}" not found`)
  }
}

const requireModule = getRequire()

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
      srcCache.set(script.path, script.fn)
    })
  },

  async exec(path, ...args) {
    return requireModule(path)(...args)
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
          message: error.message,
          stack: error.stack,
        },
      })
    })
  }
}, false)
