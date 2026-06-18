import plugin from '../../../dist/workers/esmodule.plugin.iife.js'

export default function setup(options?: any): [string, any] {
  return [plugin, options]
}
