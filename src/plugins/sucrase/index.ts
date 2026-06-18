import plugin from '../../../dist/workers/sucrase.plugin.iife.js'

export default function setup(options?: any): [string, any] {
  return [plugin, options]
}
