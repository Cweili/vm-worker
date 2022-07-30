import plugin from '../../../dist/workers/sucrase.plugin.txt'

export default function setup(options) {
  return [plugin, options]
}
