import { onMount } from 'solid-js'

interface CodeBlockProps {
  code: string
  lang?: string
}

export default function CodeBlock(props: CodeBlockProps) {
  let codeRef: HTMLPreElement | undefined

  onMount(() => {
    if (codeRef && (window as any).Prism) {
      (window as any).Prism.highlightElement(codeRef)
    }
  })

  return (
    <div class="code-block">
      <div class="code-block-header">
        <span class="code-block-lang">{props.lang || 'javascript'}</span>
        <button
          class="code-block-copy"
          onClick={() => {
            navigator.clipboard.writeText(props.code)
          }}
        >
          Copy
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
