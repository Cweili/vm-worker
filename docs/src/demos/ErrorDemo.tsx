import { createSignal, Show } from 'solid-js'
import VM from 'vm-worker'
import CodeBlock from '../components/CodeBlock'

const exampleCode = `import VM from 'vm-worker'

// Module not found error
const vm = VM()
await vm.require([
  { path: 'index.js', src: 'module.exports = require("./not-exist")' },
])
await vm.exec('index.js') // throws: module "./not-exist" not found

// Timeout error
const vm2 = VM({ timeout: 100 })
await vm2.require([
  { path: 'slow.js', src: 'module.exports = () => new Promise(() => {})' },
])
await vm2.exec('slow.js') // throws: exec timeout

// Debug mode
const vm3 = VM({ debug: true })
await vm3.require([
  { path: 'error.js', src: 'throw new Error("custom error")' },
])
await vm3.exec('error.js') // logs debug info + throws`

export default function ErrorDemo() {
  const [result, setResult] = createSignal('')
  const [errorType, setErrorType] = createSignal<'not-found' | 'timeout' | 'debug' | ''>('')
  const [running, setRunning] = createSignal(false)

  async function runNotFound() {
    setRunning(true)
    setResult('')
    setErrorType('not-found')
    try {
      const vm = VM()
      await vm.require([
        { path: 'index.js', src: 'module.exports = require("./not-exist")' },
      ])
      await vm.exec('index.js')
      vm.terminate()
    } catch (err: any) {
      setResult(err.message)
    } finally {
      setRunning(false)
    }
  }

  async function runTimeout() {
    setRunning(true)
    setResult('')
    setErrorType('timeout')
    try {
      const vm = VM({ timeout: 100 })
      await vm.require([
        { path: 'slow.js', src: 'module.exports = () => new Promise(() => {})' },
      ])
      await vm.exec('slow.js')
      vm.terminate()
    } catch (err: any) {
      setResult(err.message)
    } finally {
      setRunning(false)
    }
  }

  async function runDebug() {
    setRunning(true)
    setResult('')
    setErrorType('debug')
    try {
      const vm = VM({ debug: true })
      await vm.require([
        { path: 'error.js', src: 'throw new Error("custom error")' },
      ])
      await vm.exec('error.js')
      vm.terminate()
    } catch (err: any) {
      setResult(err.message)
    } finally {
      setRunning(false)
    }
  }

  return (
    <div class="demo">
      <div class="error-demo">
        <div class="error-demo-buttons">
          <button class="error-btn" onClick={runNotFound} disabled={running()}>
            Module Not Found
          </button>
          <button class="error-btn" onClick={runTimeout} disabled={running()}>
            Timeout (100ms)
          </button>
          <button class="error-btn" onClick={runDebug} disabled={running()}>
            Debug Mode
          </button>
        </div>
        <Show when={result()}>
          <div class={`playground-output error output-appear`}>
            <div class="error-demo-type">
              {errorType() === 'not-found' && '❌ Module Not Found'}
              {errorType() === 'timeout' && '⏱️ Timeout'}
              {errorType() === 'debug' && '🐛 Debug Error'}
            </div>
            <pre class="output-content">{result()}</pre>
          </div>
        </Show>
        <Show when={running()}>
          <div class="playground-output output-appear">
            <span class="loading-spinner" /> Running...
          </div>
        </Show>
      </div>
      <CodeBlock code={exampleCode} />
    </div>
  )
}
