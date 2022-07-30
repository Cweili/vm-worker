/* global plugin */
// eslint-disable-next-line import/no-extraneous-dependencies
import { transform } from 'sucrase'

plugin.on('load', (content) => (
  transform(content, Object.assign(
    {
      transforms: ['typescript', 'imports'],
    },
    plugin.options || {},
  ))
    .code
    .replace('exports. default', 'exports.default')
))
