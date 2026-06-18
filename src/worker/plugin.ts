interface PluginSetups {
  [key: string]: Array<(content: string) => string>
}

export default function setup(pluginSetups: PluginSetups) {
  return {
    async plugin(plugins: [string, any][]) {
      plugins.forEach(([plugin, options = {}]) => {
        (new Function('plugin', plugin))({
          options,
          on(type: string, handler: (content: string) => string) {
            const key = `on${type[0].toUpperCase()}${type.slice(1)}`
            if (!pluginSetups[key]) {
              pluginSetups[key] = []
            }
            pluginSetups[key].push(handler)
          },
        })
      })
    },
  }
}
