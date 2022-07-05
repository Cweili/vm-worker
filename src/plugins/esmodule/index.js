import plugin from '../../../dist/workers/esmodule.plugin.worker.txt'

export default function setup(options) {
  return [plugin, options]
}
