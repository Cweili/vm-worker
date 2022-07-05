import './mocks/web-workers'
import EsmodulePlugin from '../src/plugins/esmodule'

it('should support es modules', async () => {
  const VM = (await import('../src')).default

  const vm = VM({
    plugins: [
      EsmodulePlugin(),
    ],
  })

  await vm.require([
    {
      path: 'plus1.js',
      src: 'export function plus(a, b) { return a + b }',
    },
    {
      path: 'plus2.js',
      src: 'export default function (a, b) { return a + b }',
    },
    {
      path: 'index.js',
      src: 'import { plus as plus1 } from "./plus1"\nimport plus2 from "./plus2"\nexport default function (a, b) { return plus1(a, b) + plus2(a, b) }',
    },
  ])

  expect(await vm.exec('index.js', 1, 2)).toBe(6)

  vm.terminate()
})
