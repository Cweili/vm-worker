import './mocks/web-workers'

it('should execute scripts', async () => {
  const VM = (await import('../src')).default

  const vm = VM()

  await vm.require([
    {
      path: 'index.js',
      url: 'https://cdn.jsdelivr.net/gh/Cweili/vm-worker@master/tests/mocks/a.js',
      // src: 'module.exports = (a, b) => (a + b)',
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

  expect(await vm.exec('test/test', 1, 2)).toBe(6)

  vm.terminate()
})

it('should handles module not exist', async () => {
  const VM = (await import('../src')).default

  const vm = VM()

  await vm.require([
    {
      path: 'exist',
      src: 'module.exports = require("./not/exist")',
    },
  ])

  expect(vm.exec('not/exist.js')).rejects.toThrow()
  expect(vm.exec('exist.js')).rejects.toThrow()

  vm.terminate()
})

it('should throw error on timeout', async () => {
  jest.useRealTimers()
  const VM = (await import('../src')).default

  const vm = VM({ timeout: 20 })

  await vm.require([
    {
      path: 'timeout.js',
      src: 'module.exports = () => new Promise((resolve) => {})',
    },
  ])

  expect(vm.exec('timeout.js')).rejects.toThrow()
  // eslint-disable-next-line no-promise-executor-return
  await new Promise((resolve) => setTimeout(resolve, 30))

  vm.terminate()
})

it('should log debug messages', async () => {
  const VM = (await import('../src')).default

  const vm = VM({ debug: true })

  await vm.require([
    {
      path: 'debug.js',
      src: 'throw new Error()',
    },
  ])

  expect(vm.exec('debug.js')).rejects.toThrow()

  vm.terminate()
})
