const DEFAULT_ENTRY = '/index'
const DEFAULT_EXT = '.js'

const srcCache = new Map<string, Function>()
const requireCache = new Map<string, any>()

async function fetchScript(url: string): Promise<string> {
  const resp = await fetch(url, {
    cache: 'force-cache',
  })
  return resp.text()
}

function isFunction(value: any): boolean {
  const type = Object.prototype.toString.call(value)

  return type === '[object Function]'
    || type === '[object GeneratorFunction]'
    || type === '[object AsyncFunction]'
}

function getAbsolutePath(path: string): string {
  return `${path[0] === '/' ? '' : '/'}${path}`
}

function resolvePath(baseDir: string, relativePath: string): string {
  if (relativePath[0] !== '.') {
    return getAbsolutePath(relativePath)
  }
  const path = baseDir.split('/')
  const segs: string[] = []
  segs.push(...relativePath.split('/'))
  path.pop()

  for (const seg of segs) {
    if (seg === '..') {
      path.pop()
    } else if (seg !== '.') {
      path.push(seg)
    }
  }

  const result = path.join('/')

  return result === '/' ? '' : result
}

function getRequire(baseDir = '/') {
  return (path: string, originalPath?: string, useDefaultExport?: boolean): any => {
    const module = {
      exports: {} as any,
    }
    const fullPath = resolvePath(baseDir, path.replace(/\.js$/, ''))

    let filePath
    let fileName
    let dirName
    let fn
    for (const alternative of [
      '',
      DEFAULT_EXT,
      DEFAULT_ENTRY + DEFAULT_EXT,
      DEFAULT_ENTRY,
    ]) {
      filePath = fullPath + alternative
      fn = srcCache.get(filePath)
      if (fn) {
        const pathSegs = /((?:[^/]*\/)*)(.*)/.exec(filePath) as RegExpExecArray
        dirName = pathSegs[1]
        fileName = pathSegs[2]

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
      const defaultExport = useDefaultExport && module.exports && module.exports.default
      return defaultExport == null ? module.exports : defaultExport
    }
    throw new Error(`module "${originalPath || path}" not found`)
  }
}

const requireModule = getRequire()

function nameFunction(name: string, fn: Function): Function {
  Object.defineProperty(fn, 'name', {
    value: name,
    writable: false,
  })
  return fn
}

interface PluginSetups {
  onLoad: Array<(content: string) => string>
}

interface VMFile {
  path: string
  src?: string
  url?: string
}

export default function setup(pluginSetups: PluginSetups) {
  return {
    async require(debug: boolean, files: VMFile[]) {
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

    exec(debug: boolean, path: string, ...args: any[]) {
      return new Promise((resolve, reject) => {
        try {
          const defaultExport = requireModule(getAbsolutePath(path), path, true)
          if (isFunction(defaultExport)) {
            resolve(defaultExport(...args))
          } else {
            resolve(defaultExport)
          }
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
