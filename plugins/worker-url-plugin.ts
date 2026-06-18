import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import type { Plugin } from 'vite'

export function workerUrlPlugin(): Plugin {
  return {
    name: 'worker-url-plugin',
    resolveId(source, importer) {
      if (source.endsWith('.worker.iife.js') && importer) {
        return resolve(dirname(importer), source)
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

export function pluginStringPlugin(): Plugin {
  return {
    name: 'plugin-string-plugin',
    resolveId(source, importer) {
      if (source.endsWith('.plugin.iife.js') && importer) {
        return resolve(dirname(importer), source)
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
