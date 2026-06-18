import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import './mocks/web-workers.js'

describe('vm-worker', () => {
  it('should execute scripts', async () => {
    global.fetch = () => Promise.resolve({
      text: () => 'module.exports = (a, b) => (a + b)',
    })

    const VM = (await import('../src/index.ts')).default

    const vm = VM()

    await vm.require([
      {
        path: 'index.js',
        url: 'https://cdn.jsdelivr.net/gh/Cweili/vm-worker@master/tests/mocks/a.js',
      },
      {
        path: 'b/index.js',
        src: 'module.exports = require("..")',
      },
      {
        path: 'c/d.js',
        src: 'module.exports = require("b")',
      },
      {
        path: 'e/f.js',
        src: 'module.exports = require("c/d")',
      },
      {
        path: 'g/index.js',
        src: 'module.exports = require("../e/f")',
      },
      {
        path: '/h/i.js',
        src: 'module.exports = require("../g")',
      },
      {
        path: '/test/test',
        src: 'module.exports = (a, b) => require("../h/i")(a, b) + require("../")(a, b)',
      },
    ])

    assert.strictEqual(await vm.exec('test/test', 1, 2), 6)

    vm.terminate()
  })

  it('should return default export when it is not a function', async () => {
    const VM = (await import('../src/index.ts')).default

    const vm = VM()

    await vm.require([
      {
        path: 'notExportFunction',
        src: 'module.exports = 1',
      },
    ])

    assert.strictEqual(await vm.exec('notExportFunction'), 1)

    vm.terminate()
  })

  it('should throw error on module not exist', async () => {
    const VM = (await import('../src/index.ts')).default

    const vm = VM()

    await vm.require([
      {
        path: 'exist',
        src: 'module.exports = require("./not/exist")',
      },
    ])

    await assert.rejects(() => vm.exec('not/exist.js'))
    await assert.rejects(() => vm.exec('exist.js'))

    vm.terminate()
  })

  it('should throw error on timeout', async () => {
    const VM = (await import('../src/index.ts')).default

    const vm = VM({ timeout: 20 })

    await vm.require([
      {
        path: 'timeout.js',
        src: 'module.exports = () => new Promise((resolve) => {})',
      },
    ])

    await assert.rejects(() => vm.exec('timeout.js'))
    await new Promise((resolve) => setTimeout(resolve, 30))

    vm.terminate()
  })

  it('should log debug messages', async () => {
    const VM = (await import('../src/index.ts')).default

    const vm = VM({ debug: true })

    await vm.require([
      {
        path: 'debug.js',
        src: 'throw new Error()',
      },
    ])

    await assert.rejects(() => vm.exec('debug.js'))

    vm.terminate()
  })
})
