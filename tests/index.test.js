/* eslint-disable class-methods-use-this */
import mitt from 'mitt'
import fetch from 'node-fetch'

const host = mitt()
const worker = mitt()

class Worker {
  addEventListener(eventName, listener) {
    host.on(eventName, listener)
  }

  postMessage(data) {
    worker.emit('message', { data })
  }

  terminate() {
  }
}

global.fetch = fetch
global.Worker = Worker
global.self = {
  addEventListener: (eventName, listener) => {
    worker.on(eventName, listener)
  },
  postMessage: (data) => {
    host.emit('message', { data })
  },
}

it('should execute modules', async () => {
  const VM = (await import('../src')).default

  const vm = VM()

  await vm.require([
    {
      path: 'a.js',
      url: 'https://cdn.jsdelivr.net/gh/Cweili/vm-worker@master/tests/mocks/a.js',
    },
    {
      path: '/b/b.js',
      src: 'module.exports = require("../a")',
    },
    {
      path: '/c/c.js',
      src: 'module.exports = (a, b) => require("../b/b")(a, b) + require("../a")(a, b)',
    },
  ])

  expect(await vm.exec('/c/c.js', 1, 2)).toBe(6)

  vm.terminate()
})

it('should handlers module not exist', async () => {
  const VM = (await import('../src')).default

  const vm = VM()

  expect(vm.exec('/d/d.js')).rejects.toThrow()

  vm.terminate()
})

it('should throw error on timeout', async () => {
  const VM = (await import('../src')).default

  const vm = VM({ timeout: 10 })

  await vm.require([
    {
      path: 'timeout.js',
      src: 'module.exports = () => new Promise((resolve) => setTimeout(resolve, 30))',
    },
  ])

  expect(vm.exec('timeout.js')).rejects.toThrow()

  vm.terminate()
})
