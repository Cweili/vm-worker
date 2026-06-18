import Playground from '../components/Playground'
import CodeBlock from '../components/CodeBlock'
import SucrasePlugin from 'vm-worker/sucrase'

const initialCode = `import { multiply } from './math'
import { BASE } from './config'

export default function calculate(a: number, b: number): number {
  return multiply(a, b) + BASE
}`

const modules = [
  { path: 'math.js', src: 'export function multiply(a: number, b: number): number { return a * b }' },
  { path: 'config.js', src: 'export const BASE: number = 100' },
]

const exampleCode = `import VM from 'vm-worker'
import SucrasePlugin from 'vm-worker/sucrase'

const vm = VM({
  plugins: [SucrasePlugin({
    transforms: ['typescript', 'imports'],
  })],
})

await vm.require([
  { path: 'math.js', src: 'export function multiply(a: number, b: number): number { return a * b }' },
  { path: 'config.js', src: 'export const BASE: number = 100' },
  { path: 'index.js', src: \`import { multiply } from './math'
import { BASE } from './config'
export default function calculate(a: number, b: number): number {
  return multiply(a, b) + BASE
}\` },
])

await vm.exec('index.js', 5, 6) // => 130

vm.terminate()`

export default function SucrasePluginDemo() {
  return (
    <div class="demo">
      <CodeBlock code={exampleCode} lang="typescript" />
      <Playground
        initialCode={initialCode}
        modules={modules}
        args={[5, 6]}
        plugins={[SucrasePlugin({ transforms: ['typescript', 'imports'] })]}
      />
    </div>
  )
}
