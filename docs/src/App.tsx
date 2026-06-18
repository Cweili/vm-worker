import { onMount, For } from 'solid-js'
import DemoSection from './components/DemoSection'
import BasicDemo from './demos/BasicDemo'
import ModuleDemo from './demos/ModuleDemo'
import ESMPluginDemo from './demos/ESMPluginDemo'
import SucrasePluginDemo from './demos/SucrasePluginDemo'
import ErrorDemo from './demos/ErrorDemo'
import { useI18n } from './i18n'
import { version } from '../../package.json'

const i18n = {
  en: {
    description: 'Tiny virtual machine for browser to execute javascript modules in Web Worker',
    install: 'npm i vm-worker',
    features: [
      { icon: '🔒', text: 'Isolated Sandbox' },
      { icon: '📦', text: 'CommonJS & ESM' },
      { icon: '🔷', text: 'TypeScript' },
      { icon: '⚡', text: 'Web Worker' },
      { icon: '🪶', text: 'Tiny & Fast' },
    ],
    demos: [
      { id: 'basic', title: 'Basic Usage', icon: '⚡', description: 'Execute JavaScript modules in an isolated Web Worker sandbox without affecting the main thread.' },
      { id: 'module', title: 'Module Dependencies', icon: '🔗', description: 'Support require dependency resolution between modules, automatically handling relative and absolute paths.' },
      { id: 'esm', title: 'ESModule Plugin', icon: '📦', description: 'Support import/export syntax via the ESModule plugin, enjoying the modern module system.' },
      { id: 'sucrase', title: 'TypeScript Support', icon: '🔷', description: 'Support TypeScript, Flow and JSX compilation via the Sucrase plugin, ready to use out of the box.' },
      { id: 'error', title: 'Error Handling', icon: '⚠️', description: 'Comprehensive error handling with timeout control and debug mode.' },
    ],
    langSwitch: '中文',
    madeBy: 'Made with ❤️ by',
  },
  zh: {
    description: '轻量级浏览器虚拟机，在 Web Worker 中执行 JavaScript 模块',
    install: 'npm i vm-worker',
    features: [
      { icon: '🔒', text: '隔离沙箱' },
      { icon: '📦', text: 'CommonJS & ESM' },
      { icon: '🔷', text: 'TypeScript' },
      { icon: '⚡', text: 'Web Worker' },
      { icon: '🪶', text: '轻量快速' },
    ],
    demos: [
      { id: 'basic', title: '基础用法', icon: '⚡', description: '在隔离的 Web Worker 沙箱中执行 JavaScript 模块，不影响主线程环境。' },
      { id: 'module', title: '模块依赖', icon: '🔗', description: '支持模块间的 require 依赖解析，自动处理相对路径和绝对路径。' },
      { id: 'esm', title: 'ESModule 插件', icon: '📦', description: '通过 ESModule 插件支持 import/export 语法，享受现代模块系统。' },
      { id: 'sucrase', title: 'TypeScript 支持', icon: '🔷', description: '通过 Sucrase 插件支持 TypeScript、Flow 和 JSX 编译，开箱即用。' },
      { id: 'error', title: '错误处理', icon: '⚠️', description: '完善的错误处理机制，支持超时控制和调试模式。' },
    ],
    langSwitch: 'EN',
    madeBy: '由 ❤️ 制作',
  },
} as const

function App() {
  let heroRef: HTMLDivElement | undefined
  const { lang, setLang } = useI18n()

  const t = () => i18n[lang()]

  onMount(() => {
    if (heroRef) {
      heroRef.classList.add('fade-in-up')
    }
  })

  const demoComponents: Record<string, any> = {
    basic: BasicDemo,
    module: ModuleDemo,
    esm: ESMPluginDemo,
    sucrase: SucrasePluginDemo,
    error: ErrorDemo,
  }

  return (
    <div class="app">
      {/* Language Switch */}
      <button
        class="lang-switch"
        onClick={() => setLang(lang() === 'en' ? 'zh' : 'en')}
      >
        {t().langSwitch}
      </button>

      {/* Hero Section */}
      <header class="hero" ref={heroRef}>
        <div class="hero-bg-gradient" />
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-dot" />
            <span>v{version} · MIT License</span>
          </div>
          <h1 class="hero-title">
            <span class="hero-title-gradient">vm-worker</span>
          </h1>
          <p class="hero-description">
            {t().description}
          </p>
          <div class="hero-actions">
            <div class="hero-install">
              <span class="hero-install-prompt">$</span>
              <code>{t().install}</code>
            </div>
            <a href="https://github.com/Cweili/vm-worker" class="btn btn-primary" target="_blank" rel="noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/vm-worker" class="btn btn-secondary" target="_blank" rel="noopener">
              <svg width="20" height="8" viewBox="0 0 18 7" fill="currentColor"><path d="M0 0h18v6H9v1H5V6H0V0zm1 5h2V2h1v3h1V1H1v4zm5-4v5h2V5h2V1H6zm2 1h1v2H8V2zm3-1v4h2V2h1v3h1V2h1v3h1V1h-5z"/></svg>
              npm
            </a>
          </div>
        </div>
      </header>

      {/* Features badges */}
      <div class="features-bar">
        <For each={t().features}>
          {(feature) => (
            <div class="feature-item">
              <span class="feature-icon">{feature.icon}</span> {feature.text}
            </div>
          )}
        </For>
      </div>

      {/* Demo Sections */}
      <main class="main-content">
        <For each={t().demos}>
          {(demo) => {
            const Component = demoComponents[demo.id]
            return (
              <DemoSection title={demo.title} icon={demo.icon} description={demo.description}>
                {Component && <Component />}
              </DemoSection>
            )
          }}
        </For>
      </main>

      {/* Footer */}
      <footer class="footer">
        <div class="footer-content">
          <div class="footer-links">
            <a href="https://github.com/Cweili/vm-worker" target="_blank" rel="noopener">GitHub</a>
            <span class="footer-divider">·</span>
            <a href="https://www.npmjs.com/package/vm-worker" target="_blank" rel="noopener">npm</a>
            <span class="footer-divider">·</span>
            <a href="https://github.com/Cweili/vm-worker/blob/master/LICENSE" target="_blank" rel="noopener">MIT License</a>
          </div>
          <p class="footer-copy">{t().madeBy} <a href="https://github.com/Cweili" target="_blank" rel="noopener">Cweili</a></p>
        </div>
      </footer>
    </div>
  )
}

export default App
