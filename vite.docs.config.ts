import { defineConfig } from 'vite'
import solidPlugin from 'vite-plugin-solid'
import { resolve } from 'path'
import { workerUrlPlugin, pluginStringPlugin } from './plugins/worker-url-plugin'

export default defineConfig({
  plugins: [solidPlugin(), workerUrlPlugin(), pluginStringPlugin()],
  root: resolve(__dirname, 'docs'),
  base: '/vm-worker/',
  build: {
    outDir: resolve(__dirname, 'docs/dist'),
  },
  resolve: {
    alias: [
      { find: /^vm-worker\/esmodule$/, replacement: resolve(__dirname, 'src/plugins/esmodule/index.ts') },
      { find: /^vm-worker\/sucrase$/, replacement: resolve(__dirname, 'src/plugins/sucrase/index.ts') },
      { find: /^vm-worker$/, replacement: resolve(__dirname, 'src/index.ts') },
    ],
  },
})
