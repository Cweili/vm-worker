import Playground from '../components/Playground'
import CodeBlock from '../components/CodeBlock'

const initialCode = `module.exports = (a, b) => a + b`

const exampleCode = `import VM from 'vm-worker'

const vm = VM()

await vm.require([
  { path: 'index.js', src: 'module.exports = (a, b) => a + b' },
])

await vm.exec('index.js', 1, 2) // => 3

vm.terminate()`

export default function BasicDemo() {
  return (
    <div class="demo">
      <CodeBlock code={exampleCode} />
      <Playground initialCode={initialCode} args={[1, 2]} />
    </div>
  )
}
