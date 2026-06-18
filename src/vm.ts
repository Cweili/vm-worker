import workerFn from '../dist/workers/vm-worker.worker.iife.js'

interface VMOptions {
  debug?: boolean
  timeout?: number
  plugins?: any[]
}

interface VMFile {
  path: string
  src?: string
  url?: string
}

interface CallEntry {
  t: ReturnType<typeof setTimeout>
  cb: (error: any, result: any) => void
}

interface WorkerMessage {
  id: string
  error?: { name: string; message: string; stack: string }
  result?: any
}

export default class VM {
  private _c: Map<string, CallEntry> = new Map()
  private _w: Worker
  private _o: Required<VMOptions>
  private _p: Promise<any>

  constructor(options?: VMOptions) {
    const cache = this._c
    const worker = this._w = new Worker(workerFn)
    const opts = this._o = {
      debug: false,
      timeout: 100000,
      plugins: [],
      ...(options || {}),
    }
    if (!Array.isArray(opts.plugins)) {
      opts.plugins = []
    }
    worker.addEventListener('message', ({ data }: { data: WorkerMessage }) => {
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

  private _call(fn: string, ...args: any[]): Promise<any> {
    return new Promise((resolve, reject) => {
      const id = `${Date.now()}${Math.random()}`
      const cb = (error: any, result: any) => {
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

  require(files: VMFile[]): Promise<any> {
    return this._p.then(() => this._call('require', this._o.debug, files))
  }

  exec(...args: any[]): Promise<any> {
    return this._p.then(() => this._call('exec', this._o.debug, ...args))
  }

  terminate(): void {
    this._w.terminate()
  }
}
