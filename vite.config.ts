import { defineConfig } from 'vite'
import { resolve } from 'path'
import { workerUrlPlugin, pluginStringPlugin } from './plugins/worker-url-plugin'

export default defineConfig({
  plugins: [workerUrlPlugin(), pluginStringPlugin()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs', 'umd'],
      name: 'VmWorker',
      fileName: (format) => ({
        es: 'vm-worker.esm.js',
        cjs: 'vm-worker.cjs.js',
        umd: 'vm-worker.js',
      }[format] as string),
    },
    outDir: 'dist',
    target: 'es2015',
    minify: false,
    emptyOutDir: false,
  },
})
