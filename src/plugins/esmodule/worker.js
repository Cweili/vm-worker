/* global plugin */

import imports from 'rewrite-imports'

plugin.on('load', (content) => {
  const urls = []
  const mod = { exports: {} }
  const keys = []
  let key
  let result = content

    // Ensure we caught all dynamics (multi-line clause)
    .replace(/(^|\s|;)(import)(?=\()/g, '$1require')

    // Exports
    .replace(/export default/, 'module.exports =')
    .replace(/export\s+(const|function|class|let|var)\s+(.+?)(?=(\(|\s|=))/gi, (_, type, name) => keys.push(name) && (`${type} ${name}`))
    .replace(/export\s*\{([\s\S]*?)\}/gi, (_, list) => {
      const arr = list.split(',')
      let tmp
      let out = ''
      // eslint-disable-next-line no-cond-assign
      while (tmp = arr.shift()) {
        tmp = tmp.trim().split(' as ')
        out += `exports.${tmp[1] || tmp[0]} = ${tmp[0]};\n`
      }
      return out
    })

  // eslint-disable-next-line no-cond-assign
  for (keys.sort(); key = keys.shift();) {
    result += `\nexports.${key} = ${key};`
  }

  return imports(result)
})
