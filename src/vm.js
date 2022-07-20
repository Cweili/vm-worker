import workerFn from '../dist/workers/vm-worker.worker.txt'

export default class VM {
  constructor(options) {
    const cache = this._c = new Map()
    const worker = this._w = new Worker(workerFn)
    const opts = this._o = {
      debug: false,
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
    this._p = opts.plugins.length
      ? this._call('plugin', opts.plugins)
      : Promise.resolve()
  }

  _call(fn, ...args) {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}${Math.random()}`
      const cb = (error, result) => {
        if (error) {
          const err = new Error(error.message)
          err.name = error.name
          err.stack = error.stack.replace(/data:\S+?:\d+:\d+/g, `vm-worker:${fn}`)
          reject(err)
        } else {
          resolve(result)
        }
        this._c.delete(id)
      }
      const t = setTimeout(() => {
        cb(new Error(`${fn} timeout`))
      }, this._o.timeout)
      this._c.set(id, {
        t,
        cb,
      })
      this._w.postMessage({
        id,
        fn,
        args,
      })
    })
  }

  require(files) {
    return this._p.then(() => this._call('require', this._o.debug, files))
  }

  exec(...args) {
    return this._p.then(() => this._call('exec', this._o.debug, ...args))
  }

  terminate() {
    this._w.terminate()
  }
}
