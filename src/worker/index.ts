import plugin from './plugin'
import exec from './exec'

const pluginSetups = {
  onLoad: [] as Array<(content: string) => string>,
}

const fns = Object.assign(
  {},
  plugin(pluginSetups),
  exec(pluginSetups),
)

self.addEventListener('message', (e: MessageEvent) => {
  const {
    id,
    fn,
    args,
  } = e.data as { id: string; fn: string; args: any[] }
  ;(fns as any)[fn](...args).then((result: any) => {
    ;(self as any).postMessage({
      id,
      result,
    })
  }).catch((error: Error) => {
    ;(self as any).postMessage({
      id,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
      },
    })
  })
}, false)
