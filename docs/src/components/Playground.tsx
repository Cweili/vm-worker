import { createSignal, Show, JSX } from 'solid-js'
import VM from 'vm-worker'
import { useI18n } from '../i18n'

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

const labels = {
  en: { run: '▶ Run', running: 'Running...', clickToRun: 'Click "Run" to execute the code', editor: 'editor', output: 'output' },
  zh: { run: '▶ 运行', running: '运行中...', clickToRun: '点击"运行"执行代码', editor: '编辑器', output: '输出' },
}

export default function Playground(props: PlaygroundProps) {
  const [code, setCode] = createSignal(props.initialCode)
  const [output, setOutput] = createSignal('')
  const [error, setError] = createSignal('')
  const [running, setRunning] = createSignal(false)
  const { lang } = useI18n()

  const l = () => labels[lang()]

  async function run() {
    setRunning(true)
    setError('')
    setOutput('')
    try {
      const vm = VM(props.plugins?.length ? { plugins: props.plugins } : {})
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
            <span class="playground-editor-label">{l().editor}</span>
          </div>
          <textarea
            class="playground-editor"
            value={code()}
            onInput={(e) => setCode(e.currentTarget.value)}
            spellcheck={false}
          />
          <div class="playground-actions">
            <button
              class="run-btn"
              onClick={run}
              disabled={running()}
            >
              <Show when={running()} fallback={<>{l().run}</>}>
                <span class="loading-spinner" />
                {l().running}
              </Show>
            </button>
          </div>
        </div>
        <div class="playground-output-section">
          <div class="playground-output-header">
            <span class="playground-output-label">{l().output}</span>
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
              {l().clickToRun}
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
