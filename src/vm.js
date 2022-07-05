import workerFn from '../dist/workers/vm-worker.worker.txt'

export default class VM {
  constructor(options) {
    const cache = this._cache = new Map()
    const worker = this._worker = new Worker(workerFn)
    this.options = {
      timeout: 100000,
      plugins: [],
      ...(options || {}),
    }
    worker.addEventListener('message', ({ data }) => {
      const call = cache.get(data.id)
      if (call) {
        clearTimeout(call.t)
        call.cb(data.error, data.result)
      }
    })
    this._call('plugin', this.options.plugins)
  }

  _call(fn, ...args) {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}${Math.random()}`
      const cb = (error, result) => {
        if (error) {
          const err = new Error(error.message)
          err.name = error.name
          err.stack = error.stack
          reject(err)
        } else {
          resolve(result)
        }
        this._cache.delete(id)
      }
      const t = setTimeout(() => {
        cb(new Error(`${fn} timeout`))
      }, this.options.timeout)
      this._cache.set(id, {
        t,
        cb,
      })
      this._worker.postMessage({
        id,
        fn,
        args,
      })
    })
  }

  require(files) {
    return this._call('require', files)
  }

  exec(...args) {
    return this._call('exec', ...args)
  }

  terminate() {
    this._worker.terminate()
  }
}
