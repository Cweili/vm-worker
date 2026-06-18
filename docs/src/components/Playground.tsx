import { createSignal, Show, JSX } from 'solid-js'
import VM from 'vm-worker'

interface VMFile {
  path: string
  src?: string
  url?: string
}

interface PlaygroundProps {
  initialCode: string
  modules?: VMFile[]
  args?: any[]
  plugins?: any[]
  children?: JSX.Element
}

export default function Playground(props: PlaygroundProps) {
  const [code, setCode] = createSignal(props.initialCode)
  const [output, setOutput] = createSignal('')
  const [error, setError] = createSignal('')
  const [running, setRunning] = createSignal(false)

  async function run() {
    setRunning(true)
    setError('')
    setOutput('')
    try {
      const vm = VM({ plugins: props.plugins })
      await vm.require([
        ...(props.modules || []),
        { path: 'index.js', src: code() }
      ])
      const result = await vm.exec('index.js', ...(props.args || []))
      setOutput(typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result))
      vm.terminate()
    } catch (err: any) {
      setError(err.message || String(err))
    } finally {
      setRunning(false)
    }
  }

  return (
    <div class="playground">
      <div class="playground-layout">
        <div class="playground-editor-section">
          <div class="playground-editor-header">
            <span class="playground-editor-label">editor</span>
          </div>
          <textarea
            class="playground-editor"
            value={code()}
            onInput={(e) => setCode(e.currentTarget.value)}
            spellcheck={false}
            rows={8}
          />
          <div class="playground-actions">
            <button
              class="run-btn"
              onClick={run}
              disabled={running()}
            >
              <Show when={running()} fallback={<>▶ Run</>}>
                <span class="loading-spinner" />
                Running...
              </Show>
            </button>
          </div>
        </div>
        <div class="playground-output-section">
          <div class="playground-output-header">
            <span class="playground-output-label">output</span>
          </div>
          <Show when={output() || error()}>
            <div class={`playground-output ${error() ? 'error' : 'success'} output-appear`}>
              <Show when={error()} fallback={<pre class="output-content">{output()}</pre>}>
                <pre class="output-content">{error()}</pre>
              </Show>
            </div>
          </Show>
          <Show when={!output() && !error()}>
            <div class="playground-output-placeholder">
              Click "Run" to execute the code
            </div>
          </Show>
        </div>
      </div>
      <Show when={props.children}>
        <div class="playground-extra">
          {props.children}
        </div>
      </Show>
    </div>
  )
}
