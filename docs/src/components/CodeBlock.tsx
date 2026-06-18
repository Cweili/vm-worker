import { onMount, createSignal, Show } from 'solid-js'

interface CodeBlockProps {
  code: string
  lang?: string
}

export default function CodeBlock(props: CodeBlockProps) {
  let codeRef: HTMLPreElement | undefined
  const [copied, setCopied] = createSignal(false)

  onMount(() => {
    if (codeRef && (window as any).Prism) {
      (window as any).Prism.highlightElement(codeRef)
    }
  })

  function handleCopy() {
    navigator.clipboard.writeText(props.code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div class="code-block">
      <div class="code-block-header">
        <span class="code-block-lang">{props.lang || 'javascript'}</span>
        <button
          class={`code-block-copy ${copied() ? 'copied' : ''}`}
          onClick={handleCopy}
          title="Copy"
        >
          <Show when={copied()} fallback={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          }>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </Show>
        </button>
      </div>
      <pre class="code-block-pre">
        <code
          ref={codeRef}
          class={`language-${props.lang || 'javascript'}`}
        >
          {props.code}
        </code>
      </pre>
    </div>
  )
}
