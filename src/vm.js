/* eslint-disable import/no-unresolved, import/no-webpack-loader-syntax */
import Worker from 'worker-loader!./worker'

export default class VM {
  constructor(options) {
    const cache = this._cache = new Map()
    const worker = this._worker = new Worker()
    this.options = {
      timeout: 100000,
      ...(options || {}),
    }
    worker.addEventListener('message', ({ data }) => {
      const call = cache.get(data.id)
      if (call) {
        clearTimeout(call.t)
        call.cb(data.error, data.result)
      }
    })
  }

  _call(fn, ...args) {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}${Math.random()}`
      const cb = (error, result) => {
        if (error) {
          const err = new Error(error.name)
          err.stack = error.stack
          reject(err)
        } else {
          resolve(result)
        }
        this._cache.delete(id)
      }
      const t = setTimeout(() => {
        cb(new Error(`"${fn}" execution timeout`))
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
