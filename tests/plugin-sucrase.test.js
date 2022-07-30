import './mocks/web-workers'
import SucrasePlugin from '../src/plugins/sucrase'

it('should support typescript', async () => {
  const VM = (await import('../src')).default

  const vm = VM({
    plugins: [
      SucrasePlugin(),
    ],
  })

  await vm.require([
    {
      path: 'ts1.js',
      src: 'export function plus(a: number, b: number) { return a + b }',
    },
    {
      path: 'ts2.js',
      src: 'export default function (a: number, b: number) { return a + b }',
    },
    {
      path: 'index.js',
      src: `import { plus as plus1 } from "./ts1"
import plus2 from "./ts2"
export const a = 1
export function b() {}
export default function (a: number, b: number) { return plus1(a, b) + plus2(a, b) }
`,
    },
  ])

  expect(await vm.exec('index.js', 1, 2)).toBe(6)

  vm.terminate()
})
