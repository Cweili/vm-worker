import { onMount, For } from 'solid-js'
import DemoSection from './components/DemoSection'
import BasicDemo from './demos/BasicDemo'
import ModuleDemo from './demos/ModuleDemo'
import ESMPluginDemo from './demos/ESMPluginDemo'
import SucrasePluginDemo from './demos/SucrasePluginDemo'
import ErrorDemo from './demos/ErrorDemo'

function App() {
  let heroRef: HTMLDivElement | undefined

  onMount(() => {
    // 页面加载动画
    if (heroRef) {
      heroRef.classList.add('fade-in-up')
    }
  })

  const demos = [
    { id: 'basic', title: 'Basic Usage', icon: '⚡', description: '在隔离的 Web Worker 沙箱中执行 JavaScript 模块，不影响主线程环境。', component: BasicDemo },
    { id: 'module', title: 'Module Dependencies', icon: '🔗', description: '支持模块间的 require 依赖解析，自动处理相对路径和绝对路径。', component: ModuleDemo },
    { id: 'esm', title: 'ESModule Plugin', icon: '📦', description: '通过 ESModule 插件支持 import/export 语法，享受现代模块系统。', component: ESMPluginDemo },
    { id: 'sucrase', title: 'TypeScript Support', icon: '🔷', description: '通过 Sucrase 插件支持 TypeScript、Flow 和 JSX 编译，开箱即用。', component: SucrasePluginDemo },
    { id: 'error', title: 'Error Handling', icon: '⚠️', description: '完善的错误处理机制，支持超时控制和调试模式。', component: ErrorDemo },
  ]

  return (
    <div class="app">
      {/* Hero Section */}
      <header class="hero" ref={heroRef}>
        <div class="hero-bg-gradient" />
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-dot" />
            <span>v1.2.1 · MIT License</span>
          </div>
          <h1 class="hero-title">
            <span class="hero-title-gradient">vm-worker</span>
          </h1>
          <p class="hero-description">
            Tiny virtual machine for browser to execute javascript modules in Web Worker
          </p>
          <div class="hero-actions">
            <div class="hero-install">
              <span class="hero-install-prompt">$</span>
              <code>npm i vm-worker</code>
            </div>
            <a href="https://github.com/Cweili/vm-worker" class="btn btn-primary" target="_blank" rel="noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://www.npmjs.com/package/vm-worker" class="btn btn-secondary" target="_blank" rel="noopener">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M1.763 0C.786 0 0 .786 0 1.763v20.474C0 23.214.786 24 1.763 24h20.474c.977 0 1.763-.786 1.763-1.763V1.763C24 .786 23.214 0 22.237 0zM5.13 5.323l3.618 3.239 3.254-3.239v11.39h-2.055V9.93l-1.199 1.08-1.206-1.08v6.783H5.13zm12.695 0v6.965l-2.085-1.965v6.39h-2.054V5.323l3.62 3.239z"/></svg>
              npm
            </a>
          </div>
        </div>
      </header>

      {/* Features badges */}
      <div class="features-bar">
        <div class="feature-item"><span class="feature-icon">🔒</span> Isolated Sandbox</div>
        <div class="feature-item"><span class="feature-icon">📦</span> CommonJS & ESM</div>
        <div class="feature-item"><span class="feature-icon">🔷</span> TypeScript</div>
        <div class="feature-item"><span class="feature-icon">⚡</span> Web Worker</div>
        <div class="feature-item"><span class="feature-icon">🪶</span> Tiny & Fast</div>
      </div>

      {/* Demo Sections */}
      <main class="main-content">
        <For each={demos}>
          {(demo) => (
            <DemoSection title={demo.title} icon={demo.icon} description={demo.description}>
              <demo.component />
            </DemoSection>
          )}
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
          <p class="footer-copy">Made with ❤️ by <a href="https://github.com/Cweili" target="_blank" rel="noopener">Cweili</a></p>
        </div>
      </footer>
    </div>
  )
}

export default App
