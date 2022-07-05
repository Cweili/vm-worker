import EsmodulePlugin from '../src/plugins/esmodule'

const handlers = {}
let message

global.self = {
  addEventListener(eventName, handler) {
    handlers[eventName] = handler
  },
  postMessage(msg) {
    message = msg
  },
}

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds)
  })
}

async function call(timeout, fn, ...args) {
  handlers.message({
    data: {
      id: `${Math.random()}`,
      fn,
      args,
    },
  })
  await sleep(timeout)
}

it('should execute modules', async () => {
  await import('../src/worker')
  await call(2000, 'require', [
    {
      path: 'index.js',
      url: 'https://cdn.jsdelivr.net/gh/Cweili/vm-worker@master/tests/mocks/a.js',
    },
    {
      path: 'b/b.js',
      src: 'module.exports = require("..")',
    },
    {
      path: '/c/c.js',
      src: 'module.exports = (a, b) => require("../b/b")(a, b) + require("../")(a, b)',
    },
  ])
  await call(10, 'exec', '/c/c.js', 1, 2)
  expect(message.result).toBe(6)
})

it('should handles module not exist', async () => {
  await import('../src/worker')
  await call(10, 'exec', '/d/d.js')
  expect(message.error).toBeTruthy()
})

it('should support es modules', async () => {
  await import('../src/worker')
  await call(10, 'plugin', [
    EsmodulePlugin(),
  ])
  await call(10, 'require', [
    {
      path: 'plus1.js',
      src: 'export function plus(a, b) { return a + b }',
    },
    {
      path: 'plus2.js',
      src: 'export default function (a, b) { return a + b }',
    },
    {
      path: 'plusIndex.js',
      src: 'import { plus as plus1 } from "./plus1"\nimport plus2 from "./plus2"\nexport default function (a, b) { return plus1(a, b) + plus2(a, b) }',
    },
  ])
  await call(10, 'exec', 'plusIndex.js', 1, 2)
  expect(message.result).toBe(6)
})
