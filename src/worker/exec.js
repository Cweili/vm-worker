// eslint-disable-next-line import/no-extraneous-dependencies
import resolvePathname from 'resolve-pathname'

const DEFAULT_ENTRY = 'index'
const DEFAULT_EXT = '.js'

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
  return (path, originalPath) => {
    const module = {
      exports: {},
    }

    const isRelative = path[0] === '.'
    const [, dirNameMatched, fileNameMatched] = /((?:[^/]*\/)*)(.*)/.exec(path.replace(/\.js$/, ''))
    const fileNameWithoutExt = (!dirNameMatched || !fileNameMatched)
      ? DEFAULT_ENTRY
      : fileNameMatched
    const dirNameWithSlash = `${
      isRelative
        ? resolvePathname(fileNameMatched === '..' ? '../' : dirNameMatched, baseDir).replace(/\/$/, '')
        : `/${dirNameMatched ? dirNameMatched.substr(0, dirNameMatched.length - 1) : path}`
    }/`.replace(/\/\//g, '/')

    const alternative = [
      [
        dirNameWithSlash,
        fileNameWithoutExt,
        DEFAULT_EXT,
      ],
      [
        dirNameWithSlash,
        fileNameWithoutExt,
        '',
      ],
      [
        `${dirNameWithSlash}${fileNameWithoutExt}/`,
        DEFAULT_ENTRY,
        DEFAULT_EXT,
      ],
      [
        `${dirNameWithSlash}${fileNameWithoutExt}/`,
        DEFAULT_ENTRY,
        '',
      ],
    ]

    let filePath
    let fileName
    let dirName
    let fn
    for (let i = 0; i < alternative.length; i++) {
      filePath = alternative[i].join('')
      fn = srcCache.get(filePath)
      if (fn) {
        // eslint-disable-next-line prefer-destructuring
        dirName = alternative[i][0]
        fileName = alternative[i][1] + alternative[i][2]
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
        getRequire(dirName),
        module,
        fileName,
        dirName,
      )
      requireCache.set(filePath, module.exports)
      return module.exports
    }
    throw new Error(`module "${originalPath || path}" not found`)
  }
}

const requireModule = getRequire()

function nameFunction(name, fn) {
  Object.defineProperty(fn, 'name', {
    value: name,
    writable: false,
  })
  return fn
}

export default function setup(pluginSetups) {
  return {
    async require(debug, files) {
      const scripts = (await Promise.all(files.map(async (file) => ({
        path: getAbsolutePath(file.path),
        fn: nameFunction(
          file.path,
          new Function(
            'exports',
            'require',
            'module',
            '__filename',
            '__dirname',
            (debug ? `console.warn('[VmWorker] Debug "${file.path}" by tracing this stack.');\n` : '')
            + [file.url ? await fetchScript(file.url) : file.src].concat(pluginSetups.onLoad)
              .reduce((result, reducer) => reducer(result)),
          ),
        ),
      }))))
      scripts.forEach((script) => {
        srcCache.set(script.path, script.fn)
      })
    },

    exec(debug, path, ...args) {
      return new Promise((resolve, reject) => {
        try {
          resolve(requireModule(getAbsolutePath(path), path)(...args))
        } catch (err) {
          if (debug) {
            console.error('[VmWorker]', err)
            // eslint-disable-next-line no-debugger
            debugger
          }
          reject(err)
        }
      })
    },
  }
}
