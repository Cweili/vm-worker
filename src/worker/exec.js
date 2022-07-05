/* eslint-disable no-new-func */
// eslint-disable-next-line import/no-extraneous-dependencies
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
    const module = {
      exports: {},
    }

    const pathParts = /((?:[^/]*\/)*)(.*)/.exec(path.replace(/\.js$/, ''))
    const filenameWithoutExt = (!pathParts[2] || pathParts[2] === '..') ? 'index' : pathParts[2]
    const filename = `${filenameWithoutExt}.js`
    const dirname = resolvePath(pathParts[2] === '..' ? '../' : pathParts[1], baseDir).replace(/\/$/, '')
    const dirnameWithSlash = `${dirname}/`
    const isRoot = !dirname.length
    const alternative = [
      dirnameWithSlash + filename,
      dirnameWithSlash + filenameWithoutExt,
    ]
    let filePath
    let fn
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < alternative.length; i++) {
      fn = srcCache.get(alternative[i])
      if (fn) {
        filePath = alternative[i]

        const exports = requireCache.get(filePath)
        if (exports) {
          return exports
        }

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

export default function setup(pluginSetups) {
  return {
    async require(files) {
      const scripts = (await Promise.all(files.map(async (file) => ({
        path: getAbsolutePath(file.path),
        fn: new Function(
          'exports',
          'require',
          'module',
          '__filename',
          '__dirname',
          [file.url ? await fetchScript(file.url) : file.src].concat(pluginSetups.onLoad)
            .reduce((result, reducer) => reducer(result)),
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
}