import Playground from '../components/Playground'
import CodeBlock from '../components/CodeBlock'

const initialCode = `module.exports = (a, b) => require('../utils/math')(a, b) + require('constants')`

const modules = [
  { path: 'utils/math.js', src: 'module.exports = (a, b) => a * b' },
  { path: 'constants/index.js', src: 'module.exports = 10' },
]

const exampleCode = `import VM from 'vm-worker'

const vm = VM()

await vm.require([
  { path: 'utils/math.js', src: 'module.exports = (a, b) => a * b' },
  { path: 'constants/index.js', src: 'module.exports = 10' },
  { path: 'index.js', src: \`module.exports = (a, b) =>
    require('../utils/math')(a, b) + require('constants')\` },
])

await vm.exec('index.js', 3, 4) // => 22 (3*4 + 10)

vm.terminate()`

export default function ModuleDemo() {
  return (
    <div class="demo">
      <Playground initialCode={initialCode} modules={modules} args={[3, 4]} />
      <CodeBlock code={exampleCode} />
    </div>
  )
}
