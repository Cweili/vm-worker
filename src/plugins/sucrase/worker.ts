/* global plugin */
declare const plugin: any

import { transform } from 'sucrase'

plugin.on('load', (content: string): string => (
  transform(content, Object.assign(
    {
      transforms: ['typescript', 'imports'],
    },
    plugin.options || {},
  ))
    .code
    .replace('exports. default', 'exports.default')
))
