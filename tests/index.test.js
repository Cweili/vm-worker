import './mocks/web-workers'

it('should execute modules', async () => {
  const VM = (await import('../src')).default

  const vm = VM()

  await vm.require([
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

  expect(await vm.exec('/c/c.js', 1, 2)).toBe(6)

  vm.terminate()
})

it('should handles module not exist', async () => {
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
