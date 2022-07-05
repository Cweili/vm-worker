/* eslint-disable no-new-func */

export default function setup(pluginSetups) {
  return {
    async plugin(plugins) {
      console.log(plugins)
      plugins.forEach(([plugin, options = {}]) => {
        console.log(plugin, options);
        (new Function('plugin', plugin))({
          options,
          on(type, handler) {
            console.log(type, handler)
            pluginSetups[`on${type[0].toUpperCase()}${type.substr(1)}`].push(handler)
          },
        })
      })
    },
  }
}
