/* eslint-disable no-restricted-globals */
import plugin from './plugin'
import exec from './exec'

const pluginSetups = {
  onLoad: [],
}

const fns = {
  ...plugin(pluginSetups),
  ...exec(pluginSetups),
}

self.addEventListener('message', (e) => {
  const {
    id,
    fn,
    args,
  } = e.data
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
}, false)
