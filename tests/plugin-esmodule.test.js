import './mocks/web-workers'
import EsmodulePlugin from '../src/plugins/esmodule'

it('should replace sources', async () => {
  const VM = (await import('../src')).default

  const vm = VM({
    plugins: [
      EsmodulePlugin(),
    ],
  })

  await vm.require([
    {
      path: 'b/b.js',
      src: 'module.exports = (a, b) => (a + b)',
    },
    {
      path: '/c/c.js',
      src: 'module.exports = (a, b) => require("../b/b")(a, b)',
    },
  ])

  expect(await vm.exec('/c/c.js', 1, 2)).toBe(3)

  vm.terminate()
})
