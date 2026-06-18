import Playground from '../components/Playground'
import CodeBlock from '../components/CodeBlock'
import ESMPlugin from 'vm-worker/esmodule'

const initialCode = `import { multiply } from './math'
import { BASE } from './config'

export default (a, b) => multiply(a, b) + BASE`

const modules = [
  { path: 'math.js', src: 'export function multiply(a, b) { return a * b }' },
  { path: 'config.js', src: 'export const BASE = 100' },
]

const exampleCode = `import VM from 'vm-worker'
import ESMPlugin from 'vm-worker/esmodule'

const vm = VM({
  plugins: [ESMPlugin()],
})

await vm.require([
  { path: 'math.js', src: 'export function multiply(a, b) { return a * b }' },
  { path: 'config.js', src: 'export const BASE = 100' },
  { path: 'index.js', src: \`import { multiply } from './math'
import { BASE } from './config'
export default (a, b) => multiply(a, b) + BASE\` },
])

await vm.exec('index.js', 5, 6) // => 130 (5*6 + 100)

vm.terminate()`

export default function ESMPluginDemo() {
  return (
    <div class="demo">
      <Playground
        initialCode={initialCode}
        modules={modules}
        args={[5, 6]}
        plugins={[ESMPlugin()]}
      />
      <CodeBlock code={exampleCode} />
    </div>
  )
}
