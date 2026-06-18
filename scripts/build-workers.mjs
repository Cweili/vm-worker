import { build } from 'vite'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { readFileSync } from 'node:fs'
import { resolve as resolvePath, dirname as dirnamePath } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, '..')

// Inline worker URL plugin (can't import .ts from .mjs)
function workerUrlPlugin() {
  return {
    name: 'worker-url-plugin',
    resolveId(source, importer) {
      if (source.endsWith('.worker.iife.js') && importer) {
        return resolvePath(dirnamePath(importer), source)
      }
      return null
    },
    load(id) {
      if (id.endsWith('.worker.iife.js')) {
        const content = readFileSync(id, 'utf-8')
        const base64 = Buffer.from(content, 'utf-8').toString('base64')
        return `export default "data:application/javascript;base64,${base64}"`
      }
      return null
    },
  }
}

function pluginStringPlugin() {
  return {
    name: 'plugin-string-plugin',
    resolveId(source, importer) {
      if (source.endsWith('.plugin.iife.js') && importer) {
        return resolvePath(dirnamePath(importer), source)
      }
      return null
    },
    load(id) {
      if (id.endsWith('.plugin.iife.js')) {
        const content = readFileSync(id, 'utf-8')
        return `export default ${JSON.stringify(content)}`
      }
      return null
    },
  }
}

// Step 1: Build worker scripts as IIFE
const workers = [
  { entry: 'src/worker/index.ts', name: 'vm-worker.worker' },
  { entry: 'src/plugins/esmodule/worker.ts', name: 'esmodule.plugin' },
  { entry: 'src/plugins/sucrase/worker.ts', name: 'sucrase.plugin' },
]

for (const worker of workers) {
  console.log(`Building worker: ${worker.name}`)
  await build({
    root: projectRoot,
    build: {
      lib: {
        entry: resolve(projectRoot, worker.entry),
        formats: ['iife'],
        name: worker.name.replace(/-/g, '_'),
        fileName: () => `${worker.name}.iife.js`,
      },
      outDir: 'dist/workers',
      target: 'es2015',
      minify: true,
      emptyOutDir: false,
    },
  })
}
console.log('All workers built successfully!')

// Step 2: Build plugin entry points as ESM + CJS
const plugins = [
  { entry: 'src/plugins/esmodule/index.ts', name: 'esmodule' },
  { entry: 'src/plugins/sucrase/index.ts', name: 'sucrase' },
]

for (const plugin of plugins) {
  console.log(`Building plugin: ${plugin.name}`)
  await build({
    root: projectRoot,
    plugins: [workerUrlPlugin(), pluginStringPlugin()],
    build: {
      lib: {
        entry: resolve(projectRoot, plugin.entry),
        formats: ['es', 'cjs'],
        fileName: (format) => `plugins/${plugin.name}.${format === 'es' ? 'esm' : format}.js`,
      },
      outDir: 'dist',
      target: 'es2015',
      minify: false,
      emptyOutDir: false,
    },
  })
}
console.log('All plugins built successfully!')
